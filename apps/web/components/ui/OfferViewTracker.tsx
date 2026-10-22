'use client';
import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { track } from '@/lib/tracking/client';

type Props = HTMLAttributes<HTMLDivElement> & { offerId: string; rank: number; children: ReactNode };

export function OfferViewTracker({ offerId, rank, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.intersectionRatio >= 0.5)) {
          track({ name: 'offer_view', offerId, rank });
          io.disconnect();
        }
      },
      { threshold: [0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [offerId, rank]);
  return (
    <div ref={ref} data-offer-card={offerId} {...rest}>
      {children}
    </div>
  );
}
