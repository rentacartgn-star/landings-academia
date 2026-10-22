// [A4] Ingesta de beacons del cliente (BeaconEnvelope). Responde 204 al momento y escribe con after().
// GET = píxel <noscript> de respaldo para el pageview sin JS: /api/e?s=<site>&c=<country>&l=<locale>&v=<variant>
import { after } from 'next/server';
import { BeaconEnvelopeSchema, CountrySchema, LocaleSchema, SiteIdSchema, type ClientEvent } from '@la/contracts';
import { getCatalog } from '@/lib/landing/catalog';
import { insertEvents, type EventRow } from '@/lib/tracking/ingest';
import {
  cleanSrc, cleanUtm, deviceOf, dropReason, geoCountry, gpc, inAppOf, isOwnHost, referrerHost, visitorHash,
} from '@/lib/tracking/request';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 32 * 1024;
const NO_STORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
const empty = (tracked: string, status = 204) => new Response(null, { status, headers: { ...NO_STORE, 'X-LP-Tracked': tracked } });

/** Origen del beacon: mismo host o uno de nuestros dominios. Corta el spam trivial desde otras webs. */
function originOk(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return req.headers.get('sec-fetch-site') !== 'cross-site';
  try {
    const host = new URL(origin).host;
    return host === req.headers.get('host') || isOwnHost(host);
  } catch {
    return false;
  }
}

function cleanPath(p: string): string {
  return p.split('?')[0]!.split('#')[0]!.slice(0, 200) || '/';
}

export async function POST(req: Request) {
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BYTES) return empty('0;too_large', 413);
  if (!originOk(req)) return empty('0;origin', 403);
  const drop = dropReason(req.headers);
  if (drop) return empty(`0;${drop}`);

  let body: unknown;
  try {
    const text = await req.text(); // sendBeacon manda text/plain para evitar preflight
    if (text.length > MAX_BYTES) return empty('0;too_large', 413);
    body = JSON.parse(text);
  } catch {
    return empty('0;bad_json', 400);
  }
  const parsed = BeaconEnvelopeSchema.safeParse(body);
  if (!parsed.success) return empty('0;invalid', 400);
  const env = parsed.data;

  const h = req.headers;
  const noId = gpc(h);
  const base = {
    site_id: env.site,
    country: env.country,
    geo_country: geoCountry(h),
    locale: env.locale,
    variant: env.variant,
    path: cleanPath(env.path),
    visitor_hash: visitorHash(h),
    src: cleanSrc(env.src),
    utm: cleanUtm(env.utm),
    device: deviceOf(h),
    in_app: inAppOf(h),
  };

  after(async () => {
    // operator_id de las ofertas para poder agregar por operador sin joins.
    let opOf = new Map<string, string>();
    try {
      const { catalog } = await getCatalog();
      opOf = new Map(catalog.offers.map((o) => [o.id, o.operatorId]));
    } catch {
      /* sin catálogo: operator_id null */
    }
    const rows: EventRow[] = env.events.map((e: ClientEvent) => {
      const row: EventRow = { ...base, name: e.name };
      switch (e.name) {
        case 'pageview':
          row.referrer_host = noId ? null : referrerHost(e.referrer);
          break;
        case 'offer_view':
          Object.assign(row, { offer_id: e.offerId, operator_id: opOf.get(e.offerId) ?? null, rank: e.rank });
          break;
        case 'cta_click':
          Object.assign(row, { offer_id: e.offerId, operator_id: opOf.get(e.offerId) ?? null, rank: e.rank, placement: e.placement });
          break;
        case 'scroll_depth':
          row.depth = e.depth;
          break;
        case 'country_switch':
          row.props = { from: e.from, to: e.to };
          break;
      }
      if (noId) row.props = { ...(row.props ?? {}), gpc: true };
      return row;
    });
    await insertEvents(rows);
  });

  return empty('1');
}

// 1×1 GIF transparente
const GIF = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), (c) => c.charCodeAt(0));

export async function GET(req: Request) {
  const gif = (tracked: string) =>
    new Response(GIF, { status: 200, headers: { ...NO_STORE, 'Content-Type': 'image/gif', 'X-LP-Tracked': tracked } });
  const q = new URL(req.url).searchParams;
  const site = SiteIdSchema.safeParse(q.get('s'));
  const country = CountrySchema.safeParse((q.get('c') ?? '').toUpperCase());
  if (!site.success || !country.success) return gif('0;invalid');
  const drop = dropReason(req.headers);
  if (drop) return gif(`0;${drop}`);
  const h = req.headers;
  const locale = LocaleSchema.safeParse(q.get('l'));
  const variant = Number(q.get('v'));
  // El Referer del píxel es la propia landing (con su ?src=).
  let src = '';
  let utm: Record<string, string> | null = null;
  try {
    const ref = new URL(h.get('referer') ?? '');
    src = cleanSrc(ref.searchParams.get('src'));
    utm = cleanUtm(ref.searchParams);
  } catch {
    /* sin referer */
  }
  const row: EventRow = {
    name: 'pageview',
    site_id: site.data,
    country: country.data,
    geo_country: geoCountry(h),
    locale: locale.success ? locale.data : null,
    variant: [0, 1, 2].includes(variant) ? variant : null,
    path: '/',
    visitor_hash: visitorHash(h),
    src,
    utm,
    device: deviceOf(h),
    in_app: inAppOf(h),
    props: { noscript: true, ...(gpc(h) ? { gpc: true } : {}) },
  };
  after(() => insertEvents([row]));
  return gif('1');
}
