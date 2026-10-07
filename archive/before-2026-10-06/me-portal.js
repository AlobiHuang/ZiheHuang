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

// Portal style. 'door' (Oct 2): an architectural doorway in elevation, a
// framed opening with a lintel and threshold, two hatched door leaves and the
// word set upright along the seam; scrolling opens the leaves and you walk
// through the frame. 'capsule' is the earlier rounded capsule, kept as it
// was: use ?portal=capsule to see it, or set the line below to 'capsule'.
const PORTAL_STYLE = new URLSearchParams(location.search).get('portal') === 'capsule' ? 'capsule' : 'door';
document.documentElement.dataset.portal = PORTAL_STYLE;

const mix = (a, b, t) => a + (b - a) * t;
const doorWidth = () => Math.min(height * .22, Math.max(width / 5.2, 110));
const doorHeight = () => height * .62;

// The doorway in perspective (Oct 2, v2). A camera rushes towards a framed
// opening; the two leaves swing inward on their hinges; through the opening
// you already see the room you are about to enter, drawn exactly as the room
// beyond draws it, so once you are through, the two pictures are the same.
// (The flat first version is in archive/portal-door-v1.)
const drawDoor = (canvas, progress, word, options) => {
  const context = contexts.get(canvas);
  const p = clamp(progress);
  const cx = width / 2, cy = height / 2;
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);

  // The room beyond, full screen, in the orientation the next view uses.
  const behind = options.behind || { turn: word === 'WORK' ? 0 : 1, scroll: 0 };
  // fit: the room is shown small, as if far beyond the doorway, and reaches
  // its full size exactly as you pass through.
  const paintRoom = (fit = 1) => {
    const turn = behind.turn ?? 1;
    const roomWidth = height + (width - height) * turn;
    const roomHeight = width + (height - width) * turn;
    context.save();
    context.translate(cx, cy);
    context.scale(fit, fit);
    context.rotate(-Math.PI / 2 + turn * Math.PI / 2);
    context.translate(-roomWidth / 2, -roomHeight / 2);
    drawRoomLines(context, roomWidth, roomHeight, behind.scroll || 0);
    context.restore();
  };
  if (p >= .999) { paintRoom(); return { through: true }; }

  // Camera: the door (1 unit wide) starts at its resting size, then the
  // camera speeds up towards it, faster and faster, and passes through.
  const focal = height * 1.15;
  const W = 1, H = doorHeight() / doorWidth(), depth = .16, casing = .09;
  const Z0 = focal * W / doorWidth();
  // Slow at first, then gathering speed. The distance shrinks by a steady
  // ratio (how the eye reads approach speed), eased in, so the rush builds
  // over the whole approach instead of snapping in the last instant.
  // Stepping back out (ME exit), the walk ends with the doorway's inner edge
  // just beyond the screen's edges, so its frame slides in from the edges of
  // your view as soon as you move; going in, the camera passes right through.
  const leaving = !!(options.behind && options.behind.leaving);
  const rim = Math.min(focal * W / 2 / (width * .52), focal * H / 2 / (height * .52)) - depth;
  // Going in, the camera ends far enough forward that the open leaves (and
  // the opening's back edge) have slid past both sides of the screen, on any
  // screen shape, before the doorway gives way to the room. On wide screens
  // that means stepping a little way into the doorway itself.
  const hingeZ = depth * .35, leaf = W / 2, swingMax = Math.PI * .47;
  const freeX = W / 2 - leaf * Math.cos(swingMax), freeZ = hingeZ + leaf * Math.sin(swingMax);
  const past = Math.min(.02, focal * freeX / (width * .54) - freeZ, focal * W / 2 / (width * .54) - depth);
  // Stepping out, the walk starts with the open leaves as well as the
  // opening's edges just beyond the sides of the screen, so everything slides
  // in from the edges of your view rather than appearing midway.
  const leavesOut = focal * freeX / (width * .52) - freeZ;
  const end = leaving ? Math.min(Z0 * .5, rim, leavesOut) : past;
  const dolly = clamp((p - .25) / .75);
  // The approach eases in on a steady ratio down to a hair from the door, then
  // (when the screen is wide) carries on the last short way through it.
  const d = Z0 * Math.pow(Math.max(end, .02) / Z0, Math.pow(dolly, leaving ? 1.6 : 2.4)) - (end < .02 ? (.02 - end) * Math.pow(dolly, 6) : 0); // distance to the door's face
  // Things beyond the doorway sit at a real depth behind it, so they grow
  // with the same camera move as the door and reach full size exactly as
  // the camera arrives, never before: a plane that looks `rest` times its
  // full size from the starting position sits this far behind the door.
  const beyond = rest => { rest = clamp(rest); const depthBehind = (rest * Z0 - end) / Math.max(.001, 1 - rest); return (end + depthBehind) / (d + depthBehind); };
  const roomScale = beyond(.55);
  const at = (x, y, z) => { const zz = Math.max(.0004, d + z); return [cx + focal * x / zz, cy + focal * y / zz]; };
  const poly = points => { context.beginPath(); points.forEach(([x, y], i) => (i ? context.lineTo(x, y) : context.moveTo(x, y))); context.closePath(); };
  const seg = (a, b) => line(context, a[0], a[1], b[0], b[1]);
  const L = -W / 2, R = W / 2, T = -H / 2, B = H / 2;

  // Through the opening (its back edge), the room.
  const back = [at(L, T, depth), at(R, T, depth), at(R, B, depth), at(L, B, depth)];
  context.save();
  poly(back);
  context.clip();
  const openingHeight = back[2][1] - back[1][1];
  // WORK: the room beyond starts small and far, and reaches full size as you
  // pass through. ME (stepping back out): the room stays exactly as it is and
  // only the doorway closes in around it.
  paintRoom((behind.turn ?? 1) === 1 ? 1 : Math.min(1, roomScale));
  context.restore();

  // The floor running up to the threshold, and the jamb reveals.
  context.strokeStyle = ink;
  context.lineWidth = .8;
  const near = -d * .92;
  seg(at(L - casing, B, 0), at(L - casing * 6, B, near));
  seg(at(R + casing, B, 0), at(R + casing * 6, B, near));
  const front = [at(L, T, 0), at(R, T, 0), at(R, B, 0), at(L, B, 0)];
  for (let i = 0; i < 4; i += 1) seg(front[i], back[i]);
  poly(back); context.stroke();

  // The two leaves, hinged at the jambs, swinging inward.
  // Inward, stopping just short of square against the jambs.
  const swing = smooth((p - .1) / .42) * swingMax;
  const solid = 1; // the leaves stay solid ink all the way through
  const drawLeaf = side => {
    const hx = side < 0 ? L : R;
    const fx = hx - side * leaf * Math.cos(swing);
    const fz = hingeZ + leaf * Math.sin(swing);
    const corners = [at(hx, T, hingeZ), at(fx, T, fz), at(fx, B, fz), at(hx, B, hingeZ)];
    context.save();
    poly(corners);
    context.fillStyle = paper;
    context.fill();
    if (solid > .01) { context.globalAlpha = solid; context.fillStyle = ink; context.fill(); context.globalAlpha = 1; }
    context.clip();
    context.lineWidth = .6;
    const rows = 46;
    context.beginPath();
    for (let i = 1; i < rows; i += 1) {
      const y = T + (H * i) / rows;
      const a = at(hx, y, hingeZ), b = at(fx, y, fz);
      context.moveTo(a[0], a[1]); context.lineTo(b[0], b[1]);
    }
    context.strokeStyle = `rgba(245,245,247,${(.2 * solid).toFixed(3)})`;
    if (solid > .01) context.stroke();
    context.strokeStyle = `rgba(24,4,0,${(.32 * (1 - solid)).toFixed(3)})`;
    if (solid < .99) context.stroke();
    context.restore();
    context.strokeStyle = ink;
    context.lineWidth = .8;
    poly(corners);
    context.stroke();
  };
  // The leaves are behind the frame's face: seen only through the opening.
  context.save();
  poly(front);
  context.clip();
  drawLeaf(-1); drawLeaf(1);
  context.restore();

  // The word, upright along the closed seam; gone as soon as the door moves.
  const wordAlpha = 1 - smooth((p - .04) / .08);
  if (wordAlpha > .01) {
    const doorPx = focal * W / d;
    const size = Math.min(doorPx * .3, height * .05);
    context.save();
    context.globalAlpha = wordAlpha;
    context.translate(cx, cy);
    context.rotate(-Math.PI / 2);
    context.fillStyle = paper;
    context.font = `500 ${size}px "DM Mono", ui-monospace, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const letters = [...word];
    letters.forEach((character, index) => context.fillText(character, (index - (letters.length - 1) / 2) * size * 1.05, 0));
    context.restore();
    context.strokeStyle = 'rgba(245,245,247,.55)';
    context.lineWidth = .8;
    seg(at(0, T, hingeZ), at(0, B, hingeZ));
  }

  // The face of the frame: opening, casing, lintel and threshold.
  context.strokeStyle = ink;
  context.lineWidth = .8;
  poly(front); context.stroke();
  poly([at(L - casing, T - casing, 0), at(R + casing, T - casing, 0), at(R + casing, B, 0), at(L - casing, B, 0)]); context.stroke();
  seg(at(L - casing * 3.4, T - casing, 0), at(R + casing * 3.4, T - casing, 0));
  seg(at(L - casing * 6, B, 0), at(R + casing * 6, B, 0));

  // What can be seen of the room beyond: the opening's back edge, narrowed
  // by the leaves' free edges while they open (screen px), for anything the
  // caller lays over the drawing (the WORK frames).
  const freeLeft = at(L + leaf * Math.cos(swing), 0, hingeZ + leaf * Math.sin(swing))[0];
  const freeRight = at(R - leaf * Math.cos(swing), 0, hingeZ + leaf * Math.sin(swing))[0];
  return {
    through: false,
    // Anything shown in the room beyond scales with the room itself.
    frameScale: Math.min(1, roomScale),
    openingWidth: back[1][0] - back[0][0],
    view: { left: Math.max(back[0][0], freeLeft), right: Math.min(back[1][0], freeRight), top: back[0][1], bottom: back[3][1] }
  };
};

const drawPortal = (canvas, progress, word = 'ME', options = {}) => {
  if (PORTAL_STYLE === 'door') return drawDoor(canvas, progress, word, options);
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
// The WORK walk asks which portal is in use, to hand over without a slide.
export const portalStyle = () => PORTAL_STYLE;

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

// The WORK lettering from the walk's back wall carries on up the ME room
// (walk-gallery.js publishes where it is and how fast it moves), until the
// reading strip rises over it.
const roomWord = (() => {
  const space = room?.querySelector('.me-room-space');
  if (!space) return null;
  const element = document.createElement('div');
  element.className = 'me-room-word';
  element.setAttribute('aria-hidden', 'true');
  space.append(element);
  return element;
})();
const placeRoomWord = () => {
  const wall = window.alobiWorkWall;
  if (!roomWord || !wall || !wall.turned || PORTAL_STYLE !== 'door') { if (roomWord) roomWord.style.visibility = 'hidden'; return; }
  if (roomWord.textContent !== wall.text) roomWord.textContent = wall.text;
  // Drawn exactly as on the walk's wall: the same type size, scaled the same
  // way, so the hairline keeps the same weight across the handover.
  roomWord.style.fontSize = `${wall.font}px`;
  const y = wall.y - (scrollY - wall.at) * wall.speed;
  roomWord.style.transform = `translate3d(${wall.x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(90deg) scale(${wall.scale})`;
  roomWord.style.visibility = 'inherit';
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
  // Door: once the way out reaches the top of the screen it takes over from
  // the room with the very same drawing, then backs out through the door.
  const doorExit = PORTAL_STYLE === 'door' && !reduced;
  room.classList.toggle('me-room-left', doorExit && exitRect.top <= .5);
  if (exitRect.bottom > 0 && exitRect.top < height) {
    const scrollProgress = sectionProgress(exit);
    const progress = doorExit
      ? follow(exit, 1 - clamp(scrollProgress / .86))
      : follow(exit, reduced ? 0 : 1 - clamp((scrollProgress - .1) / .9));
    drawPortal(exit.querySelector('[data-me-portal]'), progress, 'ME', doorExit ? { behind: { turn: 1, scroll: roomTravel(roomRect.top), leaving: true } } : {});
  }
  // Tracks the scroll exactly; the glide comes from smooth-scroll.js.
  if (roomRect.bottom > 0 && roomRect.top < height) drawRoom(roomTravel(roomRect.top));
  if (roomRect.bottom > 0 && roomRect.top < height) placeRoomWord();
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
