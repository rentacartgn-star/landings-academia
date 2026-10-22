-- [A4] Schema `landings`: catálogo de ofertas, eventos, rollup diario, conversiones y log de postbacks.
-- No toca nada del CRM: de `public` solo se LEEN profiles/members a través de public.is_admin() y public.my_member_id().
-- Acceso:
--   · App de landings (servidor, service_role) → funciones RPC `public.landings_*` SECURITY DEFINER (ver 20261022161455).
--   · Panel (usuario del CRM, rol authenticated) → funciones `public.landings_panel_*` SECURITY INVOKER: aquí manda la RLS.
--   El schema `landings` NO se expone en PostgREST; nadie lo lee por REST directo.

create schema if not exists landings;
comment on schema landings is 'Landings de afiliación (A4). Acceso vía RPC public.landings_*; RLS en todas las tablas.';

-- ───────────── Sitios y vínculo con los miembros del CRM ─────────────
create table landings.sites (
  id          text primary key check (id ~ '^[a-z0-9-]{2,32}$'),
  brand_name  text not null,
  short_name  text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Un sitio pertenece a uno o varios miembros del CRM (public.members). No hay columna obvia en el CRM, así que va aquí.
create table landings.site_members (
  site_id    text not null references landings.sites(id) on delete cascade,
  member_id  uuid not null references public.members(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (site_id, member_id)
);
create index site_members_member_idx on landings.site_members(member_id);

-- ───────────── Operadores y ofertas (clave sitio × país × operador) ─────────────
create table landings.operators (
  id                  text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name                text not null,
  logo_url            text not null default '/operators/placeholder.svg',
  license_by_country  jsonb not null default '{}'::jsonb check (jsonb_typeof(license_by_country) = 'object'),
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table landings.offers (
  id                      text primary key check (id ~ '^[a-z0-9-]{2,80}$'),
  site_id                 text not null references landings.sites(id),
  country                 char(2) not null check (country ~ '^[A-Z]{2}$'),
  operator_id             text not null references landings.operators(id),
  rank                    smallint not null check (rank between 1 and 4),
  affiliate_url_template  text not null check (position('{click_id}' in affiliate_url_template) > 0 and affiliate_url_template ~ '^https://'),
  bonus_headline          text not null default '',
  bonus_terms_short       text not null default '',
  terms_url               text not null default '',
  payout_speed            text,
  payment_methods         text[],
  badges                  text[] not null default '{}',
  member_rating           numeric(2,1) check (member_rating between 0 and 5),
  valid_from              timestamptz,
  valid_to                timestamptz,
  active                  boolean not null default true,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  updated_by              uuid,
  unique (site_id, country, operator_id),
  check (valid_to is null or valid_from is null or valid_to > valid_from)
);
create index offers_site_country_idx on landings.offers(site_id, country, rank);
create index offers_operator_idx on landings.offers(operator_id);

-- ───────────── Eventos crudos (retención 90 d; los outbound se guardan 400 d para atribuir FTD tardíos) ─────────────
create table landings.events (
  id            bigint generated always as identity primary key,
  ts            timestamptz not null default now(),
  name          text not null check (name in ('pageview','offer_view','scroll_depth','cta_click','outbound','country_switch')),
  site_id       text not null references landings.sites(id),
  country       char(2) not null,          -- mercado mostrado (no el de la IP)
  geo_country   char(2),                   -- país por IP (x-vercel-ip-country)
  locale        text,
  variant       smallint,
  path          text,
  visitor_hash  text,                      -- sha256(ip+ua+sal diaria). Nunca IP en bruto
  src           text not null default '',
  utm           jsonb,
  referrer_host text,
  device        text check (device in ('mobile','tablet','desktop')),
  in_app        text check (in_app in ('ig','tt','fb')),
  offer_id      text,
  operator_id   text,
  rank          smallint,
  placement     text not null default '',
  depth         smallint,
  click_id      uuid,
  props         jsonb
);
create index events_ts_idx on landings.events using brin(ts);
create index events_site_ts_idx on landings.events(site_id, ts);
create unique index events_click_id_uidx on landings.events(click_id) where click_id is not null;

-- ───────────── Rollup diario (día × sitio × país × operador × src × placement) ─────────────
-- operator_id = '' y placement = '' para métricas de página (pageviews, únicos, scroll).
create table landings.daily_stats (
  day            date not null,
  site_id        text not null references landings.sites(id),
  country        char(2) not null,
  operator_id    text not null default '',
  src            text not null default '',
  placement      text not null default '',
  pageviews      integer not null default 0,
  uniques        integer not null default 0,
  offer_views    integer not null default 0,
  cta_clicks     integer not null default 0,
  outbounds      integer not null default 0,
  registrations  integer not null default 0,
  ftds           integer not null default 0,
  deposits       integer not null default 0,
  deposit_amount numeric(14,2) not null default 0,
  updated_at     timestamptz not null default now(),
  primary key (day, site_id, country, operator_id, src, placement)
);
create index daily_stats_site_day_idx on landings.daily_stats(site_id, day);

-- ───────────── Conversiones (idempotentes por operador + click_id + tipo [+ txn para depósitos]) ─────────────
create table landings.conversions (
  id           bigint generated always as identity primary key,
  operator_id  text not null references landings.operators(id),
  click_id     uuid not null,
  type         text not null check (type in ('registration','ftd','deposit')),
  txn_id       text not null default '',   -- solo depósitos: varios por click
  amount       numeric(14,2),
  currency     char(3),
  occurred_at  timestamptz not null default now(),
  received_at  timestamptz not null default now(),
  source       text not null check (source in ('postback','csv')),
  -- atribución copiada del outbound (null si el click_id no es nuestro o ya se purgó)
  site_id      text references landings.sites(id),
  country      char(2),
  offer_id     text,
  src          text not null default '',
  placement    text not null default '',
  raw          jsonb,
  unique (operator_id, click_id, type, txn_id),
  check (type = 'deposit' or txn_id = '')
);
create index conversions_site_time_idx on landings.conversions(site_id, occurred_at);

-- ───────────── Log de postbacks: todo lo que llega, válido o no ─────────────
create table landings.postback_log (
  id           bigint generated always as identity primary key,
  ts           timestamptz not null default now(),
  operator_id  text not null,
  method       text not null,
  query        jsonb,          -- con token/sig ya redactados
  body         text,
  source_ip    text,           -- IP del servidor del operador (S2S), no de un usuario
  valid        boolean not null,
  status       smallint not null,
  reason       text,
  click_id     text,
  result       text
);
create index postback_log_ts_idx on landings.postback_log(ts desc);

-- ───────────── Helpers ─────────────
create or replace function landings.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

create trigger offers_touch before update on landings.offers for each row execute function landings.touch_updated_at();
create trigger operators_touch before update on landings.operators for each row execute function landings.touch_updated_at();

-- Sitios del usuario actual según public.profiles.member_id → landings.site_members.
create or replace function landings.my_site_ids() returns setof text
language sql stable security definer set search_path = '' as $$
  select sm.site_id from landings.site_members sm where sm.member_id = public.my_member_id()
$$;
revoke all on function landings.my_site_ids() from public, anon;
grant execute on function landings.my_site_ids() to authenticated, service_role;

-- ───────────── Privilegios ─────────────
revoke all on schema landings from public, anon;
grant usage on schema landings to authenticated, service_role;
revoke all on all tables in schema landings from public, anon, authenticated;
grant all on all tables in schema landings to service_role;
grant usage, select on all sequences in schema landings to service_role;

grant select on landings.sites, landings.site_members, landings.operators, landings.offers,
               landings.daily_stats, landings.conversions, landings.events, landings.postback_log to authenticated;
grant update (rank, affiliate_url_template, bonus_headline, bonus_terms_short, terms_url, payout_speed,
              payment_methods, badges, member_rating, valid_from, valid_to, active, updated_by)
  on landings.offers to authenticated;
grant insert on landings.conversions to authenticated;
grant usage on sequence landings.conversions_id_seq to authenticated;
grant insert, delete on landings.site_members to authenticated;

-- ───────────── RLS: admin todo; miembro solo su site_id ─────────────
alter table landings.sites        enable row level security;
alter table landings.site_members enable row level security;
alter table landings.operators    enable row level security;
alter table landings.offers       enable row level security;
alter table landings.events       enable row level security;
alter table landings.daily_stats  enable row level security;
alter table landings.conversions  enable row level security;
alter table landings.postback_log enable row level security;

-- Una sola política SELECT por tabla (admin OR su sitio) y políticas de escritura solo admin.
create policy sites_read on landings.sites for select to authenticated
  using ((select public.is_admin()) or id in (select landings.my_site_ids()));

create policy site_members_read on landings.site_members for select to authenticated
  using ((select public.is_admin()) or member_id = (select public.my_member_id()));
create policy site_members_insert on landings.site_members for insert to authenticated with check ((select public.is_admin()));
create policy site_members_delete on landings.site_members for delete to authenticated using ((select public.is_admin()));

create policy operators_read on landings.operators for select to authenticated
  using ((select public.is_user()));

create policy offers_read on landings.offers for select to authenticated
  using ((select public.is_admin()) or site_id in (select landings.my_site_ids()));
create policy offers_update on landings.offers for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy events_read on landings.events for select to authenticated
  using ((select public.is_admin()) or site_id in (select landings.my_site_ids()));

create policy daily_stats_read on landings.daily_stats for select to authenticated
  using ((select public.is_admin()) or site_id in (select landings.my_site_ids()));

create policy conversions_read on landings.conversions for select to authenticated
  using ((select public.is_admin()) or site_id in (select landings.my_site_ids()));
create policy conversions_insert on landings.conversions for insert to authenticated
  with check ((select public.is_admin()));

create policy postback_log_read on landings.postback_log for select to authenticated
  using ((select public.is_admin()));
