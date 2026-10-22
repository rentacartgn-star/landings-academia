// [A2] Inter variable autoalojada (subset latino, eje wght). Nada de Google Fonts en runtime.
import localFont from 'next/font/local';

export const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--dm-font',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  // Métrica de reserva ajustada para que el titular no salte al cargar la fuente.
  adjustFontFallback: 'Arial',
});
