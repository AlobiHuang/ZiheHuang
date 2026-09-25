// Resume page: the same opening as the ARCH, PD and PM pages (the field rises
// from the rule and the title spins in), over ARCH's light line field.
import heroEntrance from '../hero-entrance.js?v=20260916-speed-1265';
import Waves from '../Waves.js?v=20260924-live-rect-1';

const hero = document.querySelector('.resume-hero');
const field = document.querySelector('[data-resume-field]');
const typeTarget = document.querySelector('[data-hci-title-type]');
const title = typeTarget?.closest('.hci-uiux-title');

if (hero && field && typeTarget && title) {
  const stop = Waves({
    container: field,
    canvas: field.querySelector('canvas'),
    lineColor: 'rgba(29, 29, 31, 0.3)',
    backgroundColor: '#f5f5f7',
    waveSpeedX: 0.02, waveSpeedY: 0.01, waveAmpX: 40, waveAmpY: 20,
    friction: 0.9, tension: 0.01, maxCursorMove: 120,
    xGap: 13, yGap: 38, pixelRatioCap: 1.25, targetFPS: 50
  });
  heroEntrance({ field, typeTarget, title, hero, text: 'RESUME', onDispose: stop });
}

// The record rises into place as it comes into view.
const record = document.querySelector('.resume-record');
if (record) {
  new IntersectionObserver((entries, observer) => {
    if (entries.some(entry => entry.isIntersecting)) { record.classList.add('is-in'); observer.disconnect(); }
  }, { threshold: .12 }).observe(record);
}
