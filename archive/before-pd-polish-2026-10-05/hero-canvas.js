// The home cover as a design canvas.
//
// ALOBI is set in halftone on a white artboard (ShapeWaves.js), and the page
// around it behaves like a design tool:
//  - Rulers run along the top and left edges, measured from the artboard's
//    corner, with a hairline that follows the pointer and a band that marks
//    the letter under it.
//  - Each letter is a layer. Hover one and it gets an outline; press and it
//    is selected (handles and a size tag); drag it and red measurements show
//    the gaps to its neighbours and how far it has moved, with smart guides
//    when it lines up again. Let go and it springs back into the word. With a
//    letter selected, the arrow keys nudge it (Shift for 10 px), as in Figma.
//  - A small floating inspector shows the layer's position and size and has
//    two sliders that retune the halftone live.
//  - On a first visit a second cursor, "Alobi", drops in, picks up the L and
//    shows what the letters do, then leaves.
//  - Hovering ARCH / PD / PM retypes the word (unchanged from before), and
//    the O is still the eye that watches you.
// The opening takes about a second: the artboard opens from its centre, the
// dots spawn outwards and ALOBI types itself in.
import ShapeWaves from './ShapeWaves.js?v=20260924-canvas-1';

const hero = document.querySelector('.continuous-hero');
if (hero) {
  const host = hero.querySelector('.shape-waves-host');
  const field = hero.querySelector('.landing-field');
  const body = document.body;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
  const easeInOut = n => { n = clamp(n); return n < .5 ? 4 * n * n * n : 1 - (-2 * n + 2) ** 3 / 2; };
  const easeOut = n => 1 - (1 - clamp(n)) ** 3;
  const mono = '"DM Mono", ui-monospace, SFMono-Regular, Consolas, monospace';
  const BLUE = '#0071e3', RED = '#e1251b', VIOLET = '#7b61ff';

  hero.classList.add('hero-canvas');
  const status = document.createElement('span');
  status.className = 'arrival-status'; status.setAttribute('role', 'status'); status.textContent = 'Opening portfolio';
  hero.append(status);

  // ---- a first visit opens; coming back shows it as it was ----------------
  let navType = '';
  try { navType = performance.getEntriesByType('navigation')[0]?.type || ''; } catch {}
  let lineReturn = false;
  try { lineReturn = sessionStorage.getItem('alobi-home-line-return') === '1'; sessionStorage.removeItem('alobi-home-line-return'); } catch {}
  const skip = reduced || navType === 'back_forward' || (!lineReturn && location.hash && location.hash !== '#top');
  let visitorSeen = true;
  try { visitorSeen = sessionStorage.getItem('alobi-hero-visitor') === '1'; } catch {}

  // ---- the halftone word -----------------------------------------------
  let waves = null;
  try {
    waves = ShapeWaves(host, {
      text: 'ALOBI', fontFamily: 'Geist, "Geist Sans", system-ui, sans-serif', fontWeight: 500, textSize: .6,
      shapes: 'squares', cellSize: 8, dotSize: .75, color: '#000000', hoverColor: '#7b6f6f', backgroundColor: '#ffffff',
      speed: 1, scale: 1, contrast: .95, brightness: .37, flow: 0, direction: 0, fade: 0, interactive: true,
      splashRadius: 62, splashStrength: .4, glow: .35, intro: !skip, introDuration: .95, paused: false, eye: 'O',
      startEmpty: !skip
    });
    host.alobiSnapshot = () => waves.snapshot();
  } catch (error) { host.dataset.failed = 'true'; console.error(error); }
  const defaults = { cellSize: 8, dotSize: .75 };

  // ---- overlay ------------------------------------------------------------
  const overlay = document.createElement('canvas');
  overlay.className = 'hc-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  field.append(overlay);
  const ctx = overlay.getContext('2d');
  let W = 0, H = 0, dpr = 1, board = { x: 0, y: 0, w: 0, h: 0 }, headH = 52;
  const rulersOn = () => fine && W > 900;
  const R = 18; // ruler thickness

  const frameSize = hero.querySelector('.hc-frame-size');
  const measure = () => {
    const heroBox = hero.getBoundingClientRect(), box = host.getBoundingClientRect();
    W = heroBox.width; H = heroBox.height;
    board = { x: box.left - heroBox.left, y: box.top - heroBox.top, w: box.width, h: box.height };
    headH = document.querySelector('.site-head')?.offsetHeight || 52;
    dpr = Math.min(devicePixelRatio || 1, 2);
    overlay.width = Math.round(W * dpr); overlay.height = Math.round(H * dpr);
    if (frameSize) frameSize.textContent = `${Math.round(board.w)} × ${Math.round(board.h)}`;
    wake();
  };

  // ---- letters as layers --------------------------------------------------
  // springs[i] = the offset of letter i from its place, and its velocity.
  let springs = [];
  const spring = i => (springs[i] ||= { x: 0, y: 0, vx: 0, vy: 0, held: false });
  const pushOffsets = () => waves?.setOffsets(springs.map(s => s ? [s.x, s.y] : [0, 0]));
  const boxes = () => (waves?.letterBoxes() || []).map(b => ({ ...b, x: b.x + board.x, y: b.y + board.y }));
  const homeBox = (b, i) => { const s = springs[i]; return s ? { ...b, x: b.x - s.x, y: b.y - s.y } : b; };
  const hitLetter = (x, y) => {
    const list = boxes();
    for (let i = list.length - 1; i >= 0; i--) {
      const b = list[i];
      if (x >= b.x - 6 && x <= b.x + b.w + 6 && y >= b.y - 6 && y <= b.y + b.h + 6) return i;
    }
    return -1;
  };

  let pointer = null;          // { x, y } in hero pixels while over the hero
  let hover = -1, selected = -1, drag = null, nudgeTimer = 0, wordBusyUntil = 0;
  let selectedBy = 'you';       // 'you' or 'visitor'
  const layerName = (b) => !b ? 'ALOBI' : b.ch === 'O' && waves?.word() === 'ALOBI' ? 'O — eye' : b.ch;

  // ---- the site cursor says DRAG over a letter ----------------------------
  const cursor = () => document.querySelector('.fx-cursor');
  const setCursorLabel = on => {
    const c = cursor(); if (!c) return;
    if (on) { const s = c.querySelector('span'); if (s) s.textContent = 'DRAG'; c.classList.add('is-action', 'is-label'); }
    else c.classList.remove('is-action', 'is-label');
  };
  let labelled = false;
  const updateCursor = () => {
    const want = fine && !drag && hover >= 0;
    if (want === labelled) return;
    labelled = want; setCursorLabel(want);
    if (want) requestAnimationFrame(() => { if (labelled) setCursorLabel(true); });
  };

  const local = event => { const r = hero.getBoundingClientRect(); return { x: event.clientX - r.left, y: event.clientY - r.top }; };

  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointer = local(event);
    if (drag) moveDrag(event);
    else {
      const inBoard = pointer.x >= board.x && pointer.x <= board.x + board.w && pointer.y >= board.y && pointer.y <= board.y + board.h;
      const over = event.target === host || host.contains(event.target);
      hover = inBoard && over ? hitLetter(pointer.x, pointer.y) : -1;
    }
    updateCursor(); showInspector(); wake();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { if (drag) return; pointer = null; hover = -1; updateCursor(); showInspector(); wake(); });

  host.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const p = local(event);
    const index = hitLetter(p.x, p.y);
    if (index < 0) { selected = -1; showInspector(); wake(); return; }
    endVisitor(true);
    selected = index; selectedBy = 'you';
    if (event.pointerType === 'touch') {
      // On touch the letter hops instead of being dragged, so the page still scrolls.
      const s = spring(index); s.vy -= 900; s.vx += (Math.random() - .5) * 160;
      showInspector(); wake(); return;
    }
    event.preventDefault();
    const s = spring(index);
    s.held = true; s.vx = s.vy = 0;
    drag = { index, startX: p.x, startY: p.y, fromX: s.x, fromY: s.y, lastX: p.x, lastY: p.y, lastT: performance.now(), vx: 0, vy: 0, snapX: false, snapY: false, shift: event.shiftKey };
    host.setPointerCapture?.(event.pointerId);
    setCursorLabel(false); labelled = false;
    showInspector(); wake();
  });

  const SNAP = 5;
  function moveDrag(event) {
    const p = local(event), s = spring(drag.index), now = performance.now();
    let dx = p.x - drag.startX, dy = p.y - drag.startY;
    if (event.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
    let x = drag.fromX + dx, y = drag.fromY + dy;
    drag.snapX = Math.abs(x) < SNAP; drag.snapY = Math.abs(y) < SNAP;
    if (drag.snapX) x = 0;
    if (drag.snapY) y = 0;
    const dt = Math.max(1, now - drag.lastT) / 1000;
    drag.vx = drag.vx * .6 + ((p.x - drag.lastX) / dt) * .4; drag.vy = drag.vy * .6 + ((p.y - drag.lastY) / dt) * .4;
    drag.lastX = p.x; drag.lastY = p.y; drag.lastT = now;
    s.x = x; s.y = y;
    pushOffsets();
  }
  const release = () => {
    if (!drag) return;
    const s = spring(drag.index);
    s.held = false; s.vx = clamp(drag.vx, -2400, 2400) * .35; s.vy = clamp(drag.vy, -2400, 2400) * .35;
    drag = null;
    if (pointer) hover = hitLetter(pointer.x, pointer.y);
    updateCursor(); wake();
  };
  host.addEventListener('pointerup', release);
  host.addEventListener('pointercancel', release);
  host.addEventListener('lostpointercapture', release);

  // Arrow keys nudge the selected letter while the cover is in view.
  addEventListener('keydown', event => {
    if (selected < 0 || drag || scrollY > H * .5) return;
    if (event.target instanceof Element && event.target.closest('input,textarea,[contenteditable],button,a')) return;
    if (event.key === 'Escape') { selected = -1; showInspector(); wake(); return; }
    const step = event.shiftKey ? 10 : 1;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!move) return;
    event.preventDefault();
    const s = spring(selected);
    s.held = true; s.x += move[0]; s.y += move[1]; s.vx = s.vy = 0;
    pushOffsets(); showInspector(); wake();
    clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(() => { springs.forEach(sp => { if (sp && !(drag && sp === springs[drag.index])) sp.held = false; }); wake(); }, 1100);
  });

  // ---- springs: every letter that is off its place goes home -------------
  const K = 300, C = 17; // underdamped: a little overshoot, then still
  const stepSprings = dt => {
    let moving = false;
    springs.forEach(s => {
      if (!s || s.held) { if (s?.held && (s.x || s.y)) moving = true; return; }
      if (!s.x && !s.y && !s.vx && !s.vy) return;
      if (reduced) { s.x = s.y = s.vx = s.vy = 0; moving = true; return; }
      s.vx += (-K * s.x - C * s.vx) * dt; s.vy += (-K * s.y - C * s.vy) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (Math.abs(s.x) < .25 && Math.abs(s.y) < .25 && Math.abs(s.vx) < 4 && Math.abs(s.vy) < 4) { s.x = s.y = s.vx = s.vy = 0; }
      moving = true;
    });
    return moving;
  };

  // ---- inspector ------------------------------------------------------------
  const inspector = hero.querySelector('.hc-inspector');
  const out = name => inspector?.querySelector(`[data-hc="${name}"]`);
  const fields = { name: out('name'), kind: out('kind'), x: out('x'), y: out('y'), w: out('w'), h: out('h') };
  const cellInput = out('cell'), dotInput = out('dot');
  let shownLayer = '';
  function showInspector() {
    if (!inspector) return;
    const list = boxes();
    const index = drag ? drag.index : selected >= 0 ? selected : hover;
    const b = list[index];
    const put = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
    if (b) {
      put(fields.name, layerName(b)); put(fields.kind, 'Text');
      put(fields.x, String(Math.round(b.x - board.x))); put(fields.y, String(Math.round(b.y - board.y)));
      put(fields.w, String(Math.round(b.w))); put(fields.h, String(Math.round(b.h)));
    } else {
      put(fields.name, waves?.word() || 'ALOBI'); put(fields.kind, 'Frame');
      put(fields.x, '0'); put(fields.y, '0'); put(fields.w, String(Math.round(board.w))); put(fields.h, String(Math.round(board.h)));
    }
    const layer = b ? (selectedBy === 'visitor' && index === selected ? 'visitor' : 'letter') : '';
    if (layer !== shownLayer) {
      shownLayer = layer;
      inspector.classList.toggle('is-letter', layer === 'letter');
      inspector.classList.toggle('is-visitor', layer === 'visitor');
      const icon = inspector.querySelector('.hc-layer i'); if (icon) icon.textContent = b ? 'T' : '#';
    }
  }
  const paintSlider = input => {
    if (!input) return;
    const min = +input.min, max = +input.max;
    input.style.setProperty('--fill', `${((+input.value - min) / (max - min)) * 100}%`);
    const o = input.parentElement.querySelector('output');
    if (o) o.textContent = input === dotInput ? String(+(+input.value).toFixed(2)).replace(/^0/, '') : input.value;
  };
  const tune = () => { waves?.tune({ cellSize: +cellInput.value, dotSize: +dotInput.value }); paintSlider(cellInput); paintSlider(dotInput); };
  [cellInput, dotInput].forEach(input => { if (!input) return; input.addEventListener('input', tune); paintSlider(input); });
  inspector?.querySelector('.hc-reset')?.addEventListener('click', () => {
    if (cellInput) cellInput.value = defaults.cellSize;
    if (dotInput) dotInput.value = defaults.dotSize;
    tune();
    springs.forEach(s => { if (s) { s.held = false; s.vy -= 380; } });
    selected = -1; showInspector(); wake();
  });

  // ---- ARCH / PD / PM retype the word -------------------------------------
  const scaleButtons = [...hero.querySelectorAll('.scale')], scaleMap = hero.querySelector('.scale-map');
  let wordTimer = 0, wordShown = 'ALOBI';
  const showWord = (word, delay) => {
    clearTimeout(wordTimer);
    wordTimer = setTimeout(() => {
      if (!waves || word === wordShown) return;
      wordShown = word;
      endVisitor(true);
      release();
      springs = []; selected = hover = -1;
      waves.retype(word);
      wordBusyUntil = performance.now() + 1400;
      showInspector(); wake();
    }, delay);
  };
  scaleButtons.forEach(button => {
    const word = button.querySelector('span')?.textContent.trim() || '';
    if (!word) return;
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showWord(word, 0); });
    button.addEventListener('focus', () => showWord(word, 0));
  });
  scaleMap?.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') showWord('ALOBI', 160); });
  scaleMap?.addEventListener('focusout', event => { if (!scaleMap.contains(event.relatedTarget)) showWord('ALOBI', 200); });

  // ---- the visiting cursor ------------------------------------------------
  // A scripted second cursor, as when a collaborator is in the same file.
  let visitor = null, visitorTries = 0;
  const startVisitor = () => {
    if (visitor || !fine || reduced || !waves || W < 900 || scrollY > 40) return;
    // Wait for the name to finish typing (and for the reader to be at the top).
    if (boxes().length < 5 || waves.word() !== 'ALOBI') { if ((visitorTries += 1) < 12) setTimeout(startVisitor, 350); return; }
    try { sessionStorage.setItem('alobi-hero-visitor', '1'); } catch {}
    visitor = { t0: performance.now(), x: board.x + board.w * .9, y: board.y + board.h * .92, alpha: 0, grabbed: false, released: false, leaving: false };
    wake();
  };
  function endVisitor(now) {
    if (!visitor) return;
    if (visitor.grabbed && !visitor.released) { const s = spring(1); s.held = false; }
    if (selectedBy === 'visitor') { selected = -1; selectedBy = 'you'; }
    if (now) { visitor.leaving = true; visitor.fadeFrom = performance.now(); }
  }
  const bezier = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
  const runVisitor = now => {
    const v = visitor; if (!v) return false;
    const t = (now - v.t0) / 1000;
    const list = boxes();
    const L = list[1] ? homeBox(list[1], 1) : null, O = list[2] ? homeBox(list[2], 2) : null;
    if ((!L || !O || waves.word() !== 'ALOBI') && !v.leaving) endVisitor(true);
    if (v.leaving || !L || !O) {
      if (!v.leaving) { v.leaving = true; v.fadeFrom = now; }
      v.alpha = 1 - clamp((now - v.fadeFrom) / 260);
      if (v.alpha <= 0) { visitor = null; showInspector(); }
      return true;
    }
    const start = { x: board.x + board.w * .9, y: board.y + board.h * .92 };
    const grab = { x: L.x + L.w * .55, y: L.y + L.h * .42 };
    const lift = { x: grab.x - 18, y: grab.y - board.h * .26 };
    const rest = { x: O.x + O.w * 1.02, y: O.y - 6 };
    v.alpha = ease(t / .3);
    if (t < 1.1) { const k = easeInOut((t - .1) / 1); v.x = bezier(start.x, start.x - board.w * .25, grab.x, k); v.y = bezier(start.y, grab.y + board.h * .2, grab.y, k); }
    else if (t < 1.35) { v.x = grab.x; v.y = grab.y; hover = -1; }
    else if (t < 2.25) {
      if (!v.grabbed) { v.grabbed = true; selected = 1; selectedBy = 'visitor'; spring(1).held = true; }
      const k = easeInOut((t - 1.35) / .9);
      v.x = bezier(grab.x, grab.x - 30, lift.x, k); v.y = bezier(grab.y, grab.y - 10, lift.y, k);
      const s = spring(1); s.x = v.x - grab.x; s.y = v.y - grab.y; pushOffsets();
    } else if (t < 2.5) { /* holds it up there a moment */ }
    else if (t < 3.5) {
      if (!v.released) { v.released = true; const s = spring(1); s.held = false; s.vy = 240; }
      const k = easeInOut((t - 2.5) / 1);
      v.x = bezier(lift.x, lift.x + board.w * .1, rest.x, k); v.y = bezier(lift.y, lift.y - 30, rest.y, k);
    } else if (t < 4.6) {
      if (selectedBy === 'visitor' && t > 3.6) { selected = -1; selectedBy = 'you'; }
      v.x = rest.x + Math.sin((t - 3.5) * 3.2) * 6; v.y = rest.y + Math.sin((t - 3.5) * 2.1) * 4;
    } else endVisitor(true);
    showInspector();
    return true;
  };

  // ---- drawing --------------------------------------------------------------
  const px = n => Math.round(n) + .5;
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const chip = (text, x, y, bg, fg = '#fff', align = 'center') => {
    ctx.font = `500 10px ${mono}`;
    const w = Math.ceil(ctx.measureText(text).width) + 10, h = 16;
    let left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    left = clamp(left, 2, W - w - 2);
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(left, y - h / 2, w, h, 3) : ctx.rect(left, y - h / 2, w, h); ctx.fill();
    ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, left + 5, y + .5);
  };

  function drawRulers(progress, band) {
    const top = headH, span = board.x;
    ctx.save();
    ctx.globalAlpha = ease(progress * 1.6);
    ctx.fillStyle = 'rgba(251,251,253,.96)';
    ctx.fillRect(0, top, W, R); ctx.fillRect(0, top + R, R, H - top - R);
    ctx.strokeStyle = 'rgba(0,0,0,.09)'; ctx.lineWidth = 1;
    line(0, px(top + R) - 1, W, px(top + R) - 1); line(px(R) - 1, top, px(R) - 1, H);
    // Marked ranges (the letter under the pointer or held).
    if (band) {
      ctx.fillStyle = band.color === VIOLET ? 'rgba(123,97,255,.16)' : 'rgba(0,113,227,.14)';
      ctx.fillRect(band.x, top, band.w, R - 1); ctx.fillRect(0, band.y, R - 1, band.h);
    }
    const reach = progress * Math.max(W, H);
    ctx.strokeStyle = '#b6b6bb'; ctx.fillStyle = '#8e8e93'; ctx.font = `400 8.5px ${mono}`; ctx.textBaseline = 'top';
    const labelClear = (pos, marks) => marks.every(m => Math.abs(pos - m) > 26);
    const topMarks = band ? [band.x, band.x + band.w] : [], leftMarks = band ? [band.y, band.y + band.h] : [];
    // Top ruler.
    const x0 = Math.ceil((R - span) / 10) * 10;
    for (let v = x0; span + v < W; v += 10) {
      const x = span + v;
      if (Math.abs(x - board.x) > reach) continue;
      const major = v % 100 === 0, mid = v % 50 === 0;
      ctx.beginPath(); ctx.moveTo(px(x), top + R - 1); ctx.lineTo(px(x), top + R - 1 - (major ? 8 : mid ? 5 : 3)); ctx.stroke();
      if (major && labelClear(x, topMarks)) { ctx.textAlign = 'left'; ctx.fillText(String(v), x + 3, top + 3); }
    }
    // Left ruler.
    const y0 = Math.ceil((top + R - board.y) / 10) * 10;
    for (let v = y0; board.y + v < H; v += 10) {
      const y = board.y + v;
      if (Math.abs(y - board.y) > reach) continue;
      const major = v % 100 === 0, mid = v % 50 === 0;
      ctx.beginPath(); ctx.moveTo(R - 1, px(y)); ctx.lineTo(R - 1 - (major ? 8 : mid ? 5 : 3), px(y)); ctx.stroke();
      if (major && labelClear(y, leftMarks)) { ctx.save(); ctx.translate(3, y - 3); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'left'; ctx.fillText(String(v), 0, 0); ctx.restore(); }
    }
    // The band's edges, numbered in its colour.
    if (band) {
      ctx.fillStyle = band.color; ctx.font = `500 8.5px ${mono}`;
      ctx.textAlign = 'right'; ctx.fillText(String(Math.round(band.x - board.x)), band.x - 3, top + 4);
      ctx.textAlign = 'left'; ctx.fillText(String(Math.round(band.x + band.w - board.x)), band.x + band.w + 3, top + 4);
      [[band.y, 'right'], [band.y + band.h, 'left']].forEach(([y, side]) => {
        ctx.save(); ctx.translate(4, y + (side === 'right' ? -3 : 3)); ctx.rotate(-Math.PI / 2);
        ctx.textAlign = side === 'right' ? 'left' : 'right'; ctx.fillText(String(Math.round(y - board.y)), 0, 0); ctx.restore();
      });
    }
    // Where the pointer is.
    if (pointer && pointer.y > top) {
      ctx.strokeStyle = RED; ctx.lineWidth = 1;
      line(px(pointer.x), top, px(pointer.x), top + R - 1);
      if (pointer.y > top + R) line(0, px(pointer.y), R - 1, px(pointer.y));
    }
    // The corner square.
    ctx.fillStyle = 'rgba(251,251,253,1)'; ctx.fillRect(0, top, R - 1, R - 1);
    ctx.restore();
  }

  function drawFrame(b, color, handles) {
    const x = px(b.x - 3), y = px(b.y - 3), w = Math.round(b.w + 6), h = Math.round(b.h + 6);
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
    if (!handles) return;
    ctx.fillStyle = '#fff';
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([hx, hy]) => { ctx.fillRect(hx - 3.5, hy - 3.5, 7, 7); ctx.strokeRect(hx - 3.5, hy - 3.5, 7, 7); });
    const top = headH + (rulersOn() ? R : 0) + 9;
    chip(layerName(b), x - .5, y - 13 < top ? y + 13 : y - 13, color, '#fff', 'left');
    chip(`${Math.round(b.w)} × ${Math.round(b.h)}`, x + w / 2, y + h + 16, color);
  }

  function drawMeasures(index, list, snapX, snapY) {
    const b = list[index], home = homeBox(b, index), s = springs[index];
    if (!s) return;
    ctx.save();
    // Where it belongs, dashed.
    ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(0,113,227,.55)'; ctx.lineWidth = 1;
    ctx.strokeRect(px(home.x), px(home.y), Math.round(home.w), Math.round(home.h));
    ctx.restore();
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, hx = home.x + home.w / 2, hy = home.y + home.h / 2;
    ctx.strokeStyle = RED; ctx.lineWidth = 1;
    if (Math.hypot(s.x, s.y) > 8) {
      ctx.save(); ctx.setLineDash([2, 3]); line(hx, hy, cx, cy); ctx.restore();
      chip(`${Math.round(s.x)}, ${Math.round(s.y)}`, (hx + cx) / 2, (hy + cy) / 2, RED);
    }
    // Gaps to the letters either side, measured at this letter's middle.
    [[list[index - 1], -1], [list[index + 1], 1]].forEach(([n, side]) => {
      if (!n) return;
      const from = side < 0 ? n.x + n.w : b.x + b.w, to = side < 0 ? b.x : n.x;
      const gap = to - from;
      // Only real gaps between letters that still sit side by side.
      const overlapTop = Math.max(b.y, n.y), overlapBottom = Math.min(b.y + b.h, n.y + n.h);
      if (gap < 2 || overlapBottom - overlapTop < 12) return;
      const y = px(clamp(cy, overlapTop + 6, overlapBottom - 6));
      line(from, y, to, y); line(px(from), y - 4, px(from), y + 4); line(px(to), y - 4, px(to), y + 4);
      if (gap > 18) chip(String(Math.round(gap)), (from + to) / 2, y - 12, RED);
    });
    // Smart guides once it lines up with the word again.
    const others = list.filter((_, i) => i !== index);
    if (snapY && others.length) {
      const left = Math.min(b.x, ...others.map(o => o.x)), right = Math.max(b.x + b.w, ...others.map(o => o.x + o.w));
      [b.y, b.y + b.h].forEach(y => { line(left - 12, px(y), right + 12, px(y)); });
      [...others, b].forEach(o => [o.y, o.y + o.h].forEach(y => { const ex = o.x + o.w / 2; line(ex - 3, y - 3, ex + 3, y + 3); line(ex - 3, y + 3, ex + 3, y - 3); }));
    }
    if (snapX) line(px(cx), board.y + 8, px(cx), board.y + board.h - 8);
  }

  function drawVisitor(v) {
    if (!v || v.alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = v.alpha; ctx.translate(Math.round(v.x), Math.round(v.y));
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16.5); ctx.lineTo(4.4, 12.4); ctx.lineTo(7.4, 19.2); ctx.lineTo(10.2, 18); ctx.lineTo(7.3, 11.3); ctx.lineTo(13, 11.3); ctx.closePath();
    ctx.fillStyle = VIOLET; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.lineJoin = 'round'; ctx.fill(); ctx.stroke();
    ctx.font = `600 11px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`;
    const label = 'Alobi', w = ctx.measureText(label).width + 14;
    ctx.fillStyle = VIOLET; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(12, 19, w, 19, [2, 9, 9, 9]) : ctx.rect(12, 19, w, 19); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, 19, 29);
    ctx.restore();
  }

  // ---- loop ---------------------------------------------------------------
  let raf = 0, last = 0, visible = true, openAt = 0;
  const opening = () => (openAt ? clamp((performance.now() - openAt) / 700) : 1);
  function frame(now) {
    raf = 0; if (!visible || document.hidden) return;
    const dt = Math.min(.032, Math.max(.001, (now - (last || now)) / 1000)); last = now;
    let busy = stepSprings(dt);
    if (busy && !drag) pushOffsets();
    else if (busy) pushOffsets();
    busy = runVisitor(now) || busy;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const list = boxes();
    const activeIndex = drag ? drag.index : selected;
    const active = list[activeIndex], hovered = hover !== activeIndex ? list[hover] : null;
    const bandBox = active || list[hover];
    const bandColor = active && selectedBy === 'visitor' && !drag ? VIOLET : BLUE;
    const progress = skip ? 1 : opening();
    if (rulersOn()) drawRulers(progress, bandBox ? { x: bandBox.x, y: bandBox.y, w: bandBox.w, h: bandBox.h, color: bandColor } : null);
    ctx.save();
    // Nothing is drawn over the rulers or under the header.
    const edge = rulersOn() ? R : 0;
    ctx.beginPath(); ctx.rect(edge, headH + edge, W - edge, H - headH - edge); ctx.clip();
    if (visitor && !visitor.grabbed && !visitor.leaving && (performance.now() - visitor.t0) > 1100 && list[1]) drawFrame(list[1], VIOLET, false);
    if (hovered) drawFrame(hovered, BLUE, false);
    if (active) {
      const moving = springs[activeIndex] && (springs[activeIndex].x || springs[activeIndex].y);
      if (moving || drag) drawMeasures(activeIndex, list, drag?.snapX, drag?.snapY);
      drawFrame(active, bandColor, true);
    }
    ctx.restore();
    drawVisitor(visitor);
    const typing = performance.now() < wordBusyUntil;
    if (busy || drag || typing) showInspector();
    if (busy || drag || typing || progress < 1) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function wake() { if (!raf) raf = requestAnimationFrame(frame); }

  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) wake(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
  new ResizeObserver(measure).observe(hero);
  addEventListener('resize', measure);
  document.fonts?.ready.then(() => { measure(); showInspector(); });
  measure();

  // ---- the opening ----------------------------------------------------------
  const done = () => { body.classList.add('arrival-done', 'is-ready'); status.textContent = 'Portfolio ready'; };
  if (skip) { done(); showInspector(); }
  else {
    hero.classList.add('is-opening');
    openAt = performance.now();
    setTimeout(() => { waves?.retype('ALOBI'); wordBusyUntil = performance.now() + 1300; wake(); }, 260);
    setTimeout(done, 1050);
    setTimeout(() => hero.classList.remove('is-opening'), 1700);
    if (!visitorSeen) setTimeout(startVisitor, 2600);
    showInspector();
  }
  // Never leave navigation hidden if the browser suspends the opening frames.
  setTimeout(done, 2500);
}
