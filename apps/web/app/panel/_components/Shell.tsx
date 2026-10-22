// [A4] Cabecera y navegación del panel.
import type { ReactNode } from 'react';
import type { PanelSession } from '@/lib/data/panel-auth';

const ROLE: Record<string, string> = { admin: 'Admin', editor: 'Editor', member: 'Miembro' };

export function Shell({ s, current, children }: { s: PanelSession; current: 'stats' | 'offers' | 'import'; children: ReactNode }) {
  const nav: { id: typeof current; href: string; label: string; admin?: boolean }[] = [
    { id: 'stats', href: '/panel', label: 'Estadísticas' },
    { id: 'offers', href: '/panel/ofertas', label: 'Ofertas' },
    { id: 'import', href: '/panel/importar', label: 'Importar CSV', admin: true },
  ];
  return (
    <div className="pn-wrap">
      <header className="pn-top pn-glass">
        <div className="pn-brand">
          <span className="pn-dot" aria-hidden />
          Landings · Academia
        </div>
        <nav className="pn-nav" aria-label="Panel">
          {nav
            .filter((n) => !n.admin || s.ctx.isAdmin)
            .map((n) => (
              <a key={n.id} href={n.href} aria-current={n.id === current ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
        </nav>
        <div className="pn-user">
          <span>
            {s.email} · {ROLE[s.ctx.role ?? ''] ?? '—'}
          </span>
          <a href="/panel/logout" className="pn-btn ghost small">
            Salir
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
