// [A2] Scripts inline del tema (0 KB de bundle, sin hidratación). Van en el HTML estático.

/** Antes del primer pintado: activa el pop-in, detecta gama baja y sincroniza el segundero con la hora real. */
export const headScript = (bg: string) => `(function(){var d=document.documentElement;d.classList.add('kr-js');d.style.background=${JSON.stringify(bg)};try{var n=navigator,m=n.deviceMemory||8,c=n.hardwareConcurrency||8;if(/Android/i.test(n.userAgent)&&(m<=4||c<=4))d.setAttribute('data-kr-lite','');var t=new Date(),sc=t.getSeconds()+t.getMilliseconds()/1e3,mn=t.getMinutes()*60+sc,hr=(t.getHours()%12)*3600+mn;d.style.setProperty('--kr-sec',-sc.toFixed(2)+'s');d.style.setProperty('--kr-min',-mn.toFixed(1)+'s');d.style.setProperty('--kr-hr',-hr.toFixed(0)+'s');}catch(e){}})();`;

/**
 * Al final de la página: pop-in por IntersectionObserver, anillos que se llenan con el scroll (--p de 0 a 1)
 * y ocultar el sticky mientras haya otro CTA primario a la vista.
 */
export const TAIL_SCRIPT = `(function(){var d=document.documentElement,w=window;try{
var rm=w.matchMedia('(prefers-reduced-motion: reduce)').matches,IO=w.IntersectionObserver;
var q=function(s){return [].slice.call(document.querySelectorAll(s))};
if(!IO||rm){d.classList.add('kr-nopop')}else{var io=new IO(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-in','');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.1});q('[data-pop]').forEach(function(el){io.observe(el)})}
var rings=q('[data-ring]'),raf=0;
var set=function(el,p){d.style.setProperty('--kr-p-'+el.getAttribute('data-ring'),p)};
var up=function(){raf=0;var vh=w.innerHeight,se=d.scrollHeight-vh;rings.forEach(function(el){var p;if(el.getAttribute('data-ring')==='page'){p=se>0?w.scrollY/se:1}else{var r=el.getBoundingClientRect();p=(vh*.92-r.top)/(vh*.55)}p=p<0?0:p>1?1:p;set(el,p.toFixed(3))})};
if(rm){rings.forEach(function(el){set(el,'1')})}else{w.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(up)},{passive:true});w.addEventListener('resize',up);up()}
var st=document.querySelector('[data-kr-sticky]'),pr=q('[data-kr-primary]');
if(st&&pr.length&&IO){var vis=[];var io2=new IO(function(es){es.forEach(function(e){var i=vis.indexOf(e.target);if(e.isIntersecting){if(i<0)vis.push(e.target)}else if(i>-1)vis.splice(i,1)});if(vis.length)st.setAttribute('data-kr-hide','');else st.removeAttribute('data-kr-hide')});pr.forEach(function(p){io2.observe(p)})}
}catch(e){d.classList.add('kr-nopop')}})();`;
