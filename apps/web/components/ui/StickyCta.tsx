'use client';
import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';

/** Se muestra cuando el elemento con id `watchId` (el CTA del hero) sale de pantalla. Estilo: `[data-visible=true]`. */
export function StickyCta({ watchId, children, ...rest }: HTMLAttributes<HTMLDivElement> & { watchId: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e && !e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);
  return (
    <div {...rest} data-sticky-cta data-visible={visible} aria-hidden={!visible} inert={!visible}>
      {children}
    </div>
  );
}
