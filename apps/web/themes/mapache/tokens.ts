// [A2] Mapache · tokens. Paleta centralizada: cuando lleguen las capturas del canal, se cambia SOLO aquí.
// Concepto: golpe nocturno elegante. Grafito casi negro, luz de linterna cálida y un único color de acción (ámbar).
import type { CSSProperties } from 'react';
import type { ThemeTokens } from '@la/contracts';

export const palette = {
  bg: '#0A0A0C', // grafito noche
  bgElevated: '#131316',
  ink2: '#1B1B20', // grafito claro (bordes de plano, sombras)
  text: '#F5F1E8', // blanco cálido (papel bajo la linterna)
  textMuted: '#A29D93',
  textDim: '#6E6A63',
  amber: '#FFB020', // acción + linterna
  amberHi: '#FFC95C',
  amberLo: '#F09A00',
  ctaText: '#1A1104',
  cool: '#3A4458', // contraluz frío (farola) para dar profundidad al grafito
  glass: 'rgba(22,22,26,.58)',
  glassLite: 'rgba(22,22,26,.95)', // Android gama baja / sin backdrop-filter
  border: 'rgba(255,255,255,.10)',
  borderHi: 'rgba(255,255,255,.18)',
} as const;

export const tokens: ThemeTokens = {
  colors: {
    bg: palette.bg,
    bgElevated: palette.bgElevated,
    surface: palette.glass,
    text: palette.text,
    textMuted: palette.textMuted,
    accent: palette.amber,
    cta: palette.amber,
    ctaText: palette.ctaText,
    border: palette.border,
  },
  radius: { card: '30px', pill: '999px' },
  fonts: { display: 'Inter', body: 'Inter' },
};

/** Variables CSS que consume mapache.module.css. */
export function cssVars(): CSSProperties {
  const p = palette;
  return {
    '--m-bg': p.bg,
    '--m-bg2': p.bgElevated,
    '--m-ink2': p.ink2,
    '--m-text': p.text,
    '--m-muted': p.textMuted,
    '--m-dim': p.textDim,
    '--m-amber': p.amber,
    '--m-amber-hi': p.amberHi,
    '--m-amber-lo': p.amberLo,
    '--m-cta-text': p.ctaText,
    '--m-cool': p.cool,
    '--m-glass': p.glass,
    '--m-glass-lite': p.glassLite,
    '--m-border': p.border,
    '--m-border-hi': p.borderHi,
    '--m-r-card': tokens.radius.card,
    '--m-r-pill': tokens.radius.pill,
  } as CSSProperties;
}
