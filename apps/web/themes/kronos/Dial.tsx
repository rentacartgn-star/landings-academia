// [A2] Esfera de cronógrafo (Server Component, SVG puro). Las agujas marcan la hora real del visitante
// (desfase negativo en --kr-sec/--kr-min/--kr-hr que fija HEAD_SCRIPT) y el bisel se llena con el scroll (--p).
import type { CSSProperties, ReactNode } from 'react';
import s from './kronos.module.css';

/** El progreso vive en <html> (--kr-p-<id>, lo fija TAIL_SCRIPT) para no tocar atributos que hidrata React. */
export const ringVar = (id: string) => ({ '--p': `var(--kr-p-${id}, 0)` }) as CSSProperties;

const NUMERALS = Array.from({ length: 12 }, (_, i) => {
  const a = ((i + 1) * 30 * Math.PI) / 180;
  return { n: String((i + 1) * 5).padStart(2, '0'), x: 500 + 392 * Math.sin(a), y: 500 - 392 * Math.cos(a) };
});

/** Anillo de marcas hecho con dasharray: `count` marcas de `len` (fracción) centradas en las 12. */
function Ticks({ r, count, len, width, className }: { r: number; count: number; len: number; width: number; className?: string }) {
  return (
    <circle
      cx="500" cy="500" r={r} pathLength={count} fill="none" strokeWidth={width} className={className}
      strokeDasharray={`${len} ${1 - len}`} strokeDashoffset={len / 2} transform="rotate(-90 500 500)"
    />
  );
}

export function Dial() {
  return (
    <div className={s.dialWrap} data-ring="page" style={ringVar('page')} aria-hidden="true">
      <svg className={s.dial} viewBox="0 0 1000 1000" focusable="false">
        <defs>
          <linearGradient id="kr-silver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset=".45" stopColor="#8E9AB5" />
            <stop offset=".7" stopColor="#E6ECF6" />
            <stop offset="1" stopColor="#5D6886" />
          </linearGradient>
          <linearGradient id="kr-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C7D1E3" />
            <stop offset="1" stopColor="#2BE4FF" />
          </linearGradient>
          <radialGradient id="kr-face" cx=".5" cy=".42" r=".6">
            <stop offset="0" stopColor="#13204A" stopOpacity=".55" />
            <stop offset="1" stopColor="#030817" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="500" cy="500" r="496" fill="url(#kr-face)" />
        <circle cx="500" cy="500" r="496" fill="none" stroke="url(#kr-silver)" strokeWidth="1.5" opacity=".55" />
        {/* bisel: pista + progreso de lectura de la página */}
        <circle cx="500" cy="500" r="481" fill="none" className={s.dialTrack} strokeWidth="5" />
        <circle cx="500" cy="500" r="481" fill="none" stroke="url(#kr-arc)" strokeWidth="5" pathLength={100}
          strokeLinecap="round" className={s.dialArc} transform="rotate(-90 500 500)" />
        <circle cx="500" cy="500" r="468" fill="none" stroke="url(#kr-silver)" strokeWidth="1" opacity=".35" />
        {/* escala de quintos de segundo, minutos y horas */}
        <Ticks r={452} count={300} len={0.14} width={9} className={s.tickFine} />
        <Ticks r={448} count={60} len={0.1} width={18} className={s.tickMin} />
        <Ticks r={442} count={12} len={0.022} width={30} className={s.tickHour} />
        {NUMERALS.map((d) => (
          <text key={d.n} x={d.x} y={d.y} className={s.dialNum} textAnchor="middle" dominantBaseline="central">{d.n}</text>
        ))}
        <circle cx="500" cy="500" r="330" fill="none" stroke="url(#kr-silver)" strokeWidth="1" opacity=".22" />
        <Ticks r={322} count={120} len={0.08} width={6} className={s.tickFine} />
        {/* agujas */}
        <g className={`${s.hand} ${s.handHr}`}>
          <path d="M494 520 L496 300 Q500 286 504 300 L506 520 Z" fill="url(#kr-silver)" opacity=".7" />
        </g>
        <g className={`${s.hand} ${s.handMin}`}>
          <path d="M496 524 L498 150 Q500 140 502 150 L504 524 Z" fill="url(#kr-silver)" opacity=".75" />
        </g>
        <g className={`${s.hand} ${s.handSec}`}>
          <line x1="500" y1="590" x2="500" y2="64" className={s.secLine} />
          <circle cx="500" cy="64" r="16" className={s.lumeGlow} />
          <circle cx="500" cy="64" r="5.5" className={s.lume} />
          <circle cx="500" cy="572" r="9" fill="none" className={s.secLine} />
        </g>
        <circle cx="500" cy="500" r="10" fill="url(#kr-silver)" />
        <circle cx="500" cy="500" r="3.5" className={s.lume} />
      </svg>
    </div>
  );
}

/** Anillo pequeño que se llena con el scroll (stroke-dashoffset con --p). */
export function Ring({ id, label, total, big }: { id: string; label: ReactNode; total?: number; big?: boolean }) {
  return (
    <span className={big ? `${s.ring} ${s.ringBig}` : s.ring} data-ring={id} style={ringVar(id)} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false">
        <circle cx="32" cy="32" r="29" fill="none" className={s.ringTrack} strokeWidth="2" />
        {total ? (
          <circle cx="32" cy="32" r="24.5" fill="none" pathLength={total} className={s.ringTicks} strokeWidth="3"
            strokeDasharray={`0.04 0.96`} transform="rotate(-90 32 32)" />
        ) : null}
        <circle cx="32" cy="32" r="29" fill="none" pathLength={100} className={s.ringArc} strokeWidth="2.5"
          strokeLinecap="round" transform="rotate(-90 32 32)" />
      </svg>
      <b className={s.ringLabel}>{label}</b>
    </span>
  );
}
