// [A4] Piezas visuales del panel (Server Components, SVG sin librerías). Una serie por gráfica: nunca doble eje.
import type { ReactNode } from 'react';
import { rate, type Dim, type Totals } from '@/lib/data/panel-stats';

const nf = new Intl.NumberFormat('es-ES');
const pf = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 });
export const fmt = (n: number) => nf.format(Math.round(n));
export const pct = (v: number | null) => (v === null ? '—' : pf.format(v));

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="pn-kpi pn-glass">
      <div className="l">{label}</div>
      <div className="v">{value}</div>
      {hint && <div className="h">{hint}</div>}
    </div>
  );
}

/** Barras por día de una sola métrica. Tooltip nativo (<title>) por barra; objetivo de hover = columna entera. */
export function DayBars({ title, color, points }: { title: string; color: string; points: { day: string; v: number }[] }) {
  const W = 600;
  const H = 120;
  const max = Math.max(1, ...points.map((p) => p.v));
  const n = Math.max(1, points.length);
  const slot = W / n;
  const bw = Math.max(2, Math.min(28, slot - 2));
  const total = points.reduce((a, p) => a + p.v, 0);
  const label = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
  return (
    <div className="pn-card pn-glass pn-chart">
      <h2 className="pn-h2">{title}</h2>
      <div className="total">{fmt(total)}</div>
      <svg viewBox={`0 0 ${W} ${H + 16}`} preserveAspectRatio="none" role="img" aria-label={`${title} por día`}>
        <line className="grid" x1="0" x2={W} y1={H} y2={H} />
        <line className="grid" x1="0" x2={W} y1={H / 2} y2={H / 2} strokeDasharray="2 4" />
        {points.map((p, i) => {
          const h = (p.v / max) * (H - 8);
          const x = i * slot + (slot - bw) / 2;
          return (
            <g key={p.day} className="bar">
              <title>{`${label(p.day)}: ${fmt(p.v)}`}</title>
              <rect x={i * slot} y={0} width={slot} height={H} fill="transparent" />
              {p.v > 0 && <rect x={x} y={H - h} width={bw} height={h} rx={Math.min(4, bw / 2)} fill={color} />}
            </g>
          );
        })}
        {points.length > 0 && (
          <>
            <text className="axis" x="0" y={H + 13}>{label(points[0]!.day)}</text>
            <text className="axis" x={W} y={H + 13} textAnchor="end">{label(points[points.length - 1]!.day)}</text>
          </>
        )}
      </svg>
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; v: number }[] }) {
  const top = Math.max(1, steps[0]?.v ?? 1);
  return (
    <div className="pn-funnel">
      {steps.map((s, i) => (
        <div className="pn-step" key={s.label}>
          <span>{s.label}</span>
          <div className="track" title={`${s.label}: ${fmt(s.v)}`}>
            <div className="fill" style={{ width: `${Math.max(s.v > 0 ? 1.5 : 0, (s.v / top) * 100)}%` }} />
          </div>
          <span className="n">
            {fmt(s.v)}
            {i > 0 && <span className="pn-muted"> · {pct(rate(s.v, steps[i - 1]!.v))}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

const DIM_COLS: Record<Dim, (keyof Totals)[]> = {
  site: ['pageviews', 'uniques', 'outbounds', 'registrations', 'ftds'],
  country: ['pageviews', 'uniques', 'outbounds', 'registrations', 'ftds'],
  src: ['pageviews', 'uniques', 'outbounds', 'registrations', 'ftds'],
  operator: ['offerViews', 'ctaClicks', 'outbounds', 'registrations', 'ftds'],
  placement: ['ctaClicks', 'outbounds', 'registrations', 'ftds'],
};
const COL_LABEL: Partial<Record<keyof Totals, string>> = {
  pageviews: 'Visitas', uniques: 'Únicos', offerViews: 'Vistas oferta', ctaClicks: 'Clics CTA', outbounds: 'Salidas',
  registrations: 'Registros', ftds: 'FTD',
};

export function Breakdown({ title, dim, rows, keyLabel }: { title: string; dim: Dim; rows: { key: string; t: Totals }[]; keyLabel?: (k: string) => ReactNode }) {
  const cols = DIM_COLS[dim];
  const showCtr = dim !== 'operator' && dim !== 'placement';
  return (
    <div className="pn-card pn-glass">
      <h2 className="pn-h2">{title}</h2>
      {rows.length === 0 ? (
        <p className="pn-muted">Sin datos.</p>
      ) : (
        <div className="pn-table-wrap">
          <table className="pn-table">
            <thead>
              <tr>
                <th scope="col">{title.replace(/^Por /, '')}</th>
                {cols.map((c) => (
                  <th key={c} className="n" scope="col">{COL_LABEL[c]}</th>
                ))}
                {showCtr && <th className="n" scope="col">CTR</th>}
                <th className="n" scope="col">Clic→FTD</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 25).map((r) => (
                <tr key={r.key}>
                  <td>{keyLabel ? keyLabel(r.key) : r.key || <span className="pn-muted">(directo)</span>}</td>
                  {cols.map((c) => (
                    <td key={c} className="n">{fmt(r.t[c])}</td>
                  ))}
                  {showCtr && <td className="n">{pct(rate(r.t.outbounds, r.t.pageviews))}</td>}
                  <td className="n">{pct(rate(r.t.ftds, r.t.outbounds))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
