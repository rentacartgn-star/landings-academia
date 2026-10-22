# QA y rendimiento: informe final A6

Fecha: 22-oct-2026. Build de producción limpio (`next build` + `next start`, Next 15.5.28) con los temas definitivos (rondas 2 y 3) y los arreglos de A0 (F1 una ruta por sitio, F3, F4, F6, F7). Catálogo: `fallback` (sin Supabase en local). Viewport: iPhone 13, 390×664 CSS px, UA de Safari iOS.

## Cómo se ejecuta

    # desde apps/web (el gate P9 se aplica en el BUILD: prerender)
    COMPLIANCE_APPROVED_MARKETS=ES,MX,PA,EC,US NEXT_DIST_DIR=.next-a6 npx next build
    PREVIEW_OVERRIDE_TOKEN=qa-a6-token COMPLIANCE_APPROVED_MARKETS=ES,MX,PA,EC,US NEXT_DIST_DIR=.next-a6 npx next start -p 3156
    # desde qa/
    npx playwright test                 # 97 tests, incluye capturas → screens/final/
    node lighthouse/run.mjs 3           # Lighthouse móvil, mediana de 3 → lighthouse/out/summary.json
    node scripts/check-links.mjs        # enlaces de afiliado → results/links.json
    # gate cerrado: build SIN COMPLIANCE_APPROVED_MARKETS en otro distDir y servidor en otro puerto, y luego
    QA_GATE=closed QA_BASE_URL=http://localhost:<puerto> npx playwright test tests/layouts.spec.ts tests/cache.spec.ts tests/country.spec.ts tests/go.spec.ts

Variables: `QA_BASE_URL`, `QA_TOKEN` (= `PREVIEW_OVERRIDE_TOKEN`), `QA_GATE=closed`, `QA_APPROVED`, `QA_WORKERS`.

## Resultados funcionales

| Suite | Archivo | Resultado |
|---|---|---|
| Layout × sitio × país (4 × ES/MX/PA/EC/US/FR) | `tests/layouts.spec.ts` | **24/24 OK** |
| Gate P9 cerrado (todo fallback; `/go` no sale al operador) | mismas specs con `QA_GATE=closed` | **38/38 OK** |
| Selector de país | `tests/country.spec.ts` | **8/8 OK** |
| Sticky CTA con scroll de dedo | `tests/sticky.spec.ts` | **8/8 OK** |
| CTA del hero visible sin scroll a 390×664 | `tests/sticky.spec.ts` | **8/8 OK** |
| Sticky tras salto de scroll | `tests/sticky.spec.ts` | **8/8 OK** |
| `/go`: 44 ofertas, bots, HEAD, 404 | `tests/go.spec.ts` | **OK** |
| Clic real en el CTA del hero y sin JavaScript | `tests/go.spec.ts` | **OK** |
| In-app Instagram y TikTok (iOS y Android) × 4 sitios | `tests/inapp.spec.ts` | **17/17 OK** |
| Fuga de caché (HTML y payload RSC) | `tests/cache.spec.ts` | **OK, ninguna fuga** |
| Blindaje de clave de caché y overrides | `tests/cache.spec.ts` | **OK** |
| Capturas | `tests/screens.spec.ts` | 12/12 (24 PNG) |
| Comprobador de enlaces | `scripts/check-links.mjs` | 44/44 `/go` → 302 con `click_id`; destino example.com no comprobable desde este entorno |
| Build ×3 (F5) | — | 3/3 OK (+1 sin gate). Histórico: 1 fallo en 7 |

**Total Playwright: 97/97 OK.**

## Lighthouse móvil (throttling simulado por defecto), mediana de 3

| Sitio | País | Perf | A11y | BP | LCP simulado | LCP devtools* | TBT | CLS | JS+CSS gz |
|---|---|---|---|---|---|---|---|---|---|
| diamond | ES | 98 | 100 | 100 | 2,38 s ✗ | 1,88–1,96 s | 39 ms | 0 | 132,8 KB |
| diamond | MX | 98 | 100 | 100 | 2,38 s ✗ | 1,95–2,08 s | 54 ms | 0 | 132,8 KB |
| donpool | ES | 97 | 100 | 100 | 2,57 s ✗ | 1,62–1,65 s | 48 ms | 0 | 123,5 KB |
| donpool | MX | 97 | 100 | 100 | 2,56 s ✗ | 1,76–1,77 s | 46 ms | 0 | 123,5 KB |
| kronos | ES | 96 | 100 | 100 | 2,62 s ✗ | 1,89 s | 74 ms | 0 | 132,7 KB |
| kronos | MX | 97 | 100 | 100 | 2,60 s ✗ | 1,99–2,13 s | 41 ms | 0 | 132,7 KB |
| mapache | ES | 97 | 100 | 100 | 2,53 s ✗ | 1,77–1,78 s | 55 ms | 0 | 132,4 KB |
| mapache | MX | 97 | 100 | 100 | 2,55 s ✗ | 1,75–1,97 s | 67 ms | 0 | 132,4 KB |

\* `--throttling-method=devtools` (4G y CPU ×4 aplicados de verdad), 2 ejecuciones.

En la traza real LCP = FCP (170–250 ms sin throttling). El simulador cuenta como dependencias del LCP el JS del framework (~100 KB gz) y el HTML con el payload RSC (15–29 KB gz). Palancas: HTML/RSC más ligero, CSS crítico inline, precargar el logo cuando es el LCP (kronos, donpool MX).

## Capturas a 390 px

`screens/final/<site>-<ES|MX|FR>-{inicial,completa}.png` (no se suben al repo; están en la carpeta del proyecto). ES = single, MX = ranking, FR = fallback.

## Fallos abiertos

| # | Prio | Dueño | Fallo | Arreglo |
|---|---|---|---|---|
| F1b | P2 | A1 + A2 | LCP simulado 2,38–2,62 s (> 2,0 s); con throttling real 1,62–2,13 s | HTML/RSC, CSS bloqueante, logo como LCP |
| F5 | P3 | A1 | Build intermitente `InvariantError: Expected workUnitAsyncStorage to have a store` (1 de 7) | Investigar `cookies()/headers()` bajo `force-static`; `staticGenerationRetryCount` |
| F10 | P3 | Sergi | Fallback sin redes (`socials: {}`); URLs de afiliado y `termsUrl` placeholder | `packages/config/src/sites.ts`, `offers.fallback.json` / panel |
| F12 | P3 | A2 | Diamond fallback: el diamante decorativo se monta sobre el titular a 390 px | `themes/diamond` |
| F11 | P3 | A0 | `next build` con `NEXT_DIST_DIR` reescribe `tsconfig.json` | limpiar antes del commit |

## Cerrados en esta pasada

F1 (CSS por tema), F2 (CTA en la primera pantalla), F3 (sticky tras salto), F4 (gate en `/go`), F6 (documentado), F7 (`lang`), F8 (contraste, A11y 100), F9 (placement `hero`).

## Riesgos y pendientes en Vercel

- `/` lleva `s-maxage=60, stale-while-revalidate` sin `Vary`: correcto en Vercel (la clave es la ruta reescrita); una CDN delante que cachee por URL serviría otro país.
- Comprobar en preview: que `x-vercel-cache` no reutiliza entradas entre países y que la segunda visita a FR da HIT; que `outbound` se escribe en Supabase.
