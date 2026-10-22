// [A1] Root layout. `lang="es"` por defecto; la landing lo afina al locale (es-ES / es-419 / en-US) con un script inline
// para no leer headers() aquí, que volvería dinámicas todas las páginas y rompería la caché ISR por (sitio, país).
import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
