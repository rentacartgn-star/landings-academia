// [A2] Kronos · paleta centralizada. Cambiar aquí cuando lleguen las capturas del canal: todo el tema lee estas variables.
import type { CSSProperties } from 'react';
import type { ThemeTokens } from '@la/contracts';

export const tokens: ThemeTokens = {
  colors: {
    bg: '#030817', // azul medianoche (esfera del reloj)
    bgElevated: '#0A1330',
    surface: 'rgba(14,22,48,.58)', // cristal de zafiro tintado
    text: '#EEF2F8', // plata clara
    textMuted: '#8F9CB8',
    accent: '#C7D1E3', // plata satinada
    cta: '#2BE4FF', // cian lume: único color de acción
    ctaText: '#021019',
    border: 'rgba(205,218,245,.14)',
  },
  radius: { card: '30px', pill: '999px' },
  fonts: { display: 'Inter', body: 'Inter' },
};

/** Tokens extra del tema (no entran en el contrato). */
export const extra = {
  bgDeep: '#01040D',
  surfaceSolid: '#0B1431', // sustituto opaco del cristal en gama baja
  silverHi: '#FFFFFF',
  silverLo: '#7E8AA6',
  lumeSoft: 'rgba(43,228,255,.16)',
  sapphire: 'rgba(132,120,255,.22)', // reflejo violeta del antirreflejo del zafiro
  grid: 'rgba(150,178,232,.055)',
  gridMajor: 'rgba(150,178,232,.10)',
  glowA: 'rgba(36,92,255,.42)',
  glowB: 'rgba(43,228,255,.16)',
  glowC: 'rgba(200,212,236,.10)',
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
    '--kr-lume-soft': extra.lumeSoft,
    '--kr-sapphire': extra.sapphire,
    '--kr-grid': extra.grid,
    '--kr-grid-major': extra.gridMajor,
    '--kr-glow-a': extra.glowA,
    '--kr-glow-b': extra.glowB,
    '--kr-glow-c': extra.glowC,
  } as CSSProperties;
}
