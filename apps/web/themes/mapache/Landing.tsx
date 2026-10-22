// [A2] Mapache · Landing (Server Component). Single / ranking / fallback según props.layout.
import { fill, type LandingProps } from '@la/contracts';
import { PageTracker, StickyCta } from '@/components/ui';
import { inter } from './font';
import { cssVars } from './tokens';
import { Fx } from './Fx';
import {
  Brand, Creator, Cta, Eyebrow, Faq, FinalCta, Footer, HERO_CTA_ID, Headline, HowIChoose, LensScene, Mandatory,
  OfferCard, Responsible, SectionHead, Steps, SwitchLine, TrustBar,
} from './parts';
import s from './mapache.module.css';

// Antes del primer pintado: marca JS, degrada el cristal en Android de gama baja y deja una red de seguridad
// por si el chunk de Fx no llega (revela todo a los 5 s).
const BOOT = `(function(){var r=document.currentScript.parentNode;r.setAttribute('data-js','');var n=navigator,c=n.hardwareConcurrency||8,m=n.deviceMemory||8;if(/Android/i.test(n.userAgent)&&(c<=4||m<=4))r.setAttribute('data-lite','');setTimeout(function(){if(!r.hasAttribute('data-fx'))r.querySelectorAll('[data-reveal]').forEach(function(e){e.setAttribute('data-in','')})},5000)})()`;

export function MapacheLanding(p: LandingProps) {
  const c = p.content;
  const top = p.offers[0];
  const topOp = top ? p.operators[top.operatorId] : undefined;
  const hasOffer = p.layout !== 'fallback' && !!top && !!topOp;
  const heroCtaLabel = topOp ? fill(c.hero.ctaVariants[p.variant], { operator: topOp.name }) : '';

  return (
    <div
      className={`${inter.variable} ${s.root}`}
      style={cssVars()}
      data-mapache-root=""
      data-layout={p.layout}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <PageTracker site={p.site.id} country={p.country} locale={p.locale} variant={p.variant} />
      <TrustBar p={p} />

      <main className={s.main}>
        {/* ───── Hero ───── */}
        <section className={`${s.hero} ${hasOffer ? '' : s.heroFallback}`} data-lens-scope="">
          <LensScene />
          <div className={s.heroTop}>
            <Brand p={p} />
          </div>

          {hasOffer && top && topOp ? (
            <div className={s.heroGrid}>
              <div className={s.heroCopy}>
                <Eyebrow>{c.hero.eyebrow}</Eyebrow>
                <Headline text={c.hero.headlineVariants[p.variant]} />
                <p className={s.heroSub}>{c.hero.sub}</p>
                <Creator p={p} />
              </div>
              <div className={s.heroOffer}>
                <OfferCard
                  p={p}
                  offer={top}
                  op={topOp}
                  kind="hero"
                  reveal={false}
                  details={p.layout === 'single'}
                  cta={
                    <Cta
                      id={HERO_CTA_ID}
                      offer={top}
                      placement={p.layout === 'single' ? 'single' : 'hero'}
                      label={heroCtaLabel}
                    />
                  }
                />
                <Mandatory p={p} />
                <SwitchLine p={p} />
              </div>
            </div>
          ) : (
            <div className={s.heroGrid}>
              <div className={s.heroCopy}>
                <Eyebrow>{c.hero.eyebrow}</Eyebrow>
                <Headline text={c.fallback.title} />
                <p className={s.heroSub}>{c.fallback.body}</p>
                <Creator p={p} />
              </div>
              <div className={s.heroOffer}>
                <div className={`${s.glass} ${s.fallbackCard}`}>
                  <img className={s.fallbackLogo} src={p.site.avatarUrl} alt={p.site.brandName} width={640} height={640} fetchPriority="high" />
                  {Object.keys(p.site.socials).length > 0 && (
                    <>
                      <p className={s.label}>{c.fallback.socialsTitle}</p>
                      <ul className={s.socials}>
                        {(Object.entries(p.site.socials) as [string, string | undefined][])
                          .filter(([, u]) => !!u)
                          .map(([k, u]) => (
                            <li key={k}>
                              <a href={u} target="_blank" rel="noopener me" className={s.ctaGhost}>
                                <span className={s.ctaLabel}>{k}</span>
                              </a>
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                  {/* TODO(sergi): redes reales de Mapache en packages/config/src/sites.ts (socials) para que aparezcan aquí. */}
                  <SwitchLine p={p} className={s.fallbackSwitch} />
                </div>
                <Mandatory p={p} />
              </div>
            </div>
          )}
        </section>

        {/* ───── Botín (ranking) ───── */}
        {p.layout === 'ranking' && (
          <section className={s.section} aria-labelledby="m-loot">
            <SectionHead title={c.ranking.title} sub={c.ranking.sub} />
            <div className={s.loot}>
              {p.offers.map((o, i) => {
                const op = p.operators[o.operatorId];
                if (!op) return null;
                const first = o.rank === 1;
                return (
                  <OfferCard
                    key={o.id}
                    p={p}
                    offer={o}
                    op={op}
                    index={i}
                    kind={first ? 'featured' : 'compact'}
                    details={first}
                    cta={
                      first ? (
                        <Cta offer={o} placement="ranking" label={heroCtaLabel} />
                      ) : (
                        <Cta offer={o} placement="ranking" primary={false} label={fill(c.offerCard.ctaSecondary, { operator: op.name })} />
                      )
                    }
                  />
                );
              })}
            </div>
          </section>
        )}

        <HowIChoose p={p} />
        {hasOffer && <Steps p={p} />}
        {hasOffer && <Faq p={p} />}
        {hasOffer && top && topOp ? (
          <FinalCta p={p} offer={top} op={topOp} />
        ) : (
          <section className={s.section}>
            <Responsible p={p} />
          </section>
        )}
      </main>

      <Footer p={p} />

      {hasOffer && top && topOp && (
        <StickyCta watchId={HERO_CTA_ID} className={s.sticky}>
          <div className={s.stickyTray}>
            <Cta offer={top} placement="sticky" label={fill(c.stickyCta.label, { operator: topOp.name })} />
          </div>
        </StickyCta>
      )}
      <Fx />
    </div>
  );
}
