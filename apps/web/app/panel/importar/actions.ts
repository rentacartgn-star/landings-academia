'use server';
// [A4] Importación CSV de conversiones (programas sin postback). Cruza por subid = click_id. Solo admin (RLS + comprobación).
import { redirect } from 'next/navigation';
import { lookupSession } from '@/lib/data/panel-auth';
import { serviceClient } from '@/lib/data/supabase';
import { parseCsv, toConversionRows } from '@/lib/data/csv';
import { madridDayPure } from '@/lib/data/dates';

const MAX_BYTES = 2 * 1024 * 1024;
const CHUNK = 500;

export async function importCsv(form: FormData): Promise<void> {
  const r = await lookupSession();
  if (r.kind !== 'ok' || !r.session.ctx.isAdmin) redirect('/panel/login');
  const operator = String(form.get('operator') ?? '');
  const defaultType = String(form.get('type') ?? '');
  const file = form.get('file');
  let text = String(form.get('text') ?? '');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) redirect('/panel/importar?e=size');
    text = await file.text();
  }
  if (!operator || !text.trim()) redirect('/panel/importar?e=empty');

  const { mapping, rows, skipped } = toConversionRows(parseCsv(text), defaultType);
  if (mapping.click < 0) redirect(`/panel/importar?e=nocol&cols=${encodeURIComponent(mapping.header.join(' | ').slice(0, 300))}`);

  const sum: Record<string, number> = { inserted: 0, duplicate: 0, unattributed: 0, operator_mismatch: 0, invalid: 0 };
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { data, error } = await r.session.db.rpc('landings_admin_import_conversions', { p_operator: operator, p_rows: rows.slice(i, i + CHUNK) });
    if (error) redirect(`/panel/importar?e=db&why=${encodeURIComponent(error.message)}`);
    for (const [k, v] of Object.entries((data ?? {}) as Record<string, number>)) sum[k] = (sum[k] ?? 0) + Number(v);
  }

  // Recalcula el resumen de los días afectados ya (si hay service key); si no, lo hace el cron nocturno (40 días).
  const days = rows.map((x) => (x.occurred_at ?? new Date().toISOString()).slice(0, 10)).sort();
  const svc = serviceClient();
  let rolled = 'cron';
  if (svc && days.length) {
    const { error } = await svc.rpc('landings_rollup', { p_from: days[0], p_to: madridDayPure() });
    rolled = error ? 'cron' : 'now';
  }
  const q = new URLSearchParams({ done: '1', op: operator, skipped: String(skipped), rolled, ...Object.fromEntries(Object.entries(sum).map(([k, v]) => [k, String(v)])) });
  redirect(`/panel/importar?${q}`);
}
