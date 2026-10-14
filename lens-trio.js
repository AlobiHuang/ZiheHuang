// The lens section's three windows, each running the line field of the page
// it opens. Clicking a window is handled by app.js (data-lens-choice).
import Waves from './Waves.js?v=20261014-axis-1';

const section = document.querySelector('.lens-trio');
if (section) {
  const panels = section.querySelector('.lt-panels');
  const fields = {
    // Oct 14: one family on paper, three geometries from the same engine (Waves.js):
    // ARCH vertical lines, PRODUCTS the same lines laid horizontally, PROJECTS rings
    // around two centres (the engine's radial mode), bending towards each other.
    arch: { lineColor: 'rgba(29, 29, 31, 0.3)', backgroundColor: 'transparent', xGap: 13, yGap: 38 },
    pd: { axis: 'x', lineColor: 'rgba(29, 29, 31, 0.3)', backgroundColor: 'transparent', xGap: 13, yGap: 38, waveAmpX: 20, waveAmpY: 40 },
    pm: { radial: true, radialCenters: [{ x: .34, y: .36, radius: .95, gravity: 1 }, { x: .7, y: .7, radius: .75, gravity: .8 }],
      lineColor: 'rgba(29, 29, 31, 0.3)', backgroundColor: 'transparent', xGap: 13, yGap: 38 }
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
