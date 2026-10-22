// [A2] DonPool · "La mesa privada". Server Component: la página entera es HTML + CSS; el único JS de cliente
// son las primitivas de components/ui y dos scripts inline mínimos (motion y modo lite).
import type { CSSProperties, ReactNode } from 'react';
import { fill, type LandingProps, type Offer } from '@la/contracts';
import { COUNTRY_NAMES } from '@la/config/countries';
import { CountrySwitcher, OfferViewTracker, PageTracker, StickyCta, TrackedCta } from '@/components/ui';
import { inter } from './font';
import { css } from './styles';
import { HEAD_SCRIPT, TAIL_SCRIPT } from './scripts';
import { cssVars } from './tokens';
import { Arrow, Ball, Bonus, OpHead, Sights, SocialIcon, Specs, rankKind, splitHeadline } from './parts';

const HERO_CTA_ID = 'dp-hero-cta';
const SOCIAL_NAMES: Record<string, string> = { tiktok: 'TikTok', instagram: 'Instagram', telegram: 'Telegram', youtube: 'YouTube' };

/** Nombre del país fuera de la lista de COUNTRY_NAMES (p. ej. FR → Francia). */
function regionName(code: string): string {
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Landing(p: LandingProps) {
  const { content: c, compliance: k } = p;
  const top = p.offers[0];
  const topOp = top ? p.operators[top.operatorId] : undefined;
  const opName = topOp?.name ?? '';
  const countryName = COUNTRY_NAMES[p.country] ?? regionName(p.country);
  const fallback = p.layout === 'fallback' || !top || !topOp;

  return (
    <div className={`dp ${inter.variable}`} data-layout={p.layout}>
      <style dangerouslySetInnerHTML={{ __html: `.dp{${cssVars()}}${css}` }} />
      <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      <PageTracker site={p.site.id} country={p.country} locale={p.locale} variant={p.variant} />

      {/* Fondo fijo: tapete con fieltro, luz de lámpara y viñeta */}
      <div className="dp-bg" aria-hidden="true">
        <span className="dp-lamp dp-lamp--a" />
        <span className="dp-lamp dp-lamp--b" />
        <span className="dp-lamp dp-lamp--c" />
      </div>

      <TrustBar p={p} />

      <header className="dp-top">
        <div className="dp-who">
          <span className="dp-avatar dp-avatar--sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.site.avatarUrl} alt={p.site.memberName} width={40} height={40} />
          </span>
          <span className="dp-who__txt">
            <strong>{p.site.brandName}</strong>
            <span>{p.site.handle}</span>
          </span>
        </div>
      </header>

      <main>
        {fallback ? (
          <FallbackHero p={p} countryName={countryName} />
        ) : (
          <>
            <Hero p={p} offer={top} countryName={countryName} />
            {p.layout === 'single' ? <SingleSpec p={p} offer={top} /> : <Ranking p={p} />}
          </>
        )}

        <HowIChoose p={p} />

        {!fallback && (
          <>
            <Steps p={p} />
            <Faq p={p} />
            <section id="dp-final" className="dp-sec dp-final">
              <div className="dp-glass dp-final__card" data-pop>
                <div className="dp-final__balls" aria-hidden="true">
                  <Ball kind="eight" n={8} size={64} className="dp-final__eight" />
                  <Ball kind="cue" size={46} className="dp-final__cue" />
                </div>
                <h2 className="dp-h2">{c.finalCta.title}</h2>
                <p className="dp-lede">{c.finalCta.sub}</p>
                <TrackedCta className="dp-cta dp-cta--lg" offerId={top.id} rank={top.rank} placement="final">
                  <span>{fill(c.finalCta.cta, { operator: opName })}</span>
                  <Arrow />
                </TrackedCta>
              </div>
            </section>
          </>
        )}

        <Responsible p={p} />
      </main>

      <Footer p={p} countryName={countryName} />

      {!fallback && (
        <StickyCta watchId={HERO_CTA_ID} className="dp-sticky">
          <div className="dp-sticky__dock">
            <TrackedCta className="dp-cta dp-cta--block" offerId={top.id} rank={top.rank} placement="sticky">
              <span>{fill(c.stickyCta.label, { operator: opName })}</span>
              <Arrow />
            </TrackedCta>
          </div>
        </StickyCta>
      )}

      <script dangerouslySetInnerHTML={{ __html: TAIL_SCRIPT }} />
    </div>
  );
}

// ───────────────────────── Secciones ─────────────────────────

function TrustBar({ p }: { p: LandingProps }) {
  const r = p.compliance.regulator;
  return (
    <div className="dp-trust">
      <span>{p.compliance.trustBarText}</span>
      {r && (
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="dp-trust__reg">
          {r.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.logoUrl} alt={r.name} height={16} />
          ) : (
            r.name
          )}
        </a>
      )}
    </div>
  );
}

function Switch({ p, trigger, className }: { p: LandingProps; trigger?: ReactNode; className?: string }) {
  const cs = p.content.countrySwitcher;
  return (
    <CountrySwitcher
      current={p.country}
      countries={p.availableCountries}
      labels={{ change: cs.change, modalTitle: cs.modalTitle, searchPlaceholder: cs.searchPlaceholder, close: cs.close }}
      trigger={trigger}
      classNames={{
        trigger: className ?? 'dp-switch',
        dialog: 'dp-dialog',
        title: 'dp-dialog__title',
        search: 'dp-dialog__search',
        list: 'dp-dialog__list',
        item: 'dp-dialog__item',
        close: 'dp-dialog__close',
      }}
    />
  );
}

function CountryLine({ p, countryName }: { p: LandingProps; countryName: string }) {
  return (
    <div className="dp-country">
      <span>{fill(p.content.countrySwitcher.notInCountry, { country: countryName })}</span> <Switch p={p} />
    </div>
  );
}

function Headline({ text, as: Tag = 'h1' }: { text: string; as?: 'h1' | 'h2' }) {
  const [a, b] = splitHeadline(text);
  return (
    <Tag className="dp-h1">
      <span className="dp-h1__a">{a}</span>
      {b && (
        <>
          {' '}
          <span className="dp-h1__b">{b}</span>
        </>
      )}
    </Tag>
  );
}

function Hero({ p, offer, countryName }: { p: LandingProps; offer: Offer; countryName: string }) {
  const c = p.content;
  const op = p.operators[offer.operatorId]!;
  const card = (
    <div className="dp-glass dp-table">
      <OpHead p={p} op={op} />
      <Bonus
        p={p}
        offer={offer}
        size="xl"
        cta={
          <TrackedCta id={HERO_CTA_ID} className="dp-cta dp-cta--lg dp-cta--block" offerId={offer.id} rank={offer.rank} placement="hero">
            <span>{fill(c.hero.ctaVariants[p.variant], { operator: op.name })}</span>
            <Arrow />
          </TrackedCta>
        }
      />
    </div>
  );
  return (
    <section className="dp-hero">
      <div className="dp-hero__copy">
        <p className="dp-eyebrow">
          <Sights /> {c.hero.eyebrow}
        </p>
        <Headline text={c.hero.headlineVariants[p.variant]} />
        <p className="dp-lede dp-hero__sub">{c.hero.sub}</p>
      </div>
      <div className="dp-stage">
        {/* Bolas: unas detrás del cristal (se ven refractadas), otras delante */}
        <span className="dp-par dp-par--1"><span className="dp-in dp-in--1"><Ball kind="cue" size={92} className="dp-float" /></span></span>
        <span className="dp-par dp-par--2"><span className="dp-in dp-in--2"><Ball kind="brass" n={1} size={70} className="dp-float dp-float--b" /></span></span>
        <span className="dp-par dp-par--3"><span className="dp-in dp-in--3"><Ball kind="eight" n={8} size={78} className="dp-float dp-float--c" /></span></span>
        <span className="dp-par dp-par--4"><span className="dp-in dp-in--4"><Ball kind="stripe" n={11} size={48} className="dp-float dp-float--b" /></span></span>
        <div className="dp-stage__card">
          {p.layout === 'single' ? (
            <OfferViewTracker offerId={offer.id} rank={offer.rank} className="dp-track">
              {card}
            </OfferViewTracker>
          ) : (
            card
          )}
        </div>
      </div>
      <div className="dp-hero__foot">
        <p className="dp-trustline">{c.hero.trustLine}</p>
        <CountryLine p={p} countryName={countryName} />
      </div>
    </section>
  );
}

/** Single: la ficha técnica de la única casa, estilo página de producto. */
function SingleSpec({ p, offer }: { p: LandingProps; offer: Offer }) {
  const op = p.operators[offer.operatorId]!;
  return (
    <section className="dp-sec dp-spec">
      <div className="dp-spec__head" data-pop>
        <Ball kind={rankKind(1)} n={1} size={56} />
        <OpHead p={p} op={op} large />
      </div>
      <div className="dp-glass dp-spec__card" data-pop style={i(1)}>
        <Bonus
          p={p}
          offer={offer}
          size="md"
          cta={
            <TrackedCta className="dp-cta2" offerId={offer.id} rank={offer.rank} placement="single">
              <span>{fill(p.content.offerCard.ctaSecondary, { operator: op.name })}</span>
              <Arrow />
            </TrackedCta>
          }
        />
        <Specs p={p} offer={offer} op={op} />
      </div>
    </section>
  );
}

function Ranking({ p }: { p: LandingProps }) {
  const c = p.content;
  const [first, ...rest] = p.offers;
  return (
    <section className="dp-sec dp-ranking">
      <header className="dp-sec__head" data-pop>
        <Sights />
        <h2 className="dp-h2">{c.ranking.title}</h2>
        <p className="dp-lede">{c.ranking.sub}</p>
      </header>
      {first && <Featured p={p} offer={first} />}
      <div className={`dp-rest dp-rest--${rest.length}`}>
        {rest.map((o, n) => (
          <Compact key={o.id} p={p} offer={o} idx={n + 1} />
        ))}
      </div>
    </section>
  );
}

function Featured({ p, offer }: { p: LandingProps; offer: Offer }) {
  const op = p.operators[offer.operatorId]!;
  return (
    <OfferViewTracker offerId={offer.id} rank={offer.rank} className="dp-track" data-pop style={i(0)}>
      <article className="dp-glass dp-feat">
        <span className="dp-badge">
          <Sights /> {p.content.ranking.myPickBadge}
        </span>
        <Ball kind={rankKind(offer.rank)} n={offer.rank} size={84} className="dp-feat__ball" />
        <OpHead p={p} op={op} large />
        <div className="dp-feat__body">
          <Bonus p={p} offer={offer} size="md" />
          <Specs p={p} offer={offer} op={op} withLicense={false} />
        </div>
        <TrackedCta className="dp-cta2 dp-cta2--strong" offerId={offer.id} rank={offer.rank} placement="ranking">
          <span>{fill(p.content.offerCard.ctaSecondary, { operator: op.name })}</span>
          <Arrow />
        </TrackedCta>
      </article>
    </OfferViewTracker>
  );
}

function Compact({ p, offer, idx }: { p: LandingProps; offer: Offer; idx: number }) {
  const op = p.operators[offer.operatorId]!;
  return (
    <OfferViewTracker offerId={offer.id} rank={offer.rank} className="dp-track" data-pop style={i(idx)}>
      <article className="dp-glass dp-compact">
        <div className="dp-compact__top">
          <Ball kind={rankKind(offer.rank)} n={offer.rank} size={46} />
          <OpHead p={p} op={op} />
        </div>
        <Bonus p={p} offer={offer} size="sm" />
        <Specs p={p} offer={offer} op={op} withLicense={false} />
        <TrackedCta className="dp-cta2" offerId={offer.id} rank={offer.rank} placement="ranking">
          <span>{fill(p.content.offerCard.ctaSecondary, { operator: op.name })}</span>
          <Arrow />
        </TrackedCta>
      </article>
    </OfferViewTracker>
  );
}

function HowIChoose({ p }: { p: LandingProps }) {
  const h = p.content.howIChoose;
  return (
    <section className="dp-sec dp-how">
      <header className="dp-sec__head" data-pop>
        <Sights />
        <h2 className="dp-h2">{h.title}</h2>
      </header>
      <ol className={`dp-how__grid dp-how__grid--${h.criteria.length}`}>
        {h.criteria.map((cr, n) => (
          <li key={cr.title} className="dp-glass dp-crit" data-pop style={i(n)}>
            <span className="dp-crit__n" aria-hidden="true">
              {String(n + 1).padStart(2, '0')}
            </span>
            <h3 className="dp-h3">{cr.title}</h3>
            <p>{cr.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Steps({ p }: { p: LandingProps }) {
  const s = p.content.steps;
  return (
    <section className="dp-sec dp-steps-sec">
      <header className="dp-sec__head" data-pop>
        <Sights />
        <h2 className="dp-h2">{s.title}</h2>
        <p className="dp-estimate">
          <span className="dp-estimate__dot" aria-hidden="true" />
          {s.estimate}
        </p>
      </header>
      <ol className="dp-steps" data-pop>
        <span className="dp-steps__line" aria-hidden="true" />
        <span className="dp-steps__cue" aria-hidden="true">
          <Ball kind="cue" size={30} />
        </span>
        {s.items.map((it, n) => (
          <li key={it.title} className="dp-step">
            <Ball kind={rankKind(n + 1)} n={n + 1} size={56} className="dp-step__ball" />
            <div>
              <h3 className="dp-h3">{it.title}</h3>
              <p>{it.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Faq({ p }: { p: LandingProps }) {
  const f = p.content.faq;
  return (
    <section className="dp-sec dp-faq">
      <header className="dp-sec__head" data-pop>
        <Sights />
        <h2 className="dp-h2">{f.title}</h2>
      </header>
      <div className="dp-glass dp-faq__list" data-pop style={i(1)}>
        {f.items.map((q) => (
          <details key={q.q} className="dp-qa">
            <summary>
              <span>{q.q}</span>
              <span className="dp-qa__icon" aria-hidden="true" />
            </summary>
            <p>{q.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Juego responsable: mensajes obligatorios + línea de ayuda, siempre visibles. */
function Responsible({ p }: { p: LandingProps }) {
  const k = p.compliance;
  return (
    <section className="dp-sec dp-rg" aria-label={k.trustBarText}>
      <div className="dp-rg__inner">
        <span className="dp-rg__age" aria-hidden="true">
          +{k.minAge}
        </span>
        <div>
          {k.mandatoryMessages.map((m) => (
            <p key={m} className="dp-rg__msg">
              {m}
            </p>
          ))}
          <p className="dp-rg__help">
            <a href={k.helpline.url} target={k.helpline.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              {k.helpline.name}
            </a>
            {k.helpline.phone && !k.helpline.name.includes(k.helpline.phone) && (
              <>
                {' · '}
                <a href={`tel:${k.helpline.phone.replace(/\s+/g, '')}`}>{k.helpline.phone}</a>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function FallbackHero({ p, countryName }: { p: LandingProps; countryName: string }) {
  const f = p.content.fallback;
  const socials = Object.entries(p.site.socials).filter(([, url]) => !!url) as [string, string][];
  return (
    <section className="dp-hero dp-hero--fallback">
      <div className="dp-fb__stage" aria-hidden="true">
        <span className="dp-in dp-in--2"><Ball kind="eight" n={8} size={70} className="dp-float dp-fb__b8" /></span>
        <span className="dp-in dp-in--3"><Ball kind="brass" n={1} size={46} className="dp-float dp-float--b dp-fb__b1" /></span>
      </div>
      <span className="dp-avatar dp-avatar--xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.site.avatarUrl} alt={p.site.memberName} width={132} height={132} />
      </span>
      <p className="dp-eyebrow">
        <Sights /> {p.content.hero.eyebrow}
      </p>
      <Headline text={f.title} />
      <p className="dp-lede">{f.body}</p>
      <div className="dp-fb__switch">
        <Switch
          p={p}
          className="dp-cta2 dp-cta2--strong"
          trigger={
            <>
              <span>{fill(p.content.countrySwitcher.notInCountry, { country: countryName })}</span>
              <span className="dp-fb__change">{p.content.countrySwitcher.change}</span>
            </>
          }
        />
      </div>
      {socials.length > 0 && (
        <div className="dp-socials">
          <p className="dp-label">{f.socialsTitle}</p>
          <ul>
            {socials.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAMES[name] ?? name} className="dp-social">
                  <SocialIcon name={name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Footer({ p, countryName }: { p: LandingProps; countryName: string }) {
  const k = p.compliance;
  return (
    <footer className="dp-foot">
      <div className="dp-foot__inner">
        <div className="dp-foot__brand">
          <Ball kind="cue" size={22} />
          <strong>{p.site.brandName}</strong>
        </div>
        <p className="dp-foot__tag">{p.content.footer.tagline}</p>
        <Sights className="dp-foot__sights" />
        <p className="dp-foot__disc">{p.content.footer.disclaimer}</p>
        <nav className="dp-foot__legal">
          {k.legalLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="dp-foot__row">
          <span className="dp-foot__age">{k.trustBarText}</span>
          {k.regulator && (
            <a href={k.regulator.url} target="_blank" rel="noopener noreferrer">
              {k.regulator.name}
            </a>
          )}
          <a href={k.helpline.url} rel="noopener noreferrer">
            {k.helpline.name}
          </a>
          <Switch
            p={p}
            className="dp-switch dp-switch--chip"
            trigger={
              <>
                <span className="dp-switch__flag" aria-hidden="true" />
                {countryName} · {p.content.countrySwitcher.change}
              </>
            }
          />
        </div>
      </div>
    </footer>
  );
}
