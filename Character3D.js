import { Renderer } from './vendor/ogl/core/Renderer.js';
import { Camera } from './vendor/ogl/core/Camera.js';
import { Geometry } from './vendor/ogl/core/Geometry.js';
import { Program } from './vendor/ogl/core/Program.js';
import { Mesh } from './vendor/ogl/core/Mesh.js';
import { Transform } from './vendor/ogl/core/Transform.js';
import { Texture } from './vendor/ogl/core/Texture.js';
import { Vec3 } from './vendor/ogl/math/Vec3.js';

const vertex=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 rig;
uniform mat4 modelViewMatrix,projectionMatrix;
uniform mat3 normalMatrix;
uniform vec2 uLook;
uniform vec2 uGaze;
varying vec2 vUv;
varying vec3 vNormal,vPosition;
mat3 turn(float yaw,float pitch){
 float c=cos(yaw),s=sin(yaw),a=cos(pitch),b=sin(pitch);
 return mat3(c,0.,-s,0.,1.,0.,s,0.,c)*mat3(1.,0.,0.,0.,a,b,0.,-b,a);
}
void main(){
 vec3 p=position,n=normal;
 // Eye and head membership is embedded in the duplicate GLB as normalized
 // vertex data. This keeps the pupils moving together while the glasses,
 // eyelids, and sockets remain part of the head.
 vec3 eyeA=vec3(-.011,.193,.2138),eyeB=vec3(.110,.169,.239);
 float eyeWeightA=rig.x;
 float eyeWeightB=rig.y;
 float eyeWeight=max(eyeWeightA,eyeWeightB);
 vec3 eyeCenter=(eyeWeightA>eyeWeightB?eyeA:eyeB)-vec3(0.,0.,.024);
 // Small rotations prevent the fused eye surface from stretching at its rim.
 // Account for head movement so the eyes continue aiming at the pointer.
 mat3 eyeRotation=turn(clamp(uGaze.x-uLook.x*.12,-.16,.16),clamp(uGaze.y-uLook.y*.06,-.10,.10));
 p=mix(p,eyeRotation*(p-eyeCenter)+eyeCenter,eyeWeight);
 n=normalize(mix(n,eyeRotation*n,eyeWeight));
 float weight=rig.z;
 mat3 rotation=turn(uLook.x*.25,uLook.y*.13);
 vec3 pivot=vec3(.035,-.105,.025);
 p=mix(p,rotation*(p-pivot)+pivot,weight);
 n=normalize(mix(n,rotation*n,weight));
 vec4 view=modelViewMatrix*vec4(p,1.);
 vUv=uv;vPosition=view.xyz;vNormal=normalize(normalMatrix*n);
 gl_Position=projectionMatrix*view;
}`;
const fragment=`
precision highp float;
uniform sampler2D uColor,uMaterial;
varying vec2 vUv;
varying vec3 vNormal,vPosition;
void main(){
 vec3 base=pow(texture2D(uColor,vUv).rgb,vec3(2.2));
 vec3 n=normalize(vNormal),v=normalize(-vPosition);
 vec3 key=normalize(vec3(-2.,3.,4.)),fill=normalize(vec3(3.,1.,3.)),rim=normalize(vec3(2.,2.,-3.));
 float roughness=clamp(texture2D(uMaterial,vUv).g,.35,1.);
 float diffuse=max(dot(n,key),0.);
 float highlight=pow(max(dot(n,normalize(key+v)),0.),mix(90.,12.,roughness))*.06;
 vec3 light=vec3(.42)+vec3(1.,.9,.8)*diffuse*.8+vec3(.68,.79,1.)*max(dot(n,fill),0.)*.24;
 vec3 color=base*light+vec3(1.,.57,.29)*max(dot(n,rim),0.)*.16*base+highlight;
 gl_FragColor=vec4(pow(color,vec3(1./2.2)),1.);
}`;

// Read the supplied GLB's indexed geometry and embedded PBR images without
// altering or reducing its two million triangles.
async function loadAsset(gl,signal){
 const response=await fetch(new URL('./assets/zihe-character-eye-rig-v2.glb',import.meta.url),{signal});
 if(!response.ok)throw new Error(`Character download failed (${response.status})`);
 const buffer=await response.arrayBuffer(),view=new DataView(buffer);
 if(view.getUint32(0,true)!==0x46546c67)throw new Error('Invalid character GLB');
 const jsonLength=view.getUint32(12,true);
 const data=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,jsonLength)));
 const binaryOffset=20+jsonLength+8;
 const read=index=>{
  const accessor=data.accessors[index],part=data.bufferViews[accessor.bufferView];
  const Type={5126:Float32Array,5125:Uint32Array,5123:Uint16Array,5121:Uint8Array}[accessor.componentType];
  const size={VEC3:3,VEC2:2,SCALAR:1}[accessor.type];
  if(!Type||!size||(part.byteStride && part.byteStride!==size*Type.BYTES_PER_ELEMENT))throw new Error('Unsupported character accessor');
  const glType={5126:gl.FLOAT,5125:gl.UNSIGNED_INT,5123:gl.UNSIGNED_SHORT,5121:gl.UNSIGNED_BYTE}[accessor.componentType];
  return {size,data:new Type(buffer,binaryOffset+(part.byteOffset||0)+(accessor.byteOffset||0),accessor.count*size),type:glType,normalized:Boolean(accessor.normalized)};
 };
 const primitive=data.meshes[0].primitives[0];
 if(primitive.attributes._RIG===undefined)throw new Error('Character eye rig is missing');
 const geometry=new Geometry(gl,{position:read(primitive.attributes.POSITION),normal:read(primitive.attributes.NORMAL),uv:read(primitive.attributes.TEXCOORD_0),rig:read(primitive.attributes._RIG),index:read(primitive.indices)});
 const textures=[];
 for(const image of data.images){
  const part=data.bufferViews[image.bufferView];
  const blob=new Blob([new Uint8Array(buffer,binaryOffset+(part.byteOffset||0),part.byteLength)],{type:image.mimeType});
  const bitmap=await createImageBitmap(blob,{imageOrientation:'none',premultiplyAlpha:'none'});
  textures.push(new Texture(gl,{image:bitmap,flipY:false,minFilter:gl.LINEAR_MIPMAP_LINEAR,generateMipmaps:true,anisotropy:4}));
 }
 const material=data.materials[primitive.material].pbrMetallicRoughness;
 return {geometry,textures,color:textures[data.textures[material.baseColorTexture.index].source],material:textures[data.textures[material.metallicRoughnessTexture.index].source]};
}

export default function Character3D(container){
 const renderer=new Renderer({dpr:Math.min(devicePixelRatio||1,1.5),alpha:true,antialias:true});
 const gl=renderer.gl;gl.clearColor(0,0,0,0);
 container.replaceChildren(gl.canvas);
 const status=document.createElement('span');status.textContent='Loading 3D portrait…';
 status.setAttribute('role','status');
 Object.assign(status.style,{position:'absolute',right:'8%',top:'44%',color:'#d9c5b5',font:'13px sans-serif',letterSpacing:'.08em'});
 container.appendChild(status);
 gl.canvas.setAttribute('role','img');gl.canvas.setAttribute('aria-label','Textured three-dimensional portrait with cursor-responsive head');
 const scene=new Transform(),camera=new Camera(gl,{fov:32,near:.01,far:20});
 camera.position.set(0,0,1.85);camera.lookAt(new Vec3(0,0,0));
 const controller=new AbortController();
 let asset,program,mesh,disposed=false,frame=0,last=0,visible=true;
 const look=[0,0],target=[0,0];
 const gaze=[0,0],gazeTarget=[0,0];
 const resize=()=>{
  const w=container.clientWidth||1,h=container.clientHeight||1;
  renderer.setSize(w,h);camera.perspective({aspect:w/h});
  if(mesh){mesh.position.x=w/h>1.15?Math.min(.42,(w/h-1)*.65):0;mesh.position.y=-.07;}
 };
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});visibility.observe(container);
 const ready=loadAsset(gl,controller.signal).then(loaded=>{
  asset=loaded;if(disposed){asset.geometry.remove();asset.textures.forEach(t=>{t.image.close();gl.deleteTexture(t.texture)});return;}
  program=new Program(gl,{vertex,fragment,cullFace:false,uniforms:{uColor:{value:asset.color},uMaterial:{value:asset.material},uLook:{value:look},uGaze:{value:gaze}}});
  mesh=new Mesh(gl,{geometry:asset.geometry,program});mesh.setParent(scene);resize();
  container.dataset.characterReady='true';
  status.remove();
 }).catch(error=>{if(error.name!=='AbortError'){container.dataset.characterReady='error';status.textContent='Portrait could not load. Please reload to retry.';console.error('Character could not load',error)}});
 const render=now=>{
  if(disposed)return;
  frame=requestAnimationFrame(render);
  const delta=Math.min((now-last)/1000,.05);last=now;
  if(!mesh||!visible||document.hidden)return;
  const ease=1-Math.exp(-delta*10);
  look[0]+=(target[0]-look[0])*ease;look[1]+=(target[1]-look[1])*ease;
  const eyeEase=1-Math.exp(-delta*14);
  gaze[0]+=(gazeTarget[0]-gaze[0])*eyeEase;gaze[1]+=(gazeTarget[1]-gaze[1])*eyeEase;
  renderer.render({scene,camera});
 };frame=requestAnimationFrame(render);
 return {ready,setPointer(x,y){
  const r=container.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
  target[0]=Math.max(-1,Math.min(1,(x-r.left)/w*2-1));
  target[1]=Math.max(-1,Math.min(1,(y-r.top)/h*2-1));
  const focal=h/(2*Math.tan(16*Math.PI/180));
  const faceX=w/2+((mesh?.position.x||0)+.05)*focal/(1.85-.225);
  const faceY=h/2-(.181-.07)*focal/(1.85-.225);
  gazeTarget[0]=Math.atan2(x-r.left-faceX,focal)*.6;
  gazeTarget[1]=Math.atan2(y-r.top-faceY,focal)*.6;
 },reset(){target.fill(0);gazeTarget.fill(0)},destroy(){disposed=true;controller.abort();cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();asset?.geometry.remove();asset?.textures.forEach(texture=>{texture.image.close();gl.deleteTexture(texture.texture)});program?.remove();gl.canvas.remove();status.remove()}};
}

