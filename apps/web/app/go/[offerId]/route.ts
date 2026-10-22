// [A4] Redirect trackeado. Todo CTA saliente pasa por aquí (funciona sin JS):
// valida la oferta → genera click_id (uuid) → 302 a la plantilla con {click_id} → registra `outbound` con after()
// (el 302 sale sin esperar a la BD). Bots, previsualizaciones y prefetch se redirigen igual pero no se cuentan.
import { after } from 'next/server';
import { buildAffiliateUrl, parsePlacement, resolveOffer, attributionFromReferer } from '@/lib/tracking/outbound';
import { insertEvents } from '@/lib/tracking/ingest';
import { deviceOf, dropReason, geoCountry, gpc, inAppOf, visitorHash } from '@/lib/tracking/request';
import { localeFor } from '@la/config';

export const dynamic = 'force-dynamic';

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'X-Robots-Tag': 'noindex, nofollow',
  // Al operador le llega solo nuestro origen, nunca la URL con src/utm.
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

async function handle(req: Request, offerId: string, record: boolean): Promise<Response> {
  const res = await resolveOffer(offerId);
  if (res.kind === 'not_found') {
    return new Response('Oferta no encontrada', { status: 404, headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  if (res.kind === 'unavailable') {
    // Oferta pausada o caducada: de vuelta a la landing, nunca a un enlace de otro mercado.
    return new Response(null, { status: 302, headers: { ...NO_STORE, Location: '/', 'X-LP-Tracked': `0;${res.reason}` } });
  }

  const { offer } = res;
  const clickId = crypto.randomUUID();
  const location = buildAffiliateUrl(offer.affiliateUrlTemplate, clickId);
  const h = req.headers;
  const url = new URL(req.url);
  const drop = record ? dropReason(h) : 'prefetch';

  if (!drop) {
    const noId = gpc(h);
    const { src, utm } = attributionFromReferer(h.get('referer'), h.get('host') ?? url.host);
    const row = {
      name: 'outbound' as const,
      site_id: offer.siteId,
      country: offer.country,
      geo_country: geoCountry(h),
      locale: localeFor(offer.country),
      path: `/go/${offer.id}`,
      visitor_hash: visitorHash(h), // null con GPC
      src,
      utm,
      device: deviceOf(h),
      in_app: inAppOf(h),
      offer_id: offer.id,
      operator_id: offer.operatorId,
      rank: offer.rank,
      placement: parsePlacement(url.searchParams.get('p')),
      click_id: clickId,
      props: noId ? { gpc: true } : null,
    };
    after(() => insertEvents([row]));
  }

  return new Response(null, {
    status: 302,
    headers: { ...NO_STORE, Location: location, 'X-LP-Tracked': drop ? `0;${drop}` : '1', 'X-LP-Click-Id': clickId },
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await ctx.params;
  return handle(req, offerId, true);
}

// Los fetchers de previsualización suelen usar HEAD: se responde igual y no se registra.
export async function HEAD(req: Request, ctx: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await ctx.params;
  return handle(req, offerId, false);
}
