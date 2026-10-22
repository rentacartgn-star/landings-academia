# México (MX): ficha de compliance

> A5 · fuentes consultadas el **22-oct-2026**. No es un dictamen jurídico. Gate P9: `MX` en `COMPLIANCE_APPROVED_MARKETS` solo con el OK de Sergi o de su asesor.

## Marco
- **Ley Federal de Juegos y Sorteos (LFJS, 1947)** y su **Reglamento (2004, reformado DOF 19-10-2012 y 23-10-2013)**. Autoridad: **SEGOB, Dirección General de Juegos y Sorteos (DGJS)**. El juego online legal **depende de un permisionario de SEGOB** (normalmente vinculado a uno con salas físicas), con servidores en México ([quintafuerza.mx, 19-10-2026](https://quintafuerza.mx/mexico/juegos-sorteos-reforma-sigue-sin-llegar-congreso-jugador-linea-depende-controles-operador/); [El Imparcial, 13-10-2026](https://www.elimparcial.com/dinero/2026/10/13/la-reforma-a-la-ley-federal-de-juegos-y-sorteos-un-obstaculo-para-el-sector-del-juego-y-las-apuestas-deportivas-onlinep/?outputType=amp-type)).
- **Registro de sitios autorizados:** lo publica la DGJS en `juegosysorteos.gob.mx`, según la prensa. **TODO(sergi): comprobar ahí cada dominio antes de activarlo.** En julio de 2026 la DGJS suspendió 10 dominios que operaban con permiso, así que hay que **revisarlo periódicamente**.
- **PLD:** los operadores son sujetos obligados (UIF/SAT). Nuevas reglas de Hacienda con plazo hasta el 30-11-2026. No afecta directamente al afiliado.

## Publicidad: Reglamento LFJS, art. 9 ([texto en mley.mx](https://mley.mx/Reg_LFJS/articulo/9/), comprobar contra el PDF de la Cámara de Diputados)
La publicidad solo se puede hacer **cuando ya existe el permiso** y tiene que:
1. ser clara y precisa, sin inducir a error;
2. **consignar el número de permiso** de SEGOB (→ en la tarjeta de cada oferta: `Operator.licenseByCountry.MX` = "Permiso SEGOB DGJS/…");
3. incluir el mensaje de que **los juegos con apuesta están prohibidos para menores de edad**;
4. incluir un mensaje que **invite a jugar de forma responsable**, como entretenimiento, diversión y esparcimiento.

(Ojo: la fracción I prohíbe que los *establecimientos* promuevan "explícitamente" las apuestas. Está pensada para las salas físicas; el riesgo para una landing online es bajo, pero conviene que el tono sea informativo.)

## Lo esencial
| Punto | Valor |
|---|---|
| Edad mínima | **18** |
| Licencias válidas | Solo un **permiso SEGOB vigente** (el operador o la marca, a través de un permisionario). **TODO(sergi): ¿qué operador va en MX?** Sportium y BetMGM **no** tienen un permiso SEGOB verificado por A5; hay que pedir a cada uno su número de permiso y el dominio .mx autorizado |
| Mensajes obligatorios | Número de permiso; "Prohibido para menores de edad"; invitación a jugar de forma responsable. Recomendado: "Publicidad" |
| Línea de ayuda | **Línea de la Vida (CONASAMA): 800 911 2000**, 24/7 ([gob.mx/conasama](https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000)). No es específica del juego, pero es el recurso oficial nacional de salud mental y adicciones |
| Influencers y bonos | **Sin regla específica vigente.** Hay una propuesta del diputado Martínez Urincho (Morena) para limitar influencers, celebridades y deportistas y **prohibir los bonos de bienvenida**; **no es ley**. La reforma de la LFJS de SEGOB está en el Gabinete de Seguridad y **no se ha presentado al Congreso** (oct-2026) |
| Moneda y pagos | MXN; OXXO, SPEI o Mercado Pago **solo si el operador los ofrece de verdad** |

## Riesgos
- **Mercado gris muy extendido:** muchas "casas" que se anuncian en México no tienen permiso SEGOB. Nunca enseñar un operador sin número de permiso verificado.
- Reforma de la LFJS en ciernes (publicidad, bonos, influencers): hay que revisarla cuando llegue al Congreso.
- Fiscalidad del sector al alza (IEPS). No afecta al copy, pero sí a los bonos que ofrezcan los operadores.
- Aplicar como buenas prácticas lo mismo que en ES (sin promesas de ganancia, sin "gratis" engañoso, sin menores): además de ser lo prudente, lo exigen los programas de afiliados.

## Checklist MX
- [ ] Operador decidido (P1), con permiso SEGOB verificado y su número en `licenseByCountry.MX`.
- [ ] Dominio de destino del enlace de afiliado = el dominio autorizado.
- [ ] Bono y creativos aprobados por el operador.
- [ ] OK de Sergi → `MX` en la env.

## Fuentes (22-oct-2026)
- [Reglamento LFJS, art. 9 (mley.mx)](https://mley.mx/Reg_LFJS/articulo/9/)
- [quintafuerza.mx, 19-10-2026](https://quintafuerza.mx/mexico/juegos-sorteos-reforma-sigue-sin-llegar-congreso-jugador-linea-depende-controles-operador/)
- [El Imparcial, 13-10-2026](https://www.elimparcial.com/dinero/2026/10/13/la-reforma-a-la-ley-federal-de-juegos-y-sorteos-un-obstaculo-para-el-sector-del-juego-y-las-apuestas-deportivas-onlinep/?outputType=amp-type)
- [CONASAMA, Línea de la Vida](https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000)
