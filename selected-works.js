import Waves from './Waves.js?v=20260914-2';

const startSelectedWorks = () => {
  const field = document.querySelector('[data-selected-waves]');
  const canvas = field?.querySelector('[data-selected-waves-canvas]');
  const typeTarget = document.querySelector('[data-selected-works-type]');
  const title = typeTarget?.closest('.selected-works-title');
  if (!field || !canvas || !typeTarget || !title) return;

  Waves({
    container: field,
    canvas,
    lineColor: 'rgba(29, 29, 31, 0.32)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    waveSpeedX: 0.02,
    waveSpeedY: 0.01,
    waveAmpX: 40,
    waveAmpY: 20,
    friction: 0.9,
    tension: 0.01,
    maxCursorMove: 120,
    xGap: 12,
    yGap: 36
  });

  const text = 'SELECTED WORKS';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started = false;

  const typeLine = (line, prefix, speed, done) => {
    let index = 0;
    const tick = () => {
      typeTarget.textContent = prefix + line.slice(0, index++);
      if (index <= line.length) {
        setTimeout(tick, speed + Math.random() * 18);
        return;
      }
      done();
    };
    tick();
  };

  const typeTitle = () => {
    if (started) return;
    started = true;
    title.classList.add('is-typing');
    if (reduced) {
      typeTarget.textContent = text;
      title.classList.add('is-typed');
      return;
    }
    typeLine(text, '', 38, () => title.classList.add('is-typed'));
  };

  if (reduced || !('IntersectionObserver' in window)) {
    typeTitle();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    typeTitle();
    observer.disconnect();
  }, { threshold: .35, rootMargin: '0px 0px -8%' });
  observer.observe(title);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startSelectedWorks, { once: true });
} else {
  startSelectedWorks();
}
