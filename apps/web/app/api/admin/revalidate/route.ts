// [A4] Revalida la caché del catálogo de ofertas de las landings (petición de A1).
// Auth: `Authorization: Bearer <REVALIDATE_SECRET>` (o cabecera x-revalidate-secret), o sesión de admin del panel.
// Uso: curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" https://<dominio>/api/admin/revalidate
import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { OFFERS_CACHE_TAG } from '@la/config';
import { lookupSession } from '@/lib/data/panel-auth';

export const dynamic = 'force-dynamic';

function secretOk(req: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  const got = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '') || req.headers.get('x-revalidate-secret') || '';
  if (!secret || !got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  let ok = secretOk(req);
  if (!ok) {
    const r = await lookupSession().catch(() => null);
    ok = r?.kind === 'ok' && r.session.ctx.isAdmin;
  }
  if (!ok) return Response.json({ ok: false }, { status: 401 });
  revalidateTag(OFFERS_CACHE_TAG);
  return Response.json({ ok: true, tag: OFFERS_CACHE_TAG, at: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
