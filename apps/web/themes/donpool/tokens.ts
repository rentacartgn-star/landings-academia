// [A2] DonPool · tokens. Toda la paleta vive aquí: cuando lleguen las capturas del canal se cambia solo este archivo.
import type { ThemeTokens } from '@la/contracts';

/** Paleta "mesa privada": tapete profundo, latón, crema y marfil de bola blanca (el único color de acción). */
export const palette = {
  // Tapete, de la sombra bajo la baranda a la luz de la lámpara
  felt0: '#030D09',
  felt1: '#05150F',
  felt2: '#0A2A1E',
  felt3: '#11402D',
  felt4: '#1D6244',
  // Latón
  brassHi: '#F1DCA6',
  brass: '#C9A465',
  brassLo: '#8E6B34',
  // Crema (texto) y marfil (CTA)
  cream: '#F4ECDC',
  creamMuted: 'rgba(244,236,220,.68)',
  creamFaint: 'rgba(244,236,220,.42)',
  ivory: '#FBF6EA',
  ivoryLo: '#E8DCC2',
  ctaText: '#062016',
  // Bolas (tonos de club, nada chillón)
  ballInk: '#1E3159',
  ballOxblood: '#6E2430',
  ballPlum: '#4A2A5E',
  ballEight: '#0E1110',
  // Cristal
  glass: 'rgba(10,36,26,.50)',
  glassSolid: 'rgba(9,32,23,.96)',
  hairline: 'rgba(244,236,220,.14)',
} as const;

export const tokens: ThemeTokens = {
  colors: {
    bg: palette.felt1,
    bgElevated: palette.felt2,
    surface: palette.glass,
    text: palette.cream,
    textMuted: palette.creamMuted,
    accent: palette.brass,
    cta: palette.ivory,
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
    `--felt0:${p.felt0}`, `--felt1:${p.felt1}`, `--felt2:${p.felt2}`, `--felt3:${p.felt3}`, `--felt4:${p.felt4}`,
    `--brass-hi:${p.brassHi}`, `--brass:${p.brass}`, `--brass-lo:${p.brassLo}`,
    `--cream:${p.cream}`, `--cream-muted:${p.creamMuted}`, `--cream-faint:${p.creamFaint}`,
    `--ivory:${p.ivory}`, `--ivory-lo:${p.ivoryLo}`, `--cta-text:${p.ctaText}`,
    `--ball-ink:${p.ballInk}`, `--ball-ox:${p.ballOxblood}`, `--ball-plum:${p.ballPlum}`, `--ball-eight:${p.ballEight}`,
    `--glass:${p.glass}`, `--glass-solid:${p.glassSolid}`, `--hairline:${p.hairline}`,
    `--r-card:${tokens.radius.card}`, `--r-pill:${tokens.radius.pill}`,
  ].join(';');
}
