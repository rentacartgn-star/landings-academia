// [A4] Layout del panel de landings. Fuera del middleware de landings (que solo corre en / y /_s/**).
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import './panel.css';

export const metadata: Metadata = {
  title: 'Panel de landings',
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: ReactNode }) {
  return <div className="pn">{children}</div>;
}
