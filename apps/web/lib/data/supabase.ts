import 'server-only';
// [A4] Clientes de Supabase del servidor. Nunca se importan en cliente.
//  · serviceClient(): service role, para la app de landings (RPC public.landings_* SECURITY DEFINER). null si falta la key.
//  · userClient(token): anon key + JWT del usuario del panel → las RPC INVOKER corren con su rol y manda la RLS.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = () => process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = () => process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const noSession = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } } as const;

let svc: SupabaseClient | null | undefined;
let warned = false;

export function serviceClient(): SupabaseClient | null {
  if (svc !== undefined) return svc;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url() || !key) {
    if (!warned) {
      warned = true;
      console.warn('[tracking] SUPABASE_SERVICE_ROLE_KEY no configurada: catálogo → fallback y eventos descartados.');
    }
    svc = null;
    return svc;
  }
  svc = createClient(url(), key, noSession);
  return svc;
}

export function hasAuthConfig(): boolean {
  return Boolean(url() && anonKey());
}

/** Cliente anónimo (login / refresh del panel). */
export function anonClient(): SupabaseClient {
  return createClient(url(), anonKey(), noSession);
}

/** Cliente con el JWT del usuario: todo lo que haga pasa por la RLS de `landings`. */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(url(), anonKey(), {
    ...noSession,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
