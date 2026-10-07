import heroEntrance from '../hero-entrance.js?v=20260916-speed-1265';
import Waves from '../Waves.js?v=20260925-perf-1';

const hero = document.querySelector('.hci-blank-hero');
const field = document.querySelector('[data-hci-field]');
const typeTarget = document.querySelector('[data-hci-title-type]');
const title = typeTarget?.closest('.hci-uiux-title');

if (hero && field && typeTarget && title) {
  // The same light line field as the ABOUT and ARCH covers.
  const stop = field.querySelector('canvas') ? Waves({
    container: field,
    canvas: field.querySelector('canvas'),
    lineColor: 'rgba(29, 29, 31, 0.3)',
    backgroundColor: '#f5f5f7',
    waveSpeedX: 0.02, waveSpeedY: 0.01, waveAmpX: 40, waveAmpY: 20,
    friction: 0.9, tension: 0.01, maxCursorMove: 120,
    xGap: 13, yGap: 38, pixelRatioCap: 1.25, targetFPS: 50
  }) : () => {};
  heroEntrance({ field, typeTarget, title, hero, text: 'PRODUCT DESIGN', onDispose: stop });
}

// The project screen: a short loop through the product's pages, fading from
// one to the next. Plays only
// while on screen; holds on the first page for reduced motion.
document.querySelectorAll('[data-pd-loop]').forEach(loop => {
  const frames = [...loop.querySelectorAll('img')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || frames.length < 2) { frames[0]?.classList.add('is-shown'); return; }
  let index = 0, timer = 0, running = false;
  const show = next => {
    frames.forEach((frame, i) => frame.classList.toggle('is-shown', i === next));
    index = next;
  };
  const tick = () => { show((index + 1) % frames.length); timer = setTimeout(tick, 3800); };
  show(0);
  new IntersectionObserver(entries => {
    const on = entries[0].isIntersecting;
    if (on && !running) { running = true; timer = setTimeout(tick, 3800); loop.classList.add('is-playing'); }
    else if (!on && running) { running = false; clearTimeout(timer); loop.classList.remove('is-playing'); }
  }, { threshold: .25 }).observe(loop);
});

const panel = document.querySelector('.index-panel');
const menu = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-head');

if (panel && menu && siteHeader) {
  const setPanel = open => {
    panel.classList.toggle('open', open);
    siteHeader.classList.toggle('menu-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    menu.setAttribute('aria-expanded', String(open));
  };

  menu.addEventListener('click', () => setPanel(!panel.classList.contains('open')));
  document.addEventListener('click', event => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(event.target) || menu.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    setPanel(false);
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setPanel(false);
  });
}

// Over the project the site cursor (the black square) reads ENTER. spectacle.js
// labels every link OPEN on its own pointerenter, so the word is set again on
// the next frame, after it.
document.querySelectorAll('.pd-project:not(.is-wip)').forEach(project => {
  const cursor = () => document.querySelector('.fx-cursor');
  const label = () => {
    const c = cursor();
    if (!c || !project.matches(':hover')) return;
    const span = c.querySelector('span');
    if (span) span.textContent = 'ENTER';
    c.classList.add('is-action', 'is-enter');
  };
  project.addEventListener('pointerover', event => { if (event.pointerType === 'mouse') { label(); requestAnimationFrame(label); } });
  project.addEventListener('pointerleave', () => cursor()?.classList.remove('is-action', 'is-enter'));
});
