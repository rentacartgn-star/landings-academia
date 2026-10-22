// [A4] Cierra la sesión del panel (revoca el refresh token en Supabase y borra las cookies).
import { NextResponse, type NextRequest } from 'next/server';
import { AT_COOKIE, clearSessionCookies } from '@/lib/data/panel-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const at = req.cookies.get(AT_COOKIE)?.value;
  if (at) {
    try {
      await fetch(`${process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${at}`, apikey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
      });
    } catch {
      /* da igual: se borran las cookies */
    }
  }
  const res = NextResponse.redirect(new URL('/panel/login', req.url), 303);
  clearSessionCookies(res.cookies);
  return res;
}
