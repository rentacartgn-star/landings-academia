// [A6] Capturas a 390 px: cada sitio × (ES, MX y FR fallback), pantalla inicial y página completa → qa/screens/final/.
import { test } from '@playwright/test';
import { join } from 'node:path';
import { SITES, landingUrl } from './helpers';

const OUT = join(__dirname, '../screens/final');

test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

for (const site of SITES) {
  for (const country of ['ES', 'MX', 'FR'] as const) {
    test(`captura ${site} ${country}`, async ({ page }) => {
      test.skip(!!process.env.QA_GATE, 'solo en la pasada normal');
      await page.goto(landingUrl(site, country));
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500); // animaciones de entrada
      await page.screenshot({ path: join(OUT, `${site}-${country}-inicial.png`) });
      // Recorre la página para disparar reveals/lazy y vuelve arriba antes de la completa.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(OUT, `${site}-${country}-completa.png`), fullPage: true });
    });
  }
}
