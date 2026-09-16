const hero = document.querySelector('.continuous-hero');
if (hero) {
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
 let w=0,h=0,full=0,raf=0,start=performance.now()-(returningHome?4.28*1000:0),visible=true,finished=false;
 let px=.5,py=.5,mx=.5,my=.5,cursorX=innerWidth*.5,cursorY=innerHeight*.5;
 function resize(){w=hero.clientWidth;full=hero.clientHeight;h=full;const d=Math.min(devicePixelRatio||1,1.25);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);wake()}
 function stroke(x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
 function drawMark(t,fold){
  const scale=w<700?.82:1,x=w/2,y=full*.43,halfH=32*scale;
  const top=y-halfH,squash=1-fold;
  const yy=value=>top+(value-top)*squash;
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
  const markAlpha=1-ease((fold-.82)/.18);
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
 }
 function render(now){
  raf=0;if(document.hidden||!visible)return;
  const t=skip?8:(now-start)/1000;
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
  const dividerY=full*(w<700?.58:.62),sweepY=rise<1?full+(dividerY-full)*rise:dividerY+(full-dividerY)*drop;
  hero.style.setProperty('--bar-opacity',String(ease((t-5.44)/.16)));
  hero.style.setProperty('--sweep-y',`${sweepY}px`);
  hero.style.setProperty('--sweep-opacity',String(t>4.26&&drop<1?1:0));
  hero.style.setProperty('--sweep-weight',`${4.6+Math.sin(Math.PI*(rise<1?rise:drop))*1.9}px`);
  hero.style.setProperty('--roll',String(roll));hero.style.setProperty('--details',String(details));
  if(reveal>0){
   ctx.strokeStyle='rgba(29,29,31,.26)';ctx.lineWidth=.7;
   const fieldH=dividerY,count=w<700?48:95;
    for(let i=0;i<=count;i++){
    const u=i/count,edge=Math.abs(u-.5)*2;
    const growth=ease((reveal-(1-edge)*.36)/.64);
    const top=fieldH*(1-growth);ctx.beginPath();
    for(let y=fieldH;y>=top;y-=8){const v=y/fieldH;const bend=Math.sin(v*7+u*12+now*.00028)*30+Math.sin(v*14-u*7+now*.00021)*18+Math.sin(v*22+u*5+now*.00015)*8;const magnet=Math.exp(-((u-mx)**2*28+(v-my)**2*5))*(mx-.5)*90;const x=u*w+(bend+magnet)*Math.sin(v*Math.PI);if(y===fieldH)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
   }
  }
  if(!returningHome&&t<5.52)drawMark(t,fold);
  if(t>=7.18&&!finished){finished=true;document.body.classList.add('arrival-done','is-ready');status.textContent='Portfolio ready'}
  if(!reduced)raf=requestAnimationFrame(render);
 }
 function wake(){if(!raf)raf=requestAnimationFrame(render)}
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();cursorX=e.clientX;cursorY=e.clientY;px=e.clientX/w;py=(e.clientY-r.top)/h},{passive:true});
 hero.addEventListener('pointerleave',()=>{px=.5;py=.5});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake()}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake()});
 addEventListener('resize',resize);resize();
 // Never leave navigation hidden if the browser suspends the opening frames.
 setTimeout(()=>document.body.classList.add('arrival-done','is-ready'),8500);
}
