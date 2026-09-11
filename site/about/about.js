if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

const panel = document.querySelector('.index-panel');
const menu = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-head');

const setPanel = open => {
  panel.classList.toggle('open', open);
  siteHeader.classList.toggle('menu-open', open);
  panel.setAttribute('aria-hidden', String(!open));
  menu.setAttribute('aria-expanded', String(open));
};

menu.addEventListener('click', () => setPanel(!panel.classList.contains('open')));
document.addEventListener('click', event => {
  if (!panel.classList.contains('open')) return;
  if (panel.contains(event.target) || menu.contains(event.target)) return;
  event.preventDefault();
  event.stopPropagation();
  setPanel(false);
}, true);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setPanel(false);
});

let headerFrame = 0;
const updateHeader = () => {
  siteHeader.classList.toggle('is-compact', window.scrollY > 80);
  headerFrame = 0;
};
window.addEventListener('scroll', () => {
  if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

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
const routeTransitionDuration = 690;
const routeHoldDuration = 170;
const routeRevealDuration = 1050;
const routeStorageKey = 'alobi-route-reveal';

const rememberRouteReveal = label => {
  try {
    sessionStorage.setItem(routeStorageKey, JSON.stringify({ label, createdAt: Date.now() }));
  } catch {}
};

const playIncomingRouteReveal = () => {
  let state = null;
  try {
    const rawState = sessionStorage.getItem(routeStorageKey);
    state = rawState ? JSON.parse(rawState) : null;
    sessionStorage.removeItem(routeStorageKey);
  } catch {}

  document.body.classList.add('is-ready');
  if (!state || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('route-enter-pending');
    return;
  }

  routing = true;
  transitionLabel.textContent = state.label || 'ABOUT / TIMELINE';
  transition.className = 'page-transition is-active effect-route-reveal';
  void transition.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
  }));
  window.setTimeout(() => {
    transition.className = 'page-transition';
    routing = false;
  }, routeRevealDuration);
};

const routeTo = (url, label) => {
  if (routing) return;
  setPanel(false);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.assign(url);
    return;
  }
  routing = true;
  document.documentElement.classList.add('route-leaving');
  transition.className = 'page-transition is-active effect-route';
  transitionLabel.textContent = label;
  window.setTimeout(() => {
    transition.classList.add('is-holding');
    rememberRouteReveal(label);
    requestAnimationFrame(() => window.setTimeout(() => location.assign(url), routeHoldDuration));
  }, routeTransitionDuration);
};

playIncomingRouteReveal();

document.querySelectorAll('[data-route]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    routeTo(link.href, link.dataset.routeLabel || link.textContent.trim());
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    setPanel(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const contactChapter = document.querySelector('.about-qr-contact');
if (contactChapter) {
  const contactObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    contactChapter.classList.toggle('in-view', entry.isIntersecting);
  }), { threshold: .12 });
  contactObserver.observe(contactChapter);
}

const timeline = document.querySelector('.timeline-shell');
const timelineConsole = document.querySelector('.timeline-console');
const consoleYear = document.querySelector('.console-year');
const consoleTitle = document.querySelector('.console-title');
const events = [...document.querySelectorAll('.timeline-event')];
const mapButtons = [...document.querySelectorAll('[data-timeline-target]')];
let activeIndex = -1;
let timelineFrame = 0;

const setActiveEvent = index => {
  if (index === activeIndex || !events[index]) return;
  activeIndex = index;
  const event = events[index];
  timelineConsole.classList.add('is-updating');
  window.setTimeout(() => {
    consoleYear.textContent = event.dataset.year;
    consoleTitle.textContent = event.dataset.title;
    timelineConsole.classList.remove('is-updating');
  }, 150);
  events.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
  mapButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
};

const updateTimeline = () => {
  const focusY = window.innerHeight * .54;
  let closestIndex = 0;
  let closestDistance = Infinity;
  events.forEach((event, index) => {
    const bounds = event.getBoundingClientRect();
    const center = bounds.top + bounds.height * .5;
    const distance = Math.abs(center - focusY);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  setActiveEvent(closestIndex);

  const bounds = timeline.getBoundingClientRect();
  const total = Math.max(1, timeline.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, -bounds.top / total));
  timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
  timelineFrame = 0;
};

window.addEventListener('scroll', () => {
  if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimeline);
}, { passive: true });
window.addEventListener('resize', updateTimeline);
mapButtons.forEach(button => button.addEventListener('click', () => {
  document.getElementById(button.dataset.timelineTarget)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}));
updateTimeline();

if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
  const live = new EventSource('/__live');
  live.onmessage = ({ data }) => { if (data === 'reload') location.reload(); };
}
