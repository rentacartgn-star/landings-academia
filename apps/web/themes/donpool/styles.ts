// [A2] DonPool · estilos. Se inyectan inline solo en las páginas de DonPool (no viajan a los otros sitios).
// Paleta en tokens.ts (variables --*). Solo se animan transform y opacity.

// Fieltro: ruido fractal en SVG, tile de 180 px, estático.
const FELT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .78 0 0 0 0 .95 0 0 0 0 .84 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const EASE_OUT = 'cubic-bezier(.16,1,.3,1)'; // expo.out
const BACK_OUT = 'cubic-bezier(.34,1.32,.64,1)'; // back.out(1.3)

const raw = /* css */ `
html{background:var(--felt1,#05150F)}
.dp{position:relative;min-height:100vh;min-height:100dvh;color:var(--cream);background:var(--felt1);
  font-family:var(--dp-font),system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:17px;line-height:1.6;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
  overflow-x:clip;-webkit-tap-highlight-color:transparent}
:where(.dp) *,:where(.dp) *::before,:where(.dp) *::after{box-sizing:border-box}
:where(.dp) :where(h1,h2,h3,p,ol,ul,dl,dd){margin:0;padding:0}
:where(.dp) :where(ol,ul){list-style:none}
:where(.dp) a{color:inherit}
:where(.dp) img{display:block;max-width:100%}
.dp ::selection{background:var(--brass);color:var(--felt0)}
.dp :focus-visible{outline:2px solid var(--brass-hi);outline-offset:3px;border-radius:12px}

/* ───── Fondo: tapete + fieltro + lámpara ───── */
.dp-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;
  background:radial-gradient(130% 75% at 50% -12%,var(--felt4) 0%,var(--felt3) 26%,var(--felt2) 52%,var(--felt1) 78%,var(--felt0) 100%)}
.dp-bg::before{content:'';position:absolute;inset:0;background-image:${FELT};background-size:180px;opacity:.3;mix-blend-mode:overlay}
.dp-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 30%,transparent 55%,rgba(0,0,0,.55) 100%)}
.dp-lamp{position:absolute;border-radius:50%;will-change:transform;opacity:0;animation:dp-lamp-on 1.6s ${EASE_OUT} .1s forwards}
.dp-lamp--a{width:120vmax;height:70vmax;left:50%;top:-38vmax;margin-left:-60vmax;
  background:radial-gradient(closest-side,rgba(241,220,166,.22),rgba(241,220,166,.06) 55%,transparent)}
.dp-lamp--b{width:80vmax;height:80vmax;left:-38vmax;top:28vh;background:radial-gradient(closest-side,rgba(46,150,100,.22),transparent)}
.dp-lamp--c{width:70vmax;height:70vmax;right:-34vmax;top:62vh;background:radial-gradient(closest-side,rgba(201,164,101,.13),transparent)}
.dp-motion .dp-lamp--a{animation:dp-lamp-on 1.6s ${EASE_OUT} .1s forwards,dp-breathe 9s ease-in-out 1.7s infinite alternate}
.dp-motion .dp-lamp--b{animation:dp-lamp-on 2s ${EASE_OUT} .4s forwards,dp-drift-b 22s ease-in-out infinite alternate}
.dp-motion .dp-lamp--c{animation:dp-lamp-on 2s ${EASE_OUT} .6s forwards,dp-drift-c 26s ease-in-out infinite alternate}
@keyframes dp-lamp-on{to{opacity:1}}
@keyframes dp-breathe{from{opacity:1;transform:scale(1)}to{opacity:.78;transform:scale(1.05)}}
@keyframes dp-drift-b{to{transform:translate3d(14vw,-8vh,0) scale(1.1)}}
@keyframes dp-drift-c{to{transform:translate3d(-12vw,-14vh,0) scale(.92)}}
.dp>*:not(.dp-bg){position:relative;z-index:1}

/* ───── Cristal ───── */
.dp-glass{position:relative;isolation:isolate;border-radius:var(--r-card);
  background:linear-gradient(180deg,rgba(255,250,236,.085),rgba(255,250,236,.025) 38%,rgba(0,0,0,.06)),var(--glass);
  -webkit-backdrop-filter:blur(22px) saturate(175%);backdrop-filter:blur(22px) saturate(175%);
  box-shadow:inset 0 1px 0 rgba(255,253,245,.16),inset 0 -1px 0 rgba(0,0,0,.28),0 30px 70px -24px rgba(0,0,0,.7),0 10px 26px -14px rgba(0,0,0,.5)}
.dp-glass::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(158deg,rgba(255,248,230,.5),rgba(255,248,230,.10) 26%,rgba(255,248,230,.03) 58%,rgba(201,164,101,.42));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.dp-glass::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;
  background:radial-gradient(90% 55% at 22% -6%,rgba(255,255,255,.13),transparent 62%),radial-gradient(70% 40% at 100% 100%,rgba(201,164,101,.10),transparent 70%)}
.dp-lite .dp-glass{-webkit-backdrop-filter:none;backdrop-filter:none;background:linear-gradient(180deg,rgba(255,250,236,.06),rgba(0,0,0,0)),var(--glass-solid)}
.dp-lite .dp-lamp{animation:none!important;opacity:1}

/* ───── Tipografía ───── */
.dp-eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--brass-hi)}
.dp-h1{font-weight:900;font-size:clamp(38px,10.6vw,88px);line-height:1.02;letter-spacing:-.042em;text-wrap:balance;margin-top:14px}
.dp-h1__a{color:var(--cream)}
.dp-h1__b{background:linear-gradient(176deg,var(--brass-hi) 8%,var(--brass) 58%,var(--brass-lo) 112%);-webkit-background-clip:text;background-clip:text;color:transparent}
.dp-h2{font-weight:850;font-size:clamp(31px,8vw,58px);line-height:1.06;letter-spacing:-.035em;text-wrap:balance}
.dp-h3{font-weight:750;font-size:19px;line-height:1.3;letter-spacing:-.015em;color:var(--cream)}
.dp-lede{font-size:17px;line-height:1.62;color:var(--cream-muted);max-width:36em;text-wrap:pretty}
.dp-label{font-size:11.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--brass)}

/* Diamantes de baranda */
.dp-sights{display:inline-flex;align-items:center;gap:7px;flex:none}
.dp-sights i{width:7px;height:7px;transform:rotate(45deg);border-radius:1.5px;
  background:linear-gradient(135deg,#fffaf0,#d9cfbf 45%,#a9c7c0 70%,#efe2c6);box-shadow:0 0 6px rgba(241,220,166,.45)}
.dp-sights i:nth-child(2){width:8px;height:8px}

/* ───── Barra de confianza y cabecera ───── */
.dp-trust{display:flex;align-items:center;justify-content:center;gap:14px;min-height:34px;padding:6px 16px;
  font-size:11.5px;line-height:1.35;font-weight:600;letter-spacing:.04em;color:var(--cream-muted);background:rgba(2,10,7,.55);flex-wrap:wrap;row-gap:0;
  border-bottom:1px solid rgba(201,164,101,.18);text-align:center}
.dp-trust__reg{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:var(--cream);font-weight:700}
.dp-trust__reg img{height:16px;width:auto}
.dp-top{display:flex;align-items:center;justify-content:space-between;max-width:1240px;margin:0 auto;padding:14px 20px 0}
.dp-who{display:flex;align-items:center;gap:12px}
.dp-who__txt{display:flex;flex-direction:column;line-height:1.2}
.dp-who__txt strong{font-size:15px;font-weight:800;letter-spacing:-.01em}
.dp-who__txt span{font-size:12.5px;color:var(--cream-faint);font-weight:500}

/* Avatar = bola blanca con el miembro dentro */
.dp-avatar{position:relative;display:inline-block;border-radius:50%;flex:none;padding:2px;
  background:conic-gradient(from 210deg,var(--brass-hi),var(--brass-lo),var(--brass),var(--brass-hi));
  box-shadow:0 10px 24px -8px rgba(0,0,0,.6)}
.dp-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover}
.dp-avatar::after{content:'';position:absolute;inset:2px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle at 32% 24%,rgba(255,255,255,.55),rgba(255,255,255,0) 22%),radial-gradient(circle at 50% 50%,transparent 58%,rgba(0,0,0,.38))}
.dp-avatar--sm{width:42px;height:42px}
.dp-avatar--xl{width:136px;height:136px;padding:3px}

/* ───── Bolas (reflejo 3D falso) ───── */
.dp-ball{--s:64px;--c:var(--brass);--c2:var(--brass-lo);--base:radial-gradient(circle at 40% 34%,var(--c) 0%,var(--c2) 70%,#000 125%);
  position:relative;display:inline-block;width:var(--s);height:var(--s);border-radius:50%;flex:none;background:var(--base);
  box-shadow:0 calc(var(--s)*.32) calc(var(--s)*.36) calc(var(--s)*-.16) rgba(0,0,0,.7),0 calc(var(--s)*.06) calc(var(--s)*.12) rgba(0,0,0,.35)}
.dp-ball[data-n]::before{content:attr(data-n);position:absolute;left:27%;top:23%;width:46%;height:46%;border-radius:50%;
  display:grid;place-items:center;font-family:var(--dp-font),system-ui,sans-serif;font-weight:900;font-size:calc(var(--s)*.24);line-height:1;
  letter-spacing:-.04em;font-variant-numeric:tabular-nums;color:#111;
  background:radial-gradient(circle at 42% 36%,#fffdf7,#efe6d2 70%,#d5c8ac);transform:rotate(-8deg) scaleX(.94);
  box-shadow:inset 0 calc(var(--s)*-.012) calc(var(--s)*.03) rgba(0,0,0,.25)}
.dp-ball::after{content:'';position:absolute;inset:0;border-radius:50%;pointer-events:none;
  background:
    radial-gradient(circle at 33% 25%,rgba(255,255,255,.98) 0,rgba(255,255,255,.62) 3.5%,rgba(255,255,255,0) 15%),
    radial-gradient(60% 40% at 40% 18%,rgba(255,255,255,.22),transparent 70%),
    radial-gradient(circle at 72% 84%,rgba(255,255,255,.16),transparent 24%),
    radial-gradient(circle at 42% 38%,transparent 46%,rgba(0,0,0,.42) 100%)}
.dp-ball--cue{--c:#fffdf6;--c2:#d9cdb3}
.dp-ball--eight{--c:#3a403c;--c2:var(--ball-eight)}
.dp-ball--brass{--c:var(--brass-hi);--c2:var(--brass-lo)}
.dp-ball--ink{--c:#4a64a0;--c2:var(--ball-ink)}
.dp-ball--ox{--c:#a3404f;--c2:var(--ball-ox)}
.dp-ball--plum{--c:#7d529a;--c2:var(--ball-plum)}
.dp-ball--stripe{background:linear-gradient(180deg,transparent 26%,var(--ball-ox) 26%,var(--ball-ox) 74%,transparent 74%),radial-gradient(circle at 40% 34%,#fffdf6,#d9cdb3 80%)}
.dp-ball--stripe[data-n]::before{left:30%;top:28%}

/* ───── Hero ───── */
.dp-hero{max-width:1240px;margin:0 auto;padding:24px 20px 0}
.dp-hero__copy{position:relative;z-index:2}
.dp-hero__sub{margin-top:20px;font-size:16px;line-height:1.55}
.dp-stage{position:relative;margin-top:22px;padding:30px 0 34px}
.dp-stage__card{position:relative;z-index:2}
.dp-table{padding:26px 22px 22px}
.dp-table .dp-cta{margin-top:22px}
.dp-bonus .dp-cta+.dp-terms,.dp-bonus .dp-cta2+.dp-terms{margin-top:16px}
.dp-bonus .dp-cta2{margin-top:20px}
.dp-hero__foot{margin-top:6px;display:grid;gap:14px}
.dp-trustline{font-size:13.5px;line-height:1.55;color:var(--cream-faint);font-weight:500}
.dp-country{font-size:14px;color:var(--cream-muted);display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
.dp-switch{appearance:none;border:0;background:none;color:var(--brass-hi);font:inherit;font-weight:700;min-height:44px;padding:0 2px;cursor:pointer;
  text-decoration:underline;text-decoration-color:rgba(241,220,166,.4);text-underline-offset:4px}

/* Escenario de bolas: posiciones (las que van detrás del cristal se ven difuminadas a través de él) */
.dp-par{position:absolute;display:block;z-index:1;pointer-events:none}
.dp-par--1{left:-22px;top:-8px}
.dp-par--2{right:-10px;top:-14px;z-index:3}
.dp-par--3{right:-18px;bottom:-6px;z-index:3}
.dp-par--4{left:18%;bottom:-2px}
.dp-in{display:block}
.dp-motion .dp-in{opacity:0;animation:dp-ball-in 1.2s ${EASE_OUT} both}
.dp-motion .dp-in--1{animation-delay:.25s;--fx:-60px;--fy:10px}
.dp-motion .dp-in--2{animation-delay:.4s;--fx:40px;--fy:-20px}
.dp-motion .dp-in--3{animation-delay:.55s;--fx:50px;--fy:30px}
.dp-motion .dp-in--4{animation-delay:.7s;--fx:-30px;--fy:30px}
@keyframes dp-ball-in{from{opacity:0;transform:translate3d(var(--fx,0),var(--fy,0),0)}to{opacity:1;transform:none}}
.dp-motion .dp-float{animation:dp-float 7s ease-in-out infinite alternate}
.dp-motion .dp-float--b{animation-duration:8.5s;animation-delay:-3s}
.dp-motion .dp-float--c{animation-duration:6.2s;animation-delay:-1.4s}
@keyframes dp-float{from{transform:translate3d(0,-5px,0)}to{transform:translate3d(0,6px,0)}}
.dp-motion .dp-stage__card{animation:dp-pop .9s ${BACK_OUT} .12s both}
@keyframes dp-pop{from{opacity:0;transform:translate3d(0,20px,0) scale(.92)}to{opacity:1;transform:none}}
@supports (animation-timeline:scroll()){
  .dp-motion .dp-par{animation:dp-par linear both;animation-timeline:scroll(root);animation-range:0 90vh}
  .dp-motion .dp-par--1,.dp-motion .dp-par--4{--py:-70px}
  .dp-motion .dp-par--2,.dp-motion .dp-par--3{--py:-130px}
  @keyframes dp-par{to{transform:translate3d(0,var(--py),0)}}
}

/* ───── Operador ───── */
.dp-op{display:flex;align-items:center;gap:14px;min-width:0}
.dp-op__txt{min-width:0}
.dp-op__name{font-weight:800;font-size:18px;letter-spacing:-.015em;line-height:1.25}
.dp-op__lic{font-size:12.5px;color:var(--cream-faint);line-height:1.4;margin-top:2px;font-variant-numeric:tabular-nums}
.dp-op__lic span{color:var(--cream-muted);font-weight:600}
.dp-plaque{display:grid;place-items:center;flex:none;width:92px;height:46px;padding:6px 8px;border-radius:14px;
  background:linear-gradient(180deg,#fbf6ea,#e9dfc8);box-shadow:inset 0 0 0 1px rgba(142,107,52,.45),inset 0 1px 0 #fff,0 6px 16px -6px rgba(0,0,0,.6)}
.dp-plaque img{width:100%;height:100%;object-fit:contain;border-radius:6px}
.dp-plaque--lg{width:116px;height:56px;border-radius:16px}

/* ───── Bono ───── */
.dp-bonus{margin-top:22px}
.dp-bonus__h{font-weight:900;letter-spacing:-.03em;line-height:1.08;margin-top:8px;font-variant-numeric:tabular-nums;text-wrap:balance}
.dp-bonus--xl .dp-bonus__h{font-size:clamp(28px,7.6vw,40px)}
.dp-bonus--md .dp-bonus__h{font-size:clamp(26px,6.6vw,36px)}
.dp-bonus--sm .dp-bonus__h{font-size:22px}
.dp-terms{margin-top:12px;font-size:13.5px;line-height:1.55;color:var(--cream-muted);padding-left:12px;border-left:1px solid rgba(201,164,101,.45)}
.dp-terms a{color:var(--brass-hi);font-weight:650;text-decoration:underline;text-decoration-color:rgba(241,220,166,.4);text-underline-offset:3px;
  display:inline-block;padding:6px 0;margin:-6px 0}
.dp-valid{display:inline-flex;align-items:center;gap:8px;margin-top:12px;font-size:13px;font-weight:600;color:var(--cream);
  padding:6px 12px;border-radius:999px;background:rgba(201,164,101,.12);box-shadow:inset 0 0 0 1px rgba(201,164,101,.3);font-variant-numeric:tabular-nums}
.dp-valid__dot{width:6px;height:6px;border-radius:50%;background:var(--brass-hi)}

/* ───── CTA (marfil de bola blanca: el único color de acción) ───── */
.dp-cta{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:12px;
  min-height:58px;padding:0 28px;border-radius:var(--r-pill);text-decoration:none;
  font-size:17px;font-weight:800;letter-spacing:-.012em;line-height:1.2;text-align:center;color:var(--cta-text);
  background:linear-gradient(180deg,#fffef9 0%,var(--ivory) 45%,var(--ivory-lo) 100%);
  box-shadow:inset 0 1px 0 #fff,inset 0 -2px 0 rgba(142,107,52,.28),0 0 0 1px rgba(255,248,230,.5),0 18px 40px -12px rgba(241,220,166,.55),0 6px 14px -4px rgba(0,0,0,.5);
  transition:transform .25s ${BACK_OUT}}
.dp-cta:active{transform:scale(.97)}
@media (hover:hover){.dp-cta:hover{transform:translate3d(0,-2px,0)}}
.dp-cta::after{content:'';position:absolute;z-index:-1;top:-30%;bottom:-30%;left:0;width:38%;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.95) 50%,transparent);transform:translate3d(-170%,0,0) skewX(-18deg)}
.dp-motion .dp-cta::after{animation:dp-shine 4s cubic-bezier(.45,0,.2,1) 1.6s infinite}
@keyframes dp-shine{0%{transform:translate3d(-170%,0,0) skewX(-18deg)}24%,100%{transform:translate3d(380%,0,0) skewX(-18deg)}}
.dp-cta--lg{min-height:62px;font-size:17.5px}
.dp-cta--block{display:flex;width:100%}
.dp-arrow{flex:none;width:30px;height:30px;padding:6px;border-radius:50%;background:var(--cta-text);color:var(--ivory)}
/* Secundario: cristal con borde marfil */
.dp-cta2{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 22px;border-radius:var(--r-pill);
  font-size:15.5px;font-weight:750;text-decoration:none;color:var(--cream);background:rgba(255,250,236,.06);
  box-shadow:inset 0 0 0 1px rgba(244,236,220,.32),inset 0 1px 0 rgba(255,255,255,.12);transition:transform .25s ${BACK_OUT},background-color .25s}
.dp-cta2 .dp-arrow{width:26px;height:26px;padding:5px;background:rgba(244,236,220,.14);color:var(--cream)}
.dp-cta2:active{transform:scale(.97)}
@media (hover:hover){.dp-cta2:hover{background:rgba(255,250,236,.12)}}
.dp-cta2--strong{box-shadow:inset 0 0 0 1px rgba(241,220,166,.6),inset 0 1px 0 rgba(255,255,255,.15);color:var(--brass-hi)}
.dp-cta2--strong .dp-arrow{background:rgba(241,220,166,.16);color:var(--brass-hi)}

/* ───── Secciones ───── */
.dp-sec{max-width:1240px;margin:0 auto;padding:120px 20px 0}
.dp-sec__head{display:grid;gap:18px;justify-items:start;margin-bottom:40px}
.dp-sec__head .dp-lede{margin-top:-4px}

/* Single: ficha de producto */
.dp-spec__head{display:flex;align-items:center;gap:18px;margin-bottom:28px}
.dp-spec__head .dp-op__name{font-size:clamp(22px,6vw,48px);font-weight:900;letter-spacing:-.035em}
.dp-spec__card{padding:26px 22px 24px;display:grid;gap:24px}
.dp-spec__card .dp-bonus{margin-top:0}
.dp-spec__card .dp-cta2{width:100%}

/* Ficha técnica */
.dp-specs{display:grid;border-top:1px solid var(--hairline)}
.dp-specs__row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:14px 0;border-bottom:1px solid var(--hairline)}
.dp-specs dt{font-size:13.5px;color:var(--cream-muted);font-weight:550}
.dp-specs dd{font-size:15px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums}
.dp-chips{display:inline-flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}
.dp-chip{font-size:12.5px;font-weight:650;padding:4px 10px;border-radius:999px;background:rgba(244,236,220,.08);box-shadow:inset 0 0 0 1px var(--hairline)}
.dp-rating{display:inline-flex;align-items:center;gap:6px}
.dp-rating__n{font-weight:900;font-size:17px}
.dp-rating__of{color:var(--cream-faint);font-weight:600}
.dp-rating__dots{display:inline-flex;gap:3px;margin-left:4px}
.dp-rating__dots i{width:8px;height:8px;border-radius:50%;background:rgba(244,236,220,.18)}
.dp-rating__dots i:nth-child(1){background:var(--brass-hi)}
.dp-rating__dots i:nth-child(2){background:var(--brass-hi);opacity:calc(min(1,max(.18,var(--v)*5 - 1)))}
.dp-rating__dots i:nth-child(3){background:var(--brass-hi);opacity:calc(min(1,max(.18,var(--v)*5 - 2)))}
.dp-rating__dots i:nth-child(4){background:var(--brass-hi);opacity:calc(min(1,max(.18,var(--v)*5 - 3)))}
.dp-rating__dots i:nth-child(5){background:var(--brass-hi);opacity:calc(min(1,max(.18,var(--v)*5 - 4)))}

/* Ranking */
.dp-track{display:block}
.dp-feat{padding:34px 22px 24px;display:grid;gap:4px;margin-top:22px}
.dp-feat__ball{position:absolute;right:-6px;top:-34px}
.dp-feat .dp-op{padding-right:64px}
.dp-feat__body{display:grid;gap:22px}
.dp-feat .dp-specs{margin-top:2px}
.dp-feat .dp-cta2{margin-top:22px;width:100%}
.dp-badge{position:absolute;left:22px;top:-15px;display:inline-flex;align-items:center;gap:10px;height:30px;padding:0 14px 0 12px;border-radius:999px;
  font-size:11.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--felt0);
  background:linear-gradient(180deg,var(--brass-hi),var(--brass) 70%,var(--brass-lo));box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 8px 18px -6px rgba(0,0,0,.6)}
.dp-badge .dp-sights{gap:4px}
.dp-badge .dp-sights i{width:5px;height:5px;background:var(--felt1);box-shadow:none}
.dp-rest{display:grid;gap:16px;margin-top:16px}
.dp-compact{padding:20px 18px 18px;display:grid;gap:4px}
.dp-compact__top{display:flex;align-items:center;gap:14px}
.dp-compact .dp-bonus{margin-top:16px}
.dp-compact .dp-specs{margin-top:16px}
.dp-compact .dp-cta2{margin-top:16px;width:100%;font-size:15px;padding:10px 18px;line-height:1.25}
.dp-compact .dp-plaque{width:76px;height:40px;border-radius:12px}
.dp-compact .dp-op__name{font-size:17px}

/* Cómo elijo */
.dp-how__grid{display:grid;gap:14px}
.dp-crit{padding:24px 22px 26px;display:grid;gap:10px;align-content:start}
.dp-crit__n{font-size:13px;font-weight:800;letter-spacing:.14em;color:var(--brass);font-variant-numeric:tabular-nums;display:flex;align-items:center;gap:10px}
.dp-crit__n::after{content:'';height:1px;flex:1;max-width:48px;background:linear-gradient(90deg,rgba(201,164,101,.6),transparent)}
.dp-crit p{font-size:15.5px;line-height:1.62;color:var(--cream-muted)}

/* 3 pasos: la bola blanca recorre la línea de tiro */
.dp-estimate{display:inline-flex;align-items:center;gap:10px;height:36px;padding:0 16px 0 10px;border-radius:999px;font-size:14px;font-weight:700;
  background:rgba(255,250,236,.07);box-shadow:inset 0 0 0 1px var(--hairline);font-variant-numeric:tabular-nums}
.dp-estimate__dot{width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 34% 28%,#fff,#e6dcc4 55%,#9f9480)}
.dp-steps{position:relative;display:grid;gap:44px;padding-left:2px}
.dp-steps__line{display:none}
.dp-step:not(:last-child)::before{content:'';position:absolute;left:27px;top:64px;bottom:-38px;border-left:2px dashed rgba(244,236,220,.22)}
.dp-steps__cue{position:absolute;left:15px;top:0;bottom:0;width:30px;z-index:2;pointer-events:none}
.dp-steps__cue .dp-ball{position:absolute;left:0;top:-4px}
.dp-step{position:relative;z-index:1;display:grid;grid-template-columns:56px 1fr;gap:20px;align-items:start}
.dp-step p{margin-top:6px;font-size:15.5px;line-height:1.62;color:var(--cream-muted)}
.dp-steps__cue{opacity:0}
.dp-motion .dp-steps[data-in] .dp-steps__cue{animation:dp-cue-y 2.2s ${EASE_OUT} .35s both}
@keyframes dp-cue-y{0%{opacity:0;transform:translate3d(0,-20px,0)}12%{opacity:1}88%{opacity:1}100%{opacity:0;transform:translate3d(0,calc(100% - 30px),0)}}
.dp-steps__cue{height:auto}

/* FAQ */
.dp-faq__list{padding:6px 22px}
.dp-qa{border-bottom:1px solid var(--hairline)}
.dp-qa:last-child{border-bottom:0}
.dp-qa summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:66px;padding:16px 0;cursor:pointer;
  font-size:16.5px;font-weight:700;letter-spacing:-.01em;line-height:1.35}
.dp-qa summary::-webkit-details-marker{display:none}
.dp-qa__icon{position:relative;flex:none;width:30px;height:30px;border-radius:50%;background:rgba(244,236,220,.08);box-shadow:inset 0 0 0 1px var(--hairline);
  transition:transform .4s ${BACK_OUT}}
.dp-qa__icon::before,.dp-qa__icon::after{content:'';position:absolute;left:50%;top:50%;width:12px;height:2px;margin:-1px 0 0 -6px;border-radius:2px;background:var(--brass-hi)}
.dp-qa__icon::after{transform:rotate(90deg)}
.dp-qa[open] .dp-qa__icon{transform:rotate(45deg)}
.dp-qa p{padding:0 0 22px;font-size:15.5px;line-height:1.65;color:var(--cream-muted);max-width:44em}
.dp-motion .dp-qa[open] p{animation:dp-fade .5s ${EASE_OUT}}
@keyframes dp-fade{from{opacity:0;transform:translate3d(0,-6px,0)}to{opacity:1;transform:none}}

/* CTA final */
.dp-final__card{padding:56px 24px 36px;display:grid;justify-items:center;text-align:center;gap:18px;overflow:visible}
.dp-final__card .dp-lede{margin-bottom:10px}
.dp-final__card .dp-cta{width:100%;max-width:440px}
.dp-final__balls{position:relative;width:120px;height:70px;margin:-100px 0 6px}
.dp-final__eight{position:absolute;left:12px;top:0}
.dp-final__cue{position:absolute;right:8px;top:22px}

/* Juego responsable */
.dp-rg{padding-top:72px}
.dp-rg__inner{display:flex;gap:16px;align-items:flex-start;padding:20px 0;border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline)}
.dp-rg__age{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;font-weight:900;font-size:14px;letter-spacing:-.02em;
  color:var(--cream);box-shadow:inset 0 0 0 1.5px rgba(244,236,220,.4)}
.dp-rg__msg{font-size:14px;line-height:1.5;color:var(--cream);font-weight:600;margin-bottom:8px}
.dp-rg__help{font-size:14px;color:var(--cream-muted);min-height:46px;display:flex;align-items:center;flex-wrap:wrap;gap:4px}
.dp-rg__help a{color:var(--brass-hi);font-weight:700;text-underline-offset:3px;text-decoration-color:rgba(241,220,166,.4)}

/* Fallback */
.dp-hero--fallback{position:relative;display:grid;justify-items:center;text-align:center;padding-top:64px;max-width:760px}
.dp-hero--fallback .dp-avatar{margin-bottom:28px}
.dp-hero--fallback .dp-lede{margin-top:22px}
.dp-fb__stage{position:absolute;inset:0;pointer-events:none}
.dp-fb__stage .dp-in{position:absolute}
.dp-fb__stage .dp-in--2{right:6%;top:40px}
.dp-fb__stage .dp-in--3{left:8%;top:150px}
.dp-fb__switch{margin-top:34px}
.dp-fb__switch .dp-cta2{flex-direction:column;gap:2px;min-height:64px;padding:10px 28px;line-height:1.3}
.dp-fb__change{font-size:13px;font-weight:600;color:var(--cream-muted);letter-spacing:.02em}
.dp-socials{margin-top:40px;display:grid;justify-items:center;gap:14px}
.dp-socials ul{display:flex;gap:12px}
.dp-social{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:rgba(255,250,236,.07);box-shadow:inset 0 0 0 1px var(--hairline)}

/* Footer */
.dp-foot{padding:64px 20px 150px}
.dp-foot__inner{max-width:1240px;margin:0 auto;display:grid;gap:16px}
.dp-foot__brand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:900;letter-spacing:-.02em}
.dp-foot__tag{font-size:14px;color:var(--cream-muted);max-width:40em}
.dp-foot__sights{margin:8px 0}
.dp-foot__disc{font-size:12.5px;line-height:1.65;color:var(--cream-faint);max-width:62em}
.dp-foot__legal{display:flex;flex-wrap:wrap;gap:0 22px}
.dp-foot__legal a{display:inline-flex;align-items:center;min-height:44px;font-size:13.5px;font-weight:600;color:var(--cream-muted);text-decoration:none}
.dp-foot__legal a:hover{color:var(--cream)}
.dp-foot__row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;font-size:13px;color:var(--cream-faint);padding-top:16px;border-top:1px solid var(--hairline)}
.dp-foot__row a{color:var(--cream-muted);min-height:44px;display:inline-flex;align-items:center;text-underline-offset:3px}
.dp-switch--chip{text-decoration:none;display:inline-flex;align-items:center;gap:8px;padding:0 14px;border-radius:999px;font-size:13px;color:var(--cream);
  background:rgba(255,250,236,.06);box-shadow:inset 0 0 0 1px var(--hairline)}
.dp-switch__flag{width:8px;height:8px;border-radius:50%;background:var(--brass-hi)}

/* Sticky (solo móvil) */
.dp-sticky{position:fixed!important;left:0;right:0;bottom:0;z-index:50;padding:0 12px calc(12px + env(safe-area-inset-bottom));pointer-events:none;
  opacity:0;transform:translate3d(0,120%,0);transition:transform .55s ${BACK_OUT},opacity .3s}
.dp-sticky[data-visible=true]{opacity:1;transform:none}
html.dp-final-in .dp-sticky[data-visible=true]{opacity:0;transform:translate3d(0,120%,0)}
.dp-sticky__dock{pointer-events:auto;padding:7px;border-radius:999px;background:rgba(6,22,16,.62);
  -webkit-backdrop-filter:blur(20px) saturate(170%);backdrop-filter:blur(20px) saturate(170%);
  box-shadow:inset 0 0 0 1px rgba(244,236,220,.16),inset 0 1px 0 rgba(255,255,255,.12),0 20px 40px -12px rgba(0,0,0,.7)}
.dp-lite .dp-sticky__dock{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--glass-solid)}
.dp-sticky .dp-cta{min-height:56px}

/* Selector de país (dialog) */
.dp-dialog{border:0;padding:24px 20px 20px;width:min(92vw,420px);max-height:min(80dvh,640px);border-radius:28px;color:var(--cream);
  background:rgba(8,30,22,.82);-webkit-backdrop-filter:blur(28px) saturate(170%);backdrop-filter:blur(28px) saturate(170%);
  box-shadow:inset 0 0 0 1px rgba(244,236,220,.16),inset 0 1px 0 rgba(255,255,255,.14),0 40px 80px -20px rgba(0,0,0,.8);font-family:inherit}
.dp-dialog[open]{display:flex;flex-direction:column;gap:14px}
.dp-dialog::backdrop{background:rgba(2,9,6,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.dp-motion .dp-dialog[open]{animation:dp-pop .5s ${BACK_OUT}}
.dp-dialog__title{font-size:22px;font-weight:850;letter-spacing:-.025em}
.dp-dialog__search{width:100%;min-height:50px;padding:0 18px;border-radius:999px;border:0;font:inherit;font-size:16px;color:var(--cream);
  background:rgba(0,0,0,.28);box-shadow:inset 0 0 0 1px var(--hairline);outline:none}
.dp-dialog__search::placeholder{color:var(--cream-faint)}
.dp-dialog__search:focus{box-shadow:inset 0 0 0 1.5px var(--brass)}
.dp-dialog__list{overflow:auto;display:grid;gap:2px;margin:0 -6px;padding:0 6px;overscroll-behavior:contain}
.dp-dialog__item{width:100%;min-height:50px;padding:0 16px;border:0;border-radius:16px;text-align:left;font:inherit;font-size:16px;font-weight:600;
  color:var(--cream);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:space-between}
.dp-dialog__item:hover{background:rgba(255,250,236,.07)}
.dp-dialog__item[aria-current=true]{background:rgba(201,164,101,.16);color:var(--brass-hi)}
.dp-dialog__item[aria-current=true]::after{content:'';width:10px;height:10px;border-radius:50%;background:var(--brass-hi)}
.dp-dialog__close{min-height:50px;border:0;border-radius:999px;font:inherit;font-weight:750;color:var(--cream);background:rgba(255,250,236,.08);
  box-shadow:inset 0 0 0 1px var(--hairline);cursor:pointer}

/* Pop-in tarjeta a tarjeta */
.dp-motion [data-pop]{opacity:0;transform:translate3d(0,20px,0) scale(.92);
  transition:opacity .6s ${EASE_OUT},transform .7s ${BACK_OUT};transition-delay:calc(var(--i,0)*100ms)}
.dp-motion [data-pop][data-in]{opacity:1;transform:none}
.dp-motion .dp-how__grid [data-pop]{transition-delay:calc(var(--i,0)*100ms)}

/* ───── Escritorio ───── */
@media (min-width:760px){
  .dp-top{padding:22px 40px 0}
  .dp-hero{padding:56px 40px 0}
  .dp-sec{padding:160px 40px 0}
  .dp-how__grid{grid-template-columns:repeat(2,1fr);gap:18px}
  .dp-crit{padding:32px 30px 34px}
  .dp-rest{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
  .dp-faq__list{padding:8px 34px}
  .dp-final__card{padding:72px 48px 52px}
  .dp-foot{padding:80px 40px 60px}
}
@media (min-width:1024px){
  .dp-hero:not(.dp-hero--fallback){display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);column-gap:72px;align-items:center;min-height:calc(100vh - 120px);padding-top:24px}
  .dp-hero__copy{grid-column:1;grid-row:1}
  .dp-stage{grid-column:2;grid-row:1 / span 2;margin:0;padding:40px 0}
  .dp-hero__foot{grid-column:1;grid-row:2;align-self:start;margin-top:28px}
  .dp-hero__copy{align-self:end}
  .dp-h1{font-size:clamp(56px,5.6vw,86px)}
  .dp-hero__sub{font-size:19px;max-width:30em}
  .dp-table{padding:34px 32px 30px}
  .dp-par--1{left:-58px;top:-26px}
  .dp-par--1 .dp-ball{--s:120px!important}
  .dp-par--2{right:-30px;top:-34px}
  .dp-par--3{right:-44px;bottom:-12px}
  .dp-par--3 .dp-ball{--s:96px!important}
  .dp-par--4{left:-36px;bottom:40px}
  .dp-sec__head{margin-bottom:56px}
  .dp-ranking .dp-sec__head,.dp-how .dp-sec__head,.dp-steps-sec .dp-sec__head,.dp-faq .dp-sec__head{max-width:760px}
  .dp-feat{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:48px;padding:48px 44px 40px;align-items:start}
  .dp-feat .dp-op{grid-column:1 / -1;margin-bottom:8px}
  .dp-feat__body{grid-column:1 / -1;grid-template-columns:1fr 1fr;column-gap:48px}
  .dp-feat .dp-cta2{grid-column:2;justify-self:end;width:auto;min-width:300px}
  .dp-feat__ball{right:40px;top:-42px}
  .dp-feat__ball{--s:96px!important}
  .dp-spec{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:56px;align-items:start}
  .dp-spec__head{flex-direction:column;align-items:flex-start;position:sticky;top:120px}
  .dp-spec__card{padding:40px}
  .dp-how__grid--4,.dp-how__grid--3{grid-template-columns:repeat(2,1fr)}
  .dp-steps{grid-template-columns:repeat(3,1fr);gap:40px;padding:0}
  .dp-step::before{display:none}
  .dp-steps__line{display:block;position:absolute;left:30px;right:calc((100% - 80px)/3 - 28px);top:28px;bottom:auto;height:0;width:auto;border-left:0;border-top:2px dashed rgba(244,236,220,.22)}
  .dp-steps__cue{left:0;right:0;top:13px;bottom:auto;width:auto;height:30px}
  .dp-steps__cue .dp-ball{top:0;left:0}
  .dp-motion .dp-steps[data-in] .dp-steps__cue{animation-name:dp-cue-x}
  @keyframes dp-cue-x{0%{opacity:0;transform:translate3d(-20px,0,0)}12%{opacity:1}100%{opacity:1;transform:translate3d(calc(100% - 30px - 33.3% + 13px),0,0)}}
  .dp-step{grid-template-columns:1fr;gap:24px}
  .dp-step__ball{margin-left:2px}
  .dp-final__card{padding:96px 64px 64px}
  .dp-final__balls{margin-top:-140px}
  .dp-final .dp-h2{max-width:16em}
  .dp-sticky{display:none}
  .dp-foot__inner{grid-template-columns:1fr 1fr;column-gap:64px}
  .dp-foot__disc,.dp-foot__legal,.dp-foot__row,.dp-foot__sights{grid-column:1 / -1}
}

@media (prefers-reduced-motion:reduce){
  .dp *,.dp *::before,.dp *::after{animation:none!important;transition:none!important}
  .dp-lamp,.dp [data-pop],.dp-in,.dp-stage__card{opacity:1!important;transform:none!important}
}
`;

/** CSS minificado de forma ligera (comentarios y espacios). */
export const css = raw
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\n\s*/g, '')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}');
