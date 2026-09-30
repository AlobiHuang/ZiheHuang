// OpenGym case page: the screen loop (as on the PD page).
const loop = document.querySelector('[data-pd-loop]');
if (loop) {
  const frames = [...loop.querySelectorAll('img')];
  let index = 0, timer = 0;
  const show = next => { frames.forEach((f, i) => f.classList.toggle('is-shown', i === next)); index = next; };
  show(0);
  if (frames.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tick = () => { show((index + 1) % frames.length); timer = setTimeout(tick, 3800); };
    new IntersectionObserver(entries => {
      clearTimeout(timer);
      if (entries[0].isIntersecting) timer = setTimeout(tick, 3800);
    }, { threshold: .25 }).observe(loop);
  }
}
