# Resto de países: fallback

> A5 · 22-oct-2026.

## Regla
Todo país sin ficha en `compliance/` (incluido `XX`, desconocido) recibe de `getCompliance()` un **bloque genérico prudente**:
- `minAge: 18` (si la edad legal del país es mayor, la ficha del país lo corregirá cuando exista);
- barra "+18 · Juega con responsabilidad"; mensajes "Publicidad", "Solo para mayores de edad" y "Juega con responsabilidad";
- línea de ayuda: nuestra página `/legal/juego-responsable` (sin número local inventado);
- **`publishable: false` siempre en producción, aunque el país esté en `COMPLIANCE_APPROVED_MARKETS`** (hace falta ficha revisada: `reviewed: true` en `lib/compliance/markets.ts`).

Resultado: layout **fallback** ("Todavía no hay casas recomendadas en tu país", redes del miembro y selector de país), **sin ningún enlace a operadores** (§6.1.3).

## Para dar de alta un país nuevo
1. Ficha `compliance/<CC>.md`: regulador, licencias válidas, edad, mensajes, línea de ayuda, reglas para influencers y afiliados, fuentes con fecha.
2. Entrada en `MARKETS` (`lib/compliance/markets.ts`) con `reviewed: true`.
3. OK de Sergi → añadir el código a `COMPLIANCE_APPROVED_MARKETS`.

## Países LATAM probables (sin investigar a fondo: no activar sin ficha)
- **Colombia:** regulador Coljuegos, mercado online regulado desde 2016.
- **Perú:** MINCETUR, ley de juegos a distancia y apuestas deportivas (2022–2023).
- **Argentina:** regulación **provincial** (cada provincia con su lotería), similar a EE. UU.
- **Chile:** regulación del juego online en tramitación o recién aprobada. **Verificar su estado en 2026.**

Estos datos son orientativos y **no** están verificados para esta entrega.
