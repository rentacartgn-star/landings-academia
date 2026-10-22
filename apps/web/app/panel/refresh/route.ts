// [A4] Renueva la sesión del panel con el refresh token y vuelve a la página (los RSC no pueden escribir cookies).
import { NextResponse, type NextRequest } from 'next/server';
import { anonClient } from '@/lib/data/supabase';
import { RT_COOKIE, clearSessionCookies, safeNext, writeSessionCookies } from '@/lib/data/panel-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const next = safeNext(req.nextUrl.searchParams.get('next'));
  const rt = req.cookies.get(RT_COOKIE)?.value;
  if (rt) {
    const { data, error } = await anonClient().auth.refreshSession({ refresh_token: rt });
    if (!error && data.session) {
      const res = NextResponse.redirect(new URL(next, req.url), 303);
      writeSessionCookies(res.cookies, data.session);
      return res;
    }
  }
  const res = NextResponse.redirect(new URL('/panel/login', req.url), 303);
  clearSessionCookies(res.cookies);
  return res;
}
