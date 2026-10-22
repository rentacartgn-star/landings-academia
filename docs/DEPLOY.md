# Despliegue y operación (dueño: A1)

Una sola app Next (`apps/web`) sirve los 4 sitios. Un deploy, N dominios, una entrada de caché por combinación.

> ⚠️ **Hace falta Vercel Pro.** El plan Hobby prohíbe el uso comercial (y esto es afiliación). Pro además da
> soporte, más invocaciones y protección de los deploys de preview. Nada se apunta a un dominio real sin el OK de Sergi.

---

## 1. Cómo funciona una visita

```
GET https://diamondpix.com/?src=tt
  └─ middleware (edge, solo en "/" y "/_s/**")
       sitio   = host → packages/config/src/sites.ts            (override ?__site= en dev o con token)
       país    = cookie lp_country > ?__country= (dev/token) > x-vercel-ip-country > XX
       detect. = ?__country= (dev/token) > x-vercel-ip-country > XX   ← "país por IP"
       variante= ?__v= (dev/token) > cookie lp_v > aleatoria 0–2 (se escribe lp_v, 90 días)
       rewrite → /_s/diamond/MX/1/MX     (la query no entra en la clave; la lee el cliente)
  └─ página ISR app/%5Fs/[site]/[country]/[variant]/[detected]   (estática en el borde, revalidate 60 s)
       getLandingProps → catálogo (Supabase con caché por tag) → reglas §6.1.3 → tema del sitio
```

- `/go`, `/api`, `/legal`, `/panel`, `/_next` y los estáticos **no pasan por el middleware** (matcher solo en `/` y `/_s`).
- Cualquier otra ruta que no exista → 404 (`app/not-found.tsx`). Solo `/` es la landing.
- **`/_s/...` desde fuera → 404** (también `/%5Fs/...`). El middleware no se reejecuta sobre su propio rewrite,
  así que todo `/_s` que ve viene de fuera.
- Cabecera de diagnóstico `x-lp-route` (qué entrada de caché se ha servido): solo en dev o con `?__token=`.

### Clave de caché: `(sitio, país, variante, detectado)`

| Segmento | Valores | Por qué |
|---|---|---|
| `site` | 4 | un tema y un copy por sitio |
| `country` | ISO-3166 válido o `XX` | ofertas, locale y compliance. Códigos inventados → `XX` (no crean páginas) |
| `variant` | 0, 1, 2 | `LandingProps.variant` (titular y CTA) sin romper la caché estática |
| `detected` | = `country`, o uno de los países del selector (`COUNTRY_NAMES`), o `XX` | ver abajo |

**Decisión sobre `detectedCountry`.** El tema necesita saber si el país mostrado viene de la cookie y no coincide con
la IP ("¿No estás en México? Cambiar"). Va en la ruta, pero **acotado**: si coincide con el país mostrado no añade nada
(el 99 % del tráfico: sin cookie, `detected = country`); si no coincide, solo distinguimos los ~20 países con nombre
en el selector y el resto se agrupa en `XX`. Coste: la caché solo se multiplica para quien ha usado el selector y
nunca pasa de ×21. Alternativa descartada: leerlo en el cliente (un render extra y salto visual en el hero).
La página valida la combinación y devuelve 404 a las que el middleware nunca genera (nadie puede inflar la caché a mano).

**Variante A/B.** Cookie `lp_v` (`HttpOnly`, `SameSite=Lax`, `Secure` en prod, 90 días), asignada en el edge en la
primera visita. Bots y previsualizadores de enlaces reciben la 0 sin cookie. `AB_TEST_ENABLED=false` → todos a la 0 y
sin cookie (interruptor por si A5/AEPD exige consentimiento para cookies de A/B).

**Sin fugas entre países.** El país está en la ruta reescrita, que es la clave de la caché ISR: no hay que tocar
`Vary` y la página de un país no se sirve nunca a otro. Requisito: **no poner otra CDN delante de Vercel** que cachee
`/` por URL (la respuesta lleva `s-maxage`).

### Prerender y revalidación

- En build se prerenderizan ~600 páginas (sitios × variantes × países del selector + cruces cookie/IP de ES, MX, PA,
  EC, US y XX). Tarda segundos. El resto se genera al primer visitante y queda cacheado (ISR, `dynamicParams`).
- Catálogo: `fetchCatalogFromDb()` (A4) dentro de `unstable_cache` con tag `OFFERS_CACHE_TAG` (`landings-offers`)
  y `revalidate: 60`. Al guardar en el admin, **`revalidateTag('landings-offers')` en esta app** invalida catálogo y
  páginas en segundos; si no llega, a los 60 s se regenera igualmente.
- **La landing nunca se cae**: si la BD devuelve `null`, lanza, tarda > 2,5 s o trae filas que no cumplen el contrato,
  se usa `FALLBACK_CATALOG` (`packages/config/src/offers.fallback.json`), o solo las filas válidas. Si una
  revalidación falla, Next sigue sirviendo la última versión buena. `<meta name="lp-catalog" content="db|fallback">`
  dice de dónde salieron los datos.
- Reglas de ofertas (§6.1.3, `lib/landing/offers.ts`): activa, en fecha, del sitio y país, operador con licencia en
  ese país, sin operador repetido, ordenadas por `rank`, máx. 4. Si `compliance.publishable` es false → 0 ofertas.
- `page.tsx` lleva `dynamic = 'force-static'`: aunque un componente llame a `cookies()`/`headers()`, la página no
  se vuelve dinámica (esas llamadas devuelven vacío). Lo que dependa del visitante va en el cliente.

**Limitación conocida (solo self-hosting).** Con `next start`, Next 15.5 no cachea las rutas *no prerenderizadas* que
llegan por rewrite del middleware (las sirve dinámicas, `no-store`; correcto pero sin caché). En Vercel el ISR lo
gestiona su router y sí se cachean. Las prerenderizadas dan `HIT` en ambos casos. QA: comprobar en un preview de
Vercel que la segunda visita a un país raro (p. ej. `?__country=FR&__token=…`) devuelve `x-vercel-cache: HIT`.

---

## 2. Proyecto en Vercel (una vez)

1. **New Project** → importar el repo. **Root Directory: `apps/web`** (dejar activado "Include files outside the root
   directory", hace falta para `packages/*`). Framework: Next.js. Install/Build: los detecta (pnpm workspace).
   No hace falta `vercel.json`: la config vive en `next.config.ts` y en el código.
2. **Plan Pro** en el equipo.
3. **Environment Variables** (ver `.env.example`):
   - Production: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_*`, `VISITOR_HASH_SECRET`,
     `COMPLIANCE_APPROVED_MARKETS`. **No** pongas `PREVIEW_OVERRIDE_TOKEN` en Production.
   - Preview: lo mismo + `PREVIEW_OVERRIDE_TOKEN` (cadena larga aleatoria).
4. Deploys de preview: llevan `x-robots-tag: noindex` automáticamente. En `*.vercel.app` el host no es de ningún
   sitio → sale `diamond` (DEFAULT_SITE); usa `?__site=…&__token=…`.

## 3. Añadir un dominio a un sitio existente

1. `packages/config/src/sites.ts` → añade el host a `domains` del sitio (con y sin `www.` si se usan ambos). El
   primero que no sea `*.local.test` es el **canónico** (`og:url`, `metadataBase`).
2. Vercel → Project → Settings → **Domains** → *Add* el dominio (y `www.`; marca uno como redirect al otro).
3. DNS en el registrador: apex `A 76.76.21.21`; `www` `CNAME cname.vercel-dns.com` (o delega los NS a Vercel).
   Vercel emite el certificado solo.
4. Deploy. Comprobar: `curl -sI https://dominio/` → 200 y el `<title>` del sitio correcto.
5. En local, para probar por host: añade `127.0.0.1 <id>.local.test` a `/etc/hosts` y abre
   `http://<id>.local.test:3150/`, o `curl -H 'host: <id>.local.test' localhost:3150/`.

## 4. Añadir un sitio nuevo (un miembro nuevo)

Un sitio = **una entrada de config + un tema + su copy** (+ sus ofertas). Pasos:

1. **Contrato (A0):** añadir el id a `SITE_IDS` en `packages/contracts/src/index.ts`.
2. **Config (A1):** una entrada en `SITES` de `packages/config/src/sites.ts` (`id`, `domains`, `brandName`,
   `shortName` sin "pick" para title/OG, `memberName`, `handle`, `themeId`, `avatarUrl`, `socials`).
3. **Tema (A2):** `apps/web/themes/<id>/index.tsx` exportando un `ThemeModule` y registrarlo en `themes/index.ts`.
   Para arrancar puede reutilizar otro tema (`themeId` de otro sitio) hasta tener el suyo.
4. **Copy (A3):** `apps/web/content/<id>/es-ES.ts` y `es-419.ts` (y registrarlo en `content/index.ts`).
5. **Ofertas:** filas en `landings.offers` (admin) con `site_id = <id>`; opcionalmente también en
   `offers.fallback.json` para que el sitio tenga ofertas aunque Supabase caiga.
6. Dominio: sección 3. El build prerenderiza el sitio nuevo automáticamente (`generateStaticParams` usa `SITE_IDS`).

## 5. Probar en local

```bash
cd apps/web
NEXT_DIST_DIR=.next-a1 npx next dev -p 3151
curl -s -D- -o /dev/null -H 'x-vercel-ip-country: MX' -H 'host: kronos.local.test' localhost:3151/ | grep x-lp-route
#   x-lp-route: /_s/kronos/MX/<v>/MX
open 'http://localhost:3151/?__site=mapache&__country=EC&__v=2'
# Cookie manual de país (gana a la IP y al override):
curl -s -D- -o /dev/null -b 'lp_country=ES' -H 'x-vercel-ip-country: MX' localhost:3151/ | grep x-lp-route
#   x-lp-route: /_s/diamond/ES/<v>/MX
curl -s -o /dev/null -w '%{http_code}\n' localhost:3151/_s/diamond/MX/0/MX   # 404
```

Para ver la caché real: `NEXT_DIST_DIR=.next-a1-prod npx next build && NEXT_DIST_DIR=.next-a1-prod npx next start -p 3151`
y mira `x-nextjs-cache: HIT`. Ojo: en build `NODE_ENV=production`, así que el gate P9 de A5 aplica (sin
`COMPLIANCE_APPROVED_MARKETS` todos los mercados salen en fallback).

## Cambiar mercados aprobados (gate P9)
`COMPLIANCE_APPROVED_MARKETS` se lee al renderizar, pero las páginas son estáticas (ISR 60 s): tras cambiar la variable en Vercel **haz Redeploy** para que el cambio sea inmediato; si no, cada (sitio, país) tarda hasta 60 s + una visita en actualizarse. `/go` sí aplica el gate en cada clic.

## Rutas por sitio
Cada sitio tiene su ruta `app/%5Fs/<siteId>/[country]/[variant]/[detected]/page.tsx` (importa su tema estático, para no cargar el CSS de los demás). Un sitio nuevo = entrada en `packages/config/src/sites.ts` + `themes/<id>/` + `content/<id>/` + copiar una de esas rutas.
