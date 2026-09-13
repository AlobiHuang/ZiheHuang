import MetaBalls from './MetaBalls.js';

const stage = document.querySelector('[data-meta-balls]');

if (stage) {
  MetaBalls(stage, {
    color: '#1d1d1f',
    cursorBallColor: '#1d1d1f',
    cursorBallSize: 2,
    ballCount: 15,
    animationSize: 30,
    enableMouseInteraction: true,
    enableTransparency: true,
    hoverSmoothness: 0.05,
    clumpFactor: 1,
    speed: 0.3
  });
}
