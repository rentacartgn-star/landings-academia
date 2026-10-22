// [A2] Mapache · piezas de servidor. Ningún texto hardcodeado: todo sale de props.content / compliance / datos.
import type { ReactNode } from 'react';
import { fill, type LandingProps, type Offer, type Operator } from '@la/contracts';
import { COUNTRY_NAMES } from '@la/config/countries';
import { CountrySwitcher, OfferViewTracker, TrackedCta } from '@/components/ui';
import s from './mapache.module.css';

export const HERO_CTA_ID = 'm-hero-cta';

// ───────────── Motivo: la mirada del logo ─────────────
// La marca es la cabeza de mapache del canal (head.webp, tal cual). Glint es un motivo propio derivado de ella:
// los ojos rasgados y afilados, en el dorado del logo. Nada de antifaz (art. 9.2 RD 958/2020).

const EYES = 'M2 5.5 27 12c-4 5.2-16.5 5.4-25-6.5ZM62 5.5 37 12c4 5.2 16.5 5.4 25-6.5Z';

/** Mirada afilada: relleno (marca pequeña) o solo contorno (decoración grande). */
export function Glint({ className, outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 64 20" aria-hidden="true" focusable="false">
      {outline ? (
        <path d={EYES} fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      ) : (
        <>
          <path d={EYES} fill="currentColor" />
          <circle cx="19.5" cy="12.2" r="2.3" fill="#000" fillOpacity=".8" />
          <circle cx="44.5" cy="12.2" r="2.3" fill="#000" fillOpacity=".8" />
        </>
      )}
    </svg>
  );
}

/** Cabeza del logo del canal (PNG original recortado, fondo transparente). */
export function Head({ className, size = 'sm', priority = false }: { className?: string; size?: 'sm' | 'lg'; priority?: boolean }) {
  return size === 'sm' ? (
    <img className={className} src="/mapache/head-96.webp" alt="" width={96} height={73} fetchPriority={priority ? 'high' : undefined} />
  ) : (
    <img className={className} src="/mapache/head.webp" alt="" width={384} height={292} decoding="async" />
  );
}

function Arrow() {
  return (
    <svg className={s.ctaArrow} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ───────────── Utilidades de presentación ─────────────

/** Parte el titular en "a oscuras" + "iluminado" por el primer ". " o ": " (solo presentación del copy de A3). */
export function splitHeadline(h: string): [string, string] {
  const m = /^(.+?[.:])\s+(.+)$/.exec(h);
  return m ? [m[1]!, m[2]!] : ['', h];
}

const pad = (n: number) => String(n).padStart(2, '0');

function fmtDate(iso: string, locale: string) {
  const loc = locale === 'en-US' ? 'es-419' : locale;
  return new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}

function fmtRating(r: number, locale: string) {
  return new Intl.NumberFormat(locale === 'en-US' ? 'es-419' : locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(r);
}

const REGION = new Intl.DisplayNames(['es'], { type: 'region' });

export function countryName(c: string) {
  if (COUNTRY_NAMES[c]) return COUNTRY_NAMES[c];
  try {
    return REGION.of(c) ?? c;
  } catch {
    return c;
  }
}

// ───────────── Barra de confianza ─────────────

export function TrustBar({ p }: { p: LandingProps }) {
  const { compliance: k } = p;
  return (
    <div className={s.trust} role="note">
      <span className={s.trustText}>{k.trustBarText}</span>
      {k.regulator && (
        <a className={s.trustReg} href={k.regulator.url} target="_blank" rel="noopener">
          {k.regulator.logoUrl ? <img src={k.regulator.logoUrl} alt={k.regulator.name} height={14} /> : k.regulator.name}
        </a>
      )}
    </div>
  );
}

// ───────────── Cabecera / marca ─────────────

export function Brand({ p, as = 'div' }: { p: LandingProps; as?: 'div' | 'p' }) {
  const [first, ...rest] = p.site.brandName.split(' ');
  const Tag = as;
  return (
    <Tag className={s.brand}>
      <Head className={s.brandMark} priority={as === 'div'} />
      <span className={s.brandWord}>
        <b>{first}</b>
        {rest.length > 0 && <span>{rest.join(' ')}</span>}
      </span>
    </Tag>
  );
}

export function Creator({ p }: { p: LandingProps }) {
  return (
    <div className={s.creator}>
      <span className={s.avatar}>
        {/* Cabeza del logo (site.avatarUrl completo no se lee a 52 px; se usa en fallback y OG). */}
        <img src="/mapache/head-96.webp" alt={p.site.memberName} width={96} height={73} />
      </span>
      <span className={s.creatorText}>
        <b>
          {p.site.memberName} <span className={s.handle}>{p.site.handle}</span>
        </b>
        <span>{p.content.hero.trustLine}</span>
      </span>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className={s.eyebrow}>
      <i className={s.hair} aria-hidden="true" />
      <span>{children}</span>
      <i className={s.hair} aria-hidden="true" />
    </p>
  );
}

export function Headline({ text, as = 'h1' }: { text: string; as?: 'h1' | 'h2' }) {
  const [dark, lit] = splitHeadline(text);
  const Tag = as;
  return (
    <Tag className={as === 'h1' ? s.h1 : s.h2big}>
      {dark && <span className={s.dark}>{dark} </span>}
      <span className={s.lit}>{lit}</span>
    </Tag>
  );
}

/** Escena del hero: la cabeza del logo y la "letra pequeña", casi invisibles a oscuras; la linterna (data-lens) las revela. */
export function LensScene() {
  return (
    <>
      <div className={s.scene} aria-hidden="true">
        <i className={s.glowA} />
        <i className={s.glowB} />
        <div className={s.plan} />
        <Head size="lg" className={s.ghost} />
      </div>
      <div className={s.lens} data-lens aria-hidden="true">
        <div className={s.lensInner} data-lens-inner>
          <div className={`${s.plan} ${s.planLit}`} />
          <Head size="lg" className={`${s.ghost} ${s.ghostLit}`} />
        </div>
      </div>
    </>
  );
}

export function SwitchLine({ p, className }: { p: LandingProps; className?: string }) {
  const cs = p.content.countrySwitcher;
  return (
    <div className={`${s.switchLine} ${className ?? ''}`}>
      <span>{fill(cs.notInCountry, { country: countryName(p.country) })}</span>{' '}
      <CountrySwitcher
        current={p.country}
        countries={p.availableCountries}
        labels={{ change: cs.change, modalTitle: cs.modalTitle, searchPlaceholder: cs.searchPlaceholder, close: cs.close }}
        classNames={{
          trigger: s.switchBtn,
          dialog: s.dialog,
          title: s.dialogTitle,
          search: s.dialogSearch,
          list: s.dialogList,
          item: s.dialogItem,
          close: s.dialogClose,
        }}
      />
    </div>
  );
}

export function Mandatory({ p }: { p: LandingProps }) {
  if (!p.compliance.mandatoryMessages.length) return null;
  return (
    <ul className={s.mandatory}>
      {p.compliance.mandatoryMessages.map((m) => (
        <li key={m}>{m}</li>
      ))}
    </ul>
  );
}

// ───────────── CTA ─────────────

type CtaProps = {
  offer: Offer;
  placement: 'hero' | 'single' | 'ranking' | 'sticky' | 'final';
  label: string;
  primary?: boolean;
  id?: string;
};

export function Cta({ offer, placement, label, primary = true, id }: CtaProps) {
  return (
    <TrackedCta
      id={id}
      offerId={offer.id}
      rank={offer.rank}
      placement={placement}
      className={primary ? s.cta : s.ctaGhost}
      data-primary={primary && placement !== 'sticky' && placement !== 'hero' && placement !== 'single' ? '' : undefined}
    >
      <span className={s.ctaLabel}>{label}</span>
      <span className={s.ctaIcon}>
        <Arrow />
      </span>
    </TrackedCta>
  );
}

// ───────────── Tarjeta de oferta ─────────────

type CardKind = 'hero' | 'featured' | 'compact';

export function OfferCard({
  p,
  offer,
  op,
  kind,
  cta,
  details = true,
  reveal = true,
  index = 0,
}: {
  p: LandingProps;
  offer: Offer;
  op: Operator;
  kind: CardKind;
  cta: ReactNode;
  details?: boolean;
  reveal?: boolean;
  index?: number;
}) {
  const oc = p.content.offerCard;
  const license = op.licenseByCountry[p.country];
  const licenseLabel = p.compliance.operatorLicenseLabel ?? oc.licenseLabel;
  const showBadge = p.layout === 'ranking' && offer.rank === 1;
  return (
    <OfferViewTracker
      offerId={offer.id}
      rank={offer.rank}
      className={`${s.glass} ${s.card} ${s[`card_${kind}`]}`}
      data-reveal={reveal ? '' : undefined}
      style={{ ['--i' as string]: index }}
    >
      <div className={s.cardHead}>
        <span className={s.lot} aria-hidden="true">
          {pad(offer.rank)}
        </span>
        <img className={s.logo} src={op.logoUrl} alt={op.name} width={120} height={36} />
        <span className={s.opName}>{op.name}</span>
        {showBadge && (
          <span className={s.badge}>
            <Glint className={s.badgeMark} />
            {p.content.ranking.myPickBadge}
          </span>
        )}
      </div>

      <div className={s.bonus}>
        <span className={s.label}>{oc.bonusLabel}</span>
        <p className={s.bonusHead}>{offer.bonusHeadline}</p>
        {kind === 'hero' && <div className={s.cardCta}>{cta}</div>}
        <p className={s.terms}>
          {offer.bonusTermsShort}{' '}
          <a href={offer.termsUrl} target="_blank" rel="nofollow noopener" className={s.termsLink}>
            {oc.termsLinkLabel}
          </a>
        </p>
        {offer.validTo && (
          <p className={s.valid}>
            {oc.validUntilLabel} <time dateTime={offer.validTo}>{fmtDate(offer.validTo, p.locale)}</time>
          </p>
        )}
      </div>

      {details && (
        <dl className={s.facts}>
          {offer.payoutSpeed && (
            <div>
              <dt>{oc.payoutLabel}</dt>
              <dd>{offer.payoutSpeed}</dd>
            </div>
          )}
          {offer.paymentMethods && offer.paymentMethods.length > 0 && (
            <div className={s.factWide}>
              <dt>{oc.paymentsLabel}</dt>
              <dd className={s.chips}>
                {offer.paymentMethods.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </dd>
            </div>
          )}
          {typeof offer.memberRating === 'number' && (
            <div>
              <dt>{oc.ratingLabel}</dt>
              <dd className={s.rating}>
                <b>{fmtRating(offer.memberRating, p.locale)}</b>
                <span className={s.ratingBar} aria-hidden="true">
                  <i style={{ transform: `scaleX(${offer.memberRating / 5})` }} />
                </span>
              </dd>
            </div>
          )}
          {license && (
            <div className={s.factWide}>
              <dt>{licenseLabel}</dt>
              <dd className={s.license}>{license}</dd>
            </div>
          )}
        </dl>
      )}
      {!details && license && (
        <p className={s.licenseLine}>
          <span>{licenseLabel}</span> {license}
        </p>
      )}

      {kind !== 'hero' && <div className={s.cardCta}>{cta}</div>}
    </OfferViewTracker>
  );
}

// ───────────── Secciones ─────────────

export function SectionHead({ title, sub, aside }: { title: string; sub?: string; aside?: ReactNode }) {
  return (
    <header className={s.secHead} data-reveal="">
      <i className={s.secMark} aria-hidden="true" />
      <h2 className={s.h2}>{title}</h2>
      {sub && <p className={s.secSub}>{sub}</p>}
      {aside}
    </header>
  );
}

export function HowIChoose({ p }: { p: LandingProps }) {
  const h = p.content.howIChoose;
  return (
    <section className={s.section} aria-labelledby="m-how">
      <SectionHead title={h.title} />
      <ol className={s.criteria}>
        {h.criteria.map((c, i) => (
          <li key={c.title} className={`${s.glass} ${s.criterion}`} data-reveal="" style={{ ['--i' as string]: i }}>
            <span className={s.critNum} aria-hidden="true">
              {pad(i + 1)}
            </span>
            <h3 className={s.h3}>{c.title}</h3>
            <p>{c.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Steps({ p }: { p: LandingProps }) {
  const st = p.content.steps;
  return (
    <section className={s.section}>
      <SectionHead
        title={st.title}
        aside={
          <p className={s.estimate}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {st.estimate}
          </p>
        }
      />
      <ol className={s.route}>
        {st.items.map((it, i) => (
          <li key={it.title} className={s.stop} data-reveal="" style={{ ['--i' as string]: i }}>
            <span className={s.stopNode} aria-hidden="true">
              {i + 1}
            </span>
            <div className={`${s.glass} ${s.stopCard}`}>
              <h3 className={s.h3}>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Faq({ p }: { p: LandingProps }) {
  const f = p.content.faq;
  return (
    <section className={s.section}>
      <SectionHead title={f.title} />
      <div className={s.faq}>
        {f.items.map((it, i) => (
          <details key={it.q} className={`${s.glass} ${s.qa}`} data-reveal="" style={{ ['--i' as string]: Math.min(i, 4) }}>
            <summary>
              <span>{it.q}</span>
              <i className={s.plus} aria-hidden="true" />
            </summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Responsible({ p }: { p: LandingProps }) {
  const k = p.compliance;
  return (
    <div className={s.responsible}>
      <Glint className={s.respMark} />
      <p>
        <span>{k.trustBarText}</span>{' '}
        <a href={k.helpline.url} target={k.helpline.url.startsWith('http') ? '_blank' : undefined} rel="noopener">
          {k.helpline.name}
        </a>
        {k.helpline.phone && !k.helpline.name.includes(k.helpline.phone) && (
          <>
            {' · '}
            <a href={`tel:${k.helpline.phone.replace(/\s/g, '')}`}>{k.helpline.phone}</a>
          </>
        )}
      </p>
    </div>
  );
}

export function FinalCta({ p, offer, op }: { p: LandingProps; offer: Offer; op: Operator }) {
  const f = p.content.finalCta;
  return (
    <section className={s.section}>
      <div className={`${s.glass} ${s.final}`} data-reveal="">
        <div className={s.finalSpot} aria-hidden="true" />
        <Head size="lg" className={s.finalMark} />
        <Headline text={f.title} as="h2" />
        <p className={s.finalSub}>{f.sub}</p>
        <Cta offer={offer} placement="final" label={fill(f.cta, { operator: op.name })} />
        <Mandatory p={p} />
        <Responsible p={p} />
      </div>
    </section>
  );
}

export function Footer({ p }: { p: LandingProps }) {
  const k = p.compliance;
  return (
    <footer className={s.footer}>
      <div className={s.footTop}>
        <Brand p={p} as="p" />
        <p className={s.tagline}>{p.content.footer.tagline}</p>
      </div>
      <SwitchLine p={p} className={s.footSwitch} />
      <nav className={s.legal} aria-label={k.trustBarText}>
        {k.legalLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {k.regulator && !k.legalLinks.some((l) => l.href === k.regulator!.url) && (
          <a href={k.regulator.url} target="_blank" rel="noopener">
            {k.regulator.name}
          </a>
        )}
        {!k.legalLinks.some((l) => l.href === k.helpline.url) && <a href={k.helpline.url}>{k.helpline.name}</a>}
      </nav>
      <p className={s.disclaimer}>{p.content.footer.disclaimer}</p>
      <p className={s.footAge}>{k.trustBarText}</p>
    </footer>
  );
}
