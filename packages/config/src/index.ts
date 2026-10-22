import { OffersCatalogSchema, type OffersCatalog } from '@la/contracts';
import fallback from './offers.fallback.json';

export * from './sites';
export * from './countries';

/** Catálogo de respaldo si Supabase no responde. Validado al importar: si no cuadra con el contrato, peta el build. */
export const FALLBACK_CATALOG: OffersCatalog = OffersCatalogSchema.parse(fallback);

/** Tag de caché de Next para el catálogo de ofertas. El admin llama a revalidateTag(OFFERS_CACHE_TAG) al guardar. */
export const OFFERS_CACHE_TAG = 'landings-offers';
