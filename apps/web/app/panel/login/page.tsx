// [A4] Login del panel con las credenciales del CRM (Supabase Auth del mismo proyecto).
import { redirect } from 'next/navigation';
import { hasAuthConfig } from '@/lib/data/supabase';
import { lookupSession } from '@/lib/data/panel-auth';
import { login } from './actions';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  cred: 'Email o contraseña incorrectos.',
  noprofile: 'Tu usuario no tiene perfil en el CRM. Pide acceso a un administrador.',
  config: 'Falta configurar Supabase (SUPABASE_URL y la anon key).',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const r = await lookupSession().catch(() => ({ kind: 'none' as const }));
  if (r.kind === 'ok' && r.session.ctx.role) redirect('/panel');
  const err = !hasAuthConfig() ? 'config' : sp.e;
  return (
    <div className="pn-wrap">
      <form action={login} className="pn-login pn-glass">
        <div className="pn-brand">
          <span className="pn-dot" aria-hidden />
          Landings · Academia
        </div>
        <p className="pn-sub" style={{ margin: 0 }}>Entra con tu usuario del CRM.</p>
        {err && ERRORS[err] && <div className="pn-banner err pn-glass">{ERRORS[err]}</div>}
        <input type="hidden" name="next" value={sp.next ?? '/panel'} />
        <label>
          Email
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="pn-btn" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}
