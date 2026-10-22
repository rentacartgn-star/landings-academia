// [A4] CSV del reporte del operador → filas de conversión. Detecta separador (, ; tab) y columnas por nombre habitual.
export interface ConversionCsvRow {
  click_id: string;
  type: string;
  amount: number | null;
  currency: string | null;
  occurred_at: string | null;
  txn_id: string | null;
  raw: Record<string, string>;
}

/** Parser RFC 4180 mínimo (comillas dobles, saltos de línea dentro de comillas). */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] ?? '';
  const sep = [',', ';', '\t'].map((c) => [c, firstLine.split(c).length] as const).sort((a, b) => b[1] - a[1])[0]![0];
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (q) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const COLS = {
  click: ['clickid', 'subid', 'subid1', 'sub1', 'affsub', 'affsub1', 'var1', 'btag', 'tracker', 'customid', 'clickref'],
  type: ['event', 'type', 'eventtype', 'goal', 'action', 'conversiontype'],
  amount: ['amount', 'depositamount', 'firstdepositamount', 'ftdamount', 'deposit', 'value', 'deposits'],
  currency: ['currency', 'cur', 'curr'],
  date: ['date', 'eventdate', 'conversiondate', 'ftddate', 'timestamp', 'createdat', 'signupdate', 'registrationdate'],
  txn: ['txnid', 'transactionid', 'transaction', 'txn', 'depositid'],
};
const TYPES: Record<string, string> = {
  registration: 'registration', reg: 'registration', signup: 'registration', lead: 'registration', registro: 'registration',
  ftd: 'ftd', firstdeposit: 'ftd', fd: 'ftd', primerdeposito: 'ftd',
  deposit: 'deposit', dep: 'deposit', deposito: 'deposit', redeposit: 'deposit',
};

export interface CsvMapping {
  header: string[];
  click: number;
  type: number;
  amount: number;
  currency: number;
  date: number;
  txn: number;
}

export function detectColumns(header: string[]): CsvMapping {
  const h = header.map(norm);
  const find = (names: string[]) => h.findIndex((x) => names.includes(x));
  return { header, click: find(COLS.click), type: find(COLS.type), amount: find(COLS.amount), currency: find(COLS.currency), date: find(COLS.date), txn: find(COLS.txn) };
}

function toIso(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  // dd/mm/yyyy (formato habitual en reportes europeos)
  const eu = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  const d = eu ? new Date(Date.UTC(+eu[3]!, +eu[2]! - 1, +eu[1]!, +(eu[4] ?? 12), +(eu[5] ?? 0), +(eu[6] ?? 0))) : new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function toAmount(v: string): number | null {
  const s = v.replace(/[^\d,.-]/g, '');
  if (!s) return null;
  // "1.234,56" → 1234.56 ; "1,234.56" → 1234.56
  const n = s.includes(',') && (!s.includes('.') || s.lastIndexOf(',') > s.lastIndexOf('.')) ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
}

/** Filas listas para la RPC. `defaultType` se usa si el CSV no trae columna de tipo (p. ej. un reporte solo de FTD). */
export function toConversionRows(rows: string[][], defaultType: string): { mapping: CsvMapping; rows: ConversionCsvRow[]; skipped: number } {
  const [header = [], ...body] = rows;
  const m = detectColumns(header);
  let skipped = 0;
  const out: ConversionCsvRow[] = [];
  for (const r of body) {
    const click = m.click >= 0 ? (r[m.click] ?? '').trim() : '';
    const t = m.type >= 0 ? TYPES[norm(r[m.type] ?? '')] : defaultType;
    if (!click || !t) {
      skipped++;
      continue;
    }
    out.push({
      click_id: click,
      type: t,
      amount: m.amount >= 0 ? toAmount(r[m.amount] ?? '') : null,
      currency: m.currency >= 0 ? (r[m.currency] ?? '').trim().toUpperCase().slice(0, 3) || null : null,
      occurred_at: m.date >= 0 ? toIso(r[m.date] ?? '') : null,
      txn_id: m.txn >= 0 ? (r[m.txn] ?? '').trim() || null : null,
      raw: Object.fromEntries(header.map((k, i) => [k.slice(0, 40), (r[i] ?? '').slice(0, 200)])),
    });
  }
  return { mapping: m, rows: out, skipped };
}
