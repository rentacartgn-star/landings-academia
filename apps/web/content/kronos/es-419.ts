// [A3] Kronos · LATAM. Tono: tiempo y precisión suiza. Datos, método, cada frase medible.
// El "método" es para elegir casas, nunca para ganar apuestas.
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_419, ERRORS_419, FAQ_419, OFFER_CARD_419, STEPS_419_ESTIMATE, STEPS_419_ITEMS,
  disclaimer419, faqCommission419,
} from '../_shared/es-419';

const content: SiteContent = {
  meta: {
    title: 'Kronos · La casa de apuestas que uso, con método',
    description:
      'La casa de apuestas con licencia en tu país que uso yo, elegida con 4 criterios que puedes comprobar. Solo mayores de edad. Juega con responsabilidad.',
    ogTitle: 'Kronos · Medido, no prometido',
    ogDescription: 'Casas con licencia en tu país elegidas con 4 criterios comprobables. Solo mayores de edad.',
  },
  hero: {
    eyebrow: 'Mi método para elegir casa',
    headlineVariants: [
      'Medido, no prometido: esta es la casa que uso yo.',
      'Un partido dura 90 minutos. Comparar casas, ni uno: ya lo hice yo.',
      '4 criterios, una casa: la que uso yo.',
    ],
    sub: 'Licencia en tu país, condiciones del bono escritas abajo y plazos de retiro a la vista. Cada dato lo puedes comprobar tú.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero ir directo a {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en tu país',
  },
  ranking: {
    title: 'Mis casas en tu país, en orden',
    sub: 'La primera es la mía. Todas pasan los 4 criterios que explico más abajo, y cada bono lleva sus condiciones a la vista.',
    myPickBadge: 'Mi elección',
  },
  offerCard: {
    ...OFFER_CARD_419,
    ratingLabel: 'Calificación de Kronos',
    ctaSecondary: 'Quiero mi cuenta en {operator}',
  },
  howIChoose: {
    title: 'Mi método para elegir casa',
    criteria: [
      {
        title: '01 · Licencia verificada',
        body: 'Solo casas con licencia o permiso en tu país (en México, de la SEGOB). El número va en cada tarjeta para que lo contrastes.',
      },
      {
        title: '02 · Condiciones medibles',
        body: 'Requisitos de apuesta, plazo en días y momio mínimo, con números. Si un bono no se puede medir, no lo recomiendo.',
      },
      {
        title: '03 · Retiro cronometrado',
        body: 'Cuánto tarda un retiro y por qué método, comprobado con mi cuenta. TODO(sergi): plazo real medido por Kronos en cada casa y país.',
      },
      {
        title: '04 · Control del tiempo',
        body: 'Límites de depósito y de sesión, pausas y autoexclusión a pocos toques. Tu tiempo también cuenta.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos',
    estimate: STEPS_419_ESTIMATE,
    items: STEPS_419_ITEMS,
  },
  faq: {
    title: 'Las dudas que más me llegan',
    items: [
      FAQ_419.legal,
      FAQ_419.payout,
      FAQ_419.payments,
      FAQ_419.kyc,
      FAQ_419.bonus,
      FAQ_419.exit,
      faqCommission419('Sí, y es parte de los datos que debes tener.'),
      FAQ_419.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, que sea en una casa con los datos sobre la mesa.',
    sub: 'Fija tu límite de depósito y de tiempo antes de empezar. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Todavía no hay casa recomendada en tu país',
    body: 'Mi método empieza por la licencia, y en tu país todavía no tengo ninguna casa que cumpla los 4 criterios. Cuando la haya, la voy a publicar primero en mis redes.',
    socialsTitle: 'Sígueme aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_419,
  footer: {
    tagline: 'Kronos · Casas de apuestas con licencia, elegidas con método',
    disclaimer: disclaimer419('Kronos'),
  },
  errors: ERRORS_419,
};

export default content;
