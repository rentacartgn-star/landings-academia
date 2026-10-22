// [A0] Tipo común de tema. Cada sitio tiene su carpeta themes/<siteId>/ (ThemeModule por defecto) y su propia ruta
// en app/%5Fs/<siteId>/ que lo importa de forma estática: cada página solo carga el CSS/JS/fuente de su tema.
import type { ComponentType } from 'react';
import type { LandingProps, ThemeModule } from '@la/contracts';

export type Theme = ThemeModule<ComponentType<LandingProps>>;
