import 'server-only';
// [A5] Contexto de las páginas legales. /legal queda fuera del middleware, así que se resuelve aquí con la misma
// prioridad que A1: sitio por host; país = cookie `lp_country` > `?__country=` (dev o token de preview) > IP > XX.
import { timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import type { Country, Locale, SiteConfig } from '@la/contracts';
import { DEFAULT_SITE, SITES, UNKNOWN_COUNTRY, localeFor, parseCountry, siteForHost } from '@la/config';

const isDev = process.env.NODE_ENV !== 'production';

export interface LegalContext {
  site: SiteConfig;
  country: Country;
  locale: Locale;
}

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Overrides `?__site=` / `?__country=`: en desarrollo, o con `?__token=` = PREVIEW_OVERRIDE_TOKEN (como el middleware). */
function overridesAllowed(search: Search): boolean {
  if (isDev) return true;
  const expected = process.env.PREVIEW_OVERRIDE_TOKEN;
  const given = one(search.__token);
  if (!expected || !given || expected.length !== given.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export async function getLegalContext(search: Search = {}): Promise<LegalContext> {
  const [h, c] = await Promise.all([headers(), cookies()]);
  const overrides = overridesAllowed(search);

  const siteOverride = overrides ? one(search.__site) : undefined;
  const siteId =
    siteOverride && siteOverride in SITES
      ? (siteOverride as keyof typeof SITES)
      : siteForHost(h.get('host')) ?? DEFAULT_SITE;

  const country =
    parseCountry(c.get('lp_country')?.value) ??
    (overrides ? parseCountry(one(search.__country)) : null) ??
    parseCountry(h.get('x-vercel-ip-country')) ??
    UNKNOWN_COUNTRY;

  return { site: SITES[siteId], country, locale: localeFor(country) };
}
