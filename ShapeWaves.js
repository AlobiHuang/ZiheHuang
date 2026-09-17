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
out vec4 outColor;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0)),f.x),f.y);
}
void main(){
 vec2 pixel=vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y);
 vec2 cell=floor(pixel/u_cell),center=(cell+.5)*u_cell;
 vec2 local=(pixel-center)/(u_cell*.5);
 vec2 uv=center/u_resolution;
 float mask=texture(u_mask,uv).r;
 if(mask>.34){outColor=vec4(u_background,1.0);return;}
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
 float radial=length((center-u_resolution*.5)/(u_resolution*.5));
 float spawn=smoothstep(radial-.13,radial+.08,u_intro);
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
 if(!gl){root.dataset.failed='true';return{destroy(){}}}
 const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader};
 const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
 const position=gl.getAttribLocation(program,'a_position'),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const uniform=name=>gl.getUniformLocation(program,name);const u={resolution:uniform('u_resolution'),mouse:uniform('u_mouse'),time:uniform('u_time'),intro:uniform('u_intro'),cell:uniform('u_cell'),dot:uniform('u_dot'),scale:uniform('u_scale'),contrast:uniform('u_contrast'),brightness:uniform('u_brightness'),splashRadius:uniform('u_splashRadius'),splashStrength:uniform('u_splashStrength'),color:uniform('u_color'),hover:uniform('u_hover'),background:uniform('u_background'),mask:uniform('u_mask')};
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 let width=1,height=1,dpr=1,raf=0,visible=true,start=performance.now(),mouse=[-9999,-9999],lastPointer=0;
 const mask=document.createElement('canvas'),maskCtx=mask.getContext('2d');
 function makeMask(){
  mask.width=Math.min(1024,width);mask.height=Math.max(1,Math.round(mask.width*height/width));maskCtx.fillStyle='#000';maskCtx.fillRect(0,0,mask.width,mask.height);
  if(settings.text){let fontPx=mask.height*settings.textSize;maskCtx.font=`${settings.fontWeight} ${fontPx}px ${settings.fontFamily}`;const measured=maskCtx.measureText(settings.text).width;if(measured>mask.width*.9)fontPx*=mask.width*.9/measured;maskCtx.font=`${settings.fontWeight} ${fontPx}px ${settings.fontFamily}`;maskCtx.textAlign='center';maskCtx.textBaseline='middle';maskCtx.fillStyle='#fff';maskCtx.fillText(settings.text,mask.width/2,mask.height/2)}
  gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,mask);
 }
 function resize(){const rect=root.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.35);width=Math.max(1,Math.round(rect.width*dpr));height=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);makeMask()}wake()}
 function render(now){raf=0;if(!visible||document.hidden)return;gl.useProgram(program);const elapsed=(now-start)/1000;const intro=settings.intro?Math.min(1.25,elapsed/Math.max(.1,settings.introDuration)*1.25):1.25;gl.uniform2f(u.resolution,width,height);gl.uniform2f(u.mouse,mouse[0]*dpr,mouse[1]*dpr);gl.uniform1f(u.time,elapsed*settings.speed);gl.uniform1f(u.intro,intro);gl.uniform1f(u.cell,settings.cellSize*dpr);gl.uniform1f(u.dot,settings.dotSize);gl.uniform1f(u.scale,settings.scale);gl.uniform1f(u.contrast,settings.contrast);gl.uniform1f(u.brightness,settings.brightness);gl.uniform1f(u.splashRadius,settings.splashRadius*dpr);gl.uniform1f(u.splashStrength,settings.splashStrength);gl.uniform3fv(u.color,parseColor(settings.color));gl.uniform3fv(u.hover,parseColor(settings.hoverColor));gl.uniform3fv(u.background,parseColor(settings.backgroundColor));gl.uniform1i(u.mask,0);gl.drawArrays(gl.TRIANGLES,0,3);root.dataset.ready='true';const pointerHot=now-lastPointer<900;if((!settings.paused&&settings.speed>0)||pointerHot||intro<1.25)raf=requestAnimationFrame(render)}
 function wake(){if(!raf)raf=requestAnimationFrame(render)}
 function pointerMove(event){if(!settings.interactive)return;const rect=root.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){if(mouse[0]>-9000){mouse=[-9999,-9999];lastPointer=performance.now();wake()}return}mouse=[event.clientX-rect.left,event.clientY-rect.top];lastPointer=performance.now();wake()}
 const resizeObserver=new ResizeObserver(resize),visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)wake()});resizeObserver.observe(root);visibilityObserver.observe(root);window.addEventListener('pointermove',pointerMove,{passive:true});document.addEventListener('visibilitychange',wake);resize();
 return{destroy(){if(raf)cancelAnimationFrame(raf);resizeObserver.disconnect();visibilityObserver.disconnect();window.removeEventListener('pointermove',pointerMove);document.removeEventListener('visibilitychange',wake);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program)}};
}
