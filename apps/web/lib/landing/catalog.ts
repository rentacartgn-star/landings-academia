import 'server-only';
// [A1] Catálogo de ofertas: Supabase (A4) con caché de Next por tag + revalidate de seguridad, y fallback JSON.
// Garantía: nunca lanza. Si la BD devuelve null, falla, tarda o trae datos que no cumplen el contrato → FALLBACK_CATALOG.
import { unstable_cache } from 'next/cache';
import { OfferSchema, OffersCatalogSchema, OperatorSchema, type OffersCatalog } from '@la/contracts';
import { FALLBACK_CATALOG, OFFERS_CACHE_TAG } from '@la/config';
import { fetchCatalogFromDb } from '@/lib/data/catalog-db';

/** Revalidate de seguridad (s) por si un revalidateTag no llega. Debe coincidir con `revalidate` de la página. */
export const CATALOG_REVALIDATE_S = 60;
const DB_TIMEOUT_MS = 2500;

export type CatalogSource = 'db' | 'fallback';
export interface CatalogResult {
  catalog: OffersCatalog;
  source: CatalogSource;
}

/** Valida contra el contrato. Si el conjunto no cuadra, se quedan las filas válidas (una fila rota no tumba un país). */
function sanitize(raw: unknown): OffersCatalog | null {
  const whole = OffersCatalogSchema.safeParse(raw);
  if (whole.success) return whole.data;
  const r = (raw ?? {}) as { operators?: unknown[]; offers?: unknown[] };
  if (!Array.isArray(r.operators) || !Array.isArray(r.offers)) return null;
  const operators = r.operators.flatMap((o) => {
    const p = OperatorSchema.safeParse(o);
    return p.success ? [p.data] : [];
  });
  const offers = r.offers.flatMap((o) => {
    const p = OfferSchema.safeParse(o);
    return p.success ? [p.data] : [];
  });
  console.error(`[landing] catálogo de BD con filas inválidas: descartadas ${r.operators.length - operators.length} operadores y ${r.offers.length - offers.length} ofertas`);
  return { operators, offers };
}

async function fetchDbWithTimeout(): Promise<OffersCatalog | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout ${DB_TIMEOUT_MS} ms`)), DB_TIMEOUT_MS);
  });
  try {
    const raw = await Promise.race([fetchCatalogFromDb(), timeout]);
    return raw ? sanitize(raw) : null;
  } finally {
    clearTimeout(timer);
  }
}

// Lanzar dentro de unstable_cache = no se cachea y, si había una versión buena anterior, Next sigue sirviéndola.
// `null` (BD sin configurar) sí se cachea los 60 s para no consultar en cada render.
const cachedDbCatalog = unstable_cache(fetchDbWithTimeout, ['landings-catalog-v1'], {
  tags: [OFFERS_CACHE_TAG],
  revalidate: CATALOG_REVALIDATE_S,
});

export async function getCatalog(): Promise<CatalogResult> {
  try {
    const db = await cachedDbCatalog();
    if (db) return { catalog: db, source: 'db' };
  } catch (err) {
    console.error('[landing] catálogo de BD no disponible, uso el fallback:', err instanceof Error ? err.message : err);
  }
  return { catalog: FALLBACK_CATALOG, source: 'fallback' };
}
