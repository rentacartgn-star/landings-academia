-- [A4] Pruebas de RLS y RPC por rol. Todo ocurre en un bloque DO que termina con RAISE EXCEPTION:
-- Postgres deshace TODO (fixtures en auth.users/profiles incluidos) y el mensaje de error trae los resultados.
-- Ejecutar con: execute_sql (MCP) o psql. Resultado esperado: el error "RLS_RESULTS ..." con todos los checks en OK.
do $test$
declare
  v_admin uuid := (select id from public.profiles where role = 'admin' and active limit 1);
  v_member uuid := gen_random_uuid();   -- miembro enlazado a Diamond
  v_editor uuid := gen_random_uuid();   -- editor sin miembro
  v_diamond_member uuid := (select sm.member_id from landings.site_members sm where sm.site_id = 'diamond' limit 1);
  v_click uuid := gen_random_uuid();
  v_click2 uuid := gen_random_uuid();
  r text := '';
  n int; t text; j jsonb; ok boolean;
begin
  -- ── Fixtures (se deshacen) ──
  insert into auth.users (id, email, aud, role) values
    (v_member, 'rls-member@test.invalid', 'authenticated', 'authenticated'),
    (v_editor, 'rls-editor@test.invalid', 'authenticated', 'authenticated');
  insert into public.profiles (id, email, full_name, role, member_id) values
    (v_member, 'rls-member@test.invalid', 'RLS member', 'member', v_diamond_member),
    (v_editor, 'rls-editor@test.invalid', 'RLS editor', 'editor', null);

  -- Ingesta (service_role → SECURITY DEFINER)
  n := public.landings_ingest_events(jsonb_build_array(
    jsonb_build_object('name','pageview','site_id','diamond','country','ES','visitor_hash','h1','src','tt'),
    jsonb_build_object('name','pageview','site_id','donpool','country','MX','visitor_hash','h2'),
    jsonb_build_object('name','outbound','site_id','diamond','country','ES','offer_id','diamond-es-sportium',
                       'operator_id','sportium','placement','hero','src','tt','click_id',v_click),
    jsonb_build_object('name','outbound','site_id','donpool','country','MX','offer_id','donpool-mx-betmgm',
                       'operator_id','betmgm','placement','ranking','click_id',v_click2),
    jsonb_build_object('name','outbound','site_id','diamond','country','ES','offer_id','diamond-es-sportium',
                       'operator_id','sportium','click_id',v_click),               -- click_id repetido → ignorado
    jsonb_build_object('name','pageview','site_id','nope','country','ES')));        -- sitio desconocido → ignorado
  r := r || format('ingest=%s(%s) ', n, case when n = 4 then 'OK' else 'FAIL' end);

  -- Postback idempotente
  t := public.landings_record_conversion(jsonb_build_object('operator_id','sportium','click_id',v_click,'type','ftd','amount','50','currency','eur'));
  r := r || format('conv1=%s(%s) ', t, case when t = 'inserted' then 'OK' else 'FAIL' end);
  t := public.landings_record_conversion(jsonb_build_object('operator_id','sportium','click_id',v_click,'type','ftd','amount','50'));
  r := r || format('conv_dup=%s(%s) ', t, case when t = 'duplicate' then 'OK' else 'FAIL' end);
  t := public.landings_record_conversion(jsonb_build_object('operator_id','betmgm','click_id',v_click,'type','registration'));
  r := r || format('conv_mismatch=%s(%s) ', t, case when t = 'operator_mismatch' then 'OK' else 'FAIL' end);
  t := public.landings_record_conversion(jsonb_build_object('operator_id','betmgm','click_id',v_click2,'type','registration'));
  r := r || format('conv_donpool=%s(%s) ', t, case when t = 'inserted' then 'OK' else 'FAIL' end);
  t := public.landings_record_conversion(jsonb_build_object('operator_id','sportium','click_id',gen_random_uuid(),'type','registration'));
  r := r || format('conv_unknown=%s(%s) ', t, case when t = 'unattributed' then 'OK' else 'FAIL' end);
  -- depósitos: varios por click si traen txn distinto
  t := public.landings_record_conversion(jsonb_build_object('operator_id','sportium','click_id',v_click,'type','deposit','txn_id','a','amount','10'));
  t := t || '/' || public.landings_record_conversion(jsonb_build_object('operator_id','sportium','click_id',v_click,'type','deposit','txn_id','b','amount','20'));
  r := r || format('deposits=%s(%s) ', t, case when t = 'inserted/inserted' then 'OK' else 'FAIL' end);

  insert into landings.daily_stats (day, site_id, country, pageviews) values (current_date, 'diamond', 'ES', 10), (current_date, 'donpool', 'MX', 7);
  perform public.landings_log_postback(jsonb_build_object('operator_id','sportium','method','GET','valid',false,'status',401,'reason','bad_sig'));

  j := public.landings_catalog();
  r := r || format('catalog_offers=%s(%s) ', jsonb_array_length(j->'offers'), case when jsonb_array_length(j->'offers') >= 44 then 'OK' else 'FAIL' end);

  -- ── ADMIN ──
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from landings.offers;            r := r || format('admin.offers=%s(%s) ', n, case when n >= 44 then 'OK' else 'FAIL' end);
  select count(distinct site_id) into n from landings.daily_stats; r := r || format('admin.stats_sites=%s(%s) ', n, case when n = 2 then 'OK' else 'FAIL' end);
  select count(*) into n from landings.postback_log;       r := r || format('admin.pblog=%s(%s) ', n, case when n >= 1 then 'OK' else 'FAIL' end);
  j := public.landings_admin_update_offer('donpool-mx-betmgm', '{"bonusHeadline":"rls test","active":false}');
  r := r || format('admin.update=%s ', case when j->>'bonus_headline' = 'rls test' then 'OK' else 'FAIL' end);
  j := public.landings_admin_import_conversions('sportium', jsonb_build_array(
         jsonb_build_object('click_id', v_click, 'type', 'registration'),
         jsonb_build_object('click_id', v_click, 'type', 'ftd'),
         jsonb_build_object('click_id', 'no-es-uuid', 'type', 'ftd')));
  r := r || format('admin.csv=%s(%s) ', j, case when (j->>'inserted')::int = 1 and (j->>'duplicate')::int = 1 and (j->>'invalid')::int = 1 then 'OK' else 'FAIL' end);
  reset role;

  -- ── MIEMBRO (Diamond) ──
  perform set_config('request.jwt.claims', json_build_object('sub', v_member, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from landings.offers where site_id <> 'diamond'; r := r || format('member.other_offers=%s(%s) ', n, case when n = 0 then 'OK' else 'FAIL' end);
  select count(*) into n from landings.offers;            r := r || format('member.offers=%s(%s) ', n, case when n = 11 then 'OK' else 'FAIL' end);
  select string_agg(distinct site_id, ',') into t from landings.daily_stats; r := r || format('member.stats_sites=%s(%s) ', t, case when t = 'diamond' then 'OK' else 'FAIL' end);
  select string_agg(distinct coalesce(site_id,'null'), ',') into t from landings.conversions; r := r || format('member.conv_sites=%s(%s) ', t, case when t = 'diamond' then 'OK' else 'FAIL' end);
  select count(*) into n from landings.postback_log;       r := r || format('member.pblog=%s(%s) ', n, case when n = 0 then 'OK' else 'FAIL' end);
  j := public.landings_panel_stats(current_date, current_date);
  r := r || format('member.panel_stats=%s(%s) ', jsonb_array_length(j), case when jsonb_array_length(j) = 1 then 'OK' else 'FAIL' end);
  j := public.landings_panel_context();
  r := r || format('member.ctx_sites=%s(%s) ', jsonb_array_length(j->'sites'), case when jsonb_array_length(j->'sites') = 1 and not (j->>'isAdmin')::boolean then 'OK' else 'FAIL' end);
  begin
    j := public.landings_admin_update_offer('diamond-es-sportium', '{"active":false}');
    r := r || 'member.update=FAIL ';
  exception when others then r := r || 'member.update=denied(OK) '; end;
  begin
    j := public.landings_admin_import_conversions('sportium', '[]'::jsonb);
    r := r || 'member.csv=FAIL ';
  exception when others then r := r || 'member.csv=denied(OK) '; end;
  begin
    insert into landings.conversions (operator_id, click_id, type, source) values ('sportium', gen_random_uuid(), 'ftd', 'csv');
    r := r || 'member.insert_conv=FAIL ';
  exception when others then r := r || 'member.insert_conv=denied(OK) '; end;
  begin
    perform public.landings_catalog();
    r := r || 'member.catalog_rpc=FAIL ';
  exception when others then r := r || 'member.catalog_rpc=denied(OK) '; end;
  reset role;

  -- ── EDITOR sin miembro ──
  perform set_config('request.jwt.claims', json_build_object('sub', v_editor, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from landings.offers;       r := r || format('editor.offers=%s(%s) ', n, case when n = 0 then 'OK' else 'FAIL' end);
  select count(*) into n from landings.daily_stats;  r := r || format('editor.stats=%s(%s) ', n, case when n = 0 then 'OK' else 'FAIL' end);
  select count(*) into n from landings.operators;    r := r || format('editor.operators=%s(%s) ', n, case when n = 4 then 'OK' else 'FAIL' end);
  reset role;

  -- ── ANON ──
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  begin
    select count(*) into n from landings.offers;
    r := r || 'anon.offers=FAIL ';
  exception when others then r := r || 'anon.offers=denied(OK) '; end;
  begin
    perform public.landings_ingest_events('[]'::jsonb);
    r := r || 'anon.ingest=FAIL ';
  exception when others then r := r || 'anon.ingest=denied(OK) '; end;
  begin
    perform public.landings_panel_stats(current_date, current_date);
    r := r || 'anon.panel=FAIL ';
  exception when others then r := r || 'anon.panel=denied(OK) '; end;
  reset role;

  raise exception 'RLS_RESULTS %', r;
end
$test$;
