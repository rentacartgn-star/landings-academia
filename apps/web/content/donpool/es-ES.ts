// [A3] DonPool · España. Tono: antihéroe futbolero. Directo, irónico, con chispa; se ríe de la letra pequeña
// y de los que prometen cosas, nunca de las normas. Vocabulario de fútbol (alineación, banquillo, fuera de juego, VAR).
// Sin referencias a superhéroes. Sin jerga juvenil (art. 11 RD 958/2020).
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_ES, ERRORS_ES, FAQ_ES, OFFER_CARD_ES, STEPS_ES_ESTIMATE, STEPS_ES_ITEMS,
  disclaimerES, faqCommissionES,
} from '../_shared/es-ES';

const content: SiteContent = {
  meta: {
    title: 'DonPool · La casa de apuestas deportivas que uso, sin cuentos',
    description:
      'La casa de apuestas deportivas con licencia en España que uso yo, con las condiciones del bono a la vista. Solo +18. Juega con responsabilidad.',
    ogTitle: 'DonPool · Sin cuentos: la casa que uso yo',
    ogDescription: 'Casas con licencia DGOJ y la letra pequeña leída entera. Solo +18.',
  },
  hero: {
    eyebrow: 'La alineación de Don Pool · España',
    headlineVariants: [
      'Sin cuentos: esta es la casa que uso yo.',
      'Aquí nadie te promete nada. Te enseño mi casa y su letra pequeña.',
      'Las casas sin licencia, fuera de juego. Esta es la que uso yo.',
    ],
    sub: 'Licencia de la DGOJ, condiciones del bono escritas debajo y cero letra pequeña escondida. Si algo no me cuadra, la casa se queda en el banquillo.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero ver qué ofrece {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en España',
  },
  ranking: {
    title: 'Mi alineación en España',
    sub: 'La primera es la que uso yo. Debajo de cada una, sus condiciones, sin tener que pedirlas por escrito.',
    myPickBadge: 'La que uso yo',
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
        title: 'Sin licencia, fuera de juego',
        body: 'Si no tiene licencia de la DGOJ, ni la miro. El número está en cada tarjeta: compruébalo, no te fíes ni de mí.',
      },
      {
        title: 'Letra pequeña, leída entera',
        body: 'Requisitos de apuesta, plazo y cuota mínima. Cuando un bono suena demasiado bien, la pega suele estar en la página tres. Esa casa, al banquillo.',
      },
      {
        title: 'Que pague sin VAR',
        body: 'Miro cuánto tarda una retirada y por qué método, sin revisiones eternas. TODO(sergi): plazo real que ha comprobado Don Pool en cada casa.',
      },
      {
        title: 'El límite lo pones tú',
        body: 'Límites de depósito, pausas y autoexclusión a la vista. Una casa que te los esconde no juega en mi equipo.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos, sin rollos',
    estimate: STEPS_ES_ESTIMATE,
    items: STEPS_ES_ITEMS,
  },
  faq: {
    title: 'Lo que me preguntáis, sin rodeos',
    items: [
      FAQ_ES.legal,
      FAQ_ES.payout,
      FAQ_ES.kyc,
      FAQ_ES.bonus,
      FAQ_ES.exit,
      faqCommissionES('Sí, y te lo digo a la cara.'),
      FAQ_ES.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, al menos que sea en una casa que no te la lía.',
    sub: 'Pon tu límite antes del pitido inicial. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Aquí todavía no tengo casa titular',
    body: 'Solo recomiendo casas con licencia donde estás, y en tu país ninguna me ha convencido todavía. Prefiero dejar el hueco vacío antes que meter a cualquiera.',
    socialsTitle: 'Mientras, sígueme aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_ES,
  footer: {
    tagline: 'DonPool Picks · Casas de apuestas deportivas con licencia, sin cuentos',
    disclaimer: disclaimerES('DonPool Picks'),
  },
  errors: {
    ...ERRORS_ES,
    offerUnavailable: 'Esta oferta se ha caído de la convocatoria. Vuelve al inicio para ver la que recomiendo ahora.',
  },
};

export default content;
