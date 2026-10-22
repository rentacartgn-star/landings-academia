// [A3] Verificación del copy. Uso (desde apps/web): npx tsx content/verify.ts
// Comprueba las 8 combinaciones sitio × locale escrito, más la caída de en-US a es-419:
// 1) SiteContentSchema.parse, 2) palabras penalizadas en meta.*, 3) palabras prohibidas (§9.3) en todo el copy,
// 4) plantillas obligatorias ({operator} en CTAs, {country} en notInCountry) y que no haya variables desconocidas,
// 5) estilo: sin guiones largos.
import { SITE_IDS, SiteContentSchema, type SiteContent } from '@la/contracts';
import { CONTENT, getContent } from './index';

const LOCALES = ['es-ES', 'es-419'] as const;

/** Penalizan el enlace en redes (§9.3, último punto). Solo en meta.* (title / OG). */
const META_BANNED: RegExp[] = [/\bpicks?\b/i, /\bquinielas?\b/i, /\bgratis\b/i, /entra y pincha/i, /lo tienes gratis/i];

/** Prohibidas en todo el copy (§9.3 y RD 958/2020): juego como forma de ganar dinero, garantías, presión social. */
const COPY_BANNED: RegExp[] = [
  /dinero f[aá]cil/i,
  /gana(r)? seguro/i,
  /sin riesgos?/i,
  /infalible/i,
  /\bingresos?\b/i,
  /deudas?/i,
  /garantiza/i,
  /asegurad[oa]s?/i,
  /hazte rico|hacerte rico/i,
  /todos tus amigos/i,
  /\bgratis\b/i,
  /entra y pincha/i,
  /\bquinielas?\b/i,
  /apuesta segura/i,
  /vive de las apuestas|vivir de las apuestas/i,
  /ganancias? (fij|segur)/i,
  // R1-05 (A5): nada de imaginario de robo (art. 9.2 RD 958/2020).
  /bot[ií]n/i,
  /cerraduras?/i,
  /puertas? traseras?/i,
  /\brob(o|ar)\b/i,
  /\bgolpe\b/i,
  // R1-06 (A5): "método" solo para elegir casa, nunca suelto como clave para ganar.
  /m[ée]todo Kronos(?! para elegir)/i,
  // R2 (A0): sin referencias a superhéroes ni a su IP.
  /deadpool|marvel|superh[ée]roe/i,
];

/** Vetadas por sitio (R2: DonPool no es billar). */
const SITE_BANNED: Partial<Record<(typeof SITE_IDS)[number], RegExp[]>> = {
  donpool: [/billar/i, /\bmesas?\b/i, /cantar? la bola|canto/i, /\bclub\b/i, /\bsocios?\b/i, /\btiza\b/i],
};

const ALLOWED_VARS = new Set(['operator', 'country', 'member', 'minutes']);

/** Recorre todas las cadenas con su ruta (meta.title, faq.items.0.a...). */
function strings(node: unknown, path = ''): Array<[string, string]> {
  if (typeof node === 'string') return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => strings(v, `${path}.${i}`));
  if (node && typeof node === 'object')
    return Object.entries(node).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
}

const errors: string[] = [];
const fail = (where: string, msg: string) => errors.push(`✗ ${where}: ${msg}`);

for (const site of SITE_IDS) {
  for (const locale of LOCALES) {
    const where = `${site}/${locale}`;
    const raw = CONTENT[site][locale];
    const parsed = SiteContentSchema.safeParse(raw);
    if (!parsed.success) {
      fail(where, `schema: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
      continue;
    }
    const c: SiteContent = parsed.data;

    for (const [path, text] of strings(c)) {
      if (path.startsWith('meta.'))
        for (const re of META_BANNED) if (re.test(text)) fail(where, `${path} contiene ${re} → "${text}"`);
      for (const re of [...COPY_BANNED, ...(SITE_BANNED[site] ?? [])])
        if (re.test(text)) fail(where, `${path} contiene ${re} → "${text}"`);
      for (const m of text.matchAll(/\{(\w+)\}/g))
        if (!ALLOWED_VARS.has(m[1]!)) fail(where, `${path} usa la variable desconocida {${m[1]}}`);
      if (text.includes('—')) fail(where, `${path} tiene guion largo (estilo)`);
    }

    const needOperator: Array<[string, string]> = [
      ...c.hero.ctaVariants.map((t, i) => [`hero.ctaVariants.${i}`, t] as [string, string]),
      ['finalCta.cta', c.finalCta.cta],
      ['stickyCta.label', c.stickyCta.label],
      ['offerCard.ctaSecondary', c.offerCard.ctaSecondary],
    ];
    for (const [path, t] of needOperator) {
      if (!t.includes('{operator}')) fail(where, `${path} debe usar {operator}`);
      if (!/^Quiero\b/.test(t)) fail(where, `${path} debe ir en primera persona ("Quiero...")`);
    }
    // R1-03 (A5): el sticky aparece lejos de las condiciones del bono (art. 13.4 RD 958/2020): sin "bono".
    if (/\bbono/i.test(c.stickyCta.label)) fail(where, 'stickyCta.label no puede mencionar el bono (R1-03)');
    if (!c.countrySwitcher.notInCountry.includes('{country}')) fail(where, 'countrySwitcher.notInCountry debe usar {country}');
    if (new Set(c.hero.headlineVariants).size !== 3) fail(where, 'hero.headlineVariants: las 3 variantes deben ser distintas');
    if (new Set(c.hero.ctaVariants).size !== 3) fail(where, 'hero.ctaVariants: las 3 variantes deben ser distintas');
  }

  // en-US no tiene copy en v1: debe caer a es-419.
  if (getContent(site, 'en-US') !== CONTENT[site]['es-419']) fail(`${site}/en-US`, 'no cae a es-419');
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} error(es) en el copy.`);
  process.exit(1);
}
console.log(`✓ Copy OK: ${SITE_IDS.length * LOCALES.length} combinaciones validadas (+ en-US → es-419).`);
