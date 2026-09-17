if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

const panel = document.querySelector('.index-panel');
const menu = document.querySelector('.menu-button');
const header = document.querySelector('.site-head');
const setPanel = open => {
  panel.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  panel.setAttribute('aria-hidden', String(!open));
  menu.setAttribute('aria-expanded', String(open));
};
menu.addEventListener('click', () => setPanel(!panel.classList.contains('open')));
document.addEventListener('click', event => {
  if (!panel.classList.contains('open')) return;
  if (panel.contains(event.target) || menu.contains(event.target)) return;
  setPanel(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setPanel(false);
});

const transition = document.querySelector('.page-transition');
const transitionGrid = transition.querySelector('.transition-grid');
const transitionLabel = transition.querySelector('.transition-label');
for (let index = 0; index < 12; index += 1) {
  const cell = document.createElement('span');
  cell.style.setProperty('--cell', index);
  cell.style.setProperty('--reverse-cell', 11 - index);
  transitionGrid.append(cell);
}

let routing = false;
const routeStorageKey = 'alobi-route-reveal';
const rememberRouteReveal = (label, effect = 'line') => {
  try { sessionStorage.setItem(routeStorageKey, JSON.stringify({ label, effect, createdAt: Date.now() })); } catch {}
};
const playIncomingRouteReveal = () => {
  let state = null;
  try {
    const raw = sessionStorage.getItem(routeStorageKey);
    state = raw ? JSON.parse(raw) : null;
    sessionStorage.removeItem(routeStorageKey);
  } catch {}
  if (!state || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('route-enter-pending');
    return;
  }
  if (state.effect === 'line' || state.effect === 'cleaner') {
    transition.className = 'page-transition';
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
    return;
  }
  routing = true;
  transitionLabel.textContent = state.label || 'CONTACT / OPEN CHANNEL';
  transition.className = 'page-transition is-active effect-route-reveal';
  void transition.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
  }));
  window.setTimeout(() => {
    transition.className = 'page-transition';
    routing = false;
  }, 913);
};
playIncomingRouteReveal();

const routeTo = (url, label) => {
  if (routing) return;
  setPanel(false);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.assign(url);
    return;
  }
  routing = true;
  if (/ALOBI\s*\/\s*HOME/i.test(label)) {
    try { sessionStorage.setItem('alobi-home-line-return', '1'); } catch {}
  }
  document.documentElement.classList.add('route-leaving');
  transition.className = 'page-transition is-active effect-cleaner-down';
  transitionLabel.textContent = label;
  window.setTimeout(() => {
    transition.classList.add('is-holding');
    rememberRouteReveal(label);
    requestAnimationFrame(() => window.setTimeout(() => location.assign(url), 135));
  }, 616);
};

document.querySelectorAll('[data-route]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  routeTo(link.href, link.dataset.routeLabel || link.textContent.trim());
}));
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  setPanel(false);
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

const form = document.querySelector('.contact-compose');
const status = document.querySelector('.form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) {
    status.textContent = 'Please complete all three fields.';
    return;
  }
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const need = String(data.get('need')).trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`Hi Zihe,\n\n${need}\n\nBest,\n${name}\n${email}`);
  status.textContent = 'Opening your email application…';
  location.href = `mailto:ziheh@andrew.cmu.edu?subject=${subject}&body=${body}`;
});

requestAnimationFrame(() => document.body.classList.add('contact-ready'));
