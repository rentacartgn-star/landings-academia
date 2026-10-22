// [A2] Kronos · paleta centralizada, sacada del escudo del canal (ronda 2): negro carbón, oro, blanco y verde de fondo.
// Todo el tema lee estas variables: cambiar aquí basta para retocar la paleta.
import type { CSSProperties } from 'react';
import type { ThemeTokens } from '@la/contracts';

export const tokens: ThemeTokens = {
  colors: {
    bg: '#08080A', // negro carbón del escudo
    bgElevated: '#141416',
    surface: 'rgba(24,22,18,.56)', // cristal ahumado
    text: '#F6F3EC', // blanco de la banda "KRONOS"
    textMuted: '#A49D8F',
    accent: '#CFAE62', // oro satinado del borde del escudo
    cta: '#EBC660', // oro brillante: único color de acción
    ctaText: '#0B0905',
    border: 'rgba(240,222,176,.14)',
  },
  radius: { card: '30px', pill: '999px' },
  fonts: { display: 'Inter', body: 'Inter' },
};

/** Tokens extra del tema (no entran en el contrato). */
export const extra = {
  bgDeep: '#040405',
  surfaceSolid: '#17150F', // sustituto opaco del cristal en gama baja
  silverHi: '#FFFFFF',
  silverLo: '#8E8676', // gris cálido para degradados de texto
  goldHi: '#FBEA9A', // brillo especular del oro (K del escudo)
  goldLo: '#B98434', // oro en sombra
  green: '#1B3A26', // verde del interior del escudo (acento sutil)
  line: '240 226 192', // trazos finos (marcas, bordes): rgb sin alfa
  lumeSoft: 'rgba(235,198,96,.18)',
  reflex: 'rgba(235,198,96,.24)', // reflejo dorado del borde del cristal
  grid: 'rgba(240,226,192,.04)',
  gridMajor: 'rgba(240,226,192,.075)',
  glowA: 'rgba(200,150,64,.22)', // la luz dorada que cruza el fondo del logo
  glowB: 'rgba(27,74,46,.42)', // verde campo
  glowC: 'rgba(246,240,226,.06)',
};

/** Variables CSS que consume kronos.module.css. */
export function cssVars(): CSSProperties {
  const c = tokens.colors;
  return {
    '--kr-bg': c.bg,
    '--kr-bg-2': c.bgElevated,
    '--kr-surface': c.surface,
    '--kr-text': c.text,
    '--kr-muted': c.textMuted,
    '--kr-accent': c.accent,
    '--kr-cta': c.cta,
    '--kr-cta-text': c.ctaText,
    '--kr-border': c.border,
    '--kr-r-card': tokens.radius.card,
    '--kr-r-pill': tokens.radius.pill,
    '--kr-bg-deep': extra.bgDeep,
    '--kr-surface-solid': extra.surfaceSolid,
    '--kr-silver-hi': extra.silverHi,
    '--kr-silver-lo': extra.silverLo,
    '--kr-gold-hi': extra.goldHi,
    '--kr-gold-lo': extra.goldLo,
    '--kr-green': extra.green,
    '--kr-line': extra.line,
    '--kr-lume-soft': extra.lumeSoft,
    '--kr-reflex': extra.reflex,
    '--kr-grid': extra.grid,
    '--kr-grid-major': extra.gridMajor,
    '--kr-glow-a': extra.glowA,
    '--kr-glow-b': extra.glowB,
    '--kr-glow-c': extra.glowC,
  } as CSSProperties;
}
