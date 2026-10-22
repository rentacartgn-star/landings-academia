# STATUS · Landings de afiliación Academia Infa & Wina

> Lo mantiene A0 (orquestador). Última actualización: 22-oct-2026 17:50.

## Hecho
| Pieza | Estado | Dónde |
|---|---|---|
| Monorepo, contratos zod, primitivas headless | ✅ | `packages/contracts`, `apps/web/components/ui` |
| Plataforma: host → sitio, país (cookie > override > IP), A/B `lp_v`, caché por (sitio, país, variante, detectado), fallback JSON | ✅ | `apps/web/middleware.ts`, `apps/web/lib/landing`, `docs/DEPLOY.md` |
| Copy de los 4 sitios (es-ES, es-419; en-US cae a es-419), 3 variantes A/B, verificador | ✅ (revisado por A5) | `apps/web/content`, `content/TECNICAS.md` |
| Compliance por país (ES, MX, PA, EC, US, resto), gate P9, páginas legales | ✅ | `compliance/`, `apps/web/lib/compliance`, `apps/web/app/legal` |
| Tracking: `/go` 302 + `click_id`, beacons, píxel noscript, bots/previews, GPC, IP truncada | ✅ verificado en preview: `pageview` y `outbound` se escriben en Supabase; catálogo leído de la BD (`lp-catalog=db`) | `apps/web/lib/tracking`, `apps/web/app/go`, `apps/web/app/api` |
| Supabase schema `landings` (tablas, RLS, seed, RPC) | ✅ aplicado en `academia-infawina` | `supabase/` |
| Rollup diario + `pg_cron` | ⏳ pendiente de aplicar (requiere confirmación humana) | `supabase/migrations/20261022170000_landings_rollup_cron.sql` |
| Panel `/panel` (KPIs, embudo, desgloses, admin de ofertas, CSV, probar enlace) | ✅ (sin probar con login real) | `apps/web/app/panel` |
| Temas liquid glass: Diamond, DonPool, Kronos, Mapache | ✅ con los logos reales de cada canal | `apps/web/themes/*`, `qa/screens/<site>/` |
| QA (Playwright, Lighthouse, caché, enlaces) | ver `qa/REPORT.md` | `qa/` |

## Bloqueado / pendiente del equipo
1. **Rotar la service_role key** (se pegó en el chat) o pasar a una clave `sb_secret_…`, y actualizar `SUPABASE_SERVICE_ROLE_KEY` en Vercel.
2. **Variables en Vercel pendientes:** `POSTBACK_SECRET_<OP>` cuando haya postbacks; `COMPLIANCE_APPROVED_MARKETS` en Production tras el OK legal (P9).
3. **Plan Vercel Pro** (Hobby no permite uso comercial) y alta de los 4 dominios.
4. Aplicar la migración del rollup (punto de arriba).

## TODO(sergi) (los datos que no se han inventado)
- **P1** matriz país → operadores → orden (hoy: ES Sportium; MX Sportium + BetMGM; PA y EC con operadores de prueba "C/D" solo para probar el ranking; US BetMGM). A5 recomienda EC y US en fallback en v1.
- **P2** enlaces de afiliado reales por miembro × país × operador (hoy `example.com`), editables en `/panel/ofertas`.
- **P3** dominios de DonPool, Kronos y Mapache.
- **P5** ¿subid y postback S2S? URL de postback: `https://<dominio>/api/postback/<op>?click_id={subid}&event=ftd&amount={amount}&currency={cur}&token=<secreto>`.
- **P6** logos, colores y textos de bono aprobados por cada operador (`compliance/creativos-operadores.md`).
- **P7** foto/avatar y @ reales de cada miembro, y sus redes en `packages/config/src/sites.ts`.
- **P9** OK legal por mercado → `COMPLIANCE_APPROVED_MARKETS`.
- Seguidores y años analizando de cada miembro; plazos reales de retirada por casa y país; métodos de pago por operador (bloquean publicar, R1-10 y R1-12).
- Confirmar que cada miembro tiene cuenta en su casa nº 1 ("la casa que uso yo" debe ser cierto).
- Compromiso art. 27 RD 958/2020 (tipster publica resultados) con Sportium.
- Datos del titular (razón social, NIF, domicilio, email); ¿titular común o por miembro?
- Números de licencia DGOJ / SEGOB / JCJ; líneas de ayuda de PA y EC.
- 10–20 frases reales de comentarios de TikTok/IG de cada miembro (voice of customer).
- Enlazar `profiles.member_id` de cada miembro en el CRM para que vea su panel; confirmar Cronos→kronos.

Búsqueda rápida: `grep -rn "TODO(sergi)" apps packages`.
