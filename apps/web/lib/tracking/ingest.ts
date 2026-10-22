import 'server-only';
// [A4] Escritura de eventos en landings.events vía RPC public.landings_ingest_events (service role).
// Sin service key → se descartan con un log (la landing nunca se rompe por el tracking).
import { serviceClient } from '@/lib/data/supabase';

export interface EventRow {
  name: 'pageview' | 'offer_view' | 'scroll_depth' | 'cta_click' | 'outbound' | 'country_switch';
  site_id: string;
  country: string;
  geo_country?: string | null;
  locale?: string | null;
  variant?: number | null;
  path?: string | null;
  visitor_hash?: string | null;
  src?: string;
  utm?: Record<string, string> | null;
  referrer_host?: string | null;
  device?: string | null;
  in_app?: string | null;
  offer_id?: string | null;
  operator_id?: string | null;
  rank?: number | null;
  placement?: string;
  depth?: number | null;
  click_id?: string | null;
  props?: Record<string, unknown> | null;
}

export async function insertEvents(rows: EventRow[]): Promise<number> {
  if (!rows.length) return 0;
  const db = serviceClient();
  if (!db) {
    console.info(`[tracking] ${rows.length} evento(s) descartado(s): sin service key (${rows.map((r) => r.name).join(',')})`);
    return 0;
  }
  const { data, error } = await db.rpc('landings_ingest_events', { p_events: rows });
  if (error) {
    console.error('[tracking] landings_ingest_events:', error.message);
    return 0;
  }
  return Number(data ?? 0);
}
