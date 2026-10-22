// [A2] Tarjetas de oferta como "certificado de gemología": filas con guía de puntos, cifras tabulares,
// licencia y condiciones del bono siempre visibles debajo del bono.
import type { CSSProperties, ReactNode } from 'react';
import { fill, type LandingProps, type Offer, type Placement } from '@la/contracts';
import { OfferViewTracker, TrackedCta } from '@/components/ui';
import { GemGlyph } from './Gem';
import s from './diamond.module.css';

type CardProps = { p: LandingProps; offer: Offer; index: number };

export function opName(p: LandingProps, o: Offer) {
  return p.operators[o.operatorId]?.name ?? o.operatorId;
}

/** Etiqueta de licencia del mercado (A5) con la del copy como respaldo. */
export function licLabel(p: LandingProps) {
  return p.compliance.operatorLicenseLabel ?? p.content.offerCard.licenseLabel;
}

/** Condiciones clave + enlace a las completas. Va debajo del bono o del CTA. */
export function Terms({ p, o, className }: { p: LandingProps; o: Offer; className?: string }) {
  return (
    <p className={`${s.terms} ${className ?? ''}`}>
      {o.bonusTermsShort}{' '}
      <a className={s.termsLink} href={o.termsUrl} target="_blank" rel="nofollow noopener">
        {p.content.offerCard.termsLinkLabel}
      </a>
    </p>
  );
}

function validUntil(p: LandingProps, o: Offer) {
  if (!o.validTo) return null;
  const date = new Intl.DateTimeFormat(p.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(o.validTo),
  );
  return (
    <p className={s.valid}>
      <span className={s.validDot} aria-hidden="true" />
      {p.content.offerCard.validUntilLabel} <time dateTime={o.validTo}>{date}</time>
    </p>
  );
}

export function Logo({ p, o, size = 'md' }: { p: LandingProps; o: Offer; size?: 'sm' | 'md' }) {
  const op = p.operators[o.operatorId];
  return (
    <span className={`${s.logo} ${size === 'sm' ? s.logoSm : ''}`}>
      <img src={op?.logoUrl ?? '/operators/placeholder.svg'} alt={opName(p, o)} width={160} height={48} decoding="async" />
    </span>
  );
}

/** Bono (+ condiciones debajo, salvo que el llamador las ponga bajo su CTA). */
export function Bonus({ p, o, big, terms = true }: { p: LandingProps; o: Offer; big?: boolean; terms?: boolean }) {
  return (
    <div className={s.bonus}>
      <p className={s.label}>{p.content.offerCard.bonusLabel}</p>
      <p className={big ? s.bonusBig : s.bonusTitle}>{o.bonusHeadline}</p>
      {terms && <Terms p={p} o={o} />}
      {validUntil(p, o)}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.row}>
      <dt>{label}</dt>
      <span className={s.leader} aria-hidden="true" />
      <dd>{children}</dd>
    </div>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span className={s.rating}>
      <span className={s.pips} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={{ '--f': Math.max(0, Math.min(1, value - i)) } as CSSProperties} />
        ))}
      </span>
      <b>{value.toFixed(1)}</b>
      <span className={s.ratingMax}>/5</span>
    </span>
  );
}

function Specs({ p, o }: { p: LandingProps; o: Offer }) {
  const c = p.content.offerCard;
  const license = p.operators[o.operatorId]?.licenseByCountry[p.country];
  return (
    <dl className={s.specs}>
      {o.payoutSpeed && <Row label={c.payoutLabel}>{o.payoutSpeed}</Row>}
      {o.paymentMethods && o.paymentMethods.length > 0 && (
        <Row label={c.paymentsLabel}>
          <span className={s.chips}>
            {o.paymentMethods.map((m) => (
              <span key={m} className={s.chip}>
                {m}
              </span>
            ))}
          </span>
        </Row>
      )}
      {typeof o.memberRating === 'number' && (
        <Row label={c.ratingLabel}>
          <Rating value={o.memberRating} />
        </Row>
      )}
      {license && <Row label={licLabel(p)}>{license}</Row>}
    </dl>
  );
}

/** Certificado completo: #1 del ranking y oferta única. */
export function Certificate({ p, offer: o, index, placement, badge }: CardProps & { placement: Placement; badge?: boolean }) {
  const name = opName(p, o);
  const ctaText = fill(p.content.hero.ctaVariants[p.variant], { operator: name });
  return (
    <OfferViewTracker offerId={o.id} rank={o.rank} className={s.certWrap} data-dm-reveal="" style={{ '--i': index } as CSSProperties}>
      <article className={`${s.glassCard} ${s.cert}`}>
        <span className={s.certFrame} aria-hidden="true" />
        <span className={s.cardSheen} aria-hidden="true" />
        <header className={s.certHead}>
          <Logo p={p} o={o} />
          <div className={s.certName}>
            <h3>{name}</h3>
            {o.badges && o.badges.length > 0 && (
              <span className={s.chips}>
                {o.badges.map((b) => (
                  <span key={b} className={s.chip}>
                    {b}
                  </span>
                ))}
              </span>
            )}
          </div>
          <span className={s.rankNo} aria-hidden="true">
            {String(o.rank).padStart(2, '0')}
          </span>
        </header>
        {badge && (
          <p className={s.pickBadge}>
            <GemGlyph className={s.pickGlyph} />
            {p.content.ranking.myPickBadge}
          </p>
        )}
        <Bonus p={p} o={o} big terms={false} />
        <Specs p={p} o={o} />
        <TrackedCta offerId={o.id} rank={o.rank} placement={placement} className={s.cta} data-dm-primary="">
          <span>{ctaText}</span>
          <Arrow />
        </TrackedCta>
        <Terms p={p} o={o} className={s.termsUnder} />
      </article>
    </OfferViewTracker>
  );
}

/** Tarjeta compacta del ranking (#2–#4): CTA secundario, nunca del color de acción. */
export function Compact({ p, offer: o, index }: CardProps) {
  const name = opName(p, o);
  const license = p.operators[o.operatorId]?.licenseByCountry[p.country];
  return (
    <OfferViewTracker offerId={o.id} rank={o.rank} className={s.compactWrap} data-dm-reveal="" style={{ '--i': index } as CSSProperties}>
      <article className={`${s.glassCard} ${s.compact}`}>
        <span className={s.cardSheen} aria-hidden="true" />
        <div className={s.compactHead}>
          <span className={s.rankNoSm} aria-hidden="true">
            {String(o.rank).padStart(2, '0')}
          </span>
          <Logo p={p} o={o} size="sm" />
          <h3 className={s.compactName}>{name}</h3>
          {typeof o.memberRating === 'number' && <Rating value={o.memberRating} />}
        </div>
        <Bonus p={p} o={o} />
        <div className={s.compactFoot}>
          {license && (
            <p className={s.license}>
              <span>{licLabel(p)}</span> {license}
            </p>
          )}
          {o.payoutSpeed && (
            <p className={s.license}>
              <span>{p.content.offerCard.payoutLabel}</span> {o.payoutSpeed}
            </p>
          )}
          <TrackedCta offerId={o.id} rank={o.rank} placement="ranking" className={s.ctaGhost}>
            <span>{fill(p.content.offerCard.ctaSecondary, { operator: name })}</span>
            <Arrow />
          </TrackedCta>
        </div>
      </article>
    </OfferViewTracker>
  );
}

export function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
