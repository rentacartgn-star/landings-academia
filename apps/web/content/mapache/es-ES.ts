// [A3] Mapache · España. Tono: pícaro y cómplice, todo legal y a cara descubierta (sin imaginario de robo: R1-05 de A5).
// "Fichar" = elegir casas. Nada de botín, cerraduras ni puertas traseras (art. 9.2 RD 958/2020).
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_ES, ERRORS_ES, FAQ_ES, OFFER_CARD_ES, STEPS_ES_ESTIMATE, STEPS_ES_ITEMS,
  disclaimerES, faqCommissionES,
} from '../_shared/es-ES';

const content: SiteContent = {
  meta: {
    title: 'Mapache · La casa de apuestas deportivas que he fichado',
    description:
      'La casa de apuestas deportivas con licencia en España que uso yo, con la letra pequeña del bono a la vista. Solo +18. Juega con responsabilidad.',
    ogTitle: 'Mapache · La casa que he fichado',
    ogDescription: 'Casas con licencia DGOJ y la letra pequeña ya leída. Solo +18.',
  },
  hero: {
    eyebrow: 'La selección de Mapache · España',
    headlineVariants: [
      'Me he leído hasta la letra pequeña. Esta es la casa que uso yo.',
      'La letra pequeña ya la he leído yo. Tú entras por la puerta.',
      'Todo legal y a cara descubierta: la casa que he fichado.',
    ],
    sub: 'Con licencia de la DGOJ y con las condiciones del bono escritas debajo, sin trucos. Es la casa donde tengo mi cuenta.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero entrar en {operator}',
      'Quiero mi cuenta en {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en España',
  },
  ranking: {
    title: 'Mis fichajes',
    sub: 'Las casas que he fichado en España, en orden. La primera es la mía, y debajo de cada una va su letra pequeña.',
    myPickBadge: 'La que uso yo',
  },
  offerCard: {
    ...OFFER_CARD_ES,
    ratingLabel: 'Nota de Mapache',
    ctaSecondary: 'Quiero entrar en {operator}',
  },
  howIChoose: {
    title: 'Cómo elijo las casas',
    criteria: [
      {
        title: 'Con licencia o nada',
        body: 'Solo casas con licencia de la DGOJ. Nada de webs sin licencia. El número de licencia va en cada tarjeta.',
      },
      {
        title: 'La letra pequeña, leída',
        body: 'Requisitos de apuesta, plazo y cuota mínima. Si un bono tiene trampa, me la encuentro yo antes que tú, y esa casa se queda fuera.',
      },
      {
        title: 'Salida despejada',
        body: 'Miro cuánto tarda una retirada y por dónde sale. TODO(sergi): plazo real que ha comprobado Mapache en cada casa.',
      },
      {
        title: 'Frenos a mano',
        body: 'Límites de depósito, pausas y autoexclusión sin rodeos. Una casa que esconde los frenos no entra en mi lista.',
      },
    ],
  },
  steps: {
    title: 'El plan: 3 pasos',
    estimate: STEPS_ES_ESTIMATE,
    items: STEPS_ES_ITEMS,
  },
  faq: {
    title: 'Lo que me preguntáis antes de entrar',
    items: [
      FAQ_ES.legal,
      FAQ_ES.payout,
      FAQ_ES.kyc,
      FAQ_ES.bonus,
      FAQ_ES.exit,
      faqCommissionES('Sí, y aquí no se esconde nada.'),
      FAQ_ES.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, hazlo en una casa que he fichado por dentro.',
    sub: 'El mejor plan empieza con un límite. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Aquí todavía no he fichado ninguna casa',
    body: 'Solo recomiendo casas con licencia en tu país, y en el tuyo aún no tengo ninguna que me convenza. En cuanto la tenga, lo cuento primero en mis redes.',
    socialsTitle: 'Sígueme la pista aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_ES,
  footer: {
    tagline: 'Mapache Picks · Casas de apuestas deportivas con licencia y la letra pequeña leída',
    disclaimer: disclaimerES('Mapache Picks'),
  },
  errors: {
    ...ERRORS_ES,
    offerUnavailable: 'Esta oferta ya no está activa. Vuelve al inicio para ver mi selección de ahora.',
  },
};

export default content;
