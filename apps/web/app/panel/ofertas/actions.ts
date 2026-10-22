'use server';
// [A4] Guardar una oferta (solo admin: lo impone la RLS) y revalidar la caché del catálogo de las landings.
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { OFFERS_CACHE_TAG } from '@la/config';
import { lookupSession } from '@/lib/data/panel-auth';

const PatchSchema = z.object({
  affiliateUrlTemplate: z.string().trim().url().startsWith('https://').includes('{click_id}').max(2000),
  bonusHeadline: z.string().trim().max(160),
  bonusTermsShort: z.string().trim().max(400),
  rank: z.coerce.number().int().min(1).max(4),
  active: z.boolean(),
});

export async function updateOffer(form: FormData): Promise<void> {
  const id = String(form.get('id') ?? '');
  const back = (q: string) => redirect(`/panel/ofertas?${q}#o-${encodeURIComponent(id)}`);
  const r = await lookupSession();
  if (r.kind !== 'ok' || !r.session.ctx.isAdmin) redirect('/panel/login');
  const parsed = PatchSchema.safeParse({
    affiliateUrlTemplate: form.get('affiliateUrlTemplate'),
    bonusHeadline: form.get('bonusHeadline'),
    bonusTermsShort: form.get('bonusTermsShort'),
    rank: form.get('rank'),
    active: form.get('active') === 'on',
  });
  if (!parsed.success) back(`err=${encodeURIComponent(id)}&why=${encodeURIComponent(parsed.error.issues[0]?.path.join('.') ?? 'datos')}`);
  const { error } = await r.session.db.rpc('landings_admin_update_offer', { p_id: id, p_patch: parsed.data });
  if (error) back(`err=${encodeURIComponent(id)}&why=${encodeURIComponent(error.message)}`);
  // La landing lee el catálogo con unstable_cache + tag: con esto el cambio se ve en la siguiente visita.
  revalidateTag(OFFERS_CACHE_TAG);
  back(`ok=${encodeURIComponent(id)}`);
}
