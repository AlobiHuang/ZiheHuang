import { drawSharedPortal, drawRoomLines, portalStyle } from './me-portal.js?v=20261002-door-23';
const gallery=document.querySelector('.walk-gallery');
if(gallery){
 const world=gallery.querySelector('.walk-world');
 // The two product design projects, then the architecture projects in the
 // same order as the ARCH page (category.js). Each frame opens that project's page.
 //
 // Every frame's picture window is 16:9, ready for screen recordings. A frame
 // can play a video instead of a still: video:'file.mp4' (the image, if
 // given, is its poster). Website projects also get web:true and
 // desc:'...': held under the pointer, their frame keeps the 16:9 video as it
 // is at the top and grows downward to show the description underneath,
 // instead of stretching the picture.
 // kind: the small word on the wall beside each frame (Product, Brand,
 // Competition, Project ...). Change it freely.
 const works=[
  // Product design, newest work first.
  {title:'CMUsed',kind:'Product',meta:'2026 · PRODUCT DESIGN',lens:'PD',field:'PRODUCT DESIGN',href:'hci/cmused/',src:'assets/pd/cmused-home.webp?v=3',web:true,desc:'A second-hand marketplace for the Carnegie Mellon community. Browse by category, contact sellers directly, and list an item in three short steps, with AI help writing the description.'},
  {title:'OpenGym',kind:'Product',meta:'2026 · PRODUCT DESIGN',lens:'PD',field:'PRODUCT DESIGN',href:'hci/opengym/',src:'assets/pd/opengym-home.webp?v=2',web:true,desc:'Live occupancy for Carnegie Mellon\'s gyms. OpenGym already existed; I\'m redesigning its user flow, interface and product logic together with the hardware team behind its live counts.'},
  {slug:'re-serv-oir',title:'RE.SERV.OIR',kind:'Competition winner',meta:'2026 · DESIGN STUDIO',image:'reservoir-exterior.webp',note:['Winner:','AIA COTE Top Ten, one of two Foundation Level winners']},
  {title:'Sankofa Bamboo Greenhouse',kind:'Project',meta:'2023—PRESENT · LEADERSHIP',lens:'PM',field:'LEADERSHIP',href:'project/?lens=pm&project=sankofa-multi-stakeholder-delivery',image:'sankofa-overview-wide.webp'},
  {slug:'how-to-build-a-ruin',title:'How to Build a Ruin',kind:'Project',meta:'2026 · OPTION STUDIO',image:'ruin-hero-cover.jpg'},
  {slug:'convergence-environmental-middle-school',title:'Convergence',kind:'Project',meta:'2025 FALL · STUDIO PROJECT',image:'convergence-pdf-02.jpg'},
  {slug:'radical-empathy',title:'Radical Empathy',kind:'Project',meta:'2025 SPRING · STUDIO PROJECT',image:'radical-empathy-cover.jpg'},
  // (The Tinkerer's Imaginarium is left out here; it stays on the ARCH page.)
  {slug:'call-of-the-sea',title:'Call of the Sea',kind:'Project',meta:'2026—PRESENT · IN PROGRESS',image:null}
 ];
 works.forEach((work,i)=>{
  const panel=document.createElement('a');panel.className='walk-panel';
  panel.href=work.href||`project/?lens=architecture&project=${work.slug}`;
  panel.setAttribute('aria-label',`Open the ${work.title} project`);
  const number=String(i+1).padStart(2,'0');
  const visual=work.video
   ?`<video src="assets/portfolio/${work.video}"${work.image?` poster="assets/portfolio/${work.image}"`:''} muted loop playsinline autoplay preload="metadata"></video>`
   :(work.src||work.image)
   ?`<img src="${work.src||`assets/portfolio/${work.image}`}" alt="" loading="lazy" decoding="async">`
   :'<div class="walk-progress-cover" aria-hidden="true"><small>ONGOING / 2026</small><strong>IN<br>PROGRESS</strong><em>TOROSIAJE · INDONESIA</em></div>';
  panel.innerHTML=`<header><div><small>${work.lens||'ARCH'} / ${work.meta}</small><h2>${number}</h2></div><h3>${work.title}</h3></header><div class="walk-placeholder">${visual}</div>${work.web&&work.desc?`<div class="walk-desc"><p>${work.desc}</p></div>`:''}${work.note?`<p class="walk-note"><b>${work.note[0]}</b> ${work.note[1]}</p>`:''}<footer><span>${work.field||'ARCHITECTURE'} / ${number}</span><span>VIEW PROJECT →</span></footer>`;
  if(work.web)panel.classList.add('walk-web');
  if(work.note)panel.classList.add('has-note');
  world.append(panel);
 });
 const panels=[...world.children],canvas=gallery.querySelector('.walk-space'),ctx=canvas.getContext('2d');
 // The room's back wall: a large WORK lettered on it, and beside each frame a
 // small note of what kind of work it is. They live in the same space as the
 // frames, so they move with them (and show, small, through the door).
 const wallWord=document.createElement('div');
 wallWord.className='walk-wall-word';wallWord.setAttribute('aria-hidden','true');wallWord.textContent='WORK';
 world.prepend(wallWord);
 const kindTags=panels.map((panel,i)=>{const tag=document.createElement('span');tag.className='walk-kind';tag.setAttribute('aria-hidden','true');tag.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b>${works[i]?.kind||''}`;world.insertBefore(tag,panels[0]);return tag});
 let wallWordWidth=0;
 const WALL_REPEAT=16;
 // Opening a project: no zoom. The project page slides up over this one
 // (the site's usual page change, page-flow.css), the same movement as the
 // slide back down on the way out. Remember where we are, so the browser's
 // Back button returns here (app.js). The earlier zoom-in version is kept in
 // archive/walk-gallery-zoom-open.js.
 let opening=false;
 function openProject(panel){
  if(opening)return;opening=true;
  try{sessionStorage.setItem('alobi-return-scroll',JSON.stringify({y:scrollY,at:Date.now()}))}catch{}
  location.assign(panel.href);
 }
 // Back from the project (restored from the page cache): frames work again.
 addEventListener('pageshow',event=>{if(event.persisted)opening=false});
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
 // walk carries on through the turn, so the last frame swings from sliding left to
 // drifting up and out. The vertical room then runs empty for a moment before
 // the ME room's reading strip rises in, and the room becomes the ME room.
 // Two more frames, a little more walk: 6.45 screens for six frames, plus
 // about half a screen for each frame after that (the section's height is set
 // to match below).
 // PAIRS: how many pair-steps the camera takes before the last frame is centred
 // (half a step more when the number of frames is odd).
 const COUNT=panels.length,LAST=COUNT-1,PAIRS=Math.max(1,(LAST-1)/2);
 const RANGE=6.45+Math.max(0,COUNT-6)*.46;
 gallery.style.height=`${((RANGE+1)*100).toFixed(1)}svh`;
 // WORK's letters settle about 1.4 screens in; the room and the walk follow
 // straight after, with no still stretch in between.
 const WALK_FROM=1.45;      // WORK has slid away and the walk begins
 const TURN=1.1;            // screens of scroll for the quarter turn
 const AFTER=.35;           // screens of empty vertical room after the turn
 const TURN_AT=RANGE-TURN-AFTER; // the turn begins with 06 centred
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 let stageTop=0;
 // The doorway: its progress follows the scroll with a short glide, so even a
 // fast flick plays every in-between frame instead of jumping.
 const DOOR=portalStyle()==='door';
 let doorShown=-1,doorTime=0,doorGliding=false,doorFrames=null;
 // Scroll brake through the doorway: the wheel moves the page at a fraction of
 // its usual distance, so the door opens and the camera flies in at a pace
 // you can follow.
 const DOOR_BRAKE=.72;
 // "Selected work ↓" in the intro: glide down to the WORK door instead of
 // jumping there.
 document.querySelectorAll('a[href="#walk-gallery"]').forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  const to=gallery.getBoundingClientRect().top+scrollY;
  if(reduced.matches){scrollTo({top:to,behavior:'instant'});return}
  window.siteScroll?.stop?.();
  const from=scrollY,dist=to-from,duration=Math.min(1600,Math.max(1100,Math.abs(dist)*.9)),start=performance.now();
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  let cancelled=false;const cancel=()=>{cancelled=true};
  addEventListener('wheel',cancel,{once:true,passive:true});addEventListener('touchstart',cancel,{once:true,passive:true});
  const step=now=>{
   if(cancelled)return;
   const t=Math.min(1,(now-start)/duration);
   scrollTo({top:from+dist*ease(t),behavior:'instant'});
   if(t<1)requestAnimationFrame(step);else{removeEventListener('wheel',cancel);removeEventListener('touchstart',cancel)}
  };
  requestAnimationFrame(step);
 }));
 if(DOOR)addEventListener('wheel',event=>{
  if(reduced.matches||event.defaultPrevented||event.ctrlKey||event.shiftKey||!window.siteScroll||!event.cancelable)return;
  if(Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  const rect=gallery.getBoundingClientRect(),range=Math.max(1,gallery.offsetHeight-innerHeight);
  const at=(-rect.top/range)*RANGE; // screens into the walk
  const dy=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  // Inside the doorway, or about to enter it (scrolling down from just above,
  // or back up from just past it).
  const inside=rect.top<=innerHeight*.02&&at<WALK_FROM+.02;
  const entering=dy>0&&rect.top>0&&rect.top<innerHeight*.02;
  const returning=dy<0&&at>=WALK_FROM&&at<WALK_FROM+.08;
  if(!inside&&!entering&&!returning)return;
  event.preventDefault();
  window.siteScroll.scrollTo(window.siteScroll.target+dy*DOOR_BRAKE);
 },{passive:false});
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
  const mobile=w<701,halfWidth=mobile?200:460,halfHeight=mobile?215:343; // frames sized so the picture window is 16:10, a laptop screen (1512:945), with even 40px edges
  const scale=Math.min(w*(mobile?.43:.4)/(halfWidth*2),h*(mobile?.32:.42)/(halfHeight*2));
  const spacing=halfWidth*2+(mobile?70:120);
  // WORK slides away and the walk passes all the frames at one constant
  // on-screen speed, set so the last one is centred when the turn starts. Through the
  // turn the walk slows down evenly, just enough for 06 to drift out past
  // the top edge as the turn finishes.
  const frameStep=spacing*scale;
  const turnDistance=w+(LAST-.5)*frameStep;
  // With the doorway nothing has to slide away first, so the walk starts
  // with 01 already in view at the right instead of a screen of empty room.
  const lead=DOOR?w:0; // 01 and 02 centred, as seen through the door
  const speed=(turnDistance-lead)/((TURN_AT-WALK_FROM)*h); // on-screen px per px of scroll
  const turnScroll=TURN*h,outDistance=(h/2+halfWidth*scale+30)*1.05;
  const endSpeed=Math.max(.12,2*outDistance/turnScroll-speed);
  const since=Math.max(0,screens-TURN_AT)*h,during=Math.min(since,turnScroll);
  const walked=since>0
   ?turnDistance+speed*during+(endSpeed-speed)*during*during/(2*turnScroll)+(since-during)*endSpeed
   :lead+Math.max(0,screens-WALK_FROM)/(TURN_AT-WALK_FROM)*(turnDistance-lead);
  const slide=clamp(walked/w);
  const sliding=slide<1;
  const travel=Math.min(PAIRS,Math.max(0,walked-w)/(2*frameStep));
  const beyond=Math.max(0,walked-w-(LAST-1)*frameStep); // on-screen distance walked after the last frame is centred
  const angle=turn*Math.PI/2;
  portal.style.opacity=1;
  if(portalStyle()==='door'){
   // The doorway: the camera flies through it into this room, which the door
   // already shows through its opening; once through, the two pictures are the
   // same, so the doorway simply gives way (no slide).
   const target=clamp(screens/WALK_FROM),nowDoor=performance.now();
   // Jumps from far away (a link, the Back button) land at once.
   if(doorShown<0||Math.abs(target-doorShown)>.6||(target>=1&&screens>WALK_FROM+.4))doorShown=target;
   else{
    const ddt=Math.min(.05,Math.max(.001,(nowDoor-(doorTime||nowDoor-16))/1000));
    doorShown+=(target-doorShown)*(1-Math.exp(-ddt/.14));
    if(Math.abs(target-doorShown)<.0015)doorShown=target;
   }
   doorTime=nowDoor;doorGliding=doorShown!==target;
   const through=doorShown<.999;
   portal.style.transform='none';
   portal.style.visibility=through?'visible':'hidden';
   const seen=through?drawSharedPortal(portal,doorShown,'WORK',{behind:{turn:0,scroll:roomScroll}}):null;
   // Through the opening the first two frames are already there, small and
   // far away; they reach full size exactly as you pass through.
   if(seen&&seen.view){
    const fit=Math.max(.02,seen.frameScale);
    const v=seen.view,mx=w/2,my=h/2,local=(value,centre)=>centre+(value-centre)/fit;
    const width=Math.max(0,v.right-v.left);
    doorFrames={transform:`scale(${fit})`,clip:width<1?'inset(50%)':`inset(${Math.max(0,local(v.top,my)).toFixed(1)}px ${Math.max(0,w-local(v.right,mx)).toFixed(1)}px ${Math.max(0,h-local(v.bottom,my)).toFixed(1)}px ${Math.max(0,local(v.left,mx)).toFixed(1)}px)`};
   }else doorFrames=null;
  }else{
   portal.style.transform=sliding?`translate3d(${-slide*w}px,0,0)`:'none';
   portal.style.visibility=sliding?'visible':'hidden';
   if(sliding)drawSharedPortal(portal,entrance,'WORK');
  }
  world.style.transform=doorFrames?doorFrames.transform:`rotate(${turn*90}deg)`;
  world.style.clipPath=doorFrames?doorFrames.clip:'';
  world.style.zIndex=doorFrames?'6':'';
  world.style.pointerEvents=doorFrames?'none':'';
  world.style.opacity=doorFrames?1:roomReveal;
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
  const selected=Math.min(Math.ceil(PAIRS),Math.round(travel));
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
   const tallW=baseW*1.08;
   let tallH=Math.max(baseH,h*.82/scale);
   // A website frame grows only as far as its description needs.
   const desc=panel.classList.contains('walk-web')&&panel.querySelector('.walk-desc p');
   if(desc)tallH=Math.max(baseH,Math.min(tallH,(mobile?145:120)+(tallW-(mobile?56:80))*945/1512+26+desc.offsetHeight+80));
   const fw=baseW+(tallW-baseW)*e,fh=baseH+(tallH-baseH)*e;
   const cxp=left+baseW*scale/2,cyp=up+baseH*scale/2;
   const cyNow=cyp+(h/2-cyp)*e;
   const x0=cxp-fw*scale/2,y0=cyNow-fh*scale/2;
   if(e>0||panel.dataset.grown){panel.style.width=`${fw}px`;panel.style.height=`${fh}px`;if(e>0)panel.dataset.grown='1';else{delete panel.dataset.grown;panel.style.width='';panel.style.height=''}}
   panel.style.visibility=shown?'visible':'hidden';
   panel.style.transform=`translate3d(${x0}px,${y0}px,0) scale(${scale})`;
   panel.style.setProperty('--grow',e.toFixed(3));
   panel.style.opacity=DOOR?1:roomReveal;
   panel.style.zIndex=String(e>0?30:10-i);
   // Any frame on screen can be clicked; frames off screen are skipped by keyboard and screen readers.
   panel.inert=!shown;panel.setAttribute('aria-hidden',String(!shown));
  });
  // The lettering on the wall, centred on the first pair of frames, and the
  // kind notes: above the upper frames, below the lower ones.
  {
   // Sized so the word spans most of the screen at the start of the walk.
   // per100: the width of one WORK at a 100px font; the wall repeats it the
   // whole length of the walk (WORKWORKWORK...).
   if(!wallWord.dataset.per100){wallWord.textContent='WORK';wallWord.style.fontSize='100px';wallWord.dataset.per100=String(wallWord.offsetWidth/100||2.6);wallWord.textContent='WORK'.repeat(WALL_REPEAT)}
   const fontWorld=Math.min(w*(mobile?.96:.9),h*1.9)/scale/Number(wallWord.dataset.per100);
   if(wallWord.dataset.size!==String(Math.round(fontWorld))){wallWord.dataset.size=String(Math.round(fontWorld));wallWord.style.fontSize=`${fontWorld}px`;wallWordWidth=wallWord.offsetWidth}
   // The first WORK is centred on the first pair of frames; the rest follow.
   const centre=project(.5*spacing,0,wallZ),one=Number(wallWord.dataset.per100)*fontWorld*scale;
   const left=centre[0]-one/2;
   wallWord.style.transform=`translate3d(${left.toFixed(1)}px,${(centre[1]-fontWorld*.5*scale).toFixed(1)}px,0) scale(${scale})`;
   wallWord.style.visibility=left+wallWordWidth*scale>-50&&left<w+50?'visible':'hidden';
   // Hand the lettering's place on screen to the ME room (me-portal.js), which
   // carries it on, turned with the room, after this walk lets go: the world
   // is turned 90° about the screen's centre, so local x runs down the screen.
   const topY=centre[1]-fontWorld*.5*scale;
   window.alobiWorkWall={text:wallWord.textContent,font:fontWorld,scale,x:cx+cy-topY,y:cy+left-cx,speed:since>0?endSpeed:speed,at:Math.min(scrollY,scrollY+rect.top-top+walkRange),turned:turn>.999};
   kindTags.forEach((tag,i)=>{
    const x=i*spacing,up=i%2===0,rowY=(i%2?1:-1)*(halfHeight*.78);
    const [tx,ty]=project(x-halfWidth,up?rowY-halfHeight-(mobile?44:40):rowY+halfHeight+(mobile?14:12),wallZ);
    tag.style.transform=`translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${scale})`;
    tag.style.visibility=tx<w+100&&tx+halfWidth*2*scale>-100?'visible':'hidden';
   });
  }
  if(active!==selected){active=selected;const first=Math.min(selected*2+1,COUNT-1);count.textContent=`${String(first).padStart(2,'0')} — ${String(first+1).padStart(2,'0')} / ${String(COUNT).padStart(2,'0')}`;}
  gallery.style.setProperty('--walk-progress',p);
  if(growing||doorGliding)schedule();else doorTime=0;
 }
 function schedule(){if(!raf&&visible&&!reduced.matches)raf=requestAnimationFrame(render)}
 function setup(){gallery.classList.toggle('walk-static',reduced.matches);panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden')});resize()}
 function setAxis(axis){const root=document.documentElement;if((root.dataset.roomWalk||'')===axis)return;if(axis)root.dataset.roomWalk=axis;else delete root.dataset.roomWalk}
 new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(!visible)setAxis('');schedule()},{rootMargin:'200px'}).observe(gallery);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule()});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});addEventListener('pageshow',schedule);reduced.addEventListener('change',setup);setup();
}
