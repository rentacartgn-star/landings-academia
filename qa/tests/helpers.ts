// [A6] Utilidades comunes: URLs con overrides, matriz esperada de ofertas y comprobaciones de DOM.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

export const TOKEN = process.env.QA_TOKEN ?? 'qa-a6-token';
export const SITES = ['diamond', 'donpool', 'kronos', 'mapache'] as const;
export const COUNTRIES = ['ES', 'MX', 'PA', 'EC', 'US', 'FR'] as const;
export type Site = (typeof SITES)[number];
/** QA_GATE=closed → pasada sin COMPLIANCE_APPROVED_MARKETS: todo debe salir en fallback. */
export const GATE_CLOSED = process.env.QA_GATE === 'closed';
export const APPROVED = new Set((process.env.QA_APPROVED ?? 'ES,MX,PA,EC,US').split(','));

type RawOffer = { id: string; siteId: string; country: string; operatorId: string; rank: number; active: boolean; validFrom?: string; validTo?: string; affiliateUrlTemplate: string; termsUrl: string };
type RawOp = { id: string; name: string; licenseByCountry: Record<string, string> };
export const CATALOG: { offers: RawOffer[]; operators: RawOp[] } = JSON.parse(
  readFileSync(join(__dirname, '../../packages/config/src/offers.fallback.json'), 'utf8'),
);

/** Ofertas que deberían verse (mismas reglas que lib/landing/offers.ts, sobre el catálogo de respaldo). */
export function expectedOffers(site: string, country: string): RawOffer[] {
  if (GATE_CLOSED || !APPROVED.has(country)) return [];
  const ops = Object.fromEntries(CATALOG.operators.map((o) => [o.id, o]));
  const now = Date.now();
  const seen = new Set<string>();
  return CATALOG.offers
    .filter((o) => o.active && o.siteId === site && o.country === country && !!ops[o.operatorId]?.licenseByCountry[country]?.trim())
    .filter((o) => (!o.validFrom || Date.parse(o.validFrom) <= now) && (!o.validTo || Date.parse(o.validTo) > now))
    .sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id))
    .filter((o) => !seen.has(o.operatorId) && !!seen.add(o.operatorId))
    .slice(0, 4);
}

export function expectedLayout(site: string, country: string): 'single' | 'ranking' | 'fallback' {
  const n = expectedOffers(site, country).length;
  return n === 0 ? 'fallback' : n === 1 ? 'single' : 'ranking';
}

export function landingUrl(site: string, country: string, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams({ __site: site, __country: country, __v: '0', __token: TOKEN, ...extra });
  return `/?${q}`;
}

export const OPERATOR_NAMES = CATALOG.operators.map((o) => o.name);

/** Estado de la landing tal como lo delata el HTML. */
export async function landingState(page: Page) {
  return page.evaluate(() => {
    const layoutEl = document.querySelector('[data-layout]');
    const ctas = [...document.querySelectorAll<HTMLAnchorElement>('a[data-cta]')].map((a) => ({
      href: a.getAttribute('href') ?? '',
      offer: a.dataset.offer ?? '',
      placement: a.dataset.cta ?? '',
    }));
    const anchors = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map((a) => a.getAttribute('href') ?? '');
    return {
      layout: layoutEl?.getAttribute('data-layout') ?? null,
      hasMain: !!document.querySelector('main'),
      lang: document.documentElement.lang,
      catalog: document.querySelector('meta[name="lp-catalog"]')?.getAttribute('content') ?? null,
      offers: [...new Set(ctas.map((c) => c.offer))].sort(),
      ctas,
      anchors,
      goLinks: anchors.filter((h) => h.startsWith('/go/')),
      text: document.body.innerText,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

// `lang` = locale del copy escrito (en-US no tiene copy en v1 y cae a es-419; F7 corregido por A0).
export const LOCALE: Record<string, string> = { ES: 'es-ES' };
export const localeOf = (c: string) => LOCALE[c] ?? 'es-419';

/** Botón visible del selector de país (hay uno en el hero y otro en el footer). */
export async function openCountrySwitcher(page: Page) {
  const triggers = page.locator('[data-country-switch]');
  await expect(triggers.first()).toBeAttached();
  const n = await triggers.count();
  for (let i = 0; i < n; i++) {
    const t = triggers.nth(i);
    if (await t.isVisible()) {
      await t.scrollIntoViewIfNeeded();
      await t.click();
      const dlg = page.locator('dialog[open]');
      await expect(dlg).toBeVisible();
      return dlg;
    }
  }
  throw new Error(`No hay ningún [data-country-switch] visible (${n} en el DOM)`);
}

/** Captura los cuerpos de los beacons (sendBeacon con Blob no expone postData en Playwright). */
export async function captureBeacons(page: Page): Promise<string[]> {
  const out: string[] = [];
  await page.exposeFunction('__qaBeacon', (s: string) => out.push(s));
  await page.addInitScript(() => {
    const send = navigator.sendBeacon?.bind(navigator);
    const OrigBlob = Blob;
    const w = window as unknown as { __qaBeacon: (s: string) => void };
    if (send)
      navigator.sendBeacon = (url: string | URL, data?: BodyInit | null) => {
        if (String(url).includes('/api/e') && data instanceof OrigBlob) void data.text().then((t) => w.__qaBeacon(t));
        else if (typeof data === 'string') w.__qaBeacon(data);
        return send(url, data);
      };
    const f = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('/api/e') && typeof init?.body === 'string') w.__qaBeacon(init.body);
      return f(input, init);
    };
  });
  return out;
}
