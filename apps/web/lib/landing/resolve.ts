// [A1] Resolución host → sitio, país (cookie > override > IP > XX) y variante A/B. Edge-safe (sin Node APIs).
import type { NextRequest } from 'next/server';
import type { Country, SiteId } from '@la/contracts';
import { SITES, DEFAULT_SITE, siteForHost } from '@la/config/sites';
import { parseCountry, UNKNOWN_COUNTRY } from '@la/config/countries';
import { COUNTRY_COOKIE, VARIANT_COOKIE, parseVariant, type Variant } from './routing';

const isDev = process.env.NODE_ENV !== 'production';

// Previsualizadores de enlaces y crawlers: variante de control y sin cookie (no ensucian el reparto A/B).
const BOT_UA = /bot\b|crawler|spider|facebookexternalhit|whatsapp\/|embedly|google-inspectiontool|chrome-lighthouse|vercel-screenshot/i;

/** Comparación en tiempo constante (el token de preview no debe filtrarse por timing). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Overrides `?__site= / ?__country= / ?__v=` permitidos: en desarrollo, o con `?__token=` = PREVIEW_OVERRIDE_TOKEN. */
export function overridesAllowed(req: NextRequest): boolean {
  if (isDev) return true;
  const expected = process.env.PREVIEW_OVERRIDE_TOKEN;
  const given = req.nextUrl.searchParams.get('__token');
  return !!expected && !!given && safeEqual(given, expected);
}

export interface LandingResolution {
  site: SiteId;
  /** País mostrado. */
  country: Country;
  /** País "por IP" (o el override, que simula la IP). */
  detected: Country;
  variant: Variant;
  /** true → hay que escribir la cookie `lp_v` en la respuesta (visitante nuevo). */
  assignVariant: boolean;
  overrides: boolean;
}

export function resolveSite(req: NextRequest, overrides = overridesAllowed(req)): SiteId {
  const o = overrides ? req.nextUrl.searchParams.get('__site') : null;
  if (o && o in SITES) return o as SiteId;
  return siteForHost(req.headers.get('host')) ?? DEFAULT_SITE;
}

export function resolveCountry(req: NextRequest, overrides = overridesAllowed(req)): { country: Country; detected: Country } {
  const o = overrides ? parseCountry(req.nextUrl.searchParams.get('__country')) : null;
  const detected = o ?? parseCountry(req.headers.get('x-vercel-ip-country')) ?? UNKNOWN_COUNTRY;
  const cookie = parseCountry(req.cookies.get(COUNTRY_COOKIE)?.value);
  return { country: cookie ?? detected, detected };
}

export function resolveVariant(req: NextRequest, overrides = overridesAllowed(req)): { variant: Variant; assign: boolean } {
  const o = overrides ? parseVariant(req.nextUrl.searchParams.get('__v')) : null;
  if (o !== null) return { variant: o, assign: false };
  const cookie = parseVariant(req.cookies.get(VARIANT_COOKIE)?.value);
  if (cookie !== null) return { variant: cookie, assign: false };
  // Interruptor de compliance: AB_TEST_ENABLED=false → todos a la variante de control y ninguna cookie.
  if (process.env.AB_TEST_ENABLED === 'false') return { variant: 0, assign: false };
  if (BOT_UA.test(req.headers.get('user-agent') ?? '')) return { variant: 0, assign: false };
  const r = crypto.getRandomValues(new Uint32Array(1))[0]! % 3;
  return { variant: r as Variant, assign: true };
}

export function resolveLanding(req: NextRequest): LandingResolution {
  const overrides = overridesAllowed(req);
  const { country, detected } = resolveCountry(req, overrides);
  const { variant, assign } = resolveVariant(req, overrides);
  return { site: resolveSite(req, overrides), country, detected, variant, assignVariant: assign, overrides };
}
