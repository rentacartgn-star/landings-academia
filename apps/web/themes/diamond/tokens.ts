// [A2] Diamond · tokens. ÚNICO sitio donde vive la paleta: cambiar aquí cambia todo el tema
// (el CSS solo lee variables --dm-*). Cuando lleguen las capturas del canal, se ajusta este archivo.
import type { CSSProperties } from 'react';
import type { ThemeTokens } from '@la/contracts';

/** Paleta extendida "joyería nocturna". */
export const palette = {
  /** Negro obsidiana: neutro con un punto frío, nunca azul (eso es de Kronos). */
  obsidian: '#050507',
  obsidianUp: '#0B0C10',
  /** Blanco diamante. */
  diamond: '#F6F9FC',
  diamondMuted: '#A3ACB7',
  diamondFaint: '#6B737D',
  /** Acento hielo: hairlines, cifras, destellos. */
  ice: '#9FE8FF',
  /** Único color de acción: esmeralda luminosa. */
  emerald: '#19D98E',
  emeraldDeep: '#0EA968',
  emeraldInk: '#03150D',
  /** "Fuego" del diamante: dispersión espectral, solo en bordes finos y a baja opacidad. */
  fire: ['#FF7EB6', '#FFCF70', '#7DFFC0', '#7FE3FF', '#A98BFF'] as const,
  /** Vidrio. */
  glass: 'rgba(17,19,25,.62)',
  glassStrong: 'rgba(14,16,21,.84)',
  hairline: 'rgba(255,255,255,.12)',
  hairlineStrong: 'rgba(255,255,255,.22)',
} as const;

export const tokens: ThemeTokens = {
  colors: {
    bg: palette.obsidian,
    bgElevated: palette.obsidianUp,
    surface: palette.glass,
    text: palette.diamond,
    textMuted: palette.diamondMuted,
    accent: palette.ice,
    cta: palette.emerald,
    ctaText: palette.emeraldInk,
    border: palette.hairline,
  },
  radius: { card: '30px', pill: '999px' },
  fonts: { display: 'Inter', body: 'Inter' },
};

/** Variables CSS que consume diamond.module.css (se inyectan en la raíz del tema). */
export function cssVars(): CSSProperties {
  const [f1, f2, f3, f4, f5] = palette.fire;
  return {
    '--dm-bg': palette.obsidian,
    '--dm-bg-up': palette.obsidianUp,
    '--dm-text': palette.diamond,
    '--dm-muted': palette.diamondMuted,
    '--dm-faint': palette.diamondFaint,
    '--dm-ice': palette.ice,
    '--dm-cta': palette.emerald,
    '--dm-cta-deep': palette.emeraldDeep,
    '--dm-cta-ink': palette.emeraldInk,
    '--dm-glass': palette.glass,
    '--dm-glass-strong': palette.glassStrong,
    '--dm-line': palette.hairline,
    '--dm-line-strong': palette.hairlineStrong,
    '--dm-fire': `${f1}, ${f2}, ${f3}, ${f4}, ${f5}, ${f1}`,
    '--dm-radius': tokens.radius.card,
  } as CSSProperties;
}
