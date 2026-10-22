# Supabase · schema `landings` (A4)

Proyecto `academia-infawina` (ref `ozpnufodmacwqrwhndyl`), el mismo del CRM. Todo lo de landings vive en el schema `landings`; del CRM (`public`, `auth`) solo se **leen** `profiles`/`members` a través de `public.is_admin()`, `public.my_member_id()`, `public.my_role()`.

## Migraciones (en orden)

| Archivo | Qué hace | Estado en el proyecto |
|---|---|---|
| `20261022160305_landings_schema.sql` | Tablas, índices, grants y RLS | aplicada |
| `20261022160429_landings_seed.sql` | Seed de sites/operators/offers desde `offers.fallback.json` + `site_members` por nombre | aplicada |
| `20261022161455_landings_rpc.sql` | Funciones RPC (catálogo, ingesta, conversiones, panel) | aplicada |
| `20261022170000_landings_rollup_cron.sql` | `rollup_daily`, `purge_old`, `pg_cron` | **pendiente**: la herramienta pide confirmación humana por los `DELETE` y no se pudo aplicar desde el agente. Aplicarla tal cual (SQL editor o `supabase db push`). |

El seed se regenera con `node supabase/scripts/gen-seed.mjs` (solo inserta lo que falte: `on conflict do nothing`).

## Cómo accede cada parte

El schema `landings` **no** se expone en PostgREST. Todo pasa por funciones en `public` con prefijo `landings_`:

| Quién | Funciones | Seguridad |
|---|---|---|
| Servidor de la app de landings (`SUPABASE_SERVICE_ROLE_KEY`) | `landings_catalog`, `landings_ingest_events`, `landings_record_conversion`, `landings_log_postback`, `landings_rollup` | `SECURITY DEFINER`, `EXECUTE` solo para `service_role` (revocado a `anon` y `authenticated`) |
| Panel `/panel` (usuario del CRM con su JWT + anon key) | `landings_panel_context`, `landings_panel_stats`, `landings_panel_offers`, `landings_admin_update_offer`, `landings_admin_import_conversions` | `SECURITY INVOKER`: corren como `authenticated` y **la RLS de `landings` decide** |

`authenticated` tiene `USAGE` en el schema y `SELECT` en las tablas (filtrado por RLS), `UPDATE` de columnas editables en `offers` e `INSERT` en `conversions` (ambos solo admin por política). `anon` no tiene nada.

## RLS

- **Admin** (`profiles.role = 'admin'`): lo ve todo, edita ofertas, importa conversiones, lee `postback_log`.
- **Miembro / editor**: solo filas de los sitios enlazados a su `profiles.member_id` en `landings.site_members`. Sin miembro enlazado → nada (salvo la lista de operadores).
- El CRM no tiene relación sitio↔miembro, por eso existe `landings.site_members(site_id, member_id)`. El seed la rellena por nombre: Diamond→diamond, Don Pool→donpool, Mapache→mapache, **Cronos→kronos**. TODO(sergi): confirmar.
- Para que un miembro vea su panel, su usuario del CRM debe tener `profiles.member_id` apuntando a su fila de `members` (hoy solo existe el perfil admin).

Pruebas: `supabase/tests/rls_by_role.sql`. Es un bloque `DO` que crea fixtures (usuarios de prueba en `auth.users`/`profiles`, eventos y conversiones), comprueba admin / miembro / editor / anon y termina con `RAISE EXCEPTION 'RLS_RESULTS …'`: Postgres lo deshace todo. Resultado del 2026-10-22: 30/30 OK.

## Datos y retención

- `events`: crudos. Se purgan a los 90 días, salvo `outbound`, que se guarda 400 días para atribuir FTD tardíos. Sin IP: solo `visitor_hash` (IP truncada /24 o /48 + UA + sal diaria) y `null` con `Sec-GPC: 1`.
- `daily_stats`: día (hora de Madrid) × sitio × país × operador × src × placement. Un `pg_cron` lo recalcula cada 15 min (ayer + hoy) y por la noche (últimos 40 días). La importación CSV lo recalcula al momento si hay service key.
- `conversions`: únicas por (operator_id, click_id, type, txn_id); `txn_id` solo cuenta en depósitos (puede haber varios por clic). Copian sitio, país, oferta, src y placement del `outbound`.
- `postback_log`: todo lo que llega, válido o no, con token y firma ocultos. 90 días.
