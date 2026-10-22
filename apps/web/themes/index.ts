// [A0] Registro de temas. Cada sitio tiene su carpeta themes/<siteId>/ con su index.tsx (ThemeModule por defecto).
// Import dinámico: cada página carga solo el JS, CSS y fuente de su tema, y un tema roto no tumba a los demás.
import type { ComponentType } from 'react';
import type { LandingProps, SiteId, ThemeModule } from '@la/contracts';

export type Theme = ThemeModule<ComponentType<LandingProps>>;

const LOADERS: Record<SiteId, () => Promise<{ default: Theme }>> = {
  diamond: () => import('./diamond'),
  donpool: () => import('./donpool'),
  kronos: () => import('./kronos'),
  mapache: () => import('./mapache'),
};

export async function getTheme(id: SiteId): Promise<Theme> {
  return (await LOADERS[id]()).default;
}
