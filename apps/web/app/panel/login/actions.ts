'use server';
// [A4] Server action de login: signInWithPassword en el servidor y tokens en cookies httpOnly. Cero JS de Supabase en cliente.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { anonClient, hasAuthConfig } from '@/lib/data/supabase';
import { safeNext, writeSessionCookies } from '@/lib/data/panel-auth';

export async function login(form: FormData): Promise<void> {
  if (!hasAuthConfig()) redirect('/panel/login?e=config');
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const { data, error } = await anonClient().auth.signInWithPassword({ email, password });
  if (error || !data.session) redirect('/panel/login?e=cred');
  writeSessionCookies(await cookies(), data.session);
  redirect(safeNext(String(form.get('next') ?? '')));
}
