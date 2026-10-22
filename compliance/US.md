# Estados Unidos (US): ficha de compliance

> A5 · fuentes consultadas el **22-oct-2026**. No es un dictamen jurídico. **Recomendación: US no publicable en v1.**

## Marco: se regula estado por estado
- No hay una licencia federal: cada estado regula (o prohíbe) las apuestas deportivas y el casino online. **BetMGM** opera:
  - **Apuestas deportivas online** (según [Sharp Football Analysis, tabla de oct-2026](https://www.sharpfootballanalysis.com/sportsbook/guides/betmgm-legal-states/); **verificar en betmgm.com**): AZ, CO, DC, IL, IN, IA, KS, KY, LA, MD, MA, MI, MS, MO, NV, NJ, NY, NC, OH, PA, PR, TN, VA, WV, WY (OR y WA solo presencial).
  - **Casino online:** solo **MI, NJ, PA y WV**.
- **Los afiliados necesitan licencia o registro estatal** como *vendor* o *marketing affiliate* en la mayoría de esos estados (p. ej., NJ DGE, PA PGCB, MI MGCB, NY, OH, MA…), y algunos estados prohíben las comisiones CPA o revenue share sin licencia. **Esto es un requisito previo: BetMGM no aceptará tráfico de un afiliado sin licencia en esos estados.** TODO(sergi): ¿la Academia tiene licencia de afiliado en algún estado? Lo normal es que no.

## Lo esencial
| Punto | Valor |
|---|---|
| Edad mínima | **21+** online en los estados de BetMGM |
| Geolocalización | **El país no basta:** hace falta el estado (`x-vercel-ip-country-region`) y, aun así, la decisión es del operador (geofencing al apostar). **Petición de contrato:** si US se activa, `getCompliance` necesita la región |
| Mensajes obligatorios | Varían por estado (cada regulador fija su texto y su número de ayuda). Base común: "21+", "Gambling problem? Call 1-800-…", "Only where legal" o lista de estados, y el T&C de la promo |
| Línea de ayuda | **NCPG, National Problem Gambling Helpline: 1-800-MY-RESET** (llamada, texto y chat). Desde el 29-09-2025 **1-800-GAMBLER ya no es la línea nacional** (ahora es del CCGNJ de New Jersey, aunque algunos estados la siguen exigiendo en su texto) ([NCPG FAQ](https://www.ncpgambling.org/helpline-stakeholder-faq)) |
| Influencers | Reglas de la FTC sobre *endorsements* (disclosure claro) y códigos del sector (AGA Responsible Marketing Code: nada dirigido a menores de 21, nada en campus universitarios) |

## Riesgos
- Licencia de afiliado estatal (muy alto).
- Un público mayoritariamente hispanohablante de fuera de EE. UU. que entra con VPN: el operador lo bloqueará, pero no podemos enseñar una oferta de un estado a otro.
- Mensajes y bonos distintos por estado: el modelo `offers` es por país y habría que extenderlo a región.

## Recomendación
**US = fallback en v1.** Si Sergi quiere EE. UU.: (1) licencia de afiliado en los estados objetivo, (2) extender el contrato a `country + region`, (3) textos por estado aprobados por BetMGM y (4) en-US revisado.

## Fuentes (22-oct-2026)
- [Sharp Football Analysis: BetMGM legal states](https://www.sharpfootballanalysis.com/sportsbook/guides/betmgm-legal-states/) (fuente secundaria)
- [NCPG Helpline FAQ](https://www.ncpgambling.org/helpline-stakeholder-faq) · [SBC Americas, 29-01-2026](https://sbcamericas.com/2026/01/29/ncpg-unveils-new-1-800-my-reset/)
