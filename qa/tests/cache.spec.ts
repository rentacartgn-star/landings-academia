// [A6] Fuga de caché: peticiones alternas (IP, cookie, host) y en paralelo; la página de un país nunca se sirve a otro.
// Usa el camino de producción (x-vercel-ip-country + host), sin overrides.
import { expect, test, type APIRequestContext } from '@playwright/test';
import { CATALOG, SITES, TOKEN, expectedLayout, expectedOffers, localeOf } from './helpers';

const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const HOST: Record<string, string> = { diamond: 'diamond.local.test', donpool: 'donpool.local.test', kronos: 'kronos.local.test', mapache: 'mapache.local.test' };

function parse(html: string) {
  return {
    layout: html.match(/data-layout="([a-z]+)"/)?.[1] ?? null,
    offers: [...new Set([...html.matchAll(/data-offer="([^"]+)"/g)].map((m) => m[1]!))].sort(),
    lang: html.match(/document\.documentElement\.lang=\\?"([\w-]+)\\?"/)?.[1] ?? null,
    allIds: CATALOG.offers.map((o) => o.id).filter((id) => html.includes(`/go/${id}`)),
  };
}

async function fetchLanding(request: APIRequestContext, site: string, ip: string, cookie?: string) {
  const headers: Record<string, string> = { host: HOST[site]!, 'x-vercel-ip-country': ip, 'user-agent': SAFARI, cookie: `lp_v=0${cookie ? `; lp_country=${cookie}` : ''}` };
  const r = await request.get('/', { headers });
  expect(r.status()).toBe(200);
  return { ...parse(await r.text()), cache: r.headers()['x-nextjs-cache'] ?? '-', cc: r.headers()['cache-control'] ?? '' };
}

function check(site: string, shown: string, got: ReturnType<typeof parse>, ctx: string) {
  const exp = expectedOffers(site, shown).map((o) => o.id).sort();
  expect(got.layout, ctx).toBe(expectedLayout(site, shown));
  expect(got.offers, ctx).toEqual(exp);
  // Ningún /go de otro país o sitio en el HTML (también payload RSC).
  expect(got.allIds.filter((id) => !exp.includes(id)), ctx).toEqual([]);
  expect(got.lang, ctx).toBe(localeOf(shown));
}

test('alterna países por IP (3 vueltas, 4 sitios por host)', async ({ request }) => {
  const seq = ['ES', 'MX', 'FR', 'ES', 'US', 'MX', 'PA', 'EC', 'XX', 'ES', 'DE', 'MX'];
  for (let round = 0; round < 3; round++) {
    for (const site of SITES) {
      for (const c of seq) {
        const g = await fetchLanding(request, site, c);
        check(site, c, g, `${site} ip=${c} vuelta ${round} cache=${g.cache}`);
      }
    }
  }
});

test('cookie lp_country gana a la IP y no contamina la entrada sin cookie', async ({ request }) => {
  for (const site of SITES) {
    for (const [cookie, ip] of [['ES', 'MX'], ['MX', 'ES'], ['FR', 'ES'], ['ES', 'FR'], ['XX', 'MX'], ['US', 'EC']] as const) {
      check(site, cookie, await fetchLanding(request, site, ip, cookie), `${site} cookie=${cookie} ip=${ip}`);
      check(site, ip, await fetchLanding(request, site, ip), `${site} sin cookie ip=${ip} (tras cookie=${cookie})`);
    }
    // Cookie inválida → se ignora y manda la IP.
    check(site, 'MX', await fetchLanding(request, site, 'MX', 'ZZ'), `${site} cookie=ZZ`);
    check(site, 'ES', await fetchLanding(request, site, 'ES', 'es'), `${site} cookie=es (minúsculas)`);
  }
});

test('ráfaga en paralelo de países y sitios mezclados', async ({ request }) => {
  const combos = SITES.flatMap((s) => ['ES', 'MX', 'PA', 'EC', 'US', 'FR', 'BR'].map((c) => [s, c] as const));
  const jobs = Array.from({ length: 4 }, () => combos).flat().sort(() => Math.random() - 0.5);
  const results = await Promise.all(jobs.map(async ([s, c]) => ({ s, c, g: await fetchLanding(request, s, c) })));
  for (const { s, c, g } of results) check(s, c, g, `${s} ${c} paralelo`);
});

test('segunda visita a país prerenderizado sale de caché', async ({ request }) => {
  for (const site of SITES) {
    await fetchLanding(request, site, 'ES');
    const g = await fetchLanding(request, site, 'ES');
    expect(['HIT', 'STALE'], `${site} ES x-nextjs-cache`).toContain(g.cache);
    expect(g.cc).toMatch(/s-maxage=\d+/);
  }
});

test('blindaje de la clave de caché y de los overrides', async ({ request }) => {
  const h = { 'user-agent': SAFARI, 'x-vercel-ip-country': 'ES', host: HOST.diamond! };
  // /_s directo → 404 (cualquier forma)
  for (const p of ['/_s/diamond/MX/0/MX', '/%5Fs/diamond/MX/0/MX', '/%5fs/diamond/MX/0/MX', '/_s']) {
    const r = await request.get(p, { headers: h, maxRedirects: 0 });
    expect(r.status(), p).toBe(404);
  }
  // Overrides sin token o con token falso → se ignoran (manda la IP: ES).
  for (const q of ['?__country=MX', `?__country=MX&__token=${TOKEN}x`, '?__country=MX&__token=', '?__site=kronos&__country=MX']) {
    const r = await request.get(`/${q}`, { headers: h });
    const g = parse(await r.text());
    check('diamond', 'ES', g, `override sin token ${q}`);
    expect(r.headers()['x-lp-route'], 'x-lp-route oculto sin token').toBeUndefined();
  }
  // Con token sí se aplica y expone la ruta.
  const ok = await request.get(`/?__country=MX&__token=${TOKEN}&__v=0`, { headers: h });
  expect(ok.headers()['x-lp-route']).toBe('/_s/diamond/MX/0/MX');
  // Código de país inventado por IP → XX (fallback).
  const r = await request.get('/', { headers: { ...h, 'x-vercel-ip-country': 'Q1' } });
  check('diamond', 'XX', parse(await r.text()), 'ip=Q1');
});
