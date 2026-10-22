'use client';
import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Se muestra cuando el elemento con id `watchId` (el CTA del hero) queda por encima de la pantalla.
 * Estilo: `[data-visible=true]`. Se recalcula en scroll/resize (con rAF) y no solo con IntersectionObserver,
 * porque un salto de scroll (fling, ancla, restauración) puede cruzar el CTA sin que llegue a intersectar.
 */
export function StickyCta({ watchId, children, ...rest }: HTMLAttributes<HTMLDivElement> & { watchId: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      setVisible(el.getBoundingClientRect().bottom < 0);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [watchId]);
  return (
    <div {...rest} data-sticky-cta data-visible={visible} aria-hidden={!visible} inert={!visible}>
      {children}
    </div>
  );
}
