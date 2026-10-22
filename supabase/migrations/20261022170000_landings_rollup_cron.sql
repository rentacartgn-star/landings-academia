-- [A4] Rollup diario (daily_stats), purga de retención y programación con pg_cron.

-- ───────────── Rollup diario y purga ─────────────
-- Días en hora de Madrid. Recalcula el rango completo (borra e inserta), así que es idempotente.
create function landings.rollup_daily(p_from date, p_to date) returns integer
language plpgsql security definer set search_path = '' as $$
declare
  t0 timestamptz := (p_from::timestamp at time zone 'Europe/Madrid');
  t1 timestamptz := ((p_to + 1)::timestamp at time zone 'Europe/Madrid');
  n integer;
begin
  delete from landings.daily_stats where day between p_from and p_to;
  insert into landings.daily_stats (day, site_id, country, operator_id, src, placement, pageviews, uniques,
                                    offer_views, cta_clicks, outbounds, registrations, ftds, deposits, deposit_amount)
  select day, site_id, country, operator_id, src, placement,
         sum(pv), sum(uq), sum(ov), sum(cc), sum(ob), sum(rg), sum(fd), sum(dp), sum(da)
  from (
    -- métricas de página
    select (e.ts at time zone 'Europe/Madrid')::date day, e.site_id, e.country, ''::text operator_id, e.src, ''::text placement,
           count(*) pv, count(distinct e.visitor_hash) uq, 0 ov, 0 cc, 0 ob, 0 rg, 0 fd, 0 dp, 0::numeric da
    from landings.events e where e.ts >= t0 and e.ts < t1 and e.name = 'pageview'
    group by 1, 2, 3, 5
    union all
    -- métricas de oferta
    select (e.ts at time zone 'Europe/Madrid')::date, e.site_id, e.country, coalesce(e.operator_id, ''), e.src,
           case when e.name = 'offer_view' then '' else e.placement end,
           0, 0, count(*) filter (where e.name = 'offer_view'), count(*) filter (where e.name = 'cta_click'),
           count(*) filter (where e.name = 'outbound'), 0, 0, 0, 0
    from landings.events e where e.ts >= t0 and e.ts < t1 and e.name in ('offer_view','cta_click','outbound')
    group by 1, 2, 3, 4, 5, 6
    union all
    -- conversiones atribuidas
    select (c.occurred_at at time zone 'Europe/Madrid')::date, c.site_id, c.country, c.operator_id, c.src, c.placement,
           0, 0, 0, 0, 0, count(*) filter (where c.type = 'registration'), count(*) filter (where c.type = 'ftd'),
           count(*) filter (where c.type = 'deposit'), coalesce(sum(c.amount) filter (where c.type in ('ftd','deposit')), 0)
    from landings.conversions c where c.occurred_at >= t0 and c.occurred_at < t1 and c.site_id is not null
    group by 1, 2, 3, 4, 5, 6
  ) u
  group by day, site_id, country, operator_id, src, placement;
  get diagnostics n = row_count;
  return n;
end $$;

create function landings.purge_old() returns void
language sql security definer set search_path = '' as $$
  delete from landings.events where ts < now() - interval '90 days' and name <> 'outbound';
  delete from landings.events where ts < now() - interval '400 days';
  delete from landings.postback_log where ts < now() - interval '90 days';
$$;


-- ───────────── Permisos ─────────────
revoke all on function landings.rollup_daily(date, date) from public, anon, authenticated;
revoke all on function landings.purge_old() from public, anon, authenticated;
grant execute on function landings.rollup_daily(date, date), landings.purge_old() to service_role;

-- Rollup inmediato tras una importación CSV (lo llama el servidor con service_role).
create function public.landings_rollup(p_from date, p_to date) returns integer
language sql security definer set search_path = '' as $$ select landings.rollup_daily(p_from, p_to) $$;
revoke all on function public.landings_rollup(date, date) from public, anon, authenticated;
grant execute on function public.landings_rollup(date, date) to service_role;

-- ───────────── Programación con pg_cron ─────────────
-- Cada 15 min: ayer + hoy. Cada noche: últimos 40 días (conversiones tardías e importaciones CSV). Purga diaria.
create extension if not exists pg_cron;
select cron.schedule('landings-rollup-15m', '*/15 * * * *',
  $c$select landings.rollup_daily((now() at time zone 'Europe/Madrid')::date - 1, (now() at time zone 'Europe/Madrid')::date)$c$);
select cron.schedule('landings-rollup-nightly', '40 2 * * *',
  $c$select landings.rollup_daily((now() at time zone 'Europe/Madrid')::date - 40, (now() at time zone 'Europe/Madrid')::date)$c$);
select cron.schedule('landings-purge', '10 3 * * *', $c$select landings.purge_old()$c$);
