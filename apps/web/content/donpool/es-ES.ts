// [A3] DonPool · España. Tono: club privado de billar. Calma, frases con aire, sin prisas.
// Recurso: "cantar la bola" (en el billar se anuncia la jugada antes de tirar) = transparencia.
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_ES, ERRORS_ES, FAQ_ES, OFFER_CARD_ES, STEPS_ES_ESTIMATE, STEPS_ES_ITEMS,
  disclaimerES, faqCommissionES,
} from '../_shared/es-ES';

const content: SiteContent = {
  meta: {
    title: 'DonPool · La casa de apuestas deportivas de mi mesa',
    description:
      'La casa de apuestas deportivas con licencia en España que uso yo, con las condiciones del bono claras antes de entrar. Solo +18. Juega con responsabilidad.',
    ogTitle: 'DonPool · La casa de mi mesa',
    ogDescription: 'Casas con licencia DGOJ y las condiciones claras antes de entrar. Sin prisas. Solo +18.',
  },
  hero: {
    eyebrow: 'El club de Don Pool · España',
    headlineVariants: [
      'Pasa, sin prisa. Esta es la casa que uso yo.',
      'En el billar se canta la bola antes de tirar. Aquí te canto las condiciones.',
      'Una sola mesa, la mía: la casa de apuestas donde juego yo.',
    ],
    sub: 'Con licencia de la DGOJ y con las condiciones del bono a la vista antes de registrarte. Léelas con calma: la decisión es tuya.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero sentarme en {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en España',
  },
  ranking: {
    title: 'Las mesas que recomiendo en España',
    sub: 'En orden, y la primera es la mía. Las condiciones de cada bono van debajo, a la vista.',
    myPickBadge: 'Mi mesa',
  },
  offerCard: {
    ...OFFER_CARD_ES,
    ratingLabel: 'Nota de Don Pool',
    ctaSecondary: 'Quiero mi cuenta en {operator}',
  },
  howIChoose: {
    title: 'Cómo elijo las casas',
    criteria: [
      {
        title: 'Socios con licencia',
        body: 'En este club solo entran casas con licencia de la DGOJ. Tienes el número en cada tarjeta, por si quieres comprobarlo.',
      },
      {
        title: 'Condiciones cantadas',
        body: 'Requisitos de apuesta, plazo y cuota mínima, dichos antes de empezar. Un bono que solo se entiende después no pasa de la puerta.',
      },
      {
        title: 'Retiradas a su hora',
        body: 'Miro cuánto tarda en llegar una retirada y por qué método. TODO(sergi): plazo real que ha comprobado Don Pool en cada casa.',
      },
      {
        title: 'Tu ritmo, tus límites',
        body: 'Límites de depósito, pausas y autoexclusión fáciles de poner. El ritmo lo marcas tú, no la casa.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos, con calma',
    estimate: STEPS_ES_ESTIMATE,
    items: STEPS_ES_ITEMS,
  },
  faq: {
    title: 'Antes de sentarte a la mesa',
    items: [
      FAQ_ES.legal,
      FAQ_ES.payout,
      FAQ_ES.kyc,
      FAQ_ES.bonus,
      FAQ_ES.exit,
      faqCommissionES('Sí, y te lo canto igual que el resto.'),
      FAQ_ES.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, que sea en una mesa que conozco bien.',
    sub: 'Pon tu límite antes de la primera jugada. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Todavía no hay mesa para tu país',
    body: 'Solo recomiendo casas con licencia donde estás, y aquí aún no tengo ninguna que me convenza. Prefiero esperar antes que recomendarte cualquiera.',
    socialsTitle: 'Mientras tanto, nos vemos aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_ES,
  footer: {
    tagline: 'DonPool Picks · Casas de apuestas deportivas con licencia, elegidas sin prisa',
    disclaimer: disclaimerES('DonPool Picks'),
  },
  errors: ERRORS_ES,
};

export default content;
