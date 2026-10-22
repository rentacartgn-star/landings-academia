// [A1] Forma de la ruta interna de la landing. Edge-safe: lo importan el middleware y la página.
// Ruta: /_s/<site>/<country>/<variant>/<detected>  →  una entrada de caché ISR por combinación.
import type { Country, SiteId } from '@la/contracts';
import { SITES } from '@la/config/sites';
import { parseCountry, isNamedCountry, UNKNOWN_COUNTRY } from '@la/config/countries';

/** Cookie del selector manual de país (la escribe components/ui/CountrySwitcher). */
export const COUNTRY_COOKIE = 'lp_country';
/** Cookie de la variante A/B asignada. */
export const VARIANT_COOKIE = 'lp_v';
export const VARIANT_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 días: dura el test, no la vida

export const VARIANTS = [0, 1, 2] as const;
export type Variant = (typeof VARIANTS)[number];

export function parseVariant(raw: string | null | undefined): Variant | null {
  return raw === '0' ? 0 : raw === '1' ? 1 : raw === '2' ? 2 : null;
}

/**
 * Segmento `detected` acotado: si coincide con el país mostrado, es el mismo; si no, solo distinguimos
 * los países con nombre en el selector (COUNTRY_NAMES) y el resto cae a `XX`. Así la caché crece como
 * mucho ×21 y solo para quien tiene la cookie `lp_country` distinta de su IP.
 */
export function bucketDetected(country: Country, detected: Country): Country {
  if (detected === country) return country;
  return isNamedCountry(detected) ? detected : UNKNOWN_COUNTRY;
}

export interface LandingRoute {
  site: SiteId;
  country: Country;
  variant: Variant;
  detected: Country;
}

export function landingPath(r: LandingRoute): string {
  return `/_s/${r.site}/${r.country}/${r.variant}/${bucketDetected(r.country, r.detected)}`;
}

/** Valida los params de la ruta. `null` → 404. */
export function parseLandingRoute(p: { site: string; country: string; variant: string; detected: string }): LandingRoute | null {
  const site = p.site in SITES ? (p.site as SiteId) : null;
  const country = p.country === p.country.toUpperCase() ? parseCountry(p.country) : null;
  const detected = p.detected === p.detected.toUpperCase() ? parseCountry(p.detected) : null;
  const variant = parseVariant(p.variant);
  if (!site || !country || !detected || variant === null) return null;
  // Rechaza combinaciones que el middleware nunca genera (evita llenar la caché a mano).
  if (bucketDetected(country, detected) !== detected) return null;
  return { site, country, variant, detected };
}
