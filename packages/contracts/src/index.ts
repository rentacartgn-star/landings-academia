/**
 * Contratos compartidos (dueño: A0). Ningún agente los modifica: si necesitas un cambio, pídelo al orquestador.
 * Cada tipo tiene su esquema zod para validar en runtime (config de Supabase, beacons, postbacks).
 */
import { z } from 'zod';

// ───────────────────────── Básicos ─────────────────────────

export const SITE_IDS = ['donpool', 'mapache', 'diamond', 'kronos'] as const;
export const SiteIdSchema = z.enum(SITE_IDS);
export type SiteId = z.infer<typeof SiteIdSchema>;

/** ISO-3166 alpha-2 en mayúsculas. `XX` = desconocido. */
export const CountrySchema = z.string().regex(/^[A-Z]{2}$/);
export type Country = z.infer<typeof CountrySchema>;

export const LOCALES = ['es-ES', 'es-419', 'en-US'] as const;
export const LocaleSchema = z.enum(LOCALES);
export type Locale = z.infer<typeof LocaleSchema>;

/** Dónde está el CTA que se pulsa. Viaja en `/go/[offerId]?p=<placement>`. */
export const PLACEMENTS = ['hero', 'ranking', 'sticky', 'final', 'single'] as const;
export const PlacementSchema = z.enum(PLACEMENTS);
export type Placement = z.infer<typeof PlacementSchema>;

// ───────────────────────── Sitios, operadores, ofertas ─────────────────────────

export const SiteConfigSchema = z.object({
  id: SiteIdSchema,
  /** Hosts de producción y de desarrollo (p. ej. `diamondpix.com`, `diamond.local.test`). */
  domains: z.array(z.string()).min(1),
  /** Nombre de marca completo, p. ej. "Diamond Picks". No usar en title/OG (contiene "pick"). */
  brandName: z.string(),
  /** Nombre corto apto para title/OG, p. ej. "Diamond". */
  shortName: z.string(),
  memberName: z.string(),
  handle: z.string(),
  themeId: SiteIdSchema,
  avatarUrl: z.string(),
  socials: z.object({
    tiktok: z.string().url().optional(),
    instagram: z.string().url().optional(),
    telegram: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

export const OperatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string(),
  /** Número o referencia de licencia por país. Si el país no está, el operador NO se muestra allí. */
  licenseByCountry: z.record(CountrySchema, z.string()),
});
export type Operator = z.infer<typeof OperatorSchema>;

export const OfferSchema = z.object({
  id: z.string(),
  siteId: SiteIdSchema,
  country: CountrySchema,
  operatorId: z.string(),
  rank: z.number().int().min(1).max(4),
  /** Contiene `{click_id}`; el servidor lo sustituye en `/go`. */
  affiliateUrlTemplate: z.string().includes('{click_id}'),
  bonusHeadline: z.string(),
  bonusTermsShort: z.string(),
  termsUrl: z.string(),
  payoutSpeed: z.string().optional(),
  paymentMethods: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
  /** 0–5, con un decimal. */
  memberRating: z.number().min(0).max(5).optional(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  active: z.boolean(),
});
export type Offer = z.infer<typeof OfferSchema>;

/** Forma del fallback JSON de `packages/config` y de lo que devuelve Supabase ya mapeado. */
export const OffersCatalogSchema = z.object({
  operators: z.array(OperatorSchema),
  offers: z.array(OfferSchema),
});
export type OffersCatalog = z.infer<typeof OffersCatalogSchema>;

// ───────────────────────── Copy (dueño del contenido: A3) ─────────────────────────

/**
 * Plantillas: `{operator}`, `{country}`, `{member}`, `{minutes}` se sustituyen con `fill()` de abajo.
 * Ningún componente lleva texto hardcodeado: todo sale de aquí.
 */
export const SiteContentSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    /** 3 variantes A/B; la 0 es la de control. */
    headlineVariants: z.tuple([z.string(), z.string(), z.string()]),
    sub: z.string(),
    /** 3 variantes A/B del CTA primario, p. ej. "Quiero mi bono en {operator}". */
    ctaVariants: z.tuple([z.string(), z.string(), z.string()]),
    trustLine: z.string(),
  }),
  ranking: z.object({
    title: z.string(),
    sub: z.string(),
    myPickBadge: z.string(),
  }),
  offerCard: z.object({
    bonusLabel: z.string(),
    termsLinkLabel: z.string(),
    payoutLabel: z.string(),
    paymentsLabel: z.string(),
    licenseLabel: z.string(),
    ratingLabel: z.string(),
    /** CTA de las tarjetas secundarias del ranking. */
    ctaSecondary: z.string(),
    validUntilLabel: z.string(),
  }),
  howIChoose: z.object({
    title: z.string(),
    criteria: z.array(z.object({ title: z.string(), body: z.string() })).min(3).max(4),
  }),
  steps: z.object({
    title: z.string(),
    estimate: z.string(),
    items: z.array(z.object({ title: z.string(), body: z.string() })).length(3),
  }),
  faq: z.object({
    title: z.string(),
    items: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
  }),
  finalCta: z.object({ title: z.string(), sub: z.string(), cta: z.string() }),
  stickyCta: z.object({ label: z.string() }),
  fallback: z.object({
    title: z.string(),
    body: z.string(),
    socialsTitle: z.string(),
  }),
  countrySwitcher: z.object({
    notInCountry: z.string(),
    change: z.string(),
    modalTitle: z.string(),
    searchPlaceholder: z.string(),
    close: z.string(),
  }),
  footer: z.object({
    tagline: z.string(),
    disclaimer: z.string(),
  }),
  errors: z.object({
    generic: z.string(),
    offerUnavailable: z.string(),
  }),
});
export type SiteContent = z.infer<typeof SiteContentSchema>;

// ───────────────────────── Compliance (dueño: A5) ─────────────────────────

export const ComplianceBlockSchema = z.object({
  country: CountrySchema,
  minAge: z.number().int(),
  /** Texto de la barra superior, p. ej. "+18 · Juega con responsabilidad". */
  trustBarText: z.string(),
  regulator: z.object({ name: z.string(), url: z.string(), logoUrl: z.string().optional() }).optional(),
  helpline: z.object({ name: z.string(), url: z.string(), phone: z.string().optional() }),
  /** Mensajes obligatorios del mercado que deben aparecer visibles. */
  mandatoryMessages: z.array(z.string()),
  legalLinks: z.array(z.object({ label: z.string(), href: z.string() })),
  /** Etiqueta de la licencia del operador en este mercado (p. ej. "Permiso SEGOB" en MX). Si falta, se usa `content.offerCard.licenseLabel`. */
  operatorLicenseLabel: z.string().optional(),
  /** Gate P9: si es false, la landing de ese mercado muestra el fallback y no enlaza a operadores. */
  publishable: z.boolean(),
});
export type ComplianceBlock = z.infer<typeof ComplianceBlockSchema>;

// ───────────────────────── Tema (dueño: A2) ─────────────────────────

export const ThemeTokensSchema = z.object({
  colors: z.object({
    bg: z.string(),
    bgElevated: z.string(),
    surface: z.string(),
    text: z.string(),
    textMuted: z.string(),
    accent: z.string(),
    cta: z.string(),
    ctaText: z.string(),
    border: z.string(),
  }),
  radius: z.object({ card: z.string(), pill: z.string() }),
  fonts: z.object({ display: z.string(), body: z.string() }),
});
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;

// ───────────────────────── Props de la landing (A1 produce, A2/A3/A5 consumen) ─────────────────────────

export type LandingLayout = 'single' | 'ranking' | 'fallback';

export interface LandingProps {
  site: SiteConfig;
  country: Country;
  /** País detectado por IP (puede diferir de `country` si hay cookie `lp_country`). */
  detectedCountry: Country;
  locale: Locale;
  /** 0..4 ya filtradas (activas, en fecha, operador con licencia en el país) y ordenadas por rank. */
  offers: Offer[];
  operators: Record<string, Operator>;
  layout: LandingLayout;
  content: SiteContent;
  compliance: ComplianceBlock;
  /** Índice 0–2 de la variante A/B asignada (titular y CTA). */
  variant: 0 | 1 | 2;
  /** Países con oferta para este sitio, para el selector. */
  availableCountries: Country[];
}

/** Layout derivado: 0 ofertas → fallback, 1 → single, 2–4 → ranking. */
export function layoutFor(offers: readonly Offer[]): LandingLayout {
  return offers.length === 0 ? 'fallback' : offers.length === 1 ? 'single' : 'ranking';
}

/** Sustituye `{clave}` en una plantilla de copy. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

// ───────────────────────── Tracking (dueño: A4) ─────────────────────────

export const EVENT_NAMES = [
  'pageview',
  'offer_view',
  'scroll_depth',
  'cta_click',
  'outbound',
  'country_switch',
  'conversion',
] as const;
export const EventNameSchema = z.enum(EVENT_NAMES);
export type EventName = z.infer<typeof EventNameSchema>;

/** Eventos que el cliente puede mandar a `POST /api/e` (outbound y conversion son solo de servidor). */
export const ClientEventSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('pageview'), referrer: z.string().optional() }),
  z.object({ name: z.literal('offer_view'), offerId: z.string(), rank: z.number().int() }),
  z.object({ name: z.literal('scroll_depth'), depth: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]) }),
  z.object({ name: z.literal('cta_click'), offerId: z.string(), rank: z.number().int(), placement: PlacementSchema }),
  z.object({ name: z.literal('country_switch'), from: CountrySchema, to: CountrySchema }),
]);
export type ClientEvent = z.infer<typeof ClientEventSchema>;

/** Contexto común que acompaña a cada beacon (el servidor añade país, device, in_app y visitor_hash). */
export const BeaconEnvelopeSchema = z.object({
  site: SiteIdSchema,
  country: CountrySchema,
  locale: LocaleSchema,
  variant: z.number().int().min(0).max(2),
  path: z.string(),
  src: z.string().max(32).optional(),
  utm: z.record(z.string(), z.string().max(128)).optional(),
  events: z.array(ClientEventSchema).min(1).max(20),
});
export type BeaconEnvelope = z.infer<typeof BeaconEnvelopeSchema>;

export const ConversionTypeSchema = z.enum(['registration', 'ftd', 'deposit']);
export type ConversionType = z.infer<typeof ConversionTypeSchema>;

/** URL de salida trackeada. Todo CTA saliente DEBE usar esto (DoD: 0 clics fuera de `/go`). */
export function goHref(offerId: string, placement: Placement): string {
  return `/go/${encodeURIComponent(offerId)}?p=${placement}`;
}

// ───────────────────────── Interfaz de tema (A2 implementa, A1 monta) ─────────────────────────

/**
 * Cada `apps/web/themes/<siteId>/index.tsx` exporta por defecto un `ThemeModule`.
 * `Landing` es un Server Component que pinta la página entera (single / ranking / fallback según `props.layout`).
 * El tipo de componente se deja genérico para no acoplar el paquete a React.
 */
export interface ThemeModule<C = unknown> {
  id: SiteId;
  tokens: ThemeTokens;
  Landing: C;
}
