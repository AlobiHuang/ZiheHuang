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

// Research evidence: switching findings updates visibility directly, including inside disclosures.
(() => {
  const box = document.querySelector('[data-gl-stats]');
  if (!box) return;
  const cards = [...box.querySelectorAll('.gl-stat')];
  cards.forEach(card => card.addEventListener('click', () => {
    const opening = card.getAttribute('aria-expanded') !== 'true';
    cards.forEach(candidate => {
      const active = candidate === card && opening;
      const panel = document.getElementById(candidate.getAttribute('aria-controls'));
      candidate.setAttribute('aria-expanded', String(active));
      if (!panel) return;
      panel.hidden = !active;
      panel.classList.toggle('is-open', active);
      panel.style.removeProperty('height');
    });
  }));
})();
