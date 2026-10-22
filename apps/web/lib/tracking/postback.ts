import 'server-only';
// [A4] Secretos y firma de postbacks por operador (los usa /api/postback y el panel para generar URLs de prueba).
import { createHmac } from 'node:crypto';

/** POSTBACK_SECRET_<OPERADOR> (mayúsculas, no alfanumérico → _), p. ej. POSTBACK_SECRET_DEMO_C. */
export function secretFor(op: string): string | undefined {
  return process.env[`POSTBACK_SECRET_${op.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`] || undefined;
}

export function signPostback(secret: string, f: { click_id: string; event: string; amount?: string; currency?: string; txn_id?: string; ts?: string }) {
  const msg = [f.click_id, f.event, f.amount ?? '', f.currency ?? '', f.txn_id ?? '', f.ts ?? ''].join('|');
  return createHmac('sha256', secret).update(msg).digest('hex');
}
