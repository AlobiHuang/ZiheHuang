// Easter egg on the home page.
//
// After the visitor has come back to the top of the page a few times (a
// random 2–5), a crack splits the middle of the hero, about half the screen
// tall. Clicking it opens a seam; clicking again or dragging sideways pries
// it wider, and once it is wide enough the page tears in two along the crack
// and both halves of the paper fall away to the sides. Underneath is the same
// site turned inside out: black and white swapped (photos keep their real
// colours) and glitching hard. "Mend" (or Esc) puts it back.
//
// How it is built: the torn halves are two copies of what was on screen (the
// hero and header, with a still of the hero's canvas), each clipped to its
// side of the crack. The real page underneath switches to the glitch world
// the moment the first seam opens, so the crack always shows it.
// To remove the egg, delete this file's <script> and <link> tags in index.html.
const root = document.documentElement;
const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
// Returns to the top before the crack shows: the first time on each visit
// it is waiting on the very first return; after it has been opened, it takes
// 2 to 5 more returns before it shows again.
const laterChance = () => 2 + Math.floor(Math.random() * 4);
let needed = 1;

const rand = (min, max) => min + Math.random() * (max - min);
const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const svgNS = 'http://www.w3.org/2000/svg';
const atTop = () => scrollY <= 2;
const ready = () => body.classList.contains('arrival-done');

// ---- the glitch world's layers ------------------------------------------
// The world is the real page with its colours inverted (photos are inverted
// back, so they look normal). Everything added here is inverted with it, so
// colours below are written as their opposites: #00d429 shows as magenta,
// #ff0f00 as cyan, #0800ff as yellow.
const fx = document.createElement('div');
fx.className = 'gp-fx';
fx.setAttribute('aria-hidden', 'true');
fx.innerHTML = '<i class="gp-scan"></i><i class="gp-noise"></i>'
  + '<i class="gp-slice"></i>'.repeat(8)
  + '<i class="gp-block"></i>'.repeat(6);
const slices = [...fx.querySelectorAll('.gp-slice')];
const blocks = [...fx.querySelectorAll('.gp-block')];

// Displacement filter for bursts: horizontal bands of the page shoved
// sideways by stepped noise, then the red channel split from green/blue.
const filterHost = document.createElementNS(svgNS, 'svg');
filterHost.setAttribute('class', 'gp-filters');
filterHost.setAttribute('aria-hidden', 'true');
filterHost.innerHTML = `
  <filter id="gp-shred" filterUnits="userSpaceOnUse" x="0" y="0" width="100" height="100" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.0001 0.06" numOctaves="1" seed="3" result="noise"/>
    <feComponentTransfer in="noise" result="bands">
      <feFuncR type="discrete" tableValues="0.5 0.5 0.1 0.5 0.9 0.5 0.3 0.5 0.7 0.5"/>
      <feFuncG type="discrete" tableValues="0.5"/>
    </feComponentTransfer>
    <feDisplacementMap in="SourceGraphic" in2="bands" scale="80" xChannelSelector="R" yChannelSelector="G" result="shoved"/>
    <feColorMatrix in="shoved" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
    <feOffset in="red" dx="6" result="redShift"/>
    <feColorMatrix in="shoved" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan"/>
    <feOffset in="cyan" dx="-6" result="cyanShift"/>
    <feBlend in="redShift" in2="cyanShift" mode="screen"/>
  </filter>`;
const shredFilter = filterHost.querySelector('filter');
const turbulence = filterHost.querySelector('feTurbulence');
const displacement = filterHost.querySelector('feDisplacementMap');
const splits = [...filterHost.querySelectorAll('feOffset')];

const mend = document.createElement('button');
mend.type = 'button';
mend.className = 'gp-mend';
mend.innerHTML = 'MEND THE PAGE <span>ESC</span>';

// ---- the crack ----------------------------------------------------------
const hint = document.createElementNS(svgNS, 'svg');
hint.setAttribute('class', 'gp-hint');
hint.innerHTML = '<g class="gp-hint-draw"><path class="gp-hint-cut"/><path class="gp-hint-line"/><path class="gp-hint-branch"/><path class="gp-hint-leak"/></g><path class="gp-hint-hit"/>';
const hintParts = {
  cut: hint.querySelector('.gp-hint-cut'),
  line: hint.querySelector('.gp-hint-line'),
  branch: hint.querySelector('.gp-hint-branch'),
  leak: hint.querySelector('.gp-hint-leak'),
  hit: hint.querySelector('.gp-hint-hit')
};
hintParts.hit.setAttribute('role', 'button');
hintParts.hit.setAttribute('tabindex', '0');
hintParts.hit.setAttribute('aria-label', 'A crack in the page. Open it.');

body.append(filterHost, fx, hint, mend);

let w = innerWidth;
let h = innerHeight;
let crack = []; // the full tear line, top to bottom, [x, y] in screen pixels
let branches = [];

// A jagged line down the middle of the screen, from above the top edge to
// below the bottom, with a few hairline branches off its middle half.
const makeCrack = () => {
  w = root.clientWidth || innerWidth; h = innerHeight;
  crack = [];
  let x = w * .5 + rand(-w * .02, w * .02);
  for (let y = -16; ; y += rand(12, 30)) {
    x = clamp(x + rand(-12, 12), w * .42, w * .58);
    crack.push([x, Math.min(y, h + 16)]);
    if (y >= h + 16) break;
  }
  branches = [];
  const middle = crack.filter(([, y]) => y > h * .3 && y < h * .7);
  for (let i = 0; i < 5 && middle.length; i += 1) {
    let [bx, by] = middle[Math.floor(Math.random() * middle.length)];
    const side = Math.random() < .5 ? -1 : 1;
    const branch = [[bx, by]];
    for (let k = 0, n = 2 + Math.floor(Math.random() * 3); k < n; k += 1) {
      bx += side * rand(8, 22); by += rand(-6, 16);
      branch.push([bx, by]);
    }
    branches.push(branch);
  }
};

const pathOf = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
const between = (low, high) => crack.filter(([, y]) => y >= low && y <= high);

const drawHint = () => {
  hint.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const part = between(h * .25, h * .75);
  const d = pathOf(part);
  hintParts.cut.setAttribute('d', d);
  hintParts.line.setAttribute('d', d);
  hintParts.hit.setAttribute('d', d);
  hintParts.branch.setAttribute('d', branches.map(pathOf).join(''));
  // Short broken fragments of colour leaking out of the seam.
  hintParts.leak.setAttribute('d', part.filter((_, i) => i % 3 === 1).map(([x, y]) => `M${(x - 5).toFixed(1)} ${y.toFixed(1)}h10`).join(''));
};

// ---- state --------------------------------------------------------------
let arrivals = 0;
let away = false;
let found = false;
let state = 'idle'; // idle → tearing → falling → world → idle
let tear = null;

// The crack first appears at the top of the page; once there it stays put
// (it scrolls away with the page and is still there on the way back) until
// it is clicked. Leaving the page or reloading starts over.
const showHint = () => {
  const showing = hint.classList.contains('is-showing');
  const show = found && state === 'idle' && ready() && (showing || atTop());
  if (show && !hint.classList.contains('is-showing')) { makeCrack(); drawHint(); }
  hint.classList.toggle('is-showing', show);
};

// ---- the glitch world ---------------------------------------------------
let burstTimer = 0;
let blockTimer = 0;
let lastBurst = 0;

const calmSlices = () => slices.forEach(slice => { slice.style.opacity = 0; });

// The filter only covers the screen, not the whole (very tall) page, so a
// burst costs the same wherever it happens.
const fitFilter = () => {
  shredFilter.setAttribute('x', '-60');
  shredFilter.setAttribute('y', String(Math.round(scrollY)));
  shredFilter.setAttribute('width', String(w + 120));
  shredFilter.setAttribute('height', String(h));
};

const shredFrame = strength => {
  fitFilter();
  turbulence.setAttribute('seed', String(Math.floor(rand(1, 999))));
  turbulence.setAttribute('baseFrequency', `0.0001 ${rand(.02, .12).toFixed(3)}`);
  displacement.setAttribute('scale', String(Math.round(rand(30, 150) * strength)));
  const split = Math.round(rand(3, 12) * strength);
  splits[0].setAttribute('dx', String(split));
  splits[1].setAttribute('dx', String(-split));
  slices.forEach(slice => {
    const show = Math.random() < strength * .8;
    slice.style.opacity = show ? rand(.5, .95).toFixed(2) : 0;
    if (!show) return;
    slice.style.transform = `translate3d(${rand(-60, 60).toFixed(0)}px,${rand(0, h).toFixed(0)}px,0) scaleY(${rand(.2, .5 + 2.2 * strength).toFixed(2)})`;
  });
};

// A burst: a few frames of the page torn into sideways bands with its colour
// channels pulled apart. Kept to at most one and a half a second.
const burst = (strength = 1, frames = 5, then) => {
  if (reduced.matches) { then?.(); return; }
  const now = performance.now();
  if (now - lastBurst < 680) { then?.(); return; }
  lastBurst = now;
  root.classList.add('gp-shredding');
  const step = () => {
    if (frames-- <= 0 || (state !== 'world' && state !== 'tearing' && state !== 'healing')) {
      root.classList.remove('gp-shredding');
      calmSlices();
      then?.();
      return;
    }
    shredFrame(strength);
    burstTimer = setTimeout(step, rand(45, 95));
  };
  step();
};

const scheduleBursts = () => {
  clearTimeout(burstTimer);
  if (reduced.matches || !root.classList.contains('gp-world')) return;
  // While the paper is still in one piece, only clicks make it glitch.
  if (state !== 'world') { burstTimer = setTimeout(scheduleBursts, 600); return; }
  burstTimer = setTimeout(() => {
    if (document.hidden) { scheduleBursts(); return; }
    burst(rand(.45, 1), Math.round(rand(3, 7)), scheduleBursts);
  }, rand(1800, 5200));
};

// Small blocks of the page flicker back to their real colours or smear.
const scheduleBlocks = () => {
  clearTimeout(blockTimer);
  if (reduced.matches || !root.classList.contains('gp-world')) return;
  blockTimer = setTimeout(() => {
    if (!document.hidden) {
      blocks.forEach(block => {
        const show = Math.random() < .45;
        block.style.opacity = show ? 1 : 0;
        if (!show) return;
        const bw = rand(40, Math.min(320, w * .3)), bh = rand(6, 70);
        block.style.width = `${bw.toFixed(0)}px`;
        block.style.height = `${bh.toFixed(0)}px`;
        block.style.transform = `translate3d(${rand(0, w - bw).toFixed(0)}px,${rand(0, h - bh).toFixed(0)}px,0)`;
        block.dataset.kind = String(Math.floor(Math.random() * 3));
      });
      setTimeout(() => blocks.forEach(block => { block.style.opacity = 0; }), rand(70, 160));
    }
    scheduleBlocks();
  }, rand(660, 1600));
};

const enterWorld = () => {
  root.classList.add('gp-world');
  scheduleBursts();
  scheduleBlocks();
};

const leaveWorld = () => {
  clearTimeout(burstTimer);
  clearTimeout(blockTimer);
  calmSlices();
  blocks.forEach(block => { block.style.opacity = 0; });
  root.classList.remove('gp-world', 'gp-shredding', 'gp-world-settled');
  mend.classList.remove('is-showing');
};

// ---- tearing the page ---------------------------------------------------
// Copy what is on screen: the header and the hero, with a still of the
// hero's halftone canvas in place of the live one.
const buildPage = () => {
  const page = document.createElement('div');
  page.className = 'gp-page';
  const place = (source, clone) => {
    const rect = source.getBoundingClientRect();
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    Object.assign(clone.style, { position: 'absolute', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: '0', transform: 'none' });
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  };
  const hero = document.querySelector('.continuous-hero');
  if (hero) {
    const copy = place(hero, hero.cloneNode(true));
    const originals = [...hero.querySelectorAll('canvas')];
    copy.querySelectorAll('canvas').forEach((canvas, index) => {
      const source = originals[index];
      let still = null;
      if (source?.classList.contains('shape-waves__canvas')) still = hero.querySelector('.shape-waves-host')?.alobiSnapshot?.();
      else if (source) {
        still = document.createElement('canvas');
        still.width = source.width; still.height = source.height;
        try { still.getContext('2d').drawImage(source, 0, 0); } catch {}
      }
      if (!still) return;
      still.className = canvas.className;
      still.style.cssText = canvas.style.cssText + ';opacity:1';
      canvas.replaceWith(still);
    });
    page.append(copy);
  }
  const head = document.querySelector('.site-head');
  if (head) page.append(place(head, head.cloneNode(true)));
  return page;
};

const edgeSvg = () => {
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'gp-edge');
  svg.innerHTML = '<path class="gp-edge-fibre"/><path class="gp-edge-shade"/>';
  return svg;
};

const startTear = () => {
  if (state !== 'idle') return;
  // Clicked a little way down the page: glide back to the top first.
  if (!atTop()) {
    if (window.siteScroll) window.siteScroll.scrollTo(0); else scrollTo({ top: 0, behavior: 'smooth' });
    const began = performance.now();
    const wait = () => {
      if (atTop()) { startTear(); return; }
      if (performance.now() - began < 1100) { requestAnimationFrame(wait); return; }
      // Still gliding: finish the last stretch at once.
      if (window.siteScroll) window.siteScroll.scrollTo(0, { immediate: true }); else scrollTo(0, 0);
      requestAnimationFrame(() => { if (atTop()) startTear(); });
    };
    requestAnimationFrame(wait);
    return;
  }
  hint.classList.remove('is-showing');
  // Opened: the next crack is left to chance again.
  found = false; arrivals = 0; needed = laterChance();
  if (reduced.matches) { state = 'world'; enterWorld(); root.classList.add('gp-world-settled'); mend.classList.add('is-showing'); return; }
  state = 'tearing';
  const overlay = document.createElement('div');
  overlay.className = 'gp-tear';
  overlay.setAttribute('aria-hidden', 'true');
  const sheets = ['left', 'right'].map(side => {
    const sheet = document.createElement('div');
    sheet.className = `gp-sheet gp-${side}`;
    const clip = document.createElement('div');
    clip.className = 'gp-sheet-clip';
    clip.append(buildPage(), edgeSvg());
    sheet.append(clip);
    overlay.append(sheet);
    return { sheet, clip, edge: clip.querySelector('.gp-edge'), side: side === 'left' ? -1 : 1 };
  });
  const pull = document.createElement('div');
  pull.className = 'gp-pull';
  pull.textContent = '‹ PULL IT APART ›';
  overlay.append(pull);
  body.append(overlay);
  root.classList.add('gp-tearing');
  tear = { overlay, sheets, pull, gap: 0, targetGap: 14, open: 0, targetOpen: 0, clicks: 0, frame: 0, drag: null };
  enterWorld();
  burst(.7, 4);
  overlay.addEventListener('pointerdown', tearDown);
  overlay.addEventListener('pointermove', tearMove);
  overlay.addEventListener('pointerup', tearUp);
  overlay.addEventListener('pointercancel', tearUp);
  animateTear();
};

const FULL = () => w * .13; // gap at which the paper gives way

// The seam is a lens: widest in its middle, closed at both ends. `open`
// (0–1) runs its ends from the middle half of the screen out to both edges.
const renderTear = () => {
  const { sheets, gap, open } = tear;
  const top = h * .25 + (-40 - h * .25) * open;
  const bottom = h * .75 + (h + 40 - h * .75) * open;
  sheets.forEach(({ clip, edge, side }) => {
    const points = crack.map(([x, y]) => {
      const t = (y - top) / (bottom - top);
      const width = t > 0 && t < 1 ? gap * Math.pow(Math.sin(Math.PI * t), .6) : 0;
      // A hair of overlap where the seam is shut hides the join.
      return [x + side * (width / 2 - .8), y];
    });
    const outer = side < 0 ? [[-40, h + 40], [-40, -40]] : [[w + 40, h + 40], [w + 40, -40]];
    const shape = [...points, ...outer];
    clip.style.clipPath = `polygon(${shape.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    const openPart = points.filter(([, y], i) => { const t = (crack[i][1] - top) / (bottom - top); return t > 0 && t < 1; });
    edge.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const d = pathOf(openPart);
    edge.querySelector('.gp-edge-fibre').setAttribute('d', d);
    edge.querySelector('.gp-edge-shade').setAttribute('d', pathOf(openPart.map(([x, y]) => [x - side * 3, y])));
  });
};

const animateTear = () => {
  if (!tear || state !== 'tearing') return;
  tear.gap += (tear.targetGap - tear.gap) * .22;
  tear.open += (tear.targetOpen - tear.open) * .2;
  renderTear();
  tear.frame = requestAnimationFrame(animateTear);
};

const pry = gap => {
  tear.targetGap = gap;
  tear.targetOpen = Math.max(tear.targetOpen, clamp(gap / FULL()) * .8);
  if (gap >= FULL()) giveWay();
};

const tearDown = event => {
  if (state !== 'tearing') return;
  tear.overlay.setPointerCapture?.(event.pointerId);
  tear.drag = { x: event.clientX, gap: tear.targetGap, moved: 0, at: performance.now() };
  tear.overlay.classList.add('is-pulling');
};

const tearMove = event => {
  if (!tear?.drag || state !== 'tearing') return;
  const dx = Math.abs(event.clientX - tear.drag.x);
  tear.drag.moved = Math.max(tear.drag.moved, dx);
  pry(tear.drag.gap + dx * 1.1);
  tear.pull.classList.add('is-gone');
};

const tearUp = () => {
  if (!tear?.drag || state !== 'tearing') return;
  const { moved, at } = tear.drag;
  tear.drag = null;
  tear.overlay.classList.remove('is-pulling');
  if (moved < 6 && performance.now() - at < 500) {
    // A click: the paper gives a little more each time, with a jolt.
    tear.clicks += 1;
    burst(.6, 3);
    tear.overlay.animate([{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(${rand(-7, 7)}px,${rand(-4, 4)}px,0)` }, { transform: 'translate3d(0,0,0)' }], { duration: 160 });
    pry(tear.clicks >= 4 ? FULL() : tear.targetGap + w * .03);
  }
};

// The paper gives way: the tear runs to both edges and each half drops away
// to its own side like a torn sheet, revealing the world underneath.
const giveWay = () => {
  if (state !== 'tearing') return;
  state = 'falling';
  cancelAnimationFrame(tear.frame);
  const { overlay, sheets, pull } = tear;
  pull.classList.add('is-gone');
  overlay.classList.add('is-falling');
  const start = performance.now();
  const from = { gap: tear.gap, open: tear.open };
  const run = now => {
    const t = clamp((now - start) / 220);
    tear.gap = from.gap + (FULL() * 1.2 - from.gap) * smooth(t);
    tear.open = from.open + (1 - from.open) * smooth(t);
    renderTear();
    if (t < 1) { requestAnimationFrame(run); return; }
    const falls = sheets.map(({ sheet, side }) => sheet.animate([
      { transform: 'none' },
      { transform: `perspective(1600px) translate3d(${side * 3}%,1.5%,0) rotateY(${side * -8}deg) rotate(${side * 2.5}deg)`, offset: .22 },
      { transform: `perspective(1600px) translate3d(${side * 62}%,115%,0) rotateY(${side * -38}deg) rotate(${side * 26}deg)` }
    ], { duration: 1150, easing: 'cubic-bezier(.5,0,.75,.35)', fill: 'forwards' }));
    Promise.all(falls.map(fall => fall.finished)).catch(() => {}).then(() => {
      overlay.remove();
      tear = null;
      root.classList.remove('gp-tearing');
      root.classList.add('gp-world-settled');
      state = 'world';
      mend.classList.add('is-showing');
      lastBurst = 0;
      burst(1, 5, scheduleBursts);
    });
  };
  requestAnimationFrame(run);
};

// Closing a half-open seam (Esc while tearing) pulls the halves back together.
const closeTear = () => {
  if (!tear) return;
  cancelAnimationFrame(tear.frame);
  const { overlay } = tear;
  tear.targetGap = 0; tear.targetOpen = 0;
  const start = performance.now();
  const from = { gap: tear.gap, open: tear.open };
  const run = now => {
    const t = clamp((now - start) / 260);
    tear.gap = from.gap * (1 - smooth(t));
    tear.open = from.open * (1 - smooth(t));
    renderTear();
    if (t < 1) { requestAnimationFrame(run); return; }
    overlay.remove();
    tear = null;
    root.classList.remove('gp-tearing');
    leaveWorld();
    state = 'idle';
    showHint();
  };
  requestAnimationFrame(run);
};

const heal = () => {
  if (state === 'tearing') { state = 'healing'; closeTear(); return; }
  if (state !== 'world') return;
  state = 'healing';
  mend.classList.remove('is-showing');
  lastBurst = 0;
  burst(1, 5, () => { leaveWorld(); state = 'idle'; showHint(); });
};

hintParts.hit.addEventListener('click', startTear);
hintParts.hit.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); startTear(); } });
mend.addEventListener('click', heal);
addEventListener('keydown', event => { if (event.key === 'Escape') heal(); });

// Scrolling through the world shakes it: a burst now and then while moving.
addEventListener('scroll', () => {
  if (state === 'world' && Math.random() < .04) burst(rand(.3, .7), 2);
}, { passive: true });

// ---- counting returns to the top ----------------------------------------
addEventListener('scroll', () => {
  if (scrollY > innerHeight * .6) away = true;
  if (away && atTop() && ready()) {
    away = false;
    arrivals += 1;
    if (arrivals >= needed) found = true;
  }
  showHint();
}, { passive: true });

addEventListener('resize', () => {
  if (state === 'idle' && hint.classList.contains('is-showing')) { makeCrack(); drawHint(); }
  else if (state === 'tearing') heal();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden && state === 'world') { scheduleBursts(); scheduleBlocks(); } });
reduced.addEventListener('change', () => { if (state === 'world') { scheduleBursts(); scheduleBlocks(); } });
