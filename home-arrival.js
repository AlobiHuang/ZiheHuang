import ShapeWaves from './ShapeWaves.js?v=20260925-slow-1';
import heroExtrude from './hero-extrude.js?v=8';

const hero = document.querySelector('.continuous-hero');
if (hero) {
 const wavesRoot=hero.querySelector('.shape-waves-host');
 const canvas = hero.querySelector('canvas'), ctx = canvas.getContext('2d',{alpha:false});
 const sweep = document.createElement('div');
 sweep.className = 'arrival-sweep';
 sweep.setAttribute('aria-hidden','true');
 hero.append(sweep);
 const mobilePointer = matchMedia('(hover:none), (pointer:coarse)').matches || (navigator.maxTouchPoints > 0 && innerWidth <= 1024);
 const arrivalCursor = mobilePointer ? null : document.createElement('div');
 if (arrivalCursor) {
  arrivalCursor.className = 'arrival-cursor';
  arrivalCursor.setAttribute('aria-hidden','true');
  hero.append(arrivalCursor);
 }
 const status = document.createElement('span');status.className='arrival-status';status.setAttribute('role','status');status.textContent='Opening portfolio';hero.append(status);
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 let arrivalSeen = false;
 let returningHome = false;
 try {
  arrivalSeen = sessionStorage.getItem('alobi-home-arrival-seen') === '1';
  // Oct 5: the opening plays only on the first landing of a visit. Coming back
  // home from another page (or with Back) shows the finished cover at once.
  sessionStorage.removeItem('alobi-home-line-return');
  if (!arrivalSeen) sessionStorage.setItem('alobi-home-arrival-seen', '1');
 } catch {}
 // Back to the home page with the browser's Back button: play the same short
 // return as the site's own HOME link, unless we are going back into the room
 // (walk-gallery.js shrinks the project's picture back into its frame then).
 const navType=performance.getEntriesByType?.('navigation')?.[0]?.type||'';
 const roomReturn=()=>{try{const r=JSON.parse(sessionStorage.getItem('alobi-zoom-return')||'null');return !!r&&Date.now()-r.at<3600000}catch{return false}};
 void roomReturn;
 let skip = reduced || arrivalSeen || (location.hash && location.hash !== '#top');
 const clamp = n => Math.max(0,Math.min(1,n));
 const ease = n => {n=clamp(n);return n*n*(3-2*n)};
 const kinetic = n => {n=clamp(n);return n<.5?16*n**5:1-(-2*n+2)**5/2};
 const mix = (a,b,n) => a+(b-a)*n;
 const motionRate=1.265;
 // Tightened opening: guide lines grow faster (S1), the pause after ZH is
 // shorter (S2), and the sweep's drop overlaps its rise (S3). Each is how far
 // (in the timings below) that part now comes earlier than it used to.
 // Oct 2: after the ZH, back to the original, slower pacing (no tightening),
 // so the cursor rises and the line sweeps at their first, unhurried speed.
 const S1=0,S2=0,S3=0;
 // Oct 1: the opening starts straight on the finished ZH (no guide lines
 // growing across the screen and thickening into the letters). T0 is where
 // on the old timeline it now begins; the previous opening is kept in
 // archive/intro-v2/home-arrival.js.
 const T0=3.0;
 let waves=null,extrude=null,extrudeReady=false;
 // The solid's opening plays once the field has risen into view.
 const playExtrude=()=>{if(extrudeReady)return;extrudeReady=true;if(skip)extrude?.settle();else extrude?.play()};
 // The hero's field: a contour map of the word (the default), or the earlier
 // fine vertical lines with ?field=lines, kept for comparison.
 const heroField=new URLSearchParams(location.search).get('field')==='lines'?'lines':'contour';
 const mountWaves=()=>{if(!wavesRoot||wavesRoot.dataset.mounted)return;wavesRoot.dataset.mounted='true';try{waves=ShapeWaves(wavesRoot,{text:'ALOBI',fontFamily:'Geist, "Geist Sans", system-ui, sans-serif',fontWeight:500,textSize:.6,shapes:'squares',pattern:heroField,levels:20,cellSize:innerWidth<700?5:8,dotSize:1,lineDrift:30,color:'#1d1d1f',hoverColor:'#1d1d1f',backgroundColor:heroField==='contour'?'#f5f5f7':'#ffffff',speed:1,scale:1,contrast:1.1,brightness:.4,flow:0,direction:0,fade:0,interactive:true,splashRadius:120,splashStrength:.4,glow:.35,intro:false,introDuration:1.6,paused:false,eye:'O'});wavesRoot.alobiSnapshot=()=>{const still=waves.snapshot();const solid=wavesRoot.querySelector('.hero-extrude');if(still&&solid){try{still.getContext('2d').drawImage(solid,0,0,still.width,still.height)}catch{}}return still};
  // The word as a solid standing on the contour map (hero-extrude.js).
  if(heroField==='contour'&&waves.maskInfo){extrude=heroExtrude(wavesRoot,waves,{reduced});if(skip)extrude.settle();else if(extrudeReady)extrude.play()}}catch(error){wavesRoot.dataset.failed='true';console.error(error)}};
 // Hovering ARCH / PD / PM retypes the big word to match, straight away.
 const scaleButtons=[...hero.querySelectorAll('.scale')],scaleMap=hero.querySelector('.scale-map');
 let wordTimer=0,wordShown='ALOBI';
 const showWord=(word,delay)=>{
  clearTimeout(wordTimer);
  wordTimer=setTimeout(()=>{if(waves&&word!==wordShown){wordShown=word;waves.retype(word)}},delay);
 };
 scaleButtons.forEach(button=>{
  const word=button.dataset.word||button.querySelector('span')?.textContent.trim()||'';
  if(!word)return;
  button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')showWord(word,0)});
  button.addEventListener('focus',()=>showWord(word,0));
 });
 scaleMap?.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')showWord('ALOBI',160)});
 scaleMap?.addEventListener('focusout',event=>{if(!scaleMap.contains(event.relatedTarget))showWord('ALOBI',200)});
 if(skip)mountWaves();else setTimeout(mountWaves,(returningHome?.72:3.41-T0/motionRate)*1000);
 let w=0,h=0,full=0,raf=0,start=performance.now()-(returningHome?(4.28-S2)/motionRate*1000:T0/motionRate*1000),visible=true,finished=false,scrollProgress=0;
 let px=.5,py=.5,mx=.5,my=.5,cursorX=innerWidth*.5,cursorY=innerHeight*.5,pointerKnown=false;
 // Start the arrival cursor where the mouse really is (remembered from the
 // last page by spectacle.js); with nothing remembered it waits, hidden,
 // for the first movement instead of sitting in the middle of the screen.
 try{const saved=JSON.parse(sessionStorage.getItem('alobi-pointer')||'null');if(saved&&Number.isFinite(saved.x)&&Number.isFinite(saved.y)){const sx=saved.w?innerWidth/saved.w:1,sy=saved.h?innerHeight/saved.h:1;cursorX=saved.x*sx;cursorY=saved.y*sy;pointerKnown=true}}catch{}
 addEventListener('pointermove',e=>{cursorX=e.clientX;cursorY=e.clientY;pointerKnown=true},{passive:true});
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
 try{document.fonts?.load('500 64px "DM Mono"').then(()=>wake())}catch{}
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
  const markAlpha=ease((t-T0)/.3);
  const cornerGrow=kinetic((t-.12)/.82),cornerFade=1-ease((t-2.12+S1)/.44);
  const cornerSize=3*scale*cornerGrow;
  ctx.globalAlpha=markAlpha*cornerFade*.9;ctx.fillStyle='#1d1d1f';
  const corners=[[zL,yT],[zR,yT],[zL,yB],[zR,yB],[hL,yT],[hR,yT],[hL,yM],[hR,yM],[hL,yB],[hR,yB]];
  corners.forEach(([cx,cy])=>ctx.fillRect(cx-cornerSize*.5,yy(cy)-cornerSize*.5,cornerSize,cornerSize));
  // The mark itself: the same ZH as the logo in the header (DM Mono), set
  // as one solid word rather than built from separate strokes.
  ctx.globalAlpha=markAlpha;ctx.fillStyle='#1d1d1f';
  ctx.font=`500 ${Math.round(64*scale)}px "DM Mono", ui-monospace, monospace`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('ZH',x,yy(y)+2*scale);
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
   if(arrivalCursor){
    arrivalCursor.style.setProperty('--arrival-cursor-x',`${cursorX}px`);
    arrivalCursor.style.setProperty('--arrival-cursor-y',`${shownCursorY}px`);
    arrivalCursor.style.setProperty('--arrival-cursor-opacity',pointerKnown?String(ease((cursorRise-.04)/.22)):'0');
   }
  const paper=Math.round(mix(255,245,ease((t-5.12+S2)/1.3)));
  ctx.fillStyle=`rgb(${paper},${paper},${Math.min(255,paper+2)})`;ctx.fillRect(0,0,w,h);
  const fold=kinetic((t-4.3+S2)/1.18),rise=kinetic((t-4.3+S2)/1.18),drop=kinetic((t-5.54+S3)/1.16);
  const reveal=kinetic((t-5.4+S3)/1.58),roll=kinetic((t-5.82+S3)/.98),details=kinetic((t-6.02+S3)/.86);
  const dividerY=full*(w<700?.78:.82),sweepY=full+(dividerY-full)*rise+(full-dividerY)*drop; // the drop starts just before the rise ends: one bounce
  hero.style.setProperty('--bar-opacity',String(ease((t-5.44+S2)/.16)));
  hero.style.setProperty('--sweep-y',`${sweepY}px`);
  hero.style.setProperty('--sweep-opacity',String(t>4.26-S2&&drop<1?1:0));
  hero.style.setProperty('--sweep-weight',`${4.6+Math.sin(Math.PI*(rise<1?rise:drop))*1.9}px`);
  hero.style.setProperty('--roll',String(roll));hero.style.setProperty('--details',String(details));
  const fieldElapsed=Math.max(0,(t-5.62+S3)*1000);
  hero.style.setProperty('--field-opacity',String(ease((t-5.6+S3)/.14)));
  if(wavesRoot){
   // ALOBI starts tracing once the field is about 60% risen, not fully.
   if(fieldElapsed>=1060)playExtrude();
   if(fieldElapsed>=1770){wavesRoot.style.clipPath='none'}
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
  if(!returningHome&&t<5.52-S2)drawMark(t,fold);
  if(t>=7.48-S3&&!finished){finished=true;document.body.classList.add('arrival-done','is-ready');status.textContent='Portfolio ready'}
  if(!reduced&&!finished)raf=requestAnimationFrame(render);
 }
 function wake(){if(!raf)raf=requestAnimationFrame(render)}
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();cursorX=e.clientX;cursorY=e.clientY;px=e.clientX/w;py=(e.clientY-r.top)/h;if(e.clientY<r.top+r.height*(w<700?.58:.62))aimField(e.clientX,e.clientY)},{passive:true});
 hero.addEventListener('pointerleave',()=>{px=.5;py=.5;targetFieldX=500;targetFieldY=255;if(!fieldRaf)fieldRaf=requestAnimationFrame(animateField)});
 // Once the opening has finished the drawing no longer changes with scroll,
 // so there is nothing to redraw.
 addEventListener('scroll',()=>{scrollProgress=clamp(scrollY/(Math.max(1,hero.offsetHeight)*.48));if(!finished)wake()},{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake()}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake()});
 addEventListener('resize',resize);resize();
 // Restored from the browser's page cache (Back button): the page comes back
 // exactly as it was left, so replay the return: the field rises again at the
 // top of the page, or further down a sheet of paper lifts off the page.
 function replayReturn(){
  skip=false;returningHome=true;finished=false;
  start=performance.now()-(4.28-S2)/motionRate*1000;
  document.body.classList.remove('arrival-done','is-ready');
  if(wavesRoot)wavesRoot.style.clipPath='polygon(0 100%,100% 100%,100% 100%,0 100%)';
  hero.style.setProperty('--field-opacity','0');hero.style.setProperty('--details','0');
  cancelAnimationFrame(raf);raf=0;wake();
  setTimeout(()=>document.body.classList.add('arrival-done','is-ready'),3400);
 }
 function liftSheet(){
  const sheet=document.createElement('div');sheet.className='return-sheet';sheet.setAttribute('aria-hidden','true');
  document.body.append(sheet);
  sheet.animate([{transform:'translateY(0)'},{transform:'translateY(-101%)'}],{duration:820,delay:80,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'}).finished.then(()=>sheet.remove(),()=>sheet.remove());
 }
 addEventListener('pageshow',event=>{
  // Oct 5: restored from the page cache, the page stays exactly as it was
  // left; the opening is not replayed.
  if(!event.persisted||reduced)return;
  void replayReturn;void liftSheet;
 });
 // Never leave navigation hidden if the browser suspends the opening frames.
 setTimeout(()=>document.body.classList.add('arrival-done','is-ready'),(8.5-S3-T0)*1000/motionRate);
}
