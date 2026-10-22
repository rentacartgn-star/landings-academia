// [A5] Datos del titular de los sitios (LSSI art. 10 y RGPD art. 13). Todo pendiente de Sergi: no se inventa nada.
import type { SiteId } from '@la/contracts';

export interface LegalEntity {
  razonSocial: string;
  nif: string;
  domicilio: string;
  email: string;
  /** Inscripción registral (Registro Mercantil u otro), si es sociedad. */
  registro?: string;
  /** Delegado de protección de datos, si se designa. */
  dpo?: string;
}

const PENDING: LegalEntity = {
  razonSocial: 'TODO(sergi): razón social',
  nif: 'TODO(sergi): NIF/CIF',
  domicilio: 'TODO(sergi): domicilio social',
  email: 'TODO(sergi): email de contacto',
  registro: 'TODO(sergi): datos registrales (si es sociedad)',
};

// TODO(sergi): ¿un titular común (la Academia) o uno por miembro? Si cada miembro factura su afiliación, cada sitio tiene su titular.
export const LEGAL_ENTITIES: Record<SiteId, LegalEntity> = {
  diamond: PENDING,
  donpool: PENDING,
  kronos: PENDING,
  mapache: PENDING,
};

/** Fecha de la última revisión de los textos legales (se muestra en cada página). */
export const LEGAL_UPDATED = '2026-10-22';
