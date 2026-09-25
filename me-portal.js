const entry = document.querySelector('.me-portal-entry');
const exit = document.querySelector('.me-portal-exit');
const room = document.querySelector('.me-room');
const paper = '#f5f5f7';
const ink = '#180400';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const canvases = [...document.querySelectorAll('[data-me-portal],[data-me-spread],[data-me-room],[data-work-portal]')];
const contexts = new Map(canvases.map(canvas => [canvas, canvas.getContext('2d', { alpha: false, desynchronized: true })]));
let width = 0;
let height = 0;
let frame = 0;
let lastFrame = 0;
const motion = new Map([[entry, 0], [exit, 1], [room, 0]]);
const planes = Array.from({ length: 21 }, (_, index) => index - 10).sort((a, b) => Math.abs(b) - Math.abs(a));
let portalSprite = null;
let glyphs = new Map();
let glyphWidth = 0;
let glyphHeight = 0;
let letterStep = 0;

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

// Capsule width follows the screen height so it keeps the same slim
// proportion (about 3.4 : 1) on every screen shape; it never gets wider than
// the old width/6 rule.
const capsuleWidth = () => Math.min(height * .19, Math.max(width / 6, 100));
const capsuleHeight = () => height * .64;

const buildSprites = () => {
  const portalWidth = capsuleWidth();
  const portalHeight = capsuleHeight();
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

  // ME and WORK share one letter: same size, same proportions, same spacing.
  // Tall and narrow like the original ME, sized so four letters (WORK) still
  // fit inside the capsule's rounded ends.
  const capsuleInner = portalWidth - rim * 2;
  const size = Math.min(height * .12, capsuleInner * 1.4);
  const squeeze = .57; // horizontal: lower is narrower
  const stretch = 1.06; // vertical: higher is taller
  glyphWidth = size * .6;
  glyphHeight = size * stretch * 1.1;
  letterStep = size * stretch;
  const makeGlyph = character => spriteCanvas(glyphWidth, glyphHeight, context => {
    context.translate(glyphWidth / 2, glyphHeight / 2);
    context.scale(squeeze, stretch);
    context.font = `900 ${size}px Impact, 'Arial Narrow', sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    // Centre the letter's ink, not its text box, so rows sit evenly in the capsule.
    const ink = context.measureText(character);
    const baseline = (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2;
    context.lineWidth = 1.4;
    context.strokeStyle = '#75635e';
    context.fillStyle = paper;
    context.strokeText(character, 0, baseline);
    context.fillText(character, 0, baseline);
  });
  glyphs = new Map([...new Set('MEWORK')].map(character => [character, makeGlyph(character)]));
};

const drawPortal = (canvas, progress, word = 'ME', options = {}) => {
  const context = contexts.get(canvas);
  const portalProgress = progress;
  const travel = smooth(portalProgress);
  // Zoom far enough that the doorway still ends up 1.75 screens wide.
  const zoom = Math.exp(travel * Math.log(Math.max(10.5, width * 1.75 / capsuleWidth())));
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);
  context.save();
  if (options.room) {
    const turn = options.roomTurn ?? 1;
    const roomWidth = height + (width - height) * turn;
    const roomHeight = width + (height - width) * turn;
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(-Math.PI / 2 + turn * Math.PI / 2);
    context.translate(-roomWidth / 2, -roomHeight / 2);
    drawRoomLines(context, roomWidth, roomHeight, options.roomScroll || 0);
    context.restore();
  }
  // The portal can sit inside the room's frame: turned with it (angle) and
  // placed along its length (offsetY), so it travels with the lines.
  context.translate(width / 2, height / 2);
  if (options.angle) context.rotate(options.angle);
  context.translate(0, options.offsetY || 0);
  context.save();
  context.scale(zoom, zoom);
  const portalWidth = capsuleWidth();
  const portalHeight = capsuleHeight();
  if (portalSprite) context.drawImage(portalSprite, -portalWidth / 2 - 2, -portalHeight / 2 - 2, portalWidth + 4, portalHeight + 4);
  context.restore();
  // Let WORK's dark doorway become the room's paper surface during the zoom,
  // before the room replaces this canvas. ME retains its original rendering.
  if (word === 'WORK') {
    context.save();
    context.globalAlpha = smooth((portalProgress - .18) / .64);
    context.fillStyle = paper;
    context.fillRect(-width / 2, -height / 2, width, height);
    context.restore();
  }
  const spread = smooth((portalProgress - .04) / .78) * width * 1.48;
  const curve = smooth(portalProgress / .82);
  for (const plane of planes) {
    const unit = plane / 10;
    const x = unit * spread / 2;
    const bend = unit * unit * height * .075 * curve;
    // Four letters sit one step apart; two letters get a letter-sized gap so
    // ME still uses the capsule the way it did before.
    const middle = (word.length - 1) / 2;
    const spacing = word.length > 1 ? Math.min(2, 3 / (word.length - 1)) : 0;
    [...word].forEach((character, index) => {
      const glyph = glyphs.get(character);
      if (!glyph) return;
      const row = index - middle;
      const y = row * spacing * letterStep + Math.sign(row) * bend;
      context.drawImage(glyph, x - glyphWidth / 2, y - glyphHeight / 2, glyphWidth, glyphHeight);
    });
  }
  context.restore();
};

// Both entrances use the same renderer, sprites, spread, zoom, and easing.
export const drawSharedPortal = (canvas, progress, word = 'ME', options = {}) => drawPortal(canvas, progress, word, options);

// Spacing of the room's horizontal lines; one full spacing of travel looks identical to none.
export const roomGap = height => Math.max(170, height * .23);

export const drawRoomLines = (context, width, height, localScroll = 0) => {
  const centerWidth = width * (width < 701 ? .72 : .44);
  const leftEdge = (width - centerWidth) / 2;
  const rightEdge = width - leftEdge;
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

  const gap = roomGap(height);
  const phase = (localScroll * .38) % gap;
  for (let index = -3; index < 9; index += 1) {
    const centerY = index * gap - phase;
    const outerY = height / 2 + (centerY - height / 2) * 1.48;
    line(context, 0, outerY, leftEdge, centerY);
    line(context, rightEdge, centerY, width, outerY);
  }
};

// How far the room's lines have travelled. The room is pinned behind the ME
// doorway before the doorway scrolls away (me-portal.css), so the lines are
// already drifting at the .38 parallax rate the moment they come into view.
const roomTravel = top => Math.max(0, -top);

const drawRoom = (scrollPosition) => {
  const canvas = room.querySelector('[data-me-room]');
  const context = contexts.get(canvas);
  const rect = room.getBoundingClientRect();
  const localScroll = scrollPosition ?? roomTravel(rect.top);
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);
  drawRoomLines(context, width, height, localScroll);

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
  const entryRect = entry ? entry.getBoundingClientRect() : { top: 1e9, bottom: -1e9 };
  const exitRect = exit.getBoundingClientRect();
  const roomRect = room.getBoundingClientRect();
  const workRect = document.querySelector('.walk-gallery')?.getBoundingClientRect();
  // After the WORK walk the room turns and becomes this room directly: its
  // drawing stays hidden (the walk's own turning room shows through) until
  // the walk lets go, at the moment both drawings are identical.
  room.classList.toggle('me-room-waiting', !!workRect && !reduced && roomRect.top > .5);
  // While the ME room fills the screen, the cursor shows its up-and-down way (cursor-shape.js).
  const roomAxis = roomRect.top <= .5 && roomRect.bottom >= height - 1 ? 'y' : '';
  if ((document.documentElement.dataset.roomMe || '') !== roomAxis) {
    if (roomAxis) document.documentElement.dataset.roomMe = roomAxis; else delete document.documentElement.dataset.roomMe;
  }
  document.body.classList.toggle('me-mode-active', ((entry ? entryRect.top : roomRect.top) <= 0 && exitRect.bottom > height) || (workRect && workRect.top <= 0 && workRect.bottom >= height));
  if (entry && entryRect.bottom > 0 && entryRect.top < height) {
    // Finish the expansion before the sticky chapter ends, leaving a short
    // fully-spread MMMEEE hold before the reading corridor takes over.
    const progress = follow(entry, reduced ? 1 : clamp(sectionProgress(entry) / .78));
    drawPortal(entry.querySelector('[data-me-portal]'), progress, 'ME', { room: !!workRect });
    const skip = entry.querySelector('.me-skip');
    if (skip) skip.style.visibility = progress > .1 ? 'hidden' : 'visible';
  }
  if (exitRect.bottom > 0 && exitRect.top < height) {
    const scrollProgress = sectionProgress(exit);
    const progress = follow(exit, reduced ? 0 : 1 - clamp((scrollProgress - .1) / .9));
    drawPortal(exit.querySelector('[data-me-portal]'), progress);
  }
  // Tracks the scroll exactly; the glide comes from smooth-scroll.js.
  if (roomRect.bottom > 0 && roomRect.top < height) drawRoom(roomTravel(roomRect.top));
  if (settling && !document.hidden) frame = requestAnimationFrame(draw);
};

const resize = () => {
  cancelAnimationFrame(frame); frame = 0;
  // The page's width without the scrollbar, the same width the WORK walk draws
  // at, so the two room drawings match line for line at the handover.
  width = document.documentElement.clientWidth || innerWidth;
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
