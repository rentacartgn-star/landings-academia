// [A2] DonPool · tokens (ronda 2: paleta sacada del logo del canal). Toda la paleta vive aquí.
import type { ThemeTokens } from '@la/contracts';

/** Negro profundo + rojo del logo (único color de acción) + blanco. */
export const palette = {
  // Negros
  ink0: '#030304',
  ink1: '#070708',
  ink2: '#0E0E10',
  ink3: '#17171A',
  // Rojo del logo (muestra media del aro ≈ #DE030A; afinado a #E3121B)
  redHi: '#FF3A3F',
  red: '#E3121B',
  redLo: '#9E0A10',
  redDeep: '#3A0306',
  // Blancos
  white: '#FFFFFF',
  text: '#F5F4F2',
  textMuted: 'rgba(245,244,242,.66)',
  textFaint: 'rgba(245,244,242,.62)', // ≥ 4,5:1 sobre el negro (F8)
  steel: '#8C8C94',
  ctaText: '#FFFFFF',
  // Cristal
  glass: 'rgba(18,18,21,.52)',
  glassRed: 'rgba(227,18,27,.10)',
  glassSolid: 'rgba(14,14,16,.96)',
  hairline: 'rgba(245,244,242,.12)',
} as const;

export const tokens: ThemeTokens = {
  colors: {
    bg: palette.ink1,
    bgElevated: palette.ink2,
    surface: palette.glass,
    text: palette.text,
    textMuted: palette.textMuted,
    accent: palette.red,
    cta: palette.red,
    ctaText: palette.ctaText,
    border: palette.hairline,
  },
  radius: { card: '30px', pill: '999px' },
  fonts: { display: 'Inter', body: 'Inter' },
};

/** Variables CSS que consume styles.ts (se inyectan en el contenedor `.dp`). */
export function cssVars(): string {
  const p = palette;
  return [
    `--ink0:${p.ink0}`, `--ink1:${p.ink1}`, `--ink2:${p.ink2}`, `--ink3:${p.ink3}`,
    `--red-hi:${p.redHi}`, `--red:${p.red}`, `--red-lo:${p.redLo}`, `--red-deep:${p.redDeep}`,
    `--white:${p.white}`, `--text:${p.text}`, `--text-muted:${p.textMuted}`, `--text-faint:${p.textFaint}`, `--steel:${p.steel}`,
    `--cta-text:${p.ctaText}`, `--glass:${p.glass}`, `--glass-red:${p.glassRed}`, `--glass-solid:${p.glassSolid}`, `--hairline:${p.hairline}`,
    `--r-card:${tokens.radius.card}`, `--r-pill:${tokens.radius.pill}`,
  ].join(';');
}
