// [A5] Bloque de compliance por país (barra +edad, regulador, línea de ayuda, mensajes y enlaces legales) y gate P9.
// Nunca lanza: país desconocido o mal formado → bloque genérico prudente y no publicable.
import type { ComplianceBlock, Country, Locale } from '@la/contracts';
import { GENERIC, MARKETS, TRUST_BAR, t, type MarketDef } from './markets';

export { MARKETS } from './markets';

export const LEGAL_DOCS = ['aviso-legal', 'privacidad', 'cookies', 'juego-responsable'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

const LEGAL_LABELS: Record<'es' | 'en', Record<LegalDoc, string>> = {
  es: { 'aviso-legal': 'Aviso legal', privacidad: 'Privacidad', cookies: 'Cookies', 'juego-responsable': 'Juego responsable' },
  en: { 'aviso-legal': 'Legal notice', privacidad: 'Privacy', cookies: 'Cookies', 'juego-responsable': 'Responsible gaming' },
};

/** Ficha del mercado o la genérica. */
export function marketFor(country: Country): MarketDef & { known: boolean } {
  const c = typeof country === 'string' ? country.toUpperCase() : 'XX';
  const m = MARKETS[c];
  return m ? { ...m, known: true } : { ...GENERIC, known: false };
}

/** Mercados con OK explícito de Sergi o su asesor (P9). Env: `COMPLIANCE_APPROVED_MARKETS=ES,MX`. */
export function approvedMarkets(): Set<string> {
  const raw = process.env.COMPLIANCE_APPROVED_MARKETS ?? '';
  return new Set(raw.split(',').map((s) => s.trim().toUpperCase()).filter((s) => /^[A-Z]{2}$/.test(s)));
}

/**
 * Gate P9. Desarrollo: true (para ver ofertas), salvo `COMPLIANCE_ENFORCE=1` para probar el gate en local.
 * Producción: solo mercados con ficha revisada Y aprobados en la env.
 */
export function isPublishable(country: Country): boolean {
  try {
    const m = marketFor(country);
    const enforce = process.env.NODE_ENV === 'production' || process.env.COMPLIANCE_ENFORCE === '1';
    if (!enforce) return true;
    return m.known && m.reviewed && approvedMarkets().has(String(country).toUpperCase());
  } catch {
    return false;
  }
}

export function getCompliance(country: Country, locale: Locale): ComplianceBlock {
  const safeCountry = typeof country === 'string' && /^[A-Z]{2}$/i.test(country) ? country.toUpperCase() : 'XX';
  const m = marketFor(safeCountry);
  const lang = locale === 'en-US' ? 'en' : 'es';
  return {
    country: safeCountry,
    minAge: m.minAge,
    trustBarText: t(TRUST_BAR, locale).replace('{age}', String(m.minAge)),
    ...(m.regulator ? { regulator: { ...m.regulator } } : {}),
    helpline: { ...m.helpline },
    mandatoryMessages: m.mandatory.map((x) => t(x, locale)),
    legalLinks: [
      ...LEGAL_DOCS.map((d) => ({ label: LEGAL_LABELS[lang][d], href: `/legal/${d}` })),
      ...(m.regulator ? [{ label: m.regulator.name.split(' · ')[0]!, href: m.regulator.url }] : []),
    ],
    ...(m.operatorLicenseLabel ? { operatorLicenseLabel: t(m.operatorLicenseLabel, locale) } : {}),
    publishable: isPublishable(safeCountry),
  };
}
