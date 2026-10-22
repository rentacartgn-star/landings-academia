// [A2] Landing sin estilos de Fase 0: solo demuestra que los datos llegan. A2 la sustituye por los temas reales.
import { fill, goHref, type LandingProps } from '@la/contracts';

export function PlainLanding(p: LandingProps) {
  const top = p.offers[0];
  const topOp = top ? p.operators[top.operatorId] : undefined;
  return (
    <main data-site={p.site.id} data-country={p.country} data-layout={p.layout}>
      <p>{p.compliance.trustBarText}</p>
      <h1>{p.content.hero.headlineVariants[p.variant]}</h1>
      <p>{p.site.brandName} · {p.country} · {p.locale} · layout {p.layout}</p>
      {p.layout === 'fallback' ? (
        <section><h2>{p.content.fallback.title}</h2><p>{p.content.fallback.body}</p></section>
      ) : (
        <>
          {top && topOp && <a href={goHref(top.id, 'hero')}>{fill(p.content.hero.ctaVariants[p.variant], { operator: topOp.name })}</a>}
          <ol>
            {p.offers.map((o) => (
              <li key={o.id}>
                {p.operators[o.operatorId]?.name} · {o.bonusHeadline} · <a href={goHref(o.id, 'ranking')}>{p.content.offerCard.ctaSecondary}</a>
              </li>
            ))}
          </ol>
        </>
      )}
      <footer>{p.compliance.legalLinks.map((l) => <a key={l.href} href={l.href}>{l.label} </a>)}</footer>
    </main>
  );
}
