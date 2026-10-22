// [A2] DonPool · estilos (ronda 2). Se inyectan inline solo en las páginas de DonPool.
// Paleta en tokens.ts (variables --*). Solo se animan transform y opacity.

// Grano fino neutro (SVG, tile estático).
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const EASE_OUT = 'cubic-bezier(.16,1,.3,1)'; // expo.out
const BACK_OUT = 'cubic-bezier(.34,1.32,.64,1)'; // back.out(1.3)

const raw = /* css */ `
html{background:var(--ink1,#070708)}
.dp{position:relative;min-height:100vh;min-height:100dvh;color:var(--text);background:var(--ink1);
  font-family:var(--dp-font),system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:17px;line-height:1.6;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
  overflow-x:clip;-webkit-tap-highlight-color:transparent}
:where(.dp) *,:where(.dp) *::before,:where(.dp) *::after{box-sizing:border-box}
:where(.dp) :where(h1,h2,h3,p,ol,ul,dl,dd){margin:0;padding:0}
:where(.dp) :where(ol,ul){list-style:none}
:where(.dp) a{color:inherit}
:where(.dp) img{display:block;max-width:100%}
.dp ::selection{background:var(--red);color:var(--white)}
.dp :focus-visible{outline:2px solid var(--white);outline-offset:3px;border-radius:12px}

/* ───── Fondo: negro + focos rojos + cortes diagonales + grano ───── */
.dp-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;
  background:radial-gradient(120% 70% at 50% -20%,#1a0d0e 0%,var(--ink2) 34%,var(--ink1) 62%,var(--ink0) 100%)}
.dp-bg::before{content:'';position:absolute;inset:0;background-image:${GRAIN};background-size:160px;opacity:.07;mix-blend-mode:overlay}
.dp-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(130% 90% at 50% 30%,transparent 55%,rgba(0,0,0,.6) 100%)}
.dp-lamp{position:absolute;border-radius:50%;will-change:transform}
.dp-lamp--a{width:110vmax;height:80vmax;right:-46vmax;top:-44vmax;background:radial-gradient(closest-side,rgba(227,18,27,.34),rgba(227,18,27,.08) 55%,transparent)}
.dp-lamp--b{width:80vmax;height:80vmax;left:-46vmax;top:40vh;background:radial-gradient(closest-side,rgba(227,18,27,.16),transparent)}
.dp-lamp--c{width:70vmax;height:50vmax;left:-20vmax;top:-30vmax;background:radial-gradient(closest-side,rgba(255,255,255,.06),transparent)}
.dp-cuts{position:absolute;inset:-20% -20% auto -20%;height:120%;opacity:.9;
  background:repeating-linear-gradient(115deg,transparent 0 58px,rgba(255,255,255,.028) 58px 59px,transparent 59px 118px,rgba(227,18,27,.05) 118px 119px);
  -webkit-mask:radial-gradient(70% 60% at 70% 10%,#000,transparent 75%);mask:radial-gradient(70% 60% at 70% 10%,#000,transparent 75%)}
.dp-motion .dp-lamp--a{animation:dp-breathe 5s ease-in-out infinite alternate}
.dp-motion .dp-lamp--b{animation:dp-drift-b 20s ease-in-out infinite alternate}
.dp-motion .dp-lamp--c{animation:dp-drift-c 24s ease-in-out infinite alternate}
@keyframes dp-breathe{from{opacity:1;transform:scale(1)}to{opacity:.72;transform:scale(1.06)}}
@keyframes dp-drift-b{to{transform:translate3d(16vw,-10vh,0) scale(1.1)}}
@keyframes dp-drift-c{to{transform:translate3d(20vw,6vh,0) scale(.9)}}
.dp>*:not(.dp-bg){position:relative;z-index:1}

/* ───── Cristal negro con canto rojo ───── */
.dp-glass{position:relative;isolation:isolate;border-radius:var(--r-card);
  background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.015) 40%,rgba(0,0,0,.1)),var(--glass);
  -webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -1px 0 rgba(0,0,0,.4),0 30px 70px -24px rgba(0,0,0,.85),0 10px 26px -14px rgba(0,0,0,.6)}
.dp-glass::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(150deg,rgba(255,255,255,.46),rgba(255,255,255,.08) 26%,rgba(255,255,255,.02) 56%,rgba(227,18,27,.55));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.dp-glass::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;
  background:radial-gradient(90% 55% at 20% -8%,rgba(255,255,255,.12),transparent 62%),radial-gradient(70% 50% at 100% 100%,rgba(227,18,27,.12),transparent 70%)}
.dp-glass--red{background:linear-gradient(180deg,rgba(255,80,85,.14),rgba(227,18,27,.04) 45%,rgba(0,0,0,.1)),var(--glass)}
.dp-lite .dp-glass{-webkit-backdrop-filter:none;backdrop-filter:none;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(0,0,0,0)),var(--glass-solid)}
.dp-lite .dp-lamp{animation:none!important}

/* ───── Tipografía ───── */
.dp-eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted)}
.dp-h1{font-weight:900;font-size:clamp(36px,9.6vw,92px);line-height:.98;letter-spacing:-.048em;text-wrap:balance;margin-top:12px}
.dp-h1__a{color:var(--white)}
.dp-h1__b{display:block;background:linear-gradient(178deg,#fff 0%,#c9c9cf 45%,var(--steel) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.dp-h2{font-weight:900;font-size:clamp(32px,8.4vw,62px);line-height:1.02;letter-spacing:-.042em;text-wrap:balance;color:var(--white)}
.dp-h3{font-weight:800;font-size:19px;line-height:1.3;letter-spacing:-.02em;color:var(--white)}
.dp-lede{font-size:17px;line-height:1.6;color:var(--text-muted);max-width:36em;text-wrap:pretty}
.dp-label{font-size:11.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--text-faint)}

/* Corte diagonal */
.dp-slash{display:inline-flex;align-items:center;gap:4px;flex:none}
.dp-slash i{display:block;width:4px;height:16px;border-radius:1px;transform:skewX(-22deg);background:rgba(255,255,255,.28)}
.dp-slash i:first-child{background:var(--red);box-shadow:0 0 10px rgba(227,18,27,.8)}
.dp-slash i:nth-child(3){opacity:.5}

/* ───── Barra de confianza y cabecera ───── */
.dp-trust{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0 14px;min-height:34px;padding:6px 16px;
  font-size:11.5px;line-height:1.35;font-weight:650;letter-spacing:.04em;color:var(--text-muted);background:rgba(0,0,0,.6);
  border-bottom:1px solid rgba(227,18,27,.28);text-align:center}
.dp-trust__reg{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:var(--white);font-weight:750}
.dp-trust__reg img{height:16px;width:auto}
.dp-top{display:none;align-items:center;justify-content:space-between;max-width:1240px;margin:0 auto;padding:14px 20px 0}
.dp-who{display:flex;align-items:center;gap:12px}
.dp-who__txt{display:flex;flex-direction:column;line-height:1.2}
.dp-who__txt strong{font-size:15px;font-weight:850;letter-spacing:-.015em}
.dp-who__txt span{font-size:12.5px;color:var(--text-faint);font-weight:500}

/* Logo del canal (circular, tal cual) */
.dp-logo{position:relative;display:block;flex:none;width:var(--ls);height:var(--ls);border-radius:50%}
.dp-logo img{width:100%;height:100%;border-radius:50%;object-fit:cover}
.dp-logo--sm{box-shadow:0 0 0 1px rgba(227,18,27,.55),0 0 18px rgba(227,18,27,.35)}
.dp-logo--hero{--lsh:168px;width:var(--lsh);height:var(--lsh);box-shadow:0 0 0 1px rgba(255,255,255,.08),0 0 0 6px rgba(227,18,27,.10),0 30px 70px -10px rgba(0,0,0,.8)}

/* ───── Hero ───── */
.dp-hero{position:relative;max-width:1240px;margin:0 auto;padding:18px 20px 0}
.dp-hero::before{content:'';position:absolute;left:-10%;right:-10%;top:58%;height:2px;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(227,18,27,.7) 30%,rgba(255,255,255,.5) 52%,transparent 80%);transform:rotate(-14deg);opacity:.35}
.dp-hero__copy{position:relative;z-index:2}
.dp-stage{position:relative;margin-top:10px;padding-top:118px}
.dp-crest{position:absolute;right:-14px;top:-2px;z-index:0;width:168px;height:168px;pointer-events:none}
.dp-crest .dp-pitch{position:absolute;left:50%;top:50%;width:520px;height:520px;margin:-260px 0 0 -260px;opacity:.9}
.dp-crest__glow{position:absolute;inset:-30%;border-radius:50%;background:radial-gradient(closest-side,rgba(227,18,27,.55),rgba(227,18,27,.12) 60%,transparent);opacity:.8}
.dp-motion .dp-crest__glow{animation:dp-glow 4s ease-in-out infinite alternate}
@keyframes dp-glow{from{opacity:.55;transform:scale(.94)}to{opacity:.95;transform:scale(1.04)}}
.dp-crest__ball{position:absolute;left:-50px;bottom:50px;z-index:3}
.dp-stage__card{position:relative;z-index:2}
.dp-table{padding:20px 18px 20px}
.dp-table .dp-plaque{width:76px;height:40px;border-radius:12px}
.dp-table .dp-bonus{margin-top:16px}
.dp-table .dp-cta{font-size:16.5px;padding:0 20px}
.dp-table .dp-cta{margin-top:16px}
.dp-hero__foot{margin-top:26px;display:grid;gap:14px}
.dp-hero__sub{font-size:16px;line-height:1.58}
.dp-trustline{font-size:13.5px;line-height:1.55;color:var(--text-faint);font-weight:500}
.dp-country{font-size:14px;color:var(--text-muted);display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
.dp-switch{appearance:none;border:0;background:none;color:var(--white);font:inherit;font-weight:750;min-height:44px;padding:0 2px;cursor:pointer;
  text-decoration:underline;text-decoration-color:rgba(227,18,27,.9);text-decoration-thickness:2px;text-underline-offset:5px}
.dp-in{display:block}
.dp-motion .dp-in{animation:dp-in 1.1s ${EASE_OUT} backwards}
.dp-motion .dp-in--1{animation-delay:.15s;--fs:.92}
.dp-motion .dp-in--3{animation-delay:.6s;--fx:-30px;--fy:20px}
@keyframes dp-in{from{transform:translate3d(var(--fx,0),var(--fy,12px),0) scale(var(--fs,1))}to{transform:none}}
.dp-motion .dp-float{animation:dp-float 3.2s ease-in-out infinite alternate}
@keyframes dp-float{from{transform:translate3d(0,-4px,0)}to{transform:translate3d(0,5px,0)}}
.dp-motion .dp-stage__card .dp-table{animation:dp-rise .9s ${BACK_OUT} .05s backwards}
@keyframes dp-rise{from{transform:translate3d(0,18px,0) scale(.96)}to{transform:none}}
@keyframes dp-pop{from{opacity:0;transform:translate3d(0,20px,0) scale(.92)}to{opacity:1;transform:none}}
@supports (animation-timeline:scroll()){
  .dp-motion .dp-par{animation:dp-par linear both;animation-timeline:scroll(root);animation-range:0 90vh}
  @keyframes dp-par{to{transform:translate3d(0,-90px,0)}}
}

/* ───── Operador ───── */
.dp-op{display:flex;align-items:center;gap:14px;min-width:0}
.dp-op__txt{min-width:0}
.dp-op__name{font-weight:850;font-size:18px;letter-spacing:-.02em;line-height:1.25;color:var(--white)}
.dp-op__lic{font-size:12.5px;color:var(--text-faint);line-height:1.4;margin-top:2px;font-variant-numeric:tabular-nums}
.dp-op__lic span{color:var(--text-muted);font-weight:650}
.dp-plaque{display:grid;place-items:center;flex:none;width:92px;height:46px;padding:6px 8px;border-radius:14px;
  background:linear-gradient(180deg,#fff,#e6e6ea);box-shadow:inset 0 1px 0 #fff,0 6px 16px -6px rgba(0,0,0,.7)}
.dp-plaque img{width:100%;height:100%;object-fit:contain;border-radius:6px}
.dp-plaque--lg{width:116px;height:56px;border-radius:16px}

/* ───── Bono ───── */
.dp-bonus{margin-top:22px}
.dp-bonus__h{font-weight:900;letter-spacing:-.035em;line-height:1.05;margin-top:8px;font-variant-numeric:tabular-nums;text-wrap:balance;color:var(--white)}
.dp-bonus--xl .dp-bonus__h{font-size:clamp(28px,7.6vw,40px)}
.dp-bonus--md .dp-bonus__h{font-size:clamp(26px,6.6vw,36px)}
.dp-bonus--sm .dp-bonus__h{font-size:21px}
.dp-terms{margin-top:12px;font-size:13.5px;line-height:1.55;color:var(--text-muted);padding-left:12px;border-left:2px solid rgba(255,255,255,.16)}
.dp-terms a{color:var(--white);font-weight:700;text-decoration:underline;text-decoration-color:rgba(227,18,27,.9);text-underline-offset:3px;
  display:inline-block;padding:6px 0;margin:-6px 0}
.dp-bonus .dp-cta+.dp-terms,.dp-bonus .dp-cta2+.dp-terms{margin-top:16px}
.dp-bonus .dp-cta2{margin-top:20px}
.dp-valid{display:inline-flex;align-items:center;gap:8px;margin-top:12px;font-size:13px;font-weight:650;color:var(--white);
  padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px var(--hairline);font-variant-numeric:tabular-nums}
.dp-valid__dot{width:6px;height:6px;border-radius:50%;background:var(--white)}

/* ───── CTA: rojo del logo, el único color de acción ───── */
.dp-cta{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:12px;
  min-height:58px;padding:0 26px;border-radius:var(--r-pill);text-decoration:none;
  font-size:17px;font-weight:850;letter-spacing:-.015em;line-height:1.2;text-align:center;color:var(--cta-text);
  background:linear-gradient(180deg,var(--red-hi) 0%,var(--red) 52%,#B60C13 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -2px 0 rgba(0,0,0,.22),0 0 0 1px rgba(255,90,95,.45),0 18px 44px -10px rgba(227,18,27,.75),0 6px 14px -4px rgba(0,0,0,.6);
  text-shadow:0 1px 0 rgba(0,0,0,.18);transition:transform .25s ${BACK_OUT}}
.dp-cta:active{transform:scale(.97)}
@media (hover:hover){.dp-cta:hover{transform:translate3d(0,-2px,0)}}
.dp-cta::after{content:'';position:absolute;z-index:-1;top:-30%;bottom:-30%;left:0;width:36%;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.6) 50%,transparent);transform:translate3d(-170%,0,0) skewX(-20deg)}
.dp-motion .dp-cta::after{animation:dp-shine 4s cubic-bezier(.45,0,.2,1) 1.4s infinite}
@keyframes dp-shine{0%{transform:translate3d(-170%,0,0) skewX(-20deg)}24%,100%{transform:translate3d(400%,0,0) skewX(-20deg)}}
.dp-cta--lg{min-height:62px;font-size:17.5px}
.dp-cta--block{display:flex;width:100%}
.dp-arrow{flex:none;width:30px;height:30px;padding:6px;border-radius:50%;background:var(--white);color:var(--red)}
/* Secundario: cristal con borde blanco (nunca rojo relleno) */
.dp-cta2{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 22px;border-radius:var(--r-pill);
  font-size:15.5px;font-weight:800;text-decoration:none;color:var(--white);background:rgba(255,255,255,.05);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.3),inset 0 1px 0 rgba(255,255,255,.12);transition:transform .25s ${BACK_OUT},background-color .25s}
.dp-cta2 .dp-arrow{width:26px;height:26px;padding:5px;background:rgba(255,255,255,.12);color:var(--white)}
.dp-cta2:active{transform:scale(.97)}
@media (hover:hover){.dp-cta2:hover{background:rgba(255,255,255,.1)}}
.dp-cta2--strong{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7),inset 0 1px 0 rgba(255,255,255,.15)}

/* ───── Secciones ───── */
.dp-sec{max-width:1240px;margin:0 auto;padding:116px 20px 0}
.dp-sec__head{display:grid;gap:18px;justify-items:start;margin-bottom:40px}
.dp-sec__head .dp-lede{margin-top:-4px}

/* Dorsal del ranking */
.dp-rank{display:inline-grid;place-items:center;flex:none;width:46px;height:36px;border-radius:8px;transform:skewX(-14deg);
  background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.dp-rank span{display:block;transform:skewX(14deg);font-weight:900;font-size:17px;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--white)}
.dp-rank--1{background:linear-gradient(180deg,var(--red-hi),var(--red) 60%,var(--red-lo));box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 8px 22px -6px rgba(227,18,27,.7)}
.dp-rank--lg{width:64px;height:48px;border-radius:10px}
.dp-rank--lg span{font-size:24px}

/* Single: ficha de producto */
.dp-spec__head{display:flex;align-items:center;gap:18px;margin-bottom:28px}
.dp-spec__head .dp-op__name{font-size:clamp(22px,6vw,48px);font-weight:900;letter-spacing:-.04em}
.dp-spec__card{padding:26px 22px 24px;display:grid;gap:24px}
.dp-spec__card .dp-bonus{margin-top:0}
.dp-spec__card .dp-cta2{width:100%}

/* Ficha técnica */
.dp-specs{display:grid;border-top:1px solid var(--hairline)}
.dp-specs__row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:14px 0;border-bottom:1px solid var(--hairline)}
.dp-specs dt{font-size:13.5px;color:var(--text-muted);font-weight:550}
.dp-specs dd{font-size:15px;font-weight:750;text-align:right;font-variant-numeric:tabular-nums;color:var(--white)}
.dp-chips{display:inline-flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}
.dp-chip{font-size:12.5px;font-weight:650;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px var(--hairline)}
.dp-rating{display:inline-flex;align-items:center;gap:6px}
.dp-rating__n{font-weight:900;font-size:17px}
.dp-rating__of{color:var(--text-faint);font-weight:600}
.dp-rating__dots{display:inline-flex;gap:3px;margin-left:4px}
.dp-rating__dots i{width:8px;height:8px;border-radius:50%;background:var(--white)}
.dp-rating__dots i:nth-child(2){opacity:calc(min(1,max(.18,var(--v)*5 - 1)))}
.dp-rating__dots i:nth-child(3){opacity:calc(min(1,max(.18,var(--v)*5 - 2)))}
.dp-rating__dots i:nth-child(4){opacity:calc(min(1,max(.18,var(--v)*5 - 3)))}
.dp-rating__dots i:nth-child(5){opacity:calc(min(1,max(.18,var(--v)*5 - 4)))}

/* Ranking */
.dp-track{display:block}
.dp-feat{padding:36px 22px 24px;display:grid;gap:4px;margin-top:22px;
  background:linear-gradient(180deg,rgba(255,80,85,.13),rgba(227,18,27,.03) 45%,rgba(0,0,0,.1)),var(--glass)}
.dp-feat__rank{position:absolute;right:20px;top:-24px}
.dp-feat .dp-op{padding-right:56px}
.dp-feat__body{display:grid;gap:22px}
.dp-feat .dp-specs{margin-top:2px}
.dp-feat .dp-cta2{margin-top:22px;width:100%}
.dp-badge{position:absolute;left:22px;top:-15px;display:inline-flex;align-items:center;height:30px;padding:0 16px;border-radius:8px;transform:skewX(-14deg);
  font-size:11.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--ink0);background:var(--white);
  box-shadow:-5px 0 0 0 var(--red),0 10px 22px -8px rgba(0,0,0,.8)}
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
.dp-crit{padding:24px 22px 26px;display:grid;gap:10px;align-content:start;overflow:hidden}
.dp-crit__n{font-size:44px;font-weight:900;letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.2);display:flex;align-items:center;gap:14px}
.dp-crit__n::after{content:'';width:22px;height:4px;border-radius:1px;transform:skewX(-22deg);background:var(--red);box-shadow:0 0 10px rgba(227,18,27,.7)}
.dp-crit p{font-size:15.5px;line-height:1.62;color:var(--text-muted)}

/* 3 pasos: el balón recorre la línea */
.dp-estimate{display:inline-flex;align-items:center;gap:10px;height:36px;padding:0 16px 0 12px;border-radius:999px;font-size:14px;font-weight:750;
  background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px var(--hairline);font-variant-numeric:tabular-nums}
.dp-estimate__dot{width:8px;height:8px;border-radius:50%;background:var(--red);box-shadow:0 0 0 4px rgba(227,18,27,.2)}
.dp-steps{position:relative;display:grid;gap:44px}
.dp-steps__line{display:none}
.dp-step:not(:last-child)::before{content:'';position:absolute;left:27px;top:62px;bottom:-38px;border-left:2px dashed rgba(255,255,255,.18)}
.dp-steps__cue{position:absolute;left:13px;top:0;bottom:0;width:30px;z-index:2;pointer-events:none;opacity:0}
.dp-steps__cue .dp-ballfx{position:absolute;left:0;top:-4px}
.dp-step{position:relative;z-index:1;display:grid;grid-template-columns:56px 1fr;gap:20px;align-items:start}
.dp-step__n{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;font-weight:900;font-size:22px;font-variant-numeric:tabular-nums;color:var(--white);
  background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.16),rgba(255,255,255,.03) 60%),var(--ink2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.22),0 10px 24px -10px rgba(0,0,0,.8)}
.dp-step:first-of-type .dp-step__n{box-shadow:inset 0 0 0 1.5px var(--red),0 0 24px -4px rgba(227,18,27,.6)}
.dp-step p{margin-top:6px;font-size:15.5px;line-height:1.62;color:var(--text-muted)}
.dp-motion .dp-steps[data-in] .dp-steps__cue{animation:dp-cue-y 2.2s ${EASE_OUT} .35s both}
@keyframes dp-cue-y{0%{opacity:0;transform:translate3d(0,-20px,0)}12%{opacity:1}88%{opacity:1}100%{opacity:0;transform:translate3d(0,calc(100% - 30px),0)}}

/* FAQ */
.dp-faq__list{padding:6px 22px}
.dp-qa{border-bottom:1px solid var(--hairline)}
.dp-qa:last-child{border-bottom:0}
.dp-qa summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:66px;padding:16px 0;cursor:pointer;
  font-size:16.5px;font-weight:750;letter-spacing:-.012em;line-height:1.35;color:var(--white)}
.dp-qa summary::-webkit-details-marker{display:none}
.dp-qa__icon{position:relative;flex:none;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px var(--hairline);
  transition:transform .4s ${BACK_OUT}}
.dp-qa__icon::before,.dp-qa__icon::after{content:'';position:absolute;left:50%;top:50%;width:12px;height:2px;margin:-1px 0 0 -6px;border-radius:2px;background:var(--white)}
.dp-qa__icon::after{transform:rotate(90deg)}
.dp-qa[open] .dp-qa__icon{transform:rotate(45deg);box-shadow:inset 0 0 0 1.5px var(--red)}
.dp-qa p{padding:0 0 22px;font-size:15.5px;line-height:1.65;color:var(--text-muted);max-width:44em}
.dp-motion .dp-qa[open] p{animation:dp-fade .5s ${EASE_OUT}}
@keyframes dp-fade{from{opacity:0;transform:translate3d(0,-6px,0)}to{opacity:1;transform:none}}

/* CTA final */
.dp-final__card{padding:64px 24px 36px;display:grid;justify-items:center;text-align:center;gap:18px;overflow:hidden}
.dp-final__card::after{background:radial-gradient(70% 60% at 50% 0%,rgba(227,18,27,.28),transparent 70%),radial-gradient(90% 55% at 20% -8%,rgba(255,255,255,.1),transparent 62%)}
.dp-final__card .dp-lede{margin-bottom:10px}
.dp-final__card .dp-cta{width:100%;max-width:440px}
.dp-final__fx{position:absolute;right:-14px;top:-14px;opacity:.9;pointer-events:none}
.dp-final__ball{transform:rotate(-12deg)}

/* Juego responsable */
.dp-rg{padding-top:72px}
.dp-rg__inner{display:flex;gap:16px;align-items:flex-start;padding:20px 0;border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline)}
.dp-rg__age{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;font-weight:900;font-size:14px;letter-spacing:-.02em;
  color:var(--white);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.4)}
.dp-rg__msg{font-size:14px;line-height:1.5;color:var(--text);font-weight:600;margin-bottom:8px}
.dp-rg__help{font-size:14px;color:var(--text-muted);min-height:46px;display:flex;align-items:center;flex-wrap:wrap;gap:4px}
.dp-rg__help a{color:var(--white);font-weight:750;text-underline-offset:3px;text-decoration-color:rgba(227,18,27,.9)}

/* Fallback */
.dp-hero--fallback{position:relative;display:grid;justify-items:center;text-align:center;padding-top:56px;max-width:760px}
.dp-hero--fallback::before{display:none}
.dp-fb__stage{position:absolute;left:50%;top:-20px;width:560px;height:560px;margin-left:-280px;pointer-events:none;opacity:.45}
.dp-fb__stage .dp-pitch{width:100%;height:100%}
.dp-fb__crest{position:relative;margin-bottom:30px}
.dp-fb__crest .dp-crest__glow{inset:-34%}
.dp-fb__crest .dp-logo--hero{--lsh:180px}
.dp-hero--fallback .dp-lede{margin-top:22px}
.dp-fb__switch{margin-top:34px}
.dp-fb__switch .dp-cta2{flex-direction:column;gap:2px;min-height:64px;padding:10px 28px;line-height:1.3}
.dp-fb__change{font-size:13px;font-weight:650;color:var(--text-muted);letter-spacing:.02em}
.dp-socials{margin-top:40px;display:grid;justify-items:center;gap:14px}
.dp-socials ul{display:flex;gap:12px}
.dp-social{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px var(--hairline)}

/* Footer */
.dp-foot{padding:64px 20px 150px}
.dp-foot__inner{max-width:1240px;margin:0 auto;display:grid;gap:16px}
.dp-foot__brand{display:flex;align-items:center;gap:12px;font-size:17px;font-weight:900;letter-spacing:-.02em}
.dp-foot__tag{font-size:14px;color:var(--text-muted);max-width:40em}
.dp-foot__sights{margin:8px 0}
.dp-foot__disc{font-size:12.5px;line-height:1.65;color:var(--text-faint);max-width:62em}
.dp-foot__legal{display:flex;flex-wrap:wrap;gap:0 22px}
.dp-foot__legal a{display:inline-flex;align-items:center;min-height:44px;font-size:13.5px;font-weight:650;color:var(--text-muted);text-decoration:none}
.dp-foot__legal a:hover{color:var(--white)}
.dp-foot__row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;font-size:13px;color:var(--text-faint);padding-top:16px;border-top:1px solid var(--hairline)}
.dp-foot__row a{color:var(--text-muted);min-height:44px;display:inline-flex;align-items:center;text-underline-offset:3px}
.dp-switch--chip{text-decoration:none;display:inline-flex;align-items:center;gap:8px;padding:0 14px;border-radius:999px;font-size:13px;color:var(--white);
  background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px var(--hairline)}
.dp-switch__flag{width:8px;height:8px;border-radius:50%;background:var(--red)}

/* Sticky (solo móvil, compacto; el footer deja hueco para que no tape nada) */
.dp-sticky{position:fixed!important;left:0;right:0;bottom:0;z-index:50;padding:0 12px calc(12px + env(safe-area-inset-bottom));pointer-events:none;
  opacity:0;transform:translate3d(0,120%,0);transition:transform .55s ${BACK_OUT},opacity .3s}
.dp-sticky[data-visible=true]{opacity:1;transform:none}
html.dp-final-in .dp-sticky[data-visible=true]{opacity:0;transform:translate3d(0,120%,0)}
.dp-sticky__dock{pointer-events:auto;padding:6px;border-radius:999px;background:rgba(8,8,10,.6);
  -webkit-backdrop-filter:blur(20px) saturate(170%);backdrop-filter:blur(20px) saturate(170%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.1),0 20px 40px -12px rgba(0,0,0,.8)}
.dp-lite .dp-sticky__dock{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--glass-solid)}
.dp-sticky .dp-cta{min-height:54px;font-size:16px}

/* Selector de país (dialog) */
.dp-dialog{border:0;padding:24px 20px 20px;width:min(92vw,420px);max-height:min(80dvh,640px);border-radius:28px;color:var(--text);
  background:rgba(14,14,16,.84);-webkit-backdrop-filter:blur(28px) saturate(170%);backdrop-filter:blur(28px) saturate(170%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.14),0 40px 80px -20px rgba(0,0,0,.9);font-family:inherit}
.dp-dialog[open]{display:flex;flex-direction:column;gap:14px}
.dp-dialog::backdrop{background:rgba(0,0,0,.66);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.dp-motion .dp-dialog[open]{animation:dp-pop .5s ${BACK_OUT}}
.dp-dialog__title{font-size:22px;font-weight:900;letter-spacing:-.03em;color:var(--white)}
.dp-dialog__search{width:100%;min-height:50px;padding:0 18px;border-radius:999px;border:0;font:inherit;font-size:16px;color:var(--white);
  background:rgba(0,0,0,.4);box-shadow:inset 0 0 0 1px var(--hairline);outline:none}
.dp-dialog__search::placeholder{color:var(--text-faint)}
.dp-dialog__search:focus{box-shadow:inset 0 0 0 1.5px var(--white)}
.dp-dialog__list{overflow:auto;display:grid;gap:2px;margin:0 -6px;padding:0 6px;overscroll-behavior:contain}
.dp-dialog__item{width:100%;min-height:50px;padding:0 16px;border:0;border-radius:16px;text-align:left;font:inherit;font-size:16px;font-weight:650;
  color:var(--text);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:space-between}
.dp-dialog__item:hover{background:rgba(255,255,255,.07)}
.dp-dialog__item[aria-current=true]{background:rgba(255,255,255,.09);color:var(--white)}
.dp-dialog__item[aria-current=true]::after{content:'';width:10px;height:10px;border-radius:50%;background:var(--red)}
.dp-dialog__close{min-height:50px;border:0;border-radius:999px;font:inherit;font-weight:800;color:var(--white);background:rgba(255,255,255,.08);
  box-shadow:inset 0 0 0 1px var(--hairline);cursor:pointer}

/* Pop-in tarjeta a tarjeta */
.dp-motion [data-pop]{opacity:0;transform:translate3d(0,20px,0) scale(.92);
  transition:opacity .6s ${EASE_OUT},transform .7s ${BACK_OUT};transition-delay:calc(var(--i,0)*100ms)}
.dp-motion [data-pop][data-in]{opacity:1;transform:none}

/* ───── Escritorio ───── */
@media (min-width:760px){
  .dp-top{display:flex;padding:22px 40px 0}
  .dp-hero{padding:48px 40px 0}
  .dp-sec{padding:160px 40px 0}
  .dp-how__grid{grid-template-columns:repeat(2,1fr);gap:18px}
  .dp-crit{padding:32px 30px 34px}
  .dp-rest{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
  .dp-faq__list{padding:8px 34px}
  .dp-final__card{padding:80px 48px 52px}
  .dp-foot{padding:80px 40px 60px}
}
@media (min-width:1024px){
  .dp-hero:not(.dp-hero--fallback){display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);column-gap:72px;align-items:center;min-height:calc(100vh - 120px);padding-top:16px}
  .dp-hero::before{top:62%}
  .dp-hero__copy{grid-column:1;grid-row:1;align-self:end}
  .dp-stage{grid-column:2;grid-row:1 / span 2;margin:0;padding:330px 0 40px}
  .dp-hero__foot{grid-column:1;grid-row:2;align-self:start;margin-top:26px}
  .dp-h1{font-size:clamp(54px,5.4vw,84px)}
  .dp-hero__sub{font-size:19px;max-width:30em}
  .dp-crest{left:50%;right:auto;top:0;width:380px;height:380px;margin-left:-190px}
  .dp-crest .dp-logo--hero{--lsh:380px}
  .dp-crest .dp-pitch{width:820px;height:820px;margin:-410px 0 0 -410px}
  .dp-crest__ball{left:-30px;bottom:60px}
  .dp-stage__card{margin-left:-28px;margin-right:28px}
  .dp-table{padding:32px 32px 28px}
  .dp-table .dp-plaque{width:92px;height:46px}
  .dp-table .dp-bonus{margin-top:22px}
  .dp-table .dp-cta{font-size:17.5px;padding:0 26px;margin-top:20px}
  .dp-sec__head{margin-bottom:56px}
  .dp-ranking .dp-sec__head,.dp-how .dp-sec__head,.dp-steps-sec .dp-sec__head,.dp-faq .dp-sec__head{max-width:760px}
  .dp-feat{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:48px;padding:52px 44px 40px;align-items:start}
  .dp-feat .dp-op{grid-column:1 / -1;margin-bottom:8px}
  .dp-feat__body{grid-column:1 / -1;grid-template-columns:1fr 1fr;column-gap:48px}
  .dp-feat .dp-cta2{grid-column:2;justify-self:end;width:auto;min-width:300px}
  .dp-feat__rank{right:44px;top:-26px}
  .dp-spec{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:56px;align-items:start}
  .dp-spec__head{flex-direction:column;align-items:flex-start;position:sticky;top:120px}
  .dp-spec__card{padding:40px}
  .dp-steps{grid-template-columns:repeat(3,1fr);gap:40px}
  .dp-step::before{display:none}
  .dp-steps__line{display:block;position:absolute;left:30px;right:calc((100% - 80px)/3 - 28px);top:28px;height:0;border-top:2px dashed rgba(255,255,255,.18)}
  .dp-steps__cue{left:0;right:0;top:13px;bottom:auto;width:auto;height:30px}
  .dp-steps__cue .dp-ballfx{top:0;left:0}
  .dp-motion .dp-steps[data-in] .dp-steps__cue{animation-name:dp-cue-x}
  @keyframes dp-cue-x{0%{opacity:0;transform:translate3d(-20px,0,0)}12%{opacity:1}100%{opacity:1;transform:translate3d(calc(100% - 30px - 33.3% + 13px),0,0)}}
  .dp-step{grid-template-columns:1fr;gap:24px}
  .dp-final__card{padding:104px 64px 64px}
  .dp-final .dp-h2{max-width:16em}
  .dp-final__fx{right:60px;top:40px}
  .dp-sticky{display:none}
  .dp-foot__inner{grid-template-columns:1fr 1fr;column-gap:64px}
  .dp-foot__disc,.dp-foot__legal,.dp-foot__row,.dp-foot__sights{grid-column:1 / -1}
  .dp-fb__stage{width:900px;height:900px;margin-left:-450px;top:-200px}
  .dp-fb__crest .dp-logo--hero{--lsh:220px}
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
