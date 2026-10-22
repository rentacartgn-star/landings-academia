// [A2] Inter variable autoalojada (subset latino, cubre 100–900). Sin Google Fonts en runtime.
import localFont from 'next/font/local';

export const inter = localFont({
  src: [{ path: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' }],
  variable: '--kr-font',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
