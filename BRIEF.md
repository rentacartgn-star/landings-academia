# BRIEF — Landings de afiliación de la Academia Infa & Wina

> **Documento maestro del proyecto.** Lo lee primero la sesión principal (el orquestador) y después, en parte, cada subagente.
> Owner: Sergi (admin) · Fecha: 22-oct-2026 · Estado: **arranque**

---

## 0. Prompt de arranque (copiar y pegar en la sesión de Claude)

```
Lee BRIEF.md entero antes de tocar nada. Eres el ORQUESTADOR / Tech Lead de este proyecto.
1. Haz tú solo la FASE 0 (§12): scaffold del monorepo + contratos compartidos (§11). No lances agentes antes de que los contratos estén escritos y compilen.
2. Después lanza EN PARALELO, en un solo mensaje, los subagentes A1–A6 de §10 con el Agent tool. Cada uno recibe su ficha de §10 + las secciones del brief que su ficha indica + la ruta de los contratos.
3. Cada agente solo escribe en SUS carpetas (tabla de ownership de §10). Si necesita cambiar un contrato, te lo pide a ti; no lo toca.
4. Integra, pasa la Definition of Done (§13) y enséñame el resultado en el preview, con capturas en móvil.
Todo lo que en §4 aparece como PENDIENTE usa placeholders marcados `TODO(sergi)`. No te bloquees por ellos.
```

---

## 1. Misión

Cada uno de los **4 miembros de la academia** tiene **su propio dominio** (p. ej. `diamondpix.com` para Diamond). Ese enlace lo ponen en la bio de TikTok/Instagram, en Telegram y en los vídeos. Quien entra:

1. ve una landing **espectacular y de marca personal** del miembro,
2. **geolocalizada**: según su país se le recomienda el casino o los casinos que hayamos asignado a ese país (de 1 a 4, ordenados),
3. pulsa el CTA y sale al casino **con el enlace de afiliado de ese miembro y de ese país**,
4. y todo queda **trackeado**: visitas, clics por casino, país, origen, embudo y, cuando el programa lo permita, registros y FTD.

### KPIs que manda el proyecto
| KPI | Objetivo v1 |
|---|---|
| **CTR landing → casino** (clics salientes / visitantes únicos) | ≥ 35 % (referencia buena en tráfico de bio: 25–45 %) |
| LCP en 4G móvil (navegador in-app de IG/TikTok) | < 2,0 s |
| Peso inicial de la página (JS + CSS) | < 180 KB gz sin contar las imágenes del hero |
| Clics salientes sin registrar en el tracker | 0 (todo clic pasa por `/go`) |
| Países sin oferta configurada que acaban en página vacía | 0 (siempre hay fallback) |

---

## 2. Contexto (no hace falta preguntar esto)

- **Academia Infa & Wina.** Miembros: **Don Pool, Mapache, Diamond y Cronos**. Admins: Sergi y Adri. Lo que genera cada miembro se reparte 50 % miembro / 50 % academia (eso lo calcula el CRM; aquí no se toca).
- **CRM ya existente:** `../academia-crm` (Next.js + Supabase, proyecto Supabase `academia-infawina`, desplegado en Vercel en `academia-infawina.vercel.app`). Ya tiene roles admin / editor / miembro y estética liquid glass.
- **Los enlaces de afiliado** los gestionan **BA y Anuar** (subcontrata de TipsterPage): hay un enlace distinto por miembro y por país/operador. Nos los pasa Sergi.
- **El tráfico llega casi todo de la bio de TikTok/Instagram y de Telegram**, en móvil, dentro del **navegador in-app**. Diseñar para un iPhone de 390 px, con conexión regular y el pulgar como único puntero. El escritorio va en segundo lugar.
- **Mercados:** España (CPA de referencia 50–60 €) y LATAM (CPA de referencia ~25 €). España es el mercado más regulado.

---

## 3. Alcance

### v1 (este proyecto)
- 4 sitios (uno por miembro), con **identidad visual distinta** cada uno y una base técnica común.
- Geolocalización por país → set de ofertas (1–4 operadores) con su enlace por miembro.
- Redirect trackeado `/go/...`, eventos de página y panel de estadísticas.
- Páginas legales y de juego responsable por mercado.
- Admin para cambiar enlaces, orden y ofertas **sin redeploy**.

### Fuera de alcance v1
- SEO de contenidos (reviews largas, blog). Esto es tráfico directo de bio, no SEO.
- Captación de emails o leads.
- Pagos.
- Multi-idioma más allá de **es-ES** y **es-LATAM** (neutro con matices de MX). El inglés (EE. UU. con BetMGM) queda preparado como locale, pero sin copy.

---

## 4. Decisiones PENDIENTES (las rellena Sergi; mientras tanto, placeholders)

| # | Pregunta | Placeholder / recomendación |
|---|---|---|
| P1 | **Matriz país → operador(es) → orden.** Sergi dijo: España → Sportium; LATAM según país (México, Panamá, Ecuador) → Sportium y/o BetMGM; "América" → BetMGM. **Está por confirmar.** | Tabla `offers` con filas de ejemplo marcadas `TODO(sergi)`; ver §6.2 |
| P2 | Enlaces de afiliado reales por **miembro × país × operador** (de BA/Anuar) | URLs `https://example.com/TODO?subid={click_id}` |
| P3 | Dominio de cada miembro (`diamondpix.com` = Diamond; ¿y los otros 3?) | `donpool.local.test`, `mapache.local.test`, `diamond.local.test`, `cronos.local.test` en desarrollo |
| P4 | Número de casinos en el ranking (¿3 o 4?) | Lo decide el número de ofertas activas de cada país; el diseño aguanta de 1 a 4 |
| P5 | ¿Los programas de afiliación admiten **subid** y **postback S2S**? ¿Con qué parámetro? | Plantilla de URL con `{click_id}` configurable por operador; endpoint de postback listo |
| P6 | Logos oficiales, colores y textos de bono **aprobados por cada operador** | Logos en gris de placeholder; bono "Bono de bienvenida · TODO" |
| P7 | Foto y nombre artístico de cada miembro para el hero | Silueta placeholder |
| P8 | ¿El panel va **dentro de `academia-crm`** o es independiente? | **Recomendado: dentro de `academia-crm`**, sección `/landings`. Reutiliza login, roles y RLS (cada miembro ve solo lo suyo). Ver §7.5 |
| P9 | Validación legal del copy y de las condiciones en España (RD 958/2020) | Gate de compliance (§9). Publicar en ES solo con el OK de Sergi o de su asesor |

> **Nota sobre la incoherencia del encargo:** se habló de "4 dominios / 4 miembros" y también de "las 3 páginas". El sistema es **N sitios configurables** y se arranca con 4. Añadir o quitar un sitio es una fila de configuración, no código.

---

## 5. Arquitectura

### 5.1 Stack
- **Next.js 15 (App Router) + TypeScript + Tailwind v4**. Animación con **GSAP** (ScrollTrigger) y/o **Motion**. **Sin** Three.js en el camino crítico (como mucho un elemento 3D ligero, cargado de forma diferida y solo en escritorio o en móviles potentes).
- **Una sola app multi-tenant por host**: un deploy y 4 dominios. El `middleware.ts` lee `host` → `siteId` y la cabecera de país → `country`, y hace un *rewrite* interno a `/_s/[siteId]/[country]`.
  - Ventajas: un deploy, una base de código y caché de borde por combinación (sitio, país), con lo que cada página es estática y rapidísima.
  - Cada sitio tiene su **carpeta de tema** propia (`themes/<siteId>/`), así que la estética es realmente distinta y no un cambio de color.
- **Vercel** (ya se usa). ⚠️ **Hobby no permite uso comercial: hace falta el plan Pro.** Los 4 dominios se añaden al mismo proyecto.
- **Supabase**: el mismo proyecto `academia-infawina`, en un **schema nuevo `landings`** (no se mezcla con las tablas del CRM). La app de landings escribe **solo desde el servidor** con la service key; nunca hay key en el cliente.
- Configuración de ofertas: se lee de Supabase con caché (revalidación por tag al guardar en el admin) y hay un **fallback JSON** en el repo por si Supabase falla, para que la landing nunca se caiga.

### 5.2 Estructura de carpetas (monorepo pnpm)
```
landings-academia/
├─ BRIEF.md
├─ apps/web/                      # la app Next multi-tenant
│  ├─ middleware.ts               # host→site, geo→country, rewrite, cookie de país manual   [A1]
│  ├─ app/_s/[site]/[country]/    # página landing                                          [A1 monta, A2 pinta]
│  ├─ app/go/[offerId]/route.ts   # redirect trackeado                                      [A4]
│  ├─ app/api/e/route.ts          # ingesta de eventos (sendBeacon)                         [A4]
│  ├─ app/api/postback/[op]/      # postbacks S2S de los operadores                         [A4]
│  ├─ app/legal/...               # aviso legal, privacidad, cookies, juego responsable     [A5]
│  ├─ themes/<siteId>/            # tema completo por sitio (tokens, layout, motion)        [A2]
│  ├─ components/ui/              # componentes base (OfferCard, CTA, Ranking...)           [A2]
│  └─ content/<siteId>/<locale>.ts# todo el copy, sin texto hardcodeado en componentes      [A3]
├─ packages/contracts/            # tipos + zod: SiteConfig, Offer, Event, Theme             [A0]
├─ packages/config/               # sitios, fallback de ofertas, matriz de países            [A1 + TODO(sergi)]
├─ supabase/migrations/           # schema landings + RLS                                    [A4]
├─ compliance/                    # checklists por país, registro de revisiones del copy     [A5]
└─ qa/                            # Playwright, Lighthouse CI, comprobador de enlaces        [A6]
```

---

## 6. Geolocalización

### 6.1 Reglas
1. País = cabecera `x-vercel-ip-country` (en local, `?__country=MX`, que solo funciona en desarrollo o con un token de preview).
2. **Selector manual de país** visible en el footer y en el hero ("¿No estás en México? Cambiar"). Guarda una cookie `lp_country` que tiene prioridad sobre la IP: la gente con VPN o de viaje no puede quedarse atrapada.
3. **Nunca se muestra un operador en un país donde no tiene licencia o donde no hay enlace configurado.** Si el país no tiene ofertas, se muestra la variante **fallback** del sitio: la marca del miembro, el mensaje "Todavía no hay casas recomendadas en tu país", enlaces a sus redes y el selector de país. Nada de enlaces de otro mercado.
4. España siempre resuelve a ofertas con **licencia DGOJ**; México a operadores con permiso de SEGOB; Panamá, Ecuador, etc., según lo que valide A5.
5. Caché por (sitio, país): el rewrite incluye el país en la ruta, así que no hay que tocar `Vary` y no se sirve nunca la página de un país a otro.
6. El locale se deriva del país (`ES` → `es-ES`, LATAM → `es-419`, `US` → `en-US` preparado). Esto cambia moneda, ortografía de mercado ("apuestas deportivas" frente a "apuestas"), formatos y el texto legal.

### 6.2 Matriz inicial (TODO(sergi) — confirmar P1)
| País | Operadores (en orden) | Estado |
|---|---|---|
| ES | Sportium | confirmar enlace por miembro |
| MX | Sportium? / BetMGM? | **por confirmar** |
| PA | ? | **por confirmar** |
| EC | ? | **por confirmar** |
| US (estados donde opere) | BetMGM? | **por confirmar**; ojo, BetMGM va por estados |
| Resto | — | fallback |

Modelo: `offers(site_id, country, operator_id, rank, affiliate_url_template, bonus_headline, bonus_terms_short, terms_url, badges[], active, valid_from, valid_to)`. **Cada miembro tiene su enlace**, así que la clave es (sitio, país, operador).

---

## 7. Tracking y estadísticas

### 7.1 Principios
- **Todo clic saliente pasa por `/go/[offerId]`** en el servidor: registra el evento, genera `click_id` (uuid), sustituye `{click_id}` en la plantilla del enlace de afiliado y responde con **302**. El clic queda registrado aunque el JS no cargue.
- **Sin cookies de terceros ni píxeles de terceros en v1.** La analítica es propia y sin cookies: `visitor_hash = sha256(ip + user_agent + sal_diaria)`. La IP en bruto no se guarda nunca y la sal rota cada día (estilo Plausible). Así se cuentan únicos sin pedir consentimiento de cookies. **A5 lo confirma con la guía de la AEPD**; si se añade un píxel de Meta o TikTok en el futuro, irá detrás de un banner de consentimiento.
- Filtrar bots (UA conocidos y cabeceras de bot de Vercel) y **no contar previsualizaciones** de enlaces (Telegram, WhatsApp e iMessage hacen fetch del enlace al pegarlo).
- Guardar las **UTM** y una etiqueta `src` corta para que cada miembro sepa de dónde le vienen los clics: `diamondpix.com/?src=tt` (TikTok), `ig`, `tg`, `yt`, `vid123`...

### 7.2 Eventos
| Evento | Dónde se dispara | Datos clave |
|---|---|---|
| `pageview` | cliente (beacon) + respaldo en servidor | site, country, locale, src/utm, referrer, device, in_app (IG/TT/FB) |
| `offer_view` | cliente (IntersectionObserver ≥ 50 %) | offer_id, rank |
| `scroll_depth` | cliente (25/50/75/100) | — |
| `cta_click` | cliente, antes de navegar | offer_id, rank, placement (hero/ranking/sticky/final) |
| `outbound` | **servidor, en `/go`** | click_id, offer_id, operator, country, placement |
| `country_switch` | cliente | from, to |
| `conversion` | **postback S2S** o importación CSV | click_id, type (`registration`/`ftd`/`deposit`), amount, currency |

### 7.3 Tablas (schema `landings`)
`sites`, `operators`, `offers`, `events` (crudos, retención de 90 días), `daily_stats` (rollup por día × sitio × país × operador × src, mantenido con un cron de `pg_cron` o con una función programada), `conversions`, `postback_log` (todo lo que llega, válido o no, para depurar).

**RLS:** la app de landings usa service role solo en el servidor. En el panel: admin lo ve todo y un miembro ve solo las filas de **su** `site_id` (se enlaza con la tabla de miembros del CRM).

### 7.4 Postbacks
- `GET/POST /api/postback/[operator]?click_id=...&event=ftd&amount=...&sig=...` con **firma o token secreto por operador**; si no cuadra, 401 y se registra en `postback_log`.
- Idempotente por (operator, click_id, event).
- Si un programa no hace postback, el admin tiene **importación de CSV** del reporte del operador, que cruza por subid.

### 7.5 Panel (recomendado dentro de `academia-crm`, sección `/landings`)
- Tarjetas KPI: visitas, únicos, clics salientes, **CTR**, registros, FTD, conversión clic → FTD.
- Gráficas por día; desglose por **miembro, país, operador, src y placement**; embudo pageview → offer_view → cta_click → outbound → registro → FTD.
- Filtros de fechas (hoy, 7 d, 30 d, mes y rango libre) y exportar CSV.
- Admin de ofertas: editar enlace, bono, orden y activo/inactivo por (sitio, país). Al guardar, la caché de la landing se revalida en segundos.
- Botón "probar enlace": hace un dry-run de `/go` y muestra la URL final con el `click_id` sustituido.
- Estilo: el liquid glass del CRM.

---

## 8. Dirección creativa (dominio de A2)

### 8.1 Norte
**"Parece una app de Apple que te recomienda tu tipster, no una web de casino de 2012."** Premium, limpia, con profundidad y movimiento cuidado. Nada de banners parpadeantes, ruletas que giran, monedas cayendo ni rojo y amarillo chillón. El lujo se nota en la contención, la tipografía y el detalle.

### 8.2 Sistema común (lo que comparten los 4 sitios)
- **Tipografía:** Inter (Black 900 en titulares y cifras, 700/800 en labels, `tabular-nums` en las cifras). Se puede usar Nohemi si un tema lo pide. **Prohibidos** Bebas, Anton, Oswald y cualquier display condensado.
- **Liquid glass:** tarjetas `rgba(20,24,32,.78)` con `backdrop-filter: blur(20px) saturate(180%)`, radio 28–32 px, borde interno `1px rgba(255,255,255,.12)`, highlight superior blanco al 6 % y sombra `0 24px 60px rgba(0,0,0,.35)`. Botones pill (`999px`).
- **Motion:** pop-in tarjeta a tarjeta (`scale .92→1`, `opacity 0→1`, `y 20→0`, 0,5–0,7 s, `back.out(1.3)` o `expo.out`, stagger de 0,08–0,12 s). Nada de giros ni "slams". Respeta `prefers-reduced-motion`.
- **El CTA es el objeto más contrastado de la pantalla.** Un solo color de acción por sitio, con un brillo animado sutil (shine) cada ~4 s y nunca más de un CTA primario a la vista.
- Solo animaciones en GPU (`transform` y `opacity`). Nada de `backdrop-filter` encima de capas animadas grandes en Android de gama baja: hay que detectarlo y degradar.

### 8.3 Las 4 identidades (propuesta, A2 la refina y Sergi elige)
| Sitio | Concepto | Paleta | Firma visual |
|---|---|---|---|
| **Diamond** (`diamondpix.com`) | Joyería nocturna | negro obsidiana, blanco diamante, acento hielo `#9FE8FF`, CTA verde esmeralda | facetas de diamante con refracción en el hero (shader ligero o vídeo en loop), destellos que siguen al scroll |
| **Mapache** | Ladrón elegante / heist | grafito, ámbar `#FFB020`, CTA ámbar | antifaz como motivo gráfico, "el botín de la semana", luz de linterna que sigue al dedo |
| **Don Pool** | Club privado / billar de lujo | verde tapete profundo, latón, crema | textura de fieltro, bolas con reflejo 3D falso en CSS, tipografía con más aire |
| **Cronos** | Tiempo y precisión suiza | azul medianoche, plata, CTA cian | anillos de reloj que se llenan con el scroll (stroke-dashoffset), contador de precisión y cuadrícula técnica |

A2 entrega para cada sitio: moodboard (3–5 referencias reales de Awwwards, Apple, Linear, Revolut...), tokens, hero animado, la tarjeta de oferta en su versión y **capturas a 390 px** antes de pulir.

### 8.4 Layouts que deben existir
- **Single-offer** (país con 1 operador, como hoy España): hero gigante con una sola oferta, como página de producto de Apple.
- **Ranking 2–4:** el #1 destacado (más grande, con badge "Mi elección" o "La que uso yo") y el resto en tarjetas compactas.
- **Fallback** sin ofertas.
- **Sticky CTA inferior** en móvil que aparece cuando el CTA del hero sale de pantalla.

### 8.5 Presupuesto de rendimiento (innegociable, lo verifica A6)
- Imagen del hero en AVIF/WebP con `priority`, ≤ 120 KB a 390 px. Vídeo del hero ≤ 600 KB, `muted playsinline`, con póster.
- Fuentes autoalojadas, subset latino, `font-display: swap` y preload solo del peso del titular.
- Se carga en diferido todo lo que no esté en el primer viewport.

---

## 9. Copywriting (dominio de A3) y compliance (dominio de A5)

### 9.1 Estructura de la página (orden de persuasión)
1. **Barra de confianza** fina: `+18 · Juega con responsabilidad · [logo del regulador del país]`.
2. **Hero (marca personal):** foto o avatar del miembro + titular + la oferta #1 + CTA. La palanca principal es **la confianza en el creador**, no el bono. El que entra ya le sigue: el mensaje es "esta es la casa que uso yo", no "el mejor casino del mundo".
3. **Ranking / oferta(s)** con lo que de verdad decide: bono (titular corto y **condiciones clave visibles debajo**, no escondidas), velocidad de retirada, métodos de pago locales (Bizum en ES; OXXO, SPEI o Mercado Pago en MX, si aplican), licencia y valoración del miembro.
4. **"Cómo elijo las casas"**: 3–4 criterios concretos. Autoridad y transparencia.
5. **Registro en 3 pasos** con tiempo estimado ("2 minutos"). Reduce la fricción percibida.
6. **FAQ de objeciones**: ¿es legal en mi país?, ¿cuánto tardan en pagar?, ¿necesito verificar identidad?, ¿qué pasa con el bono si...?
7. **CTA final** + recordatorio de juego responsable.
8. **Footer legal** completo.

### 9.2 Técnicas que A3 debe usar (y documentar en qué sección usa cada una)
- **Voice of customer:** escribir con las palabras de la audiencia (frases de los comentarios del miembro en TikTok/IG; pedirlas a Sergi).
- **Especificidad > adjetivos:** "Retiradas en 24 h por Bizum" convence; "pagos rapidísimos" no.
- **Autoridad del creador + prueba social real:** seguidores, años analizando y el sello "Mi elección". Solo **datos reales**; los que falten se marcan `TODO(sergi)`, no se inventan.
- **Reducción de riesgo:** qué pasa si no le gusta, que no hay permanencia, que se puede cerrar la cuenta.
- **Microcopy de CTA en primera persona y con resultado:** "Quiero mi bono en Sportium" en vez de "Registrarse". A3 entrega **3 variantes A/B por sitio** del titular y del CTA.
- **Jerarquía de lectura en F y "una idea por pantalla"** en móvil.
- **Urgencia y escasez SOLO si son reales**, como la fecha real de fin de una promo que venga del campo `valid_to`. **Prohibidos los contadores falsos** (además de ser publicidad engañosa).
- Tono por sitio, alineado con la identidad de §8.3, y por mercado (es-ES frente a es-419).

### 9.3 Prohibido (compliance y además protege las cuentas de afiliado)
- Presentar el juego como forma de ganar dinero, salir de deudas o "ingresos". Nada de "dinero fácil", "gana seguro", "sin riesgo" ni "método infalible".
- Dirigirse a menores o usar estética infantil o de dibujos. Nada de presión social ("todos tus amigos ya juegan").
- Ocultar las condiciones del bono. Prometer bonos que el operador no ha aprobado.
- Mostrar operadores sin licencia en el país del visitante.
- Usar la marca del operador de forma no autorizada en sus programas (logos modificados, pujas de marca, etc.). **Cada operador suele exigir aprobar los creativos**, así que A5 deja la lista de lo que hay que mandarles.
- Palabras que penalizan el enlace en redes, para el texto que se comparte o se previsualiza (title y OG): evitar "quiniela", "pick", "lo tienes gratis" y "entra y pincha".

### 9.4 Gate de compliance (A5)
- **España:** Ley 13/2011 y **RD 958/2020** de comunicaciones comerciales del juego. El Tribunal Supremo anuló parte del RD en 2024: **A5 debe verificar qué artículos siguen vigentes** (bonos a nuevos clientes, aparición de personas con notoriedad pública como un tipster, mensajes obligatorios) y dejar un resumen con fuentes en `compliance/ES.md`. **No se publica en ES sin el OK explícito de Sergi o de su asesor legal (P9).**
- **México** (Ley Federal de Juegos y Sorteos / SEGOB), **Panamá** (Junta de Control de Juegos), **Ecuador** y el resto de países que entren: una ficha por país con licencias válidas, mensajes obligatorios, edad mínima y línea de ayuda.
- En todas las páginas: +18 (o la edad legal del país), enlace a juego responsable y teléfono o recurso de ayuda del país (en ES, jugarbien.es), la licencia del operador junto a su tarjeta y las condiciones del bono a un clic.
- A5 revisa **todo** el copy de A3 antes de integrarlo y deja constancia en `compliance/revisiones.md` (texto, fecha, OK o cambios).

---

## 10. Equipo de subagentes

> Cada agente es un **especialista de primer nivel**. Lo que se le pide es criterio, no rellenar. Los agentes trabajan en paralelo contra los **contratos de `packages/contracts`** y cada uno tiene sus carpetas. Si necesita algo de otro agente, lo pide al orquestador, no lo implementa por su cuenta.

### A0 — Orquestador / Tech Lead (la sesión principal)
- Fase 0: monorepo, contratos y CI de tipos. Lanza A1–A6. Resuelve conflictos, integra y pasa la DoD.
- Mantiene `STATUS.md` (qué está hecho, qué está bloqueado y qué `TODO(sergi)` quedan).

### A1 — Arquitecto de plataforma
**Persona:** ingeniero staff de Vercel/Next que ha montado plataformas multi-tenant edge con millones de visitas.
**Lee:** §3, §5, §6. **Escribe en:** `apps/web/middleware.ts`, `app/_s/**` (esqueleto y data loading), `packages/config/**`, `vercel.json` y la configuración de dominios.
**Entrega:** resolución host → sitio y país → ofertas con fallback, selector de país con cookie, override de país en desarrollo, caché por (sitio, país) con revalidación por tag, carga de ofertas Supabase + fallback JSON y `.env.example`. Documenta en `docs/DEPLOY.md` cómo añadir un dominio y un sitio nuevos.

### A2 — Director de Arte y Motion (EXCLUSIVO estética)
**Persona:** director de arte de un estudio con varios Awwwards Site of the Day y diseñador de interfaces con el nivel de detalle de Apple. Obsesionado con la tipografía, el espaciado, la luz y el movimiento con intención. No escribe copy ni lógica de negocio.
**Lee:** §1, §8 (entera) y §9.1 (solo la estructura). **Escribe en:** `apps/web/themes/**`, `components/ui/**`, `public/<siteId>/**`.
**Skills a usar:** `top-design`, `landing-page-design`, `color-palette`, `gsap-framer-scroll-animation`, `3d-web-experience` (solo para el hero, y con el presupuesto de §8.5) y `design-critique` sobre su propio trabajo.
**Entrega:** los 4 temas completos (tokens, hero, OfferCard, Ranking, SingleOffer, StickyCTA, Fallback, FAQ y footer) en sus variantes, más el moodboard de cada sitio. **Autocrítica obligatoria:** capturas a 390 px y 1440 px de cada sitio; si algo "parece plantilla", lo rehace antes de entregar. Puede abrir sub-subagentes, uno por sitio, en la fase de pulido, pero el sistema común lo cierra él antes.

### A3 — Copywriter de respuesta directa
**Persona:** copywriter senior de direct response especializado en afiliación de iGaming regulado, que ha escrito landings con CTR por encima del 40 % sin saltarse la normativa. Domina PAS, AIDA, los 4U y la voice of customer.
**Lee:** §1, §2, §8.3 (el tono de cada identidad) y §9 (entera). **Escribe en:** `apps/web/content/**`.
**Skills a usar:** `copywriting`, `marketing-psychology` y `humanizer` (para que no suene a IA).
**Entrega:** todo el copy por sitio y por locale (es-ES y es-419), con 3 variantes A/B de titular y CTA, microcopy (errores, fallback, selector de país), title y descripción OG sin palabras penalizadas, y una tabla "técnica → dónde se usa". **Datos que no tenga → `TODO(sergi)`, nunca inventados.**

### A4 — Ingeniero de tracking y datos
**Persona:** ingeniero de datos de growth que ha montado atribución de afiliados con postbacks S2S y analítica propia respetuosa con la privacidad.
**Lee:** §5.1, §6.2 y §7 (entera). **Escribe en:** `app/go/**`, `app/api/e/**`, `app/api/postback/**`, `supabase/migrations/**`, `lib/tracking/**` y, si se confirma P8, la sección `/landings` del CRM (en `../academia-crm`, **sin tocar nada fuera de esa sección** y con migraciones solo en el schema `landings`).
**Entrega:** schema + RLS (con pruebas por rol en una transacción con rollback), `/go` con 302 y registro, beacon de eventos, filtro de bots y previsualizaciones, rollup diario, endpoint de postback firmado e idempotente, importación de CSV, panel con KPIs y embudo, y admin de ofertas con revalidación.

### A5 — Compliance y juego responsable
**Persona:** abogado o técnico de compliance de iGaming con experiencia en DGOJ (España) y mercados LATAM, pragmático: busca la forma de que se pueda hacer bien.
**Lee:** §6, §7.1 y §9 (entera). **Escribe en:** `compliance/**` y `app/legal/**`.
**Entrega:** una ficha por país (con fuentes y fecha de consulta), páginas legales (aviso legal, privacidad, cookies y juego responsable) por mercado, el componente `<ResponsibleGamingBar country>` (lo pinta A2 y el contenido es de A5), la revisión firmada del copy de A3, la lista de creativos que hay que mandar a aprobar a cada operador y la validación del enfoque sin cookies (§7.1).

### A6 — QA y rendimiento
**Persona:** ingeniero de QA y rendimiento web, de los que lo rompen todo antes que el usuario.
**Lee:** §1 (KPIs), §6, §7.2, §8.5 y §13. **Escribe en:** `qa/**`.
**Entrega:** tests de Playwright (cada sitio × ES/MX/PA/EC/US/país sin oferta; selector de país; que `/go` registra y redirige con `click_id`; sticky CTA), emulación del navegador in-app de IG y TikTok (UA), Lighthouse CI con los umbrales de §1, un comprobador de enlaces de afiliado (status y destino final), una prueba de que la página de un país no se sirve nunca a otro (caché) y el informe `qa/REPORT.md` con capturas en móvil.

### Ownership — regla de oro
Un archivo tiene **un único dueño**. Los contratos son de A0. Si dos agentes necesitan el mismo archivo, A0 lo parte en dos.

---

## 11. Contratos compartidos (A0 los escribe en la Fase 0)

```ts
// packages/contracts/src/index.ts  (con zod para validar en runtime)
export type SiteId = 'donpool' | 'mapache' | 'diamond' | 'cronos';
export type Country = string;               // ISO-3166 alpha-2
export type Locale = 'es-ES' | 'es-419' | 'en-US';

export interface SiteConfig {
  id: SiteId; domains: string[]; memberName: string; handle: string;
  themeId: SiteId; avatarUrl: string; socials: { tiktok?: string; instagram?: string; telegram?: string };
}

export interface Operator { id: string; name: string; logoUrl: string; licenseByCountry: Record<Country, string> }

export interface Offer {
  id: string; siteId: SiteId; country: Country; operatorId: string; rank: number;
  affiliateUrlTemplate: string;             // contiene {click_id}
  bonusHeadline: string; bonusTermsShort: string; termsUrl: string;
  payoutSpeed?: string; paymentMethods?: string[]; badges?: string[];
  memberRating?: number; validFrom?: string; validTo?: string; active: boolean;
}

export interface LandingProps {              // lo que recibe la página: A1 lo produce, A2/A3 lo consumen
  site: SiteConfig; country: Country; locale: Locale;
  offers: Offer[];                          // 0..4 ya ordenadas; 0 → layout Fallback
  operators: Record<string, Operator>;
  content: SiteContent;                     // de A3
  compliance: ComplianceBlock;              // de A5
}

export type EventName = 'pageview' | 'offer_view' | 'scroll_depth' | 'cta_click' | 'outbound' | 'country_switch' | 'conversion';
```
Más `SiteContent` (todas las claves de texto), `ComplianceBlock` y `ThemeTokens`. A0 los define completos antes de lanzar a nadie.

---

## 12. Plan por fases

| Fase | Quién | Qué | Sale cuando |
|---|---|---|---|
| **0 · Cimientos** | A0 solo | monorepo, Next, Tailwind, contratos con zod, `STATUS.md`, preview server, fallback JSON con datos de ejemplo | `pnpm typecheck` en verde y la página de ejemplo renderiza sin estilos |
| **1 · Construcción en paralelo** | A1 · A2 · A3 · A4 · A5 (en paralelo, un único mensaje) | cada uno su ficha de §10 | cada agente entrega con su autocheck |
| **2 · Integración** | A0 | une todo y resuelve huecos de contrato. A5 pasa el gate del copy | los 4 sitios funcionan con geo y tracking en local |
| **3 · QA y pulido** | A6 + A2 (pulido visual) | tests, Lighthouse y una ronda de critique visual de cada sitio | DoD de §13 completa |
| **4 · Datos reales** | A0 + Sergi | se rellenan los `TODO(sergi)` (P1–P9), dominios en Vercel Pro, enlaces reales y prueba de postback | Sergi da el OK de publicación por mercado |

---

## 13. Definition of Done

- [ ] Los 4 sitios resuelven bien por dominio (en local por host de prueba) y cada uno tiene **identidad visual inconfundible**: con el logo tapado se distinguen.
- [ ] Geo: ES, MX, PA, EC, US y un país sin oferta muestran lo correcto. El selector de país funciona y persiste. No hay fuga de caché entre países.
- [ ] Los layouts single-offer, ranking 2–4 y fallback están implementados y probados.
- [ ] El 100 % de los CTA pasa por `/go`, se registra el `outbound` y el `click_id` llega a la URL final.
- [ ] El postback firmado crea `conversion` de forma idempotente y el CSV de importación funciona.
- [ ] El panel muestra los KPIs, el embudo y los desgloses. Un miembro solo ve lo suyo (RLS probado).
- [ ] Admin de ofertas: un cambio se ve en la landing en < 60 s y sin redeploy.
- [ ] Lighthouse móvil ≥ 90 en Performance y ≥ 95 en Accesibilidad y Best Practices. LCP < 2,0 s en 4G simulado.
- [ ] El copy ha pasado el gate de A5 y la barra de juego responsable y las páginas legales están en todos los mercados.
- [ ] No hay datos inventados: todo lo pendiente está marcado `TODO(sergi)` y listado en `STATUS.md`.
- [ ] `qa/REPORT.md` incluye capturas a 390 px de cada sitio × (ES, LATAM y fallback).

---

## 14. Reglas de trabajo y entorno de esta máquina

- **Secretos:** solo en `.env.local` o en las env vars de Vercel. Nunca en el repo, nunca en el cliente. La service key de Supabase solo se usa en el servidor.
- **Windows + Norton:** Norton intercepta TLS. Si fallan `npm`, `pnpm`, `curl` o la CLI de Vercel o Supabase por certificados, usar el bundle de CA local con `NODE_EXTRA_CA_CERTS` (ver `../certs`).
- **Comandos de Bash largos se truncan (> ~8 KB):** escribir los archivos grandes con la herramienta Write, no con heredocs.
- Dev server en `.claude/launch.json` con el nombre `"landings"` y el puerto **3150** (el CRM usa el 3140).
- Para Supabase: el schema `landings` se crea con migraciones versionadas en `supabase/migrations`. No tocar las tablas del CRM. RLS activada en todas las tablas.
- **Nada se publica en producción ni se apunta un dominio real sin el OK explícito de Sergi.**
- Al terminar cada fase, A0 actualiza `STATUS.md` y le enseña a Sergi capturas en móvil.
