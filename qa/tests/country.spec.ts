// [A6] Selector de país: abre, elige, escribe la cookie lp_country, recarga y persiste (gana a la IP y al override).
import { expect, test } from '@playwright/test';
import { SITES, expectedLayout, expectedOffers, landingState, landingUrl, openCountrySwitcher, TOKEN } from './helpers';

for (const site of SITES) {
  test(`${site}: selector ES → MX persiste`, async ({ page, context, baseURL }) => {
    await page.goto(landingUrl(site, 'ES'));
    expect((await landingState(page)).layout).toBe(expectedLayout(site, 'ES'));

    const dlg = await openCountrySwitcher(page);
    // Accesible: el diálogo tiene nombre y el país actual marcado.
    await expect(dlg).toHaveAttribute('aria-label', /.+/);
    await expect(dlg.locator('[data-country="ES"]')).toHaveAttribute('aria-current', 'true');
    await expect(dlg.locator('[data-country="XX"]')).toBeVisible();

    await Promise.all([page.waitForEvent('load'), dlg.locator('[data-country="MX"]').click()]);
    const cookie = (await context.cookies(baseURL)).find((c) => c.name === 'lp_country');
    expect(cookie?.value).toBe('MX');
    expect(cookie?.expires ?? 0).toBeGreaterThan(Date.now() / 1000 + 300 * 86400);

    const after = await landingState(page);
    expect(after.layout).toBe(expectedLayout(site, 'MX'));
    expect(after.offers).toEqual(expectedOffers(site, 'MX').map((o) => o.id).sort());

    // Recarga normal y visita nueva por IP de España: la cookie manda.
    await page.reload();
    expect((await landingState(page)).offers).toEqual(expectedOffers(site, 'MX').map((o) => o.id).sort());
    const r = await page.goto(`/?__site=${site}&__token=${TOKEN}&__v=0`, { referer: '' });
    expect(r?.headers()['x-lp-route']).toMatch(new RegExp(`^/_s/${site}/MX/0/`));
    // Con cookie ≠ IP la página debe saber el país detectado (segmento `detected`).
    const r2 = await page.goto(landingUrl(site, 'ES'));
    expect(r2?.headers()['x-lp-route']).toBe(`/_s/${site}/MX/0/ES`);
  });

  test(`${site}: "Otro país" (XX) lleva al fallback`, async ({ page, context, baseURL }) => {
    await page.goto(landingUrl(site, 'MX'));
    const dlg = await openCountrySwitcher(page);
    await Promise.all([page.waitForEvent('load'), dlg.locator('[data-country="XX"]').click()]);
    expect((await context.cookies(baseURL)).find((c) => c.name === 'lp_country')?.value).toBe('XX');
    const s = await landingState(page);
    expect(s.layout).toBe('fallback');
    expect(s.goLinks).toHaveLength(0);
    // Desde el fallback se puede volver a un país con oferta.
    const dlg2 = await openCountrySwitcher(page);
    await expect(dlg2.locator('[data-country="ES"]')).toBeVisible();
  });
}
