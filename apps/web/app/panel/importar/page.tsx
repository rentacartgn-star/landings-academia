// [A4] Importar conversiones desde el CSV del reporte del operador (cuando el programa no hace postback).
import { requirePanel } from '@/lib/data/panel-auth';
import { getCatalog } from '@/lib/landing/catalog';
import { Shell } from '../_components/Shell';
import { fmt } from '../_components/viz';
import { importCsv } from './actions';

export const dynamic = 'force-dynamic';

const ERR: Record<string, string> = {
  size: 'El archivo supera 2 MB.',
  empty: 'Elige operador y sube un CSV o pégalo.',
  nocol: 'No encuentro la columna del subid/click_id. Renómbrala a "subid" o "click_id".',
  db: 'Error al guardar',
};

export default async function ImportPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await requirePanel('/panel/importar', { admin: true });
  const { catalog } = await getCatalog();

  return (
    <Shell s={s} current="import">
      <h1 className="pn-h1">Importar CSV</h1>
      <p className="pn-sub">
        Cruza por <b>subid</b> (nuestro click_id). Idempotente: subir el mismo reporte dos veces no duplica conversiones.
      </p>
      {sp.e && (
        <div className="pn-banner err pn-glass">
          {ERR[sp.e] ?? 'Error'} {sp.why ?? ''} {sp.cols ? <div className="pn-mono">Columnas: {sp.cols}</div> : null}
        </div>
      )}
      {sp.done && (
        <div className="pn-banner ok pn-glass">
          <b>{sp.op}</b>: {fmt(Number(sp.inserted))} nuevas · {fmt(Number(sp.duplicate))} ya estaban · {fmt(Number(sp.unattributed))} sin clic conocido ·{' '}
          {fmt(Number(sp.operator_mismatch))} de otro operador · {fmt(Number(sp.invalid))} subid no válido · {fmt(Number(sp.skipped))} filas sin subid/tipo.{' '}
          {sp.rolled === 'now' ? 'Estadísticas recalculadas.' : 'Las estadísticas se recalculan en el próximo ciclo del cron.'}
        </div>
      )}
      <form action={importCsv} className="pn-card pn-glass" style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span className="pn-muted">Operador</span>
            <select name="operator" required defaultValue="">
              <option value="" disabled>Elige…</option>
              {catalog.operators.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span className="pn-muted">Tipo si el CSV no trae columna</span>
            <select name="type" defaultValue="ftd">
              <option value="registration">Registro</option>
              <option value="ftd">FTD</option>
              <option value="deposit">Depósito</option>
            </select>
          </label>
        </div>
        <label style={{ display: 'grid', gap: 4 }}>
          <span className="pn-muted">Archivo CSV (máx. 2 MB)</span>
          <input type="file" name="file" accept=".csv,text/csv,text/plain" />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span className="pn-muted">…o pega el contenido</span>
          <textarea name="text" rows={6} placeholder={'subid,event,amount,currency,date\n3f1c…,ftd,50,EUR,2026-10-21'} />
        </label>
        <p className="pn-muted" style={{ fontSize: 12, margin: 0 }}>
          Columnas reconocidas: subid / click_id / aff_sub / btag · event / type · amount / deposit · currency · date · transaction_id. Separador , ; o tabulador.
        </p>
        <div>
          <button className="pn-btn" type="submit">Importar</button>
        </div>
      </form>
    </Shell>
  );
}
