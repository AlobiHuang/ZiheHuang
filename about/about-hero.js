// About page cover: the same opening as the ARCH, PD, PM and Resume pages (the
// field rises from the rule and the title spins in), over the light line field.
import heroEntrance from '../hero-entrance.js?v=20260916-speed-1265';
import Waves from '../Waves.js?v=20260925-perf-1';

const hero = document.querySelector('.about-cover');
const field = hero?.querySelector('[data-about-field]');
const typeTarget = hero?.querySelector('[data-hci-title-type]');
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
  heroEntrance({ field, typeTarget, title, hero, text: 'ABOUT ME', onDispose: stop });
}
