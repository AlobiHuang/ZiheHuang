export default function heroEntrance({field,typeTarget,title,hero,text,radial=false,revealCenters=null,onDispose=()=>{}}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionRate = 1.265;
  const scaled = ms => ms / motionRate;
  const divider = document.createElement('div');
  divider.className = 'arch-entrance-divider';
  divider.setAttribute('aria-hidden', 'true');
  hero.append(divider);
  typeTarget.textContent = text;
  typeTarget.setAttribute('aria-hidden', 'true');
  let disposed = false;
  let entranceFrame = 0;
  let spinTimer = 0;
  const animations = new Set();
  const letters = [];
  const animate = (element, keyframes, options) => {
    const animation = element.animate(keyframes, options);
    animations.add(animation);
    return animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  };
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const ease = value => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t); };

  // Clip only the artwork; the divider remains a continuous stationary line.
  const revealField = () => new Promise(resolve => {
    const start = performance.now();
    const frame = now => {
      if (disposed) { resolve(); return; }
      const elapsed = (now - start) * motionRate;
      if (radial) {
        const progress = ease(elapsed / 1650);
        if (revealCenters?.length) {
          const shortest = Math.min(field.clientWidth, field.clientHeight);
          const masks = revealCenters.map(center => {
            const radius = (center.radius <= 1 ? center.radius * shortest : center.radius) * progress;
            return `radial-gradient(circle at ${center.x * 100}% ${center.y * 100}%,#000 0 ${Math.max(0,radius - 2)}px,transparent ${radius}px)`;
          });
          field.style.maskImage = masks.join(',');
          field.style.webkitMaskImage = masks.join(',');
          field.style.maskComposite = 'add';
          field.style.webkitMaskComposite = 'source-over';
          field.style.clipPath = 'none';
        } else {
          const radius = Math.hypot(field.clientWidth, field.clientHeight) / 2;
          field.style.clipPath = `circle(${progress * radius}px at 50% 50%)`;
        }
        if (elapsed < 1650) entranceFrame = requestAnimationFrame(frame);
        else { field.style.clipPath = 'none';field.style.maskImage='none';field.style.webkitMaskImage='none';resolve(); }
        return;
      }
      const points = [];
      for (let i = 0; i <= 60; i++) {
        const x = i / 60;
        const centerDelay = Math.pow(Math.sin(x * Math.PI), 1.7) * 620;
        const rise = ease((elapsed - centerDelay) / 1150);
        points.push(`${x * 100}% ${(1 - rise) * 100}%`);
      }
      field.style.clipPath = `polygon(0% 100%, ${points.join(',')}, 100% 100%)`;
      if (elapsed < 1770) entranceFrame = requestAnimationFrame(frame);
      else { field.style.clipPath = 'none'; resolve(); }
    };
    entranceFrame = requestAnimationFrame(frame);
  });

  const prepareLetters = () => {
    typeTarget.replaceChildren();
    text.split(' ').forEach((word, index) => {
      if (index) typeTarget.append(' ');
      const group = document.createElement('span');
      group.className = 'arch-word';
      for (const character of word) {
        const slot = document.createElement('span');
        slot.className = 'arch-letter';
        slot.textContent = character;
        group.append(slot);
        letters.push({ slot, character });
      }
      typeTarget.append(group);
    });
  };

  const spin = async ({ slot, character }) => {
    const reel = document.createElement('b');
    reel.className = 'arch-letter-reel';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const start = alphabet.indexOf(character);
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const glyph = document.createElement('b');
      glyph.textContent = i === steps ? character : alphabet[(start + i) % alphabet.length];
      reel.append(glyph);
    }
    slot.classList.add('is-spinning');
    slot.append(reel);
    await animate(reel, [{ transform: 'translateY(0)' }, { transform: `translateY(-${steps}em)` }], {
      duration: 2100 + Math.random() * 500, easing: 'cubic-bezier(.35,0,.18,1)', fill: 'forwards'
    });
    reel.remove();
    slot.classList.remove('is-spinning');
  };
  const scheduleSpin = (delay = 4000 + Math.random() * 2500) => {
    spinTimer = setTimeout(async () => {
      if (disposed) return;
      const rect = title.getBoundingClientRect();
      if (!document.hidden && rect.bottom > 0 && rect.top < innerHeight) {
        const pool = [...letters];
        const chosen = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        await Promise.all(chosen.map(spin));
      }
      if (!disposed) scheduleSpin();
    }, delay);
  };

  const enter = async () => {
    // Wait for the existing route curtain to finish so it cannot hide the reveal.
    const curtain = document.querySelector('.page-transition');
    const waitStart = performance.now();
    while (curtain?.classList.contains('is-active') && performance.now() - waitStart < 2200) await pause(40);
    if (disposed) return;
    const heroRect = hero.getBoundingClientRect();
    const lineY = field.getBoundingClientRect().bottom - heroRect.top;
    divider.style.top = `${lineY}px`;
    hero.classList.add('arch-entering');
    await animate(divider, [
      { transform: `translateY(${Math.max(0, innerHeight - heroRect.top - lineY) + 3}px)` },
      { transform: 'translateY(0)' }
    ], { duration: scaled(730), easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' });
    if (disposed) return;
    const waves = revealField();
    await pause(scaled(400));
    const gap = Math.max(0, title.getBoundingClientRect().top - field.getBoundingClientRect().bottom);
    title.style.clipPath = `inset(-${gap}px -5% -30% -5%)`;
    title.style.visibility = 'visible';
    const roll = animate(typeTarget, [
      { transform: `translateY(calc(-100% - ${gap}px)) rotateX(70deg)` },
      { transform: 'translateY(0) rotateX(0deg)' }
    ], { duration: scaled(1450), easing: 'cubic-bezier(.22,.7,.18,1)', fill: 'forwards' });
    await Promise.all([waves, roll]);
    hero.classList.add('arch-entered');
    hero.classList.remove('arch-entering');
    title.style.clipPath = '';
    document.documentElement.classList.add('arch-toolbar-ready');
    document.documentElement.classList.remove('arch-motion-pending');
    prepareLetters();
    scheduleSpin(1800);
  };

  if (reduced) {
    hero.classList.add('arch-entered');
    document.documentElement.classList.add('arch-toolbar-ready');
    document.documentElement.classList.remove('arch-motion-pending');
  } else enter();

  addEventListener('pagehide', () => {
    disposed = true;
    cancelAnimationFrame(entranceFrame);
    clearTimeout(spinTimer);
    animations.forEach(animation => animation.cancel());
    onDispose();
  }, { once: true });
}
