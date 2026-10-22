// [A3] DonPool · LATAM. Tono: club privado de billar. Calma, frases con aire, sin prisas.
// Recurso: "cantar la bola" (en el billar se anuncia la jugada antes de tirar) = transparencia.
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_419, ERRORS_419, FAQ_419, OFFER_CARD_419, STEPS_419_ESTIMATE, STEPS_419_ITEMS,
  disclaimer419, faqCommission419,
} from '../_shared/es-419';

const content: SiteContent = {
  meta: {
    title: 'DonPool · La casa de apuestas de mi mesa',
    description:
      'La casa de apuestas con licencia en tu país que uso yo, con las condiciones del bono claras antes de entrar. Solo mayores de edad. Juega con responsabilidad.',
    ogTitle: 'DonPool · La casa de mi mesa',
    ogDescription: 'Casas con licencia en tu país y las condiciones claras antes de entrar. Sin prisas. Solo mayores de edad.',
  },
  hero: {
    eyebrow: 'El club de Don Pool',
    headlineVariants: [
      'Pasa, sin prisa. Esta es la casa que uso yo.',
      'En el billar se canta la bola antes de tirar. Aquí te canto las condiciones.',
      'Una sola mesa, la mía: la casa de apuestas donde juego yo.',
    ],
    sub: 'Con licencia en tu país y con las condiciones del bono a la vista antes de registrarte. Léelas con calma: la decisión es tuya.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero sentarme en {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en tu país',
  },
  ranking: {
    title: 'Las mesas que recomiendo en tu país',
    sub: 'En orden, y la primera es la mía. Las condiciones de cada bono van abajo, a la vista.',
    myPickBadge: 'Mi mesa',
  },
  offerCard: {
    ...OFFER_CARD_419,
    ratingLabel: 'Calificación de Don Pool',
    ctaSecondary: 'Quiero mi cuenta en {operator}',
  },
  howIChoose: {
    title: 'Cómo elijo las casas',
    criteria: [
      {
        title: 'Socios con licencia',
        body: 'En este club solo entran casas con licencia o permiso en tu país. El número viene en cada tarjeta, por si lo quieres checar.',
      },
      {
        title: 'Condiciones cantadas',
        body: 'Requisitos de apuesta, plazo y momio mínimo, dichos antes de empezar. Un bono que solo se entiende después no pasa de la puerta.',
      },
      {
        title: 'Retiros a tiempo',
        body: 'Reviso cuánto tarda un retiro y por qué método. TODO(sergi): plazo real que comprobó Don Pool en cada casa y país.',
      },
      {
        title: 'Tu ritmo, tus límites',
        body: 'Límites de depósito, pausas y autoexclusión fáciles de poner. El ritmo lo marcas tú, no la casa.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos, con calma',
    estimate: STEPS_419_ESTIMATE,
    items: STEPS_419_ITEMS,
  },
  faq: {
    title: 'Antes de sentarte a la mesa',
    items: [
      FAQ_419.legal,
      FAQ_419.payout,
      FAQ_419.payments,
      FAQ_419.kyc,
      FAQ_419.bonus,
      FAQ_419.exit,
      faqCommission419('Sí, y te lo canto igual que lo demás.'),
      FAQ_419.limits,
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
    body: 'Solo recomiendo casas con licencia donde estás, y aquí todavía no tengo ninguna que me convenza. Prefiero esperar antes que recomendarte cualquiera.',
    socialsTitle: 'Mientras tanto, nos vemos aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_419,
  footer: {
    tagline: 'DonPool Picks · Casas de apuestas con licencia, elegidas sin prisa',
    disclaimer: disclaimer419('DonPool Picks'),
  },
  errors: ERRORS_419,
};

export default content;
