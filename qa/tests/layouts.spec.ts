// [A6] Cada sitio × país: layout, nº de ofertas, CTA por /go, sin operadores en fallback, sin scroll horizontal.
import { expect, test } from '@playwright/test';
import { COUNTRIES, OPERATOR_NAMES, SITES, expectedLayout, expectedOffers, landingState, landingUrl, localeOf, CATALOG } from './helpers';

const GO_RE = /^\/go\/[a-z0-9-]+\?p=(hero|ranking|sticky|final|single)$/;
const AFFILIATE_HOSTS = [...new Set(CATALOG.offers.map((o) => o.affiliateUrlTemplate.split('{')[0]!.split('?')[0]!))];

for (const site of SITES) {
  for (const country of COUNTRIES) {
    test(`${site} ${country}: layout ${expectedLayout(site, country)} y ofertas`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

      const res = await page.goto(landingUrl(site, country));
      expect(res?.status()).toBe(200);
      expect(res?.headers()['x-lp-route']).toBe(`/_s/${site}/${country}/0/${country}`);
      await page.waitForLoadState('networkidle');
      const s = await landingState(page);
      const exp = expectedOffers(site, country);

      expect(s.hasMain, '<main> presente').toBe(true);
      expect(s.layout).toBe(expectedLayout(site, country));
      expect(s.lang).toBe(localeOf(country));
      expect(s.offers).toEqual(exp.map((o) => o.id).sort());

      // Todo CTA saliente pasa por /go/<id>?p=<placement> y solo con ofertas de este país.
      for (const c of s.ctas) {
        expect(c.href, `CTA ${c.placement}`).toMatch(GO_RE);
        expect(c.href.startsWith(`/go/${c.offer}?`)).toBe(true);
      }
      for (const h of s.goLinks) expect(exp.some((o) => h.startsWith(`/go/${o.id}?`)), `enlace ${h} es de este país`).toBe(true);
      // Nunca un enlace de afiliado directo (saltándose /go).
      for (const h of s.anchors) for (const aff of AFFILIATE_HOSTS) expect(h.startsWith(aff + '?'), `enlace directo ${h}`).toBe(false);

      if (exp.length === 0) {
        expect(s.goLinks, 'fallback sin /go').toHaveLength(0);
        for (const name of OPERATOR_NAMES) expect(s.text, `fallback sin "${name}"`).not.toContain(name);
        for (const o of CATALOG.offers) expect(s.anchors).not.toContain(o.termsUrl);
        await expect(page.locator('[data-sticky-cta]')).toHaveCount(0);
      } else {
        // El hero tiene un CTA y el #1 es la primera oferta por rank.
        const hero = s.ctas.find((c) => c.placement === 'hero' || c.placement === 'single');
        expect(hero, 'CTA de hero').toBeTruthy();
        expect(s.ctas[0]!.offer).toBe(exp[0]!.id);
      }

      expect(s.overflowX, 'sin scroll horizontal a 390 px').toBeLessThanOrEqual(0);
      expect(errors, 'sin errores de consola').toEqual([]);
    });
  }
}
