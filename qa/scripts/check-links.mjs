// [A6] Comprobador de enlaces de afiliado: para cada oferta activa, /go → 302 → destino final (status, nº de saltos,
// host final y si el click_id sobrevive a la cadena de redirecciones). También comprueba termsUrl.
// Uso: QA_BASE_URL=http://localhost:3156 node scripts/check-links.mjs   (curl respeta HTTPS_PROXY)
// Fuente de ofertas: el catálogo de respaldo (packages/config/src/offers.fallback.json). Con BD, pasar QA_OFFERS_JSON.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3156';
const SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const catalog = JSON.parse(readFileSync(process.env.QA_OFFERS_JSON ?? join(HERE, '../../packages/config/src/offers.fallback.json'), 'utf8'));

function curl(args) {
  try {
    return execFileSync('curl', ['-sS', '--max-time', '20', '-A', SAFARI, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    return `ERR ${String(e.stderr || e.message).trim().split('\n')[0]}`;
  }
}

const rows = [];
for (const o of catalog.offers.filter((x) => x.active)) {
  // 1) /go en nuestro servidor (sin seguir).
  const head = curl(['-o', '/dev/null', '-D', '-', `${BASE}/go/${o.id}?p=hero`]);
  const status = Number(head.match(/^HTTP\/[\d.]+ (\d+)/m)?.[1] ?? 0);
  const location = head.match(/^location: (.+)$/im)?.[1]?.trim() ?? '';
  const clickId = head.match(/^x-lp-click-id: (.+)$/im)?.[1]?.trim() ?? '';
  // 2) Destino del operador, siguiendo redirecciones.
  let final = { code: 0, url: '', redirects: 0, err: '' };
  if (location.startsWith('http')) {
    const out = curl(['-L', '--max-redirs', '10', '-o', '/dev/null', '-w', '%{http_code} %{num_redirects} %{url_effective}', location]);
    if (out.startsWith('ERR')) final.err = out;
    else {
      const [code, redirects, ...u] = out.trim().split(' ');
      final = { code: Number(code), redirects: Number(redirects), url: u.join(' '), err: '' };
    }
  }
  const terms = o.termsUrl ? curl(['-L', '-o', '/dev/null', '-w', '%{http_code}', o.termsUrl]).trim() : '';
  const problems = [];
  if (status !== 302) problems.push(`/go ${status}`);
  if (!clickId || !location.includes(clickId)) problems.push('click_id no está en la URL');
  if (location.includes('{click_id}')) problems.push('plantilla sin sustituir');
  if (/TODO|example\.com/i.test(o.affiliateUrlTemplate)) problems.push('enlace placeholder TODO(sergi)');
  if (final.err) problems.push(/CONNECT tunnel failed, response 403/.test(final.err) ? 'destino bloqueado por el proxy de este entorno (no comprobable aquí)' : final.err);
  else if (final.code >= 400 || final.code === 0) problems.push(`destino ${final.code}`);
  if (final.url && clickId && !final.url.includes(clickId)) problems.push('el click_id se pierde en las redirecciones del operador');
  if (terms && !/^2\d\d$/.test(terms)) problems.push(/403/.test(terms) ? 'termsUrl bloqueada por el proxy' : `termsUrl ${terms}`);
  rows.push({ id: o.id, go: status, clickIdInUrl: !!clickId && location.includes(clickId), finalStatus: final.code, redirects: final.redirects, finalUrl: final.url, terms, problems });
}

mkdirSync(join(HERE, '../results'), { recursive: true });
writeFileSync(join(HERE, '../results/links.json'), JSON.stringify({ base: BASE, at: new Date().toISOString(), rows }, null, 2));
console.log('| oferta | /go | click_id | destino | saltos | URL final | terms | problemas |');
console.log('|---|---|---|---|---|---|---|---|');
for (const r of rows)
  console.log(`| ${r.id} | ${r.go} | ${r.clickIdInUrl ? 'sí' : 'NO'} | ${r.finalStatus} | ${r.redirects} | ${r.finalUrl.replace(/subid=[\w-]+/, 'subid=<uuid>')} | ${r.terms} | ${r.problems.join('; ') || 'OK'} |`);
const bad = rows.filter((r) => r.problems.length).length;
console.log(`\n${rows.length} ofertas, ${bad} con problemas.`);
process.exitCode = rows.some((r) => r.go !== 302 || !r.clickIdInUrl) ? 1 : 0;
