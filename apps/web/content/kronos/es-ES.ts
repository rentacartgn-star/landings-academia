// [A3] Kronos · España. Tono: tiempo y precisión suiza. Datos, método, cada frase medible.
// El "método" es para elegir casas, nunca para ganar apuestas.
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_ES, ERRORS_ES, FAQ_ES, OFFER_CARD_ES, STEPS_ES_ESTIMATE, STEPS_ES_ITEMS,
  disclaimerES, faqCommissionES,
} from '../_shared/es-ES';

const content: SiteContent = {
  meta: {
    title: 'Kronos · La casa de apuestas deportivas que uso, con método',
    description:
      'La casa de apuestas deportivas con licencia en España que uso yo, elegida con 4 criterios que puedes comprobar. Solo +18. Juega con responsabilidad.',
    ogTitle: 'Kronos · Medido, no prometido',
    ogDescription: 'Casas con licencia DGOJ elegidas con 4 criterios comprobables. Solo +18.',
  },
  hero: {
    eyebrow: 'Mi método para elegir casa · España',
    headlineVariants: [
      'Medido, no prometido: esta es la casa que uso yo.',
      'Te ahorro el tiempo de comparar. Esta es mi casa.',
      '4 criterios, una casa: la que uso yo.',
    ],
    sub: 'Licencia de la DGOJ, condiciones del bono escritas debajo y plazos de retirada a la vista. Cada dato lo puedes comprobar tú.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero ir directo a {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en España',
  },
  ranking: {
    title: 'Mis casas en España, por orden',
    sub: 'La primera es la mía. Todas pasan los 4 criterios que explico más abajo, y cada bono lleva sus condiciones a la vista.',
    myPickBadge: 'Mi elección',
  },
  offerCard: {
    ...OFFER_CARD_ES,
    ratingLabel: 'Nota de Kronos',
    ctaSecondary: 'Quiero mi cuenta en {operator}',
  },
  howIChoose: {
    title: 'Mi método para elegir casa',
    criteria: [
      {
        title: '01 · Licencia verificada',
        body: 'Solo casas con licencia de la DGOJ. El número va en cada tarjeta y lo puedes contrastar en ordenacionjuego.es.',
      },
      {
        title: '02 · Condiciones medibles',
        body: 'Requisitos de apuesta, plazo en días y cuota mínima, con números. Si un bono no se puede medir, no lo recomiendo.',
      },
      {
        title: '03 · Retirada cronometrada',
        body: 'Cuánto tarda una retirada y por qué método, comprobado con mi cuenta. TODO(sergi): plazo real medido por Kronos en cada casa.',
      },
      {
        title: '04 · Control del tiempo',
        body: 'Límites de depósito y de sesión, pausas y autoexclusión a pocos toques. Tu tiempo también cuenta.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos',
    estimate: STEPS_ES_ESTIMATE,
    items: STEPS_ES_ITEMS,
  },
  faq: {
    title: 'Las dudas que más me llegan',
    items: [
      FAQ_ES.legal,
      FAQ_ES.payout,
      FAQ_ES.kyc,
      FAQ_ES.bonus,
      FAQ_ES.exit,
      faqCommissionES('Sí, y forma parte de los datos que debes tener.'),
      FAQ_ES.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, que sea en una casa con los datos sobre la mesa.',
    sub: 'Fija tu límite de depósito y de tiempo antes de empezar. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Aún no hay casa recomendada en tu país',
    body: 'Mi método empieza por la licencia, y en tu país todavía no tengo ninguna casa que cumpla los 4 criterios. Cuando la haya, lo publicaré primero en mis redes.',
    socialsTitle: 'Sígueme aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_ES,
  footer: {
    tagline: 'Kronos · Casas de apuestas deportivas con licencia, elegidas con método',
    disclaimer: disclaimerES('Kronos'),
  },
  errors: ERRORS_ES,
};

export default content;
