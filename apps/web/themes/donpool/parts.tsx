// [A2] DonPool · piezas visuales (Server Components). Todo texto llega por props desde `content`.
import type { CSSProperties, ReactNode } from 'react';
import type { LandingProps, Offer, Operator } from '@la/contracts';

export type BallKind = 'cue' | 'eight' | 'brass' | 'ink' | 'ox' | 'plum' | 'stripe';

/** Bola de billar con reflejo 3D falso, solo CSS. Decorativa. */
export function Ball({ kind, n, size, className = '', style }: { kind: BallKind; n?: number; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className={`dp-ball dp-ball--${kind} ${className}`}
      data-n={n}
      style={{ ...(size ? ({ '--s': `${size}px` } as CSSProperties) : null), ...style }}
    />
  );
}

/** Color de bola por posición del ranking (1 latón, 2 tinta, 3 burdeos, 4 ciruela). */
export function rankKind(rank: number): BallKind {
  return (['brass', 'ink', 'ox', 'plum'] as const)[rank - 1] ?? 'brass';
}

/** Marcadores de baranda (los "diamantes" de la mesa) como separador. */
export function Sights({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`dp-sights ${className}`}>
      <i />
      <i />
      <i />
    </span>
  );
}

/** Divide el titular en su primera frase y el resto, para tratarlas con dos tintas. */
export function splitHeadline(t: string): [string, string] {
  const m = t.match(/^(.+?[.:])\s+(.+)$/);
  return m ? [m[1]!, m[2]!] : [t, ''];
}

export function Arrow() {
  return (
    <svg aria-hidden="true" className="dp-arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3.5 9h10.5M10 4.5 14.5 9 10 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function formatDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

/** Placa de latón con el logo del operador. */
export function Plaque({ op, large }: { op: Operator; large?: boolean }) {
  return (
    <span className={`dp-plaque${large ? ' dp-plaque--lg' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={op.logoUrl} alt={op.name} width={160} height={48} loading="lazy" decoding="async" />
    </span>
  );
}

/** Etiqueta de licencia del mercado (compliance) con respaldo en el copy. */
export function licenseLabel(p: LandingProps): string {
  return p.compliance.operatorLicenseLabel ?? p.content.offerCard.licenseLabel;
}

/** Bono + condiciones visibles justo debajo + enlace a las condiciones + vigencia real. */
export function Bonus({ p, offer, size = 'md', cta }: { p: LandingProps; offer: Offer; size?: 'xl' | 'md' | 'sm'; cta?: ReactNode }) {
  const c = p.content.offerCard;
  return (
    <div className={`dp-bonus dp-bonus--${size}`}>
      <p className="dp-label">{c.bonusLabel}</p>
      <p className="dp-bonus__h">{offer.bonusHeadline}</p>
      {/* Hero/single: el CTA va entre el bono y sus condiciones, que quedan justo debajo del botón */}
      {cta}
      <p className="dp-terms">
        {offer.bonusTermsShort}{' '}
        <a href={offer.termsUrl} target="_blank" rel="nofollow noopener noreferrer">
          {c.termsLinkLabel}
        </a>
      </p>
      {offer.validTo && (
        <p className="dp-valid">
          <span aria-hidden="true" className="dp-valid__dot" />
          {c.validUntilLabel} <time dateTime={offer.validTo}>{formatDate(offer.validTo, p.locale)}</time>
        </p>
      )}
    </div>
  );
}

/** Ficha técnica: retirada, métodos, licencia y nota. Solo pinta lo que existe. */
export function Specs({ p, offer, op, withLicense = true }: { p: LandingProps; offer: Offer; op: Operator; withLicense?: boolean }) {
  const c = p.content.offerCard;
  const license = op.licenseByCountry[p.country];
  const rows: { k: string; v: ReactNode }[] = [];
  if (offer.payoutSpeed) rows.push({ k: c.payoutLabel, v: offer.payoutSpeed });
  if (offer.paymentMethods?.length)
    rows.push({
      k: c.paymentsLabel,
      v: (
        <span className="dp-chips">
          {offer.paymentMethods.map((m) => (
            <span key={m} className="dp-chip">
              {m}
            </span>
          ))}
        </span>
      ),
    });
  if (withLicense && license) rows.push({ k: licenseLabel(p), v: license });
  if (typeof offer.memberRating === 'number') rows.push({ k: c.ratingLabel, v: <Rating value={offer.memberRating} locale={p.locale} /> });
  if (!rows.length) return null;
  return (
    <dl className="dp-specs">
      {rows.map((r) => (
        <div key={r.k} className="dp-specs__row">
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Nota 0–5 con cinco bolas que se llenan. */
export function Rating({ value, locale }: { value: number; locale: string }) {
  const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
  return (
    <span className="dp-rating">
      <span className="dp-rating__n">{fmt}</span>
      <span className="dp-rating__of">/5</span>
      <span aria-hidden="true" className="dp-rating__dots" style={{ '--v': value / 5 } as CSSProperties}>
        <i /><i /><i /><i /><i />
      </span>
    </span>
  );
}

/** Licencia del operador junto a su nombre. */
export function OpHead({ p, op, large }: { p: LandingProps; op: Operator; large?: boolean }) {
  const license = op.licenseByCountry[p.country];
  return (
    <div className="dp-op">
      <Plaque op={op} large={large} />
      <div className="dp-op__txt">
        <p className="dp-op__name">{op.name}</p>
        {license && (
          <p className="dp-op__lic">
            <span>{licenseLabel(p)}</span> {license}
          </p>
        )}
      </div>
    </div>
  );
}

/** Iconos de redes (marcas, sin texto de copy). */
export function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    tiktok: 'M14 3c.4 2.3 1.9 3.8 4 4v3c-1.5 0-2.9-.5-4-1.3V15a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3h3z',
    instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-2.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
    telegram: 'M21 4 3 11l5 2 2 6 3-4 5 4 3-15zM9 13l8-6-6 7',
    youtube: 'M3 8.5C3 6.6 4.6 5 6.5 5h11C19.4 5 21 6.6 21 8.5v7c0 1.9-1.6 3.5-3.5 3.5h-11C4.6 19 3 17.4 3 15.5v-7zM10 9v6l5-3-5-3z',
  };
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[name] ?? ''} fillRule="evenodd" />
    </svg>
  );
}
