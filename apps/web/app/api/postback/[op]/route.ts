// [A4] Postback S2S de los operadores: GET/POST /api/postback/<operator>?click_id=...&event=ftd&amount=...&token=...
// Autenticación por operador (env POSTBACK_SECRET_<OPERADOR>, p. ej. POSTBACK_SECRET_SPORTIUM, POSTBACK_SECRET_DEMO_C):
//  · token: `token=<secreto>` en la query o cabecera `x-postback-token` (lo que admiten casi todas las plataformas).
//  · firma: `sig=hex(HMAC-SHA256(secreto, "click_id|event|amount|currency|txn_id|ts"))` para quien pueda firmar.
// Si no cuadra → 401. TODO lo que llega se guarda en landings.postback_log (token/sig redactados).
// Idempotente por (operador, click_id, tipo[, txn_id para depósitos]): repetir devuelve 200 "duplicate".
import { timingSafeEqual } from 'node:crypto';
import { secretFor, signPostback } from '@/lib/tracking/postback';
import { ConversionTypeSchema } from '@la/contracts';
import { getCatalog } from '@/lib/landing/catalog';
import { serviceClient } from '@/lib/data/supabase';

export const dynamic = 'force-dynamic';

const EVENT_ALIASES: Record<string, string> = {
  reg: 'registration', registration: 'registration', signup: 'registration', sign_up: 'registration', lead: 'registration',
  ftd: 'ftd', first_deposit: 'ftd', firstdeposit: 'ftd', fd: 'ftd',
  deposit: 'deposit', dep: 'deposit', redeposit: 'deposit',
};
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const pick = (p: URLSearchParams, ...keys: string[]) => {
  for (const k of keys) {
    const v = p.get(k);
    if (v) return v.trim();
  }
  return '';
};

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function handle(req: Request, opRaw: string): Promise<Response> {
  const op = opRaw.toLowerCase();
  const url = new URL(req.url);
  const params = new URLSearchParams(url.searchParams);
  let bodyText = '';
  if (req.method === 'POST') {
    bodyText = (await req.text()).slice(0, 8000);
    const ct = req.headers.get('content-type') ?? '';
    try {
      const extra = ct.includes('json')
        ? Object.entries(JSON.parse(bodyText || '{}') as Record<string, unknown>).map(([k, v]) => [k, String(v)] as [string, string])
        : [...new URLSearchParams(bodyText)];
      for (const [k, v] of extra) if (!params.has(k)) params.set(k, v);
    } catch {
      /* cuerpo ilegible: se valida con lo que haya en la query */
    }
  }

  const clickId = pick(params, 'click_id', 'clickid', 'subid', 'sub_id', 'aff_sub', 'subid1');
  const event = EVENT_ALIASES[pick(params, 'event', 'type', 'goal').toLowerCase()] ?? '';
  const amount = pick(params, 'amount', 'deposit', 'value');
  const currency = pick(params, 'currency', 'cur').toUpperCase();
  const txnId = pick(params, 'txn_id', 'transaction_id', 'txn');
  const ts = pick(params, 'ts', 'timestamp');
  const token = pick(params, 'token') || req.headers.get('x-postback-token') || '';
  const sig = pick(params, 'sig', 'signature').toLowerCase();

  const redacted = Object.fromEntries([...params].map(([k, v]) => [k, ['token', 'sig', 'signature'].includes(k) ? '***' : v.slice(0, 200)]));
  const db = serviceClient();
  const reply = async (status: number, valid: boolean, reason: string, result = '') => {
    if (db) {
      const { error } = await db.rpc('landings_log_postback', {
        p: {
          operator_id: op, method: req.method, query: redacted,
          body: bodyText.replace(/(token|sig|signature)=[^&]*/gi, '$1=***').replace(/"(token|sig|signature)"\s*:\s*"[^"]*"/gi, '"$1":"***"'),
          source_ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
          valid, status, reason, click_id: clickId || null, result,
        },
      });
      if (error) console.error('[postback] log:', error.message);
    } else {
      console.warn(`[postback] ${op} ${status} ${reason} (sin service key: no se guarda en postback_log)`);
    }
    return Response.json({ ok: status < 300, reason, result: result || undefined }, { status, headers: { 'Cache-Control': 'no-store' } });
  };

  const { catalog } = await getCatalog();
  if (!catalog.operators.some((o) => o.id === op)) return reply(404, false, 'unknown_operator');

  const secret = secretFor(op);
  if (!secret) return reply(401, false, 'secret_not_configured');
  const authed =
    (token && safeEqual(token, secret)) ||
    (sig && safeEqual(sig, signPostback(secret, { click_id: clickId, event: pick(params, 'event', 'type', 'goal'), amount, currency, txn_id: txnId, ts })));
  if (!authed) return reply(401, false, token || sig ? 'bad_signature' : 'missing_signature');

  if (!UUID_RE.test(clickId)) return reply(400, true, 'bad_click_id');
  if (!ConversionTypeSchema.safeParse(event).success) return reply(400, true, 'bad_event');
  if (amount && !/^-?\d+(\.\d+)?$/.test(amount)) return reply(400, true, 'bad_amount');
  if (!db) return reply(503, true, 'storage_unavailable'); // el operador reintentará

  const tsDate = ts ? new Date(/^\d+$/.test(ts) ? Number(ts) * (ts.length <= 10 ? 1000 : 1) : ts) : null;
  const { data, error } = await db.rpc('landings_record_conversion', {
    p: {
      operator_id: op, click_id: clickId, type: event, amount: amount || null, currency: currency || null, txn_id: txnId || null,
      occurred_at: tsDate && !Number.isNaN(tsDate.getTime()) ? tsDate.toISOString() : null,
      raw: redacted,
    },
  });
  if (error) {
    console.error('[postback] record:', error.message);
    return reply(500, true, 'db_error');
  }
  const result = String(data);
  if (result === 'operator_mismatch') return reply(409, true, 'operator_mismatch', result);
  if (result === 'invalid') return reply(400, true, 'invalid', result);
  return reply(200, true, 'ok', result); // inserted | duplicate | unattributed
}

export async function GET(req: Request, ctx: { params: Promise<{ op: string }> }) {
  return handle(req, (await ctx.params).op);
}
export async function POST(req: Request, ctx: { params: Promise<{ op: string }> }) {
  return handle(req, (await ctx.params).op);
}
