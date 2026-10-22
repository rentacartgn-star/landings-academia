// [A1] Reglas de §6.1.3: qué ofertas se ven en (sitio, país). Puro y sin dependencias de Next (testeable).
import type { Country, Offer, OffersCatalog, Operator, SiteId } from '@la/contracts';

export const MAX_OFFERS = 4;

function inWindow(o: Offer, now: number): boolean {
  return (!o.validFrom || Date.parse(o.validFrom) <= now) && (!o.validTo || Date.parse(o.validTo) > now);
}

/** Activa, del sitio y país, en fecha y con operador existente con licencia en ese país. */
export function isVisible(o: Offer, siteId: SiteId, country: Country, operators: Record<string, Operator>, now: number): boolean {
  return (
    o.active &&
    o.siteId === siteId &&
    o.country === country &&
    !!operators[o.operatorId]?.licenseByCountry[country]?.trim() &&
    inWindow(o, now)
  );
}

/** Máx. 4, ordenadas por rank (empate → id) y sin repetir operador. */
export function selectOffers(catalog: OffersCatalog, operators: Record<string, Operator>, siteId: SiteId, country: Country, now: number): Offer[] {
  const seen = new Set<string>();
  return catalog.offers
    .filter((o) => isVisible(o, siteId, country, operators, now))
    .sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id))
    .filter((o) => !seen.has(o.operatorId) && !!seen.add(o.operatorId))
    .slice(0, MAX_OFFERS);
}

/** Países donde este sitio tiene al menos una oferta visible ahora (para el selector). */
export function countriesWithOffers(catalog: OffersCatalog, operators: Record<string, Operator>, siteId: SiteId, now: number): Country[] {
  const set = new Set<Country>();
  for (const o of catalog.offers) if (isVisible(o, siteId, o.country, operators, now)) set.add(o.country);
  return [...set].sort();
}
