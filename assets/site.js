/* Sitio estático hecho a mano — JS ligero propio (sin dependencias). */
(()=>{const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Aparición al hacer scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
// Cabecera: se oculta al bajar y aparece al subir
const hdr=document.querySelector('.hdr');let ly=scrollY;
// Texto que se ilumina letra a letra con el scroll
const cr=document.querySelector('.creveal');let chars=[];
if(cr){const t=cr.textContent;cr.setAttribute('aria-label',t);cr.innerHTML=[...t].map(c=>`<span aria-hidden="true">${c}</span>`).join('');chars=[...cr.children];}
const cult=document.querySelector('.s09');const ci=cult?[...cult.querySelectorAll('.ci')]:[];
function onScroll(){const y=scrollY;if(hdr){hdr.classList.toggle('hide',y>ly&&y>200);}ly=y;
 if(chars.length){const r=cr.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.35)));const n=Math.round(p*chars.length);chars.forEach((c,i)=>c.classList.toggle('on',i<n));}
 if(ci.length&&innerWidth>809){const r=cult.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));ci.forEach((el,i)=>{const t=p*1.4-i*.12;const x=+getComputedStyle(el).getPropertyValue('--x');const side=x>860?1:-1;el.style.setProperty('--z',(-900+t*1500).toFixed(1));el.style.setProperty('--ry',(side*-18*(1-Math.min(1,Math.max(0,t)))).toFixed(2));el.style.setProperty('--dx',(side*t*260).toFixed(1));el.style.setProperty('--dy',(t*-80).toFixed(1));el.style.setProperty('--o',(t<-.1?0:t>1.05?Math.max(0,1-(t-1.05)*4):1).toFixed(3));});}}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// Scroll suave (rueda de ratón; desactivado en táctil y con reduced-motion)
if(!rm&&matchMedia('(pointer:fine)').matches){let target=scrollY,cur=scrollY,raf=0;const max=()=>document.documentElement.scrollHeight-innerHeight;
 const step=()=>{cur+=(target-cur)*.1;if(Math.abs(target-cur)<.5){cur=target;raf=0;scrollTo(0,cur);return}scrollTo(0,cur);raf=requestAnimationFrame(step)};
 addEventListener('wheel',e=>{if(e.ctrlKey||e.target.closest('iframe,.spot-panel'))return;e.preventDefault();if(!raf){target=cur=scrollY}target=Math.max(0,Math.min(max(),target+e.deltaY*(e.deltaMode===1?40:1)));if(!raf)raf=requestAnimationFrame(step)},{passive:false});
 addEventListener('keydown',()=>{if(raf){cancelAnimationFrame(raf);raf=0}});
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);const el=id?document.getElementById(id):null;e.preventDefault();target=el?el.getBoundingClientRect().top+scrollY:0;if(id==='top')target=0;cur=scrollY;if(!raf)raf=requestAnimationFrame(step)});}
// FAQ acordeón
document.querySelectorAll('.faq-q').forEach(b=>b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o))}));
// Botón flotante de Spotify (el iframe solo se carga al abrirlo)
const sb=document.querySelector('.spot'),sp=document.querySelector('.spot-panel');
if(sb&&sp)sb.addEventListener('click',()=>{const o=sp.hidden;if(o&&!sp.firstChild)sp.innerHTML='<iframe src="https://open.spotify.com/embed/playlist/6QJf0xYg1cFt41ECWoVEH4?theme=1" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Playlist de Spotify"></iframe>';sp.hidden=!o;sb.setAttribute('aria-expanded',String(o))});
})();
