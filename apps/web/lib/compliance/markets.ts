// [A5] Datos de compliance por mercado. Fuentes y fecha de consulta (22-oct-2026) en compliance/<PAÍS>.md.
// Nada inventado: lo que no está verificado va como TODO(sergi) o se omite (el campo regulator es opcional).
import type { Locale } from '@la/contracts';

export type Text = Partial<Record<Locale, string>> & { 'es-419': string };

export interface MarketDef {
  /** Edad mínima legal para jugar en el mercado. */
  minAge: number;
  regulator?: { name: string; url: string };
  helpline: { name: string; url: string; phone?: string };
  /** Mensajes visibles obligatorios o exigidos por buenas prácticas del mercado. */
  mandatory: Text[];
  /** Mercado con ficha completa en compliance/. Si es false, nunca es publicable (aunque esté en la env). */
  reviewed: boolean;
  /** Etiqueta de la licencia del operador en su tarjeta. Sin ella, la UI usa `content.offerCard.licenseLabel`. */
  operatorLicenseLabel?: Text;
}

/** Texto en el locale pedido, con es-419 como respaldo. */
export function t(text: Text, locale: Locale): string {
  return text[locale] ?? text['es-419'];
}

const PLAY_RESP: Text = { 'es-ES': 'Juega con responsabilidad', 'es-419': 'Juega con responsabilidad', 'en-US': 'Play responsibly' };

export const MARKETS: Record<string, MarketDef> = {
  // Ley 13/2011 + RD 958/2020 (arts. 7, 10.3, 11.3 y 13.4 vigentes). Ver compliance/ES.md.
  ES: {
    minAge: 18,
    regulator: { name: 'DGOJ · Dirección General de Ordenación del Juego', url: 'https://www.ordenacionjuego.es' },
    // jugarbien.es es el portal de juego seguro de la DGOJ; el teléfono es el de FEJAR (no hay línea estatal única).
    helpline: { name: 'jugarbien.es · Ayuda FEJAR 900 200 225', url: 'https://www.jugarbien.es', phone: '900 200 225' },
    mandatory: [
      { 'es-419': 'Publicidad' }, // art. 7.1 RD 958/2020: identificable como comunicación comercial
      { 'es-419': '+18 · Menores no' }, // art. 11.3
      { 'es-419': 'Si juegas, juega con responsabilidad' }, // art. 10.3
      // art. 13.4.d: condiciones clave junto a la promo o, si no caben, aviso + enlace.
      { 'es-419': 'Las promociones tienen condiciones: consúltalas junto a cada oferta antes de registrarte.' },
      { 'es-419': 'Solo operadores con licencia de la DGOJ.' },
    ],
    operatorLicenseLabel: { 'es-419': 'Licencia DGOJ' },
    reviewed: true,
  },
  // LFJS 1947 + Reglamento (art. 9: nº de permiso, menores, juego responsable). Ver compliance/MX.md.
  MX: {
    minAge: 18,
    regulator: { name: 'SEGOB · Dirección General de Juegos y Sorteos', url: 'https://www.juegosysorteos.gob.mx' },
    helpline: {
      name: 'Línea de la Vida (CONASAMA) · 800 911 2000',
      url: 'https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000',
      phone: '800 911 2000',
    },
    mandatory: [
      { 'es-419': 'Publicidad' },
      { 'es-419': 'Los juegos con apuesta están prohibidos para menores de edad.' }, // Reglamento LFJS art. 9 fr. IV
      { 'es-419': 'Juega de forma responsable: el juego es entretenimiento, diversión y esparcimiento.' }, // art. 9 fr. V
      { 'es-419': 'Cada operador muestra su número de permiso SEGOB junto a su oferta.' }, // art. 9 fr. III
    ],
    operatorLicenseLabel: { 'es-419': 'Permiso SEGOB' },
    reviewed: true,
  },
  // Ley 2 de 1998 (JCJ) + Ley 527 de 2026 (menores 18, bloqueo de no licenciados). Ver compliance/PA.md.
  PA: {
    minAge: 18,
    regulator: { name: 'Junta de Control de Juegos (MEF)', url: 'https://www.mef.gob.pa' }, // TODO(sergi): URL propia de la JCJ si la hay
    helpline: { name: 'Juego responsable', url: '/legal/juego-responsable' }, // TODO(sergi): línea de ayuda oficial de Panamá
    mandatory: [
      { 'es-419': 'Publicidad' },
      { 'es-419': 'Prohibido para menores de 18 años.' },
      PLAY_RESP,
      { 'es-419': 'Solo operadores con licencia vigente de la Junta de Control de Juegos.' },
    ],
    operatorLicenseLabel: { 'es-419': 'Licencia JCJ' },
    reviewed: true,
  },
  // Ley Orgánica del Deporte (reforma feb-2026) + Reglamento (DE 422, jun-2026). Régimen en transición. Ver compliance/EC.md.
  EC: {
    minAge: 18,
    // Sin regulator: el ente rector (MINEDEC / Viceministerio del Deporte) no tiene aún registro público de licencias verificado.
    helpline: { name: 'Juego responsable', url: '/legal/juego-responsable' }, // TODO(sergi): línea de ayuda oficial de Ecuador
    mandatory: [
      { 'es-419': 'Publicidad' },
      { 'es-419': 'Solo para mayores de 18 años.' },
      PLAY_RESP,
    ],
    operatorLicenseLabel: { 'es-419': 'Licencia LOPD' },
    reviewed: true,
  },
  // Por estados. BetMGM: 21+ y mensajes de cada estado. Ver compliance/US.md. No publicable sin licencia de afiliado estatal.
  US: {
    minAge: 21,
    helpline: { name: 'National Problem Gambling Helpline (NCPG) · 1-800-MY-RESET', url: 'https://www.ncpgambling.org', phone: '1-800-MY-RESET' },
    mandatory: [
      { 'es-419': 'Publicidad', 'en-US': 'Advertisement' },
      { 'es-419': '21+ · Solo en estados donde es legal', 'en-US': '21+ · Only where legal' },
      {
        'es-419': '¿Problemas con el juego? Llama a 1-800-MY-RESET',
        'en-US': 'Gambling problem? Call 1-800-MY-RESET',
      },
    ],
    operatorLicenseLabel: { 'es-419': 'Licencia estatal', 'en-US': 'State license' },
    reviewed: true,
  },
};

/** Bloque genérico prudente para países sin ficha: nunca publicable, 18+ y recursos propios. */
export const GENERIC: MarketDef = {
  minAge: 18,
  helpline: { name: 'Juego responsable', url: '/legal/juego-responsable' },
  mandatory: [{ 'es-419': 'Publicidad', 'en-US': 'Advertisement' }, { 'es-419': 'Solo para mayores de edad.', 'en-US': 'Adults only.' }, PLAY_RESP],
  reviewed: false,
};

export const TRUST_BAR: Text = {
  'es-ES': '+{age} · Juega con responsabilidad',
  'es-419': '+{age} · Juega con responsabilidad',
  'en-US': '{age}+ · Play responsibly',
};
