(()=>{
  const root=document.querySelector('[data-why-interface]');
  if(!root)return;
  const orbit=root.querySelector('[data-why-orbit]'),items=[...root.querySelectorAll('[data-why-index]')],word=root.querySelector('[data-why-word]'),answer=root.querySelector('[data-why-answer]');
  const states=[
    {word:'ALOBI.',answer:'Why called Alobi? I first heard the name in a dream—and decided to keep it.',color:'#7fc900'},
    {word:'ARCH + HCI.',answer:'I study Architecture and Human–Computer Interaction at Carnegie Mellon University.',color:'#0879f9'},
    {word:'SHENZHEN.',answer:'Born in Shenzhen, China; now studying and making in Pittsburgh. I work on projects across the world—including Indonesia, Portland, Pittsburgh, and Shenzhen.',color:'#ff477e'},
    {word:'PROJECTS.',answer:'I work across community building, UI/UX, and place-based design—from Sankofa and zihehuang.com to proposals for Torosiaje and Portland.',color:'#ff5a36'}
  ];
  let active=0,pointer=null,startAngle=0,startIndex=0,answerTimer=0;
  const select=(next,animate=true)=>{
    active=(next+states.length)%states.length;
    const state=states[active];
    root.dataset.whyState=String(active);
    root.style.setProperty('--why-angle',`${active*-90}deg`);
    root.style.setProperty('--why-accent',state.color);
    items.forEach((item,index)=>{const on=index===active;item.classList.toggle('is-active',on);item.setAttribute('aria-selected',String(on))});
    clearTimeout(answerTimer);
    if(animate){word.classList.remove('is-changing');void word.offsetWidth;word.classList.add('is-changing');answer.classList.add('is-changing')}
    word.textContent=state.word;
    answerTimer=setTimeout(()=>{answer.textContent=state.answer;answer.classList.remove('is-changing')},animate?170:0);
  };
  items.forEach(item=>item.addEventListener('click',()=>select(Number(item.dataset.whyIndex))));
  const angleOf=event=>{const rect=orbit.getBoundingClientRect();return Math.atan2(event.clientY-(rect.top+rect.height/2),event.clientX-(rect.left+rect.width/2))*180/Math.PI};
  orbit.addEventListener('pointerdown',event=>{if(event.target.closest('button'))return;pointer=event.pointerId;startAngle=angleOf(event);startIndex=active;orbit.setPointerCapture(pointer);orbit.classList.add('is-dragging')});
  orbit.addEventListener('pointermove',event=>{if(event.pointerId!==pointer)return;const delta=angleOf(event)-startAngle;select(startIndex-Math.round(delta/90),false)});
  const end=event=>{if(event.pointerId!==pointer)return;pointer=null;orbit.classList.remove('is-dragging');select(active)};
  orbit.addEventListener('pointerup',end);orbit.addEventListener('pointercancel',end);
  orbit.addEventListener('wheel',event=>{event.preventDefault();select(active+(event.deltaY>0?1:-1))},{passive:false});
  orbit.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();select(active+(event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1))});
  select(0,false);
})();
