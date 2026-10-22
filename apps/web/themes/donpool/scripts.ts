// [A2] Scripts inline (sin hidratar nada propio: 0 KB de JS de cliente del tema).

/** Antes del primer pintado: modo "lite" en Android modesto y activa el motion solo si se puede y se quiere. */
export const HEAD_SCRIPT = `(function(){try{var d=document.documentElement,n=navigator;
var low=/Android/i.test(n.userAgent)&&((n.hardwareConcurrency||8)<=4||(n.deviceMemory||8)<=4);
if(low||!(window.CSS&&CSS.supports&&(CSS.supports('backdrop-filter','blur(1px)')||CSS.supports('-webkit-backdrop-filter','blur(1px)'))))d.classList.add('dp-lite');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)d.classList.add('dp-motion');}catch(e){}})();`;

/**
 * Al final del body: pop-in tarjeta a tarjeta ([data-pop] → data-in) y oculta el sticky
 * mientras el CTA final está a la vista (nunca dos CTA primarios a la vez).
 */
export const TAIL_SCRIPT = `(function(){try{var d=document.documentElement;if(!('IntersectionObserver' in window))return;
if(d.classList.contains('dp-motion')){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-in','');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.12});
document.querySelectorAll('.dp [data-pop]').forEach(function(el){io.observe(el);});
setTimeout(function(){document.querySelectorAll('.dp [data-pop]:not([data-in])').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.setAttribute('data-in','');});},2500);}
var f=document.getElementById('dp-final');if(f){new IntersectionObserver(function(es){d.classList.toggle('dp-final-in',es[0].isIntersecting);},{threshold:.25}).observe(f);}
}catch(e){document.documentElement.classList.remove('dp-motion');}})();`;
