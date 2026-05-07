
// ── NAV SCROLL ──
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
  const p=document.getElementById('progress');
  const pct=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  p.style.width=pct+'%';
});

// ── HAMBURGER ──
const ham=document.getElementById('ham');
const mobileNav=document.getElementById('mobile-nav');
ham.addEventListener('click',()=>{
  mobileNav.classList.toggle('open');
  const spans=ham.querySelectorAll('span');
  if(mobileNav.classList.contains('open')){spans[0].style.transform='rotate(45deg) translate(5px,5px)';spans[1].style.opacity='0';spans[2].style.transform='rotate(-45deg) translate(5px,-5px)'}
  else{spans.forEach(s=>{s.style.transform='';s.style.opacity=''})}
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');ham.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity=''})}));

// ── REVEAL ON SCROLL ──
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.querySelector('.stat-num')){animateCount(e.target.querySelector('.stat-num'))}}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ── COUNT UP ──
function animateCount(el){
  const target=+el.dataset.count;
  let start=0;
  const step=()=>{start=Math.min(start+Math.ceil(target/50),target);el.textContent=start;if(start<target)requestAnimationFrame(step)};
  step();
}

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!wasOpen)item.classList.add('open');
  });
});

// ── CARD GLOW ──
function cardGlow(e,el){
  const r=el.getBoundingClientRect();
  el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
  el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
}

// ── LANGUAGE ──
let currentLang='sr';
function setLang(lang){
  currentLang=lang;
  document.documentElement.lang=lang==='sr'?'sr':'en';
  document.getElementById('btn-sr').classList.toggle('active',lang==='sr');
  document.getElementById('btn-en').classList.toggle('active',lang==='en');
  document.querySelectorAll('[data-sr]').forEach(el=>{
    const val=lang==='sr'?el.dataset.sr:el.dataset.en;
    if(!val)return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){el.placeholder=val;return;}
    if(el.innerHTML.includes('<')){el.innerHTML=val;return;}
    el.textContent=val;
  });
  document.querySelectorAll('textarea').forEach(t=>{
    if(lang==='en'&&t.dataset.enPlaceholder)t.placeholder=t.dataset.enPlaceholder;
    else t.placeholder='Opišite vaš projekat...';
  });
}
document.getElementById('btn-sr').addEventListener('click',()=>setLang('sr'));
document.getElementById('btn-en').addEventListener('click',()=>setLang('en'));

// ── FORM SUBMIT ──
async function handleSubmit(e){
  e.preventDefault();
  const form=e.target;
  const btn=form.querySelector('.submit-btn span');
  btn.textContent=currentLang==='en'?'Sending…':'Slanje…';
  try{
    const res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    const data=await res.json();
    if(data.success){
      btn.textContent=currentLang==='en'?'✓ Message sent!':'✓ Poruka poslata!';
      form.reset();
    }else{
      btn.textContent=currentLang==='en'?'✗ Error, try again':'✗ Greška, pokušaj ponovo';
    }
  }catch{
    btn.textContent=currentLang==='en'?'✗ Error, try again':'✗ Greška, pokušaj ponovo';
  }
  setTimeout(()=>{btn.textContent=currentLang==='en'?'Send Message →':'Pošalji poruku →'},3000);
}

// ── MARQUEE clone (seamless) ──
(function(){
  const track=document.getElementById('marquee-track');
  track.innerHTML+=track.innerHTML;
})();
