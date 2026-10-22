# Reglas comunes para todos los agentes (las fija A0, el orquestador)

- Repo: `/home/claude/landings-academia` (monorepo pnpm). Lee `BRIEF.md` (las secciones que indica tu ficha) y `packages/contracts/src/index.ts`.
- **Sitios (siteId → marca):** `diamond` → Diamond Picks · `donpool` → DonPool Picks · `kronos` → **Kronos** (el brief dice "Cronos": el nombre correcto es Kronos) · `mapache` → Mapache Picks. En title/OG no uses "pick": usa el `shortName` (Diamond, DonPool, Kronos, Mapache).
- **Solo lectura para ti** (si necesitas un cambio, ponlo en tu informe final como "petición de contrato"): `packages/contracts/**`, `components/ui/**` (primitivas headless de A0: TrackedCta, OfferViewTracker, StickyCta, CountrySwitcher, PageTracker, useReducedMotion; ver su README), `themes/index.ts`, y las carpetas de los demás agentes.
- Escribe **solo** en tus carpetas. Un archivo, un dueño.
- Dependencias ya instaladas en `apps/web`: next 15.5, react 19.1, tailwind v4, zod, gsap, motion, @supabase/supabase-js, server-only, @fontsource-variable/inter. **No toques `package.json` ni el lockfile** salvo que tu ficha lo permita.
- Dev server propio para no pisar a nadie: desde `apps/web`, `NEXT_DIST_DIR=.next-<tuagente> npx next dev -p <tupuerto>` en segundo plano; mátalo al acabar. Sitio y país en local: `?__site=diamond&__country=MX`.
- Typecheck: `pnpm -C apps/web typecheck`. Los errores en archivos de otros agentes no son tuyos (están trabajando a la vez); los tuyos, a cero.
- **No hagas git commit** (lo hace A0). **No despliegues** a Vercel ni toques producción.
- Nunca inventes datos (enlaces, cifras, licencias, seguidores): márcalos `TODO(sergi)`.
- Comentarios de código en español, breves, como el código existente.
- Informe final (corto): qué has hecho, archivos, cómo probarlo, `TODO(sergi)` que dejas, peticiones de contrato.
