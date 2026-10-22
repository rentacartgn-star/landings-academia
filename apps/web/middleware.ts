// [A1] Edge: host → sitio, país (cookie > override > IP > XX), variante A/B y rewrite a /_s/<site>/<country>/<v>/<detected>.
// Solo corre en `/` y en `/_s/**`: /go, /api, /legal, /panel y estáticos no pasan por aquí (cero latencia extra).
import { NextResponse, type NextRequest } from 'next/server';
import { resolveLanding } from './lib/landing/resolve';
import { landingPath, VARIANT_COOKIE, VARIANT_COOKIE_MAX_AGE } from './lib/landing/routing';

export const config = {
  // `%5Fs` cubre el acceso a la carpeta por su nombre codificado.
  matcher: ['/', '/_s', '/_s/:path*', '/%5Fs', '/%5Fs/:path*', '/%5fs', '/%5fs/:path*'],
};

const isDev = process.env.NODE_ENV !== 'production';
const isProdDeploy = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : !isDev;

export function middleware(req: NextRequest) {
  // El middleware no se vuelve a ejecutar sobre su propio rewrite: todo `/_s` que llega aquí viene de fuera → 404.
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.rewrite(new URL('/__lp-not-found', req.url), { status: 404 });
  }

  const r = resolveLanding(req);
  const url = req.nextUrl.clone();
  url.pathname = landingPath(r);
  url.search = ''; // la query (utm, src) la lee el cliente; no entra en la clave de caché
  const res = NextResponse.rewrite(url);

  if (r.assignVariant) {
    res.cookies.set(VARIANT_COOKIE, String(r.variant), {
      path: '/',
      maxAge: VARIANT_COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: !isDev,
      httpOnly: true, // el cliente recibe la variante por LandingProps; no necesita leer la cookie
    });
  }
  res.headers.set('x-content-type-options', 'nosniff');
  res.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  // Deploys de preview (*.vercel.app): fuera de buscadores; los previews de OG siguen funcionando.
  if (!isProdDeploy) res.headers.set('x-robots-tag', 'noindex');
  // Diagnóstico para QA (solo dev o con token de preview): qué entrada de caché se ha servido.
  if (r.overrides) res.headers.set('x-lp-route', url.pathname);
  return res;
}
