// [A3] Punto de entrada del copy. content/<siteId>/<locale>.ts exporta un SiteContent por defecto.
//
// Locales:
// - es-ES: España (tú / vosotros, "apuestas deportivas", DGOJ).
// - es-419: LATAM neutro con matices de México (tú / ustedes, "retiro", "momio", SEGOB).
// - en-US: SIN copy en v1 (BRIEF §3). Cae a es-419 hasta que exista content/<siteId>/en-US.ts.
//
// Plantillas que hay que pasar por fill() de @la/contracts antes de pintar:
// - {operator}: hero.ctaVariants, finalCta.cta, stickyCta.label, offerCard.ctaSecondary.
// - {country}: countrySwitcher.notInCountry.
// El resto de textos no lleva variables (llamar a fill() sobre ellos es inocuo).
import type { Locale, SiteContent, SiteId } from '@la/contracts';
import diamondES from './diamond/es-ES';
import diamond419 from './diamond/es-419';
import donpoolES from './donpool/es-ES';
import donpool419 from './donpool/es-419';
import kronosES from './kronos/es-ES';
import kronos419 from './kronos/es-419';
import mapacheES from './mapache/es-ES';
import mapache419 from './mapache/es-419';

type WrittenLocale = 'es-ES' | 'es-419';

export const CONTENT: Record<SiteId, Record<WrittenLocale, SiteContent>> = {
  diamond: { 'es-ES': diamondES, 'es-419': diamond419 },
  donpool: { 'es-ES': donpoolES, 'es-419': donpool419 },
  kronos: { 'es-ES': kronosES, 'es-419': kronos419 },
  mapache: { 'es-ES': mapacheES, 'es-419': mapache419 },
};

/** Locale con copy escrito al que se resuelve cada locale del contrato. en-US → es-419 (sin copy en v1). */
export function resolveLocale(locale: Locale): WrittenLocale {
  return locale === 'es-ES' ? 'es-ES' : 'es-419';
}

export function getContent(site: SiteId, locale: Locale): SiteContent {
  return CONTENT[site][resolveLocale(locale)];
}
