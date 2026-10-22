// [A3] Bloques comunes de es-ES (España). Lo legal y lo factual va aquí para que A5 lo revise una sola vez
// y no diverja entre sitios. El tono de cada sitio va en content/<siteId>/es-ES.ts.
import type { SiteContent } from '@la/contracts';

type Faq = SiteContent['faq']['items'][number];

export const FAQ_ES = {
  legal: {
    q: '¿Es legal apostar en esta casa desde España?',
    a: 'Sí. Aquí solo aparecen casas con licencia de la DGOJ (Dirección General de Ordenación del Juego). Tienes el número de licencia en la tarjeta de cada casa y puedes comprobarlo en ordenacionjuego.es.',
  },
  payout: {
    q: '¿Cuánto tardan en pagar una retirada?',
    a: 'Depende de la casa y del método que uses. En cada tarjeta tienes el plazo que indica la casa. TODO(sergi): plazo real comprobado por el miembro en cada operador. La primera retirada suele tardar algo más porque antes tienen que verificar tu cuenta.',
  },
  kyc: {
    q: '¿Tengo que verificar mi identidad?',
    a: 'Sí, y es obligatorio por ley. Te pedirán DNI o NIE para comprobar quién eres y que tienes más de 18 años. Si lo haces nada más registrarte, la primera retirada no se queda esperando.',
  },
  bonus: {
    q: '¿Qué pasa con el bono si retiro antes de cumplir las condiciones?',
    a: 'Lo habitual es que se cancele el bono y lo que salga de él. El dinero que tú hayas depositado sigue siendo tuyo. Cada casa lo explica en sus condiciones: tienes el enlace justo debajo de la oferta. Y si no te convencen, puedes registrarte sin aceptar el bono.',
  },
  exit: {
    q: '¿Y si luego no me gusta la casa?',
    a: 'No hay permanencia ni cuota. Puedes dejar de usarla, retirar tu saldo y pedir que cierren la cuenta desde tu área de cliente o escribiendo a soporte.',
  },
  limits: {
    q: '¿Puedo ponerme límites?',
    a: 'Sí, y te lo recomiendo antes del primer depósito: límite de depósito, de tiempo de sesión o una pausa. Si necesitas cortar del todo, puedes inscribirte en el RGIAJ y ninguna casa con licencia en España te dejará jugar.',
  },
} satisfies Record<string, Faq>;

/** Pregunta de transparencia sobre la comisión; cada sitio pone su voz en la respuesta. */
export function faqCommissionES(answerLead: string): Faq {
  return {
    q: '¿Tú te llevas algo si me registro?',
    a: `${answerLead} La casa me paga una comisión si abres la cuenta con mi enlace. A ti no te cambia el bono ni las condiciones.`,
  };
}

export const STEPS_ES_ITEMS: SiteContent['steps']['items'] = [
  {
    title: 'Pulsa el botón',
    body: 'Te lleva a la web oficial de la casa. El enlace es mío, pero el registro lo haces directamente con ellos.',
  },
  {
    title: 'Regístrate con tu DNI o NIE',
    body: 'Nombre, correo y documento. La casa tiene que verificar tu edad y tu identidad: es la ley, no un capricho suyo.',
  },
  {
    title: 'Decide si quieres el bono',
    body: 'Lee las condiciones antes del primer depósito y decide con calma. Puedes jugar sin bono. Deja puesto tu límite de depósito desde el primer día.',
  },
];

// TODO(sergi): cronometrar un registro real para confirmar el tiempo estimado.
export const STEPS_ES_ESTIMATE = 'Unos 3 minutos';

export const COUNTRY_SWITCHER_ES: SiteContent['countrySwitcher'] = {
  notInCountry: '¿No estás en {country}?',
  change: 'Cambiar país',
  modalTitle: '¿Desde qué país entras?',
  searchPlaceholder: 'Busca tu país',
  close: 'Cerrar',
};

export const ERRORS_ES: SiteContent['errors'] = {
  generic: 'Algo ha fallado al cargar la página. Recarga en unos segundos.',
  offerUnavailable: 'Esta oferta ya no está activa. Vuelve al inicio para ver la que recomiendo ahora.',
};

export const OFFER_CARD_ES: Omit<SiteContent['offerCard'], 'ctaSecondary' | 'ratingLabel'> = {
  bonusLabel: 'Bono de bienvenida',
  termsLinkLabel: 'Ver condiciones completas',
  payoutLabel: 'Retirada',
  paymentsLabel: 'Métodos de pago',
  // Genérico: si el país la define, manda compliance.operatorLicenseLabel (A5), p. ej. "Permiso SEGOB" (R1-07).
  licenseLabel: 'Licencia',
  validUntilLabel: 'Promoción válida hasta el',
};

export function disclaimerES(brand: string): string {
  return (
    `Esta web contiene enlaces de afiliado: si abres una cuenta a través de ellos, ${brand} puede recibir una comisión del operador, sin coste para ti. ` +
    'Solo para mayores de 18 años. Las condiciones de cada bono las fija el operador y pueden cambiar: consúltalas en su web antes de aceptarlo. ' +
    'Apostar no es una forma de conseguir dinero. Si el juego deja de ser un rato de ocio, pide ayuda en jugarbien.es.'
  );
}
