// [A3] DonPool · LATAM. Tono: antihéroe futbolero. Directo, irónico, con chispa; se ríe de la letra pequeña
// y de los que prometen cosas, nunca de las normas. Vocabulario de fútbol (alineación, banca, fuera de lugar, VAR).
// Sin referencias a superhéroes. Sin jerga juvenil (art. 11 RD 958/2020, criterio de prudencia también en LATAM).
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_419, ERRORS_419, FAQ_419, OFFER_CARD_419, STEPS_419_ESTIMATE, STEPS_419_ITEMS,
  disclaimer419, faqCommission419,
} from '../_shared/es-419';

const content: SiteContent = {
  meta: {
    title: 'DonPool · La casa de apuestas que uso, sin cuentos',
    description:
      'La casa de apuestas con licencia en tu país que uso yo, con las condiciones del bono a la vista. Solo mayores de edad. Juega con responsabilidad.',
    ogTitle: 'DonPool · Sin cuentos: la casa que uso yo',
    ogDescription: 'Casas con licencia en tu país y la letra pequeña leída entera. Solo mayores de edad.',
  },
  hero: {
    eyebrow: 'La alineación de Don Pool',
    headlineVariants: [
      'Sin cuentos: esta es la casa que uso yo.',
      'Aquí nadie te promete nada. Te enseño mi casa y su letra pequeña.',
      'Las casas sin licencia, fuera de lugar. Esta es la que uso yo.',
    ],
    sub: 'Licencia en tu país, condiciones del bono escritas abajo y cero choro. Si algo no me cuadra, la casa se va a la banca.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero ver qué ofrece {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en tu país',
  },
  ranking: {
    title: 'Mi alineación en tu país',
    sub: 'La primera es la que uso yo. Abajo de cada una, sus condiciones, sin tener que pedirlas por escrito.',
    myPickBadge: 'La que uso yo',
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
        title: 'Sin licencia, fuera de lugar',
        body: 'Si no tiene licencia o permiso en tu país, ni la miro. El número viene en cada tarjeta: chécalo, no te fíes ni de mí.',
      },
      {
        title: 'Letra pequeña, leída entera',
        body: 'Requisitos de apuesta, plazo y momio mínimo. Cuando un bono suena demasiado bien, el truco suele estar en la página tres. Esa casa, a la banca.',
      },
      {
        title: 'Que pague sin VAR',
        body: 'Reviso cuánto tarda un retiro y por qué método, sin revisiones eternas. TODO(sergi): plazo real que comprobó Don Pool en cada casa y país.',
      },
      {
        title: 'El límite lo pones tú',
        body: 'Límites de depósito, pausas y autoexclusión a la vista. Una casa que te los esconde no juega en mi equipo.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos, sin rollos',
    estimate: STEPS_419_ESTIMATE,
    items: STEPS_419_ITEMS,
  },
  faq: {
    title: 'Lo que me preguntan, sin rodeos',
    items: [
      FAQ_419.legal,
      FAQ_419.payout,
      FAQ_419.payments,
      FAQ_419.kyc,
      FAQ_419.bonus,
      FAQ_419.exit,
      faqCommission419('Sí, y te lo digo de frente.'),
      FAQ_419.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, por lo menos que sea en una casa que no te hace trampa.',
    sub: 'Pon tu límite antes del pitazo inicial. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Aquí todavía no tengo casa titular',
    body: 'Solo recomiendo casas con licencia donde estás, y en tu país ninguna me ha convencido todavía. Prefiero dejar el lugar vacío antes que meter a cualquiera.',
    socialsTitle: 'Mientras, sígueme aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_419,
  footer: {
    tagline: 'DonPool Picks · Casas de apuestas con licencia, sin cuentos',
    disclaimer: disclaimer419('DonPool Picks'),
  },
  errors: {
    ...ERRORS_419,
    offerUnavailable: 'Esta oferta quedó fuera de la convocatoria. Regresa al inicio para ver la que recomiendo ahora.',
  },
};

export default content;
