'use client';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { goHref, type Placement } from '@la/contracts';
import { track, flush } from '@/lib/tracking/client';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  offerId: string;
  rank: number;
  placement: Placement;
  children: ReactNode;
};

export function TrackedCta({ offerId, rank, placement, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={goHref(offerId, placement)}
      rel="nofollow sponsored noopener"
      data-cta={placement}
      data-offer={offerId}
      onClick={(e) => {
        track({ name: 'cta_click', offerId, rank, placement });
        flush();
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
