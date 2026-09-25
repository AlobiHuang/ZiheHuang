import { drawSharedPortal, drawRoomLines } from './me-portal.js?v=20260923-cursor-room-1';
const gallery=document.querySelector('.walk-gallery');
if(gallery){
 const world=gallery.querySelector('.walk-world');
 // The six architecture projects, in the same order as the ARCH page
 // (category.js). Each frame opens that project's page.
 const works=[
  {slug:'re-serv-oir',title:'RE.SERV.OIR',meta:'2026 · DESIGN STUDIO',image:'reservoir-exterior.png'},
  {slug:'how-to-build-a-ruin',title:'How to Build a Ruin',meta:'2026 · OPTION STUDIO',image:'ruin-hero-cover.jpg'},
  {slug:'convergence-environmental-middle-school',title:'Convergence',meta:'2025 FALL · STUDIO PROJECT',image:'convergence-pdf-02.jpg'},
  {slug:'radical-empathy',title:'Radical Empathy',meta:'2025 SPRING · STUDIO PROJECT',image:'radical-empathy-cover.jpg'},
  {slug:'the-tinkerers-imaginarium',title:"The Tinkerer's Imaginarium",meta:'2025 SPRING · STUDIO PROJECT',image:'tinkerers-site-model-cover.jpg'},
  {slug:'call-of-the-sea',title:'Call of the Sea',meta:'2026—PRESENT · IN PROGRESS',image:null}
 ];
 works.forEach((work,i)=>{
  const panel=document.createElement('a');panel.className='walk-panel';
  panel.href=`project/?lens=architecture&project=${work.slug}`;
  panel.setAttribute('aria-label',`Open the ${work.title} project`);
  const number=String(i+1).padStart(2,'0');
  const visual=work.image
   ?`<img src="assets/portfolio/${work.image}" alt="" loading="lazy" decoding="async">`
   :'<div class="walk-progress-cover" aria-hidden="true"><small>ONGOING / 2026</small><strong>IN<br>PROGRESS</strong><em>TOROSIAJE · INDONESIA</em></div>';
  panel.innerHTML=`<header><div><small>ARCH / ${work.meta}</small><h2>${number}</h2></div><h3>${work.title}</h3></header><div class="walk-placeholder">${visual}</div><footer><span>ARCHITECTURE / ${number}</span><span>VIEW PROJECT →</span></footer>`;
  world.append(panel);
 });
 const panels=[...world.children],canvas=gallery.querySelector('.walk-space'),ctx=canvas.getContext('2d');
 // Opening a project: remember where we are (so the browser's Back button
 // returns here, see app.js), then lift the frame's picture out of the room
 // and grow it to fill the screen while the room fades to paper. The project
 // page opens on that same full-screen picture (project/zoom-arrive.js) and
 // settles it into place, so the two pages read as one movement.
 let opening=false;
 function openProject(panel){
  if(opening)return;
  const at=scrollY;
  try{sessionStorage.setItem('alobi-return-scroll',JSON.stringify({y:at,at:Date.now()}))}catch{}
  const href=panel.href;
  if(reduced.matches){location.assign(href);return}
  // Hold the room still while the picture lifts out: no hover growing or
  // shrinking underneath, no glide still carrying the page along.
  opening=true;window.siteScroll?.stop?.();
  const source=panel.querySelector('.walk-placeholder');
  const from=source.getBoundingClientRect();
  const layer=document.createElement('div');layer.className='walk-zoom';layer.setAttribute('aria-hidden','true');
  const veil=document.createElement('div');veil.className='walk-zoom-veil';
  const box=document.createElement('div');box.className='walk-zoom-box';
  const original=source.firstElementChild;
  const visual=original?.cloneNode(true);
  // The copy starts exactly as the frame's picture looks right now (in colour
  // and slightly enlarged while hovered, grey otherwise), so nothing jumps.
  let startFilter='grayscale(1)',startTransform='none';
  if(original?.tagName==='IMG'){const cs=getComputedStyle(original);startFilter=cs.filter&&cs.filter!=='none'?cs.filter:'grayscale(0)';startTransform=cs.transform||'none'}
  if(visual){visual.removeAttribute('loading');visual.style.transition='none';visual.style.filter=startFilter;visual.style.transform=startTransform;box.append(visual)}
  layer.append(veil,box);document.body.append(layer);
  const ease='cubic-bezier(.76,0,.2,1)',duration=900;
  // A small lift first (the frame comes forward), then the long grow.
  const grow=box.animate([
   {left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,boxShadow:'0 0 0 .75px #180400, 0 0 0 rgba(0,0,0,0)',offset:0},
   {left:`${from.left-6}px`,top:`${from.top-8}px`,width:`${from.width+12}px`,height:`${from.height+12}px`,boxShadow:'0 0 0 .75px #180400, 0 24px 60px -24px rgba(0,0,0,.35)',offset:.16},
   {left:'0px',top:'0px',width:`${innerWidth}px`,height:`${innerHeight}px`,boxShadow:'0 0 0 0 #180400, 0 0 0 rgba(0,0,0,0)',offset:1}
  ],{duration,easing:ease,fill:'forwards'});
  veil.animate([{opacity:0},{opacity:1}],{duration:duration*.7,delay:120,easing:'ease-out',fill:'forwards'});
  visual?.animate([{filter:startFilter,transform:startTransform==='none'?'scale(1)':startTransform},{filter:'grayscale(0)',transform:'scale(1)'}],{duration,easing:ease,fill:'forwards'});
  const image=visual?.tagName==='IMG'?visual.currentSrc||visual.src:'';
  let gone=false;const go=()=>{
   if(gone)return;gone=true;
   try{
    sessionStorage.setItem('alobi-zoom-hand',JSON.stringify({src:image,at:Date.now()}));
    // For the way back: which frame, its picture and the exact scroll spot
    // (see zoomBack below).
    sessionStorage.setItem('alobi-zoom-return',JSON.stringify({index:panels.indexOf(panel),src:image,y:at,at:Date.now()}));
   }catch{}
   location.assign(href);
  };
  // Without a picture (the project in progress) the frame gives way to paper.
  const settle=image?grow.finished:grow.finished.then(()=>box.animate([{opacity:1},{opacity:0}],{duration:260,fill:'forwards'}).finished);
  settle.then(go,go);
  setTimeout(go,duration+800);
 }
 panels.forEach(panel=>panel.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();openProject(panel);
 }));
 // Coming back with the browser's Back button: the opening in reverse. The
 // project's picture, still filling the screen, shrinks back into its frame
 // while the room reappears around it. (A fresh load paints that picture
 // first, from route-entry.js, so nothing flashes before this runs.)
 const readReturn=()=>{try{const r=JSON.parse(sessionStorage.getItem('alobi-zoom-return')||'null');return r&&Date.now()-r.at<3600000?r:null}catch{return null}};
 const clearReturn=()=>{try{sessionStorage.removeItem('alobi-zoom-return');sessionStorage.removeItem('alobi-return-scroll')}catch{}};
 const dropPrepaint=()=>document.documentElement.classList.remove('zoom-returning');
 // The way back is the way in, reversed. The project's picture rises over
 // the project page until it covers the screen (route-entry.js paints it and
 // page-flow.css rises it, so the pages switch underneath it with no blank
 // frame), then it shrinks into the frame it came from while the room
 // reappears around it, at the exact spot the visitor left.
 const backToSpot=record=>{
  if(!Number.isFinite(record?.y)||Math.abs(scrollY-record.y)<2)return;
  if(window.siteScroll)window.siteScroll.scrollTo(record.y,{immediate:true});else scrollTo({top:record.y,left:0,behavior:'instant'});
 };
 // Settles once the page handover is over (or at once without one).
 const handedOver=()=>Promise.race([window.alobiReveal||Promise.resolve(),new Promise(r=>setTimeout(r,2600))]);
 // The picture, full screen, as the layer the shrink runs on. It replaces the
 // painted picture only once it is ready to show, so nothing blinks.
 async function prepareBack(existing){
  const record=readReturn(),panel=record&&panels[record.index];
  if(!panel||reduced.matches){existing?.remove();dropPrepaint();clearReturn();opening=false;return null}
  backToSpot(record);
  // Every frame back to its resting size, and no hover until we have landed.
  opening=true;grow.forEach(g=>{clearTimeout(g.timer);g.target=0;g.value=0});lastFrame=0;schedule();
  let layer=existing,box,veil,visual;
  if(layer){box=layer.querySelector('.walk-zoom-box');veil=layer.querySelector('.walk-zoom-veil');visual=box?.firstElementChild;layer.getAnimations({subtree:true}).forEach(a=>a.cancel())}
  else{
   layer=document.createElement('div');layer.className='walk-zoom';layer.setAttribute('aria-hidden','true');
   veil=document.createElement('div');veil.className='walk-zoom-veil';
   box=document.createElement('div');box.className='walk-zoom-box';
   if(record.src){visual=new Image();visual.alt='';visual.src=record.src;box.append(visual);try{await visual.decode()}catch{}}
   else{visual=panel.querySelector('.walk-placeholder')?.firstElementChild?.cloneNode(true);if(visual)box.append(visual)}
   layer.append(veil,box);
  }
  if(visual){visual.style.transition='none';visual.style.filter='grayscale(0)';visual.style.transform='none'}
  Object.assign(box.style,{left:'0px',top:'0px',width:`${innerWidth}px`,height:`${innerHeight}px`,boxShadow:'0 0 0 .75px #180400',transform:'none'});
  if(veil)veil.style.opacity='1';
  if(!layer.isConnected)document.body.append(layer);
  requestAnimationFrame(dropPrepaint);
  return {layer,box,veil,visual,record,panel};
 }
 // Shrink the picture into its frame.
 function playBack(state){
  if(!state)return;
  const {layer,box,veil,visual,record,panel}=state;
  let finished=false;
  const finish=()=>{if(finished)return;finished=true;layer.remove();dropPrepaint();clearReturn();opening=false};
  const shrinkTime=900;
  setTimeout(finish,shrinkTime+3000);
  backToSpot(record);schedule();
  // Measure once the room has drawn itself at this spot.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   const to=panel.querySelector('.walk-placeholder').getBoundingClientRect();
   const onScreen=to.width>20&&to.right>0&&to.left<innerWidth&&to.bottom>0&&to.top<innerHeight;
   if(!onScreen){layer.animate([{opacity:1},{opacity:0}],{duration:600,easing:'ease-out',fill:'forwards'}).finished.then(finish,finish);return}
   const ease='cubic-bezier(.76,0,.2,1)';
   const shrink=box.animate([
    {left:'0px',top:'0px',width:`${innerWidth}px`,height:`${innerHeight}px`},
    {left:`${to.left}px`,top:`${to.top}px`,width:`${to.width}px`,height:`${to.height}px`}
   ],{duration:shrinkTime,easing:ease,fill:'forwards'});
   veil?.animate([{opacity:1},{opacity:0}],{duration:shrinkTime*.75,delay:shrinkTime*.2,easing:'ease-in-out',fill:'forwards'});
   visual?.animate([{filter:'grayscale(0)'},{filter:'grayscale(1)'}],{duration:shrinkTime,easing:ease,fill:'forwards'});
   shrink.finished.then(()=>layer.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'}).finished).then(finish,finish);
  }));
 }
 addEventListener('pageshow',event=>{
  const layer=document.querySelector('.walk-zoom');
  if(!event.persisted||!layer)return;
  // Restored from the page cache, still showing the full-screen picture:
  // let it rise over the project page, then shrink it.
  const ready=prepareBack(layer);
  handedOver().then(()=>ready).then(state=>setTimeout(()=>playBack(state),60));
 });
 if(performance.getEntriesByType?.('navigation')?.[0]?.type==='back_forward'&&readReturn()){
  // Fresh load: route-entry.js has painted the picture over the page. Once
  // it has risen over the project page and the room has loaded, shrink it.
  const loaded=new Promise(r=>{if(document.readyState==='complete')r();else{addEventListener('load',r,{once:true});setTimeout(r,1400)}});
  Promise.all([handedOver(),loaded]).then(()=>prepareBack(null)).then(state=>setTimeout(()=>playBack(state),60));
 }else{
  // Arrived any other way: an old way-back record no longer applies.
  if(performance.getEntriesByType?.('navigation')?.[0]?.type!=='back_forward')try{sessionStorage.removeItem('alobi-zoom-return')}catch{}
  dropPrepaint();
 }
 const stage=gallery.querySelector('.walk-stage'),count=gallery.querySelector('.walk-count');
 const room=document.querySelector('.me-room');
 const portal=gallery.querySelector('[data-work-portal]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false,raf=0,w=0,h=0,active=-1,lastFrame=0;
 // Hover: after half a second over a frame it grows (see render).
 const grow=panels.map(()=>({value:0,target:0,timer:0}));
 const canHover=matchMedia('(hover: hover) and (pointer: fine)');
 panels.forEach((panel,i)=>{
  const g=grow[i];
  panel.addEventListener('pointerenter',event=>{if(opening||event.pointerType==='touch'||!canHover.matches)return;clearTimeout(g.timer);g.timer=setTimeout(()=>{if(opening)return;g.target=1;lastFrame=0;schedule()},500)});
  panel.addEventListener('pointerleave',()=>{if(opening)return;clearTimeout(g.timer);if(g.target){g.target=0;lastFrame=0;schedule()}});
 });
 // The scene is laid out in screens of scrolling (this section is 745svh, so
 // 6.45 screens of travel): WORK opens and the walk passes the six frames.
 // With 06 in the middle of the screen the room turns a quarter, slowly; the
 // walk carries on through the turn, so 06 swings from sliding left to
 // drifting up and out. The vertical room then runs empty for a moment before
 // the ME room's reading strip rises in, and the room becomes the ME room.
 const RANGE=6.45;          // screens of scroll through this section (745svh)
 // WORK's letters settle about 1.4 screens in; the room and the walk follow
 // straight after, with no still stretch in between.
 const WALK_FROM=1.45;      // WORK has slid away and the walk begins
 const TURN=1.1;            // screens of scroll for the quarter turn
 const AFTER=.35;           // screens of empty vertical room after the turn
 const TURN_AT=RANGE-TURN-AFTER; // the turn begins with 06 centred
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 let stageTop=0;
 const label=gallery.querySelector('.walk-label'),caption=gallery.querySelector('.walk-caption'),progressBar=gallery.querySelector('.walk-progress');
 function resize(){stageTop=parseFloat(getComputedStyle(stage).top)||0;w=stage.clientWidth;h=stage.clientHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);schedule()}
 function render(){
  raf=0;if(!visible||reduced.matches)return;
  const rect=gallery.getBoundingClientRect(),top=stageTop;
  const walkRange=Math.max(1,gallery.offsetHeight-h);
  // Everything is scrubbed directly by the scroll position, so it can be paused
  // anywhere; the glide comes from the site-wide scroller (smooth-scroll.js).
  const p=clamp((top-rect.top)/walkRange);
  const screens=p*RANGE;
  const entrance=clamp(screens/1.7043);
  const roomReveal=smooth((screens-1.3)/.1425);
  const turn=smooth((screens-TURN_AT)/TURN);
  // Tell the cursor which way this room runs (cursor-shape.js): sideways
  // while the walk travels sideways, up and down once the room has turned.
  const pinned=rect.top<=0&&rect.bottom>=h-1;
  setAxis(!pinned?'':screens>1.3&&turn<.5?'x':turn>=.5?'y':'');
  // The room's lines are measured from the ME room, which pins in exactly as
  // this section lets go, so they drift at the same rate before, during and
  // after the turn and line up with the ME room's own drawing at the handover.
  const roomScroll=room?-room.getBoundingClientRect().top:0;
  const mobile=w<701,halfWidth=mobile?200:380,halfHeight=mobile?285:255;
  const scale=Math.min(w*(mobile?.43:.46)/(halfWidth*2),h*(mobile?.32:.42)/(halfHeight*2));
  const spacing=halfWidth*2+(mobile?70:120);
  // WORK slides away and the walk passes all six frames at one constant
  // on-screen speed, set so 06 is centred when the turn starts. Through the
  // turn the walk slows down evenly, just enough for 06 to drift out past
  // the top edge as the turn finishes.
  const frameStep=spacing*scale;
  const turnDistance=w+4.5*frameStep;
  const speed=turnDistance/((TURN_AT-WALK_FROM)*h); // on-screen px per px of scroll
  const turnScroll=TURN*h,outDistance=(h/2+halfWidth*scale+30)*1.05;
  const endSpeed=Math.max(.12,2*outDistance/turnScroll-speed);
  const since=Math.max(0,screens-TURN_AT)*h,during=Math.min(since,turnScroll);
  const walked=since>0
   ?turnDistance+speed*during+(endSpeed-speed)*during*during/(2*turnScroll)+(since-during)*endSpeed
   :Math.max(0,screens-WALK_FROM)/(TURN_AT-WALK_FROM)*turnDistance;
  const slide=clamp(walked/w);
  const sliding=slide<1;
  const travel=Math.min(2,Math.max(0,walked-w)/(2*frameStep));
  const beyond=Math.max(0,walked-w-4*frameStep); // on-screen distance walked after frame 06 is centred
  const angle=turn*Math.PI/2;
  portal.style.opacity=1;
  portal.style.transform=sliding?`translate3d(${-slide*w}px,0,0)`:'none';
  portal.style.visibility=sliding?'visible':'hidden';
  if(sliding)drawSharedPortal(portal,entrance,'WORK');
  world.style.transform=`rotate(${turn*90}deg)`;
  world.style.opacity=roomReveal;
  canvas.style.opacity=roomReveal;
  label.style.opacity=roomReveal*(1-turn);
  caption.style.opacity=roomReveal*(1-turn);
  progressBar.style.opacity=1-turn;
  const wallZ=1200;
  const focal=wallZ*scale,cx=w*.5,cy=h*.5;
  const cameraX=(travel*2+.5)*spacing+beyond/scale-(1-slide)*w/scale;
  const project=(x,y,z)=>{const s=focal/z;return [cx+(x-cameraX)*s,cy+y*s]};
  ctx.clearRect(0,0,w,h);
  ctx.save();
  // The ME room, rotated sideways; identical ink, stroke, divisions and 1.48 depth.
  const roomWidth=h+(w-h)*turn,roomHeight=w+(h-w)*turn;
  ctx.translate(w/2,h/2);ctx.rotate(-Math.PI/2+angle);ctx.translate(-roomWidth/2,-roomHeight/2);
  drawRoomLines(ctx,roomWidth,roomHeight,roomScroll);
  ctx.restore();
  const selected=Math.min(2,Math.round(travel));
  const now=performance.now(),dt=Math.min(.05,Math.max(.001,(now-(lastFrame||now))/1000));lastFrame=now;
  let growing=false;
  panels.forEach((panel,i)=>{
   const x=i*spacing;
   const rowY=(i%2?1:-1)*(halfHeight*.78);
   const [left,up]=project(x-halfWidth,rowY-halfHeight,wallZ);
   const shown=left<w+100&&left+halfWidth*2*scale>-100;
   // Held under the pointer for half a second, the frame stretches into a
   // tall portrait preview, centred on the screen's height.
   const g=grow[i];
   g.value+=(g.target-g.value)*(1-Math.exp(-dt/.16));
   if(Math.abs(g.target-g.value)<.002)g.value=g.target;else growing=true;
   const e=g.value*g.value*(3-2*g.value);
   const baseW=halfWidth*2,baseH=halfHeight*2;
   const tallH=Math.max(baseH,h*.82/scale),tallW=baseW*1.08;
   const fw=baseW+(tallW-baseW)*e,fh=baseH+(tallH-baseH)*e;
   const cxp=left+baseW*scale/2,cyp=up+baseH*scale/2;
   const cyNow=cyp+(h/2-cyp)*e;
   const x0=cxp-fw*scale/2,y0=cyNow-fh*scale/2;
   if(e>0||panel.dataset.grown){panel.style.width=`${fw}px`;panel.style.height=`${fh}px`;if(e>0)panel.dataset.grown='1';else{delete panel.dataset.grown;panel.style.width='';panel.style.height=''}}
   panel.style.visibility=shown?'visible':'hidden';
   panel.style.transform=`translate3d(${x0}px,${y0}px,0) scale(${scale})`;
   panel.style.opacity=roomReveal;
   panel.style.zIndex=String(e>0?30:10-i);
   // Any frame on screen can be clicked; frames off screen are skipped by keyboard and screen readers.
   panel.inert=!shown;panel.setAttribute('aria-hidden',String(!shown));
  });
  if(active!==selected){active=selected;count.textContent=`0${selected*2+1} — 0${selected*2+2} / 06`;}
  gallery.style.setProperty('--walk-progress',p);
  if(growing)schedule();
 }
 function schedule(){if(!raf&&visible&&!reduced.matches)raf=requestAnimationFrame(render)}
 function setup(){gallery.classList.toggle('walk-static',reduced.matches);panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden')});resize()}
 function setAxis(axis){const root=document.documentElement;if((root.dataset.roomWalk||'')===axis)return;if(axis)root.dataset.roomWalk=axis;else delete root.dataset.roomWalk}
 new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(!visible)setAxis('');schedule()},{rootMargin:'200px'}).observe(gallery);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule()});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});addEventListener('pageshow',schedule);reduced.addEventListener('change',setup);setup();
}
