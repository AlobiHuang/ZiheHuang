// Every new visit starts from the homepage instead of the browser's last
// restored scroll position.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const resetEntryPosition = () => {
  // Preserve real anchors so keyboard navigation and deep links can land on
  // the requested section instead of being erased during the initial paint.
  if (location.hash && location.hash !== '#top') return;
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};

resetEntryPosition();
requestAnimationFrame(resetEntryPosition);
window.addEventListener('load', resetEntryPosition, { once: true });
window.addEventListener('pageshow', resetEntryPosition);

// ALOBI loading signature: progress follows document readiness, with a short
// minimum duration so the identity has time to register visually.
const loader = document.querySelector('.loader');
const loaderValue = document.querySelector('.loader-value');
const symbolCaption = document.querySelector('.symbol-caption');
const incomingRouteReveal = document.documentElement.classList.contains('route-enter-pending') || location.hash === '#play-lab';
let returningVisitor = false;
try { returningVisitor = sessionStorage.getItem('alobi-visited') === '1'; } catch {}
let displayedProgress = 0;
let documentReady = document.readyState === 'complete';
const loaderStart = performance.now();
const symbolNames = ['ALOBI', 'MUSIC', 'ARCHITECTURE', 'FILM', 'SOCCER', 'TRAVELLING', 'READING'];
let activeSymbol = 0;

let symbolTimer = 0;
if (!incomingRouteReveal) symbolTimer = window.setInterval(() => {
  activeSymbol = Math.min(activeSymbol + 1, symbolNames.length - 1);
  symbolCaption.innerHTML = `<i>0${activeSymbol + 1}</i> ${symbolNames[activeSymbol]}`;
}, 600);

window.addEventListener('load', () => { documentReady = true; });

function updateLoader(now) {
  const elapsed = now - loaderStart;
  const simulatedTarget = Math.min(88, elapsed / 14);
  const target = documentReady && elapsed > 1400 ? 100 : simulatedTarget;
  displayedProgress += (target - displayedProgress) * (target === 100 ? .16 : .08);
  if (target === 100 && displayedProgress > 99.2) displayedProgress = 100;
  const rounded = Math.round(displayedProgress);
  loader.style.setProperty('--load-progress', `${displayedProgress}%`);
  loaderValue.textContent = `${rounded}%`;

  if (displayedProgress < 100) {
    requestAnimationFrame(updateLoader);
  } else {
    window.clearInterval(symbolTimer);
    loader.classList.add('is-complete');
    document.body.classList.add('is-ready');
  }
}
if (incomingRouteReveal || returningVisitor) {
  loader.style.setProperty('--load-progress', '100%');
  loaderValue.textContent = '100%';
  loader.classList.add('is-complete');
  document.body.classList.add('is-ready');
  try { sessionStorage.setItem('alobi-visited', '1'); } catch {}
} else {
  requestAnimationFrame(updateLoader);
}

// Keep browser-style section movement available even when the custom motion
// layer is active. Interactive controls retain their own arrow-key behavior.
document.addEventListener('keydown', event => {
  if (event.defaultPrevented || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
  const steps = { PageDown: 1, PageUp: -1, ArrowDown: 1, ArrowUp: -1 };
  if (!(event.key in steps)) return;
  const amount = Math.max(240, Math.round(window.innerHeight * .82)) * steps[event.key];
  event.preventDefault();
  window.scrollBy({ top: amount, left: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

// Custom pointer.
const cursor = document.querySelector('.cursor');
if (cursor && getComputedStyle(cursor).display !== 'none') {
  window.addEventListener('pointermove', ({ clientX, clientY }) => {
    cursor.style.setProperty('--cursor-x', `${clientX}px`);
    cursor.style.setProperty('--cursor-y', `${clientY}px`);
  }, { passive: true });
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('pointerenter', () => cursor.classList.add('large'));
    element.addEventListener('pointerleave', () => cursor.classList.remove('large'));
  });
}

// Index panel.
const panel = document.querySelector('.index-panel');
const menu = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-head');
const contentsItems = [...panel.querySelectorAll('[data-nav-key]')];
let activeContentsKey = 'home';
let lastDisciplineKey = 'architecture';
const setContentsActive = key => {
  activeContentsKey = key;
  if (['architecture', 'pm', 'hci'].includes(key)) lastDisciplineKey = key;
  contentsItems.forEach(item => {
    const active = item.dataset.navKey === key;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
};
let headerFrame = 0;
let headerCompact = null;
const updateHeader = () => {
  const shouldCompact = window.scrollY > 80;
  if (shouldCompact !== headerCompact) {
    headerCompact = shouldCompact;
    siteHeader.classList.toggle('is-compact', shouldCompact);
  }
  setContentsActive('home');
  headerFrame = 0;
};
window.addEventListener('scroll', () => {
  if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();
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
panel.querySelectorAll('a[data-nav-key]').forEach(link => link.addEventListener('click', () => {
  setContentsActive(link.dataset.navKey);
  setPanel(false);
}));
panel.querySelectorAll('button[data-discipline]').forEach(link => link.addEventListener('click', () => {
  setContentsActive(link.dataset.navKey);
  setPanel(false);
  navigateToCategory(link.dataset.discipline);
}));
document.querySelector('.identity').addEventListener('click', () => {
  setContentsActive('home');
  setPanel(false);
});
document.querySelector('.header-contact').addEventListener('click', () => {
  setContentsActive('contact');
  setPanel(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && panel.classList.contains('open')) setPanel(false);
});

// Build the transition shutters once; CSS recomposes them for each chapter.
const transition = document.querySelector('.page-transition');
const transitionGrid = transition.querySelector('.transition-grid');
const transitionLabel = transition.querySelector('.transition-label');
for (let index = 0; index < 12; index += 1) {
  const cell = document.createElement('span');
  cell.style.setProperty('--cell', index);
  cell.style.setProperty('--reverse-cell', 11 - index);
  transitionGrid.append(cell);
}

const transitionNames = {
  top: 'ALOBI / HOME',
  profile: '00.5 / INTRODUCTION'
};
const categoryRoutes = {
  about: { url: 'about/', label: 'ABOUT / TIMELINE' },
  architecture: { url: 'architecture/', label: 'ARCHITECTURE' },
  pm: { url: 'project/?lens=pm&project=sankofa-multi-stakeholder-delivery', label: 'SANKOFA / GREENHOUSE' },
  hci: { url: 'hci/', label: 'HUMAN-COMPUTER INTERACTION' },
  contact: { url: 'contact/', label: 'CONTACT / OPEN CHANNEL' }
};
const categoryTransitionDuration = 690;
const routeHoldDuration = 170;
const routeRevealDuration = 1050;
const routeStorageKey = 'alobi-route-reveal';
let transitioning = false;

function rememberRouteReveal(label, effect = 'route') {
  try {
    sessionStorage.setItem(routeStorageKey, JSON.stringify({ label, effect, createdAt: Date.now() }));
  } catch {}
}

function playIncomingRouteReveal() {
  let state = null;
  try {
    const rawState = sessionStorage.getItem(routeStorageKey);
    state = rawState ? JSON.parse(rawState) : null;
    sessionStorage.removeItem(routeStorageKey);
  } catch {}

  if (!state || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('route-enter-pending');
    return;
  }

  transitioning = true;
  transitionLabel.textContent = state.label || 'ALOBI';
  transition.className = `page-transition is-active ${state.effect === 'arch-slide' ? 'effect-arch-slide-reveal' : 'effect-route-reveal'}`;
  void transition.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
  }));
  window.setTimeout(() => {
    transition.className = 'page-transition';
    transitioning = false;
  }, routeRevealDuration);
}

playIncomingRouteReveal();

function navigateWithTransition(targetId, target) {
  if (transitioning || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  transitioning = true;
  transition.className = `page-transition is-active effect-${targetId}`;
  transitionLabel.textContent = transitionNames[targetId] || 'ALOBI';
  window.setTimeout(() => {
    const top = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, left: 0, behavior: 'instant' });
  }, 450);
  window.setTimeout(() => {
    transition.className = 'page-transition';
    transitioning = false;
  }, 1250);
}

function navigateToCategory(discipline) {
  const destination = categoryRoutes[discipline];
  if (!destination || transitioning) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.assign(destination.url);
    return;
  }
  transitioning = true;
  document.documentElement.classList.add('route-leaving');
  transition.className = 'page-transition is-active effect-route';
  transitionLabel.textContent = destination.label;
  window.setTimeout(() => {
    transition.classList.add('is-holding');
    rememberRouteReveal(destination.label);
    requestAnimationFrame(() => window.setTimeout(() => location.assign(destination.url), routeHoldDuration));
  }, categoryTransitionDuration);
}

window.alobiNavigateToArchitectureSlide = () => {
  const destination = categoryRoutes.architecture;
  if (!destination || transitioning) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.assign(destination.url);
    return;
  }
  transitioning = true;
  transition.className = 'page-transition is-active effect-arch-slide';
  transitionLabel.textContent = 'ARCHITECTURE / SELECTED WORKS';
  window.setTimeout(() => {
    transition.classList.add('is-holding');
    rememberRouteReveal(destination.label, 'arch-slide');
    requestAnimationFrame(() => window.setTimeout(() => location.assign(destination.url), routeHoldDuration));
  }, 620);
};

document.querySelectorAll('[data-site-route]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    setContentsActive(link.dataset.siteRoute);
    setPanel(false);
    navigateToCategory(link.dataset.siteRoute);
  });
});

// The shared homepage forks after the introduction. The choice only lasts for
// the current visit, so every new visit still begins with the open, shared story.
const lensGateway = document.querySelector('.lens-gateway');
const lensChoices = [...document.querySelectorAll('[data-lens-choice]')];
lensChoices.forEach(button => button.addEventListener('click', () => navigateToCategory(button.dataset.lensChoice)));
lensChoices.forEach(button => {
  const showPreview = () => {
    const lens = button.dataset.lensChoice;
    if (lensGateway.dataset.previewLens === lens) return;
    lensGateway.classList.add('is-resetting-preview');
    delete lensGateway.dataset.previewLens;
    // Commit the neutral frame before applying the next theme. Without this
    // reset, moving directly between cards reuses the completed first preview.
    void lensGateway.querySelector('.lens-hover-preview').offsetWidth;
    lensGateway.classList.remove('is-resetting-preview');
    void lensGateway.querySelector('.lens-hover-preview').offsetWidth;
    lensGateway.dataset.previewLens = lens;
  };
  const clearPreview = () => {
    if (lensGateway.dataset.previewLens === button.dataset.lensChoice) delete lensGateway.dataset.previewLens;
  };
  button.addEventListener('pointerenter', showPreview);
  button.addEventListener('pointerleave', clearPreview);
  button.addEventListener('focus', showPreview);
  button.addEventListener('blur', clearPreview);
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const rawTarget = link.getAttribute('href').slice(1) || 'top';
    if (link.matches('.hero-scroll-prompt')) {
      const target = document.getElementById(rawTarget);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    if (rawTarget === 'contact') {
      event.preventDefault();
      lensGateway.classList.remove('needs-selection');
      void lensGateway.offsetWidth;
      lensGateway.classList.add('needs-selection');
      lensGateway.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => lensGateway.classList.remove('needs-selection'), 1200);
      return;
    }
    const target = document.getElementById(rawTarget);
    if (!target) return;
    event.preventDefault();
    navigateWithTransition(rawTarget, target);
  });
});

// The scale navigator uses the same modular transition as the project archive.
const disciplineControls = [...document.querySelectorAll('.scale')];
const scaleMap = document.querySelector('.scale-map');
const scaleIndicator = document.querySelector('.scale-axis i');
const indicatorPositions = [16.67, 50, 83.33];
const indicatorColors = ['#ff3d16', '#171816', '#4038ff'];

const moveScaleIndicator = index => {
  scaleIndicator.style.left = `${indicatorPositions[index]}%`;
  scaleIndicator.style.backgroundColor = indicatorColors[index];
};

const restoreScaleIndicator = () => {
  const activeIndex = Math.max(0, disciplineControls.findIndex(item => item.classList.contains('active')));
  moveScaleIndicator(activeIndex);
};

scaleMap.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') return;
  const bounds = scaleMap.getBoundingClientRect();
  const relativeX = Math.max(0, Math.min(bounds.width - 1, event.clientX - bounds.left));
  const hoveredIndex = Math.min(disciplineControls.length - 1, Math.floor(relativeX / bounds.width * disciplineControls.length));
  moveScaleIndicator(hoveredIndex);
});
scaleMap.addEventListener('pointerleave', restoreScaleIndicator);

disciplineControls.forEach((button, index) => {
  button.addEventListener('focus', () => moveScaleIndicator(index));
  button.addEventListener('blur', restoreScaleIndicator);
  button.addEventListener('click', () => {
    setContentsActive(button.dataset.discipline);
    disciplineControls.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    moveScaleIndicator(index);
    navigateToCategory(button.dataset.discipline);
  });
});

restoreScaleIndicator();

// Section entrances replay in both scroll directions. A small threshold gap
// prevents rapid toggling while a section rests on the viewport boundary.
const chapterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const chapter = entry.target;
    if (entry.intersectionRatio >= .16) {
      chapter.classList.remove('is-out');
      if (!chapter.matches('.hero')) chapter.classList.add('in-view');
    } else if (entry.intersectionRatio <= .05) {
      chapter.classList.add('is-out');
      if (!chapter.matches('.hero')) chapter.classList.remove('in-view');
    }
  });
}, { threshold: [0, .05, .16], rootMargin: '-5% 0px -5% 0px' });
document.querySelectorAll('.hero, .manifesto, .intro-brief, .lens-gateway').forEach(chapter => chapterObserver.observe(chapter));

if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
  const live = new EventSource('/__live');
  live.onmessage = ({ data }) => { if (data === 'reload') location.reload(); };
}
