const PHONE = '+36203574684';

// Hívj gomb (csak fent)
const callBtn = document.getElementById('callBtnTop');
if (callBtn) {
  callBtn.href = 'tel:' + PHONE.replace(/\s+/g, '');
  callBtn.title = 'Hívás: ' + PHONE;
}

// Magas kontraszt mód
const key = 'prefersHighContrast';
const btn = document.getElementById('toggleContrast');
const apply = on => {
  document.body.classList.toggle('hc', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.textContent = on ? '🌗 Normál mód' : '🌓 Magas kontraszt';
};
if (localStorage.getItem(key) === '1') apply(true);
btn.addEventListener('click', () => {
  const on = !document.body.classList.contains('hc');
  apply(on);
  localStorage.setItem(key, on ? '1' : '0');
});

// Accordion: egyszerre csak egy legyen nyitva
const all = Array.from(document.querySelectorAll('.acc details'));
all.forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) all.forEach(o => { if (o !== d) o.open = false; });
  });
});

// Aktuális év láblécbe
document.getElementById('y').textContent = new Date().getFullYear();

/* ==== Statikus vélemény-karuszell ==== */
/* Szerkeszthető lista – írd át saját nevekre/szövegekre */
const REVIEWS = [
  {
    name: 'Mark L.',
    rating: 5,
    text: 'Ildikónál már többször voltam. Masszázs közben teljesen ellazulok – bátran ajánlom!'
  },
  {
    name: 'Malna M.',
    rating: 5,
    text: 'Anyukám ajánlotta, mert neki már segített a hátfájásán. Nekem is sokat javított!'
  },
  {
    name: 'Miklósné Sz.',
    rating: 5,
    text: 'A vállam és nyakam körül volt nagy fájdalmam, a kezelés után megszűnt. Köszönöm!'
  },
  {
    name: 'Tünde I.',
    rating: 5,
    text: 'Hónapok óta járok – komoly javulást érzek, sokkal szabadabban mozgok és jobban alszom.'
  },
  {
    name: 'Gábor',
    rating: 4,
    text: 'Profi, kedves, türelmes. Egy kezelés után érezhető könnyebbség volt a derekamban.'
  }
];

(function initReviews(){
  const track = document.getElementById('reviewsTrack');
  if(!track) return;

  // építsük fel a kártyákat
  const stars = n => '★'.repeat(n) + '☆'.repeat(5-n);
  track.innerHTML = REVIEWS.map(r => `
    <article class="rev-card">
      <header class="rev-head">
        <span class="rev-name">${r.name}</span>
        <span class="rev-stars" aria-label="Értékelés: ${r.rating} / 5">${stars(r.rating)}</span>
      </header>
      <p class="rev-text">${(r.text||'').replace(/</g,'&lt;')}</p>
    </article>
  `).join('');

  const dotsWrap = document.getElementById('reviewsDots');
  dotsWrap.innerHTML = REVIEWS.map((_,i)=>`<span class="rev-dot" data-i="${i}"></span>`).join('');

  const prevBtn = document.querySelector('.rev-arrow.prev');
  const nextBtn = document.querySelector('.rev-arrow.next');
  const dots = Array.from(dotsWrap.querySelectorAll('.rev-dot'));

  let i = 0;
  const update = () => {
    track.style.transform = `translateX(${-i*100}%)`;
    dots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
  };
  update();

  prevBtn.addEventListener('click', ()=>{ i = (i-1+REVIEWS.length)%REVIEWS.length; update(); });
  nextBtn.addEventListener('click', ()=>{ i = (i+1)%REVIEWS.length; update(); });
  dots.forEach(d=>d.addEventListener('click', ()=>{ i = +d.dataset.i; update(); }));

  // billentyűk (bal/jobb)
  document.addEventListener('keydown', e=>{
    if(e.key==='ArrowLeft'){ prevBtn.click(); }
    if(e.key==='ArrowRight'){ nextBtn.click(); }
  });

  // swipe mobilon
  let x0=null;
  track.addEventListener('touchstart', e=>{ x0=e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e=>{
    if(x0==null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if(Math.abs(dx)>40){ dx<0 ? nextBtn.click() : prevBtn.click(); }
    x0=null;
  });
})();
