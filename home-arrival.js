import ShapeWaves from './ShapeWaves.js?v=20260916-hover-only-1';

const hero = document.querySelector('.continuous-hero');
if (hero) {
 const wavesRoot=hero.querySelector('.shape-waves-host');
 const canvas = hero.querySelector('canvas'), ctx = canvas.getContext('2d',{alpha:false});
 const sweep = document.createElement('div');
 sweep.className = 'arrival-sweep';
 sweep.setAttribute('aria-hidden','true');
 hero.append(sweep);
 const arrivalCursor = document.createElement('div');
 arrivalCursor.className = 'arrival-cursor';
 arrivalCursor.setAttribute('aria-hidden','true');
 hero.append(arrivalCursor);
 const status = document.createElement('span');status.className='arrival-status';status.setAttribute('role','status');status.textContent='Opening portfolio';hero.append(status);
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 let arrivalSeen = false;
 let returningHome = false;
 try {
  arrivalSeen = sessionStorage.getItem('alobi-home-arrival-seen') === '1';
  returningHome = sessionStorage.getItem('alobi-home-line-return') === '1';
  sessionStorage.removeItem('alobi-home-line-return');
  if (!arrivalSeen) sessionStorage.setItem('alobi-home-arrival-seen', '1');
 } catch {}
 const skip = reduced || (!returningHome && (arrivalSeen || (location.hash && location.hash !== '#top')));
 const clamp = n => Math.max(0,Math.min(1,n));
 const ease = n => {n=clamp(n);return n*n*(3-2*n)};
 const kinetic = n => {n=clamp(n);return n<.5?16*n**5:1-(-2*n+2)**5/2};
 const mix = (a,b,n) => a+(b-a)*n;
 const motionRate=1.265;
 const mountWaves=()=>{if(!wavesRoot||wavesRoot.dataset.mounted)return;wavesRoot.dataset.mounted='true';try{ShapeWaves(wavesRoot,{text:'ALOBI',fontFamily:'Geist, "Geist Sans", system-ui, sans-serif',fontWeight:500,textSize:.6,shapes:'squares',cellSize:8,dotSize:.75,color:'#000000',hoverColor:'#7b6f6f',backgroundColor:'#ffffff',speed:1,scale:1,contrast:.95,brightness:.37,flow:0,direction:0,fade:0,interactive:true,splashRadius:62,splashStrength:.4,glow:.35,intro:false,introDuration:1.6,paused:false})}catch(error){wavesRoot.dataset.failed='true';console.error(error)}};
 if(skip)mountWaves();else setTimeout(mountWaves,(returningHome?.91:4.27)*1000);
 let w=0,h=0,full=0,raf=0,start=performance.now()-(returningHome?4.28/motionRate*1000:0),visible=true,finished=false,scrollProgress=0;
 let px=.5,py=.5,mx=.5,my=.5,cursorX=innerWidth*.5,cursorY=innerHeight*.5;
 const field=hero.querySelector('.magnetic-field'),fieldGroup=field?.querySelector('g');
 let fieldX=500,fieldY=255,targetFieldX=500,targetFieldY=255,fieldRaf=0,fieldCount=0;
 const svgNS='http://www.w3.org/2000/svg';
 function buildField(){
  if(!fieldGroup)return;
  const nextCount=w<700?24:40;
  if(nextCount===fieldCount)return;
  fieldCount=nextCount;fieldGroup.replaceChildren();
  for(let i=0;i<fieldCount;i++)fieldGroup.append(document.createElementNS(svgNS,'path'));
 }
 function drawField(){
  if(!fieldGroup)return;
  const radius=w<700?145:118;
  [...fieldGroup.children].forEach((path,index)=>{
   const base=-45+index/(fieldCount-1)*1090;
   const points=[];
   for(let step=0;step<=30;step++){
    const y=500-step/30*500;
    const envelope=Math.sin(Math.PI*y/500);
    const wave=(Math.sin(y*.026+base*.014)*13+Math.sin(y*.011-base*.008)*8)*envelope;
    const rawX=base+wave,dx=rawX-fieldX,dy=y-fieldY;
    const influence=Math.exp(-(dx*dx+dy*dy)/(2*radius*radius));
    const side=Math.abs(dx)<.5?(index%2?1:-1):Math.sign(dx);
    const push=side*radius*.72*influence*envelope;
    const curl=(-dy/radius)*18*influence*envelope;
    points.push(`${step?'L':'M'}${(rawX+push+curl).toFixed(1)},${y.toFixed(1)}`);
   }
   path.setAttribute('d',points.join(' '));
  });
 }
 function animateField(){
  fieldRaf=0;fieldX+=(targetFieldX-fieldX)*(reduced?1:.2);fieldY+=(targetFieldY-fieldY)*(reduced?1:.2);drawField();
  if(Math.abs(targetFieldX-fieldX)+Math.abs(targetFieldY-fieldY)>.45)fieldRaf=requestAnimationFrame(animateField);
 }
 function aimField(clientX,clientY){
  if(!field)return;
  const rect=field.getBoundingClientRect();
  targetFieldX=clamp((clientX-rect.left)/Math.max(1,rect.width))*1000;
  targetFieldY=clamp((clientY-rect.top)/Math.max(1,rect.height))*500;
  if(!fieldRaf)fieldRaf=requestAnimationFrame(animateField);
 }
 function resize(){w=hero.clientWidth;full=hero.clientHeight;h=full;const d=Math.min(devicePixelRatio||1,1.25);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);buildField();drawField();wake()}
 function stroke(x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
 function drawPlotter(now,reveal,dividerY){
  if(reveal<=0)return;
  const mobile=w<700;
  const collapse=kinetic(scrollProgress);
  const fieldH=dividerY;
  const layers=mobile?9:14;
  const fontSize=Math.min(w*(mobile?.235:.19),fieldH*(mobile?.36:.42));
  const font=`800 ${fontSize}px Arial, sans-serif`;
  ctx.save();ctx.beginPath();ctx.rect(0,0,w,fieldH+1);ctx.clip();

  // The word is treated like a cut architectural volume. Its many plotted
  // sections create depth; scrolling compresses that volume into the divider.
  const tilt=(mx-.5)*(mobile?.025:.055);
  const centerY=mix(fieldH*.5,dividerY,collapse);
  const depthX=(mx-.5)*(mobile?45:110)-w*.055;
  const depthY=-fieldH*(mobile?.18:.24)+(my-.5)*38;
  const scaleY=mix(1,.018,collapse);
  ctx.font=font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';

  // Sparse construction guides tie the object to the site's drafting language.
  ctx.save();ctx.globalAlpha=reveal*(1-collapse)*.32;ctx.strokeStyle='#77777c';ctx.lineWidth=.65;
  const guideTop=centerY-fontSize*.43;
  const guideBottom=centerY+fontSize*.43;
  stroke(w*.07,guideTop,w*.93,guideTop);
  stroke(w*.07,guideBottom,w*.93,guideBottom);
  [w*.07,w*.5,w*.93].forEach(x=>stroke(x,guideTop-8,x,guideBottom+8));
  ctx.restore();

  for(let i=0;i<layers;i++){
   const d=i/(layers-1);
   const z=1-d;
   const drift=0;
   ctx.save();
   ctx.translate(w*.5+depthX*z+drift,centerY+depthY*z);
   ctx.rotate(tilt*mix(1.25,.1,d)*(1-collapse));
   ctx.scale(1,scaleY);
   ctx.globalAlpha=reveal*mix(.1,.52,d)*mix(1,.7,collapse);
   ctx.strokeStyle='#1d1d1f';ctx.lineWidth=mix(.55,1.45,d);
   ctx.strokeText('ALOBI',0,0,w*.83);
   ctx.restore();
  }

  // A narrow moving section plane reverses the drawing without adding color.
  if(!mobile&&collapse<.96){
   const cutX=mix(w*.18,w*.82,mx);
   const cutW=Math.max(72,w*.065);
   ctx.save();ctx.globalAlpha=reveal*(1-collapse)*.96;
   ctx.fillStyle='#1d1d1f';ctx.fillRect(cutX-cutW*.5,0,cutW,fieldH);
   ctx.beginPath();ctx.rect(cutX-cutW*.5,0,cutW,fieldH);ctx.clip();
   for(let i=0;i<layers;i++){
    const d=i/(layers-1),z=1-d;
    ctx.save();ctx.translate(w*.5+depthX*z,centerY+depthY*z);ctx.rotate(tilt*mix(1.25,.1,d));ctx.scale(1,scaleY);
    ctx.globalAlpha=mix(.22,.9,d);ctx.strokeStyle='#fff';ctx.lineWidth=mix(.55,1.35,d);ctx.strokeText('ALOBI',0,0,w*.83);ctx.restore();
   }
   ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.textAlign='center';ctx.textBaseline='top';
   ctx.fillText('SECTION / 00',cutX,Math.max(100,fieldH*.16));
   ctx.restore();
  }

  ctx.save();ctx.globalAlpha=reveal*(1-collapse);ctx.fillStyle='#6e6e73';ctx.font='10px monospace';ctx.textBaseline='alphabetic';
  ctx.textAlign='left';ctx.fillText('PLOTTED IDENTITY / 34 SECTIONS',w*.07,fieldH-25);
  ctx.textAlign='right';ctx.fillText('DEPTH 00—34',w*.93,fieldH-25);
  ctx.restore();ctx.restore();
 }
 function drawMark(t,fold){
  const scale=w<700?.82:1,x=w/2,y=full*.43,halfH=32*scale;
  const exitLineY=y-halfH;
  const riseDistance=62*scale;
  const yy=value=>value-riseDistance*fold;
  const zL=x-34*scale,zR=x-3*scale,hL=x+10*scale,hR=x+35*scale;
  const yT=y-23*scale,yB=y+23*scale,yM=y;
  const strokes=[
   {a:[zL,yT],b:[zR,yT],kind:'h',delay:0},
   {a:[zR,yT],b:[zL,yB],kind:'d',delay:.1},
   {a:[zL,yB],b:[zR,yB],kind:'h',delay:.2},
   {a:[hL,yT],b:[hL,yB],kind:'v',delay:.06},
   {a:[hR,yT],b:[hR,yB],kind:'v',delay:.16},
   {a:[hL,yM],b:[hR,yM],kind:'h',delay:.24}
  ];
  ctx.save();ctx.strokeStyle='#1d1d1f';ctx.lineCap='square';ctx.lineJoin='miter';
  ctx.save();
  if(fold>.001){ctx.beginPath();ctx.rect(0,exitLineY+1,w,full-exitLineY);ctx.clip()}
  const markAlpha=1;
  const cornerGrow=kinetic((t-.12)/.82),cornerFade=1-ease((t-2.12)/.44);
  const cornerSize=3*scale*cornerGrow;
  ctx.globalAlpha=markAlpha*cornerFade*.9;ctx.fillStyle='#1d1d1f';
  const corners=[[zL,yT],[zR,yT],[zL,yB],[zR,yB],[hL,yT],[hR,yT],[hL,yM],[hR,yM],[hL,yB],[hR,yB]];
  corners.forEach(([cx,cy])=>ctx.fillRect(cx-cornerSize*.5,yy(cy)-cornerSize*.5,cornerSize,cornerSize));
  strokes.forEach(item=>{
   const grow=kinetic((t-.72-item.delay)/1.42);
   const cut=kinetic((t-2.34-item.delay*.35)/1.02);
   const ax=item.a[0],ay=item.a[1],bx=item.b[0],by=item.b[1];
   const dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length;
   const guideLength=item.kind==='d'?Math.hypot(w,h)*2:item.kind==='v'?h*2:w*2;
   const centerX=(ax+bx)/2,centerY=(ay+by)/2;
   const grownHalf=guideLength*.5*grow;
   const fullA=[centerX-ux*grownHalf,centerY-uy*grownHalf];
   const fullB=[centerX+ux*grownHalf,centerY+uy*grownHalf];
   const lineA=[mix(fullA[0],ax,cut),mix(fullA[1],ay,cut)];
   const lineB=[mix(fullB[0],bx,cut),mix(fullB[1],by,cut)];
   ctx.globalAlpha=markAlpha*(.62+.38*cut);
   ctx.lineWidth=mix(.9,Math.max(2.5,3.5*scale),cut);
   stroke(lineA[0],yy(lineA[1]),lineB[0],yy(lineB[1]));
  });
  ctx.restore();
  const exitLineGrow=kinetic(fold/.16);
  const exitLineFade=1-ease((fold-.88)/.12);
  ctx.globalAlpha=exitLineGrow*exitLineFade;
  ctx.strokeStyle='#1d1d1f';ctx.lineWidth=.8;
  stroke(x-42*scale*exitLineGrow,exitLineY,x+42*scale*exitLineGrow,exitLineY);
  ctx.restore();
 }
 function render(now){
  raf=0;if(document.hidden||!visible)return;
  const t=skip?8:(now-start)/1000*motionRate;
  mx+=(px-mx)*.045;my+=(py-my)*.045;
  const cursorRise=returningHome?1:kinetic((t-3.48)/.74);
  const shownCursorY=mix(innerHeight+34,cursorY,cursorRise);
  arrivalCursor.style.setProperty('--arrival-cursor-x',`${cursorX}px`);
  arrivalCursor.style.setProperty('--arrival-cursor-y',`${shownCursorY}px`);
  arrivalCursor.style.setProperty('--arrival-cursor-opacity',String(ease((cursorRise-.04)/.22)));
  const paper=Math.round(mix(255,245,ease((t-5.12)/1.3)));
  ctx.fillStyle=`rgb(${paper},${paper},${Math.min(255,paper+2)})`;ctx.fillRect(0,0,w,h);
  const fold=kinetic((t-4.3)/1.18),rise=kinetic((t-4.3)/1.18),drop=kinetic((t-5.54)/1.16);
  const reveal=kinetic((t-5.4)/1.58),roll=kinetic((t-5.82)/.98),details=kinetic((t-6.02)/.86);
  const dividerY=full*(w<700?.78:.82),sweepY=rise<1?full+(dividerY-full)*rise:dividerY+(full-dividerY)*drop;
  hero.style.setProperty('--bar-opacity',String(ease((t-5.44)/.16)));
  hero.style.setProperty('--sweep-y',`${sweepY}px`);
  hero.style.setProperty('--sweep-opacity',String(t>4.26&&drop<1?1:0));
  hero.style.setProperty('--sweep-weight',`${4.6+Math.sin(Math.PI*(rise<1?rise:drop))*1.9}px`);
  hero.style.setProperty('--roll',String(roll));hero.style.setProperty('--details',String(details));
  const fieldElapsed=Math.max(0,(t-5.62)*1000);
  hero.style.setProperty('--field-opacity',String(ease((t-5.6)/.14)));
  if(wavesRoot){
   if(fieldElapsed>=1770)wavesRoot.style.clipPath='none';
   else{
    const points=[];
    for(let i=0;i<=60;i++){
     const x=i/60;
     const centerDelay=Math.pow(Math.sin(x*Math.PI),1.7)*620;
     const cornerRise=ease((fieldElapsed-centerDelay)/1150);
     points.push(`${x*100}% ${(1-cornerRise)*100}%`);
    }
    wavesRoot.style.clipPath=`polygon(0% 100%,${points.join(',')},100% 100%)`;
   }
  }
  if(!returningHome&&t<5.52)drawMark(t,fold);
  if(t>=7.48&&!finished){finished=true;document.body.classList.add('arrival-done','is-ready');status.textContent='Portfolio ready'}
  if(!reduced&&!finished)raf=requestAnimationFrame(render);
 }
 function wake(){if(!raf)raf=requestAnimationFrame(render)}
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();cursorX=e.clientX;cursorY=e.clientY;px=e.clientX/w;py=(e.clientY-r.top)/h;if(e.clientY<r.top+r.height*(w<700?.58:.62))aimField(e.clientX,e.clientY)},{passive:true});
 hero.addEventListener('pointerleave',()=>{px=.5;py=.5;targetFieldX=500;targetFieldY=255;if(!fieldRaf)fieldRaf=requestAnimationFrame(animateField)});
 addEventListener('scroll',()=>{scrollProgress=clamp(scrollY/(Math.max(1,hero.offsetHeight)*.48));wake()},{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake()}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake()});
 addEventListener('resize',resize);resize();
 // Never leave navigation hidden if the browser suspends the opening frames.
 setTimeout(()=>document.body.classList.add('arrival-done','is-ready'),8500/motionRate);
}
