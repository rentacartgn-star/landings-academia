// [A2] Diamond · "joyería nocturna". Server Component: todo el HTML sale del servidor y el titular pinta sin JS.
// Orden de secciones (BRIEF §9.1): confianza · hero · oferta(s) · cómo elijo · 3 pasos · FAQ · CTA final + JR · footer.
import type { CSSProperties, ReactNode } from 'react';
import { fill, type Country, type LandingProps } from '@la/contracts';
import { COUNTRY_NAMES } from '@la/config/countries';
import { CountrySwitcher, PageTracker, StickyCta, TrackedCta } from '@/components/ui';
import { inter } from './font';
import { cssVars } from './tokens';
import { Gem, GemGlyph } from './Gem';
import { Arrow, Bonus, Certificate, Compact, Logo, Terms, licLabel, opName } from './OfferCards';
import { Motion } from './Motion';
import s from './diamond.module.css';

const HERO_CTA_ID = 'dm-hero-cta';

// Antes del primer pintado: gama baja → sin backdrop-filter ni capas animadas; movimiento si no hay reduced-motion.
const BOOT = `(function(){try{var d=document.documentElement,n=navigator,m=n.deviceMemory||8,c=n.hardwareConcurrency||8,
b=window.CSS&&(CSS.supports('backdrop-filter','blur(1px)')||CSS.supports('-webkit-backdrop-filter','blur(1px)'));
if(m<=2||(m<=4&&c<=4)||!b)d.setAttribute('data-dm-lite','');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.setAttribute('data-dm-motion','')}catch(e){}})()`.replace(/\n/g, '');

function countryName(c: Country, locale: string) {
  if (COUNTRY_NAMES[c]) return COUNTRY_NAMES[c]!;
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(c) ?? c;
  } catch {
    return c;
  }
}

export function DiamondLanding(p: LandingProps) {
  const top = p.offers[0];
  const fallback = p.layout === 'fallback' || !top;
  const cs = p.content.countrySwitcher;
  const switcher = (where: 'hero' | 'footer') => (
    <CountrySwitcher
      current={p.country}
      countries={p.availableCountries}
      labels={{ change: cs.change, modalTitle: cs.modalTitle, searchPlaceholder: cs.searchPlaceholder, close: cs.close }}
      classNames={{
        trigger: where === 'hero' ? s.geoBtn : s.geoBtnFoot,
        dialog: s.dialog,
        title: s.dialogTitle,
        search: s.dialogSearch,
        list: s.dialogList,
        item: s.dialogItem,
        close: s.dialogClose,
      }}
      trigger={
        <>
          <span className={s.geoCode}>{p.country === 'XX' ? '··' : p.country}</span>
          {cs.change}
        </>
      }
    />
  );

  return (
    <div className={`${s.root} ${inter.variable}`} style={cssVars()} data-layout={p.layout}>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <PageTracker site={p.site.id} country={p.country} locale={p.locale} variant={p.variant} />

      {/* Luz de fondo: tres focos muy difusos que derivan despacio (solo transform) */}
      <div className={s.ambient} aria-hidden="true">
        <i className={s.lightA} />
        <i className={s.lightB} />
        <i className={s.lightC} />
      </div>
      {/* Destello que baja por el borde siguiendo el scroll */}
      <div className={s.rail} aria-hidden="true">
        <span className={s.railGlint} data-dm-scroll-glint="" />
      </div>

      <TrustBar p={p} />

      <header className={s.top}>
        <span className={s.wordmark}>
          <GemGlyph className={s.wordGlyph} />
          {p.site.brandName}
        </span>
        <span className={s.handle}>{p.site.handle}</span>
      </header>

      <main className={s.main}>
        <section className={s.hero} aria-labelledby="dm-h1">
          <Gem id="dm-gem-hero" className={s.heroGem} />
          <div className={s.heroText}>
            <div className={s.ident}>
              <Avatar p={p} />
              <p className={s.eyebrow}>{fallback ? p.site.brandName : p.content.hero.eyebrow}</p>
            </div>
            <h1 id="dm-h1" className={s.h1}>
              {fallback ? p.content.fallback.title : p.content.hero.headlineVariants[p.variant]}
            </h1>
            <p className={s.sub}>{fallback ? p.content.fallback.body : p.content.hero.sub}</p>
          </div>

          {!fallback && top ? (
            <div className={s.heroOffer}>
              <div className={`${s.glassCard} ${s.heroChip}`}>
                <span className={s.cardSheen} aria-hidden="true" />
                <div className={s.heroChipHead}>
                  <Logo p={p} o={top} size="sm" />
                  <div>
                    <p className={s.heroOp}>{opName(p, top)}</p>
                    {p.operators[top.operatorId]?.licenseByCountry[p.country] && (
                      <p className={s.heroLic}>
                        {licLabel(p)} · {p.operators[top.operatorId]!.licenseByCountry[p.country]}
                      </p>
                    )}
                  </div>
                </div>
                <Bonus p={p} o={top} terms={false} />
              </div>
              <TrackedCta id={HERO_CTA_ID} offerId={top.id} rank={top.rank} placement="hero" className={`${s.cta} ${s.ctaHero}`}>
                <span>{fill(p.content.hero.ctaVariants[p.variant], { operator: opName(p, top) })}</span>
                <Arrow />
              </TrackedCta>
              <Terms p={p} o={top} className={s.termsUnder} />
              <p className={s.trustLine}>{p.content.hero.trustLine}</p>
              <Geo p={p} name={countryName(p.country, p.locale)}>
                {switcher('hero')}
              </Geo>
            </div>
          ) : (
            <div className={s.heroOffer}>
              <Socials p={p} />
              <Geo p={p} name={countryName(p.country, p.locale)}>
                {switcher('hero')}
              </Geo>
            </div>
          )}
        </section>

        {p.layout === 'single' && top && (
          <section className={`${s.section} ${s.singleSec}`} aria-labelledby="dm-offers">
            <SectionHead id="dm-offers" n={1} title={p.content.ranking.title} sub={p.content.ranking.sub} />
            <div className={s.singleGrid}>
              <Certificate p={p} offer={top} index={0} placement="single" badge />
            </div>
          </section>
        )}

        {p.layout === 'ranking' && top && (
          <section className={s.section} aria-labelledby="dm-offers">
            <SectionHead id="dm-offers" n={1} title={p.content.ranking.title} sub={p.content.ranking.sub} />
            <div className={`${s.rankGrid} ${p.offers.length > 2 ? s.rankMany : ''}`}>
              <Certificate p={p} offer={top} index={0} placement="ranking" badge />
              <div className={s.rankRest}>
                {p.offers.slice(1).map((o, i) => (
                  <Compact key={o.id} p={p} offer={o} index={i + 1} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={s.section} aria-labelledby="dm-how">
          <SectionHead id="dm-how" n={fallback ? 1 : 2} title={p.content.howIChoose.title} />
          <ol className={s.criteria}>
            {p.content.howIChoose.criteria.map((c, i) => (
              <li key={c.title} className={`${s.glassCard} ${s.criterion}`} data-dm-reveal="" style={{ '--i': i } as CSSProperties}>
                <span className={s.cardSheen} aria-hidden="true" />
                <span className={s.critNo} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {!fallback && top && (
          <>
            <section className={s.section} aria-labelledby="dm-steps">
              <SectionHead id="dm-steps" n={3} title={p.content.steps.title} />
              <p className={s.estimate} data-dm-reveal="">
                <span className={s.estimateRing} aria-hidden="true" />
                {p.content.steps.estimate}
              </p>
              <ol className={s.riviera}>
                {p.content.steps.items.map((st, i) => (
                  <li key={st.title} className={s.stone} data-dm-reveal="" style={{ '--i': i } as CSSProperties}>
                    <span className={s.stoneGem} aria-hidden="true">
                      <GemGlyph />
                    </span>
                    <span className={s.stoneNo} aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3>{st.title}</h3>
                    <p>{st.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className={s.section} aria-labelledby="dm-faq">
              <SectionHead id="dm-faq" n={4} title={p.content.faq.title} />
              <div className={s.faq}>
                {p.content.faq.items.map((f, i) => (
                  <details key={f.q} className={s.qa} data-dm-reveal="" style={{ '--i': Math.min(i, 4) } as CSSProperties}>
                    <summary>
                      <span>{f.q}</span>
                      <i className={s.plus} aria-hidden="true" />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className={`${s.section} ${s.finalSec}`} aria-labelledby="dm-final">
              <div className={`${s.glassCard} ${s.final}`} data-dm-reveal="">
                <span className={s.cardSheen} aria-hidden="true" />
                {/* El diamante es marca, nunca premio (RD 958/2020): aquí solo el icono */}
                <span className={s.finalMark} aria-hidden="true">
                  <GemGlyph />
                </span>
                <h2 id="dm-final" className={s.finalTitle}>
                  {p.content.finalCta.title}
                </h2>
                <p className={s.finalSub}>{p.content.finalCta.sub}</p>
                <TrackedCta offerId={top.id} rank={top.rank} placement="final" className={`${s.cta} ${s.ctaFinal}`} data-dm-primary="">
                  <span>{fill(p.content.finalCta.cta, { operator: opName(p, top) })}</span>
                  <Arrow />
                </TrackedCta>
                <Terms p={p} o={top} className={s.termsUnder} />
              </div>
            </section>
          </>
        )}

        <Responsible p={p} />
      </main>

      <Footer p={p}>{switcher('footer')}</Footer>

      {!fallback && top && (
        <StickyCta watchId={HERO_CTA_ID} className={s.sticky}>
          <div className={s.stickyInner}>
            <Logo p={p} o={top} size="sm" />
            <TrackedCta offerId={top.id} rank={top.rank} placement="sticky" className={`${s.cta} ${s.ctaSticky}`}>
              <span>{fill(p.content.stickyCta.label, { operator: opName(p, top) })}</span>
              <Arrow />
            </TrackedCta>
          </div>
        </StickyCta>
      )}
      <Motion />
    </div>
  );
}

function TrustBar({ p }: { p: LandingProps }) {
  const r = p.compliance.regulator;
  return (
    <div className={s.trust} role="note">
      <span className={s.age}>{p.compliance.minAge}+</span>
      <span className={s.trustText}>{p.compliance.trustBarText}</span>
      {r && (
        <a className={s.reg} href={r.url} target="_blank" rel="noopener">
          {r.logoUrl ? <img src={r.logoUrl} alt={r.name} height={16} /> : r.name}
        </a>
      )}
    </div>
  );
}

function Avatar({ p }: { p: LandingProps }) {
  // El logo circular del canal, engastado en un bisel de bronce con cuatro garras, como una sortija.
  const small = p.site.avatarUrl.replace(/logo\.webp$/, 'logo-256.webp');
  return (
    <span className={s.avatar}>
      <img
        src={small}
        srcSet={small !== p.site.avatarUrl ? `${small} 256w, ${p.site.avatarUrl} 640w` : undefined}
        sizes="(min-width: 980px) 84px, 76px"
        alt={p.site.brandName}
        width={84}
        height={84}
        fetchPriority="high"
        decoding="async"
      />
      <i className={s.prong} />
      <i className={s.prong} />
      <i className={s.prong} />
      <i className={s.prong} />
    </span>
  );
}

function Geo({ p, name, children }: { p: LandingProps; name: string; children: ReactNode }) {
  return (
    <div className={s.geo}>
      {p.country !== 'XX' && <span>{fill(p.content.countrySwitcher.notInCountry, { country: name })}</span>}
      {children}
    </div>
  );
}

function SectionHead({ id, n, title, sub }: { id: string; n: number; title: string; sub?: string }) {
  return (
    <header className={s.secHead} data-dm-reveal="">
      <span className={s.secNo} aria-hidden="true">
        <GemGlyph className={s.secGlyph} />
        {String(n).padStart(2, '0')}
      </span>
      <h2 id={id} className={s.h2}>
        {title}
      </h2>
      {sub && <p className={s.secSub}>{sub}</p>}
    </header>
  );
}

function Socials({ p }: { p: LandingProps }) {
  const list = Object.entries(p.site.socials).filter((e): e is [string, string] => typeof e[1] === 'string');
  if (!list.length) return null;
  return (
    <div className={s.socials}>
      <p className={s.label}>{p.content.fallback.socialsTitle}</p>
      <ul>
        {list.map(([k, url]) => (
          <li key={k}>
            <a className={s.ctaGhost} href={url} target="_blank" rel="noopener me">
              <span>{k}</span>
              <Arrow />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Responsible({ p }: { p: LandingProps }) {
  const c = p.compliance;
  return (
    <aside className={s.rg} aria-label={c.trustBarText} data-dm-reveal="">
      <span className={s.ageBig} aria-hidden="true">
        {c.minAge}+
      </span>
      <div>
        {c.mandatoryMessages.map((m) => (
          <p key={m} className={s.rgMsg}>
            {m}
          </p>
        ))}
        <p className={s.rgHelp}>
          <a href={c.helpline.url} target={c.helpline.url.startsWith('http') ? '_blank' : undefined} rel="noopener">
            {c.helpline.name}
          </a>
          {c.helpline.phone && !c.helpline.name.includes(c.helpline.phone) && (
            <>
              {' · '}
              <a href={`tel:${c.helpline.phone.replace(/\s/g, '')}`} className={s.tnum}>
                {c.helpline.phone}
              </a>
            </>
          )}
        </p>
      </div>
    </aside>
  );
}

function Footer({ p, children }: { p: LandingProps; children: ReactNode }) {
  const c = p.compliance;
  return (
    <footer className={s.footer}>
      <div className={s.footTop}>
        <span className={s.wordmark}>
          <GemGlyph className={s.wordGlyph} />
          {p.site.brandName}
        </span>
        <p className={s.tagline}>{p.content.footer.tagline}</p>
      </div>
      {p.offers.length > 0 && (
        <ul className={s.licList}>
          {p.offers.map((o) => {
            const lic = p.operators[o.operatorId]?.licenseByCountry[p.country];
            return (
              <li key={o.id}>
                <b>{opName(p, o)}</b> · {licLabel(p)} {lic}
              </li>
            );
          })}
        </ul>
      )}
      <nav className={s.legal} aria-label={p.content.footer.tagline}>
        {c.legalLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <p className={s.disclaimer}>{p.content.footer.disclaimer}</p>
      <div className={s.footGeo}>{children}</div>
    </footer>
  );
}
