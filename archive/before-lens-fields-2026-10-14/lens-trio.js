// The lens section's three windows, each running the line field of the page
// it opens. Clicking a window is handled by app.js (data-lens-choice).
import Waves from './Waves.js?v=20260925-perf-1';

const section = document.querySelector('.lens-trio');
if (section) {
  const panels = section.querySelector('.lt-panels');
  const fields = {
    arch: { lineColor: 'rgba(29, 29, 31, 0.3)', backgroundColor: 'transparent', xGap: 13, yGap: 38 },
    // PD stays blank for now: the PD page is still under construction.
    pm: { lineColor: 'rgba(245, 245, 247, 0.4)', backgroundColor: 'transparent', xGap: 12, yGap: 36 }
  };
  let started = false;

  // Each field is as wide as a widened window, so it never has to be redrawn
  // while the windows change width.
  const sizeFields = () => {
    const wide = innerWidth > 900;
    section.style.setProperty('--lt-field-w', wide ? `${Math.round(panels.clientWidth * .5)}px` : '100%');
  };

  const start = () => {
    if (started) return;
    started = true;
    sizeFields();
    Object.entries(fields).forEach(([key, options]) => {
      const field = section.querySelector(`.lt-${key} .lt-field`);
      const canvas = field?.querySelector('canvas');
      if (!field || !canvas) return;
      Waves({
        container: field, canvas,
        waveSpeedX: .02, waveSpeedY: .01, waveAmpX: 40, waveAmpY: 20,
        friction: .9, tension: .01, maxCursorMove: 120,
        pixelRatioCap: 1.25, targetFPS: 45,
        ...options
      });
    });
  };

  new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) start();
  }, { rootMargin: '600px 0px' }).observe(section);

  new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) section.classList.add('lt-in');
  }, { threshold: .18 }).observe(section);

  addEventListener('resize', sizeFields);
}
