// [A6] Navegadores in-app de Instagram y TikTok (UA real): la landing pinta, el clic cuenta (no es bot) y no hay errores.
import { expect, test } from '@playwright/test';
import { SITES, expectedLayout, expectedOffers, landingState, landingUrl, captureBeacons } from './helpers';

export const IN_APP = {
  instagram_ios:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 330.0.0.27.89 (iPhone15,2; iOS 17_5; es_ES; es; scale=3.00; 1179x2556; 593029393)',
  instagram_android:
    'Mozilla/5.0 (Linux; Android 14; SM-S911B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.82 Mobile Safari/537.36 Instagram 330.0.0.40.92 Android (34/14; 480dpi; 1080x2340; samsung; SM-S911B; dm1q; qcom; es_ES; 600339040)',
  tiktok_ios:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_34.1.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/es Region/MX ByteFullLocale/es-MX isDarkMode/0 WKWebView/1 BytedanceWebview/d8a21c6 FalconTag/',
  tiktok_android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/UQ1A.240205.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.82 Mobile Safari/537.36 trill_340103 JsSdk/1.0 NetType/4G Channel/googleplay AppName/musical_ly app_version/34.1.3 ByteLocale/es-MX ByteFullLocale/es-MX Region/MX BytedanceWebview/d8a21c6',
} as const;

for (const [name, ua] of Object.entries(IN_APP)) {
  test.describe(name, () => {
    test.use({ userAgent: ua, viewport: { width: 390, height: 700 } });
    for (const site of SITES) {
      test(`${site} MX en ${name}`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        const beacons = await captureBeacons(page);

        const res = await page.goto(landingUrl(site, 'MX'));
        expect(res?.status()).toBe(200);
        // In-app no es bot: debe recibir variante A/B (cookie lp_v) como cualquier visitante.
        await page.waitForLoadState('networkidle');
        const s = await landingState(page);
        expect(s.layout).toBe(expectedLayout(site, 'MX'));
        expect(s.offers).toHaveLength(expectedOffers(site, 'MX').length);
        expect(s.overflowX).toBeLessThanOrEqual(0);
        await expect.poll(() => beacons.join('\n'), { message: 'pageview enviado (beacon /api/e)', timeout: 6000 }).toContain('pageview');

        if (expectedOffers(site, 'MX').length) {
          const goResp = page.waitForResponse((r) => r.url().includes('/go/'));
          const opReq = page.waitForRequest(/example\.com/);
          await page.locator('[id$="-hero-cta"]').click();
          const r = await goResp;
          expect(r.status()).toBe(302);
          expect(r.headers()['x-lp-tracked'], 'el clic in-app cuenta').toBe('1');
          expect(new URL((await opReq).url()).searchParams.get('subid')).toBe(r.headers()['x-lp-click-id']);
        }
        expect(errors).toEqual([]);
      });
    }
  });
}

test('in-app sin override: recibe variante A/B (no se trata como bot)', async ({ playwright, baseURL }) => {
  for (const ua of Object.values(IN_APP)) {
    const request = await playwright.request.newContext({ baseURL }); // jar de cookies limpio por UA
    const r = await request.get('/', { headers: { 'user-agent': ua, 'x-vercel-ip-country': 'MX' }, maxRedirects: 0 });
    expect(r.status()).toBe(200);
    expect(r.headers()['set-cookie'] ?? '', ua.slice(0, 40)).toMatch(/lp_v=[012]/);
    await request.dispose();
  }
});
