import MetaBalls from './MetaBalls.js?v=20260914-2';

const stage = document.querySelector('[data-meta-balls]');

if (stage) {
  const labels = [...stage.parentElement.querySelectorAll('[data-why-index]')];
  MetaBalls(stage, {
    color: '#1d1d1f',
    colors: ['#1d1d1f'],
    cursorBallColor: '#1d1d1f',
    cursorBallSize: 2,
    ballCount: 24,
    animationSize: 34,
    enableMouseInteraction: true,
    enableTransparency: true,
    hoverSmoothness: 0.05,
    clumpFactor: 1.28,
    speed: 0.16,
    labeledBallCount: labels.length,
    onUpdate: balls => {
      stage._trackedBalls = balls.map(ball => ({ x: ball.x, y: ball.y, radius: ball.radius }));
      balls.forEach((ball, index) => {
      const label = labels[index];
      if (!label) return;
      const size = Math.max(92, Math.min(128, ball.radius * 1.55));
      const x = Math.max(size / 2 + 8, Math.min(stage.clientWidth - size / 2 - 8, ball.x));
      const safeEdge = stage.clientWidth < 760 ? 12 : 18;
      const y = Math.max(safeEdge + size / 2, Math.min(stage.clientHeight - size / 2 - safeEdge, ball.y));
      label.style.setProperty('--tracked-x', `${x}px`);
      label.style.setProperty('--tracked-y', `${y}px`);
      label.style.setProperty('--tracked-size', `${size}px`);
      });
    }
  });
}
