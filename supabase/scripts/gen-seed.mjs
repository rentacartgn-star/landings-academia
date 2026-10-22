// [A4] Genera la migración de seed desde packages/config/src/offers.fallback.json. Uso: node supabase/scripts/gen-seed.mjs > supabase/migrations/20261022160429_landings_seed.sql
import { readFileSync } from 'node:fs';
const cat = JSON.parse(readFileSync(new URL('../../packages/config/src/offers.fallback.json', import.meta.url), 'utf8'));
const q = (v) => (v === undefined || v === null ? 'null' : `'${String(v).replaceAll("'", "''")}'`);
const arr = (a) => (a ? `array[${a.map(q).join(',')}]::text[]` : 'null');
const sites = [
  ['diamond', 'Diamond Picks', 'Diamond'],
  ['donpool', 'DonPool Picks', 'DonPool'],
  ['kronos', 'Kronos', 'Kronos'],
  ['mapache', 'Mapache Picks', 'Mapache'],
];
let out = `-- [A4] Seed generado por supabase/scripts/gen-seed.mjs desde offers.fallback.json. Idempotente (on conflict do nothing).\n\n`;
out += `insert into landings.sites (id, brand_name, short_name) values\n${sites.map((s) => `  (${s.map(q).join(', ')})`).join(',\n')}\non conflict (id) do nothing;\n\n`;
out += `insert into landings.operators (id, name, logo_url, license_by_country) values\n${cat.operators
  .map((o) => `  (${q(o.id)}, ${q(o.name)}, ${q(o.logoUrl)}, ${q(JSON.stringify(o.licenseByCountry))}::jsonb)`)
  .join(',\n')}\non conflict (id) do nothing;\n\n`;
out += `insert into landings.offers (id, site_id, country, operator_id, rank, affiliate_url_template, bonus_headline, bonus_terms_short, terms_url, payout_speed, payment_methods, badges, member_rating, valid_from, valid_to, active) values\n${cat.offers
  .map((o) => `  (${[q(o.id), q(o.siteId), q(o.country), q(o.operatorId), o.rank, q(o.affiliateUrlTemplate), q(o.bonusHeadline), q(o.bonusTermsShort), q(o.termsUrl), q(o.payoutSpeed), arr(o.paymentMethods), arr(o.badges ?? []), o.memberRating ?? 'null', q(o.validFrom), q(o.validTo), o.active].join(', ')})`)
  .join(',\n')}\non conflict (id) do nothing;\n\n`;
out += `-- Vínculo sitio → miembro del CRM por nombre (sin ids a fuego). "Cronos" en el CRM = sitio kronos. TODO(sergi): confirmar.\n`;
out += `insert into landings.site_members (site_id, member_id)\nselect s.site_id, m.id from public.members m\njoin (values ('diamond','diamond'), ('donpool','donpool'), ('mapache','mapache'), ('kronos','kronos'), ('kronos','cronos')) as s(site_id, norm)\n  on lower(regexp_replace(m.name, '\\s+', '', 'g')) = s.norm\non conflict do nothing;\n`;
process.stdout.write(out);
