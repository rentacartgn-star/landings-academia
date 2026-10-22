import 'server-only';
// [A4] Lectura del catálogo (operadores + ofertas) desde Supabase, schema `landings`, vía RPC public.landings_catalog()
// (SECURITY DEFINER, execute solo service_role). Contrato con A1 (lib/landing/catalog.ts):
//  · null  → BD sin configurar (sin env): A1 usa el FALLBACK_CATALOG.
//  · throw → la BD ha fallado: unstable_cache no guarda el error y sigue sirviendo el último catálogo bueno.
// Las fechas validFrom/validTo salen ya en ISO con `Z` (to_char en SQL) para cumplir z.string().datetime().
import type { OffersCatalog } from '@la/contracts';
import { serviceClient } from './supabase';

export async function fetchCatalogFromDb(): Promise<OffersCatalog | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db.rpc('landings_catalog');
  if (error) throw new Error(`landings_catalog: ${error.message}`);
  if (!data || typeof data !== 'object') throw new Error('landings_catalog: respuesta vacía');
  return data as OffersCatalog; // A1 lo valida con zod (sanitize)
}
