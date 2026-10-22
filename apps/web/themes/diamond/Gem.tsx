// [A2] La firma del tema: talla brillante en SVG estático (se pinta una vez) + capas compuestas en GPU
// que solo mueven transform/opacity: fuego espectral, barrido de luz y destellos. Sin JS.
import type { CSSProperties } from 'react';
import { FACETS, GLINTS, TABLE, fireMask, toneColor } from './gem';
import s from './diamond.module.css';

const FIRE_MASK = fireMask();
const GIRDLE_MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 200 200'><circle r='100' fill='white'/></svg>`,
)}")`;

type Props = { id: string; className?: string; glints?: boolean };

export function Gem({ id, className, glints = true }: Props) {
  const mask = { WebkitMaskImage: FIRE_MASK, maskImage: FIRE_MASK } as CSSProperties;
  const girdleMask = { WebkitMaskImage: GIRDLE_MASK, maskImage: GIRDLE_MASK } as CSSProperties;
  return (
    <div className={`${s.gem} ${className ?? ''}`} aria-hidden="true">
      <div className={s.gemHalo} />
      <svg className={s.gemSvg} viewBox="-100 -100 200 200" focusable="false">
        <defs>
          <radialGradient id={`${id}-depth`} cx="38%" cy="30%" r="80%">
            <stop offset="0" stopColor="#fff" stopOpacity=".16" />
            <stop offset=".55" stopColor="#86E6FF" stopOpacity="0" />
            <stop offset="1" stopColor="#050a18" stopOpacity=".55" />
          </radialGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".45" stopColor="#E4C07E" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity=".7" />
          </linearGradient>
          <clipPath id={`${id}-round`}>
            <circle r="100" />
          </clipPath>
          {FACETS.map((f, i) => (
            <linearGradient key={i} id={`${id}-f${i}`} gradientUnits="userSpaceOnUse" x1={f.g[0].toFixed(1)} y1={f.g[1].toFixed(1)} x2={f.g[2].toFixed(1)} y2={f.g[3].toFixed(1)}>
              <stop offset="0" stopColor={toneColor(f.tone + 0.22, i)} />
              <stop offset="1" stopColor={toneColor(f.tone - 0.2, i + 100)} />
            </linearGradient>
          ))}
        </defs>
        <g clipPath={`url(#${id}-round)`}>
          <g stroke="rgba(255,255,255,.3)" strokeWidth=".3" strokeLinejoin="round">
            {FACETS.map((f, i) => (
              <polygon key={i} points={f.d} fill={`url(#${id}-f${i})`} />
            ))}
          </g>
          <polygon points={TABLE} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth=".45" />
          <circle r="100" fill={`url(#${id}-depth)`} />
        </g>
        <circle r="99.6" fill="none" stroke={`url(#${id}-rim)`} strokeWidth=".9" />
      </svg>
      {/* Fuego: espectro que gira solo dentro de las facetas que dispersan la luz */}
      <div className={s.gemFire} style={mask}>
        <div className={s.gemFireSpin}>
          <div className={s.gemFireScroll} />
        </div>
      </div>
      {/* Refracción: banda de luz que cruza la piedra (en bucle y, si hay soporte, ligada al scroll) */}
      <div className={s.gemSheen} style={girdleMask}>
        <div className={s.gemSheenBand} />
      </div>
      {glints &&
        GLINTS.map((g, i) => (
          <span
            key={i}
            className={s.glint}
            style={{ left: g.left, top: g.top, '--s': g.s, '--d': `${g.delay}s` } as CSSProperties}
          />
        ))}
    </div>
  );
}

/** Talla en perfil, en línea fina: marca, viñetas y piedras de la "riviera" de pasos. */
export function GemGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 20" aria-hidden="true" focusable="false">
      <path
        d="M6.2 1h11.6L23 6.6 12 19 1 6.6 6.2 1Z M1 6.6h22 M6.2 1 9 6.6 12 19 15 6.6 17.8 1 M9 6.6 12 1l3 5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
