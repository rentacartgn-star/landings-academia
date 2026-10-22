# Copy de las landings (A3): técnicas, decisiones y TODO

Archivos: `content/<siteId>/es-ES.ts` y `es-419.ts` (4 sitios × 2 locales). Lo legal y factual que comparten
los 4 sitios (FAQ, pasos, selector de país, errores, disclaimer) está en `content/_shared/es-ES.ts` y
`content/_shared/es-419.ts`, para que A5 lo revise una vez y no diverja.

- **en-US:** sin copy en v1 (BRIEF §3). `getContent(site, 'en-US')` devuelve es-419 (`resolveLocale` en `content/index.ts`).
- **Verificación:** desde `apps/web`, `npx tsx content/verify.ts`. Hace `SiteContentSchema.parse` de las 8 combinaciones,
  busca palabras penalizadas en `meta.*` (pick/picks, quiniela, gratis, "entra y pincha"), las prohibidas de §9.3 en todo
  el copy, comprueba `{operator}` y primera persona en los CTA, `{country}` en `notInCountry`, que no haya variables
  desconocidas, guiones largos ni variantes A/B repetidas, y que en-US cae a es-419. Sale con código 1 si algo falla.
- **Revisión 1 de A5 aplicada:** sticky sin "bono" (R1-03, lo comprueba `verify.ts`), Diamond CTA 2 (R1-04), Mapache sin imaginario de robo (R1-05), eyebrow de Kronos "Mi método para elegir casa" (R1-06), `licenseLabel` genérico "Licencia" que el país puede sustituir con `compliance.operatorLicenseLabel` (R1-07).
- **Revisión 2 (logos reales, A0):** DonPool deja el billar y pasa a antihéroe futbolero: directo, irónico, se ríe de la letra pequeña y de las promesas, nunca de las normas. No hay superhéroes ni jerga juvenil. Toques de fútbol donde suman: Kronos (titular 1, "90 minutos") y Mapache ("Mis fichajes"). Diamond se queda como estaba. `verify.ts` veta en DonPool billar, mesa, club, socios y cantar la bola, y en todo el copy Deadpool, Marvel y superhéroe.
- **Variables que el tema debe pasar por `fill()`:** `{operator}` en `hero.ctaVariants`, `finalCta.cta`, `stickyCta.label`
  y `offerCard.ctaSecondary`; `{country}` en `countrySwitcher.notInCountry`. El resto no lleva variables.

## Ángulo común (y por qué)

El que entra ya sigue al miembro. No vendo "el mejor casino", vendo **"esta es la casa que uso yo"**, y el método del
miembro es **para elegir casas** (licencia, condiciones, retiradas, herramientas de control), nunca para ganar apuestas.
Así la autoridad del creador empuja el clic sin presentar el juego como forma de conseguir dinero. Los CTA finales se
dirigen a quien **ya apuesta** ("Si ya apuestas, que sea en..."), no incitan a empezar.

## Técnica → dónde se usa

| Técnica | Diamond (joyería nocturna) | Mapache (pícaro, a cara descubierta) | DonPool (antihéroe futbolero) | Kronos (precisión suiza) |
|---|---|---|---|---|
| **Autoridad del creador** ("la casa que uso yo") | `hero.headlineVariants[0]`, `hero.sub` ("la misma casa en la que tengo mi cuenta"), `ranking.myPickBadge` "Mi elección" | `hero.headlineVariants[0]` "Me he leído hasta la letra pequeña", badge "La que uso yo" | `headlineVariants[0]` "Sin cuentos: esta es la casa que uso yo", badge "La que uso yo" | `headlineVariants[0]` "Medido, no prometido", badge "Mi elección" |
| **Prueba social real** (solo datos reales) | `hero.trustLine` con `TODO(sergi)` seguidores y años | igual | igual | igual |
| **Especificidad > adjetivos** | `howIChoose` (requisitos de apuesta, plazo, cuota mínima, DGOJ, ordenacionjuego.es) | `howIChoose` "La letra pequeña, leída" | `howIChoose` "Condiciones cantadas" | `howIChoose` numerado 01–04, "plazo en días", "con números" |
| **PAS** (problema: letra pequeña y casas dudosas; agitación; solución: mi selección) | `headlineVariants[2]` "Sin brillo falso", criterio 2 "hace falta lupa" | `headlineVariants[1]` "La letra pequeña ya la he leído yo", criterio 2 "si un bono tiene trampa" | `headlineVariants[1]` "Aquí nadie te promete nada", criterio 2 "la pega suele estar en la página tres" | `headlineVariants[1]` "Un partido dura 90 minutos. Comparar casas, ni uno" |
| **AIDA** (orden de página) | Atención: eyebrow + titular · Interés: `hero.sub` + oferta · Deseo: `howIChoose` + `steps` · Acción: `finalCta` | igual | igual | igual |
| **4U** en titulares (útil, único, específico, urgente solo si es real) | Útil y único en `headlineVariants`; nada de urgencia inventada | igual | igual | `headlineVariants[2]` "4 criterios, una casa" (específico) |
| **Microcopy de CTA en 1.ª persona con resultado** | `ctaVariants`: "Quiero mi bono en / mi cuenta en / ver la oferta de {operator}" | "Quiero mi bono en / entrar en / mi cuenta en {operator}" | "Quiero mi bono en / mi cuenta en / sentarme en {operator}" | "Quiero mi bono en / mi cuenta en / ir directo a {operator}" |
| **A/B (la 0 es control)** | titular 0 = autoridad directa · 1 = exclusividad del filtro · 2 = transparencia (PAS) | 0 = autoridad · 1 = PAS letra pequeña · 2 = legalidad con guiño ("a cara descubierta") | 0 = autoridad sin cuentos · 1 = ironía anti-promesas (PAS) · 2 = metáfora "fuera de juego" para las casas sin licencia | 0 = autoridad + dato · 1 = ahorro de tiempo con guiño futbolero (90 minutos) · 2 = método numérico |
| **Reducción de riesgo** | FAQ `exit` (sin permanencia, cerrar cuenta), FAQ `bonus` (se puede jugar sin bono), paso 3 | igual | igual + `hero.sub` "la decisión es tuya" | igual |
| **Transparencia como persuasión** | FAQ de comisión "Sí, y prefiero que lo sepas", `footer.disclaimer` de afiliación, paso 1 "el enlace es mío" | "Sí, y aquí no se esconde nada" | "Sí, y te lo digo a la cara" (es-419: "de frente") | "Sí, y forma parte de los datos que debes tener" |
| **Reducción de fricción** | `steps` con `estimate` "Unos 3 minutos" y qué documento tener a mano | `steps.title` "El plan: 3 pasos" | "Tu cuenta en 3 pasos, sin rollos" | igual que Diamond |
| **Manejo de objeciones** | `faq`: legalidad, plazo de retirada, verificación, bono, salida, comisión, límites (es-419 añade métodos de pago) | igual | igual | igual |
| **Urgencia solo real** | Solo `offerCard.validUntilLabel` + `validTo` de la oferta. Sin contadores ni "últimas plazas" | igual | igual | igual |
| **Juego responsable integrado (no pegote)** | criterio 4 "Control en tu mano", `finalCta.sub` con límite | criterio 4 "Frenos a mano" ("no entra en mi lista") | criterio 4 "Tu ritmo, tus límites" | criterio 4 "Control del tiempo" |
| **Una idea por pantalla / lectura en F** | Titulares de ≤ 12 palabras; cada bloque abre con una frase corta que se entiende sola | igual | frases cortas y secas, remate irónico al final | criterios numerados para escanear |
| **Tono de identidad** | lupa, filtro, brillo falso, "pocas pasan" | fichar y "Mis fichajes" (guiño futbolero), letra pequeña, "con licencia o nada", frenos, a cara descubierta (sin imaginario de robo, R1-05) | sin cuentos, alineación, banquillo (419: banca), fuera de juego (419: fuera de lugar), sin VAR, pitido inicial (419: pitazo), "no te fíes ni de mí"; 419 añade "cero choro" | medido, cronometrado, método, 01–04, tu tiempo |
| **Voice of customer** | Pendiente: `TODO(sergi)` frases reales de comentarios (ver abajo). Hoy solo en los títulos de FAQ ("Lo que me preguntáis...") | igual | igual | igual |

### es-ES frente a es-419
- **es-ES:** tú / vosotros ("Lo que me preguntáis"), "apuestas deportivas", "retirada", "cuota", DGOJ, ordenacionjuego.es, DNI o NIE, RGIAJ, jugarbien.es, "+18".
- **es-419:** tú / ustedes ("Lo que me preguntan"), "retiro", "momio" (MX), "checar", "toca el botón", SEGOB, INE o pasaporte, "mayores de edad según la ley de tu país" (la edad y la línea de ayuda salen del bloque de compliance del país).

## Para A5 (compliance): puntos que conviene mirar primero
1. **Bono en el CTA de control** ("Quiero mi bono en {operator}") también en es-ES. Si tras la STS de 2024 sigue restringida la publicidad de bonos a nuevos clientes en España, cambiar la variante 0 de es-ES por "Quiero mi cuenta en {operator}" (ya existe como variante 1).
2. **Persona con notoriedad pública** (el miembro recomendando su casa) en España: depende de lo que siga vigente del RD 958/2020.
3. **Mapache:** tras R1-05 ya no hay botín, cerraduras, terreno ni puertas traseras; queda "fichar" y "a cara descubierta". `verify.ts` bloquea esas palabras.
4. **"Si ya apuestas..."** en `finalCta.title`: pensado para no incitar a empezar a jugar.
5. Los textos legales (FAQ legal, verificación, límites, disclaimer) están en `_shared/` y se revisan una sola vez.

## Lista de TODO(sergi)

| # | Dato | Dónde aparece |
|---|---|---|
| 1 | Seguidores reales de cada miembro (TikTok/IG/Telegram) | `hero.trustLine` (8 archivos) |
| 2 | Años reales analizando partidos de cada miembro (o quitar el dato) | `hero.trustLine` (8 archivos) |
| 3 | Plazo real de retirada comprobado por cada miembro en cada operador y país | `howIChoose.criteria[2]` (8 archivos) y FAQ `payout` en `_shared/` |
| 4 | Métodos de pago por operador en México (OXXO, SPEI, Mercado Pago) y, en España, si aplica Bizum (van en `paymentMethods` de la oferta, no en el copy) | FAQ `payments` en `_shared/es-419.ts` |
| 5 | Confirmar que cada miembro **tiene cuenta y usa** la casa #1 de cada país ("la casa que uso yo" tiene que ser verdad) y que prueba las retiradas (Kronos dice "comprobado con mi cuenta") | `hero.headlineVariants`, `hero.sub`, badges |
| 6 | Confirmar que todas las casas del ranking cumplen los 4 criterios de "Cómo elijo las casas" | `howIChoose`, `ranking.sub` (Kronos) |
| 7 | Cronometrar un registro real para confirmar "Unos 3 minutos" | `STEPS_*_ESTIMATE` en `_shared/` |
| 8 | Bonos: titular y condiciones de cada oferta, aprobados por el operador (vienen de la oferta, no del copy) | `offers.fallback.json` / Supabase |
| 9 | **Voice of customer:** pasar 10–20 frases reales y literales de comentarios de TikTok/IG de **cada miembro** (Diamond, DonPool, Kronos, Mapache): dudas antes de registrarse, quejas de otras casas, cómo llaman a las cosas ("la casa", "el bono", "retirar", "momio"/"cuota"). Con ellas reescribo FAQ, titulares B/C y `hero.sub` con sus palabras | todo el copy |
| 10 | Nombre de mercado del miembro: "Kronos" (no "Cronos") confirmado por A0; confirmar que "Don Pool" se escribe separado en el copy y "DonPool" en la marca | `memberName` en `packages/config` |
