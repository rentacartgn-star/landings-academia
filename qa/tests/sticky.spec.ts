// [A6] Sticky CTA: oculto arriba, aparece al pasar el CTA del hero, no tapa contenido al final y vuelve a ocultarse.
// Ojo: diamond, kronos y mapache esconden el sticky a propósito mientras haya otro CTA primario a la vista
// ("un solo CTA primario en pantalla"), así que se busca que llegue a verse en algún tramo del scroll.
import { expect, test, type Page } from '@playwright/test';
import { SITES, expectedOffers, landingUrl } from './helpers';

async function stickyShown(page: Page) {
  return page.evaluate(() => {
    const st = document.querySelector('[data-sticky-cta]') as HTMLElement;
    const a = st.querySelector('a[data-cta="sticky"]') as HTMLElement | null;
    const r = (a ?? st).getBoundingClientRect();
    let op = 1;
    for (let e: HTMLElement | null = a ?? st; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
    return { data: st.dataset.visible, op, top: r.top, bottom: r.bottom, h: r.height, shown: op > 0.9 && r.bottom <= innerHeight + 1 && r.top < innerHeight };
  });
}

/** Scroll "de dedo": tramos de 150 px, como un usuario (no un salto). */
async function wheel(page: Page, px: number) {
  for (let y = 0; y < px; y += 150) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(50);
  }
}

for (const site of SITES) {
  for (const country of ['ES', 'MX'] as const) {
    test(`${site} ${country}: sticky CTA`, async ({ page }) => {
      test.skip(expectedOffers(site, country).length === 0, 'fallback: sin sticky');
      await page.goto(landingUrl(site, country));
      await page.waitForLoadState('networkidle');
      const vh = page.viewportSize()!.height;
      const sticky = page.locator('[data-sticky-cta]');
      await expect(sticky).toHaveCount(1);
      await expect(sticky).toHaveAttribute('data-visible', 'false');
      expect((await stickyShown(page)).shown, 'sticky oculto al cargar').toBe(false);
      expect(await sticky.evaluate((el) => (el as HTMLElement).inert), 'oculto = inert').toBe(true);

      // CTA del hero: el que observa el StickyCta (`<x>-hero-cta`).
      const heroCta = page.locator('[id$="-hero-cta"]');
      await expect(heroCta).toHaveCount(1);
      const heroBox = (await heroCta.boundingBox())!;

      await wheel(page, heroBox.y + heroBox.height + 150);
      await expect(sticky).toHaveAttribute('data-visible', 'true');

      // Debe llegar a verse en algún punto bajando (puede esconderse mientras otro CTA primario está en pantalla).
      let seen: Awaited<ReturnType<typeof stickyShown>> | null = null;
      for (let i = 0; i < 60 && !seen; i++) {
        await page.waitForTimeout(250);
        const s = await stickyShown(page);
        if (s.shown) seen = s;
        else await wheel(page, 300);
      }
      expect(seen, 'el sticky llega a mostrarse al bajar').toBeTruthy();
      const link = sticky.locator('a[data-cta="sticky"]');
      await expect(link).toHaveAttribute('href', new RegExp(`^/go/${expectedOffers(site, country)[0]!.id}\\?p=sticky$`));
      expect(seen!.bottom, 'sticky dentro de pantalla').toBeLessThanOrEqual(vh + 1);
      expect(seen!.h, 'tap target ≥ 44 px').toBeGreaterThanOrEqual(44);
      expect((await sticky.boundingBox())!.height, 'sticky ocupa < 1/4 de pantalla').toBeLessThan(vh / 4);

      // Al final de la página, el último contenido no queda debajo del sticky.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(700);
      const cover = await page.evaluate(() => {
        const st = document.querySelector('[data-sticky-cta]') as HTMLElement;
        const a = st.querySelector('a') as HTMLElement;
        if (st.dataset.visible !== 'true' || Number(getComputedStyle(st).opacity) < 0.5) return { covered: 0, note: 'sticky oculto al final' };
        const top = st.getBoundingClientRect().top;
        const els = [...document.body.querySelectorAll('a, p, li, small, span, button, h2, h3, img, svg')].filter((e) => {
          if (st.contains(e) || e.closest('dialog')) return false;
          const cs = getComputedStyle(e);
          if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false;
          for (let p: Element | null = e; p; p = p.parentElement) if (['fixed', 'sticky'].includes(getComputedStyle(p).position)) return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (e.textContent?.trim() || e.tagName === 'IMG' || e.tagName === 'svg');
        });
        const last = els.reduce((x, y) => (y.getBoundingClientRect().bottom > x.getBoundingClientRect().bottom ? y : x));
        void a;
        return { covered: Math.round(last.getBoundingClientRect().bottom - top), note: `${last.tagName} "${last.textContent?.trim().slice(0, 40)}"` };
      });
      expect(cover.covered, `contenido tapado por el sticky al final: ${JSON.stringify(cover)}`).toBeLessThanOrEqual(0);

      // Subiendo con el dedo hasta arriba, se oculta.
      for (let i = 0; i < 200 && (await page.evaluate(() => scrollY)) > 0; i++) {
        await page.mouse.wheel(0, -150);
        await page.waitForTimeout(30);
      }
      await expect.poll(async () => (await stickyShown(page)).shown, { message: 'sticky oculto al volver arriba' }).toBe(false);
    });
  }
}

// El hero CTA debe verse sin hacer scroll en un móvil típico (iPhone 13 Safari: 390×664; IG/TikTok in-app ≈ 390×700).
for (const site of SITES) {
  for (const country of ['ES', 'MX'] as const) {
    test(`${site} ${country}: CTA del hero en el primer viewport (390×664)`, async ({ page }) => {
      test.skip(expectedOffers(site, country).length === 0, 'fallback');
      await page.goto(landingUrl(site, country));
      await page.waitForLoadState('networkidle');
      const b = (await page.locator('[id$="-hero-cta"]').boundingBox())!;
      expect(Math.round(b.y + b.height), 'borde inferior del CTA del hero (px)').toBeLessThanOrEqual(page.viewportSize()!.height);
    });

    // Salto de scroll sin pasar por la zona visible (fling rápido, ancla #ofertas, restauración de scroll):
    // el IntersectionObserver no notifica si el elemento pasa de "debajo" a "encima" sin intersectar.
    test(`${site} ${country}: sticky aparece tras un salto de scroll`, async ({ page }) => {
      test.skip(expectedOffers(site, country).length === 0, 'fallback');
      await page.goto(landingUrl(site, country));
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.scrollTo(0, 1600));
      await expect(page.locator('[data-sticky-cta]')).toHaveAttribute('data-visible', 'true', { timeout: 3000 });
    });
  }
}
