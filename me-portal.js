const entry = document.querySelector('.me-portal-entry');
const exit = document.querySelector('.me-portal-exit');
const room = document.querySelector('.me-room');
const paper = '#f5f5f7';
const ink = '#180400';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const canvases = [...document.querySelectorAll('[data-me-portal],[data-me-spread],[data-me-room]')];
const contexts = new Map(canvases.map(canvas => [canvas, canvas.getContext('2d', { alpha: false, desynchronized: true })]));
let width = 0;
let height = 0;
let frame = 0;
let lastFrame = 0;
const motion = new Map([[entry, 0], [exit, 1]]);
const planes = Array.from({ length: 21 }, (_, index) => index - 10).sort((a, b) => Math.abs(b) - Math.abs(a));
let portalSprite = null;
let glyphM = null;
let glyphE = null;
let glyphWidth = 0;
let glyphHeight = 0;

const line = (context, x1, y1, x2, y2) => {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
};

const capsule = (context, x, y, w, h, radius) => {
  context.beginPath();
  context.roundRect(x, y, w, h, radius);
};

const spriteCanvas = (cssWidth, cssHeight, draw) => {
  const ratio = Math.min(devicePixelRatio || 1, 1.25);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(cssWidth * ratio));
  canvas.height = Math.max(1, Math.round(cssHeight * ratio));
  const context = canvas.getContext('2d', { alpha: true });
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw(context);
  return canvas;
};

const buildSprites = () => {
  const portalWidth = Math.max(width / 6, 100);
  const portalHeight = height * .8;
  const radius = portalWidth / 2;
  const rim = Math.min(13, portalWidth * .055);
  portalSprite = spriteCanvas(portalWidth + 4, portalHeight + 4, context => {
    context.translate(2, 2);
    context.strokeStyle = ink;
    context.lineWidth = .8;
    capsule(context, 0, 0, portalWidth, portalHeight, radius);
    context.fillStyle = paper;
    context.fill();
    context.stroke();
    capsule(context, rim, rim, portalWidth - rim * 2, portalHeight - rim * 2, radius - rim);
    context.fillStyle = ink;
    context.fill();
    context.save();
    context.clip();
    context.fillStyle = 'rgba(245,245,247,.38)';
    for (let x = rim; x < portalWidth - rim; x += 14) {
      for (let y = rim; y < portalHeight - rim; y += 14) {
        context.fillRect(x, y, 1.1, 1.1);
      }
    }
    context.restore();
  });

  const size = height * .32;
  glyphWidth = size * .58;
  glyphHeight = size * 1.08;
  const makeGlyph = character => spriteCanvas(glyphWidth, glyphHeight, context => {
    context.translate(glyphWidth / 2, glyphHeight / 2);
    context.scale(.43, 1);
    context.font = `900 ${size}px Impact, 'Arial Narrow', sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = 1.4;
    context.strokeStyle = '#75635e';
    context.fillStyle = paper;
    context.strokeText(character, 0, 0);
    context.fillText(character, 0, 0);
  });
  glyphM = makeGlyph('M');
  glyphE = makeGlyph('E');
};

const drawPortal = (canvas, progress) => {
  const context = contexts.get(canvas);
  const portalProgress = progress;
  const travel = smooth(portalProgress);
  const zoom = Math.exp(travel * Math.log(10.5));
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  context.save();
  context.scale(zoom, zoom);
  const portalWidth = Math.max(width / 6, 100);
  const portalHeight = height * .8;
  if (portalSprite) context.drawImage(portalSprite, -portalWidth / 2 - 2, -portalHeight / 2 - 2, portalWidth + 4, portalHeight + 4);
  context.restore();
  const spread = smooth((portalProgress - .04) / .78) * width * 1.48;
  const curve = smooth(portalProgress / .82);
  for (const plane of planes) {
    const unit = plane / 10;
    const x = unit * spread / 2;
    const bend = unit * unit * height * .075 * curve;
    if (glyphM) context.drawImage(glyphM, x - glyphWidth / 2, -height * .18 - bend - glyphHeight / 2, glyphWidth, glyphHeight);
    if (glyphE) context.drawImage(glyphE, x - glyphWidth / 2, height * .18 + bend - glyphHeight / 2, glyphWidth, glyphHeight);
  }
  context.restore();
};

const drawRoom = () => {
  const canvas = room.querySelector('[data-me-room]');
  const context = contexts.get(canvas);
  const rect = room.getBoundingClientRect();
  const localScroll = Math.max(0, -rect.top);
  const centerWidth = width * (width < 701 ? .72 : .44);
  const leftEdge = (width - centerWidth) / 2;
  const rightEdge = width - leftEdge;
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = ink;
  context.lineWidth = .75;

  line(context, leftEdge, 0, leftEdge, height);
  line(context, rightEdge, 0, rightEdge, height);
  const divisions = width < 701 ? 2 : 5;
  for (let index = 1; index <= divisions; index += 1) {
    const ratio = index / (divisions + 1);
    line(context, leftEdge * ratio, 0, leftEdge * ratio, height);
    line(context, rightEdge + leftEdge * ratio, 0, rightEdge + leftEdge * ratio, height);
  }

  const gap = Math.max(170, height * .23);
  const phase = (localScroll * .38) % gap;
  for (let index = -3; index < 9; index += 1) {
    const centerY = index * gap - phase;
    const outerY = height / 2 + (centerY - height / 2) * 1.48;
    line(context, 0, outerY, leftEdge, centerY);
    line(context, rightEdge, centerY, width, outerY);
  }
};

const sectionProgress = section => {
  const rect = section.getBoundingClientRect();
  return clamp(-rect.top / Math.max(1, section.offsetHeight - height));
};

const draw = (now = performance.now()) => {
  frame = 0;
  const dt = Math.min(.05, Math.max(.001, (now - (lastFrame || now - 16)) / 1000));
  lastFrame = now;
  let settling = false;
  const follow = (section, target) => {
    let value = motion.get(section);
    value += (target - value) * (1 - Math.exp(-dt / .105));
    if (reduced || Math.abs(target - value) < .00003) value = target;
    else settling = true;
    motion.set(section, value);
    return value;
  };
  const entryRect = entry.getBoundingClientRect();
  const exitRect = exit.getBoundingClientRect();
  document.body.classList.toggle('me-mode-active', entryRect.top <= 0 && exitRect.bottom > height);
  if (entryRect.bottom > 0 && entryRect.top < height) {
    // Finish the expansion before the sticky chapter ends, leaving a short
    // fully-spread MMMEEE hold before the reading corridor takes over.
    const progress = follow(entry, reduced ? 1 : clamp(sectionProgress(entry) / .78));
    drawPortal(entry.querySelector('[data-me-portal]'), progress);
    const skip = entry.querySelector('.me-skip');
    if (skip) skip.style.visibility = progress > .1 ? 'hidden' : 'visible';
  }
  if (exitRect.bottom > 0 && exitRect.top < height) {
    const scrollProgress = sectionProgress(exit);
    const progress = follow(exit, reduced ? 0 : 1 - clamp((scrollProgress - .1) / .9));
    drawPortal(exit.querySelector('[data-me-portal]'), progress);
  }
  const roomRect = room.getBoundingClientRect();
  if (roomRect.bottom > 0 && roomRect.top < height) drawRoom();
  if (settling && !document.hidden) frame = requestAnimationFrame(draw);
};

const resize = () => {
  cancelAnimationFrame(frame); frame = 0;
  width = innerWidth;
  height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 1.25);
  canvases.forEach(canvas => {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    contexts.get(canvas).setTransform(dpr, 0, 0, dpr, 0, 0);
  });
  buildSprites();
  document.querySelectorAll('[data-me-spread]').forEach(canvas => drawPortal(canvas, 1));
  drawRoom();
  draw();
};

const requestDraw = () => {
  if (!frame) frame = requestAnimationFrame(draw);
};

addEventListener('scroll', requestDraw, { passive: true });
addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { lastFrame = 0; requestDraw(); } });
resize();
