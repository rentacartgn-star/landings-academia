// [A6] Lighthouse móvil (throttling simulado por defecto: "Slow 4G", CPU ×4) de cada sitio en ES y MX.
// Uso: QA_BASE_URL=http://localhost:3156 QA_TOKEN=... node lighthouse/run.mjs [runs=1] [site,site] [ES,MX]
// Requiere CHROME_PATH (por defecto, el Chromium de /opt/pw-browsers). Salida: lighthouse/out/*.json y summary.json.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
mkdirSync(OUT, { recursive: true });
const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3156';
const TOKEN = process.env.QA_TOKEN ?? 'qa-a6-token';
const RUNS = Number(process.argv[2] ?? 1);
const SITES = (process.argv[3] ?? 'diamond,donpool,kronos,mapache').split(',');
const COUNTRIES = (process.argv[4] ?? 'ES,MX').split(',');
const CHROME =
  process.env.CHROME_PATH ??
  join('/opt/pw-browsers', readdirSync('/opt/pw-browsers').find((d) => /^chromium-\d+$/.test(d)) ?? 'chromium', 'chrome-linux/chrome');

// Umbrales (BRIEF §1 y §13)
const T = { perf: 90, a11y: 95, bp: 95, lcpMs: 2000, jsCssKb: 180 };

function runOnce(site, country, i) {
  const url = `${BASE}/?__site=${site}&__country=${country}&__v=0&__token=${TOKEN}`;
  const file = join(OUT, `${site}-${country}-${i}.json`);
  execFileSync(
    'npx',
    [
      '-y', 'lighthouse', url,
      '--quiet', '--output=json', `--output-path=${file}`,
      '--only-categories=performance,accessibility,best-practices',
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    ],
    { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, CHROME_PATH: CHROME }, timeout: 180_000 },
  );
  return JSON.parse(readFileSync(file, 'utf8'));
}

function summarize(lhr) {
  const a = lhr.audits;
  const reqs = a['network-requests']?.details?.items ?? [];
  // JS + CSS transferidos (gz) en la carga. Next marca los polyfills con noModule: Chrome moderno no los descarga,
  // pero por si acaso se excluyen por nombre.
  const jsCss = reqs.filter((r) => ['Script', 'Stylesheet'].includes(r.resourceType) && !/polyfills/.test(r.url));
  const kb = (n) => Math.round((n / 1024) * 10) / 10;
  const failing = (cat) =>
    lhr.categories[cat].auditRefs
      .filter((r) => r.weight > 0 || cat !== 'performance')
      .map((r) => a[r.id])
      .filter((x) => x && x.score !== null && x.score < 0.9 && !['manual', 'notApplicable', 'informative'].includes(x.scoreDisplayMode))
      .map((x) => ({ id: x.id, score: x.score, value: x.displayValue ?? '' }));
  return {
    perf: Math.round(lhr.categories.performance.score * 100),
    a11y: Math.round(lhr.categories.accessibility.score * 100),
    bp: Math.round(lhr.categories['best-practices'].score * 100),
    lcpMs: Math.round(a['largest-contentful-paint'].numericValue),
    fcpMs: Math.round(a['first-contentful-paint'].numericValue),
    tbtMs: Math.round(a['total-blocking-time'].numericValue),
    cls: Math.round(a['cumulative-layout-shift'].numericValue * 1000) / 1000,
    siMs: Math.round(a['speed-index'].numericValue),
    lcpElement: (() => {
      const n = (a['lcp-breakdown-insight']?.details?.items ?? []).find((x) => x.type === 'node');
      return n ? `${n.selector} «${(n.nodeLabel ?? '').slice(0, 60)}»` : null;
    })(),
    lcpPhases: ((a['lcp-breakdown-insight']?.details?.items ?? []).find((x) => x.type === 'table')?.items ?? []).map((p) => `${p.subpart}: ${Math.round(p.duration)}ms`),
    renderBlocking: (a['render-blocking-insight']?.details?.items ?? []).map((x) => `${String(x.url).replace(/^https?:\/\/[^/]+/, '')} ${Math.round(x.wastedMs ?? 0)}ms`),
    contrast: (a['color-contrast']?.details?.items ?? []).map((i) => `${i.node.snippet.slice(0, 80)} — ${(i.node.explanation.match(/contrast of [\d.]+ \(foreground color: #\w+, background color: #\w+/) ?? [''])[0]}`),
    a11yNodes: Object.fromEntries(
      lhr.categories.accessibility.auditRefs
        .map((r) => a[r.id])
        .filter((x) => x && x.score === 0 && x.id !== 'color-contrast')
        .map((x) => [x.id, (x.details?.items ?? []).slice(0, 4).map((i) => i.node?.snippet?.slice(0, 100))]),
    ),
    bpDetail: Object.fromEntries(
      lhr.categories['best-practices'].auditRefs
        .map((r) => a[r.id])
        .filter((x) => x && x.score !== null && x.score < 1 && x.scoreDisplayMode !== 'informative')
        .map((x) => [x.id, (x.details?.items ?? []).slice(0, 4).map((i) => JSON.stringify(i).slice(0, 160))]),
    ),
    jsKb: kb(jsCss.filter((r) => r.resourceType === 'Script').reduce((s, r) => s + r.transferSize, 0)),
    cssKb: kb(jsCss.filter((r) => r.resourceType === 'Stylesheet').reduce((s, r) => s + r.transferSize, 0)),
    jsCssKb: kb(jsCss.reduce((s, r) => s + r.transferSize, 0)),
    biggest: jsCss.sort((x, y) => y.transferSize - x.transferSize).slice(0, 6).map((r) => `${r.url.replace(/^https?:\/\/[^/]+/, '')} ${kb(r.transferSize)}KB`),
    unusedJs: a['unused-javascript']?.details?.items?.slice(0, 4).map((x) => `${x.url.replace(/^https?:\/\/[^/]+/, '')} −${kb(x.wastedBytes)}KB`) ?? [],
    failing: { performance: failing('performance'), accessibility: failing('accessibility'), 'best-practices': failing('best-practices') },
  };
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const summary = {};
for (const site of SITES) {
  for (const country of COUNTRIES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(summarize(runOnce(site, country, i)));
    // Mediana por performance; el resto del detalle, de esa misma ejecución.
    const mid = runs.find((r) => r.perf === median(runs.map((x) => x.perf)));
    const pass = mid.perf >= T.perf && mid.a11y >= T.a11y && mid.bp >= T.bp && mid.lcpMs < T.lcpMs && mid.jsCssKb < T.jsCssKb;
    summary[`${site}-${country}`] = { ...mid, runsPerf: runs.map((r) => r.perf), runsLcp: runs.map((r) => r.lcpMs), pass };
    console.log(
      `${pass ? 'OK  ' : 'FAIL'} ${site} ${country}: perf ${mid.perf} a11y ${mid.a11y} bp ${mid.bp} LCP ${mid.lcpMs}ms TBT ${mid.tbtMs}ms CLS ${mid.cls} JS+CSS ${mid.jsCssKb}KB (runs perf ${runs.map((r) => r.perf)})`,
    );
  }
}
writeFileSync(join(OUT, 'summary.json'), JSON.stringify({ thresholds: T, base: BASE, at: new Date().toISOString(), results: summary }, null, 2));
