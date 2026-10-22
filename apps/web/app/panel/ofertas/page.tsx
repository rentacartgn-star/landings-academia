// [A4] Admin de ofertas: enlace, bono, orden y activo por (sitio, país, operador) + "probar enlace" (dry-run de /go).
// Un miembro ve sus ofertas en solo lectura (RLS).
import { requirePanel } from '@/lib/data/panel-auth';
import { buildAffiliateUrl, resolveOffer } from '@/lib/tracking/outbound';
import { Shell } from '../_components/Shell';
import { updateOffer } from './actions';

export const dynamic = 'force-dynamic';

interface PanelOffer {
  id: string;
  siteId: string;
  country: string;
  operatorId: string;
  rank: number;
  affiliateUrlTemplate: string;
  bonusHeadline: string;
  bonusTermsShort: string;
  termsUrl: string;
  active: boolean;
  validFrom: string | null;
  validTo: string | null;
  updatedAt: string;
}

const REASON: Record<string, string> = {
  inactive: 'la oferta está inactiva: /go redirige a la landing',
  expired: 'la oferta ha caducado (validTo)',
  not_started: 'la oferta aún no ha empezado (validFrom)',
  bad_template: 'la plantilla no es https o no lleva {click_id}',
  not_publishable: 'el mercado no está aprobado por compliance (COMPLIANCE_APPROVED_MARKETS)',
  unlicensed: 'el operador no tiene licencia registrada en ese país',
};

async function dryRun(id: string) {
  const r = await resolveOffer(id);
  if (r.kind === 'not_found') return { id, ok: false, msg: 'La oferta no existe en el catálogo que sirve /go.' };
  if (r.kind === 'unavailable') return { id, ok: false, msg: `No saldría: ${REASON[r.reason]}.` };
  const clickId = crypto.randomUUID();
  return { id, ok: true, msg: `302 → ${buildAffiliateUrl(r.offer.affiliateUrlTemplate, clickId)}`, clickId };
}

export default async function OffersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await requirePanel('/panel/ofertas');
  const { data, error } = await s.db.rpc('landings_panel_offers');
  const all = ((data as PanelOffer[]) ?? []).filter((o) => (!sp.site || o.siteId === sp.site) && (!sp.country || o.country === sp.country));
  // Solo se prueba una oferta que el usuario puede ver (RLS): un miembro no ve enlaces de otros sitios.
  const test = sp.test && ((data as PanelOffer[]) ?? []).some((o) => o.id === sp.test) ? await dryRun(sp.test) : null;
  const groups = new Map<string, PanelOffer[]>();
  for (const o of all) groups.set(`${o.siteId} · ${o.country}`, [...(groups.get(`${o.siteId} · ${o.country}`) ?? []), o]);
  const countries = [...new Set(((data as PanelOffer[]) ?? []).map((o) => o.country))].sort();
  const admin = s.ctx.isAdmin;

  return (
    <Shell s={s} current="offers">
      <h1 className="pn-h1">Ofertas</h1>
      <p className="pn-sub">
        {admin ? 'Al guardar, la caché de la landing se revalida: el cambio se ve en la siguiente visita.' : 'Solo lectura: los cambios los hace un admin.'}
      </p>

      <form className="pn-filters pn-glass" method="get">
        {s.ctx.sites.length > 1 && (
          <select name="site" defaultValue={sp.site ?? ''} aria-label="Sitio">
            <option value="">Todos los sitios</option>
            {s.ctx.sites.map((x) => (
              <option key={x.id} value={x.id}>{x.shortName}</option>
            ))}
          </select>
        )}
        <select name="country" defaultValue={sp.country ?? ''} aria-label="País">
          <option value="">Todos los países</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="pn-btn ghost" type="submit">Filtrar</button>
      </form>

      {error && <div className="pn-banner err pn-glass">No se pudieron leer las ofertas: {error.message}</div>}
      {sp.ok && <div className="pn-banner ok pn-glass">Guardada <b>{sp.ok}</b> y caché revalidada.</div>}
      {sp.err && <div className="pn-banner err pn-glass">No se guardó <b>{sp.err}</b>: {sp.why}</div>}
      {test && (
        <div className={`pn-banner pn-glass ${test.ok ? 'ok' : 'err'}`}>
          <b>Probar enlace · {test.id}</b>
          <div className="pn-mono" style={{ marginTop: 6 }}>{test.msg}</div>
          {test.ok && <div className="pn-muted" style={{ fontSize: 12, marginTop: 4 }}>Dry-run: click_id de ejemplo, no se registra ningún clic. Usa el catálogo en caché que sirve /go.</div>}
        </div>
      )}

      {[...groups].map(([g, offers]) => (
        <section key={g} style={{ marginBottom: 18 }}>
          <h2 className="pn-h2">{g}</h2>
          <div className="pn-grid">
            {offers.map((o) => (
              <div key={o.id} id={`o-${o.id}`} className="pn-offer pn-glass">
                <div className="pn-offer-head">
                  <div>
                    <b>{o.operatorId}</b> <span className="pn-muted">#{o.rank} · {o.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`pn-pill ${o.active ? 'on' : 'off'}`}>{o.active ? 'activa' : 'inactiva'}</span>
                    <a className="pn-btn ghost small" href={`/panel/ofertas?${new URLSearchParams({ ...(sp.site ? { site: sp.site } : {}), ...(sp.country ? { country: sp.country } : {}), test: o.id })}#o-${o.id}`}>
                      Probar enlace
                    </a>
                  </div>
                </div>
                {admin ? (
                  <form action={updateOffer}>
                    <input type="hidden" name="id" value={o.id} />
                    <label>
                      Enlace de afiliado (con {'{click_id}'})
                      <input name="affiliateUrlTemplate" defaultValue={o.affiliateUrlTemplate} required pattern="https://.*\{click_id\}.*" />
                    </label>
                    <label>
                      Bono (titular)
                      <input name="bonusHeadline" defaultValue={o.bonusHeadline} maxLength={160} />
                    </label>
                    <label>
                      Condiciones cortas
                      <input name="bonusTermsShort" defaultValue={o.bonusTermsShort} maxLength={400} />
                    </label>
                    <label>
                      Orden
                      <input name="rank" type="number" min={1} max={4} defaultValue={o.rank} required />
                    </label>
                    <label style={{ alignContent: 'end' }}>
                      <span>
                        <input name="active" type="checkbox" defaultChecked={o.active} /> Activa
                      </span>
                    </label>
                    <button className="pn-btn" type="submit">Guardar</button>
                  </form>
                ) : (
                  <div className="pn-mono pn-muted">{o.affiliateUrlTemplate}</div>
                )}
                <div className="pn-muted" style={{ fontSize: 11 }}>Actualizada {new Date(o.updatedAt).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </Shell>
  );
}
