import 'server-only';
// [A4] Sesión del panel con Supabase Auth del mismo proyecto que el CRM (mismos usuarios y contraseñas).
// Sin @supabase/ssr ni middleware: access/refresh token en cookies httpOnly propias. Si el access token caduca,
// se redirige a /panel/refresh (route handler, que sí puede escribir cookies) y vuelve a la página.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { anonClient, hasAuthConfig, userClient } from './supabase';

export const AT_COOKIE = 'lp_panel_at';
export const RT_COOKIE = 'lp_panel_rt';

export interface PanelSite {
  id: string;
  brandName: string;
  shortName: string;
  members: string[];
}
export interface PanelContext {
  role: 'admin' | 'editor' | 'member' | null;
  isAdmin: boolean;
  sites: PanelSite[];
}
export interface PanelSession {
  userId: string;
  email: string;
  db: SupabaseClient;
  ctx: PanelContext;
}

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});

type CookieWriter = { set: (name: string, value: string, opts: ReturnType<typeof cookieOpts>) => unknown };

export function writeSessionCookies(jar: CookieWriter, s: { access_token: string; refresh_token: string; expires_in?: number }) {
  jar.set(AT_COOKIE, s.access_token, cookieOpts(s.expires_in ?? 3600));
  jar.set(RT_COOKIE, s.refresh_token, cookieOpts(60 * 60 * 24 * 30));
}

export function clearSessionCookies(jar: CookieWriter) {
  jar.set(AT_COOKIE, '', cookieOpts(0));
  jar.set(RT_COOKIE, '', cookieOpts(0));
}

type Lookup = { kind: 'none' } | { kind: 'expired' } | { kind: 'ok'; session: PanelSession };

/** Lee y valida la sesión (una llamada a Auth + el contexto vía RLS). No redirige. */
export async function lookupSession(): Promise<Lookup> {
  if (!hasAuthConfig()) return { kind: 'none' };
  const jar = await cookies();
  const at = jar.get(AT_COOKIE)?.value;
  const rt = jar.get(RT_COOKIE)?.value;
  if (!at) return rt ? { kind: 'expired' } : { kind: 'none' };
  const { data, error } = await anonClient().auth.getUser(at);
  if (error || !data.user) return rt ? { kind: 'expired' } : { kind: 'none' };
  const db = userClient(at);
  const { data: ctx, error: ctxErr } = await db.rpc('landings_panel_context');
  if (ctxErr) throw new Error(`landings_panel_context: ${ctxErr.message}`);
  return { kind: 'ok', session: { userId: data.user.id, email: data.user.email ?? '', db, ctx: ctx as PanelContext } };
}

/** Para páginas del panel: devuelve la sesión o redirige a login/refresh. */
export async function requirePanel(returnTo: string, opts: { admin?: boolean } = {}): Promise<PanelSession> {
  const r = await lookupSession();
  if (r.kind === 'none') redirect('/panel/login');
  if (r.kind === 'expired') redirect(`/panel/refresh?next=${encodeURIComponent(returnTo)}`);
  const s = r.session;
  if (!s.ctx.role) redirect('/panel/login?e=noprofile');
  if (opts.admin && !s.ctx.isAdmin) redirect('/panel');
  return s;
}

/** Solo rutas internas del panel como destino tras login/refresh (evita open redirect). */
export function safeNext(v: string | null | undefined): string {
  return v && /^\/panel(\/|\?|$)/.test(v) && !v.startsWith('//') ? v : '/panel';
}
