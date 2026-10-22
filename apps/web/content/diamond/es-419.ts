// [A3] Diamond · LATAM. Tono: joyería nocturna. Frases cortas, precisión, nada de brillo falso.
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_419, ERRORS_419, FAQ_419, OFFER_CARD_419, STEPS_419_ESTIMATE, STEPS_419_ITEMS,
  disclaimer419, faqCommission419,
} from '../_shared/es-419';

const content: SiteContent = {
  meta: {
    title: 'Diamond · La casa de apuestas que uso yo',
    description:
      'Las casas de apuestas con licencia en tu país que uso y recomiendo, con las condiciones del bono a la vista. Solo mayores de edad. Juega con responsabilidad.',
    ogTitle: 'Diamond · La casa que uso yo',
    ogDescription: 'Mi selección de casas con licencia en tu país, sin letra pequeña escondida. Solo mayores de edad.',
  },
  hero: {
    eyebrow: 'La selección de Diamond',
    headlineVariants: [
      'Esta es la casa de apuestas que uso yo.',
      'Pocas casas pasan mi filtro. Esta sí.',
      'Sin brillo falso: la casa que uso yo, con todo a la vista.',
    ],
    sub: 'Licencia en tu país, condiciones del bono escritas debajo y nada escondido para después. La misma casa donde tengo mi cuenta.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero ver la oferta de {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en tu país',
  },
  ranking: {
    title: 'Mis casas en tu país, en orden',
    sub: 'La primera es la mía. Abajo de cada una tienes las condiciones del bono, sin tener que buscarlas.',
    myPickBadge: 'Mi elección',
  },
  offerCard: {
    ...OFFER_CARD_419,
    ratingLabel: 'Calificación de Diamond',
    ctaSecondary: 'Quiero mi cuenta en {operator}',
  },
  howIChoose: {
    title: 'Cómo elijo las casas',
    criteria: [
      {
        title: 'Licencia, lo primero',
        body: 'Si una casa no tiene licencia o permiso en tu país, no entra aquí. El número viene en cada tarjeta para que lo cheques tú.',
      },
      {
        title: 'Condiciones que se entienden',
        body: 'Leo los requisitos de apuesta, el plazo y el momio mínimo antes que el titular del bono. Si hace falta lupa para entenderlo, la descarto.',
      },
      {
        title: 'Retiros sin sorpresas',
        body: 'Reviso cuánto tarda un retiro y por qué método. TODO(sergi): plazo real que comprobó Diamond en cada casa y país.',
      },
      {
        title: 'Control en tu mano',
        body: 'Límites de depósito, pausas y autoexclusión fáciles de encontrar. Si una casa te lo complica, no la recomiendo.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos',
    estimate: STEPS_419_ESTIMATE,
    items: STEPS_419_ITEMS,
  },
  faq: {
    title: 'Lo que me preguntan antes de abrir cuenta',
    items: [
      FAQ_419.legal,
      FAQ_419.payout,
      FAQ_419.payments,
      FAQ_419.kyc,
      FAQ_419.bonus,
      FAQ_419.exit,
      faqCommission419('Sí, y prefiero que lo sepas.'),
      FAQ_419.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, que sea en una casa que revisé con lupa.',
    sub: 'Antes de empezar, pon tu límite. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Todavía no tengo casa recomendada en tu país',
    body: 'Solo recomiendo casas con licencia donde estás, y aquí todavía no tengo ninguna que pase mi filtro. Cuando la tenga, lo vas a ver primero en mis redes.',
    socialsTitle: 'Mientras tanto, sígueme aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_419,
  footer: {
    tagline: 'Diamond Picks · Casas de apuestas con licencia, elegidas con lupa',
    disclaimer: disclaimer419('Diamond Picks'),
  },
  errors: ERRORS_419,
};

export default content;
