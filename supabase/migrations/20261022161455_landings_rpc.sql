-- [A4] Funciones de acceso. El schema `landings` no está expuesto en PostgREST, así que todo pasa por RPC en `public`
-- con prefijo `landings_`:
--   · landings_catalog / landings_ingest_events / landings_record_conversion / landings_log_postback
--       SECURITY DEFINER, execute SOLO para service_role (servidor de la app de landings).
--   · landings_panel_* / landings_admin_*
--       SECURITY INVOKER, execute para authenticated: corren con el JWT del usuario del CRM y la RLS de `landings` decide.

-- ───────────── Catálogo (forma OffersCatalog del contrato) ─────────────
create function public.landings_catalog() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'operators', coalesce((
      select jsonb_agg(jsonb_build_object('id', o.id, 'name', o.name, 'logoUrl', o.logo_url,
                                          'licenseByCountry', o.license_by_country) order by o.id)
      from landings.operators o where o.active), '[]'::jsonb),
    'offers', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', f.id, 'siteId', f.site_id, 'country', f.country, 'operatorId', f.operator_id, 'rank', f.rank,
        'affiliateUrlTemplate', f.affiliate_url_template, 'bonusHeadline', f.bonus_headline,
        'bonusTermsShort', f.bonus_terms_short, 'termsUrl', f.terms_url, 'payoutSpeed', f.payout_speed,
        'paymentMethods', to_jsonb(f.payment_methods), 'badges', to_jsonb(f.badges),
        'memberRating', f.member_rating,
        'validFrom', to_char(f.valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'validTo', to_char(f.valid_to at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'active', f.active and o.active)) order by f.site_id, f.country, f.rank)
      from landings.offers f join landings.operators o on o.id = f.operator_id
      join landings.sites s on s.id = f.site_id and s.active), '[]'::jsonb));
$$;

-- ───────────── Ingesta de eventos (lote de filas ya enriquecidas por el servidor) ─────────────
create function public.landings_ingest_events(p_events jsonb) returns integer
language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  insert into landings.events (ts, name, site_id, country, geo_country, locale, variant, path, visitor_hash, src, utm,
                               referrer_host, device, in_app, offer_id, operator_id, rank, placement, depth, click_id, props)
  select coalesce(x.ts, now()), x.name, x.site_id, x.country, x.geo_country, x.locale, x.variant, left(x.path, 200),
         x.visitor_hash, left(coalesce(x.src, ''), 32), x.utm, left(x.referrer_host, 120), x.device, x.in_app,
         x.offer_id, x.operator_id, x.rank, coalesce(x.placement, ''), x.depth, x.click_id, x.props
  from jsonb_to_recordset(p_events) as x(ts timestamptz, name text, site_id text, country text, geo_country text,
         locale text, variant smallint, path text, visitor_hash text, src text, utm jsonb, referrer_host text,
         device text, in_app text, offer_id text, operator_id text, rank smallint, placement text, depth smallint,
         click_id uuid, props jsonb)
  where x.site_id in (select id from landings.sites)
  on conflict (click_id) where click_id is not null do nothing;
  get diagnostics n = row_count;
  return n;
end $$;

-- ───────────── Conversión (lógica común postback + CSV). INVOKER: con service_role o con admin (RLS) ─────────────
-- Devuelve inserted | duplicate | unattributed (insertada sin click conocido) | operator_mismatch | invalid
create function landings.insert_conversion(
  p_operator text, p_click uuid, p_type text, p_amount numeric, p_currency text,
  p_occurred timestamptz, p_txn text, p_source text, p_raw jsonb
) returns text
language plpgsql security invoker set search_path = '' as $$
declare
  c record;
  v_txn text := case when p_type = 'deposit' then left(coalesce(p_txn, ''), 80) else '' end;
  n integer;
begin
  if p_click is null or p_type not in ('registration','ftd','deposit') then return 'invalid'; end if;
  select e.site_id, e.country, e.offer_id, e.operator_id, e.src, e.placement into c
    from landings.events e where e.click_id = p_click and e.name = 'outbound' limit 1;
  if found and c.operator_id is distinct from p_operator then return 'operator_mismatch'; end if;
  insert into landings.conversions (operator_id, click_id, type, txn_id, amount, currency, occurred_at, source,
                                    site_id, country, offer_id, src, placement, raw)
  values (p_operator, p_click, p_type, v_txn, p_amount, upper(nullif(p_currency, '')), coalesce(p_occurred, now()),
          p_source, c.site_id, c.country, c.offer_id, coalesce(c.src, ''), coalesce(c.placement, ''), p_raw)
  on conflict (operator_id, click_id, type, txn_id) do nothing;
  get diagnostics n = row_count;
  if n = 0 then return 'duplicate'; end if;
  return case when c.site_id is null then 'unattributed' else 'inserted' end;
end $$;

create function public.landings_record_conversion(p jsonb) returns text
language plpgsql security definer set search_path = '' as $$
begin
  return landings.insert_conversion(p->>'operator_id', (p->>'click_id')::uuid, p->>'type', (p->>'amount')::numeric,
    p->>'currency', (p->>'occurred_at')::timestamptz, p->>'txn_id', 'postback', p->'raw');
end $$;

create function public.landings_log_postback(p jsonb) returns void
language sql security definer set search_path = '' as $$
  insert into landings.postback_log (operator_id, method, query, body, source_ip, valid, status, reason, click_id, result)
  values (left(p->>'operator_id', 40), left(p->>'method', 8), p->'query', left(p->>'body', 4000), left(p->>'source_ip', 64),
          coalesce((p->>'valid')::boolean, false), coalesce((p->>'status')::smallint, 0), left(p->>'reason', 200),
          left(p->>'click_id', 80), left(p->>'result', 40));
$$;

-- ───────────── Panel (INVOKER: manda la RLS) ─────────────
create function public.landings_panel_context() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'role', (select public.my_role()),
    'isAdmin', (select public.is_admin()),
    'sites', coalesce((
      select jsonb_agg(jsonb_build_object('id', s.id, 'brandName', s.brand_name, 'shortName', s.short_name,
        'members', coalesce((select jsonb_agg(m.name order by m.name) from landings.site_members sm
                             join public.members m on m.id = sm.member_id where sm.site_id = s.id), '[]'::jsonb))
        order by s.id)
      from landings.sites s), '[]'::jsonb));
$$;

create function public.landings_panel_stats(p_from date, p_to date) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'day', d.day, 'site', d.site_id, 'country', d.country, 'operator', d.operator_id, 'src', d.src,
    'placement', d.placement, 'pageviews', d.pageviews, 'uniques', d.uniques, 'offerViews', d.offer_views,
    'ctaClicks', d.cta_clicks, 'outbounds', d.outbounds, 'registrations', d.registrations, 'ftds', d.ftds,
    'deposits', d.deposits, 'depositAmount', d.deposit_amount) order by d.day), '[]'::jsonb)
  from landings.daily_stats d where d.day between p_from and p_to;
$$;

create function public.landings_panel_offers() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'siteId', f.site_id, 'country', f.country, 'operatorId', f.operator_id, 'rank', f.rank,
    'affiliateUrlTemplate', f.affiliate_url_template, 'bonusHeadline', f.bonus_headline,
    'bonusTermsShort', f.bonus_terms_short, 'termsUrl', f.terms_url, 'active', f.active,
    'validFrom', f.valid_from, 'validTo', f.valid_to, 'updatedAt', f.updated_at)
    order by f.site_id, f.country, f.rank), '[]'::jsonb)
  from landings.offers f;
$$;

-- Edita una oferta. Solo admin (lo impone la política offers_update). Campos permitidos: los del grant de columnas.
create function public.landings_admin_update_offer(p_id text, p_patch jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare r landings.offers;
begin
  update landings.offers f set
    affiliate_url_template = coalesce(p_patch->>'affiliateUrlTemplate', f.affiliate_url_template),
    bonus_headline        = coalesce(p_patch->>'bonusHeadline', f.bonus_headline),
    bonus_terms_short     = coalesce(p_patch->>'bonusTermsShort', f.bonus_terms_short),
    terms_url             = coalesce(p_patch->>'termsUrl', f.terms_url),
    rank                  = coalesce((p_patch->>'rank')::smallint, f.rank),
    active                = coalesce((p_patch->>'active')::boolean, f.active),
    updated_by            = (select auth.uid())
  where f.id = p_id
  returning * into r;
  if not found then raise exception 'offer_not_found_or_forbidden' using errcode = '42501'; end if;
  return to_jsonb(r);
end $$;

-- Importación CSV (filas ya parseadas en el servidor). Solo admin (política conversions_insert).
create function public.landings_admin_import_conversions(p_operator text, p_rows jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  x record; res text;
  v_out jsonb := '{"inserted":0,"duplicate":0,"unattributed":0,"operator_mismatch":0,"invalid":0}'::jsonb;
begin
  if not (select public.is_admin()) then raise exception 'forbidden' using errcode = '42501'; end if;
  for x in select * from jsonb_to_recordset(p_rows) as t(click_id text, type text, amount numeric, currency text,
                                                         occurred_at timestamptz, txn_id text, raw jsonb) loop
    if x.click_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      res := 'invalid';
    else
      res := landings.insert_conversion(p_operator, x.click_id::uuid, x.type, x.amount, x.currency, x.occurred_at,
                                        x.txn_id, 'csv', x.raw);
    end if;
    v_out := jsonb_set(v_out, array[res], to_jsonb((v_out->>res)::int + 1));
  end loop;
  return v_out;
end $$;

-- ───────────── Permisos de ejecución ─────────────
revoke all on function public.landings_catalog() from public, anon, authenticated;
revoke all on function public.landings_ingest_events(jsonb) from public, anon, authenticated;
revoke all on function public.landings_record_conversion(jsonb) from public, anon, authenticated;
revoke all on function public.landings_log_postback(jsonb) from public, anon, authenticated;
grant execute on function public.landings_catalog(), public.landings_ingest_events(jsonb),
  public.landings_record_conversion(jsonb), public.landings_log_postback(jsonb) to service_role;

revoke all on function landings.insert_conversion(text, uuid, text, numeric, text, timestamptz, text, text, jsonb) from public, anon;
grant execute on function landings.insert_conversion(text, uuid, text, numeric, text, timestamptz, text, text, jsonb) to authenticated, service_role;

revoke all on function public.landings_panel_context() from public, anon;
revoke all on function public.landings_panel_stats(date, date) from public, anon;
revoke all on function public.landings_panel_offers() from public, anon;
revoke all on function public.landings_admin_update_offer(text, jsonb) from public, anon;
revoke all on function public.landings_admin_import_conversions(text, jsonb) from public, anon;
grant execute on function public.landings_panel_context(), public.landings_panel_stats(date, date),
  public.landings_panel_offers(), public.landings_admin_update_offer(text, jsonb),
  public.landings_admin_import_conversions(text, jsonb) to authenticated, service_role;
