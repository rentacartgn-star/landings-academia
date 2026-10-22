// [A2] DonPool · piezas visuales (Server Components). Todo texto llega por props desde `content`.
import type { CSSProperties, ReactNode } from 'react';
import type { LandingProps, Offer, Operator } from '@la/contracts';

/** Corte diagonal: el motivo gráfico del tema (tres trazos inclinados, el primero en rojo). */
export function Slash({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`dp-slash ${className}`}>
      <i />
      <i />
      <i />
    </span>
  );
}

/** Dorsal del ranking: número grande inclinado sobre un corte diagonal. */
export function RankTag({ rank, large }: { rank: number; large?: boolean }) {
  return (
    <span aria-hidden="true" className={`dp-rank${rank === 1 ? ' dp-rank--1' : ''}${large ? ' dp-rank--lg' : ''}`}>
      <span>{String(rank).padStart(2, '0')}</span>
    </span>
  );
}

/** Balón clásico (pentágonos), dibujo propio. Decorativo. */
export function Football({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={`dp-ballfx ${className}`} width={size} height={size} viewBox="0 0 64 64">
      <defs>
        <radialGradient id="dpBallG" cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".62" stopColor="#e9e9ec" />
          <stop offset="1" stopColor="#8d8d95" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#dpBallG)" />
      <path fill="#0c0c0e" d="M32 21.5l9 6.5-3.4 10.6H26.4L23 28z" />
      <path
        fill="#0c0c0e"
        d="M32 2.2c3.2 0 6.3.5 9.2 1.5L32 10.4l-9.2-6.7A30 30 0 0 1 32 2.2zM56.5 15.6a30 30 0 0 1 5 13.5l-8.8 3-3.5-10.6zM58 46.3a30 30 0 0 1-9.7 10.9l-3.2-9.3 9-6.6zM19 57.4a30 30 0 0 1-9.9-10.6l4-6.4 8.9 6.6zM2.6 29.3a30 30 0 0 1 5.1-13.6l6.6 6.3-3.5 10.6z"
      />
      <path
        stroke="#0c0c0e"
        strokeWidth="1.4"
        fill="none"
        d="M32 10.4v11.1M41 28l11.2-6.1M37.6 38.6l7.5 9.3M26.4 38.6l-4.4 8.4M23 28l-8.7-6M22.8 3.7l9.2 6.7 9.2-6.7"
      />
      <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1" />
      <ellipse cx="23" cy="17" rx="10" ry="6" fill="#fff" opacity=".55" transform="rotate(-30 23 17)" />
    </svg>
  );
}

/** Líneas de campo (medio campo + círculo central) detrás del logo. */
export function Pitch({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`dp-pitch ${className}`} viewBox="0 0 600 600" fill="none" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(255,255,255,.09)" strokeWidth="1.5">
        <circle cx="300" cy="300" r="214" />
        <circle cx="300" cy="300" r="4" fill="rgba(255,255,255,.18)" />
        <path d="M300 -40v680" />
        <circle cx="300" cy="300" r="290" strokeDasharray="2 10" stroke="rgba(227,18,27,.35)" />
      </g>
    </svg>
  );
}

/** Logo del canal tal cual (circular). `priority` si está en el primer viewport. */
export function MemberLogo({ p, size, priority, className = '' }: { p: LandingProps; size: number; priority?: boolean; className?: string }) {
  const src = p.site.avatarUrl;
  const small = /logo\.webp$/.test(src) ? src.replace(/logo\.webp$/, 'logo-256.webp') : null;
  return (
    <span className={`dp-logo ${className}`} style={{ '--ls': `${size}px` } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={small ? `${small} 256w, ${src} 640w` : undefined}
        sizes={`${size}px`}
        alt={p.site.brandName}
        width={size}
        height={size}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
      />
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

/** Placa clara con el logo del operador. */
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

/** Nota 0–5 con cinco puntos que se llenan. */
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
