// [A5] Layout sobrio de las páginas legales: fondo oscuro, Inter y tarjeta glass discreta. Sin lógica de tema.
import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import './legal.css';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div className="lg-root">{children}</div>;
}
