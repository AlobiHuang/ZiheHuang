const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export default function PMTopography({ container, canvas, lineColor = 'rgba(29,29,31,.28)', backgroundColor = '#f5f5f7' } = {}) {
  if (!container || !canvas) return () => {};
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bounds = { width: 1, height: 1 };
  const mouse = { x: .5, y: .5, smoothX: .5, smoothY: .5, energy: 0, targetEnergy: 0 };
  const peaks = [
    { x: .17, y: .27, amp: .76, sx: .13, sy: .18, phase: .3 },
    { x: .48, y: .48, amp: 1.12, sx: .29, sy: .34, phase: 1.7 },
    { x: .82, y: .25, amp: .58, sx: .12, sy: .16, phase: 3.1 },
    { x: .77, y: .75, amp: .86, sx: .18, sy: .23, phase: 4.4 },
    { x: .27, y: .79, amp: .54, sx: .14, sy: .17, phase: 5.6 }
  ];
  const levels = Array.from({ length: 37 }, (_, index) => .085 + index * .043);
  const edgePairs = {
    1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[0, 1]],
    6: [[0, 2]], 7: [[0, 3]], 8: [[3, 0]], 9: [[0, 2]],
    11: [[0, 1]], 12: [[3, 1]], 13: [[2, 1]], 14: [[3, 2]]
  };

  let columns = 0;
  let rows = 0;
  let step = 10;
  let values = new Float32Array(0);
  let frame = 0;
  let lastDraw = -Infinity;
  let visible = true;
  let destroyed = false;
  container.style.backgroundColor = backgroundColor;

  const resize = () => {
    const rect = container.getBoundingClientRect();
    bounds.width = Math.max(1, rect.width);
    bounds.height = Math.max(1, rect.height);
    step = bounds.width < 760 ? 13 : 10;
    columns = Math.ceil(bounds.width / step) + 1;
    rows = Math.ceil(bounds.height / step) + 1;
    values = new Float32Array(columns * rows);
    const pixelRatio = Math.min(1.6, devicePixelRatio || 1);
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(performance.now());
  };

  const sampleTerrain = (nx, ny, time) => {
    const cursorX = nx - mouse.smoothX;
    const cursorY = ny - mouse.smoothY;
    const cursorDistance = Math.hypot(cursorX, cursorY) || 1;
    const cursorFalloff = Math.exp(-(cursorDistance * cursorDistance) / .018) * mouse.energy;
    const warpedX = nx + cursorX / cursorDistance * cursorFalloff * .032;
    const warpedY = ny + cursorY / cursorDistance * cursorFalloff * .032;
    let height = 0;
    for (const peak of peaks) {
      const driftX = Math.sin(time * .43 + peak.phase) * .009;
      const driftY = Math.cos(time * .35 + peak.phase * 1.23) * .008;
      const dx = (warpedX - peak.x - driftX) / peak.sx;
      const dy = (warpedY - peak.y - driftY) / peak.sy;
      height += peak.amp * Math.exp(-(dx * dx + dy * dy) * .5);
    }
    const longFold = Math.sin(warpedX * 9.2 + Math.sin(warpedY * 7.1 + time * .22)) * .025;
    const crossFold = Math.cos(warpedY * 10.6 - warpedX * 3.4 - time * .18) * .018;
    return height + longFold + crossFold;
  };

  const interpolate = (level, a, b) => clamp((level - a) / ((b - a) || .0001), 0, 1);
  const edgePoint = (edge, x, y, tl, tr, br, bl, level) => {
    if (edge === 0) return [x + step * interpolate(level, tl, tr), y];
    if (edge === 1) return [x + step, y + step * interpolate(level, tr, br)];
    if (edge === 2) return [x + step * interpolate(level, bl, br), y + step];
    return [x, y + step * interpolate(level, tl, bl)];
  };

  const segmentsFor = (code, centerHigh) => {
    if (code === 5) return centerHigh ? [[0, 3], [1, 2]] : [[0, 1], [3, 2]];
    if (code === 10) return centerHigh ? [[0, 1], [3, 2]] : [[0, 3], [1, 2]];
    return edgePairs[code] || [];
  };

  const draw = now => {
    if (!values.length || destroyed) return;
    const time = now * .00022;
    mouse.smoothX += (mouse.x - mouse.smoothX) * .075;
    mouse.smoothY += (mouse.y - mouse.smoothY) * .075;
    mouse.energy += (mouse.targetEnergy - mouse.energy) * .065;
    mouse.targetEnergy *= .975;

    for (let row = 0; row < rows; row += 1) {
      const ny = row * step / bounds.height;
      for (let column = 0; column < columns; column += 1) {
        values[row * columns + column] = sampleTerrain(column * step / bounds.width, ny, time);
      }
    }

    context.clearRect(0, 0, bounds.width, bounds.height);
    context.beginPath();
    for (const level of levels) {
      for (let row = 0; row < rows - 1; row += 1) {
        const y = row * step;
        for (let column = 0; column < columns - 1; column += 1) {
          const x = column * step;
          const offset = row * columns + column;
          const tl = values[offset];
          const tr = values[offset + 1];
          const bl = values[offset + columns];
          const br = values[offset + columns + 1];
          const code = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
          if (code === 0 || code === 15) continue;
          const centerHigh = (tl + tr + br + bl) * .25 >= level;
          for (const [edgeA, edgeB] of segmentsFor(code, centerHigh)) {
            const pointA = edgePoint(edgeA, x, y, tl, tr, br, bl, level);
            const pointB = edgePoint(edgeB, x, y, tl, tr, br, bl, level);
            context.moveTo(pointA[0], pointA[1]);
            context.lineTo(pointB[0], pointB[1]);
          }
        }
      }
    }
    context.strokeStyle = lineColor;
    context.lineWidth = .78;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();
  };

  const tick = now => {
    if (destroyed) return;
    if (visible && !document.hidden && now - lastDraw > 32) {
      draw(now);
      lastDraw = now;
    }
    frame = reduced ? 0 : requestAnimationFrame(tick);
  };

  const pointerMove = event => {
    const rect = container.getBoundingClientRect();
    const nextX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const nextY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    mouse.targetEnergy = Math.min(1, mouse.targetEnergy + Math.hypot(nextX - mouse.x, nextY - mouse.y) * 4.5 + .08);
    mouse.x = nextX;
    mouse.y = nextY;
  };
  const pointerLeave = () => { mouse.targetEnergy = 0; };
  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); }, { rootMargin: '120px' });
  resizeObserver.observe(container);
  visibilityObserver.observe(container);
  container.addEventListener('pointermove', pointerMove, { passive: true });
  container.addEventListener('pointerleave', pointerLeave, { passive: true });
  resize();
  if (!reduced) frame = requestAnimationFrame(tick);

  return () => {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    container.removeEventListener('pointermove', pointerMove);
    container.removeEventListener('pointerleave', pointerLeave);
  };
}
