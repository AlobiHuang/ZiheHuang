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
  for (int i = 0; i < 50; i++) {
    if (i >= iBallCount) break;
    m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
  }
  float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);
  float total = m1 + m2;
  float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
  vec3 cFinal = vec3(0.0);
  if (total > 0.0) {
    float alpha1 = m1 / total;
    float alpha2 = m2 / total;
    cFinal = iColor * alpha1 + iCursorColor * alpha2;
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
  enableTransparency = false
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
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Vec3(0, 0, 0) },
      iMouse: { value: new Vec3(0, 0, 0) },
      iColor: { value: new Vec3(r1, g1, b1) },
      iCursorColor: { value: new Vec3(r2, g2, b2) },
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
  const ballParams = [];
  for (let i = 0; i < effectiveBallCount; i += 1) {
    const h1 = hash31(i + 1);
    const h2 = hash33(h1);
    ballParams.push({
      st: h1[0] * (2 * Math.PI),
      dtFactor: 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI),
      baseScale: 5 + h1[1] * 5,
      toggle: Math.floor(h2[0] * 2),
      radius: 0.5 + h2[2] * 1.5
    });
  }

  const mouseBallPos = { x: 0, y: 0 };
  let pointerInside = false;
  let pointerX = 0;
  let pointerY = 0;
  let animationFrameId = 0;

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
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerenter', onPointerEnter);
  container.addEventListener('pointerleave', onPointerLeave);
  resize();

  const startTime = performance.now();
  const update = time => {
    animationFrameId = requestAnimationFrame(update);
    const elapsed = (time - startTime) * 0.001;
    program.uniforms.iTime.value = elapsed;
    for (let i = 0; i < effectiveBallCount; i += 1) {
      const p = ballParams[i];
      const dt = elapsed * speed * p.dtFactor;
      const th = p.st + dt;
      metaBallsUniform[i].set(
        Math.cos(th) * p.baseScale * clumpFactor,
        Math.sin(th + dt * p.toggle) * p.baseScale * clumpFactor,
        p.radius
      );
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
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerenter', onPointerEnter);
    container.removeEventListener('pointerleave', onPointerLeave);
    if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
