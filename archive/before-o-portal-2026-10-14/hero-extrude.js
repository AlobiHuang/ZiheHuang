// The home hero's word as a solid: ALOBI extruded out of the site plan.
//
// The letters are traced from the same mask the field is drawn from
// (ShapeWaves.js), so the solid always stands exactly on the letters of the
// map, whatever word is on show. On arrival the landscape comes first; the
// word then rises out of it as contours (a plateau lifting out of the
// ground) and keeps rising as solid letters pushing up out of the surface.
// The solid stays slightly tilted, following the pointer. Drawn in hairlines
// with hidden lines removed: paper-filled faces painted back to front, the
// sides hatched. (The earlier axonometric opening is kept in
// archive/hero-v3-axo/hero-extrude.js.)
export default function heroExtrude(host, waves, { reduced = false } = {}) {
  // Until the opening plays, the landscape shows without the word.
  if (!reduced) waves.layers?.({ rise: 0, cut: 0, letters: 0 });
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-extrude';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const ctx = canvas.getContext('2d');

  const INK = '#1d1d1f';
  const PAPER = '#f5f5f7'; // the site's paper, the same as the map under it
  const deg = Math.PI / 180;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
  const mix = (a, b, t) => a + (b - a) * t;

  let W = 0, H = 0, dpr = 1;
  let loops = [];          // [{ pts: [[x, y], ...] }] in css px, ink on the left of travel
  let box = null;          // word bounds in css px
  let letterH = 100;
  let hatch = null;

  // ---- tracing the mask ---------------------------------------------------
  function trace() {
    const info = waves.maskInfo?.();
    if (!info) { loops = []; box = null; return; }
    const { canvas: mask, context, scale } = info;
    const w = mask.width, h = mask.height;
    if (w < 2 || h < 2) return;
    const data = context.getImageData(0, 0, w, h).data;
    const T = 127.5; // never equal to a pixel value, so crossings never sit on a corner
    const at = (x, y) => data[(y * w + x) * 4];
    // Only scan the rows and columns that hold ink.
    let x0 = w, x1 = -1, y0 = h, y1 = -1;
    for (let y = 0; y < h; y += 1) {
      const row = y * w * 4;
      for (let x = 0; x < w; x += 1) {
        if (data[row + x * 4] > T) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
    }
    if (x1 < 0) { loops = []; box = null; return; }
    x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(w - 1, x1 + 2); y1 = Math.min(h - 1, y1 + 2);
    const sample = (x, y) => {
      const ix = Math.max(0, Math.min(w - 2, Math.floor(x))), iy = Math.max(0, Math.min(h - 2, Math.floor(y)));
      const fx = x - ix, fy = y - iy;
      return (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) + (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy;
    };
    // Marching squares: segments between cell-edge crossings, keyed by edge.
    const segs = new Map();
    const cross = (ax, ay, av, bx, by, bv) => { const t = (T - av) / ((bv - av) || 1); return [ax + (bx - ax) * t, ay + (by - ay) * t]; };
    // Every segment is oriented the same way round its ink: judged against a
    // corner of the cell whose side is known, so loops always link up.
    const add = (k1, p1, k2, p2, cx, cy, cornerInk) => {
      const cross = (p2[0] - p1[0]) * (cy - p1[1]) - (p2[1] - p1[1]) * (cx - p1[0]);
      if ((cross > 0) === cornerInk) segs.set(k1, { p: p1, next: k2 });
      else segs.set(k2, { p: p2, next: k1 });
    };
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const a = at(x, y), b = at(x + 1, y), c = at(x + 1, y + 1), d = at(x, y + 1);
        const idx = (a > T ? 8 : 0) | (b > T ? 4 : 0) | (c > T ? 2 : 0) | (d > T ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const top = () => ['h' + (y * w + x), cross(x, y, a, x + 1, y, b)];
        const bottom = () => ['h' + ((y + 1) * w + x), cross(x, y + 1, d, x + 1, y + 1, c)];
        const left = () => ['v' + (y * w + x), cross(x, y, a, x, y + 1, d)];
        const right = () => ['v' + (y * w + x + 1), cross(x + 1, y, b, x + 1, y + 1, c)];
        // Reference corners: tl (x,y), tr (x+1,y), br (x+1,y+1), bl (x,y+1).
        const A = a > T, B = b > T, C = c > T, D = d > T;
        const pair = (e1, e2, cx, cy, ink) => { const [k1, p1] = e1(), [k2, p2] = e2(); add(k1, p1, k2, p2, cx, cy, ink); };
        switch (idx) {
          case 1: case 14: pair(left, bottom, x, y + 1, D); break;
          case 2: case 13: pair(bottom, right, x + 1, y + 1, C); break;
          case 3: case 12: pair(left, right, x, y, A); break;
          case 4: case 11: pair(top, right, x + 1, y, B); break;
          case 6: case 9: pair(top, bottom, x, y, A); break;
          case 7: case 8: pair(left, top, x, y, A); break;
          case 5: case 10: {
            const centre = (a + b + c + d) / 4 > T;
            if ((idx === 5) === centre) { pair(left, top, x, y, A); pair(bottom, right, x + 1, y + 1, C); }
            else { pair(left, bottom, x, y + 1, D); pair(top, right, x + 1, y, B); }
            break;
          }
        }
      }
    }
    // Link segments into closed loops, then thin them to their corners.
    const used = new Set();
    const out = [];
    for (const [startKey] of segs) {
      if (used.has(startKey)) continue;
      const pts = [];
      let key = startKey, guard = 0;
      while (key && !used.has(key) && guard++ < 200000) {
        const seg = segs.get(key);
        if (!seg) break;
        used.add(key);
        pts.push(seg.p);
        key = seg.next;
      }
      if (pts.length < 6) continue;
      const simple = simplify(pts, .55);
      if (simple.length < 3) continue;
      out.push({ pts: simple.map(([x, y]) => [(x + .5) * scale, (y + .5) * scale]) });
    }
    // Which letter each outline belongs to, so each can rise on its own.
    const boxes = waves.letterBoxes?.() || [];
    for (const loop of out) {
      const [px, py] = loop.pts[0];
      let best = -1, bestD = Infinity;
      boxes.forEach(b => {
        const dx = Math.max(b.x - px, 0, px - (b.x + b.w)), dy = Math.max(b.y - py, 0, py - (b.y + b.h));
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = b.index; }
      });
      loop.letter = bestD < 64 ? best : -1; // -1: the typing caret, always up
    }
    loops = out;
    box = { x0: (x0 + 2) * scale, y0: (y0 + 2) * scale, x1: (x1 - 1) * scale, y1: (y1 - 1) * scale };
    letterH = Math.max(20, box.y1 - box.y0);
  }
  // Douglas-Peucker on a closed loop.
  function simplify(points, tolerance) {
    const n = points.length;
    let far = 0, best = -1;
    for (let i = 1; i < n; i += 1) { const d = Math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]); if (d > best) { best = d; far = i; } }
    const run = (a, b) => {
      const keep = [];
      const stack = [[a, b]];
      const marks = new Uint8Array(n);
      marks[a] = marks[b % n] = 1;
      while (stack.length) {
        const [i, j] = stack.pop();
        const [ax, ay] = points[i], [bx, by] = points[j % n];
        const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
        let worst = -1, index = -1;
        for (let k = i + 1; k < j; k += 1) {
          const [px, py] = points[k % n];
          const d = Math.abs((px - ax) * dy - (py - ay) * dx) / len;
          if (d > worst) { worst = d; index = k; }
        }
        if (worst > tolerance) { marks[index % n] = 1; stack.push([i, index], [index, j]); }
      }
      for (let k = a; k < b; k += 1) if (marks[k % n]) keep.push(points[k % n]);
      return keep;
    };
    return [...run(0, far), ...run(far, n)];
  }

  // ---- the pose ---------------------------------------------------------------
  // rz turns the plan, rx tips it back, ry swings it sideways; depth is the
  // height of the letters. Orthographic, as an axonometric drawing is.
  const REST = { rz: 0, rx: 8 * deg, ry: -5 * deg };
  let tilt = { x: 0, y: 0 }, tiltTarget = { x: 0, y: 0 };
  let introAt = reduced ? -Infinity : null; // null: waiting to play
  let raf = 0;

  // An oblique projection: the base of every letter stays exactly on its
  // footprint in the map, and only the height leans, towards (sin ry, -sin rx)
  // per unit of height. (Turning the whole solid would slide its base off the
  // footprint and leave a blank letter-shaped gap in the contours.)
  const lean = P => [Math.sin(P.ry), -Math.sin(P.rx)];
  const project = (x, y, z, P) => {
    const [ox, oy] = lean(P);
    // Depth for painting order: the viewer looks from the side the tops lean
    // away from, and from above.
    return [x + z * ox, y + z * oy, -(x * ox + y * oy) + z];
  };
  const facing = (nx, ny, nz, P) => {
    const [ox, oy] = lean(P);
    return -(nx * ox + ny * oy) + nz;
  };

  function makeHatch() {
    const size = Math.round(6 * dpr);
    const tile = document.createElement('canvas');
    tile.width = tile.height = size;
    const t = tile.getContext('2d');
    t.strokeStyle = INK; t.lineWidth = Math.max(1, .7 * dpr); t.globalAlpha = .55;
    t.beginPath();
    for (let o = -size; o <= size; o += size) { t.moveTo(o, size); t.lineTo(o + size, 0); }
    t.stroke();
    hatch = ctx.createPattern(tile, 'repeat');
    hatch?.setTransform?.(new DOMMatrix().scale(1 / dpr));
  }

  function draw(now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!box || !loops.length || introAt === null) { if (introAt === null) waves.layers?.({ rise: 0, cut: 0, letters: 0 }); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // The opening, in three clear steps (ms since it started):
    //  1. each letter's footprint is drawn onto the landscape, one after the
    //     other, as a single line tracing its outline;
    //  2. the letters lift off the ground as solids, their sides growing,
    //     while the contours gather round them as the ground rises too;
    //  3. they settle, slightly tilted, following the pointer.
    // A letter typed later (hovering ARCH / PD / PM) goes through the same
    // two steps, quicker.
    // The whole opening plays 1.2x faster than the timings written below.
    const SPEED = 1.2;
    const e = (now - introAt) * SPEED;
    const STAGGER = 160;
    const easeOut = t => 1 - (1 - clamp(t)) ** 3;
    const phase = loop => {
      const i = Math.max(0, loop.letter);
      const r = loop.letter >= 0 ? (waves.letterRise?.(loop.letter) ?? 1) : 1;
      const trace = Math.min(ease((e - 150 - i * STAGGER) / 1100), clamp(r / .35));
      const lift = Math.min(easeOut((e - 1250 - i * STAGGER) / 1900), easeOut((r - .28) / .72));
      return { trace, lift };
    };
    const count = Math.max(1, new Set(loops.map(l => l.letter)).size);
    const groundRise = ease((e - 1100) / (2200 + count * STAGGER));
    const lastLift = easeOut((e - 1250 - (count - 1) * STAGGER) / 1900);
    waves.layers?.({ ground: 1, letters: 0, rise: groundRise, cut: clamp(lastLift * 1.4) });

    const P = { rz: REST.rz, rx: REST.rx + tilt.y, ry: REST.ry + tilt.x };
    const fullDepth = letterH * .17;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = INK;

    for (const loop of loops) Object.assign(loop, phase(loop));

    // Step 1: footprints being drawn (letters that have not lifted yet).
    for (const loop of loops) {
      if (loop.lift > .002 || loop.trace <= 0) continue;
      const pts = loop.pts.map(([x, y]) => project(x, y, 0, P));
      let per = 0;
      for (let i = 0; i < pts.length; i += 1) { const a = pts[i], b = pts[(i + 1) % pts.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]); }
      ctx.setLineDash([per * loop.trace, per]);
      ctx.lineWidth = 1.15;
      ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Step 2: solids. Visible sides back to front, then the tops.
    const faces = [];
    for (const loop of loops) {
      if (loop.lift <= .002) { loop.top = null; continue; }
      const pts = loop.pts, n = pts.length;
      const h = fullDepth * loop.lift;
      const base = pts.map(([x, y]) => project(x, y, 0, P));
      const top = pts.map(([x, y]) => project(x, y, h, P));
      const vis = new Array(n);
      for (let i = 0; i < n; i += 1) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n];
        const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
        // Ink on the left of travel: the outward normal is on the right.
        vis[i] = facing(dy / len, -dx / len, 0, P) > 1e-4;
      }
      const turnAt = k => {
        const p0 = pts[(k - 1 + n) % n], p1 = pts[k], p2 = pts[(k + 1) % n];
        const a1 = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), a2 = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        let dA = Math.abs(a2 - a1); if (dA > Math.PI) dA = 2 * Math.PI - dA;
        return dA > 28 * deg;
      };
      for (let i = 0; i < n; i += 1) {
        if (!vis[i]) continue;
        const j = (i + 1) % n, prev = (i - 1 + n) % n;
        // Where two faces meet at a corner, or a face turns away (silhouette),
        // draw the vertical edge.
        faces.push({
          quad: [base[i], base[j], top[j], top[i]],
          depth: (base[i][2] + base[j][2] + top[i][2] + top[j][2]) / 4,
          edgeA: !vis[prev] || turnAt(i),
          edgeB: !vis[j] || turnAt(j)
        });
      }
      loop.top = top;
    }
    faces.sort((a, b) => a.depth - b.depth);
    for (const f of faces) {
      const [b0, b1, t1, t0] = f.quad;
      ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(b1[0], b1[1]); ctx.lineTo(t1[0], t1[1]); ctx.lineTo(t0[0], t0[1]); ctx.closePath();
      ctx.fillStyle = PAPER; ctx.fill();
      if (hatch) { ctx.fillStyle = hatch; ctx.fill(); }
      ctx.lineWidth = .9; ctx.beginPath();
      ctx.moveTo(b0[0], b0[1]); ctx.lineTo(b1[0], b1[1]);
      if (f.edgeA) { ctx.moveTo(b0[0], b0[1]); ctx.lineTo(t0[0], t0[1]); }
      if (f.edgeB) { ctx.moveTo(b1[0], b1[1]); ctx.lineTo(t1[0], t1[1]); }
      ctx.stroke();
    }
    // Tops, a letter at a time, each at its own height.
    const groups = new Map();
    for (const loop of loops) { if (!loop.top) continue; if (!groups.has(loop.letter)) groups.set(loop.letter, []); groups.get(loop.letter).push(loop); }
    for (const group of groups.values()) {
      ctx.beginPath();
      for (const loop of group) { loop.top.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
      // The top clears of the map as it lifts off it.
      ctx.globalAlpha = clamp(group[0].lift * 5);
      ctx.fillStyle = PAPER; ctx.fill('evenodd');
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.15; ctx.stroke();
    }

    return e < 1250 + count * STAGGER + 2100;
  }

  // ---- running ----------------------------------------------------------------
  const frame = now => {
    raf = 0;
    tilt.x += (tiltTarget.x - tilt.x) * .08;
    tilt.y += (tiltTarget.y - tilt.y) * .08;
    const moving = draw(now) || !!waves.growing?.();
    const settling = Math.abs(tiltTarget.x - tilt.x) + Math.abs(tiltTarget.y - tilt.y) > .0004;
    if (moving || settling) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  function resize() {
    const rect = host.getBoundingClientRect();
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    makeHatch();
    trace();
    wake();
  }
  new ResizeObserver(resize).observe(host);
  waves.onMask?.(() => { trace(); wake(); });

  // The pointer tips the solid a little, as if walking round a model.
  if (!reduced) {
    addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const x = event.clientX / innerWidth - .5, y = event.clientY / innerHeight - .5;
      // The side of the letters facing the pointer comes into view, as if
      // you were standing where the pointer is.
      tiltTarget = { x: clamp(x, -.5, .5) * -42 * deg, y: clamp(y, -.5, .5) * 32 * deg };
      wake();
    }, { passive: true });
  }

  resize();
  return {
    // Start the opening: axonometric view, then down into plan.
    play() { if (reduced) { introAt = -Infinity; wake(); return; } introAt = performance.now(); wake(); },
    // Skip straight to the resting view.
    settle() { introAt = -Infinity; wake(); },
    redraw: wake
  };
}
