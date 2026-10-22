# Analítica sin cookies (§7.1) frente a la AEPD y el RGPD

> A5 · 22-oct-2026. Fuentes: [Guía de cookies de la AEPD (actualizada en mayo de 2024)](https://www.aepd.es/guias/guia-cookies.pdf); [EDPB Guidelines 2/2023 sobre el alcance técnico del art. 5.3 de la Directiva ePrivacy, v2 del 7-oct-2024](https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf); LSSI art. 22.2; RGPD.

## Veredicto corto
| Elemento | ¿Requiere consentimiento? | Acción |
|---|---|---|
| `visitor_hash = sha256(ip + UA + sal_diaria)` en servidor, sin guardar la IP | **Riesgo bajo, pero no es "cero"** (ver §1). Se puede defender sin banner si se cumplen las condiciones | Seguir así. Informar en la política de privacidad (hecho), **respetar `Sec-GPC: 1`** (petición a A4) y documentar la ponderación del interés legítimo |
| Beacons de cliente (`/api/e`: offer_view, scroll, cta_click) | Igual que lo anterior | Igual, y que sean solo estadísticos, propios y agregados |
| Cookie **`lp_country`** (la escribe el selector manual, 1 año) | **No**: es una cookie de personalización de la interfaz **elegida por el usuario** (exenta) | Escribirla **solo** cuando el usuario elige país (es lo que hace hoy `CountrySwitcher`); nunca de forma automática por IP. Usarla solo para eso. Recomendado: bajar la duración a 6 meses |
| Cookie **`lp_v`** (variante A/B, HttpOnly, 90 días, se pone en la primera visita) | **Sí, en una lectura estricta.** No es estrictamente necesaria ni la pide el usuario: es de **análisis u optimización**, y la AEPD dice que esas **no están exentas** | **En ES (y en cualquier visitante de la UE): `AB_TEST_ENABLED=false` mientras no haya banner**, o asignar la variante sin cookie (ver §3) |
| `click_id` en el enlace al operador y postback de conversiones | No es una cookie (lo genera el servidor y no se lee del terminal). Es un **dato seudónimo** según el RGPD | Informado en privacidad (hecho). Plazo de conservación: TODO(sergi) |
| Píxeles de Meta o TikTok (futuro) | **Sí**, siempre | Banner de consentimiento previo con "Rechazar" igual de visible que "Aceptar" (guía AEPD) |

## 1. visitor_hash y beacons
- **LSSI art. 22.2** se aplica al "uso de dispositivos de almacenamiento y recuperación de datos en equipos terminales". La guía de la AEPD dice expresamente que también se aplica al **fingerprinting** (huella digital del dispositivo).
- Las **EDPB 2/2023** amplían el alcance: acceder a la IP (si viene del terminal) o usar las cabeceras HTTP o el user agent para **identificar o seguir** al usuario **puede** activar el art. 5.3 (párr. 43 y 55), y el JS que ordena al navegador enviar información (beacons) es "acceso" (párr. 33 y 51).
- **Lo que reduce el riesgo en nuestro diseño:**
  1. la sal **se rota y se destruye cada día**: no hay seguimiento entre días ni perfil;
  2. **no se guarda la IP** y no se comparte con terceros ni se cruza entre sitios;
  3. la finalidad es **estrictamente estadística y agregada** (únicos por día);
  4. es de **primera parte**.
  Son justo las condiciones con las que la AEPD (siguiendo el Dictamen 4/2012 del GT29) considera la analítica "**poco probable que represente un riesgo para la privacidad**": primera parte, datos agregados, fin estadístico, **información** sobre su uso y **posibilidad de negarse**. Ojo: la AEPD **no** dice que esté exenta, dice que el riesgo es bajo.
- **Conclusión pragmática:** el enfoque §7.1 es **defendible sin banner** y está en la línea de lo que hacen las analíticas "cookieless" (Plausible y similares), siempre que se cumplan dos condiciones que hoy faltan:
  1. **Opt-out real:** respetar `Sec-GPC: 1` (y opcionalmente `DNT: 1`) y no registrar eventos de ese visitante. **Petición a A4.** Ya lo anuncia la política de privacidad.
  2. **Información:** la política de privacidad lo explica (hecho) y el footer enlaza a ella.
- **RGPD:** el `visitor_hash` es un **dato personal seudónimo** mientras exista la sal del día. Base jurídica: **interés legítimo** (art. 6.1.f), con una ponderación documentada (TODO(sergi): guardar la LIA: el texto de §3 de la política de privacidad sirve de borrador). Al borrar la sal, el hash del día anterior pasa a ser **anónimo** en la práctica. La retención de 90 días de eventos en bruto es razonable. Contratos de encargo (DPA) con Vercel y Supabase: **TODO(sergi)**.
- **Recomendaciones técnicas para A4:** que la sal sea aleatoria (no derivada de la fecha), que viva solo en memoria o en un secreto rotado y se borre al día siguiente; truncar la IP antes de calcular el hash (/24 en IPv4, /48 en IPv6) refuerza el argumento; no guardar el UA completo junto al hash (sí la familia de dispositivo).

## 2. lp_country
Exenta: es la "personalización de la interfaz" **que elige el propio usuario** (guía de la AEPD, apartado de cookies de personalización: exentas si el usuario elige la característica y la cookie solo sirve para eso). Condiciones: que solo se escriba al elegir país en el selector y que no se use para publicidad ni para perfiles. Se cumple hoy.

## 3. lp_v (respuesta a la pregunta de A1)
- **¿Requiere consentimiento? Sí, en una lectura estricta de la LSSI y de la guía de la AEPD.** Es una cookie propia de análisis u optimización que se pone sin que el usuario lo pida. La AEPD no exime las cookies de análisis (solo las considera de bajo riesgo si se informa y **se puede rechazar**). Al ponerse en la primera visita y sin opción de rechazo, **no cumple**. El riesgo práctico de sanción es bajo, pero para un afiliado de juego (sector vigilado) no compensa.
- **Opciones, de menos a más trabajo:**
  1. **`AB_TEST_ENABLED=false` en producción** mientras ES sea el mercado principal. **Recomendada para lanzar.**
  2. **Variante sin cookie**: asignarla en el middleware con un hash de `visitor_hash` del día (o de IP truncada + UA + sal del test) % 3. No guarda nada en el terminal y tiene el mismo encaje legal que la analítica (§1). Inconveniente: la variante puede cambiar de un día a otro para el mismo usuario (aceptable para landings de una sola visita).
  3. **Banner mínimo** (aceptar o rechazar) solo para la UE, y `lp_v` solo tras aceptar. Penaliza la conversión: no lo recomiendo para v1.
- Fuera de la UE (MX, PA, EC) la LSSI no aplica, pero si el titular está en España el RGPD sí aplica al tratamiento. **Desactivar el A/B solo para ES** es una opción razonable si A1 lo permite por país. **Petición a A1:** `AB_TEST_ENABLED` por país, o la opción 2.

## 4. Lo que sí hay que tener
- Política de cookies (hecha: `/legal/cookies`) que liste `lp_country` y `lp_v` con su finalidad y duración.
- Política de privacidad (hecha: `/legal/privacidad`) con la analítica sin cookies, el `click_id`, los postbacks, los encargados, la retención y los derechos.
- Si se añade cualquier tercero (píxel, chat, YouTube embebido con cookies, Google Fonts remotas): **banner de consentimiento previo**. Nota: Inter va empaquetada con `@fontsource` (sin llamadas a Google), así que bien.
