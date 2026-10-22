'use client';
// [A2] Mapache · único client component del tema (~2 KB): linterna que sigue al dedo/cursor, pop-in al entrar en
// pantalla y ocultación del sticky cuando ya hay otro CTA primario a la vista. Solo mueve transform/opacity.
import { useEffect } from 'react';

export function Fx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-mapache-root]');
    if (!root) return;
    root.setAttribute('data-fx', '');
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = root.hasAttribute('data-lite');
    const offs: Array<() => void> = [];

    // Pop-in tarjeta a tarjeta (el stagger lo pone el CSS con --i).
    const reveal = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '');
            reveal.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );
    root.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => reveal.observe(el));
    offs.push(() => reveal.disconnect());

    // Un solo CTA primario a la vista: si el del ranking o el final están en pantalla, el sticky se esconde.
    const seen = new Set<Element>();
    const prim = new IntersectionObserver((es) => {
      for (const e of es) (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
      root.toggleAttribute('data-primary-in', seen.size > 0);
    });
    root.querySelectorAll('[data-primary]').forEach((el) => prim.observe(el));
    offs.push(() => prim.disconnect());

    offs.push(flashlight(root, rm, lite));
    return () => offs.forEach((f) => f());
  }, []);
  return null;
}

/** Linterna: el haz se mueve con transform y su interior contra-transformado deja el plano fijo (revela, no arrastra). */
function flashlight(root: HTMLElement, rm: boolean, lite: boolean): () => void {
  const scope = root.querySelector<HTMLElement>('[data-lens-scope]');
  const beam = scope?.querySelector<HTMLElement>('[data-lens]');
  const inner = beam?.querySelector<HTMLElement>('[data-lens-inner]');
  if (!scope || !beam || !inner) return () => {};

  let W = 0, H = 0, L = 0;
  const measure = () => {
    W = scope.clientWidth;
    H = scope.clientHeight;
    L = beam.offsetWidth;
    inner.style.width = `${W}px`;
    inner.style.height = `${H}px`;
  };
  measure();

  let x = rm ? W * 0.7 : W + L * 0.2, y = rm ? H * 0.3 : H * 0.12;
  let tx = x, ty = y;
  const paint = () => {
    const ox = x - L / 2, oy = y - L / 2;
    beam.style.transform = `translate3d(${ox}px,${oy}px,0)`;
    inner.style.transform = `translate3d(${-ox}px,${-oy}px,0)`;
  };
  paint();
  beam.setAttribute('data-on', '');

  const ro = new ResizeObserver(() => { measure(); paint(); });
  ro.observe(scope);
  if (rm) return () => ro.disconnect();

  let raf = 0, visible = true, lastInput = -1e9;
  const t0 = performance.now();
  const loop = (now: number) => {
    raf = 0;
    const idle = now - lastInput > 2600;
    if (idle && !lite) {
      // Deriva lenta tipo "ronda de vigilancia" alrededor del titular.
      const t = (now - t0) / 1000;
      tx = W * (0.52 + 0.34 * Math.sin(t * 0.33));
      ty = H * (0.36 + 0.18 * Math.sin(t * 0.51 + 1.1));
    }
    const k = idle ? 0.035 : 0.14;
    x += (tx - x) * k;
    y += (ty - y) * k;
    paint();
    const settled = Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5;
    if (visible && (!settled || (idle && !lite))) raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };
  const aim = (cx: number, cy: number) => {
    const r = scope.getBoundingClientRect();
    tx = cx - r.left;
    ty = cy - r.top;
    lastInput = performance.now();
    kick();
  };
  const onPointer = (e: PointerEvent) => { if (e.pointerType === 'mouse') aim(e.clientX, e.clientY); };
  const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) aim(t.clientX, t.clientY); };
  addEventListener('pointermove', onPointer, { passive: true });
  scope.addEventListener('touchstart', onTouch, { passive: true });
  scope.addEventListener('touchmove', onTouch, { passive: true });

  const io = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    if (visible) kick();
    else if (raf) { cancelAnimationFrame(raf); raf = 0; }
  });
  io.observe(scope);
  if (lite) { tx = W * 0.6; ty = H * 0.3; }
  kick();

  return () => {
    ro.disconnect();
    io.disconnect();
    if (raf) cancelAnimationFrame(raf);
    removeEventListener('pointermove', onPointer);
    scope.removeEventListener('touchstart', onTouch);
    scope.removeEventListener('touchmove', onTouch);
  };
}
