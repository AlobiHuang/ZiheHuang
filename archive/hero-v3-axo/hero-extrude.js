// The home hero's word as a solid: ALOBI extruded out of the site plan.
//
// The letters are traced from the same mask the field is drawn from
// (ShapeWaves.js), so the solid always stands exactly on the letters of the
// plan, whatever word is on show. On arrival the drawing opens as an
// axonometric view on a drafting grid, then turns down into plan; after that
// the solid stays slightly tilted, following the pointer, so the letters read
// as volumes standing on the contour map. Drawn in hairlines with hidden
// lines removed: paper-filled faces painted back to front, the sides hatched.
export default function heroExtrude(host, waves, { reduced = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-extrude';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const ctx = canvas.getContext('2d');

  const INK = '#1d1d1f';
  const PAPER = '#ffffff';
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
  const REST = { rz: 0, rx: 13 * deg, ry: -9 * deg };
  const AXO = { rz: -24 * deg, rx: 56 * deg, ry: -6 * deg };
  let pose = { ...(reduced ? REST : AXO) };
  let tilt = { x: 0, y: 0 }, tiltTarget = { x: 0, y: 0 };
  let introAt = reduced ? -Infinity : null; // null: waiting to play
  let raf = 0;

  const project = (x, y, z, P) => {
    const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
    const X = x - cx, Y = y - cy;
    const cz = Math.cos(P.rz), sz = Math.sin(P.rz), cyw = Math.cos(P.ry), syw = Math.sin(P.ry), cxw = Math.cos(P.rx), sxw = Math.sin(P.rx);
    const x1 = X * cz - Y * sz, y1 = X * sz + Y * cz;
    const x2 = x1 * cyw + z * syw, z2 = -x1 * syw + z * cyw;
    const y3 = y1 * cxw - z2 * sxw, d = y1 * sxw + z2 * cxw;
    return [cx + x2, cy + y3, d];
  };
  const facing = (nx, ny, nz, P) => {
    const cz = Math.cos(P.rz), sz = Math.sin(P.rz);
    const x1 = nx * cz - ny * sz, y1 = nx * sz + ny * cz;
    const z2 = -x1 * Math.sin(P.ry) + nz * Math.cos(P.ry);
    return y1 * Math.sin(P.rx) + z2 * Math.cos(P.rx);
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
    if (!box || !loops.length || introAt === null) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Timeline of the opening (ms since it started).
    const e = introAt === null ? 0 : now - introAt;
    const turn = introAt === null ? 0 : ease((e - 650) / 2100);
    const gridIn = introAt === null ? 0 : clamp(e / 500);
    const gridOut = 1 - clamp((e - 2100) / 700);
    const ground = introAt === null ? 0 : ease((e - 1700) / 900);
    const boxAlpha = gridIn * (1 - clamp((e - 2300) / 500));
    waves.layers?.({ ground, letters: 0 });

    const P = {
      rz: mix(AXO.rz, REST.rz, turn),
      rx: mix(AXO.rx, REST.rx + tilt.y, turn),
      ry: mix(AXO.ry, REST.ry + tilt.x, turn)
    };
    const depth = letterH * mix(.26, .15, turn);

    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // The drafting grid on the ground plane, and the word's bounding box.
    const gridA = gridIn * gridOut;
    if (gridA > .01) {
      const step = Math.max(28, letterH * .22), span = Math.max(W, H) * 1.4;
      const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
      ctx.beginPath();
      for (let g = -span; g <= span; g += step) {
        let a = project(cx + g, cy - span, 0, P), b = project(cx + g, cy + span, 0, P);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
        a = project(cx - span, cy + g, 0, P); b = project(cx + span, cy + g, 0, P);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      }
      ctx.strokeStyle = `rgba(29,29,31,${(.13 * gridA).toFixed(3)})`; ctx.lineWidth = .6; ctx.stroke();
    }
    if (boxAlpha > .01) {
      const pad = letterH * .08;
      const c = [[box.x0 - pad, box.y0 - pad], [box.x1 + pad, box.y0 - pad], [box.x1 + pad, box.y1 + pad], [box.x0 - pad, box.y1 + pad]].map(([x, y]) => project(x, y, 0, P));
      ctx.globalAlpha = boxAlpha * .55;
      ctx.beginPath(); c.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.strokeStyle = INK; ctx.lineWidth = .6; ctx.stroke();
      // Corner brackets and height ticks, as on a model drawing.
      ctx.globalAlpha = boxAlpha;
      ctx.lineWidth = 1.2; ctx.beginPath();
      c.forEach((p, i) => {
        const prev = c[(i + 3) % 4], next = c[(i + 1) % 4];
        const l = Math.min(14, Math.hypot(next[0] - p[0], next[1] - p[1]) * .2);
        const to = (q, len) => { const dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy) || 1; return [p[0] + dx / n * len, p[1] + dy / n * len]; };
        const a = to(prev, l), b = to(next, l);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(b[0], b[1]);
      });
      ctx.stroke();
      ctx.lineWidth = .7; ctx.beginPath();
      [[box.x0 - pad, box.y0 - pad], [box.x1 + pad, box.y1 + pad]].forEach(([x, y]) => {
        const a = project(x, y, 0, P), b = project(x, y, depth, P);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Faces: visible sides back to front, then the tops.
    const faces = [];
    for (const loop of loops) {
      const pts = loop.pts, n = pts.length;
      const base = pts.map(([x, y]) => project(x, y, 0, P));
      const top = pts.map(([x, y]) => project(x, y, depth, P));
      const vis = new Array(n);
      for (let i = 0; i < n; i += 1) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n];
        const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
        // Ink on the left of travel: the outward normal is on the right.
        vis[i] = facing(dy / len, -dx / len, 0, P) > 1e-4;
      }
      for (let i = 0; i < n; i += 1) {
        if (!vis[i]) continue;
        const j = (i + 1) % n;
        const prev = (i - 1 + n) % n;
        // Where two faces meet at a corner, or a face turns away (silhouette),
        // draw the vertical edge.
        const turnAt = k => {
          const p0 = pts[(k - 1 + n) % n], p1 = pts[k], p2 = pts[(k + 1) % n];
          const a1 = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), a2 = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
          let dA = Math.abs(a2 - a1); if (dA > Math.PI) dA = 2 * Math.PI - dA;
          return dA > 28 * deg;
        };
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
    ctx.strokeStyle = INK;
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
    ctx.beginPath();
    for (const loop of loops) loop.top.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), ctx.closePath();
    ctx.fillStyle = PAPER; ctx.fill('evenodd');
    ctx.lineWidth = 1.15; ctx.strokeStyle = INK; ctx.stroke();

    return introAt !== null && e < 3000;
  }

  // ---- running ----------------------------------------------------------------
  const frame = now => {
    raf = 0;
    tilt.x += (tiltTarget.x - tilt.x) * .08;
    tilt.y += (tiltTarget.y - tilt.y) * .08;
    const moving = draw(now);
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
      tiltTarget = { x: clamp(x, -.5, .5) * 22 * deg, y: clamp(y, -.5, .5) * -14 * deg };
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
