import 'server-only';
// [A4] Datos de la petición para tracking: bots/previsualizaciones, device, in-app, visitor_hash sin cookies.
// Privacidad (§7.1 + petición de A5/AEPD):
//  · La IP NUNCA se guarda. Se trunca (/24 IPv4, /48 IPv6) y solo entra en el hash.
//  · visitor_hash = sha256(ip_truncada + UA + sal_diaria); sal_diaria = HMAC(VISITOR_HASH_SECRET, fecha Madrid). Rota cada día.
//  · `Sec-GPC: 1` → no se calcula hash ni se guarda referrer: solo el evento agregado sin identificador.
import { createHash, createHmac } from 'node:crypto';
import { userAgent } from 'next/server';
import { SITES } from '@la/config';

type H = Headers;

// UA de bots, monitores, clientes HTTP y fetchers de previsualización (Telegram, WhatsApp, iMessage = "facebookexternalhit
// Facebot Twitterbot", Facebook, Slack, Discord...). Los navegadores in-app de IG/TikTok/FB NO entran aquí.
const BOT_RE =
  /bot\b|bot\/|crawl|spider|slurp|facebookexternalhit|facebot|whatsapp|telegram(bot)?\/|twitterbot|slackbot|slack-imgproxy|discordbot|linkedinbot|skypeuripreview|embedly|pinterest|vkshare|redditbot|applebot|googleother|google-inspectiontool|bingpreview|preview|headless|lighthouse|pagespeed|chrome-lighthouse|curl\/|wget\/|python-requests|python-urllib|aiohttp|go-http-client|okhttp|axios\/|node-fetch|undici|httpclient|java\/|libwww|petalbot|semrush|ahrefs|mj12bot|dotbot|yandex|baiduspider|duckduckbot|bytespider|gptbot|ccbot|claudebot|anthropic-ai|perplexity|amazonbot|uptime|pingdom|statuscake|monitor/i;

export type DropReason = 'bot' | 'preview' | 'prefetch' | null;

/** Motivo para no contar la petición, o null si es un humano plausible. */
export function dropReason(h: H): DropReason {
  const ua = h.get('user-agent') ?? '';
  if (!ua || ua.length < 12) return 'bot';
  // Prefetch especulativo del navegador o de Next: no es un clic ni una visita.
  const purpose = `${h.get('sec-purpose') ?? ''} ${h.get('purpose') ?? ''} ${h.get('x-purpose') ?? ''} ${h.get('x-moz') ?? ''}`.toLowerCase();
  if (purpose.includes('prefetch') || purpose.includes('preview')) return 'prefetch';
  if (/facebookexternalhit|facebot|whatsapp|telegram|twitterbot|slackbot|discordbot|skypeuripreview|linkedinbot/i.test(ua)) return 'preview';
  if (BOT_RE.test(ua)) return 'bot';
  try {
    if (userAgent({ headers: h }).isBot) return 'bot';
  } catch {
    /* userAgent puede fallar con UAs raros: seguimos */
  }
  return null;
}

export function deviceOf(h: H): 'mobile' | 'tablet' | 'desktop' {
  try {
    const t = userAgent({ headers: h }).device.type;
    return t === 'mobile' ? 'mobile' : t === 'tablet' ? 'tablet' : 'desktop';
  } catch {
    return /mobile|android|iphone/i.test(h.get('user-agent') ?? '') ? 'mobile' : 'desktop';
  }
}

/** Navegador in-app: Instagram, TikTok o Facebook. */
export function inAppOf(h: H): 'ig' | 'tt' | 'fb' | null {
  const ua = h.get('user-agent') ?? '';
  if (/Instagram/i.test(ua)) return 'ig';
  if (/musical_ly|BytedanceWebview|TikTok|trill_|ByteLocale/i.test(ua)) return 'tt';
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua)) return 'fb';
  return null;
}

export function gpc(h: H): boolean {
  return h.get('sec-gpc') === '1';
}

export function geoCountry(h: H): string | null {
  const c = (h.get('x-vercel-ip-country') ?? '').toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
}

function clientIp(h: H): string {
  const xff = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  return xff || h.get('x-real-ip') || '';
}

/** Trunca la IP: IPv4 → /24 (último octeto a 0); IPv6 → /48 (tres primeros grupos). */
export function truncateIp(ip: string): string {
  const v4 = ip.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/); // también ::ffff:a.b.c.d
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0`;
  if (!ip.includes(':')) return '';
  const clean = ip.split('%')[0]!.toLowerCase();
  const [head = '', tail = ''] = clean.split('::');
  const h = head ? head.split(':') : [];
  const t = clean.includes('::') ? (tail ? tail.split(':') : []) : [];
  const groups = clean.includes('::') ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h;
  return `${groups.slice(0, 3).map((g) => (g || '0').replace(/^0+(?=.)/, '')).join(':')}::`;
}

/** Fecha en Madrid (YYYY-MM-DD): la misma frontera de día que el rollup. */
export function madridDay(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

let warnedSecret = false;
function dailySalt(): string | null {
  let secret = process.env.VISITOR_HASH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      if (!warnedSecret) {
        warnedSecret = true;
        console.warn('[tracking] VISITOR_HASH_SECRET no configurado: no se calculan únicos.');
      }
      return null;
    }
    secret = 'dev-only-insecure-secret';
  }
  return createHmac('sha256', secret).update(madridDay()).digest('hex');
}

/** sha256(ip/24|/48 + UA + sal diaria). null con GPC, sin IP o sin secreto en producción. */
export function visitorHash(h: H): string | null {
  if (gpc(h)) return null;
  const salt = dailySalt();
  const ip = truncateIp(clientIp(h));
  if (!salt || !ip) return null;
  return createHash('sha256').update(`${ip}|${h.get('user-agent') ?? ''}|${salt}`).digest('hex').slice(0, 32);
}

/** `src` corto y limpio: [a-z0-9_-], máx 32. */
export function cleanSrc(v: string | null | undefined): string {
  return (v ?? '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export function cleanUtm(input: Record<string, string> | URLSearchParams | undefined | null): Record<string, string> | null {
  if (!input) return null;
  const get = (k: string) => (input instanceof URLSearchParams ? input.get(k) : input[k]);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = get(k);
    if (v) out[k] = String(v).slice(0, 128);
  }
  return Object.keys(out).length ? out : null;
}

/** Solo el host del referrer (sin ruta ni query): basta para "de dónde viene" y no arrastra datos. */
export function referrerHost(ref: string | undefined | null): string | null {
  if (!ref) return null;
  try {
    return new URL(ref).hostname.slice(0, 120) || null;
  } catch {
    return null;
  }
}

const KNOWN_HOSTS = new Set(Object.values(SITES).flatMap((s) => s.domains));
/** ¿El host pertenece a uno de nuestros sitios? (localhost cuenta fuera de producción). */
export function isOwnHost(host: string): boolean {
  const h = host.split(':')[0]!.toLowerCase();
  if (KNOWN_HOSTS.has(h)) return true;
  return process.env.NODE_ENV !== 'production' && (h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local.test'));
}
