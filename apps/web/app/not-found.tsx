// [A1] 404 global. Estático y neutro a propósito: no lee headers() (lo renderizan también las páginas ISR).
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Página no encontrada', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeContent: 'center', gap: 16, padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Página no encontrada</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>El enlace no existe o ha caducado.</p>
      <a href="/" style={{ fontWeight: 600 }}>
        Ir al inicio
      </a>
    </main>
  );
}
