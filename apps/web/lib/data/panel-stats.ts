// [A4] Agregación de daily_stats para el panel (puro, sin E/S). Filas: día × sitio × país × operador × src × placement.
// operator = '' y placement = '' → métricas de página (visitas, únicos). Únicos de un rango = suma de únicos diarios
// (la sal rota cada día, así que no se puede deduplicar entre días: es el mismo criterio que Plausible).
import { madridDayPure } from './dates';

export interface StatRow {
  day: string;
  site: string;
  country: string;
  operator: string;
  src: string;
  placement: string;
  pageviews: number;
  uniques: number;
  offerViews: number;
  ctaClicks: number;
  outbounds: number;
  registrations: number;
  ftds: number;
  deposits: number;
  depositAmount: number;
}

export type Metric = 'pageviews' | 'uniques' | 'offerViews' | 'ctaClicks' | 'outbounds' | 'registrations' | 'ftds' | 'deposits' | 'depositAmount';
export const METRICS: Metric[] = ['pageviews', 'uniques', 'offerViews', 'ctaClicks', 'outbounds', 'registrations', 'ftds', 'deposits', 'depositAmount'];
export type Totals = Record<Metric, number>;

export const zero = (): Totals => Object.fromEntries(METRICS.map((m) => [m, 0])) as Totals;

function add(t: Totals, r: StatRow) {
  for (const m of METRICS) t[m] += Number(r[m]) || 0;
}

export function totals(rows: StatRow[]): Totals {
  const t = zero();
  rows.forEach((r) => add(t, r));
  return t;
}

export function rate(n: number, d: number): number | null {
  return d > 0 ? n / d : null;
}

export function byDay(rows: StatRow[], from: string, to: string): { day: string; t: Totals }[] {
  const map = new Map<string, Totals>();
  for (let d = from; d <= to; d = nextDay(d)) map.set(d, zero());
  for (const r of rows) {
    const t = map.get(r.day);
    if (t) add(t, r);
  }
  return [...map].map(([day, t]) => ({ day, t }));
}

export type Dim = 'site' | 'country' | 'operator' | 'src' | 'placement';
export function breakdown(rows: StatRow[], dim: Dim): { key: string; t: Totals }[] {
  const map = new Map<string, Totals>();
  for (const r of rows) {
    // Por operador/placement solo cuentan filas de oferta; las de página (clave '') no son "sin operador".
    if ((dim === 'operator' && r.operator === '') || (dim === 'placement' && r.placement === '' && r.ctaClicks + r.outbounds + r.registrations + r.ftds === 0)) continue;
    const key = r[dim];
    const t = map.get(key) ?? zero();
    add(t, r);
    map.set(key, t);
  }
  return [...map].map(([key, t]) => ({ key, t })).sort((a, b) => b.t.outbounds - a.t.outbounds || b.t.pageviews - a.t.pageviews);
}

export function nextDay(d: string): string {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + 1);
  return x.toISOString().slice(0, 10);
}
export function addDays(d: string, n: number): string {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
}

export type RangeKey = 'today' | '7d' | '30d' | 'month' | 'custom';
export interface Range {
  key: RangeKey;
  from: string;
  to: string;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function parseRange(sp: Record<string, string | string[] | undefined>): Range {
  const today = madridDayPure();
  const k = String(sp.range ?? '7d') as RangeKey;
  const from = String(sp.from ?? '');
  const to = String(sp.to ?? '');
  if (k === 'custom' && ISO.test(from) && ISO.test(to) && from <= to && addDays(from, 366) >= to) return { key: k, from, to };
  if (k === 'today') return { key: k, from: today, to: today };
  if (k === '30d') return { key: k, from: addDays(today, -29), to: today };
  if (k === 'month') return { key: k, from: `${today.slice(0, 8)}01`, to: today };
  return { key: '7d', from: addDays(today, -6), to: today };
}

export function toCsv(rows: StatRow[]): string {
  const cols: (keyof StatRow)[] = ['day', 'site', 'country', 'operator', 'src', 'placement', ...METRICS];
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n;]/.test(s) || /^[=+\-@]/.test(s) ? `"${s.replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}
