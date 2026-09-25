const vertexSource=`#version 300 es
in vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}`;

const fragmentSource=`#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_intro;
uniform float u_cell;
uniform float u_dot;
uniform float u_scale;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_splashRadius;
uniform float u_splashStrength;
uniform vec3 u_color;
uniform vec3 u_hover;
uniform vec3 u_background;
uniform sampler2D u_mask;
uniform vec4 u_eye;    // counter of the eye letter: centre x/y, radius x/y (px); z = 0 disables
uniform vec3 u_pupil;  // pupil offset x/y from the eye centre and pupil radius (px)
uniform float u_blink; // 0 open, 1 shut
uniform float u_style; // 0 halftone squares, 1 fine vertical lines
uniform float u_dpr;
uniform float u_amp;   // how far the lines drift (px)
uniform vec2 u_flow;   // the pointer's recent movement (px), lines are dragged along
out vec4 outColor;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0)),f.x),f.y);
}
// Coverage of a hairline of the given width (device px) at pattern
// coordinate x, lines every u_cell; fw is how fast x changes per pixel.
float hairline(float x,float fw,float width){
 float d=abs(fract(x/u_cell+.5)-.5)*u_cell/max(fw,.001);
 return 1.0-smoothstep(width*.5-.65,width*.5+.65,d);
}
// The line field: fine vertical lines that drift slowly, gather into
// darker bands, open like a lens around the pointer and are dragged along
// by its movement. The word is paper cut out of the lines; the eye is drawn
// with the same lines.
void lines(vec2 p){
 vec2 uv=p/u_resolution;
 float radial=length((p-u_resolution*.5)/(u_resolution*.5));
 float spawn=smoothstep(radial-.13,radial+.08,u_intro);
 vec2 f=(p-u_resolution*.5)/(260.0*u_scale*u_dpr);
 float t=u_time;
 float warp=(noise(f*vec2(.55,1.1)+vec2(t*.05,-t*.03))-.5)*u_amp+(noise(f*1.8+vec2(-t*.02,t*.045)+7.3)-.5)*u_amp*.45;
 float tone=clamp((noise(f*.9+vec2(-t*.03,t*.02)+3.1)-u_brightness+.37)*u_contrast,0.0,1.0);
 vec2 d=p-u_mouse;
 float g=exp(-dot(d,d)/(2.0*u_splashRadius*u_splashRadius))*u_splashStrength;
 float x=p.x+warp-d.x*g*.42-u_flow.x*g*.9;
 float fw=abs(dFdx(x))+abs(dFdy(x))*.35;
 float width=u_dpr*u_dot*mix(.7,1.35,tone)+g*.35*u_dpr;
 float ink=hairline(x,fw,width)*mix(.26,.62,tone)*(1.0+g*.35);
 vec3 tint=mix(u_color,u_hover,clamp(g*.9,0.0,1.0));
 if(u_eye.z>0.0){
  vec2 e=(p-u_eye.xy)/u_eye.zw;
  if(dot(e,e)<1.3){
   // The lids are an ellipse as wide as the counter whose height shrinks as
   // the eye closes. No outline: the eye is only its lines and pupil.
   vec2 q=p-u_eye.xy,ab=vec2(u_eye.z,max(.001,u_eye.w*(1.0-u_blink)));
   float lid;
   if(ab.y<2.0*u_dpr)lid=abs(q.x)<ab.x?abs(q.y)-ab.y:length(vec2(abs(q.x)-ab.x,q.y));
   else{vec2 k=q/ab;float r=length(k);lid=(r-1.0)*r/max(length(k/ab),1e-4);}
   float aa=1.0*u_dpr;
   float shade=0.0;
   if(lid<0.0){
    vec2 pupil=u_eye.xy+u_pupil.xy;
    float r=distance(p,pupil),pr=u_pupil.z;
    float solid=1.0-smoothstep(pr-aa,pr+aa,r);
    float iris=(1.0-smoothstep(pr*1.62-aa,pr*1.62+aa,r))*hairline(x,fw,2.4*u_dpr);
    float white=hairline(x,fw,u_dpr*.9)*.28;
    shade=max(solid,max(iris*.9,white));
    float glint=1.0-smoothstep(max(2.5*u_dpr,pr*.2)-aa,max(2.5*u_dpr,pr*.2)+aa,distance(p,pupil+vec2(-.42,-.42)*pr));
    shade*=1.0-glint;
    // Nothing of the eye shows outside the lids.
    shade*=smoothstep(0.0,aa,-lid);
   }
   outColor=vec4(mix(u_background,u_color,shade*spawn),1.0);return;
  }
 }
 float cut=smoothstep(.28,.42,texture(u_mask,uv).r);
 // Lines darken a little as they meet a letter, so the word reads crisply.
 vec2 o=vec2(7.0*u_dpr)/u_resolution;
 float near=max(max(texture(u_mask,uv+vec2(o.x,0.0)).r,texture(u_mask,uv-vec2(o.x,0.0)).r),max(texture(u_mask,uv+vec2(0.0,o.y)).r,texture(u_mask,uv-vec2(0.0,o.y)).r));
 ink=min(1.0,ink*(1.0+smoothstep(.2,.5,near)*.75));
 outColor=vec4(mix(u_background,tint,ink*(1.0-cut)*spawn),1.0);
}
void main(){
 vec2 pixel=vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y);
 if(u_style>.5){lines(pixel);return;}
 vec2 cell=floor(pixel/u_cell),center=(cell+.5)*u_cell;
 vec2 local=(pixel-center)/(u_cell*.5);
 vec2 uv=center/u_resolution;
 float mask=texture(u_mask,uv).r;
 if(mask>.34){outColor=vec4(u_background,1.0);return;}
 float radial=length((center-u_resolution*.5)/(u_resolution*.5));
 float spawn=smoothstep(radial-.13,radial+.08,u_intro);
 // The eye: inside the letter's counter, faint squares for the white of the
 // eye, a ring of mid squares for the iris and a solid block for the pupil,
 // with one empty cell as the glint. Lids of blank paper close from above
 // and below, leaving a line of squares when shut.
 if(u_eye.z>0.0){
  vec2 d=(center-u_eye.xy)/u_eye.zw;
  if(dot(d,d)<1.3){
   float open=(1.0-u_blink)*sqrt(max(0.0,1.0-d.x*d.x));
   float edge=u_cell*.5/u_eye.w,ay=abs(d.y),size=.22;
   if(ay>open+edge){outColor=vec4(u_background,1.0);return;}
   if(u_blink>.02&&ay>open-edge)size=.95;
   else{
    vec2 pupil=u_eye.xy+u_pupil.xy;
    float r=distance(center,pupil),pr=u_pupil.z;
    if(r<pr)size=1.0;else if(r<pr*1.6)size=.62;
    if(distance(center,pupil+vec2(-.42,-.42)*pr)<max(u_cell*.75,pr*.2))size=0.0;
   }
   float sq=max(abs(local.x),abs(local.y)),aa2=2.0/u_cell;
   float eyeShape=(1.0-smoothstep(size-aa2,size+aa2,sq))*step(.01,size)*spawn;
   outColor=vec4(mix(u_background,u_color,eyeShape),1.0);return;
  }
 }
 vec2 field=(center-u_resolution*.5)/(220.0*u_scale);
 float n=noise(field+vec2(u_time*.08,-u_time*.035));
 n=mix(n,noise(field*2.05-vec2(u_time*.025,u_time*.04)),.34);
 float tone=clamp((n-u_brightness+.37)*u_contrast,0.0,1.0);
 float band=floor(tone*3.0)/2.0;
 float dist=distance(center,u_mouse);
 float hover=exp(-(dist*dist)/(2.0*u_splashRadius*u_splashRadius));
 float energy=hover*.72;
 float size=max(.1,u_dot*mix(.42,1.0,band)+energy*.34);
 float square=max(abs(local.x),abs(local.y));
 float aa=2.0/u_cell;
 float shape=1.0-smoothstep(size-aa,size+aa,square);
 shape*=spawn;
 vec3 tint=mix(u_color,u_hover,clamp(hover*.95,0.0,1.0));
 outColor=vec4(mix(u_background,tint,shape),1.0);
}`;

const parseColor=value=>{
 const hex=String(value||'#000000').replace('#','');
 const full=hex.length===3?hex.split('').map(c=>c+c).join(''):hex;
 return [0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255);
};

export default function ShapeWaves(root,options={}){
 const settings={text:'',fontFamily:'Geist, "Geist Sans", system-ui, sans-serif',fontWeight:500,textSize:.6,cellSize:10,dotSize:.75,color:'#929292',hoverColor:'#ffffff',backgroundColor:'#000000',speed:1,scale:1,contrast:1,brightness:.4,interactive:true,splashRadius:40,splashStrength:.4,intro:true,introDuration:1.6,paused:false,...options};
 const canvas=document.createElement('canvas');canvas.className='shape-waves__canvas';root.replaceChildren(canvas);
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!gl){root.dataset.failed='true';return{retype(){},snapshot(){return null},letterBoxes(){return[]},setOffsets(){},tune(){},word:()=>'',settings,destroy(){}}}
 const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader};
 const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
 const position=gl.getAttribLocation(program,'a_position'),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const uniform=name=>gl.getUniformLocation(program,name);const u={resolution:uniform('u_resolution'),mouse:uniform('u_mouse'),time:uniform('u_time'),intro:uniform('u_intro'),cell:uniform('u_cell'),dot:uniform('u_dot'),scale:uniform('u_scale'),contrast:uniform('u_contrast'),brightness:uniform('u_brightness'),splashRadius:uniform('u_splashRadius'),splashStrength:uniform('u_splashStrength'),color:uniform('u_color'),hover:uniform('u_hover'),background:uniform('u_background'),style:uniform('u_style'),dprU:uniform('u_dpr'),amp:uniform('u_amp'),flow:uniform('u_flow'),mask:uniform('u_mask'),eye:uniform('u_eye'),pupil:uniform('u_pupil'),blink:uniform('u_blink')};
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 let width=1,height=1,dpr=1,raf=0,visible=true,start=performance.now(),mouse=[-9999,-9999],lastPointer=0,eased=[-9999,-9999],lastFrame=0,lens=0;
 const mask=document.createElement('canvas'),maskCtx=mask.getContext('2d',{willReadFrequently:true});
 // The word is drawn left-aligned from where the full word would start when
 // centred, so letters stay put while it is retyped one letter at a time.
 let fontPx=0,shown=settings.startEmpty?'':settings.text,anchorWord=settings.text,caret=false,typing=0;
 // Each letter can be moved off its place (dragged on the home hero); offsets
 // are in mask pixels, one [x, y] per letter of the word on show.
 let offsets=[];
 const offsetOf=index=>offsets[index]||[0,0];
 const cssPerMask=()=>width/Math.max(1,mask.width)/dpr;
 function makeMask(){
  mask.width=Math.min(1024,width);mask.height=Math.max(1,Math.round(mask.width*height/width));
  fontPx=mask.height*settings.textSize;
  if(settings.text){maskCtx.font=`${settings.fontWeight} ${fontPx}px ${settings.fontFamily}`;const measured=maskCtx.measureText(settings.text).width;if(measured>mask.width*.9)fontPx*=mask.width*.9/measured}
  paintMask();
 }
 function paintMask(){
  maskCtx.fillStyle='#000';maskCtx.fillRect(0,0,mask.width,mask.height);
  maskCtx.font=`${settings.fontWeight} ${fontPx}px ${settings.fontFamily}`;maskCtx.textBaseline='middle';maskCtx.fillStyle='#fff';
  const left=mask.width/2-maskCtx.measureText(anchorWord).width/2,mid=mask.height/2;
  if(shown){
   maskCtx.textAlign='left';
   // Letter by letter, so each can sit at its own offset.
   for(let i=0;i<shown.length;i++){const [ox,oy]=offsetOf(i);maskCtx.fillText(shown[i],left+maskCtx.measureText(shown.slice(0,i)).width+ox,mid+oy)}
  }
  // A typing caret: an underscore on the baseline just after the last letter.
  if(caret)maskCtx.fillRect(left+maskCtx.measureText(shown).width+fontPx*.06,mid+fontPx*.29,fontPx*.46,Math.max(2,fontPx*.075));
  maskCtx.textAlign='center';
  gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,mask);
  // The eye lives in the O as soon as the O is on the page. When it arrives it
  // starts shut and opens (see updateEye); when it leaves it has closed first.
  const hadEye=!!eye;
  if(anchorWord===settings.text&&eyeIndex>=0&&shown.length>eyeIndex)findEye();else eye=null;
  if(eye&&!hadEye){look.openAt=performance.now();look.closeAt=0}
  if(!eye)look.closeAt=0;
  wake();
 }
 // Retype the word: backspace the current one letter by letter, then type
 // the new one, with a caret that lingers a moment at the end.
 function retype(target){
  target=String(target||settings.text);
  clearTimeout(typing);
  if(target!==anchorWord&&offsets.length){offsets=[];paintMask()}
  // Turned back to the name while the eye was closing to be erased: open it again.
  if(look.closeAt&&eye&&target===settings.text){look.closeAt=0;look.openAt=performance.now()}
  if(reducedMotion){shown=anchorWord=target;caret=false;paintMask();return}
  const step=()=>{
   if(anchorWord!==target&&shown.length){
    // About to backspace the O: let the eye close first.
    if(eye&&shown.length===eyeIndex+1&&!look.closeAt){look.closeAt=performance.now();wake();typing=setTimeout(step,190);return}
    shown=shown.slice(0,-1);caret=true;paintMask();typing=setTimeout(step,45);return}
   if(anchorWord!==target){anchorWord=target;shown=''}
   if(shown.length<target.length){shown=target.slice(0,shown.length+1);caret=true;paintMask();typing=setTimeout(step,95);return}
   caret=true;paintMask();typing=setTimeout(()=>{caret=false;paintMask()},420);
  };
  step();
 }
 // Locate the counter (the hole) of the eye letter in the mask: start from
 // the letter's measured centre and scan out to the ink on each side.
 let eye=null;
 const eyeIndex=settings.eye&&settings.text?settings.text.indexOf(settings.eye):-1;
 function findEye(){
  eye=null;
  const index=settings.eye&&settings.text?settings.text.indexOf(settings.eye):-1;
  if(index<0)return;
  const total=maskCtx.measureText(settings.text).width,left=mask.width/2-total/2;
  const before=maskCtx.measureText(settings.text.slice(0,index)).width,through=maskCtx.measureText(settings.text.slice(0,index+1)).width;
  const metrics=maskCtx.measureText(settings.eye);
  const [ox,oy]=offsetOf(index);
  let cx=left+(before+through)/2+ox,cy=mask.height/2+(metrics.actualBoundingBoxDescent-metrics.actualBoundingBoxAscent)/2+oy;
  // Only read the pixels around the letter, not the whole mask.
  const span=Math.ceil((through-before)*1.2+8),x0=Math.max(0,Math.floor(cx-span/2)),y0=Math.max(0,Math.floor(cy-span/2));
  const sw=Math.max(1,Math.min(mask.width-x0,span)),sh=Math.max(1,Math.min(mask.height-y0,span));
  const data=maskCtx.getImageData(x0,y0,sw,sh).data;
  const ink=(x,y)=>{const ix=Math.round(x)-x0,iy=Math.round(y)-y0;if(ix<0||iy<0||ix>=sw||iy>=sh)return true;return data[(iy*sw+ix)*4]>86};
  if(ink(cx,cy))return;
  let l=cx,r=cx;while(l>x0&&!ink(l,cy))l--;while(r<x0+sw-1&&!ink(r,cy))r++;
  cx=(l+r)/2;
  let t=cy,b=cy;while(t>y0&&!ink(cx,t))t--;while(b<y0+sh-1&&!ink(cx,b))b++;
  cy=(t+b)/2;
  const rx=(r-l)/2,ry=(b-t)/2;
  if(rx<4||ry<4||rx>through-before)return;
  const k=width/mask.width;
  eye={x:cx*k,y:cy*k,rx:rx*k,ry:ry*k};
 }
 // Eye behaviour: the pupil follows the pointer anywhere on the page, widens
 // when the pointer is on the eye, wanders when left alone, blinks now and
 // then, and flinches shut when poked.
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const look={openAt:-1e9,closeAt:0,x:0,y:0,scale:1,lastMove:-1e9,wanderAt:0,wanderX:0,wanderY:0,blinkAt:-1e9,hold:40,nextBlink:performance.now()+2600,flinchUntil:0,last:performance.now(),clientX:0,clientY:0,rect:null};
 const blinkAmount=now=>{const e=now-look.blinkAt;if(e<0)return 0;if(e<70)return(e/70)**2;if(e<70+look.hold)return 1;const o=(e-70-look.hold)/150;return o<1?1-o*o*(3-2*o):0};
 function updateEye(now){
  if(!eye)return 0;
  const dt=Math.min(.05,(now-look.last)/1000);look.last=now;
  const base=Math.min(eye.rx,eye.ry),cell=settings.cellSize*dpr;
  const pupilR=Math.max(cell*1.2,base*.36);
  const reach=Math.max(0,base-pupilR*1.6-cell*.6);
  let tx=0,ty=0,onEye=false;
  if(now-look.lastMove<4200&&look.rect){
   const dx=(look.clientX-look.rect.left)*dpr-eye.x,dy=(look.clientY-look.rect.top)*dpr-eye.y;
   const dist=Math.hypot(dx,dy),pull=Math.min(1,dist/(260*dpr));
   onEye=(dx/eye.rx)**2+(dy/eye.ry)**2<1;
   if(dist>.01){tx=dx/dist*pull;ty=dy/dist*pull}
  }else if(!reducedMotion){
   if(now>look.wanderAt){const a=Math.random()*Math.PI*2,m=Math.random()<.3?0:.45+Math.random()*.5;look.wanderX=Math.cos(a)*m;look.wanderY=Math.sin(a)*m*.8;look.wanderAt=now+700+Math.random()*1500}
   tx=look.wanderX;ty=look.wanderY;
  }
  const quick=1-Math.exp(-dt/.055);
  look.x+=(tx*reach*eye.rx/base-look.x)*quick;look.y+=(ty*reach*eye.ry/base-look.y)*quick;
  const targetScale=now<look.flinchUntil?.55:onEye?1.3:1;
  look.scale+=(targetScale-look.scale)*(1-Math.exp(-dt/.12));
  if(!reducedMotion&&now>look.nextBlink){look.blinkAt=now;look.hold=40;look.nextBlink=now+(Math.random()<.2?280:2400+Math.random()*3800)}
  gl.uniform4f(u.eye,eye.x,eye.y,eye.rx,eye.ry);
  // Arriving: shut at first, the lids part and the pupil swells into place.
  // Leaving: the lids close over it.
  const open=Math.min(1,(now-look.openAt)/750),arrive=1-(1-open)**3;
  const lids=Math.max(1-arrive,look.closeAt?Math.min(1,(now-look.closeAt)/160)**2:0);
  const swell=open<1?Math.max(.05,1+2.2*(open-1)**3+1.2*(open-1)**2):1;
  gl.uniform3f(u.pupil,look.x,look.y,pupilR*look.scale*swell);
  gl.uniform1f(u.blink,Math.max(blinkAmount(now),lids));
  return 1;
 }
 function eyePointer(event){look.clientX=event.clientX;look.clientY=event.clientY;look.lastMove=performance.now();look.rect=root.getBoundingClientRect()}
 function eyePoke(event){
  eyePointer(event);if(!eye)return;
  const dx=(event.clientX-look.rect.left)*dpr-eye.x,dy=(event.clientY-look.rect.top)*dpr-eye.y;
  if((dx/eye.rx)**2+(dy/eye.ry)**2<1){const now=performance.now();look.blinkAt=now;look.hold=220;look.flinchUntil=now+700;look.nextBlink=now+3000;wake()}
 }
 const eyeScroll=()=>{if(look.rect)look.rect=root.getBoundingClientRect()};
 const eyeLeave=()=>{look.lastMove=-1e9};
 function resize(){const rect=root.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.35);width=Math.max(1,Math.round(rect.width*dpr));height=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);makeMask()}wake()}
 function render(now){raf=0;if(!visible||document.hidden)return;gl.useProgram(program);const elapsed=(now-start)/1000;const intro=settings.intro?Math.min(1.25,elapsed/Math.max(.1,settings.introDuration)*1.25):1.25;gl.uniform2f(u.resolution,width,height);const lines=settings.pattern==='lines';let flowX=0,flowY=0;if(lines){const k=1-Math.exp(-Math.min(.05,Math.max(.001,(now-(lastFrame||now))/1000))/.14);const inside=mouse[0]>-9000;lens+=((inside?1:0)-lens)*(1-Math.exp(-Math.min(.05,Math.max(.001,(now-(lastFrame||now))/1000))/.25));if(inside){if(eased[0]<-9000||Math.hypot(mouse[0]-eased[0],mouse[1]-eased[1])>500)eased=[...mouse];else{eased[0]+=(mouse[0]-eased[0])*k;eased[1]+=(mouse[1]-eased[1])*k}flowX=Math.max(-90,Math.min(90,mouse[0]-eased[0]));flowY=mouse[1]-eased[1]}}lastFrame=now;const at=lines&&eased[0]>-9000?eased:mouse;gl.uniform2f(u.mouse,at[0]*dpr,at[1]*dpr);gl.uniform1f(u.style,lines?1:0);gl.uniform1f(u.dprU,dpr);gl.uniform1f(u.amp,(settings.lineDrift??30)*dpr);gl.uniform2f(u.flow,flowX*dpr,flowY*dpr);gl.uniform1f(u.time,elapsed*settings.speed);gl.uniform1f(u.intro,intro);gl.uniform1f(u.cell,settings.cellSize*dpr);gl.uniform1f(u.dot,settings.dotSize);gl.uniform1f(u.scale,settings.scale);gl.uniform1f(u.contrast,settings.contrast);gl.uniform1f(u.brightness,settings.brightness);gl.uniform1f(u.splashRadius,settings.splashRadius*dpr);gl.uniform1f(u.splashStrength,lines?lens:settings.splashStrength);gl.uniform3fv(u.color,parseColor(settings.color));gl.uniform3fv(u.hover,parseColor(settings.hoverColor));gl.uniform3fv(u.background,parseColor(settings.backgroundColor));if(!updateEye(now))gl.uniform4f(u.eye,0,0,0,0);gl.uniform1i(u.mask,0);gl.drawArrays(gl.TRIANGLES,0,3);root.dataset.ready='true';const pointerHot=now-lastPointer<900;if((!settings.paused&&settings.speed>0)||pointerHot||intro<1.25)raf=requestAnimationFrame(render)}
 function wake(){if(!raf)raf=requestAnimationFrame(render)}
 function pointerMove(event){if(!settings.interactive)return;const rect=root.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){if(mouse[0]>-9000){mouse=[-9999,-9999];lastPointer=performance.now();wake()}return}mouse=[event.clientX-rect.left,event.clientY-rect.top];lastPointer=performance.now();wake()}
 const resizeObserver=new ResizeObserver(resize),visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)wake()});resizeObserver.observe(root);visibilityObserver.observe(root);window.addEventListener('pointermove',pointerMove,{passive:true});if(settings.eye){window.addEventListener('pointermove',eyePointer,{passive:true});window.addEventListener('pointerdown',eyePoke,{passive:true});window.addEventListener('scroll',eyeScroll,{passive:true});document.documentElement.addEventListener('mouseleave',eyeLeave)}document.addEventListener('visibilitychange',wake);resize();
 // A still copy of the current frame (a WebGL canvas can only be read in the
 // same task it was drawn in, so draw one now and copy it straight away).
 function snapshot(){
  if(raf){cancelAnimationFrame(raf);raf=0}
  render(performance.now());
  const copy=document.createElement('canvas');copy.width=canvas.width;copy.height=canvas.height;
  copy.getContext('2d').drawImage(canvas,0,0);
  return copy;
 }
 // Where each letter of the word on show sits, in CSS pixels from the top left
 // of the field (ink bounds, offsets included).
 function letterBoxes(){
  if(!mask.width||!shown)return[];
  maskCtx.font=`${settings.fontWeight} ${fontPx}px ${settings.fontFamily}`;maskCtx.textAlign='left';
  const left=mask.width/2-maskCtx.measureText(anchorWord).width/2,mid=mask.height/2,k=cssPerMask();
  return [...shown].map((ch,i)=>{
   const m=maskCtx.measureText(ch),[ox,oy]=offsetOf(i);
   const x=left+maskCtx.measureText(shown.slice(0,i)).width+ox;
   return{ch,index:i,x:(x-m.actualBoundingBoxLeft)*k,y:(mid+oy-m.actualBoundingBoxAscent)*k,w:(m.actualBoundingBoxLeft+m.actualBoundingBoxRight)*k,h:(m.actualBoundingBoxAscent+m.actualBoundingBoxDescent)*k,advance:m.width*k};
  });
 }
 function setOffsets(list){const k=cssPerMask();offsets=(list||[]).map(([x,y])=>[x/k,y/k]);paintMask()}
 function tune(values){if(values.cellSize)settings.cellSize=values.cellSize;if(values.dotSize)settings.dotSize=values.dotSize;wake()}
 return{retype,snapshot,letterBoxes,setOffsets,tune,word:()=>shown,settings,destroy(){clearTimeout(typing);if(raf)cancelAnimationFrame(raf);resizeObserver.disconnect();visibilityObserver.disconnect();window.removeEventListener('pointermove',pointerMove);window.removeEventListener('pointermove',eyePointer);window.removeEventListener('pointerdown',eyePoke);window.removeEventListener('scroll',eyeScroll);document.documentElement.removeEventListener('mouseleave',eyeLeave);document.removeEventListener('visibilitychange',wake);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program)}};
}
