// [A3] Mapache · LATAM. Tono: pícaro y cómplice, todo legal y a cara descubierta (sin imaginario de robo: R1-05 de A5).
// "Fichar" = elegir casas. Nada de botín, cerraduras ni puertas traseras (art. 9.2 RD 958/2020).
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_419, ERRORS_419, FAQ_419, OFFER_CARD_419, STEPS_419_ESTIMATE, STEPS_419_ITEMS,
  disclaimer419, faqCommission419,
} from '../_shared/es-419';

const content: SiteContent = {
  meta: {
    title: 'Mapache · La casa de apuestas que tengo fichada',
    description:
      'La casa de apuestas con licencia en tu país que uso yo, con la letra pequeña del bono a la vista. Solo mayores de edad. Juega con responsabilidad.',
    ogTitle: 'Mapache · La casa que tengo fichada',
    ogDescription: 'Casas con licencia en tu país y la letra pequeña ya leída. Solo mayores de edad.',
  },
  hero: {
    eyebrow: 'La selección de Mapache',
    headlineVariants: [
      'Me leí hasta la letra pequeña. Esta es la casa que uso yo.',
      'La letra pequeña ya la leí yo. Tú entras por la puerta.',
      'Todo legal y a cara descubierta: la casa que tengo fichada.',
    ],
    sub: 'Con licencia en tu país y con las condiciones del bono escritas abajo, sin trucos. Es la casa donde tengo mi cuenta.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero entrar a {operator}',
      'Quiero mi cuenta en {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en tu país',
  },
  ranking: {
    title: 'Mis fichajes',
    sub: 'Las casas que tengo fichadas en tu país, en orden. La primera es la mía, y abajo de cada una va su letra pequeña.',
    myPickBadge: 'La que uso yo',
  },
  offerCard: {
    ...OFFER_CARD_419,
    ratingLabel: 'Calificación de Mapache',
    ctaSecondary: 'Quiero entrar a {operator}',
  },
  howIChoose: {
    title: 'Cómo elijo las casas',
    criteria: [
      {
        title: 'Con licencia o nada',
        body: 'Solo casas con licencia o permiso en tu país. Nada de sitios sin licencia. El número de licencia va en cada tarjeta.',
      },
      {
        title: 'La letra pequeña, leída',
        body: 'Requisitos de apuesta, plazo y momio mínimo. Si un bono trae trampa, la encuentro yo antes que tú, y esa casa se queda fuera.',
      },
      {
        title: 'Salida despejada',
        body: 'Reviso cuánto tarda un retiro y por dónde sale. TODO(sergi): plazo real que comprobó Mapache en cada casa y país.',
      },
      {
        title: 'Frenos a la mano',
        body: 'Límites de depósito, pausas y autoexclusión sin rodeos. Una casa que esconde los frenos no entra a mi lista.',
      },
    ],
  },
  steps: {
    title: 'El plan: 3 pasos',
    estimate: STEPS_419_ESTIMATE,
    items: STEPS_419_ITEMS,
  },
  faq: {
    title: 'Lo que me preguntan antes de entrar',
    items: [
      FAQ_419.legal,
      FAQ_419.payout,
      FAQ_419.payments,
      FAQ_419.kyc,
      FAQ_419.bonus,
      FAQ_419.exit,
      faqCommission419('Sí, y aquí no se esconde nada.'),
      FAQ_419.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, hazlo en una casa que revisé por dentro.',
    sub: 'El mejor plan empieza con un límite. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Aquí todavía no tengo ninguna casa fichada',
    body: 'Solo recomiendo casas con licencia en tu país, y en el tuyo todavía no tengo ninguna que me convenza. En cuanto la tenga, lo cuento primero en mis redes.',
    socialsTitle: 'Sígueme la pista aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_419,
  footer: {
    tagline: 'Mapache Picks · Casas de apuestas con licencia y la letra pequeña leída',
    disclaimer: disclaimer419('Mapache Picks'),
  },
  errors: {
    ...ERRORS_419,
    offerUnavailable: 'Esta oferta ya no está activa. Regresa al inicio para ver mi selección de ahora.',
  },
};

export default content;
