// [A3] Bloques comunes de es-419 (LATAM neutro con matices de México). Lo legal y lo factual va aquí
// para que A5 lo revise una sola vez. El tono de cada sitio va en content/<siteId>/es-419.ts.
// Trato: tú en singular, ustedes en plural.
import type { SiteContent } from '@la/contracts';

type Faq = SiteContent['faq']['items'][number];

export const FAQ_419 = {
  legal: {
    q: '¿Es legal en mi país?',
    a: 'Solo te muestro casas con licencia o permiso en el país desde el que entras (en México, permiso de la SEGOB). El número viene en la tarjeta de cada casa. Si en tu país no hay ninguna que cumpla, no te mando a ninguna.',
  },
  payout: {
    q: '¿Cuánto tardan en pagar un retiro?',
    a: 'Depende de la casa y del método. En cada tarjeta ves el plazo que indica la casa. TODO(sergi): plazo real comprobado por el miembro en cada operador y país. El primer retiro suele tardar un poco más porque antes verifican tu cuenta.',
  },
  payments: {
    q: '¿Cómo deposito y retiro?',
    a: 'Cada casa acepta métodos distintos según el país, y en la tarjeta ves cuáles. TODO(sergi): confirmar por operador si aceptan OXXO, SPEI o Mercado Pago en México.',
  },
  kyc: {
    q: '¿Tengo que verificar mi identidad?',
    a: 'Sí. Te van a pedir una identificación oficial (en México, INE o pasaporte) para confirmar quién eres y que eres mayor de edad. Si la subes al registrarte, tu primer retiro no se queda detenido.',
  },
  bonus: {
    q: '¿Qué pasa con el bono si retiro antes de cumplir las condiciones?',
    a: 'Lo normal es que se cancele el bono y lo que venga de él. El dinero que tú depositaste sigue siendo tuyo. Cada casa lo explica en sus condiciones: tienes el enlace justo debajo de la oferta. Y si no te convencen, puedes registrarte sin aceptar el bono.',
  },
  exit: {
    q: '¿Y si después no me gusta la casa?',
    a: 'No hay permanencia ni mensualidad. Puedes dejar de usarla, retirar tu saldo y pedir que cierren tu cuenta desde tu perfil o con soporte.',
  },
  limits: {
    q: '¿Puedo ponerme límites?',
    a: 'Sí, y te lo recomiendo antes del primer depósito: límite de depósito, de tiempo o una pausa. Si necesitas parar del todo, pide la autoexclusión en la propia casa.',
  },
} satisfies Record<string, Faq>;

export function faqCommission419(answerLead: string): Faq {
  return {
    q: '¿Tú ganas algo si me registro?',
    a: `${answerLead} La casa me paga una comisión si abres tu cuenta con mi enlace. A ti no te cambia el bono ni las condiciones.`,
  };
}

export const STEPS_419_ITEMS: SiteContent['steps']['items'] = [
  {
    title: 'Toca el botón',
    body: 'Te lleva a la página oficial de la casa. El enlace es mío, pero el registro lo haces directo con ellos.',
  },
  {
    title: 'Regístrate con tu identificación',
    body: 'Nombre, correo y tu INE o pasaporte. La casa tiene que confirmar tu edad y tu identidad: lo pide la regulación, no es capricho.',
  },
  {
    title: 'Decide si quieres el bono',
    body: 'Checa las condiciones antes del primer depósito y decide con calma. Puedes jugar sin bono. Deja tu límite de depósito puesto desde el primer día.',
  },
];

// TODO(sergi): cronometrar un registro real para confirmar el tiempo estimado.
export const STEPS_419_ESTIMATE = 'Unos 3 minutos';

export const COUNTRY_SWITCHER_419: SiteContent['countrySwitcher'] = {
  notInCountry: '¿No estás en {country}?',
  change: 'Cambiar país',
  modalTitle: '¿Desde qué país entras?',
  searchPlaceholder: 'Busca tu país',
  close: 'Cerrar',
};

export const ERRORS_419: SiteContent['errors'] = {
  generic: 'Algo falló al cargar la página. Vuelve a cargarla en unos segundos.',
  offerUnavailable: 'Esta oferta ya no está activa. Regresa al inicio para ver la que recomiendo ahora.',
};

export const OFFER_CARD_419: Omit<SiteContent['offerCard'], 'ctaSecondary' | 'ratingLabel'> = {
  bonusLabel: 'Bono de bienvenida',
  termsLinkLabel: 'Ver condiciones completas',
  payoutLabel: 'Retiro',
  paymentsLabel: 'Métodos de pago',
  // Genérico: si el país la define, manda compliance.operatorLicenseLabel (A5), p. ej. "Permiso SEGOB" (R1-07).
  licenseLabel: 'Licencia',
  validUntilLabel: 'Promoción válida hasta el',
};

export function disclaimer419(brand: string): string {
  return (
    `Este sitio contiene enlaces de afiliado: si abres una cuenta con ellos, ${brand} puede recibir una comisión del operador, sin costo para ti. ` +
    'Solo para mayores de edad según la ley de tu país. Las condiciones de cada bono las fija el operador y pueden cambiar: revísalas en su sitio antes de aceptarlo. ' +
    'Apostar no es una forma de conseguir dinero. Si el juego deja de ser diversión, busca ayuda: tienes el recurso de tu país al pie de esta página.'
  );
}
