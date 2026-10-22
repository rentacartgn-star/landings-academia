'use client';
// [A2] Único client component propio del tema (~1 KB): pop-in por IntersectionObserver, regla de
// "un solo CTA primario a la vista" (oculta el sticky si hay otro primario en pantalla) y, donde no hay
// scroll-driven animations (Safari antiguo), mueve el destello del scroll con rAF. Solo transform/opacity.
import { useEffect } from 'react';

export function Motion() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-dm-ready', '');
    const motion = html.hasAttribute('data-dm-motion');
    const offs: (() => void)[] = [];

    const items = document.querySelectorAll<HTMLElement>('[data-dm-reveal]');
    if (!motion || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.setAttribute('data-in', ''));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.setAttribute('data-in', '');
            io.unobserve(e.target);
          }
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
      );
      items.forEach((el) => io.observe(el));
      offs.push(() => io.disconnect());
    }

    // CTA primarios fuera del hero: mientras alguno se vea, el sticky se esconde.
    const primaries = document.querySelectorAll('[data-dm-primary]');
    if (primaries.length && typeof IntersectionObserver !== 'undefined') {
      const seen = new Set<Element>();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
        html.toggleAttribute('data-dm-pv', seen.size > 0);
      });
      primaries.forEach((el) => io.observe(el));
      offs.push(() => io.disconnect());
    }

    // Respaldo del destello que sigue al scroll.
    const glint = document.querySelector<HTMLElement>('[data-dm-scroll-glint]');
    if (motion && glint && !CSS.supports('animation-timeline: scroll()')) {
      let raf = 0;
      const paint = () => {
        raf = 0;
        const h = document.documentElement;
        const p = h.scrollTop / Math.max(1, h.scrollHeight - innerHeight);
        glint.style.transform = `translate3d(0, ${(p * (innerHeight - 64)).toFixed(1)}px, 0)`;
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(paint);
      };
      addEventListener('scroll', onScroll, { passive: true });
      paint();
      offs.push(() => removeEventListener('scroll', onScroll));
    }

    return () => offs.forEach((f) => f());
  }, []);
  return null;
}
