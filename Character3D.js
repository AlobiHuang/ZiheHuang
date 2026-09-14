import { Renderer } from './vendor/ogl/core/Renderer.js';
import { Camera } from './vendor/ogl/core/Camera.js';
import { Program } from './vendor/ogl/core/Program.js';
import { Mesh } from './vendor/ogl/core/Mesh.js';
import { Transform } from './vendor/ogl/core/Transform.js';
import { Texture } from './vendor/ogl/core/Texture.js';
import { Vec2 } from './vendor/ogl/math/Vec2.js';
import { Vec3 } from './vendor/ogl/math/Vec3.js';
import { Plane } from './vendor/ogl/extras/Plane.js';

const vertex=`
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform vec2 uLook;
  varying vec2 vUv;
  varying float vHead;
  varying float vDepth;

  float ellipseMask(vec2 point,vec2 center,vec2 radius,float feather){
    float distanceToCenter=length((point-center)/radius);
    return 1.0-smoothstep(1.0-feather,1.0,distanceToCenter);
  }

  void main(){
    vUv=uv;
    vec3 p=position;
    const float planeWidth=7.4666667;
    const float planeHeight=4.2;
    vec2 headCenterUv=vec2(.688,.696);
    vec2 headCenter=vec2((headCenterUv.x-.5)*planeWidth,(headCenterUv.y-.5)*planeHeight);
    float head=ellipseMask(uv,headCenterUv,vec2(.178,.27),.34);
    float face=ellipseMask(uv,vec2(.685,.66),vec2(.126,.215),.44);
    float shoulders=ellipseMask(uv,vec2(.687,.11),vec2(.39,.43),.5);
    float chest=ellipseMask(uv,vec2(.70,.0),vec2(.29,.42),.56);
    float depth=head*.34+face*.12+shoulders*.075+chest*.035;
    p.z+=depth;

    vec3 local=vec3(p.xy-headCenter,p.z);
    float yaw=uLook.x*.12;
    float pitch=-uLook.y*.07;
    float cy=cos(yaw),sy=sin(yaw),cx=cos(pitch),sx=sin(pitch);
    local=vec3(cy*local.x+sy*local.z,local.y,-sy*local.x+cy*local.z);
    local=vec3(local.x,cx*local.y-sx*local.z,sx*local.y+cx*local.z);
    vec3 turned=vec3(local.xy+headCenter,local.z);
    p=mix(p,turned,head*.96);
    p.x+=uLook.x*head*.028;
    p.y-=uLook.y*head*.014;

    vHead=head;
    vDepth=depth;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
  }
`;

const fragment=`
  precision highp float;
  uniform sampler2D uMap;
  uniform float uReady;
  uniform vec2 uLook;
  varying vec2 vUv;
  varying float vHead;
  varying float vDepth;

  float ellipse(vec2 point,vec2 center,vec2 radius){return length((point-center)/radius);}

  void main(){
    vec2 gaze=uLook*vec2(.0105,.0062);
    vec2 sampleUv=vUv;
    vec2 leftEye=vec2(.627,.650)+gaze;
    vec2 rightEye=vec2(.706,.649)+gaze;
    float leftMask=1.0-smoothstep(.2,1.0,ellipse(vUv,leftEye,vec2(.014,.011)));
    float rightMask=1.0-smoothstep(.2,1.0,ellipse(vUv,rightEye,vec2(.014,.011)));
    sampleUv-=gaze*max(leftMask,rightMask);
    vec3 color=texture2D(uMap,sampleUv).rgb;
    float dimensionalLight=(uLook.x*(vUv.x-.688)-uLook.y*(vUv.y-.646))*vHead*.075;
    color*=1.0+dimensionalLight+vDepth*.018;
    vec3 fallback=vec3(.055,.043,.038);
    gl_FragColor=vec4(mix(fallback,color,uReady),1.0);
  }
`;

export default function Character3D(container){
  if(!container)return null;
  const renderer=new Renderer({dpr:Math.min(devicePixelRatio||1,1.8),alpha:false,antialias:true,premultipliedAlpha:false});
  const gl=renderer.gl;
  gl.clearColor(.055,.043,.038,1);
  container.replaceChildren(gl.canvas);
  gl.canvas.setAttribute('aria-hidden','true');

  const camera=new Camera(gl,{fov:40,near:.1,far:50});
  camera.position.set(0,0,5.77);
  camera.lookAt(new Vec3(0,0,0));
  const scene=new Transform();
  const portraitTexture=new Texture(gl,{width:1,height:1,generateMipmaps:false,minFilter:gl.LINEAR,magFilter:gl.LINEAR,flipY:true});
  portraitTexture.image=new Uint8Array([14,11,10,255]);
  const look=new Vec2(0,0);
  const program=new Program(gl,{vertex,fragment,cullFace:false,uniforms:{uMap:{value:portraitTexture},uReady:{value:0},uLook:{value:look}}});
  const geometry=new Plane(gl,{width:7.4666667,height:4.2,widthSegments:128,heightSegments:80});
  const portraitMesh=new Mesh(gl,{geometry,program});portraitMesh.setParent(scene);

  const portrait=new Image();
  portrait.decoding='async';
  portrait.onload=()=>{portraitTexture.image=portrait;portraitTexture.needsUpdate=true;program.uniforms.uReady.value=1};
  portrait.src='assets/who-am-i-character-v1.png';

  let targetX=0,targetY=0,currentX=0,currentY=0,frame=0,last=performance.now();
  const resize=()=>{
    const width=Math.max(1,container.clientWidth),height=Math.max(1,container.clientHeight),aspect=width/height;
    renderer.setSize(width,height);camera.perspective({aspect});
    const cover=Math.max(1,aspect/(16/9));
    portraitMesh.scale.set(cover,cover,cover);
  };
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
  const setPointer=(clientX,clientY)=>{
    const rect=container.getBoundingClientRect();
    targetX=Math.max(-1,Math.min(1,(clientX-rect.left)/Math.max(1,rect.width)*2-1));
    targetY=Math.max(-1,Math.min(1,(clientY-rect.top)/Math.max(1,rect.height)*2-1));
  };
  const reset=()=>{targetX=0;targetY=0};
  const render=now=>{
    frame=requestAnimationFrame(render);
    if(!container.getClientRects().length)return;
    const dt=Math.min(.05,(now-last)/1000),follow=1-Math.pow(.002,dt);last=now;
    currentX+=(targetX-currentX)*follow;currentY+=(targetY-currentY)*follow;
    look.set(currentX,currentY);
    portraitMesh.position.y=Math.sin(now*.00115)*.006;
    renderer.render({scene,camera});
  };
  frame=requestAnimationFrame(render);
  return{setPointer,reset,destroy(){cancelAnimationFrame(frame);resizeObserver.disconnect();if(gl.canvas.parentNode===container)container.removeChild(gl.canvas)}};
}
