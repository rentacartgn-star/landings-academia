// [A2] Inter variable autoalojada (subset latino, cubre á é í ó ú ñ ¿ ¡). Sin Google Fonts en runtime.
import localFont from 'next/font/local';

export const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--dp-font',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
