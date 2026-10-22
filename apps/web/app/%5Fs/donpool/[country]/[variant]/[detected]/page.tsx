// [A0] Landing de donpool: importa su tema de forma estática para que la página solo cargue su CSS/JS/fuente.
import theme from '@/themes/donpool';
import { makeLandingPage } from '@/lib/landing/landing-page';

const page = makeLandingPage('donpool', theme);

// Estático en el borde + revalidate de seguridad (= CATALOG_REVALIDATE_S). El admin invalida antes con revalidateTag.
export const revalidate = 60;
// Países fuera de la lista prerenderizada se generan al primer visitante y quedan cacheados.
export const dynamicParams = true;
// Blindaje: aunque un componente llame a cookies()/headers(), la página no se vuelve dinámica.
export const dynamic = 'force-static';

export const generateStaticParams = page.generateStaticParams;
export const generateMetadata = page.generateMetadata;
export const generateViewport = page.generateViewport;
export default page.Page;
