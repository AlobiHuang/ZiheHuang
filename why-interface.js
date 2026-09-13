(()=>{
  const root=document.querySelector('[data-why-interface]');
  const detail=document.querySelector('[data-why-detail]');
  if(!root||!detail)return;
  const welcomePage=root.querySelector('.why-welcome-page');
  const welcomeTrigger=root.querySelector('[data-why-enter]');
  const questionPage=root.querySelector('.why-metaball-page');
  const deck=root.querySelector('[data-why-orbit]');
  const items=[...root.querySelectorAll('[data-why-index]')];
  const typeTarget=root.querySelector('[data-why-type]');
  const detailImage=detail.querySelector('[data-why-detail-image]');
  const detailCount=detail.querySelector('[data-why-detail-count]');
  const detailLabel=detail.querySelector('[data-why-detail-label]');
  const detailKicker=detail.querySelector('[data-why-detail-kicker]');
  const detailTitle=detail.querySelector('[data-why-detail-title]');
  const detailText=detail.querySelector('[data-why-detail-text]');
  const detailClose=detail.querySelector('.why-detail-close');
  const wheelItems=[...detail.querySelectorAll('.why-option-wheel span')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const states=[
    {label:'WHO AM I?',title:'ALOBI.',kicker:'PERSON / PROCESS / PLACE',text:'I’m Zihe Huang—an architecture and HCI student who follows curiosity across physical and digital spaces.',color:'#78c900',image:'assets/profile-position-v2.png',position:'50% 50%'},
    {label:'WHAT I DO?',title:'I DESIGN CONNECTIONS.',kicker:'ARCHITECTURE / HCI / AI',text:'I design places, interfaces, and systems around how people actually move, meet, and make decisions.',color:'#0879f9',image:'assets/portfolio/teaser-final-dark-foreground.webp',position:'50% 52%'},
    {label:"WHERE I'M FROM?",title:'BETWEEN PLACES.',kicker:'SHENZHEN / PITTSBURGH / BEYOND',text:'I’m from Shenzhen and now study in Pittsburgh. Travel keeps widening the way I understand place.',color:'#ff477e',image:'assets/personal-gallery/personal-35.jpg',position:'50% 54%'},
    {label:'WHAT I WORK ON?',title:'IDEAS MADE VISIBLE.',kicker:'COMMUNITY / SPACE / INTERACTION',text:'My projects move between community building, spatial research, digital products, and visual experiments.',color:'#ff5a36',image:'assets/portfolio/about-parallel-study.webp',position:'50% 48%'},
    {label:'WHAT I LIKE?',title:'MOVED BY CURIOSITY.',kicker:'MUSIC / TRAVEL / PEOPLE',text:'Music, movement, photography, food, and the people close to me keep life playful and my work grounded.',color:'#ffc83d',image:'assets/personal-gallery/personal-46.jpg',position:'50% 48%'}
  ];
  let active=-1,returnFocus=null,closeTimer=0,gateLocked=false,gateOpened=false;
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
    detail.style.setProperty('--why-detail-x',`${rect.left+rect.width/2}px`);detail.style.setProperty('--why-detail-y',`${rect.top+rect.height/2}px`);detail.style.setProperty('--why-detail-accent',state.color);
    detailImage.src=state.image;detailImage.style.objectPosition=state.position;detailCount.textContent=`ANSWER / ${String(index+1).padStart(2,'0')}`;detailLabel.textContent=state.label;detailKicker.textContent=state.kicker;detailTitle.textContent=state.title;detailText.textContent=state.text;
    wheelItems.forEach((item,i)=>item.classList.toggle('is-current',i===index));
    document.body.classList.add('why-detail-open');detail.setAttribute('aria-hidden','false');detail.classList.remove('is-closing');
    requestAnimationFrame(()=>{detail.classList.add('is-open');setTimeout(()=>detailClose.focus(),reduced?0:720)});
  };
  const closeDetail=()=>{
    if(!detail.classList.contains('is-open'))return;
    detail.classList.add('is-closing');detail.classList.remove('is-open');
    closeTimer=setTimeout(()=>{detail.classList.remove('is-closing');detail.setAttribute('aria-hidden','true');document.body.classList.remove('why-detail-open');returnFocus?.focus({preventScroll:true})},reduced?0:720);
  };
  items.forEach((item,index)=>{item.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')setHover(index)});item.addEventListener('click',()=>{if(active!==index){setHover(index);return}openDetail(index,item)})});
  deck.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const current=Math.max(0,items.indexOf(document.activeElement));const delta=event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1;items[(current+delta+items.length)%items.length].focus()});
  detailClose.addEventListener('click',closeDetail);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&detail.classList.contains('is-open'))closeDetail()});
  questionPage.addEventListener('pointermove',event=>{const rect=questionPage.getBoundingClientRect();questionPage.style.setProperty('--why-x',`${event.clientX-rect.left}px`);questionPage.style.setProperty('--why-y',`${event.clientY-rect.top}px`)});
  const typeLine=(line,prefix,speed,done)=>{let index=0;const tick=()=>{typeTarget.textContent=prefix+line.slice(0,index++);if(index<=line.length){setTimeout(tick,speed+Math.random()*18);return}done()};tick()};
  const typeGreeting=()=>{
    const first='Hi.',second='Welcome, stranger.',third="What's your question?";
    if(reduced){typeTarget.textContent=first+'\n'+second+'\n'+third;root.classList.add('is-typed');return}
    typeLine(first,'',44,()=>setTimeout(()=>typeLine(second,first+'\n',40,()=>setTimeout(()=>typeLine(third,first+'\n'+second+'\n',42,()=>root.classList.add('is-typed')),590)),540));
  };
  const animateGreetingPixels=()=>{
    if(reduced||!typeTarget)return;
    const rootRect=root.getBoundingClientRect(),textRect=typeTarget.getBoundingClientRect(),style=getComputedStyle(typeTarget);
    const width=Math.round(rootRect.width),height=Math.round(rootRect.height),sample=Math.max(5,Math.round(width/260));
    const source=document.createElement('canvas'),sourceContext=source.getContext('2d',{willReadFrequently:true});
    source.width=width;source.height=height;
    sourceContext.fillStyle='#1d1d1f';sourceContext.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;sourceContext.textAlign='center';sourceContext.textBaseline='middle';
    const lineHeight=parseFloat(style.lineHeight)||parseFloat(style.fontSize)*.89;
    const lines=typeTarget.textContent.split('\n'),centerX=textRect.left-rootRect.left+textRect.width/2,centerY=textRect.top-rootRect.top+textRect.height/2;
    lines.forEach((line,index)=>sourceContext.fillText(line,centerX,centerY+(index-(lines.length-1)/2)*lineHeight));
    const pixels=sourceContext.getImageData(0,0,width,height).data,particles=[];
    const attractors=[[.34,.39],[.45,.58],[.55,.35],[.67,.57],[.73,.41]];
    for(let y=0;y<height;y+=sample)for(let x=0;x<width;x+=sample){if(pixels[(y*width+x)*4+3]>90){const target=attractors[Math.floor((x/Math.max(1,width))*attractors.length)%attractors.length];particles.push({x,y,tx:target[0]*width+(Math.random()-.5)*72,ty:target[1]*height+(Math.random()-.5)*72,a:Math.random()*Math.PI*2,j:(Math.random()-.5)*10})}}
    const stride=Math.max(1,Math.ceil(particles.length/1700)),points=particles.filter((_,index)=>index%stride===0);
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d');canvas.className='why-pixel-transition';
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.scale(dpr,dpr);root.appendChild(canvas);
    const start=performance.now(),duration=1480,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const frame=now=>{
      const raw=Math.min(1,(now-start)/duration),travel=Math.max(0,(raw-.1)/.76),move=ease(Math.min(1,travel)),fade=raw<.64?1:1-(raw-.64)/.36;
      context.clearRect(0,0,width,height);context.fillStyle=`rgba(29,29,31,${Math.max(0,fade)})`;
      points.forEach(point=>{const curl=Math.sin(move*Math.PI)*18;const x=point.x+(point.tx-point.x)*move+Math.cos(point.a+move*3)*curl+Math.sin(raw*7+point.a)*point.j*(1-move),y=point.y+(point.ty-point.y)*move+Math.sin(point.a+move*3)*curl;const size=Math.max(1.2,sample*(1-move*.72));context.fillRect(x-size/2,y-size/2,size,size)});
      if(raw<1)requestAnimationFrame(frame);else canvas.remove();
    };
    requestAnimationFrame(frame);
  };
  const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();setTimeout(typeGreeting,180)},{threshold:.35});
  observer.observe(welcomePage);
  const lockGate=()=>{
    if(gateOpened||gateLocked)return;
    gateLocked=true;
    welcomePage.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    setTimeout(()=>{if(gateOpened)return;document.documentElement.classList.add('why-gate-locked');document.body.classList.add('why-gate-locked')},reduced?0:520);
  };
  const gateObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>.68))lockGate()},{threshold:[.68,.8]});
  gateObserver.observe(welcomePage);
  welcomeTrigger.addEventListener('click',()=>{
    if(gateOpened)return;
    gateOpened=true;gateObserver.disconnect();animateGreetingPixels();root.classList.add('is-launching');
    setTimeout(()=>{
      gateLocked=false;root.classList.add('is-launched');
      document.documentElement.classList.remove('why-gate-locked');document.body.classList.remove('why-gate-locked');
    },reduced?0:1500);
  });
})();
