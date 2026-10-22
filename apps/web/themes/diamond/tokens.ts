// [A2] Diamond · tokens. ÚNICO sitio donde vive la paleta: cambiar aquí cambia todo el tema
// (el CSS solo lee variables --dm-*). Ronda 2: sale del logo del canal (azul marino pizarra,
// aro de bronce/oro, diamante holográfico rosa-cian-violeta, "DIAMOND" dorado y "PICKS" plateado).
import type { CSSProperties } from 'react';
import type { ThemeTokens } from '@la/contracts';

export const palette = {
  /** Azul marino profundo: el fondo del logo, un punto más oscuro para dar profundidad al vidrio. */
  navy: '#0A1020',
  navyUp: '#121B30',
  /** Blanco diamante y plata ("PICKS"). */
  diamond: '#F4F6FB',
  silver: '#A9B3C6',
  silverFaint: '#6F7B92',
  /** Metal del aro del logo: oro para acentos y cifras, bronce para sombras del metal. */
  gold: '#E4C07E',
  goldRgb: '228, 192, 126',
  bronze: '#A8784A',
  /** Holograma del diamante del logo: reflejos, destellos y "fuego". */
  holo: '#86E6FF',
  holoRgb: '134, 230, 255',
  fire: ['#FF8FD8', '#FFD48A', '#8CFFD9', '#86E6FF', '#A88BFF'] as const,
  /**
   * Único color de acción: esmeralda. Con marino + oro es el par clásico de joyería, no compite con el
   * oro de los acentos y con tinta oscura da ~11:1 de contraste. El rojo del subrayado del logo no se usa
   * (§8.1: nada de rojo chillón).
   */
  emerald: '#1EDC93',
  emeraldDeep: '#0DAA6B',
  emeraldInk: '#03150D',
  /** Vidrio teñido de marino. */
  glass: 'rgba(20,30,54,.58)',
  glassStrong: 'rgba(14,22,40,.88)',
  hairline: 'rgba(255,255,255,.12)',
  hairlineStrong: 'rgba(255,255,255,.22)',
} as const;

export const tokens: ThemeTokens = {
  colors: {
    bg: palette.navy,
    bgElevated: palette.navyUp,
    surface: palette.glass,
    text: palette.diamond,
    textMuted: palette.silver,
    accent: palette.gold,
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
    '--dm-bg': palette.navy,
    '--dm-bg-up': palette.navyUp,
    '--dm-text': palette.diamond,
    '--dm-muted': palette.silver,
    '--dm-faint': palette.silverFaint,
    '--dm-accent': palette.gold,
    '--dm-accent-rgb': palette.goldRgb,
    '--dm-bronze': palette.bronze,
    '--dm-holo': palette.holo,
    '--dm-holo-rgb': palette.holoRgb,
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
