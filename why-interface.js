(()=>{
  const root=document.querySelector('[data-why-interface]');
  const detail=document.querySelector('[data-why-detail]');
  if(!root||!detail)return;
  // Keep the fullscreen portrait outside transformed/pinned page sections.
  document.body.appendChild(detail);
  const welcomePage=root.querySelector('.why-welcome-page');
  const welcomeTrigger=root.querySelector('[data-why-enter]');
  const questionPage=root.querySelector('.why-metaball-page');
  const deck=root.querySelector('[data-why-orbit]');
  const metaStage=deck.querySelector('[data-meta-balls]');
  const items=[...root.querySelectorAll('[data-why-index]')];
  const typeTarget=root.querySelector('[data-why-type]');
  const detailImage=detail.querySelector('[data-why-detail-image]');
  const detailCount=detail.querySelector('[data-why-detail-count]');
  const detailLabel=detail.querySelector('[data-why-detail-label]');
  const detailKicker=detail.querySelector('[data-why-detail-kicker]');
  const detailTitle=detail.querySelector('[data-why-detail-title]');
  const detailText=detail.querySelector('[data-why-detail-text]');
  const wheelItems=[...detail.querySelectorAll('.why-option-wheel span')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const states=[
    {label:'WHO AM I?',title:'ALOBI.',kicker:'PERSON / PROCESS / PLACE',text:'I’m Zihe Huang—an architecture and HCI student who follows curiosity across physical and digital spaces.',color:'#d55336',image:'assets/who-am-i-character-v1.png',position:'50% 50%'},
    {label:'WHAT I DO?',title:'I DESIGN CONNECTIONS.',kicker:'ARCHITECTURE / HCI / AI',text:'I design places, interfaces, and systems around how people actually move, meet, and make decisions.',color:'#0879f9',image:'assets/portfolio/teaser-final-dark-foreground.webp',position:'50% 52%'},
    {label:"WHERE I'M FROM?",title:'BETWEEN PLACES.',kicker:'SHENZHEN / PITTSBURGH / BEYOND',text:'I’m from Shenzhen and now study in Pittsburgh. Travel keeps widening the way I understand place.',color:'#ff477e',image:'assets/personal-gallery/personal-35.jpg',position:'50% 54%'},
    {label:'WHAT I WORK ON?',title:'IDEAS MADE VISIBLE.',kicker:'COMMUNITY / SPACE / INTERACTION',text:'My projects move between community building, spatial research, digital products, and visual experiments.',color:'#ff5a36',image:'assets/portfolio/about-parallel-study.webp',position:'50% 48%'},
    {label:'WHAT I LIKE?',title:'MOVED BY CURIOSITY.',kicker:'MUSIC / TRAVEL / PEOPLE',text:'Music, movement, photography, food, and the people close to me keep life playful and my work grounded.',color:'#ffc83d',image:'assets/personal-gallery/personal-46.jpg',position:'50% 48%'}
  ];
  let active=-1,returnFocus=null,closeTimer=0,gateLocked=false,gateSettled=false,gateOpened=false,gateTargetY=0,lockedScrollY=0;
  const lockDocument=()=>{
    lockedScrollY=window.scrollY;
    document.documentElement.classList.add('why-detail-open');
    document.body.classList.add('why-detail-open');
    document.body.style.position='fixed';
    document.body.style.top=`-${lockedScrollY}px`;
    document.body.style.left='0';
    document.body.style.right='0';
    document.body.style.width='100%';
  };
  const unlockDocument=()=>{
    document.documentElement.classList.remove('why-detail-open');
    document.body.classList.remove('why-detail-open');
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.left='';
    document.body.style.right='';
    document.body.style.width='';
    const previousBehavior=document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior='auto';
    window.scrollTo({top:lockedScrollY,left:0,behavior:'auto'});
    document.documentElement.style.scrollBehavior=previousBehavior;
  };
  const setHover=index=>{
    active=index;if(index<0)deck.removeAttribute('data-active');else deck.dataset.active=String(index);
    items.forEach((item,i)=>{item.classList.toggle('is-hovered',i===index);item.setAttribute('aria-selected','false')});
  };
  deck.addEventListener('pointerenter',event=>{
    if(event.pointerType==='touch')return;
    deck.classList.add('has-pointer');
  });
  deck.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch')return;
    const hovered=event.target.closest('[data-why-index]');setHover(hovered?Number(hovered.dataset.whyIndex):-1);
  });
  deck.addEventListener('pointerleave',()=>{deck.classList.remove('has-pointer');setHover(-1)});
  const openDetail=(index,trigger)=>{
    const state=states[index],rect=trigger.getBoundingClientRect();returnFocus=trigger;clearTimeout(closeTimer);
    detail.style.setProperty('--why-detail-x',`${Math.max(0,Math.min(innerWidth,rect.left+rect.width/2))}px`);detail.style.setProperty('--why-detail-y',`${Math.max(0,Math.min(innerHeight,rect.top+rect.height/2))}px`);detail.style.setProperty('--why-detail-accent',state.color);
    detailImage.src=state.image;detailImage.style.objectPosition=state.position;detail.classList.remove('is-character');detailCount.textContent=`ANSWER / ${String(index+1).padStart(2,'0')}`;detailLabel.textContent=state.label;detailKicker.textContent=state.kicker;detailTitle.textContent=state.title;detailText.textContent=state.text;
    wheelItems.forEach((item,i)=>item.classList.toggle('is-current',i===index));
    lockDocument();detail.setAttribute('aria-hidden','false');detail.classList.remove('is-closing');
    requestAnimationFrame(()=>{detail.classList.add('is-open');setTimeout(()=>detail.focus({preventScroll:true}),reduced?0:720)});
  };
  const closeDetail=()=>{
    if(!detail.classList.contains('is-open'))return;
    detail.classList.add('is-closing');detail.classList.remove('is-open');
    closeTimer=setTimeout(()=>{detail.classList.remove('is-closing');detail.setAttribute('aria-hidden','true');unlockDocument();returnFocus?.focus({preventScroll:true})},reduced?0:520);
  };
  items.forEach((item,index)=>{item.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')setHover(index)});item.addEventListener('click',()=>openDetail(index,item))});
  deck.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const current=Math.max(0,items.indexOf(document.activeElement));const delta=event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1;items[(current+delta+items.length)%items.length].focus()});
  detail.addEventListener('click',closeDetail);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&detail.classList.contains('is-open'))closeDetail()});
  questionPage.addEventListener('pointermove',event=>{const rect=questionPage.getBoundingClientRect();questionPage.style.setProperty('--why-x',`${event.clientX-rect.left}px`);questionPage.style.setProperty('--why-y',`${event.clientY-rect.top}px`)});
  const typeLine=(line,prefix,speed,done)=>{let index=0;const tick=()=>{typeTarget.textContent=prefix+line.slice(0,index++);if(index<=line.length){setTimeout(tick,speed+Math.random()*18);return}done()};tick()};
  const typeGreeting=()=>{
    const first='Hi.',second='Welcome, stranger.',third='Any questions for me?';
    if(reduced){typeTarget.textContent=first+'\n'+second+'\n'+third;root.classList.add('is-typed');return}
    typeLine(first,'',40,()=>setTimeout(()=>typeLine(second,first+'\n',36,()=>setTimeout(()=>typeLine(third,first+'\n'+second+'\n',38,()=>root.classList.add('is-typed')),540)),500));
  };
  const animateGreetingPixels=()=>{
    if(reduced||!typeTarget)return;
    const rootRect=root.getBoundingClientRect(),textRect=typeTarget.getBoundingClientRect(),headingRect=typeTarget.closest('h2').getBoundingClientRect(),style=getComputedStyle(typeTarget);
    const width=Math.round(rootRect.width),height=Math.round(rootRect.height),sample=Math.max(3,Math.round(width/500)),stageRect=metaStage.getBoundingClientRect(),stageScaleX=stageRect.width/Math.max(1,metaStage.clientWidth),stageScaleY=stageRect.height/Math.max(1,metaStage.clientHeight),stageScale=Math.min(stageScaleX,stageScaleY),stageOffsetX=stageRect.left-rootRect.left,stageOffsetY=stageRect.top-rootRect.top;
    const source=document.createElement('canvas'),sourceContext=source.getContext('2d',{willReadFrequently:true});
    source.width=width;source.height=height;
    sourceContext.fillStyle='#1d1d1f';sourceContext.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;sourceContext.textAlign='center';sourceContext.textBaseline='middle';
    if('letterSpacing'in sourceContext)sourceContext.letterSpacing=style.letterSpacing;if('fontKerning'in sourceContext)sourceContext.fontKerning='normal';
    const lineHeight=parseFloat(style.lineHeight)||parseFloat(style.fontSize)*.89;
    const lines=typeTarget.textContent.split('\n'),centerX=headingRect.left-rootRect.left+headingRect.width/2,centerY=textRect.top-rootRect.top+textRect.height/2;
    lines.forEach((line,index)=>sourceContext.fillText(line,centerX,centerY+(index-(lines.length-1)/2)*lineHeight));
    const readTargets=()=>{
      const tracked=metaStage._trackedBalls||[];
      return items.map((item,index)=>{
        const ball=tracked[index],fallbackAngle=-Math.PI/2+index*Math.PI*2/items.length,fallbackRadius=Math.min(width,height)*.32;
        return{x:ball?stageOffsetX+ball.x*stageScaleX:width/2+Math.cos(fallbackAngle)*fallbackRadius,y:ball?stageOffsetY+ball.y*stageScaleY:height/2+Math.sin(fallbackAngle)*fallbackRadius,r:(ball?.radius||72)*stageScale};
      });
    };
    const targets=readTargets();
    const pixels=sourceContext.getImageData(0,0,width,height).data,particles=[];
    for(let y=0;y<height;y+=sample)for(let x=0;x<width;x+=sample){if(pixels[(y*width+x)*4+3]>90){let targetIndex=0,best=Infinity;targets.forEach((target,index)=>{const dx=x-target.x,dy=y-target.y,distance=dx*dx+dy*dy;if(distance<best){best=distance;targetIndex=index}});const seedA=Math.sin((x+1)*12.9898+(y+1)*78.233)*43758.5453,seedB=Math.sin((x+1)*39.3467+(y+1)*11.135)*24634.6345,randomA=seedA-Math.floor(seedA),randomB=seedB-Math.floor(seedB),angle=randomA*Math.PI*2,radial=Math.sqrt(randomB),cosA=Math.cos(angle),sinA=Math.sin(angle);particles.push({x,y,targetIndex,ox:cosA*radial,oy:sinA*radial,bx:cosA*42,by:sinA*25,sx:Math.cos(angle+1.4)*18,sy:Math.sin(angle+1.4)*18,drip:4+((randomA*19.7)%1)*14})}}
    const stride=Math.max(1,Math.ceil(particles.length/7200)),points=particles.filter((_,index)=>index%stride===0);
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d');canvas.className='why-pixel-transition';
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.scale(dpr,dpr);root.appendChild(canvas);
    const start=performance.now(),duration=2350,smooth=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
    const curve=(a,b,c,d,t)=>{const k=1-t;return k*k*k*a+3*k*k*t*b+3*k*t*t*c+t*t*t*d};
    const frame=now=>{
      const raw=clamp((now-start)/duration),melt=smooth(clamp((raw-.035)/.24)),move=smooth(clamp((raw-.09)/.62)),form=smooth(clamp((raw-.27)/.28)),fade=1-smooth(clamp((raw-.72)/.28)),liveTargets=readTargets();
      context.clearRect(0,0,width,height);

      // Begin with the complete lettering at the same size and coordinates as the typed heading.
      const solidFade=1-smooth(clamp((raw-.025)/.17));
      if(solidFade>0){context.save();context.globalAlpha=solidFade;context.drawImage(source,0,0);context.restore()}

      // Rounded liquid masses grow only as the arriving text pixels reach them.
      context.fillStyle=`rgba(29,29,31,${fade})`;
      liveTargets.forEach((target,index)=>{
        const seed=smooth(clamp((form-index*.012)/.94));
        if(seed<=0)return;
        const radius=target.r*seed;
        context.beginPath();context.arc(target.x,target.y,radius*.88,0,Math.PI*2);context.fill();
        for(let lobe=0;lobe<4;lobe++){
          const angle=lobe*Math.PI*.5+index*.73+raw*.45,spread=(1-seed)*target.r*.34;
          context.beginPath();context.arc(target.x+Math.cos(angle)*spread,target.y+Math.sin(angle)*spread,radius*(.34+lobe*.025),0,Math.PI*2);context.fill();
        }
      });

      // Every visible point begins at a sampled text pixel and ends inside one of the five masses.
      const particleAlpha=fade*smooth(clamp(raw/.075))*(1-form*.5);context.fillStyle=`rgba(29,29,31,${particleAlpha})`;
      context.beginPath();
      points.forEach(point=>{
        const target=liveTargets[point.targetIndex],tx=target.x+point.ox*target.r*.78,ty=target.y+point.oy*target.r*.78;
        const bendX=point.x+(tx-point.x)*.34+point.bx,bendY=point.y+point.drip*melt+point.by;
        const settleX=target.x+(tx-target.x)*1.18+point.sx,settleY=target.y+(ty-target.y)*1.18+point.sy;
        const x=curve(point.x,bendX,settleX,tx,move),y=curve(point.y+point.drip*melt*(1-move),bendY,settleY,ty,move);
        const size=Math.max(1.8,sample*(.64+move*.22+form*.42));context.moveTo(x+size,y);context.arc(x,y,size,0,Math.PI*2);
      });
      context.fill();
      if(raw<1)requestAnimationFrame(frame);else canvas.remove()
    };
    requestAnimationFrame(frame);
  };
  const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();setTimeout(typeGreeting,180)},{threshold:.35});
  observer.observe(welcomePage);
  const stopGateInput=event=>{if(gateLocked&&!gateOpened)event.preventDefault()};
  const holdGatePosition=()=>{if(gateLocked&&gateSettled&&!gateOpened&&Math.abs(window.scrollY-gateTargetY)>.5)window.scrollTo(0,gateTargetY)};
  window.addEventListener('wheel',stopGateInput,{passive:false,capture:true});
  window.addEventListener('touchmove',stopGateInput,{passive:false,capture:true});
  window.addEventListener('keydown',event=>{if(gateLocked&&!gateOpened&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))event.preventDefault()},{capture:true});
  window.addEventListener('scroll',holdGatePosition,{passive:true});
  const lockGate=()=>{
    if(gateOpened||gateLocked)return;
    gateLocked=true;gateSettled=false;gateTargetY=Math.round(window.scrollY+welcomePage.getBoundingClientRect().top);
    window.scrollTo({top:gateTargetY,left:0,behavior:reduced?'auto':'smooth'});
    setTimeout(()=>{if(gateOpened)return;window.scrollTo(0,gateTargetY);gateSettled=true;document.documentElement.classList.add('why-gate-locked');document.body.classList.add('why-gate-locked')},reduced?0:520);
  };
  const gateObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>.68))lockGate()},{threshold:[.68,.8]});
  gateObserver.observe(welcomePage);
  welcomeTrigger.addEventListener('click',()=>{
    if(gateOpened)return;
    gateOpened=true;gateObserver.disconnect();animateGreetingPixels();root.classList.add('is-launching');
    setTimeout(()=>root.classList.add('is-forming'),reduced?0:1180);
    setTimeout(()=>{
      gateLocked=false;gateSettled=false;root.classList.remove('is-launching','is-forming');root.classList.add('is-launched');
      document.documentElement.classList.remove('why-gate-locked');document.body.classList.remove('why-gate-locked');
    },reduced?0:2350);
  });
})();

