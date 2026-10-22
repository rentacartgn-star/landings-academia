import 'server-only';
// [A1] Construye LandingProps para (sitio, país, variante, país detectado). Catálogo: BD con caché por tag → fallback JSON.
import { layoutFor, type Country, type LandingProps, type Operator, type SiteId } from '@la/contracts';
import { SITES, localeFor } from '@la/config';
import { getContent } from '@/content';
import { getCompliance } from '@/lib/compliance';
import { getCatalog, type CatalogSource } from './catalog';
import { countriesWithOffers, selectOffers } from './offers';
import type { Variant } from './routing';

export async function loadLanding(
  siteId: SiteId,
  country: Country,
  detectedCountry: Country = country,
  variant: Variant = 0,
): Promise<{ props: LandingProps; source: CatalogSource }> {
  const site = SITES[siteId];
  const locale = localeFor(country);
  const { catalog, source } = await getCatalog();
  const operators: Record<string, Operator> = Object.fromEntries(catalog.operators.map((o) => [o.id, o]));
  const compliance = getCompliance(country, locale);
  const now = Date.now();
  // Gate P9 (A5): mercado no publicable → 0 ofertas → layout fallback.
  const offers = compliance.publishable ? selectOffers(catalog, operators, siteId, country, now) : [];
  // Solo los operadores que se pintan (menos peso en el payload RSC).
  const usedOperators = Object.fromEntries(offers.map((o) => [o.operatorId, operators[o.operatorId]!]));
  const props: LandingProps = {
    site,
    country,
    detectedCountry,
    locale,
    offers,
    operators: usedOperators,
    layout: layoutFor(offers),
    content: getContent(siteId, locale),
    compliance,
    variant,
    availableCountries: countriesWithOffers(catalog, operators, siteId, now),
  };
  return { props, source };
}

export async function getLandingProps(
  siteId: SiteId,
  country: Country,
  detectedCountry: Country = country,
  variant: Variant = 0,
): Promise<LandingProps> {
  return (await loadLanding(siteId, country, detectedCountry, variant)).props;
}
