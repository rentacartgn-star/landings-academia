// [A2] Geometría de una talla brillante vista desde arriba (mesa, estrellas, bezels, medias de cinturón
// y el patrón de "flechas" del pabellón reflejado en la mesa). Se calcula una vez en el servidor.

export type Facet = { d: string; tone: number; fire: number; kind: 'table' | 'star' | 'kite' | 'girdle'; g: [number, number, number, number] };

const R = 100; // cinturón
const RG = R / Math.cos((11.25 * Math.PI) / 180); // vértices del cinturón por fuera: el círculo recorta las cuerdas
const T = 54; // radio de la mesa (≈ 57 % del diámetro, como una talla real)
const S = 76; // puntas de las estrellas
const LIGHT = (-128 * Math.PI) / 180; // luz desde arriba a la izquierda

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => [r * Math.cos(rad(deg - 90)), r * Math.sin(rad(deg - 90))] as const;
const fmt = (p: readonly [number, number]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
const poly = (...ps: (readonly [number, number])[]) => ps.map(fmt).join(' ');
/** Cuánto mira una faceta hacia la luz (0–1). */
const lit = (deg: number) => (Math.cos(rad(deg - 90) - LIGHT) + 1) / 2;
// Pseudoaleatorio determinista (mismo SSR siempre): da el "centelleo" irregular de una piedra real.
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

function build(): Facet[] {
  const out: Facet[] = [];
  let n = 0;
  // Flechas del pabellón dentro de la mesa: 16 triángulos desde el centro, claros/oscuros alternos.
  for (let k = 0; k < 16; k++) {
    const a0 = k * 22.5;
    const a1 = a0 + 22.5;
    // Perímetro de la mesa cada 22,5°: los pares caen en el centro de una arista, los impares en un vértice.
    const edge = T * Math.cos(rad(22.5));
    const r0 = k % 2 === 0 ? edge : T;
    const r1 = k % 2 === 0 ? T : edge;
    const dark = k % 2 === 0;
    const tone = dark ? 0.05 + lit(a0 + 11) * 0.16 : 0.4 + lit(a0 + 11) * 0.55;
    out.push({ d: poly([0, 0], pt(r0, a0), pt(r1, a1)), tone, fire: jitter(n++) > 0.72 ? 0.9 : 0, kind: 'table', g: [0, 0, 0, 0] });
  }
  for (let k = 0; k < 8; k++) {
    const tv = k * 45 + 22.5; // vértice de la mesa
    const sa = k * 45; // punta de estrella
    // Estrella: arista de la mesa + punta.
    out.push({
      d: poly(pt(T, tv - 45), pt(T, tv), pt(S, sa)),
      tone: 0.18 + lit(sa) * 0.62 + jitter(n) * 0.12,
      fire: jitter(n++) > 0.7 ? 0.7 : 0,
      kind: 'star',
      g: [0, 0, 0, 0],
    });
    // Bezel (cometa): vértice de mesa, dos estrellas y el cinturón.
    out.push({
      d: poly(pt(T, tv), pt(S, tv - 22.5), pt(RG, tv), pt(S, tv + 22.5)),
      tone: 0.1 + lit(tv) * 0.7 + (k % 2 ? 0.08 : 0),
      fire: jitter(n++) > 0.6 ? 0.8 : 0,
      kind: 'kite',
      g: [0, 0, 0, 0],
    });
    // Medias de cinturón: dos triángulos por estrella.
    out.push({
      d: poly(pt(S, sa), pt(RG, sa - 22.5), pt(RG, sa)),
      tone: 0.08 + lit(sa - 11) * 0.5 + jitter(n) * 0.2,
      fire: jitter(n++) > 0.68 ? 1 : 0,
      kind: 'girdle',
      g: [0, 0, 0, 0],
    });
    out.push({
      d: poly(pt(S, sa), pt(RG, sa), pt(RG, sa + 22.5)),
      tone: 0.14 + lit(sa + 11) * 0.46 + jitter(n) * 0.2,
      fire: jitter(n++) > 0.68 ? 1 : 0,
      kind: 'girdle',
      g: [0, 0, 0, 0],
    });
  }
  // Contraste de piedra real: casi todo acero oscuro y pocos destellos blancos. Degradado por faceta.
  return out.map((f, i) => {
    const t = f.tone;
    const tone = t < 0.5 ? 1.7 * t * t : 1 - 2 * (1 - t) * (1 - t);
    const pts = f.d.split(' ').map((q) => q.split(',').map(Number) as [number, number]);
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
    const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
    const ang = Math.atan2(cy, cx) + (jitter(i + 99) - 0.5) * 2.2;
    const L = 14;
    const g: Facet['g'] = [cx - Math.cos(ang) * L, cy - Math.sin(ang) * L, cx + Math.cos(ang) * L, cy + Math.sin(ang) * L];
    return { ...f, tone, g };
  });
}

export const FACETS = build();
/** Contorno del cinturón (16 lados, como lo dibujan las medias de cinturón). */
export const TABLE = Array.from({ length: 8 }, (_, k) => fmt(pt(T, k * 45 + 22.5))).join(' ');

// Holograma del logo: rosa, cian y violeta dominan; menta y champán solo de vez en cuando.
const HOLO: [number, number, number][] = [
  [255, 143, 216],
  [134, 230, 255],
  [168, 139, 255],
  [134, 230, 255],
  [255, 143, 216],
  [168, 139, 255],
  [140, 255, 217],
  [255, 212, 138],
];

/** Marino profundo → blanco diamante, con un velo holográfico en los medios tonos (`h` = faceta). */
export function toneColor(t: number, h = -1): string {
  const c = Math.max(0, Math.min(1, t));
  let r = 10 + (246 - 10) * c ** 1.25;
  let g = 16 + (248 - 16) * c ** 1.15;
  let b = 32 + (253 - 32) * c ** 1.05;
  if (h >= 0) {
    const [hr, hg, hb] = HOLO[Math.floor(jitter(h * 7 + 3) * HOLO.length)]!;
    // Más color en los medios tonos; los negros y los destellos blancos se quedan limpios.
    const w = 0.16 + 0.5 * Math.sin(Math.PI * c) * jitter(h + 51);
    r += (hr - r) * w;
    g += (hg - g) * w;
    b += (hb - b) * w;
  }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

/** Máscara SVG (data URI) con solo las facetas que "dan fuego", para la capa espectral. */
export function fireMask(): string {
  const shapes = FACETS.filter((f) => f.fire > 0)
    .map((f) => `<polygon points='${f.d}' fill='white' fill-opacity='${f.fire}'/>`)
    .join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 200 200'>${shapes}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

/** Puntos de destello (en % del lienzo) sobre vértices reales de la talla. */
export const GLINTS = [
  { x: pt(T, 337.5), s: 1, delay: 0 },
  { x: pt(S, 270), s: 0.7, delay: 1.6 },
  { x: pt(R, 45), s: 0.85, delay: 3.1 },
  { x: pt(T * 0.4, 200), s: 0.55, delay: 4.4 },
].map((g) => ({ left: `${((g.x[0] + 100) / 2).toFixed(2)}%`, top: `${((g.x[1] + 100) / 2).toFixed(2)}%`, s: g.s, delay: g.delay }));
