// [A4] Panel · estadísticas. Datos de landings.daily_stats vía RPC INVOKER (la RLS filtra: un miembro solo ve su sitio).
import { requirePanel } from '@/lib/data/panel-auth';
import { breakdown, byDay, parseRange, rate, totals, type StatRow } from '@/lib/data/panel-stats';
import { Shell } from './_components/Shell';
import { Breakdown, DayBars, Funnel, Kpi, fmt, pct } from './_components/viz';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

const RANGES = [
  ['today', 'Hoy'],
  ['7d', '7 días'],
  ['30d', '30 días'],
  ['month', 'Este mes'],
] as const;

function qs(sp: SP, patch: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) if (typeof v === 'string' && v) p.set(k, v);
  for (const [k, v] of Object.entries(patch)) (v ? p.set(k, v) : p.delete(k));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export default async function PanelPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = await requirePanel(`/panel${qs(sp, {})}`);
  const range = parseRange(sp);
  const site = typeof sp.site === 'string' ? sp.site : '';
  const country = typeof sp.country === 'string' ? sp.country.toUpperCase() : '';

  const { data, error } = await s.db.rpc('landings_panel_stats', { p_from: range.from, p_to: range.to });
  const all = (error ? [] : (data as StatRow[])) ?? [];
  const rows = all.filter((r) => (!site || r.site === site) && (!country || r.country === country));
  const t = totals(rows);
  const days = byDay(rows, range.from, range.to);
  const countries = [...new Set(all.map((r) => r.country))].sort();
  const siteName = new Map(s.ctx.sites.map((x) => [x.id, x]));
  const exportHref = `/panel/export${qs(sp, { range: range.key, from: range.from, to: range.to })}`;

  return (
    <Shell s={s} current="stats">
      <h1 className="pn-h1">Estadísticas</h1>
      <p className="pn-sub">
        {range.from === range.to ? range.from : `${range.from} → ${range.to}`} · hora de Madrid · se actualiza cada 15 min
      </p>

      <form className="pn-filters pn-glass" method="get">
        <div className="pn-seg" role="group" aria-label="Rango">
          {RANGES.map(([k, l]) => (
            <a key={k} href={qs(sp, { range: k, from: undefined, to: undefined }) || '?'} aria-current={range.key === k}>
              {l}
            </a>
          ))}
        </div>
        <input type="hidden" name="range" value="custom" />
        <input type="date" name="from" defaultValue={range.from} aria-label="Desde" />
        <input type="date" name="to" defaultValue={range.to} aria-label="Hasta" />
        {s.ctx.sites.length > 1 && (
          <select name="site" defaultValue={site} aria-label="Sitio">
            <option value="">Todos los sitios</option>
            {s.ctx.sites.map((x) => (
              <option key={x.id} value={x.id}>{x.shortName}</option>
            ))}
          </select>
        )}
        <select name="country" defaultValue={country} aria-label="País">
          <option value="">Todos los países</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="pn-btn ghost" type="submit">Aplicar</button>
        <a className="pn-btn ghost" href={exportHref}>Exportar CSV</a>
      </form>

      {error && <div className="pn-banner err pn-glass">No se pudieron leer las estadísticas: {error.message}</div>}
      {!error && s.ctx.sites.length === 0 && (
        <div className="pn-banner pn-glass">Tu usuario no tiene ningún sitio asignado. Un admin puede enlazarte en landings.site_members.</div>
      )}
      {!error && s.ctx.sites.length > 0 && rows.length === 0 && (
        <div className="pn-banner pn-glass">Sin datos en este rango todavía. El resumen diario se recalcula cada 15 minutos.</div>
      )}

      <section className="pn-kpis" aria-label="KPIs">
        <Kpi label="Visitas" value={fmt(t.pageviews)} />
        <Kpi label="Únicos" value={fmt(t.uniques)} hint="suma de únicos diarios" />
        <Kpi label="Clics salientes" value={fmt(t.outbounds)} />
        <Kpi label="CTR" value={pct(rate(t.outbounds, t.pageviews))} hint="salidas / visitas" />
        <Kpi label="Registros" value={fmt(t.registrations)} />
        <Kpi label="FTD" value={fmt(t.ftds)} />
        <Kpi label="Clic → FTD" value={pct(rate(t.ftds, t.outbounds))} />
      </section>

      <div className="pn-grid three">
        <DayBars title="Visitas" color="var(--s1)" points={days.map((d) => ({ day: d.day, v: d.t.pageviews }))} />
        <DayBars title="Clics salientes" color="var(--s2)" points={days.map((d) => ({ day: d.day, v: d.t.outbounds }))} />
        <DayBars title="FTD" color="var(--s3)" points={days.map((d) => ({ day: d.day, v: d.t.ftds }))} />
      </div>

      <div className="pn-grid two">
        <div className="pn-card pn-glass">
          <h2 className="pn-h2">Embudo</h2>
          <Funnel
            steps={[
              { label: 'Visitas', v: t.pageviews },
              { label: 'Vistas de oferta', v: t.offerViews },
              { label: 'Clics CTA', v: t.ctaClicks },
              { label: 'Salidas (/go)', v: t.outbounds },
              { label: 'Registros', v: t.registrations },
              { label: 'FTD', v: t.ftds },
            ]}
          />
          <p className="pn-muted" style={{ fontSize: 12, marginBottom: 0 }}>
            Vistas de oferta y clics CTA vienen del navegador (con JS); las salidas se cuentan en el servidor, por eso pueden superar a los clics CTA.
          </p>
        </div>
        <Breakdown
          title="Por miembro"
          dim="site"
          rows={breakdown(rows, 'site')}
          keyLabel={(k) => {
            const x = siteName.get(k);
            return x ? `${x.shortName}${x.members.length ? ` · ${x.members.join(', ')}` : ''}` : k;
          }}
        />
      </div>

      <div className="pn-grid two">
        <Breakdown title="Por país" dim="country" rows={breakdown(rows, 'country')} />
        <Breakdown title="Por operador" dim="operator" rows={breakdown(rows, 'operator')} />
      </div>
      <div className="pn-grid two">
        <Breakdown title="Por src" dim="src" rows={breakdown(rows, 'src')} />
        <Breakdown title="Por placement" dim="placement" rows={breakdown(rows, 'placement')} keyLabel={(k) => k || <span className="pn-muted">(sin placement)</span>} />
      </div>
    </Shell>
  );
}
