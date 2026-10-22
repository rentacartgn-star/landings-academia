# components/ui — primitivas headless (dueño: A0)

Comportamiento sin estética. Los temas (`themes/<siteId>/`) las envuelven y les dan estilo con `className` y atributos `data-*`.
Si necesitas cambiar una, pídelo al orquestador.

| Componente | Qué hace |
|---|---|
| `TrackedCta` | `<a>` a `/go/[offerId]?p=placement`. Dispara `cta_click` + `flush()` antes de navegar. **Todo CTA saliente debe ser esto.** |
| `OfferViewTracker` | Envuelve una tarjeta y dispara `offer_view` una vez al ≥ 50 % visible. |
| `StickyCta` | Muestra sus hijos (`data-visible="true"`) cuando el elemento `watchId` sale de pantalla. |
| `CountrySwitcher` | Botón + `<dialog>` con los países. Guarda la cookie `lp_country`, dispara `country_switch` y recarga. |
| `PageTracker` | `initTracking`, `pageview` y `scroll_depth` (25/50/75/100). Ponlo una vez por página. |
| `useReducedMotion` | Hook para respetar `prefers-reduced-motion`. |
