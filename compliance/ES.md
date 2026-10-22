# España (ES): ficha de compliance

> A5 · fecha de consulta de todas las fuentes: **22-oct-2026**. Esto es un análisis técnico de compliance, **no un dictamen jurídico**. Gate P9: **no se publica en ES sin el OK explícito de Sergi o de su asesor legal** (`COMPLIANCE_APPROVED_MARKETS` debe incluir `ES`).

## 1. Marco normativo vigente

| Norma | Qué regula | Estado a 22-oct-2026 |
|---|---|---|
| **Ley 13/2011**, de regulación del juego ([BOE-A-2011-9280](https://www.boe.es/buscar/act.php?id=BOE-A-2011-9280)) | Art. 7: publicidad solo de operadores con título habilitante. **Art. 7.3: quien difunda publicidad de juego (redes, agencias, medios y servicios de la sociedad de la información, o sea, también un afiliado) tiene que comprobar que el anunciante tiene título y, si no lo tiene, abstenerse.** Art. 6.2.a: menores no pueden jugar. Régimen sancionador (arts. 39 y ss.). | En vigor. **Reforma en marcha** (ver §6) |
| **RD 958/2020**, de comunicaciones comerciales de las actividades de juego ([BOE-A-2020-13495](https://www.boe.es/buscar/act.php?id=BOE-A-2020-13495), consolidado a 08-06-2024) | Desarrolla el art. 7. Art. 2 incluye expresamente a los **afiliados** y a quienes participan en la difusión. | En vigor, **salvo lo anulado por el Supremo** |
| **STS de 2-abr-2024** (Sala 3.ª, rec. 1/3/2021, recurrente: Asociación Española de Juego Digital, JDigital; fallo en [BOE-A-2024-10500](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-10500), BOE de 25-05-2024). STS 527/2024, en CENDOJ ([poderjudicial.es](https://www.poderjudicial.es/search/indexAN.jsp)) | Anula los **arts. 13.1, 13.3, 15, 23.1, 25.3, 26.2 y 26.3** | Firme |
| **STS de 19-abr-2024** (rec. 1/1/2021, recurrente: LaLiga; [BOE-A-2024-11619](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-11619)) | Anula de nuevo los **arts. 13.1 y 13.3** | Firme |
| **STS de 4-abr-2024** ([BOE-A-2024-10949](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-10949), citada en el consolidado) | Anula el **art. 23.1** | Firme |
| Ley 13/2022, General de Comunicación Audiovisual, y **RD 444/2024** (usuarios de especial relevancia o "influencers") | Obligaciones de los influencers con **≥ 300.000 € de ingresos y ≥ 1 M seguidores** en una plataforma (o 2 M en total) y ≥ 24 vídeos al año (fuente: [nota de ECIJA](https://files.griddo.ecija.com/ecija-nota-influencers.pdf)) | En vigor. **TODO(sergi): ¿algún miembro supera los umbrales?** Si es así, además tiene que inscribirse en el registro estatal |

**Motivo de la anulación (resumen):** las restricciones anuladas limitaban la libertad de empresa y la publicidad con un alcance que exige **rango de ley**, y un real decreto no basta. No se declaró que el contenido fuera inconstitucional en sí. Por eso el Gobierno está intentando llevarlas a la Ley 13/2011 (ver §6).

## 2. Qué se anuló y qué sigue vigente (lo que nos afecta)

| Artículo RD 958/2020 | Contenido | Estado | Consecuencia para la landing |
|---|---|---|---|
| 13.1 | Prohibía las promociones de **captación de clientes nuevos** (solo se permitían a clientes con más de 30 días y verificados) | **ANULADO** | **Se pueden anunciar bonos de bienvenida para clientes nuevos** |
| 13.3 | Limitaba dónde se comunicaban las promociones | **ANULADO** | — |
| **13.2** | Prohíbe promociones dirigidas a autoexcluidos, autoprohibidos o jugadores de riesgo | **VIGENTE** | Nada de segmentar hacia "recupera lo perdido" ni similares |
| **13.4** | Las promociones **no pueden** dar la impresión de ser gratuitas; **no pueden incluir testimonios de beneficiarios previos, reales o ficticios**; no pueden basarse en la habilidad del jugador; **tienen que informar del depósito mínimo, la cantidad que hay que jugar, el plazo para liberar el bono y si el dinero es retirable o solo apostable**. Si no cabe, hay que avisar de que hay condiciones y enlazarlas | **VIGENTE** | Ver §4 |
| 15 | Prohibía que aparecieran **personas o personajes de notoriedad pública** (reales o ficticios) | **ANULADO** | La prohibición general de famosos ya no existe… |
| **27** | **Pronosticadores de apuestas (tipsters):** 27.1, el operador solo puede firmar **acuerdos publicitarios** con tipsters que se comprometan a **publicar todos sus resultados de apuestas en la plataforma del operador**; 27.2, **no** puede firmarlos con personas que hayan ganado notoriedad por **actividades distintas** a pronosticar; 27.3, si incumple, se resuelve el contrato y no puede firmar otro durante 3 años | **VIGENTE** (no anulado) | …pero **el art. 27 sí aplica al tipster** (ver §3) |
| 23.1 | Limitaba la publicidad online a webs y apps del operador y a secciones de apuestas | **ANULADO** | Una landing de afiliado es posible |
| **23.2** | Las comunicaciones online deben llevar un **identificador para controles parentales** | **VIGENTE** | `<meta name="rating" content="adult">` (ya puesto en /legal; **petición a A1** para la landing) |
| **23.3** | No pueden **bloquear la navegación**; si se superponen, tienen que poder cerrarse con facilidad | **VIGENTE** | El sticky CTA no puede tapar el contenido; nada de pop-ups o intersticiales que no se puedan cerrar |
| **23.4** | No pueden ponerse en webs que promocionen operadores sin título | **VIGENTE** | **Nunca** mezclar operadores sin licencia DGOJ en la versión ES |
| 25.3 | Restricciones a cuentas en plataformas de vídeo | **ANULADO** (según [Cuatrecasas](https://www.cuatrecasas.com/es/spain/propiedad-intelectual/art/ts-anula-varios-articulos-rd-comunicaciones-comerciales), contenido equivalente en la LGCA) | Los vídeos de TikTok, YouTube, etc. siguen sujetos a la LGCA |
| 26.2 y 26.3 | Redes sociales: solo para seguidores e interesados, y solo perfiles cuya actividad principal sea el juego | **ANULADOS** | **26.1 sigue vigente:** el operador solo publica en redes que tengan herramientas para excluir a menores |
| **7** | La comunicación comercial tiene que ser **identificable como tal** y tiene que verse **quién es el operador** | **VIGENTE** | Etiqueta "Publicidad", logo y nombre del operador en la tarjeta |
| **9.2** | Responsabilidad social. Prohíbe, entre otras cosas: desacreditar a quien no juega; desvalorizar el esfuerzo; **pedir que se comparta el mensaje**; sugerir que el juego aporta reconocimiento social; **representaciones gráficas de dinero o de productos de lujo**; contenido sexual | **VIGENTE** | **Avisar a A2:** nada de fajos de billetes, lingotes, coches o relojes de lujo. Nada de "compártelo" en el copy |
| **10.2** | Juego seguro. Prohíbe: incitar al juego compulsivo; ofrecer créditos; sugerir que el juego resuelve problemas; **asociar el juego al éxito personal o social**; inducir a error sobre la probabilidad de ganar; **sugerir que la habilidad elimina el azar o que el conocimiento, la perseverancia o el dominio de la plataforma son la clave del éxito**; presentar el juego como **inversión o alternativa al empleo** | **VIGENTE** | **El punto más delicado para una web de tipster** (ver §4) |
| **10.3** | Mensaje de juego seguro del tipo "Si juegas, juega con responsabilidad" (o "Jugar sin control puede tener consecuencias perjudiciales…"), visible durante toda la pieza gráfica | **VIGENTE** | Barra de confianza y footer |
| **11** | Menores: no dirigirse a ellos; ningún diseño que les atraiga especialmente (mascotas, dibujos); **advertencia "+18" o "Menores no"** | **VIGENTE** | Barra +18. **Avisar a A2:** nada de mascotas de estilo infantil (la identidad "Mapache" tiene que ser adulta, no un dibujo animado) |

> El resto de títulos (franjas horarias de audiovisual 01:00–05:00, patrocinio, etc.) no afectan a una landing web.

## 3. ¿Puede un tipster con notoriedad aparecer promocionando en España hoy?

**Sí, con condiciones.** Desde la anulación del art. 15 no existe una prohibición general de que salgan personas con notoriedad pública. Pero el **art. 27 sigue vigente** y está hecho justo para los tipsters:

1. **Su notoriedad tiene que venir de pronosticar** (27.2). Un tipster conocido por sus pronósticos, como los miembros de la Academia, entra. Un futbolista, un streamer de videojuegos o un famoso conocido por otra cosa que haga de "tipster" **no** puede tener un acuerdo publicitario con el operador.
2. **Tiene que comprometerse a publicar todos sus resultados de apuestas en la plataforma del operador** (27.1). Esto es una obligación contractual entre el operador y el tipster. **TODO(sergi): confirmar con Sportium o la red de afiliación (BA/Anuar) cómo lo instrumentan** (cláusula del contrato de afiliado, perfil de tipster en Sportium…). Si no se cumple: resolución del contrato y 3 años sin poder firmar otro (27.3).
3. Todo el contenido tiene que respetar los arts. 9, 10 y 11: **el tipster no puede presentar sus análisis como la clave para ganar** (10.2.f), ni el juego como ingreso o inversión (10.2.h), ni asociarlo a su éxito o estatus (10.2.d y 9.2).
4. La pieza tiene que estar identificada como **publicidad** (art. 7) y, en redes, además, según la LGCA (etiqueta de colaboración o publicidad de la plataforma).
5. Si un miembro supera los umbrales del RD 444/2024, tiene además las obligaciones de "usuario de especial relevancia".

**Riesgo de futuro:** la reforma de la Ley 13/2011 que prepara Consumo quiere **limitar famosos e influencers** en la publicidad del juego con rango de ley (§6). Hay que revisar esta ficha cuando se apruebe el anteproyecto.

## 4. ¿Se permiten bonos para nuevos clientes?

**Sí, hoy sí** (el art. 13.1 está anulado). Condiciones que sí son obligatorias (13.4, vigente):

- **Condiciones clave visibles junto al bono:** depósito mínimo, requisito de apuesta (rollover), plazo para liberarlo y si es retirable o solo apostable. El brief ya lo prevé con `bonus_terms_short` + `terms_url`. En la tarjeta, si no caben, "Se aplican condiciones" con enlace (13.4, último inciso), **pero en una landing hay espacio, así que mejor mostrarlas**.
- **Nada de "gratis", "free", "regalo" ni "sin riesgo"** (13.4.a). Usar "bono de bienvenida", "promoción", "apuesta de bienvenida".
- **Sin testimonios de beneficiarios previos** (13.4.b). ⚠️ Esto toca al tipster: **"yo cobré mi bono y gané X" es un testimonio prohibido.** Sí vale "es la casa que uso yo" (es la recomendación del creador, no un testimonio sobre la promoción).
- El bono tiene que ser **el aprobado por el operador** (y real a la fecha: `valid_from` y `valid_to`).
- Riesgo de futuro: la reforma de la Ley 13/2011 quiere **regular las promociones de captación**. Hay que estar preparados para apagar bonos en ES con una sola fila de la BD.

## 5. Qué puede y qué no puede decir la landing en ES

**Sí puede:**
- "Esta es la casa que uso yo" o "Mi elección", con criterios concretos y verificables (licencia DGOJ, métodos de pago, como Bizum si es real, tiempos de retirada **documentados por el operador**).
- Bono de bienvenida con las condiciones clave visibles.
- Datos reales del miembro (seguidores, años): solo los verificados (si no, `TODO(sergi)`).
- Pasos de registro, FAQ ("¿es legal?": "sí, Sportium tiene licencia de la DGOJ nº TODO").
- Urgencia **real** basada en `valid_to`.

**No puede:**
- Prometer o insinuar ganancias: "gana seguro", "dinero fácil", "ingresos", "invierte", "vive de las apuestas", "recupera lo perdido", "método infalible", "con mis picks ganarás" (10.2.d, 10.2.e, 10.2.f y 10.2.h).
- Presentar la habilidad o el análisis como lo que elimina el azar (10.2.f). Sí vale "te cuento cómo analizo", siempre con el aviso de que **apostar conlleva perder dinero**.
- "Gratis", "sin riesgo" o "regalo" (13.4.a). Testimonios de usuarios que ganaron (13.4.b).
- Imágenes de dinero, lujo o estética infantil (9.2 y 11.2). Contenido sexual.
- Pedir que se comparta ("pásaselo a tus amigos"; 9.2) ni presión social.
- Contadores falsos o escasez inventada (art. 8, veracidad).
- Pop-ups que bloqueen la navegación (23.3).
- Enlazar operadores **sin licencia DGOJ** (Ley 13/2011 art. 7.3; RD art. 6.2 y 23.4). Con IP o cookie ES solo se enseñan ofertas con licencia DGOJ: eso ya lo garantiza `licenseByCountry.ES`.

**Elementos obligatorios en ES (ya los da `getCompliance('ES')`):** "Publicidad", "+18 · Menores no", "Si juegas, juega con responsabilidad", enlace a [jugarbien.es](https://www.jugarbien.es) (portal de juego seguro de la DGOJ) y FEJAR **900 200 225** (teléfono verificado en la [web de SELAE](https://www.loteriasyapuestas.es/es/juegoresponsable/centros-de-ayuda)), enlace a la DGOJ, **número de licencia DGOJ del operador en su tarjeta** (`Operator.licenseByCountry.ES`; **TODO(sergi): número real de Sportium**, comprobar en el listado de operadores de [ordenacionjuego.es](https://www.ordenacionjuego.es)) y condiciones del bono.

## 6. Reforma en curso de la Ley 13/2011 (vigilar)

- El 18-may-2026, el Ministerio de Derechos Sociales, Consumo y Agenda 2030 abrió la **consulta pública previa** para modificar la Ley 13/2011 (cerrada el 22-jun-2026). Objetivos declarados: regular el **uso de famosos e influencers**, las **promociones de captación de clientes** y la publicidad en buscadores, y adaptar la ley al entorno digital. Fuente: [nota de prensa del Ministerio](https://www.dsca.gob.es/en/comunicacion/notas-prensa/consumo-abre-consulta-publica-modificacion-ley-regulacion-juego).
- A 16-oct-2026 **no hay texto aprobado** ni ley en vigor ([que.es, 16-10-2026](https://www.que.es/2026/10/16/ley-del-juego-publicidad-bonos-apuestas/)). Hoy rige lo descrito arriba.
- **Acción:** revisar esta ficha cuando el Consejo de Ministros apruebe el anteproyecto. Diseñar para poder **apagar bonos** y **quitar la cara del tipster** en ES solo con configuración.

## 7. Afiliados: obligaciones prácticas

- La landing es una **comunicación comercial de juego** (RD 958/2020 art. 2: afiliados incluidos). El operador responde ante la DGOJ y traslada la responsabilidad por contrato: **incumplir te cuesta la cuenta de afiliado**.
- **Ley 13/2011 art. 7.3:** verificar que el operador tiene licencia antes de anunciarlo, y mantener la verificación (la DGOJ publica el listado actualizado).
- Las condiciones del programa de afiliación de Sportium (y de la red) mandan sobre creativos, marca, pujas por la marca en buscadores, etc. Ver `creativos-operadores.md`.
- AUTOCONTROL: el Código de conducta sobre comunicaciones comerciales de las actividades de juego obliga a los operadores adheridos, que lo trasladan a sus afiliados. **TODO(sergi): pedir a Sportium sus guías de marketing de afiliados.**

## 8. Checklist de publicación ES

- [ ] OK escrito de Sergi o de su asesor (P9) → añadir `ES` a `COMPLIANCE_APPROVED_MARKETS`.
- [ ] Licencia DGOJ de Sportium verificada y su número en `licenseByCountry.ES`.
- [ ] Bono y condiciones **aprobados por Sportium** (P6), con depósito mínimo, rollover, plazo y retirable.
- [ ] Copy de A3 revisado en `revisiones.md` (sin testimonios de bono, sin promesas de ganancia, sin "gratis").
- [ ] Compromiso art. 27.1 del tipster con el operador confirmado.
- [ ] Datos del titular completos en `/legal/aviso-legal`.
- [ ] Identificador de controles parentales (`rating`) en la landing (petición a A1).
- [ ] Decisión sobre la cookie `lp_v` en ES (ver `cookies-aepd.md`).

## Fuentes (consultadas el 22-oct-2026)
- BOE: [RD 958/2020 consolidado](https://www.boe.es/buscar/act.php?id=BOE-A-2020-13495) · [Ley 13/2011 consolidada](https://www.boe.es/buscar/act.php?id=BOE-A-2011-9280) · [STS 2-4-2024 (BOE-A-2024-10500)](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-10500) · [STS 19-4-2024 (BOE-A-2024-11619)](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-11619)
- CENDOJ: STS 527/2024, de 2 de abril (buscar en [poderjudicial.es](https://www.poderjudicial.es/search/indexAN.jsp))
- DGOJ: [ordenacionjuego.es](https://www.ordenacionjuego.es) · [jugarbien.es](https://www.jugarbien.es) (no se pudo leer automáticamente: robots.txt)
- [Cuatrecasas: el TS anula varios artículos del RD de comunicaciones comerciales](https://www.cuatrecasas.com/es/spain/propiedad-intelectual/art/ts-anula-varios-articulos-rd-comunicaciones-comerciales)
- [Ministerio de Consumo: consulta pública para la reforma de la Ley 13/2011](https://www.dsca.gob.es/en/comunicacion/notas-prensa/consumo-abre-consulta-publica-modificacion-ley-regulacion-juego) · [que.es 16-10-2026](https://www.que.es/2026/10/16/ley-del-juego-publicidad-bonos-apuestas/)
- [SELAE: centros de ayuda (FEJAR 900 200 225)](https://www.loteriasyapuestas.es/es/juegoresponsable/centros-de-ayuda)
- [ECIJA: nota sobre el RD 444/2024 (influencers)](https://files.griddo.ecija.com/ecija-nota-influencers.pdf)
