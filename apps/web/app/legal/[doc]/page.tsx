// [A5] Páginas legales por sitio (host) y mercado (cookie lp_country → x-vercel-ip-country).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COUNTRY_NAMES } from '@la/config';
import { getCompliance, LEGAL_DOCS, type LegalDoc } from '@/lib/compliance';
import { LEGAL_ENTITIES, LEGAL_UPDATED } from '@/lib/compliance/legal-entity';
import { getLegalContext } from '../_lib/context';
import { DOCS, DOC_TITLES } from '../_lib/docs';

type Props = {
  params: Promise<{ doc: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const isDoc = (d: string): d is LegalDoc => (LEGAL_DOCS as readonly string[]).includes(d);

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { doc } = await params;
  if (!isDoc(doc)) return {};
  const { site } = await getLegalContext(await searchParams);
  return {
    title: `${DOC_TITLES[doc]} · ${site.shortName}`,
    robots: { index: false, follow: true },
    // RD 958/2020 art. 23.2: identificador para controles parentales (contenido para adultos).
    other: { rating: 'adult' },
  };
}

export default async function LegalPage({ params, searchParams }: Props) {
  const { doc } = await params;
  if (!isDoc(doc)) notFound();
  const ctx = await getLegalContext(await searchParams);
  const { site, country, locale } = ctx;
  const compliance = getCompliance(country, locale);
  const Body = DOCS[doc];
  const marketLabel = locale === 'es-ES' ? 'España' : COUNTRY_NAMES[country] ?? 'Internacional';

  return (
    <main className="lg-wrap">
      <p className="lg-trust">
        {compliance.trustBarText} ·{' '}
        <a href={compliance.helpline.url} target={compliance.helpline.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
          {compliance.helpline.name}
        </a>
      </p>
      <article className="lg-card">
        <header className="lg-head">
          <a className="lg-brand" href="/">
            ← {site.brandName}
          </a>
          <h1>{DOC_TITLES[doc]}</h1>
          <p className="lg-meta">
            Versión para {marketLabel} · Última actualización:{' '}
            <time dateTime={LEGAL_UPDATED}>{new Date(LEGAL_UPDATED).toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'UTC' })}</time>
          </p>
        </header>
        <div className="lg-body">{Body({ ...ctx, entity: LEGAL_ENTITIES[site.id] })}</div>
      </article>
      <nav className="lg-nav" aria-label="Documentos legales">
        {compliance.legalLinks
          .filter((l) => l.href.startsWith('/legal/'))
          .map((l) => (
            <a key={l.href} href={l.href} aria-current={l.href === `/legal/${doc}` ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
      </nav>
    </main>
  );
}
