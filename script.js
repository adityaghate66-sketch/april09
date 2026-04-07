const cursor = document.getElementById('putti-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ─── STARS ───
const starsEl = document.getElementById('putti-stars');
for (let i = 0; i < 120; i++) {
  const s = document.createElement('div');
  s.className = 'putti-star';
  const size = Math.random() * 2.5 + 0.5;
  s.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    --dur:${Math.random()*3+2}s;
    animation-delay:${Math.random()*5}s;
  `;
  starsEl.appendChild(s);
}

// ─── FLOATING HEARTS ───
const heartEl = document.getElementById('putti-hearts');
const heartEmojis = ['💖','💗','💓','💕','✨','🌸','⭐','💫','🌟'];
for (let i = 0; i < 18; i++) {
  const h = document.createElement('div');
  h.className = 'putti-floatheart';
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.cssText = `
    left:${Math.random()*100}%;
    --s:${Math.random()*18+14}px;
    --d:${Math.random()*8+6}s;
    --dl:${Math.random()*8}s;
  `;
  heartEl.appendChild(h);
}

// ─── CONFETTI ───
const confWrap = document.getElementById('moulya-confetti');
const colors = ['#ff6b8a','#ffd700','#ff9a9e','#ffb3c6','#ff4d6d','#fff','#c2f0c2'];
function addConfetti(count) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'putti-piece';
    c.style.cssText = `
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --cd:${Math.random()*3+2}s;
      --cdl:${Math.random()*4}s;
      transform: rotate(${Math.random()*360}deg);
    `;
    confWrap.appendChild(c);
  }
}

// ─── TICKER ───
const tickerItems = [
  '🌸 Happy Birthday Moulya!',
  '💖 Wishing you all the happiness',
  '✨ You are so special',
  '🎂 Hope your day is magical',
  '💫 You light up every room',
  '🌟 Sending you all the love',
  '🎀 Another year more beautiful',
  '💐 You deserve the world',
];
const ticker = document.getElementById('moulya-ticker');
// Duplicate for seamless loop
[...tickerItems, ...tickerItems].forEach(txt => {
  const div = document.createElement('div');
  div.className = 'moulya-wish';
  div.innerHTML = `<span>${txt}</span>`;
  ticker.appendChild(div);
});

// ─── RIBBON DRAG SLIDER ───
const startScreen = document.getElementById('putti-screen');
const mainContent = document.getElementById('moulya-world');
const bowHandle   = document.getElementById('putti-bow');
const ribbonCut   = document.getElementById('putti-cut');
const ribbonSnip  = document.getElementById('putti-snip');
const sliderCont  = document.getElementById('putti-slider');

let isDragging = false;
let dragStartX = 0;
let bowStartLeft = 0; // px from left of container
let opened = false;

const THRESHOLD = 0.82; // 82% across = trigger

function getContainerRect() {
  return sliderCont.getBoundingClientRect();
}

function setBowPosition(px) {
  const rect = getContainerRect();
  const maxPx = rect.width;
  const clamped = Math.max(0, Math.min(px, maxPx));
  const pct = clamped / maxPx;

  // Move bow
  bowHandle.style.left = clamped + 'px';

  // Grow the darkened "cut" section
  ribbonCut.style.width = (pct * 100) + '%';

  // Move snip line
  ribbonSnip.style.left = (pct * 100) + '%';
  ribbonSnip.style.opacity = pct > 0.05 ? '1' : '0';

  // Slightly rotate bow as it drags
  const rot = pct * 25;
  bowHandle.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

  if (pct >= THRESHOLD && !opened) {
    triggerOpen();
  }
}

function getClientX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

bowHandle.addEventListener('mousedown', startDrag);
bowHandle.addEventListener('touchstart', startDrag, { passive: true });

function startDrag(e) {
  if (opened) return;
  isDragging = true;
  dragStartX = getClientX(e);
  bowStartLeft = bowHandle.offsetLeft;
  bowHandle.classList.add('dragging');
  e.stopPropagation();
}

document.addEventListener('mousemove', onDrag);
document.addEventListener('touchmove', onDrag, { passive: true });

function onDrag(e) {
  if (!isDragging) return;
  const dx = getClientX(e) - dragStartX;
  setBowPosition(bowStartLeft + dx);
}

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  bowHandle.classList.remove('dragging');
  if (!opened) {
    // Snap back with spring feel
    const startLeft = bowHandle.offsetLeft;
    const startTime = performance.now();
    const duration = 400;
    function springBack(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setBowPosition(startLeft * (1 - ease));
      if (t < 1) requestAnimationFrame(springBack);
    }
    requestAnimationFrame(springBack);
  }
}

function triggerOpen() {
  if (opened) return;
  opened = true;
  bowHandle.classList.add('success');
  ribbonSnip.style.background = '#fff';

  // Snap bow to end then open
  const rect = getContainerRect();
  bowHandle.style.left = rect.width + 'px';
  ribbonCut.style.width = '100%';

  setTimeout(openGift, 400);
}

function openGift() {
  startScreen.classList.add('gone');
  mainContent.style.display = 'flex';
  mainContent.style.flexDirection = 'column';
  mainContent.style.alignItems = 'center';
  setTimeout(() => mainContent.classList.add('visible'), 50);
  addConfetti(80);
  setTimeout(() => launchFirework(), 800);
  setTimeout(() => launchFirework(), 1600);
  setTimeout(() => launchFirework(), 2400);
  startSlideshow();
}

// ─── SLIDESHOW ───
function startSlideshow() {
  const slides = document.querySelectorAll('.moulya-slide');
  const dotsEl = document.getElementById('moulya-dots');

  // Create dots
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'moulya-dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });

  let current = 0;
  slides[0].classList.add('active');

  setInterval(() => {
    slides[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
  }, 3000);
}

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ─── FIREWORKS ───
function launchFirework() {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight * 0.5;
  const fw = document.createElement('div');
  fw.className = 'putti-firework';
  fw.style.left = x + 'px';
  fw.style.top = y + 'px';
  document.body.appendChild(fw);

  for (let i = 0; i < 22; i++) {
    const sp = document.createElement('div');
    sp.className = 'putti-spark';
    const angle = (i / 22) * 360;
    const dist = Math.random() * 90 + 50;
    const rad = angle * Math.PI / 180;
    sp.style.cssText = `
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --sx: ${Math.cos(rad) * dist}px;
      --sy: ${Math.sin(rad) * dist}px;
      --st: ${Math.random() * 0.5 + 0.5}s;
      animation-delay: ${Math.random() * 0.1}s;
    `;
    fw.appendChild(sp);
  }
  setTimeout(() => fw.remove(), 1500);
}

// Periodic fireworks after opening
setInterval(() => {
  if (mainContent.classList.contains('visible')) launchFirework();
}, 4000);