import type { SiteConfig, SiteId } from '@la/contracts';

// Añadir un sitio = una entrada aquí + themes/<id>/ + content/<id>/ (ver docs/DEPLOY.md).
// TODO(sergi) P3: dominios reales de DonPool, Kronos y Mapache. P7: avatares. Redes: @ reales de cada miembro.
export const SITES: Record<SiteId, SiteConfig> = {
  diamond: {
    id: 'diamond',
    domains: ['diamondpix.com', 'www.diamondpix.com', 'diamond.local.test'],
    brandName: 'Diamond Picks',
    shortName: 'Diamond',
    memberName: 'Diamond',
    handle: '@TODO(sergi)',
    themeId: 'diamond',
    avatarUrl: '/diamond/logo.webp',
    socials: {},
  },
  donpool: {
    id: 'donpool',
    domains: ['donpool.local.test'],
    brandName: 'DonPool Picks',
    shortName: 'DonPool',
    memberName: 'Don Pool',
    handle: '@TODO(sergi)',
    themeId: 'donpool',
    avatarUrl: '/donpool/logo.webp',
    socials: {},
  },
  kronos: {
    id: 'kronos',
    // `cronos.local.test` por compatibilidad con el brief (P3); la marca es Kronos.
    domains: ['kronos.local.test', 'cronos.local.test'],
    brandName: 'Kronos',
    shortName: 'Kronos',
    memberName: 'Kronos',
    handle: '@TODO(sergi)',
    themeId: 'kronos',
    avatarUrl: '/kronos/logo.webp',
    socials: {},
  },
  mapache: {
    id: 'mapache',
    domains: ['mapache.local.test'],
    brandName: 'Mapache Picks',
    shortName: 'Mapache',
    memberName: 'Mapache',
    handle: '@TODO(sergi)',
    themeId: 'mapache',
    avatarUrl: '/mapache/logo.webp',
    socials: {},
  },
};

/** Sitio por defecto cuando el host no se reconoce (p. ej. localhost o *.vercel.app sin `?__site=`). */
export const DEFAULT_SITE: SiteId = 'diamond';

const isDevHost = (h: string) => h.endsWith('.local.test') || h.endsWith('.localhost') || h === 'localhost';

// Índice host → sitio, calculado una vez al cargar el módulo (el middleware lo consulta en cada request).
const HOST_INDEX = new Map<string, SiteId>(
  Object.values(SITES).flatMap((s) => s.domains.map((d) => [d.toLowerCase(), s.id] as const)),
);

/** Host (con o sin puerto, `www.` o punto final) → sitio. `null` si no es de ningún sitio. */
export function siteForHost(rawHost: string | null | undefined): SiteId | null {
  if (!rawHost) return null;
  const host = rawHost.split(',')[0]!.trim().toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
  return HOST_INDEX.get(host) ?? (host.startsWith('www.') ? HOST_INDEX.get(host.slice(4)) ?? null : null);
}

/** Origen canónico de producción (primer dominio que no es de desarrollo), para metadataBase / og:url. */
export function canonicalOrigin(site: SiteConfig): string | null {
  const d = site.domains.find((h) => !isDevHost(h.toLowerCase()));
  return d ? `https://${d}` : null;
}
