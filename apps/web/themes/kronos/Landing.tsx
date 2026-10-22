// [A2] Kronos · Landing (Server Component). Todo el texto sale de props; la estética, de kronos.module.css + tokens.ts.
// Cliente: solo las primitivas de components/ui. El motion va en dos scripts inline (scripts.ts), sin bundle;
// por eso los nodos que esos scripts marcan (data-in, data-kr-hide) llevan suppressHydrationWarning.
import type { CSSProperties, ReactNode } from 'react';
import { fill, type LandingProps, type Offer, type Placement } from '@la/contracts';
import { COUNTRY_NAMES } from '@la/config/countries';
import { CountrySwitcher, OfferViewTracker, PageTracker, StickyCta, TrackedCta } from '@/components/ui';
import { inter } from './font';
import { cssVars, tokens } from './tokens';
import { Dial, Ring, Shield, ringVar } from './Dial';
import { headScript, TAIL_SCRIPT } from './scripts';
import s from './kronos.module.css';

const HERO_CTA_ID = 'kr-hero-cta';
const pad = (n: number) => String(n).padStart(2, '0');
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
/** Retraso del pop-in en cascada. */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

/** "01 · Licencia verificada" → ["01", "Licencia verificada"]; sin prefijo numera por posición. */
function splitIndexed(title: string, i: number): [string, string] {
  const m = /^(\d{1,2})\s*·\s*(.+)$/.exec(title);
  return m ? [m[1]!, m[2]!] : [pad(i + 1), title];
}

function Arrow() {
  return (
    <svg className={s.ctaArrow} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Corona del reloj: marca mínima del sitio. */
function Crown() {
  return (
    <svg className={s.crown} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray=".6 2.3" />
      <path d="M12 12V5.5M12 12l3.6 2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.4" className={s.crownDot} />
    </svg>
  );
}

function Section({ id, index, title, sub, children, className }: { id: string; index: number; title: string; sub?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cx(s.section, className)} aria-labelledby={`${id}-t`}>
      <header className={s.sectionHead} data-pop="" suppressHydrationWarning style={stagger(0)}>
        <span className={s.sectionIdx} aria-hidden="true">{pad(index)}</span>
        <h2 id={`${id}-t`} className={s.h2}>{title}</h2>
        {sub ? <p className={s.sectionSub}>{sub}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function KronosLanding(p: LandingProps) {
  const c = p.content;
  const comp = p.compliance;
  const isFallback = p.layout === 'fallback' || p.offers.length === 0;
  const top = isFallback ? undefined : p.offers[0];
  const topOp = top ? p.operators[top.operatorId] : undefined;
  const countryName = COUNTRY_NAMES[p.country] ?? p.country;
  const total = p.offers.length;
  const dateFmt = new Intl.DateTimeFormat(p.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const numFmt = new Intl.NumberFormat(p.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const switchLabels = { change: c.countrySwitcher.change, modalTitle: c.countrySwitcher.modalTitle, searchPlaceholder: c.countrySwitcher.searchPlaceholder, close: c.countrySwitcher.close };
  const switchClasses = { trigger: s.switchBtn, dialog: s.dialog, title: s.dialogTitle, search: s.dialogSearch, list: s.dialogList, item: s.dialogItem, close: s.dialogClose };
  const licenseLabel = comp.operatorLicenseLabel ?? c.offerCard.licenseLabel;
  const opName = (o: Offer) => p.operators[o.operatorId]?.name ?? '';

  const switcher = (
    <CountrySwitcher current={p.country} countries={p.availableCountries} labels={switchLabels} classNames={switchClasses} />
  );

  /** Condiciones del bono + enlace + fecha real de validez (única urgencia permitida). */
  const terms = (o: Offer) => (
    <>
      <p className={s.terms}>
        {o.bonusTermsShort}{' '}
        <a href={o.termsUrl} target="_blank" rel="nofollow noopener" className={s.termsLink}>{c.offerCard.termsLinkLabel}</a>
      </p>
      {o.validTo ? (
        <p className={s.valid}>
          {c.offerCard.validUntilLabel} <time dateTime={o.validTo}>{dateFmt.format(new Date(o.validTo))}</time>
        </p>
      ) : null}
    </>
  );

  // ── Tarjeta de oferta destacada (single y #1 del ranking) ──
  const featured = (o: Offer, placement: Placement, opts: { id?: string; badge?: string; label: string }) => {
    const op = p.operators[o.operatorId];
    const license = op?.licenseByCountry[p.country];
    return (
      <OfferViewTracker offerId={o.id} rank={o.rank} className={s.popCard} data-pop="" suppressHydrationWarning style={stagger(1)}>
        <article className={cx(s.glass, s.card, s.cardFeatured)}>
          <span className={s.specular} aria-hidden="true" />
          {total > 1 || opts.badge ? (
            <header className={s.cardHead}>
              <span className={s.rankNum}>
                {pad(o.rank)}
                <small>/{pad(total)}</small>
              </span>
              {opts.badge ? <span className={s.badge}><Crown />{opts.badge}</span> : null}
            </header>
          ) : null}
          <div className={s.opRow}>
            <span className={s.logo}>
              <img src={op?.logoUrl} alt={op?.name ?? ''} width={160} height={48} decoding="async" />
            </span>
            <div className={s.opMeta}>
              <strong className={s.opName}>{op?.name}</strong>
              {license ? (
                <span className={s.license}>
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {licenseLabel} · {license}
                </span>
              ) : null}
            </div>
          </div>
          <div className={s.bonus}>
            <span className={s.label}>{c.offerCard.bonusLabel}</span>
            <p className={s.bonusHead}>{o.bonusHeadline}</p>
            <TrackedCta id={opts.id} offerId={o.id} rank={o.rank} placement={placement} className={s.cta} data-kr-primary="">
              <span>{opts.label}</span>
              <Arrow />
            </TrackedCta>
            {terms(o)}
          </div>
          <dl className={s.specs}>
            {o.payoutSpeed ? (
              <div className={s.spec}><dt>{c.offerCard.payoutLabel}</dt><dd>{o.payoutSpeed}</dd></div>
            ) : null}
            {o.paymentMethods?.length ? (
              <div className={s.spec}><dt>{c.offerCard.paymentsLabel}</dt><dd>{o.paymentMethods.join(' · ')}</dd></div>
            ) : null}
            {typeof o.memberRating === 'number' ? (
              <div className={s.spec}>
                <dt>{c.offerCard.ratingLabel}</dt>
                <dd className={s.rating}>
                  <span>{numFmt.format(o.memberRating)}<small>/5</small></span>
                  <i className={s.ratingBar} aria-hidden="true"><i style={{ transform: `scaleX(${o.memberRating / 5})` }} /></i>
                </dd>
              </div>
            ) : null}
          </dl>
        </article>
      </OfferViewTracker>
    );
  };

  // ── Tarjeta compacta (#2–#4) ──
  const compact = (o: Offer, i: number) => {
    const op = p.operators[o.operatorId];
    const license = op?.licenseByCountry[p.country];
    return (
      <OfferViewTracker key={o.id} offerId={o.id} rank={o.rank} className={s.popCard} data-pop="" suppressHydrationWarning style={stagger(i + 2)}>
        <article className={cx(s.glass, s.card, s.cardCompact)}>
          <span className={s.specular} aria-hidden="true" />
          <div className={s.compactTop}>
            <span className={s.rankNumSm}>{pad(o.rank)}</span>
            <span className={cx(s.logo, s.logoSm)}>
              <img src={op?.logoUrl} alt={op?.name ?? ''} width={160} height={48} loading="lazy" decoding="async" />
            </span>
            <div className={s.opMeta}>
              <strong className={s.opNameSm}>{op?.name}</strong>
              {license ? <span className={s.licenseSm}>{licenseLabel} · {license}</span> : null}
            </div>
          </div>
          <div className={s.bonusSm}>
            <span className={s.label}>{c.offerCard.bonusLabel}</span>
            <p className={s.bonusHeadSm}>{o.bonusHeadline}</p>
            {terms(o)}
          </div>
          {o.payoutSpeed || o.paymentMethods?.length || typeof o.memberRating === 'number' ? (
            <dl className={cx(s.specs, s.specsSm)}>
              {o.payoutSpeed ? <div className={s.spec}><dt>{c.offerCard.payoutLabel}</dt><dd>{o.payoutSpeed}</dd></div> : null}
              {o.paymentMethods?.length ? <div className={s.spec}><dt>{c.offerCard.paymentsLabel}</dt><dd>{o.paymentMethods.join(' · ')}</dd></div> : null}
              {typeof o.memberRating === 'number' ? <div className={s.spec}><dt>{c.offerCard.ratingLabel}</dt><dd>{numFmt.format(o.memberRating)}/5</dd></div> : null}
            </dl>
          ) : null}
          <TrackedCta offerId={o.id} rank={o.rank} placement="ranking" className={s.ctaGhost}>
            <span>{fill(c.offerCard.ctaSecondary, { operator: opName(o) })}</span>
            <Arrow />
          </TrackedCta>
        </article>
      </OfferViewTracker>
    );
  };

  const creator = (
    <div className={cx(s.creator, isFallback && s.creatorBig)}>
      <Shield src={p.site.avatarUrl} alt={p.site.memberName} priority />
      <span className={s.creatorText}>
        <strong>{p.site.brandName}</strong>
        <span>{p.site.handle}</span>
      </span>
    </div>
  );

  const countryLine = (
    <div className={s.countryLine}>
      <span className={s.flagDot} aria-hidden="true" />
      <span>{fill(c.countrySwitcher.notInCountry, { country: countryName })}</span>
      {switcher}
    </div>
  );

  const heroLabel = topOp ? fill(c.hero.ctaVariants[p.variant], { operator: topOp.name }) : '';
  const helpline = (
    <p className={s.helpline}>
      <a href={comp.helpline.url}>{comp.helpline.name}</a>
      {comp.helpline.phone && !comp.helpline.name.includes(comp.helpline.phone) ? <> · <a href={`tel:${comp.helpline.phone.replace(/\s/g, '')}`}>{comp.helpline.phone}</a></> : null}
    </p>
  );

  let sec = 1;
  const socials = Object.entries(p.site.socials).filter(([, url]) => !!url) as [string, string][];

  return (
    <div className={cx(inter.variable, s.root)} style={cssVars()} data-layout={isFallback ? 'fallback' : p.layout}>
      <script dangerouslySetInnerHTML={{ __html: headScript(tokens.colors.bg) }} />
      <PageTracker site={p.site.id} country={p.country} locale={p.locale} variant={p.variant} />

      {/* Escenario fijo: luz, cuadrícula técnica y la esfera */}
      <div className={s.stage} aria-hidden="true">
        <i className={cx(s.glow, s.glowA)} />
        <i className={cx(s.glow, s.glowB)} />
        <i className={cx(s.glow, s.glowC)} />
        <i className={s.grid} />
        <Dial center={isFallback || p.layout === 'ranking' ? <Shield src={p.site.avatarUrl} alt="" /> : undefined} />
        <i className={s.vignette} />
      </div>

      <div className={s.trust} role="note">
        <span className={s.trustText}>{comp.trustBarText}</span>
        {comp.regulator ? (
          <a className={s.regulator} href={comp.regulator.url} target="_blank" rel="noopener">
            {comp.regulator.logoUrl ? <img src={comp.regulator.logoUrl} alt={comp.regulator.name} height={16} /> : comp.regulator.name}
          </a>
        ) : null}
      </div>

      <header className={s.top}>
        <span className={s.wordmark}><Crown />{p.site.shortName}</span>
        <span className={s.topMeta}>{countryName}</span>
      </header>

      <main className={s.main}>
        {/* ── Hero ── */}
        <section className={cx(s.hero, !isFallback && p.layout === 'single' && s.heroSingle)}>
          <div className={s.heroText}>
            {creator}
            <p className={s.eyebrow}><span className={s.eyebrowDot} aria-hidden="true" />{c.hero.eyebrow}</p>
            <h1 className={s.h1}>{isFallback ? c.fallback.title : c.hero.headlineVariants[p.variant]}</h1>
            <p className={s.sub}>{isFallback ? c.fallback.body : c.hero.sub}</p>

            {!isFallback && top && topOp && p.layout === 'ranking' ? (
              <div className={cx(s.glass, s.strip)}>
                <span className={s.specular} aria-hidden="true" />
                <div className={s.stripTop}>
                  <span className={s.rankNumSm}>{pad(top.rank)}</span>
                  <strong className={s.opNameSm}>{topOp.name}</strong>
                  <span className={s.badge}><Crown />{c.ranking.myPickBadge}</span>
                </div>
                <TrackedCta id={HERO_CTA_ID} offerId={top.id} rank={top.rank} placement="hero" className={s.cta} data-kr-primary="">
                  <span>{heroLabel}</span>
                  <Arrow />
                </TrackedCta>
                <div className={s.stripTerms}>
                  <p className={s.stripBonus}>{top.bonusHeadline}</p>
                  {terms(top)}
                </div>
              </div>
            ) : null}

            {!isFallback ? <p className={s.trustLine}>{c.hero.trustLine}</p> : null}

            {isFallback && socials.length ? (
              <div className={s.socials}>
                <p className={s.label}>{c.fallback.socialsTitle}</p>
                <ul>
                  {socials.map(([k, url]) => (
                    <li key={k}><a href={url} target="_blank" rel="noopener" className={s.socialBtn}>{k}</a></li>
                  ))}
                </ul>
              </div>
            ) : null}

            {countryLine}
          </div>

          {!isFallback && top && topOp && p.layout === 'single' ? (
            <div className={s.heroCard}>{featured(top, 'single', { id: HERO_CTA_ID, label: heroLabel })}</div>
          ) : null}
        </section>

        {/* ── Ranking ── */}
        {!isFallback && p.layout === 'ranking' && top && topOp ? (
          <Section id="kr-ranking" index={sec++} title={c.ranking.title} sub={c.ranking.sub}>
            <div className={s.rankGrid}>
              {featured(top, 'ranking', { badge: c.ranking.myPickBadge, label: heroLabel })}
              {p.offers.length > 1 ? <div className={s.rankRest}>{p.offers.slice(1).map(compact)}</div> : null}
            </div>
          </Section>
        ) : null}

        {/* ── Cómo elijo ── */}
        <Section id="kr-method" index={sec++} title={c.howIChoose.title}>
          <ol className={s.criteria}>
            {c.howIChoose.criteria.map((cr, i) => {
              const [n, t] = splitIndexed(cr.title, i);
              return (
                <li key={cr.title} className={cx(s.glass, s.criterion)} data-pop="" suppressHydrationWarning style={stagger(i + 1)}>
                  <span className={s.specular} aria-hidden="true" />
                  <Ring id={`c${i}`} label={n} total={c.howIChoose.criteria.length} />
                  <div>
                    <h3 className={s.h3}>{t}</h3>
                    <p className={s.body}>{cr.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        {!isFallback && top && topOp ? (
          <>
            {/* ── 3 pasos ── */}
            <Section id="kr-steps" index={sec++} title={c.steps.title} sub={<span className={s.estimate}><Crown />{c.steps.estimate}</span>}>
              <div className={s.stepsWrap} data-ring="steps" style={ringVar('steps')}>
                <i className={s.stepsRail} aria-hidden="true"><i /></i>
                <ol className={s.steps}>
                {c.steps.items.map((st, i) => (
                  <li key={st.title} className={s.step} data-pop="" suppressHydrationWarning style={stagger(i + 1)}>
                    <span className={s.stepNode} aria-hidden="true">{pad(i + 1)}</span>
                    <div className={cx(s.glass, s.stepCard)}>
                      <span className={s.specular} aria-hidden="true" />
                      <h3 className={s.h3}>{st.title}</h3>
                      <p className={s.body}>{st.body}</p>
                    </div>
                  </li>
                ))}
                </ol>
              </div>
            </Section>

            {/* ── FAQ ── */}
            <Section id="kr-faq" index={sec++} title={c.faq.title}>
              <div className={s.faq}>
                {c.faq.items.map((f, i) => (
                  <details key={f.q} className={cx(s.glass, s.qa)} data-pop="" suppressHydrationWarning style={stagger(Math.min(i, 4) + 1)}>
                    <summary className={s.q}>
                      <span>{f.q}</span>
                      <i className={s.plus} aria-hidden="true" />
                    </summary>
                    <p className={s.a}>{f.a}</p>
                  </details>
                ))}
              </div>
            </Section>

            {/* ── CTA final + juego responsable ── */}
            <section className={s.final} aria-labelledby="kr-final-t">
              <div className={cx(s.glass, s.finalCard)} data-pop="" suppressHydrationWarning style={stagger(0)}>
                <span className={s.specular} aria-hidden="true" />
                <Ring id="fin" label={<Shield src={p.site.avatarUrl} alt="" />} big />
                <h2 id="kr-final-t" className={s.h2Final}>{c.finalCta.title}</h2>
                <p className={s.sectionSub}>{c.finalCta.sub}</p>
                <TrackedCta offerId={top.id} rank={top.rank} placement="final" className={s.cta} data-kr-primary="">
                  <span>{fill(c.finalCta.cta, { operator: topOp.name })}</span>
                  <Arrow />
                </TrackedCta>
                <div className={s.responsible}>
                  <div className={s.responsibleTop}>
                    <span className={s.age}>{comp.minAge}+</span>
                    {helpline}
                  </div>
                  {comp.mandatoryMessages.length ? (
                    <ul className={s.mandatoryList}>
                      {comp.mandatoryMessages.map((m) => <li key={m}>{m}</li>)}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      {/* ── Footer legal ── */}
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <span className={s.wordmark}><Crown />{p.site.shortName}</span>
          <p className={s.tagline}>{c.footer.tagline}</p>
        </div>
        {isFallback && comp.mandatoryMessages.length ? (
          <div className={s.footerMsgs}>{comp.mandatoryMessages.map((m) => <p key={m}>{m}</p>)}</div>
        ) : null}
        <p className={s.disclaimer}>{c.footer.disclaimer}</p>
        <div className={s.footerRow}>
          <span className={s.age}>{comp.minAge}+</span>
          {helpline}
          {comp.regulator ? <a className={s.footerLink} href={comp.regulator.url} target="_blank" rel="noopener">{comp.regulator.name}</a> : null}
        </div>
        <nav className={s.legal}>
          {comp.legalLinks.map((l) => <a key={l.href} href={l.href} className={s.footerLink}>{l.label}</a>)}
        </nav>
        <div className={s.footerCountry}>
          <span className={s.flagDot} aria-hidden="true" />
          <span>{countryName}</span>
          {switcher}
        </div>
      </footer>

      {!isFallback && top && topOp ? (
        <div className={s.stickyWrap} data-kr-sticky="" suppressHydrationWarning>
          <StickyCta watchId={HERO_CTA_ID} className={s.sticky}>
            <div className={cx(s.glass, s.stickyInner)}>
              <TrackedCta offerId={top.id} rank={top.rank} placement="sticky" className={cx(s.cta, s.ctaSticky)}>
                <span>{fill(c.stickyCta.label, { operator: topOp.name })}</span>
                <Arrow />
              </TrackedCta>
            </div>
          </StickyCta>
        </div>
      ) : null}

      <script dangerouslySetInnerHTML={{ __html: TAIL_SCRIPT }} />
    </div>
  );
}
