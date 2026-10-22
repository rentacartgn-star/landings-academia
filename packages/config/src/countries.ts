import type { Country, Locale } from '@la/contracts';

export const LATAM = ['MX', 'PA', 'EC', 'CO', 'PE', 'CL', 'AR', 'UY', 'PY', 'BO', 'VE', 'CR', 'GT', 'HN', 'SV', 'NI', 'DO', 'PR'] as const;

export function localeFor(country: Country): Locale {
  if (country === 'ES') return 'es-ES';
  if (country === 'US') return 'en-US';
  return 'es-419';
}

/** Nombres en español para el selector de país. */
export const COUNTRY_NAMES: Record<string, string> = {
  ES: 'España', MX: 'México', PA: 'Panamá', EC: 'Ecuador', US: 'Estados Unidos', CO: 'Colombia', PE: 'Perú',
  CL: 'Chile', AR: 'Argentina', UY: 'Uruguay', PY: 'Paraguay', BO: 'Bolivia', VE: 'Venezuela', CR: 'Costa Rica',
  GT: 'Guatemala', HN: 'Honduras', SV: 'El Salvador', NI: 'Nicaragua', DO: 'República Dominicana', PR: 'Puerto Rico',
  XX: 'Otro país',
};

/** País desconocido / "Otro país". */
export const UNKNOWN_COUNTRY: Country = 'XX';

// ISO-3166-1 alpha-2 oficiales. Acota la caché: un código inventado (cookie o cabecera) nunca crea una página nueva.
const ISO_3166 = new Set(
  ('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ ' +
    'CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO ' +
    'FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE ' +
    'JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO ' +
    'MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW ' +
    'PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM ' +
    'TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' '),
);

/** Código ISO válido (o `XX`), normalizado a mayúsculas; `null` si no lo es. */
export function parseCountry(raw: string | null | undefined): Country | null {
  if (!raw) return null;
  const c = raw.trim().toUpperCase();
  return c === UNKNOWN_COUNTRY || ISO_3166.has(c) ? c : null;
}

/** Países con nombre propio en el selector (el resto se agrupa como `XX`). */
export function isNamedCountry(c: Country): boolean {
  return c in COUNTRY_NAMES;
}

/** Nombre en español de cualquier país (lista propia y, si no está, Intl). */
export function countryName(code: Country): string {
  if (COUNTRY_NAMES[code]) return COUNTRY_NAMES[code]!;
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}
