// Page flow. Where the browser can hand one page to the next itself
// (cross-document view transitions), there is never a blank sheet between
// pages: the page being left stays on screen until the next one is ready,
// then the next page rises over it like a sheet of paper (browser Back: the
// current sheet falls away and uncovers the page underneath). page-flow.css
// draws the movement; this script chooses it and sends every site link
// straight there, instead of first wiping the screen to paper.
(() => {
  const root = document.documentElement;
  const supported = 'CSSViewTransitionRule' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.alobiFlow = supported;
  if (supported) root.classList.add('page-flow');

  // A promise the page's own scripts can wait on: settled once the handover
  // has finished (or straight away when there is none).
  let settle = () => {};
  const arm = () => { window.alobiReveal = new Promise(resolve => { settle = resolve; }); };
  arm();
  addEventListener('pageshow', event => { if (event.persisted) arm(); });

  const fresh = (key, limit) => {
    try { const record = JSON.parse(sessionStorage.getItem(key) || 'null'); return record && Date.now() - record.at < limit ? record : null; } catch { return null; }
  };
  const path = location.pathname;
  const isHome = /\/$/.test(path) && !/\/(about|architecture|contact|hci|pm|project|resume)\/$/.test(path);
  // Arriving from a frame in the home page's room: the two pages already meet
  // on the same full-screen picture, so they swap without any movement.
  const zoomArrival = /\/project\/$/.test(path) && !!fresh('alobi-zoom-hand', 8000);

  addEventListener('pagereveal', event => {
    const transition = event.viewTransition;
    if (!transition) { settle(); return; }
    window.alobiViewTransition = transition;
    const type = window.navigation?.activation?.navigationType || 'push';
    const from = window.navigation?.activation?.from?.url || '';
    let flow = 'rise';
    if (zoomArrival && type !== 'traverse') flow = 'still';
    else if (type === 'traverse') {
      // Back into the room from a project: the project's picture (painted
      // over the home page by the script below) rises over the project page,
      // then walk-gallery.js shrinks it into its frame.
      flow = isHome && (!from || /\/project\//.test(from)) && fresh('alobi-zoom-return', 3600000) ? 'rise' : 'fall';
    }
    root.dataset.flow = flow;
    // The new page may already have its picture up (project/zoom-arrive.js).
    if (flow === 'still' && window.alobiReadyToSwap) requestAnimationFrame(() => { try { transition.skipTransition(); } catch {} });
    const done = transition.finished.catch(() => {}).then(() => { if (root.dataset.flow === flow) delete root.dataset.flow; });
    settle(done);
  });
  if (!('onpagereveal' in window)) settle();

  if (!supported) return;
  // Site links go straight to their page; the transition does the rest.
  const homeUrl = new URL(isHome ? './' : '../', location.href).href;
  const sections = { about: 'about/', architecture: 'architecture/', hci: 'hci/', pm: 'pm/', resume: 'resume/', contact: 'contact/' };
  const go = (url, label) => {
    const destination = new URL(url, location.href);
    if (destination.href === location.href) return false;
    try {
      sessionStorage.removeItem('alobi-route-reveal');
      if (destination.href === homeUrl || /ALOBI\s*\/\s*HOME/i.test(label || '')) sessionStorage.setItem('alobi-home-line-return', '1');
    } catch {}
    location.assign(destination.href);
    return true;
  };
  addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target.closest?.('a[data-route], a[data-site-route], button[data-discipline], button[data-lens-choice]');
    if (!target || target.closest('.walk-panel')) return;
    let url = '';
    if (target.tagName === 'A') {
      if (target.target && target.target !== '_self') return;
      url = target.href;
      if (new URL(url, location.href).origin !== location.origin) return;
    } else {
      const key = target.dataset.discipline || target.dataset.lensChoice;
      if (!sections[key]) return;
      url = new URL(sections[key], homeUrl).href;
    }
    if (target.dataset.returnAnchor) { try { sessionStorage.setItem('alobi-category-return-anchor', target.dataset.returnAnchor); } catch {} }
    if (go(url, target.dataset.routeLabel || target.textContent.trim())) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();

(() => {
  const storageKey = 'alobi-route-reveal';
  try {
    const rawState = sessionStorage.getItem(storageKey);
    if (!rawState) return;
    const state = JSON.parse(rawState);
    if (state?.createdAt && Date.now() - state.createdAt < 10000) {
      document.documentElement.classList.add('route-enter-pending');
      const prepaintStyle = document.createElement('style');
      prepaintStyle.id = 'route-prepaint-style';
      prepaintStyle.textContent = `
        html.route-enter-pending,
        html.route-enter-pending body { background: ${state.effect === 'line' ? '#f5f5f7' : '#171816'} !important; }
        html.route-enter-pending body > *:not(.page-transition) { visibility: hidden !important; }
        html.route-enter-pending .page-transition {
          visibility: visible !important;
          background: ${state.effect === 'line' ? '#f5f5f7' : '#171816'} !important;
        }
      `;
      document.head.append(prepaintStyle);
    } else {
      sessionStorage.removeItem(storageKey);
    }
  } catch {
    sessionStorage.removeItem(storageKey);
  }
})();

// Keep the global navigation usable when an entrance animation is interrupted,
// or when a page is restored from the browser's back/forward cache.
(() => {
  const setPanel = open => {
    const panel = document.querySelector('.index-panel');
    const menu = document.querySelector('.menu-button');
    const header = document.querySelector('.site-head');
    if (!panel || !menu) return;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close contents' : 'Open contents');
    header?.classList.toggle('menu-open', open);
  };

  // Bind the global controls from the head script so they work even while a
  // page's heavier module and images are still loading.
  document.addEventListener('click', event => {
    const menu = event.target.closest?.('.menu-button');
    const panel = document.querySelector('.index-panel');
    if (menu) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setPanel(!panel?.classList.contains('open'));
      return;
    }
    const routeLink = event.target.closest?.('a[data-route]');
    const root = document.documentElement;
    if (routeLink) {
      const destination = new URL(routeLink.href, location.href);
      if (destination.href !== location.href) {
        // Page modules provide the animated route. If one of their local
        // locks gets stranded, guarantee the same click still completes.
        setTimeout(() => {
          if (location.href !== destination.href) location.assign(destination.href);
        }, 1800);
      }
    }
    const routeIsBlocked = document.readyState === 'loading'
      || root.classList.contains('route-enter-pending')
      || root.classList.contains('route-leaving');
    if (routeLink && routeIsBlocked) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setPanel(false);
      location.assign(routeLink.href);
      return;
    }
    if (panel?.classList.contains('open') && !panel.contains(event.target)) {
      setPanel(false);
    }
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setPanel(false);
  });

  const releasePendingToolbar = () => {
    const root = document.documentElement;
    if (root.classList.contains('arch-motion-pending')) {
      root.classList.add('arch-toolbar-ready');
      root.classList.remove('arch-motion-pending');
    }
    if (root.classList.contains('about-motion-pending')) {
      root.classList.add('about-toolbar-ready');
      root.classList.remove('about-motion-pending');
    }
    root.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
  };

  const resetNavigation = () => {
    const panel = document.querySelector('.index-panel');
    const menu = document.querySelector('.menu-button');
    const header = document.querySelector('.site-head');
    const transition = document.querySelector('.page-transition');
    panel?.classList.remove('open');
    panel?.setAttribute('aria-hidden', 'true');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Open contents');
    header?.classList.remove('menu-open');
    if (transition) transition.className = 'page-transition';
    document.documentElement.classList.remove('route-leaving');
    document.body?.classList.remove('is-leaving');
    releasePendingToolbar();
  };

  // Start the safeguard immediately. Waiting for DOMContentLoaded can leave
  // the header compressed when a large image or module delays page parsing.
  setTimeout(releasePendingToolbar, 3600);

  addEventListener('pageshow', event => {
    if (event.persisted) resetNavigation();
  });
})();

// Home page, reached with the browser's Back button from a project opened in
// the room: paint the project's picture full screen before anything else, so
// the way back starts from it (it rises over the project page, see above, and
// walk-gallery.js then shrinks it into its frame).
(() => {
  try {
    const script = document.currentScript?.getAttribute('src') || '';
    if (!/^route-entry\.js/.test(script)) return; // only the home page loads it from the root
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    if (!nav || nav.type !== 'back_forward') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const record = JSON.parse(sessionStorage.getItem('alobi-zoom-return') || 'null');
    if (!record || Date.now() - record.at > 3600000) return;
    const src = typeof record.src === 'string' && /^https?:/.test(record.src) ? record.src : '';
    document.documentElement.classList.add('zoom-returning');
    const style = document.createElement('style');
    style.textContent = `html.zoom-returning body:before{content:"";position:fixed;inset:0;z-index:2147482500;background:#f5f5f7 ${src ? `url("${src.replace(/"/g, '%22')}") center/cover no-repeat` : ''}}`;
    document.head.append(style);
    // Never leave it covering the page.
    setTimeout(() => document.documentElement.classList.remove('zoom-returning'), 6000);
  } catch {}
})();
