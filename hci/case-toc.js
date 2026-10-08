// Product case studies: the contents in the left margin follow the reader (the section in
// view is highlighted) and jump to a section on click. Shared by every page under hci/.
(() => {
  const links = [...document.querySelectorAll('[data-cm-toc]')];
  const parts = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!parts.length) return;
  const head = () => (document.querySelector('.site-head')?.offsetHeight || 60) + 24;
  const update = () => {
    const line = head() + innerHeight * 0.25;
    let current = parts[0];
    for (const p of parts) if (p.getBoundingClientRect().top <= line) current = p;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = parts[parts.length - 1];
    links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + current.id));
  };
  links.forEach(a => a.addEventListener('click', event => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const y = target.getBoundingClientRect().top + scrollY - head();
    window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();
