// [A4] Exporta a CSV las filas de daily_stats del rango y filtros actuales (misma RLS que el panel).
import { lookupSession } from '@/lib/data/panel-auth';
import { parseRange, toCsv, type StatRow } from '@/lib/data/panel-stats';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const r = await lookupSession();
  if (r.kind !== 'ok' || !r.session.ctx.role) return new Response('No autorizado', { status: 401 });
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const range = parseRange(sp);
  const { data, error } = await r.session.db.rpc('landings_panel_stats', { p_from: range.from, p_to: range.to });
  if (error) return new Response(error.message, { status: 500 });
  const rows = ((data as StatRow[]) ?? []).filter(
    (x) => (!sp.site || x.site === sp.site) && (!sp.country || x.country === sp.country.toUpperCase()),
  );
  return new Response(`﻿${toCsv(rows)}\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="landings_${range.from}_${range.to}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
