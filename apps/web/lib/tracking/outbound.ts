import 'server-only';
// [A4] Lógica común de /go/[offerId] y del botón "probar enlace" del panel (dry-run): misma resolución, misma URL.
import { PlacementSchema, type Offer, type Placement } from '@la/contracts';
import { getCatalog } from '@/lib/landing/catalog';
import { isPublishable } from '@/lib/compliance';
import { cleanSrc, cleanUtm, isOwnHost } from './request';

export type ResolveResult =
  | { kind: 'ok'; offer: Offer; operatorName: string }
  | { kind: 'not_found' }
  | { kind: 'unavailable'; offer: Offer; reason: 'inactive' | 'expired' | 'not_started' | 'bad_template' | 'not_publishable' | 'unlicensed' };

export async function resolveOffer(offerId: string): Promise<ResolveResult> {
  const { catalog } = await getCatalog();
  const offer = catalog.offers.find((o) => o.id === offerId);
  if (!offer) return { kind: 'not_found' };
  const op = catalog.operators.find((o) => o.id === offer.operatorId);
  if (!offer.active || !op) return { kind: 'unavailable', offer, reason: 'inactive' };
  // Mismas reglas que la landing (§6.1.3): gate P9 del mercado y licencia del operador en ese país.
  if (!isPublishable(offer.country)) return { kind: 'unavailable', offer, reason: 'not_publishable' };
  if (!op.licenseByCountry[offer.country]) return { kind: 'unavailable', offer, reason: 'unlicensed' };
  const now = Date.now();
  if (offer.validFrom && Date.parse(offer.validFrom) > now) return { kind: 'unavailable', offer, reason: 'not_started' };
  if (offer.validTo && Date.parse(offer.validTo) <= now) return { kind: 'unavailable', offer, reason: 'expired' };
  if (!/^https:\/\//i.test(offer.affiliateUrlTemplate) || !offer.affiliateUrlTemplate.includes('{click_id}')) {
    return { kind: 'unavailable', offer, reason: 'bad_template' };
  }
  return { kind: 'ok', offer, operatorName: op.name };
}

/** Sustituye {click_id} en la plantilla del operador. */
export function buildAffiliateUrl(template: string, clickId: string): string {
  return template.replaceAll('{click_id}', encodeURIComponent(clickId));
}

export function parsePlacement(v: string | null): Placement | '' {
  const p = PlacementSchema.safeParse(v);
  return p.success ? p.data : '';
}

/**
 * Atribución sin cookies: el CTA está en la landing, así que el Referer (mismo origen → URL completa con
 * la política por defecto strict-origin-when-cross-origin) trae `?src=` y las `utm_*` de la visita.
 */
export function attributionFromReferer(referer: string | null, reqHost = ''): { src: string; utm: Record<string, string> | null } {
  if (!referer) return { src: '', utm: null };
  try {
    const u = new URL(referer);
    if (u.host !== reqHost && !isOwnHost(u.host)) return { src: '', utm: null };
    return { src: cleanSrc(u.searchParams.get('src')), utm: cleanUtm(u.searchParams) };
  } catch {
    return { src: '', utm: null };
  }
}
