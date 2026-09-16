class Grad {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dot2(x, y) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
      new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
      new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
    ];
    this.p = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
      247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,
      175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
      102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,
      198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,
      28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,
      79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
      14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,
      29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i += 1) {
      const value = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = value;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[value % 12];
    }
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  perlin2(x, y) {
    let cellX = Math.floor(x);
    let cellY = Math.floor(y);
    x -= cellX;
    y -= cellY;
    cellX &= 255;
    cellY &= 255;
    const n00 = this.gradP[cellX + this.perm[cellY]].dot2(x, y);
    const n01 = this.gradP[cellX + this.perm[cellY + 1]].dot2(x, y - 1);
    const n10 = this.gradP[cellX + 1 + this.perm[cellY]].dot2(x - 1, y);
    const n11 = this.gradP[cellX + 1 + this.perm[cellY + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

export default function Waves({
  container,
  canvas,
  radial = false,
  radialCenters = null,
  lineColor = 'black',
  backgroundColor = 'transparent',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  pixelRatioCap = 2,
  targetFPS = 60
} = {}) {
  if (!container || !canvas) return () => {};
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  const noise = new Noise(Math.random());
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bounds = { width: 0, height: 0, left: 0, top: 0 };
  const mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false };
  let lines = [];
  let centers = [];
  let frame = 0;
  let lastRender = -Infinity;
  let visible = true;
  let destroyed = false;

  container.style.backgroundColor = backgroundColor;

  const setLines = () => {
    lines = [];
    if (radial) {
      const diagonal = Math.hypot(bounds.width, bounds.height);
      const shortest = Math.min(bounds.width, bounds.height);
      const sourceCenters = radialCenters?.length ? radialCenters : [{ x: .5, y: .5, radius: diagonal / 2 + 100, gravity: 1 }];
      centers = sourceCenters.map((source, index) => ({
        x: Math.abs(source.x) <= 1 ? source.x * bounds.width : source.x,
        y: Math.abs(source.y) <= 1 ? source.y * bounds.height : source.y,
        radius: source.radius == null ? diagonal / 2 + 100 : source.radius <= 1 ? source.radius * shortest : source.radius,
        gravity: source.gravity ?? 1,
        phase: source.phase ?? index * 1.73
      }));
      centers.forEach((center, family) => {
        const gap = xGap / (.72 + center.gravity * .38);
        for (let r = gap; r <= center.radius; r += gap) {
          const count = Math.max(28, Math.ceil(2 * Math.PI * r / 18));
          lines.push(Array.from({ length: count }, (_, i) => {
            const angle = i / count * Math.PI * 2;
            return { x: center.x + Math.cos(angle) * r,
              y: center.y + Math.sin(angle) * r,
              radius: r, family, center,
              wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } };
          }));
        }
      });
      return;
    }
    const outerWidth = bounds.width + 200;
    const outerHeight = bounds.height + 30;
    const totalLines = Math.ceil(outerWidth / xGap);
    const totalPoints = Math.ceil(outerHeight / yGap);
    const xStart = (bounds.width - xGap * totalLines) / 2;
    const yStart = (bounds.height - yGap * totalPoints) / 2;
    for (let i = 0; i <= totalLines; i += 1) {
      const points = [];
      for (let j = 0; j <= totalPoints; j += 1) {
        points.push({
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 }
        });
      }
      lines.push(points);
    }
  };

  const setSize = () => {
    const rect = container.getBoundingClientRect();
    bounds.width = Math.max(1, rect.width);
    bounds.height = Math.max(1, rect.height);
    bounds.left = rect.left;
    bounds.top = rect.top;
    const pixelRatio = Math.min(pixelRatioCap, devicePixelRatio || 1);
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.lineWidth = .72;
    setLines();
  };

  const moved = (point, withCursor = true) => ({
    x: Math.round((point.x + point.wave.x + (withCursor ? point.cursor.x : 0)) * 10) / 10,
    y: Math.round((point.y + point.wave.y + (withCursor ? point.cursor.y : 0)) * 10) / 10
  });

  const movePoints = time => {
    lines.forEach(points => points.forEach(point => {
      const move = noise.perlin2((point.x + time * waveSpeedX) * .002, (point.y + time * waveSpeedY) * .0015) * (radial ? 4 : 12);
      const amplitude = radial ? Math.min(1, point.radius / (72 / Math.max(.35, point.center.gravity))) : 1;
      const familyForce = radial ? .5 + point.center.gravity * .5 : 1;
      point.wave.x = Math.cos(move + (point.center?.phase || 0)) * waveAmpX * amplitude * familyForce;
      point.wave.y = Math.sin(move + (point.center?.phase || 0)) * waveAmpY * amplitude * familyForce;
      if (radial && centers.length > 1) {
        centers.forEach((center, index) => {
          if (index === point.family) return;
          const gx = center.x - point.x;
          const gy = center.y - point.y;
          const distance = Math.max(1, Math.hypot(gx, gy));
          const reach = Math.max(90, center.radius * 1.12);
          const falloff = Math.exp(-distance / reach) * (1 - Math.exp(-distance / 34));
          const pull = falloff * center.gravity * 15;
          point.wave.x += gx / distance * pull;
          point.wave.y += gy / distance * pull;
        });
      }
      const dx = point.x - mouse.sx;
      const dy = point.y - mouse.sy;
      const influence = Math.max(175, mouse.vs);
      const distanceSquared = dx * dx + dy * dy;
      if (mouse.set && distanceSquared < influence * influence) {
        const distance = Math.sqrt(distanceSquared);
        const strength = 1 - distance / influence;
        const force = Math.cos(distance * .001) * strength;
        point.cursor.vx += Math.cos(mouse.a) * force * influence * mouse.vs * .00065;
        point.cursor.vy += Math.sin(mouse.a) * force * influence * mouse.vs * .00065;
      }
      point.cursor.vx += -point.cursor.x * tension;
      point.cursor.vy += -point.cursor.y * tension;
      point.cursor.vx *= friction;
      point.cursor.vy *= friction;
      point.cursor.x = Math.max(-maxCursorMove, Math.min(maxCursorMove, point.cursor.x + point.cursor.vx * 2));
      point.cursor.y = Math.max(-maxCursorMove, Math.min(maxCursorMove, point.cursor.y + point.cursor.vy * 2));
    }));
  };

  const drawLines = () => {
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.beginPath();
    context.strokeStyle = lineColor;
    lines.forEach(points => {
      const first = moved(points[0], radial);
      context.moveTo(first.x, first.y);
      points.forEach((point, index) => {
        const last = index === points.length - 1;
        const current = moved(point, radial || !last);
        context.lineTo(current.x, current.y);
      });
      if (radial) context.closePath();
    });
    context.stroke();
  };

  const tick = time => {
    if (destroyed) return;
    if (!visible || document.hidden) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const frameInterval = 1000 / Math.max(1, targetFPS);
    const elapsedSinceRender = time - lastRender;
    if (!reduced && elapsedSinceRender < frameInterval) {
      frame = requestAnimationFrame(tick);
      return;
    }
    lastRender = reduced || !Number.isFinite(lastRender)
      ? time
      : time - (elapsedSinceRender % frameInterval);
    mouse.sx += (mouse.x - mouse.sx) * .1;
    mouse.sy += (mouse.y - mouse.sy) * .1;
    const dx = mouse.x - mouse.lx;
    const dy = mouse.y - mouse.ly;
    const distance = Math.hypot(dx, dy);
    mouse.v = distance;
    mouse.vs += (distance - mouse.vs) * .1;
    mouse.vs = Math.min(100, mouse.vs);
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.a = Math.atan2(dy, dx);
    movePoints(time);
    drawLines();
    frame = reduced ? 0 : requestAnimationFrame(tick);
  };

  const updateMouse = event => {
    mouse.x = event.clientX - bounds.left;
    mouse.y = event.clientY - bounds.top;
    if (!mouse.set) {
      mouse.sx = mouse.lx = mouse.x;
      mouse.sy = mouse.ly = mouse.y;
      mouse.set = true;
    }
  };

  const resizeObserver = new ResizeObserver(setSize);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
  }, { rootMargin: '160px' });
  resizeObserver.observe(container);
  visibilityObserver.observe(container);
  window.addEventListener('pointermove', updateMouse, { passive: true });
  setSize();
  tick(0);

  return () => {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    window.removeEventListener('pointermove', updateMouse);
  };
}
