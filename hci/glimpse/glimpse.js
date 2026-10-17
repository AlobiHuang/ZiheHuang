// Hero videos: play only while on screen; hold the poster frame for reduced motion.
// A video marked data-once (Your world, filling in) waits on its first frame until it is well on screen, plays
// once and stays on its last frame ("Your world, one photo at a time."); with reduced motion it shows that frame.
(() => {
  const vids = [...document.querySelectorAll('.gl-shot video')];
  if (!vids.length) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const play = v => { if (!(v.hasAttribute('data-once') && v.ended)) v.play().catch(() => {}); };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !still.matches) play(v);
    else v.pause();
  }), { threshold: 0.15 });
  const ioOnce = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !still.matches) play(v);
    else v.pause();
  }), { threshold: 0.5 });
  vids.forEach(v => {
    if (v.hasAttribute('data-once')) {
      if (still.matches) { const end = () => { v.currentTime = Math.max(0, v.duration - 0.05); }; v.readyState >= 1 ? end() : v.addEventListener('loadedmetadata', end, { once: true }); }
      ioOnce.observe(v);
      return;
    }
    if (still.matches) { v.removeAttribute('autoplay'); v.pause(); }
    io.observe(v);
  });
})();

// Research numbers: one card open at a time; its findings slide open under the row.
(() => {
  const box = document.querySelector('[data-gl-stats]');
  if (!box) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...box.querySelectorAll('.gl-stat')];
  const panelOf = c => document.getElementById(c.getAttribute('aria-controls'));
  cards.forEach(c => [...panelOf(c).children].forEach((li, i) => li.style.setProperty('--i', i)));
  const open = el => {
    el.hidden = false; el.classList.add('is-open');
    if (still) return;
    el.style.height = '0px';
    requestAnimationFrame(() => { el.style.height = el.scrollHeight + 'px'; });
    el.addEventListener('transitionend', function done(e) { if (e.propertyName !== 'height') return; el.style.height = ''; el.removeEventListener('transitionend', done); });
  };
  const close = (el, after) => {
    el.classList.remove('is-open');
    if (still) { el.hidden = true; after?.(); return; }
    el.style.height = el.scrollHeight + 'px';
    requestAnimationFrame(() => { el.style.height = '0px'; });
    el.addEventListener('transitionend', function done(e) { if (e.propertyName !== 'height') return; el.hidden = true; el.style.height = ''; el.removeEventListener('transitionend', done); after?.(); });
  };
  cards.forEach(card => card.addEventListener('click', () => {
    const opening = card.getAttribute('aria-expanded') !== 'true';
    const current = cards.find(c => c.getAttribute('aria-expanded') === 'true');
    cards.forEach(c => c.setAttribute('aria-expanded', String(c === card && opening)));
    // Switching cards: close the open findings first, then open the new ones.
    if (current && current !== card) close(panelOf(current), opening ? () => open(panelOf(card)) : null);
    else if (current === card) close(panelOf(card));
    else if (opening) open(panelOf(card));
  }));
})();
