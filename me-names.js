const lab = document.querySelector('[data-dream-lab]');
if (lab) {
  const stage = lab.querySelector('.dream-scroll');
  const sticky = lab.querySelector('.dream-sticky');
  const scenes = [...lab.querySelectorAll('[data-dream-scene]')];
  const meter = lab.querySelector('.dream-meter');
  const count = lab.querySelector('[data-dream-count]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (number, low, high) => Math.max(low, Math.min(high, number));
  let frame = 0;
  let active = -1;

  function update() {
    frame = 0;
    const rect = stage.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height - sticky.clientHeight), 0, 1);
    const timeline = progress * scenes.length;
    const next = Math.min(scenes.length - 1, Math.floor(timeline));

    scenes.forEach((scene, index) => {
      const offset = clamp(index - clamp(timeline - .5, 0, scenes.length - 1), -1, 1);
      const opacity = clamp(1 - Math.abs(offset), 0, 1);
      scene.style.opacity = reduced ? String(index === next ? 1 : 0) : String(opacity);
      scene.style.transform = reduced ? 'none' : `translateY(${offset * 90}px)`;
      scene.setAttribute('aria-hidden', String(index !== next));
      scene.inert = index !== next;
    });

    if (active !== next) {
      active = next;
      count.textContent = String(next + 1).padStart(2, '0');
    }
    meter.style.setProperty('--dream-progress', `${progress * 100}%`);
  }

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  addEventListener('scroll', requestUpdate, {passive:true});
  addEventListener('resize', requestUpdate);
  new IntersectionObserver(entries => {
    lab.classList.toggle('names-visible', entries[0].isIntersecting);
    if (entries[0].isIntersecting) requestUpdate();
  }).observe(sticky);
  update();
}
