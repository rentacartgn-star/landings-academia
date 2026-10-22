// [A6] /go/[offerId]: 302 con click_id sustituido, cabeceras de tracking, HEAD sin registrar, 404 y clic real desde la landing.
import { expect, test } from '@playwright/test';
import { CATALOG, SITES, expectedOffers, landingUrl, captureBeacons } from './helpers';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

test.describe.configure({ mode: 'parallel' });
test('todas las ofertas activas: /go → 302 con click_id en la URL final', async ({ request }) => {
  test.skip(!!process.env.QA_GATE, 'con el gate cerrado /go no sale al operador');
  const active = CATALOG.offers.filter((o) => o.active);
  expect(active.length).toBeGreaterThan(0);
  const ids = new Set<string>();
  for (const o of active) {
    const r = await request.get(`/go/${o.id}?p=hero`, { maxRedirects: 0, headers: { 'user-agent': SAFARI } });
    expect(r.status(), o.id).toBe(302);
    const h = r.headers();
    const loc = h['location']!;
    const clickId = h['x-lp-click-id']!;
    expect(clickId).toMatch(UUID);
    expect(ids.has(clickId), 'click_id único por clic').toBe(false);
    ids.add(clickId);
    expect(loc).not.toContain('{click_id}');
    expect(loc).toBe(o.affiliateUrlTemplate.replace('{click_id}', clickId));
    expect(h['x-lp-tracked']).toBe('1');
    expect(h['cache-control']).toContain('no-store');
    expect(h['x-robots-tag']).toContain('noindex');
  }
});

test('/go: placements, bots, HEAD, oferta inexistente', async ({ request }) => {
  test.skip(!!process.env.QA_GATE, 'pasada normal');
  const id = CATALOG.offers[0]!.id;
  for (const p of ['hero', 'ranking', 'sticky', 'final', 'single', 'basura', '']) {
    const r = await request.get(`/go/${id}?p=${p}`, { maxRedirects: 0, headers: { 'user-agent': SAFARI } });
    expect(r.status(), `p=${p}`).toBe(302);
  }
  // HeadlessChrome / curl / previsualizadores: redirige pero no cuenta.
  const bot = await request.get(`/go/${id}?p=hero`, { maxRedirects: 0, headers: { 'user-agent': 'Mozilla/5.0 HeadlessChrome/140.0' } });
  expect(bot.status()).toBe(302);
  expect(bot.headers()['x-lp-tracked']).toBe('0;bot');
  const tg = await request.get(`/go/${id}?p=hero`, { maxRedirects: 0, headers: { 'user-agent': 'TelegramBot (like TwitterBot)' } });
  expect(tg.headers()['x-lp-tracked']).toMatch(/^0;(preview|bot)$/);
  const prefetch = await request.get(`/go/${id}?p=hero`, { maxRedirects: 0, headers: { 'user-agent': SAFARI, 'sec-purpose': 'prefetch' } });
  expect(prefetch.headers()['x-lp-tracked']).toMatch(/^0;/);
  const head = await request.head(`/go/${id}?p=hero`, { maxRedirects: 0, headers: { 'user-agent': SAFARI } });
  expect(head.status()).toBe(302);
  expect(head.headers()['x-lp-tracked']).toBe('0;prefetch');
  const nf = await request.get('/go/no-existe?p=hero', { maxRedirects: 0, headers: { 'user-agent': SAFARI } });
  expect(nf.status()).toBe(404);
  const weird = await request.get('/go/%2e%2e%2fapi%2fe?p=hero', { maxRedirects: 0, headers: { 'user-agent': SAFARI } });
  expect([400, 404]).toContain(weird.status());
});

// Clic real en la landing (sin seguir al operador): la navegación pasa por /go y aterriza con el click_id.
for (const site of SITES) {
  test(`${site} MX: clic en CTA → /go → destino con click_id`, async ({ page }) => {
    const offers = expectedOffers(site, 'MX');
    test.skip(offers.length === 0, 'fallback');
    const beacons = await captureBeacons(page);
    await page.goto(landingUrl(site, 'MX'));
    await page.waitForLoadState('networkidle');
    const cta = page.locator('[id$="-hero-cta"]');
    const goResp = page.waitForResponse((r) => r.url().includes('/go/'));
    const opReq = page.waitForRequest(/example\.com/);
    await cta.click();
    const r = await goResp;
    expect(r.status()).toBe(302);
    expect(r.url()).toMatch(new RegExp(`/go/${offers[0]!.id}\\?p=(hero|single)$`));
    expect(r.headers()['x-lp-tracked']).toBe('1');
    // Destino final (el operador): la petición sale con el click_id del 302.
    expect(new URL((await opReq).url()).searchParams.get('subid')).toBe(r.headers()['x-lp-click-id']);
    // cta_click se envía antes de navegar (beacon).
    await expect.poll(() => beacons.join('\n'), { message: 'beacon cta_click', timeout: 3000 }).toContain('cta_click');
  });
}

test('sin JavaScript los CTA siguen siendo /go (funciona sin JS)', async ({ browser, baseURL }) => {
  test.skip(!!process.env.QA_GATE, 'pasada normal');
  const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 664 }, userAgent: SAFARI });
  const page = await ctx.newPage();
  await page.goto(landingUrl('diamond', 'ES'));
  const href = await page.locator('[id$="-hero-cta"]').getAttribute('href');
  expect(href).toMatch(/^\/go\//);
  const opReq = page.waitForRequest(/example\.com/);
  await page.locator('[id$="-hero-cta"]').click();
  expect(new URL((await opReq).url()).searchParams.get('subid')).toMatch(UUID);
  await ctx.close();
});

// Gate P9 en /go (F4): con el mercado sin aprobar, nunca se sale al operador.
test('gate cerrado: /go no redirige al operador', async ({ request }) => {
  test.skip(!process.env.QA_GATE, 'solo en la pasada QA_GATE=closed');
  for (const o of CATALOG.offers.filter((x) => x.active)) {
    const r = await request.get(`/go/${o.id}?p=hero`, { maxRedirects: 0, headers: { 'user-agent': SAFARI } });
    expect([302, 404], o.id).toContain(r.status());
    expect(r.headers()['location'] ?? '/', o.id).not.toMatch(/^https?:/);
  }
});
