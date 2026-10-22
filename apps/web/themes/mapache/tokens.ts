// [A2] Mapache · tokens. Paleta centralizada: cuando lleguen las capturas del canal, se cambia SOLO aquí.
// Concepto: noche y mirada afilada. Negro puro, blanco y el dorado del logo como único color de acción.
import type { CSSProperties } from 'react';
import type { ThemeTokens } from '@la/contracts';

export const palette = {
  // Ronda 2: sale del logo del canal (cabeza de mapache en línea dorada sobre negro puro).
  bg: '#000000', // negro puro, como el fondo del logo: la marca se funde con la página
  bgElevated: '#0A0A0A',
  ink2: '#141414',
  text: '#FFFFFF', // blanco del wordmark "MAPACHE"
  textMuted: '#A8A298',
  textDim: '#9C968C', // ≥ 4,5:1 también sobre el cristal más claro (#2a2a2a)
  gold: '#E6B862', // dorado del logo (medido sobre el PNG original)
  goldHi: '#F5D28E',
  goldLo: '#C4913C',
  ctaText: '#1A1207',
  cool: '#272A31', // contraluz frío muy sutil para dar profundidad al negro
  glass: 'rgba(20,20,20,.55)',
  glassLite: 'rgba(16,16,16,.96)', // Android gama baja / sin backdrop-filter
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
    accent: palette.gold,
    cta: palette.gold,
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
    '--m-gold': p.gold,
    '--m-gold-hi': p.goldHi,
    '--m-gold-lo': p.goldLo,
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
