// [A3] Diamond · España. Tono: joyería nocturna. Frases cortas, precisión, nada de brillo falso.
import type { SiteContent } from '@la/contracts';
import {
  COUNTRY_SWITCHER_ES, ERRORS_ES, FAQ_ES, OFFER_CARD_ES, STEPS_ES_ESTIMATE, STEPS_ES_ITEMS,
  disclaimerES, faqCommissionES,
} from '../_shared/es-ES';

const content: SiteContent = {
  meta: {
    title: 'Diamond · La casa de apuestas deportivas que uso yo',
    description:
      'Las casas de apuestas deportivas con licencia en España que uso y recomiendo, con las condiciones del bono a la vista. Solo +18. Juega con responsabilidad.',
    ogTitle: 'Diamond · La casa que uso yo',
    ogDescription: 'Mi selección de casas con licencia DGOJ, sin letra pequeña escondida. Solo +18.',
  },
  hero: {
    eyebrow: 'La selección de Diamond · España',
    headlineVariants: [
      'Esta es la casa de apuestas que uso yo.',
      'Pocas casas pasan mi filtro. Esta sí.',
      'Sin brillo falso: la casa que uso yo, con todo a la vista.',
    ],
    sub: 'Licencia de la DGOJ, condiciones del bono escritas debajo y nada escondido para después. La misma casa en la que tengo mi cuenta.',
    ctaVariants: [
      'Quiero mi bono en {operator}',
      'Quiero mi cuenta en {operator}',
      'Quiero ver la oferta de {operator}',
    ],
    trustLine: 'TODO(sergi) seguidores en TikTok · TODO(sergi) años analizando partidos · Solo casas con licencia en España',
  },
  ranking: {
    title: 'Mis casas en España, por orden',
    sub: 'La primera es la mía. Debajo de cada una tienes las condiciones del bono, sin tener que ir a buscarlas.',
    myPickBadge: 'Mi elección',
  },
  offerCard: {
    ...OFFER_CARD_ES,
    ratingLabel: 'Nota de Diamond',
    ctaSecondary: 'Quiero mi cuenta en {operator}',
  },
  howIChoose: {
    title: 'Cómo elijo las casas',
    criteria: [
      {
        title: 'Licencia, lo primero',
        body: 'Si una casa no tiene licencia de la DGOJ, no entra aquí. Su número está en cada tarjeta para que lo compruebes tú.',
      },
      {
        title: 'Condiciones que se entienden',
        body: 'Leo los requisitos de apuesta, el plazo y la cuota mínima antes que el titular del bono. Si para entenderlo hace falta lupa, la descarto.',
      },
      {
        title: 'Retiradas sin sorpresas',
        body: 'Miro cuánto tarda en llegar una retirada y por qué método. TODO(sergi): plazo real que ha comprobado Diamond en cada casa.',
      },
      {
        title: 'Control en tu mano',
        body: 'Límites de depósito, pausas y autoexclusión fáciles de encontrar. Si una casa te lo pone difícil, no la recomiendo.',
      },
    ],
  },
  steps: {
    title: 'Tu cuenta en 3 pasos',
    estimate: STEPS_ES_ESTIMATE,
    items: STEPS_ES_ITEMS,
  },
  faq: {
    title: 'Lo que me preguntáis antes de abrir cuenta',
    items: [
      FAQ_ES.legal,
      FAQ_ES.payout,
      FAQ_ES.kyc,
      FAQ_ES.bonus,
      FAQ_ES.exit,
      faqCommissionES('Sí, y prefiero que lo sepas.'),
      FAQ_ES.limits,
    ],
  },
  finalCta: {
    title: 'Si ya apuestas, que sea en una casa que he mirado con lupa.',
    sub: 'Antes de empezar, pon tu límite. Juega solo con lo que puedas permitirte perder.',
    cta: 'Quiero mi bono en {operator}',
  },
  stickyCta: { label: 'Quiero mi cuenta en {operator}' },
  fallback: {
    title: 'Aún no tengo casa recomendada en tu país',
    body: 'Solo recomiendo casas con licencia donde estás, y aquí todavía no tengo ninguna que pase mi filtro. Cuando la tenga, lo verás primero en mis redes.',
    socialsTitle: 'Mientras tanto, sígueme aquí',
  },
  countrySwitcher: COUNTRY_SWITCHER_ES,
  footer: {
    tagline: 'Diamond Picks · Casas de apuestas deportivas con licencia, elegidas con lupa',
    disclaimer: disclaimerES('Diamond Picks'),
  },
  errors: ERRORS_ES,
};

export default content;
