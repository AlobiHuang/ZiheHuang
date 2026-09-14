import { Renderer } from './vendor/ogl/core/Renderer.js';
import { Program } from './vendor/ogl/core/Program.js';
import { Mesh } from './vendor/ogl/core/Mesh.js';
import { Transform } from './vendor/ogl/core/Transform.js';
import { Camera } from './vendor/ogl/core/Camera.js';
import { Vec3 } from './vendor/ogl/math/Vec3.js';
import { Triangle } from './vendor/ogl/extras/Triangle.js';

function parseHexColor(hex) {
  const c = hex.replace('#', '');
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255
  ];
}

function fract(x) {
  return x - Math.floor(x);
}

function hash31(p) {
  const r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const rYzx = [r[1], r[2], r[0]];
  const dotVal = r[0] * (rYzx[0] + 33.33) + r[1] * (rYzx[1] + 33.33) + r[2] * (rYzx[2] + 33.33);
  for (let i = 0; i < 3; i += 1) r[i] = fract(r[i] + dotVal);
  return r;
}

function hash33(v) {
  const p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const pYxz = [p[1], p[0], p[2]];
  const dotVal = p[0] * (pYxz[0] + 33.33) + p[1] * (pYxz[1] + 33.33) + p[2] * (pYxz[2] + 33.33);
  for (let i = 0; i < 3; i += 1) p[i] = fract(p[i] + dotVal);
  const pXxy = [p[0], p[0], p[1]];
  const pYxx = [p[1], p[0], p[0]];
  const pZyx = [p[2], p[1], p[0]];
  return p.map((_, i) => fract((pXxy[i] + pYxx[i]) * pZyx[i]));
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform vec3 iColors[50];
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;

float getMetaBallValue(vec2 c, float r, vec2 p) {
  vec2 d = p - c;
  float dist2 = dot(d, d);
  return (r * r) / dist2;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float scale = iAnimationSize / iResolution.y;
  vec2 coord = (fc - iResolution.xy * 0.5) * scale;
  vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
  float m1 = 0.0;
  vec3 colorSum = vec3(0.0);
  for (int i = 0; i < 50; i++) {
    if (i >= iBallCount) break;
    float value = getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
    m1 += value;
    colorSum += iColors[i] * value;
  }
  float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);
  float total = m1 + m2;
  float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
  vec3 cFinal = vec3(0.0);
  if (total > 0.0) {
    cFinal = (colorSum + iCursorColor * m2) / total;
  }
  outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`;

export default function MetaBalls(container, {
  color = '#ffffff',
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 15,
  clumpFactor = 1,
  cursorBallSize = 3,
  cursorBallColor = '#ffffff',
  enableTransparency = false,
  colors = [],
  labeledBallCount = 0,
  onUpdate = null
} = {}) {
  if (!container) return () => {};

  const dpr = 1;
  const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1);
  container.replaceChildren(gl.canvas);

  const camera = new Camera(gl, { left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 });
  camera.position.z = 1;
  const geometry = new Triangle(gl);
  const [r1, g1, b1] = parseHexColor(color);
  const [r2, g2, b2] = parseHexColor(cursorBallColor);
  const metaBallsUniform = Array.from({ length: 50 }, () => new Vec3(0, 0, 0));
  const ballColorUniform = Array.from({ length: 50 }, (_, index) => {
    const chosen = colors.length ? colors[index % colors.length] : color;
    const [r, g, b] = parseHexColor(chosen);
    return new Vec3(r, g, b);
  });
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Vec3(0, 0, 0) },
      iMouse: { value: new Vec3(0, 0, 0) },
      iColor: { value: new Vec3(r1, g1, b1) },
      iCursorColor: { value: new Vec3(r2, g2, b2) },
      iColors: { value: ballColorUniform },
      iAnimationSize: { value: animationSize },
      iBallCount: { value: ballCount },
      iCursorBallSize: { value: cursorBallSize },
      iMetaBalls: { value: metaBallsUniform },
      iClumpFactor: { value: clumpFactor },
      enableTransparency: { value: enableTransparency }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });
  const scene = new Transform();
  mesh.setParent(scene);
  const effectiveBallCount = Math.min(ballCount, 50);
  const primaryBallCount = Math.min(labeledBallCount, effectiveBallCount);
  const secondaryBallCount = Math.max(0, effectiveBallCount - primaryBallCount);
  const revealHost = container.closest('[data-why-interface]');
  const ballParams = [];
  for (let i = 0; i < effectiveBallCount; i += 1) {
    const h1 = hash31(i + 1);
    const h2 = hash33(h1);
    const isLabeled = i < labeledBallCount;
    ballParams.push({
      st: isLabeled ? -Math.PI * 0.5 + i * (Math.PI * 2 / Math.max(1, labeledBallCount)) : h1[0] * (2 * Math.PI),
      dtFactor: isLabeled ? 0.52 : 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI),
      baseScale: isLabeled ? [5.55, 7.35, 6.15, 8.05, 6.75][i % 5] : 3.2 + h1[1] * 6.2,
      toggle: Math.floor(h2[0] * 2),
      labeled: isLabeled,
      radius: isLabeled ? 1.25 + h2[2] * 0.5 : 0.35 + h2[2] * 0.9,
      parentIndex: isLabeled || !primaryBallCount ? -1 : (i - primaryBallCount) % primaryBallCount,
      revealDelay: isLabeled || secondaryBallCount <= 1 ? 0 : ((i - primaryBallCount) / (secondaryBallCount - 1)) * 0.58
    });
  }

  const mouseBallPos = { x: 0, y: 0 };
  let pointerInside = false;
  let pointerX = 0;
  let pointerY = 0;
  let animationFrameId = 0;
  let secondaryRevealStartedAt = null;
  const interactionTarget = container.parentElement || container;
  const smoothstep = value => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width * dpr, height * dpr);
    gl.canvas.style.width = `${width}px`;
    gl.canvas.style.height = `${height}px`;
    program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
  };
  const onPointerMove = event => {
    if (!enableMouseInteraction) return;
    const rect = container.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width) * gl.canvas.width;
    pointerY = (1 - (event.clientY - rect.top) / rect.height) * gl.canvas.height;
  };
  const onPointerEnter = () => { if (enableMouseInteraction) pointerInside = true; };
  const onPointerLeave = () => { if (enableMouseInteraction) pointerInside = false; };

  window.addEventListener('resize', resize);
  interactionTarget.addEventListener('pointermove', onPointerMove);
  interactionTarget.addEventListener('pointerenter', onPointerEnter);
  interactionTarget.addEventListener('pointerleave', onPointerLeave);
  resize();

  const startTime = performance.now();
  const update = time => {
    animationFrameId = requestAnimationFrame(update);
    const elapsed = (time - startTime) * 0.001;
    program.uniforms.iTime.value = elapsed;
    const shouldRevealSecondary = !revealHost || revealHost.classList.contains('is-forming') || revealHost.classList.contains('is-launched');
    if (shouldRevealSecondary && secondaryRevealStartedAt === null) secondaryRevealStartedAt = elapsed;
    const secondaryRevealElapsed = secondaryRevealStartedAt === null ? -1 : elapsed - secondaryRevealStartedAt;
    for (let i = 0; i < effectiveBallCount; i += 1) {
      const p = ballParams[i];
      const dt = elapsed * speed * p.dtFactor;
      const th = p.st + dt;
      const radialBreath = p.labeled ? 1 + Math.sin(elapsed * 0.42 + i * 1.17) * 0.025 : 1;
      const targetX = Math.cos(th) * p.baseScale * clumpFactor * radialBreath;
      const targetY = Math.sin(p.labeled ? th : th + dt * p.toggle) * p.baseScale * clumpFactor * radialBreath;
      if (p.labeled || p.parentIndex < 0) {
        metaBallsUniform[i].set(targetX, targetY, p.radius);
        continue;
      }
      const reveal = smoothstep((secondaryRevealElapsed - p.revealDelay) / 0.92);
      const parent = metaBallsUniform[p.parentIndex];
      metaBallsUniform[i].set(
        parent.x + (targetX - parent.x) * reveal,
        parent.y + (targetY - parent.y) * reveal,
        p.radius * reveal
      );
    }
    if (typeof onUpdate === 'function') {
      const scale = animationSize / Math.max(1, gl.canvas.height);
      onUpdate(metaBallsUniform.slice(0, Math.min(labeledBallCount, effectiveBallCount)).map(ball => ({
        x: ball.x / scale + gl.canvas.width * 0.5,
        y: gl.canvas.height * 0.5 - ball.y / scale,
        radius: ball.z / scale
      })));
    }
    const targetX = pointerInside ? pointerX : gl.canvas.width * 0.5 + Math.cos(elapsed * speed) * gl.canvas.width * 0.15;
    const targetY = pointerInside ? pointerY : gl.canvas.height * 0.5 + Math.sin(elapsed * speed) * gl.canvas.height * 0.15;
    mouseBallPos.x += (targetX - mouseBallPos.x) * hoverSmoothness;
    mouseBallPos.y += (targetY - mouseBallPos.y) * hoverSmoothness;
    program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);
    renderer.render({ scene, camera });
  };
  animationFrameId = requestAnimationFrame(update);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
    interactionTarget.removeEventListener('pointermove', onPointerMove);
    interactionTarget.removeEventListener('pointerenter', onPointerEnter);
    interactionTarget.removeEventListener('pointerleave', onPointerLeave);
    if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
