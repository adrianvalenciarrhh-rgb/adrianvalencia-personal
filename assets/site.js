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
const ci=[];
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

// ---- R2: reel (tilt 3D, etiqueta que sigue al cursor, modal YouTube)
const reel=document.querySelector('.reel'),modal=document.querySelector('.modal');
if(reel&&modal){const fine=matchMedia('(pointer:fine)').matches;
 if(fine&&!rm){let tx=0,ty=0,cx=0,cy=0,raf2=0;const run=()=>{cx+=(tx-cx)*.1;cy+=(ty-cy)*.1;reel.style.setProperty('--ry',cx.toFixed(2)+'deg');reel.style.setProperty('--rx',cy.toFixed(2)+'deg');if(Math.abs(tx-cx)+Math.abs(ty-cy)>.01)raf2=requestAnimationFrame(run);else raf2=0};
  reel.addEventListener('pointermove',e=>{const b=reel.getBoundingClientRect();const dx=Math.max(-.5,Math.min(.5,(e.clientX-b.left)/b.width-.5)),dy=Math.max(-.5,Math.min(.5,(e.clientY-b.top)/b.height-.5));const k=1+Math.hypot(dx,dy)*.8;tx=dx*8*k;ty=-dy*8*k;reel.classList.add('on');if(!raf2)raf2=requestAnimationFrame(run)});
  reel.addEventListener('pointerleave',()=>{tx=0;ty=0;if(!raf2)raf2=requestAnimationFrame(run);setTimeout(()=>reel.classList.remove('on'),600)});}
 const box=modal.querySelector('.modal-v'),x=modal.querySelector('.modal-x');let last=null;
 const close=()=>{modal.classList.remove('open');document.documentElement.classList.remove('lock');setTimeout(()=>{modal.hidden=true;box.innerHTML=''},rm?0:350);document.removeEventListener('keydown',key);if(last)last.focus()};
 const key=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();x.focus()}};
 reel.addEventListener('click',()=>{last=reel;box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${modal.dataset.yt}?autoplay=1&rel=0&playsinline=1" title="Reel de Adrián Valencia" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;modal.hidden=false;document.documentElement.classList.add('lock');requestAnimationFrame(()=>modal.classList.add('open'));x.focus();document.addEventListener('keydown',key)});
 x.addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});}
// ---- R2: bucle de animación ligado al scroll (solo elementos visibles)
const vis=new Set();const vo=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target)),{rootMargin:'20% 0px'});
const drift=[...document.querySelectorAll('[data-drift]')].map(el=>({el,k:+el.dataset.drift,c:0}));drift.forEach(d=>vo.observe(d.el));
const s05w=document.querySelector('.s05-w'),s05t=document.querySelector('.s05-t');let tcur=null;if(s05w)vo.observe(s05w);
const helix=document.querySelector('.s09'),hi=helix?[...helix.querySelectorAll('.ci')]:[];if(helix)vo.observe(helix);
const posts=[...document.querySelectorAll('.posts')];posts.forEach(p=>{vo.observe(p);p._a=0;p._h=false;p.addEventListener('pointerenter',()=>p._h=true);p.addEventListener('pointerleave',()=>p._h=false)});
const desk=()=>innerWidth>809;
function helixAt(p){const n=hi.length,R=desk()?Math.min(440,innerWidth*.3):innerWidth*.32,step=desk()?150:95;hi.forEach((el,i)=>{const a=(i/n)*Math.PI*4-p*Math.PI*3;const y=(i-(n-1)/2)*step-(p-.5)*step*n*.9;const z=Math.cos(a)*R;el.style.setProperty('--hx',(Math.sin(a)*R).toFixed(1)+'px');el.style.setProperty('--hy',y.toFixed(1)+'px');el.style.setProperty('--hz',z.toFixed(1)+'px');el.style.setProperty('--ha',(a*180/Math.PI).toFixed(1)+'deg');const o=Math.max(0,1-Math.max(0,Math.abs(y)-260)/160);el.style.setProperty('--o',o.toFixed(2));el.style.setProperty('--b',(.45+.45*(z/R+1)/2).toFixed(2));el.style.zIndex=Math.round(z+1000)})}
if(hi.length&&rm)helixAt(.5);
let t0=performance.now();
function tick(now){const t=(now-t0)/1000;const vh=innerHeight;
 if(!rm){for(const d of drift){if(!vis.has(d.el)||!desk())continue;const b=d.el.parentNode.getBoundingClientRect();const tg=(vh/2-(b.top+b.height/2))*d.k;d.c+=(tg-d.c)*.06;d.el.style.transform=`translate3d(0,${d.c.toFixed(2)}px,0) rotate(${(d.c*.01).toFixed(3)}deg)`}
 if(hi.length&&vis.has(helix)){const b=helix.getBoundingClientRect();helixAt(Math.min(1,Math.max(0,-b.top/(b.height-vh))))}
 for(const p of posts){if(!vis.has(p))continue;p._a+=((p._h?1:0)-p._a)*.04;if(p._a<.002&&!p._h){if(p._z)continue;p._z=1}else p._z=0;[...p.querySelectorAll('.pi')].forEach((el,i)=>{const x=el.offsetLeft;const ty=Math.sin(t*1.3+x*.006)*14*p._a,tx=Math.cos(t*.9+x*.004)*8*p._a;el.style.setProperty('--tx',tx.toFixed(2)+'px');el.style.setProperty('--ty',ty.toFixed(2)+'px')})}}
 requestAnimationFrame(tick)}
requestAnimationFrame(tick);
})();
