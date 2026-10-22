'use client';
import { useEffect } from 'react';
import { initTracking, track, type TrackingContext } from '@/lib/tracking/client';

export function PageTracker(ctx: TrackingContext) {
  const { site, country, locale, variant } = ctx;
  useEffect(() => {
    initTracking({ site, country, locale, variant });
    track({ name: 'pageview', referrer: document.referrer || undefined });
    const sent = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + innerHeight) / h.scrollHeight) * 100;
      for (const d of [25, 50, 75, 100] as const) {
        if (pct >= d - 1 && !sent.has(d)) {
          sent.add(d);
          track({ name: 'scroll_depth', depth: d });
        }
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [site, country, locale, variant]);
  // Respaldo del pageview sin JS (píxel de /api/e). Se pinta en el HTML del servidor.
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/e?s=${site}&c=${country}&l=${locale}&v=${variant}`} alt="" width={1} height={1} />
    </noscript>
  );
}
