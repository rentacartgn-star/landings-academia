// [A0/A1] Fábrica de la landing. Cada sitio tiene su propia ruta app/%5Fs/<siteId>/... que importa su tema de forma
// estática: así cada página solo carga el CSS, JS y fuente de SU tema. Una entrada ISR por (país, variante, detectado).
import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { fill, type Locale, type SiteId } from '@la/contracts';
import { COUNTRY_NAMES, FALLBACK_CATALOG, canonicalOrigin } from '@la/config';
import { loadLanding } from '@/lib/landing/get-landing-props';
import { parseLandingRoute, VARIANTS, type LandingRoute } from '@/lib/landing/routing';
import type { Theme } from '@/themes';
import { resolveLocale } from '@/content';

type RouteParams = { country: string; variant: string; detected: string };
type Props = { params: Promise<RouteParams> };

const CORE_MARKETS = ['ES', 'MX', 'PA', 'EC', 'US', 'XX'];

/**
 * Prerender en build (≈ 600 páginas, segundos): sitios × variantes ×
 *  - sin cookie de país: todos los países del selector + los del fallback;
 *  - con cookie de país: los cruces país mostrado × país detectado entre los mercados principales.
 * El resto se genera al primer visitante (ISR). Ojo: con `next start` (self-hosting) Next 15.5 no cachea las rutas
 * no prerenderizadas que llegan por rewrite del middleware; en Vercel sí. Ver docs/DEPLOY.md.
 */
function staticParams(): RouteParams[] {
  const countries = [...new Set([...Object.keys(COUNTRY_NAMES), ...FALLBACK_CATALOG.offers.map((o) => o.country)])];
  const pairs = [
    ...countries.map((c) => [c, c] as const),
    ...CORE_MARKETS.flatMap((c) => CORE_MARKETS.filter((d) => d !== c).map((d) => [c, d] as const)),
  ];
  return pairs.flatMap(([country, detected]) => VARIANTS.map((v) => ({ country, variant: String(v), detected })));
}

// Deduplica entre generateMetadata, generateViewport y la página en el mismo render.
const load = cache(async (site: string, country: string, variant: string, detected: string) => {
  const r = parseLandingRoute({ site, country, variant, detected });
  if (!r) notFound();
  return { route: r, ...(await loadLanding(r.site, r.country, r.detected, r.variant)) };
});

export function makeLandingPage(site: SiteId, theme: Theme) {
async function fromParams(params: Props['params']) {
  const p = await params;
  return load(site, p.country, p.variant, p.detected);
}

const OG_LOCALE: Record<Locale, string> = { 'es-ES': 'es_ES', 'es-419': 'es_LA', 'en-US': 'en_US' };

async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { props: p, source } = await fromParams(params);
  const top = p.offers[0];
  // En title/OG va el shortName (sin "pick").
  const vars = {
    member: p.site.shortName,
    country: COUNTRY_NAMES[p.country] ?? p.country,
    operator: top ? (p.operators[top.operatorId]?.name ?? '') : '',
  };
  const m = p.content.meta;
  const origin = canonicalOrigin(p.site);
  return {
    metadataBase: origin ? new URL(origin) : undefined,
    title: fill(m.title, vars),
    description: fill(m.description, vars),
    alternates: origin ? { canonical: '/' } : undefined,
    openGraph: {
      type: 'website',
      siteName: p.site.shortName,
      locale: OG_LOCALE[p.locale],
      title: fill(m.ogTitle, vars),
      description: fill(m.ogDescription, vars),
      ...(origin ? { url: '/' } : {}),
      images: [{ url: `/${p.site.id}/og.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: fill(m.ogTitle, vars), description: fill(m.ogDescription, vars) },
    formatDetection: { telephone: false, email: false, address: false },
    // Control parental (art. 23.2 RD 958/2020)
    other: { 'lp-catalog': source, rating: 'adult' },
  };
}

async function generateViewport({ params }: Props): Promise<Viewport> {
  await fromParams(params); // valida la ruta (404 si no casa)
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover', // sticky CTA respetando el notch (env(safe-area-inset-bottom))
    themeColor: theme.tokens.colors.bg,
  };
}

async function Page({ params }: Props) {
  const { props } = await fromParams(params);
  const { Landing } = theme;
  return (
    <>
      {/* <html lang> lo fija el root layout ("es"); aquí se afina al locale antes del primer pintado. */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(resolveLocale(props.locale))}` }} />
      <Landing {...props} />
    </>
  );
}

return { generateStaticParams: staticParams, generateMetadata, generateViewport, Page };
}
