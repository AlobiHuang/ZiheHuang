import heroEntrance from './hero-entrance.js?v=20260915-edge-fix-1';
import Waves from './Waves.js?v=20260915-loops';

const startSelectedWorks = () => {
  const field = document.querySelector('[data-selected-waves]');
  const canvas = field?.querySelector('[data-selected-waves-canvas]');
  const typeTarget = document.querySelector('[data-selected-works-type]');
  const title = typeTarget?.closest('.selected-works-title');
  if (!field || !canvas || !typeTarget || !title) return;

  const stopWaves = Waves({
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

  heroEntrance({field,typeTarget,title,hero:field.closest('.architecture-waves-hero'),text:'SELECTED WORKS',onDispose:stopWaves});
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startSelectedWorks, { once: true });
} else {
  startSelectedWorks();
}
