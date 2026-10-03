// The contents menu: a sheet of paper that drops from the header with a
// short index on the left and one large window on the right. Pointing at an
// entry types its name into the window (with the same underscore caret as the
// home page) on a plain white window.
//
// It replaces the old full-screen list. The old panel (.index-panel) stays in
// each page's markup, hidden, and its links still do the navigating: choosing
// an entry here clicks the matching one there, so every page keeps its own
// route transitions.
import Waves from './Waves.js?v=20260925-perf-1';

const oldPanel = document.querySelector('.index-panel');
const menuButton = document.querySelector('.menu-button');
const header = document.querySelector('.site-head');
if (oldPanel && menuButton) {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');

  const info = {
    home: { word: 'HOME', scale: 'COVER', note: 'Back to the start.', theme: 'blank' },
    about: { word: 'ABOUT', scale: 'PROFILE', note: 'Who I am, and how I got here.', theme: 'blank' },
    architecture: { word: 'ARCH', scale: '10²', note: 'Built environments.', theme: 'blank' },
    hci: { word: 'PD', scale: '10⁰', note: 'Product design. Under construction.', theme: 'blank' },
    pm: { word: 'PM', scale: '10⁻²', note: 'Leadership.', theme: 'blank' },
    resume: { word: 'RESUME', scale: 'RECORD', note: 'Selected experience.', theme: 'blank' },
    contact: { word: 'CONTACT', scale: 'CHANNEL', note: 'ziheh@andrew.cmu.edu', theme: 'blank' }
  };
  const keyOf = element => {
    const key = element.dataset.navKey || element.dataset.discipline || '';
    if (key) return key;
    const label = element.querySelector('b')?.textContent.trim().toLowerCase() || '';
    if (label.startsWith('home')) return 'home';
    if (label.startsWith('about')) return 'about';
    if (label.startsWith('arch')) return 'architecture';
    if (label === 'pd') return 'hci';
    if (label === 'pm') return 'pm';
    if (label.startsWith('resume')) return 'resume';
    if (label.startsWith('contact')) return 'contact';
    return label;
  };
  const sources = [...oldPanel.querySelectorAll('nav a, nav button')];
  const entries = sources.map((source, index) => {
    const key = keyOf(source);
    const label = source.querySelector('b')?.textContent.trim() || source.textContent.trim();
    return { source, key, label, number: String(index + 1).padStart(2, '0'), current: source.getAttribute('aria-current') === 'page', ...(info[key] || { word: label.toUpperCase(), scale: '', note: '', theme: 'blank' }) };
  });
  const socials = [...oldPanel.querySelectorAll('.index-socials a')];

  // ---- markup ------------------------------------------------------------
  const menu = document.createElement('div');
  menu.className = 'sm';
  menu.id = 'site-menu';
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-label', 'Contents');
  menu.hidden = true;
  menu.innerHTML = `
    <div class="sm-sheet">
      <nav class="sm-index" aria-label="Portfolio contents">
        <p class="sm-kicker">Index</p>
        <ol></ol>
        <p class="sm-links"></p>
      </nav>
      <div class="sm-stage" data-theme="paper" aria-hidden="true">
        <span class="sm-field sm-field-light"><canvas></canvas></span>
        <span class="sm-field sm-field-dark"><canvas></canvas></span>
        <span class="sm-meta"><b></b><i></i></span>
        <span class="sm-go">Enter<i></i></span>
        <span class="sm-word"><span class="sm-typed"></span><span class="sm-caret">_</span></span>
        <span class="sm-note"></span>
      </div>
    </div>`;
  const list = menu.querySelector('ol');
  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    const control = document.createElement(entry.source.tagName === 'A' ? 'a' : 'button');
    if (control.tagName === 'A') control.href = entry.source.href;
    else control.type = 'button';
    control.className = 'sm-item';
    control.style.setProperty('--i', index);
    if (entry.current) { control.classList.add('is-current'); control.setAttribute('aria-current', 'page'); }
    control.innerHTML = `<span>${entry.number}</span><b>${entry.label}</b>`;
    control.addEventListener('pointerenter', () => show(entry));
    control.addEventListener('focus', () => show(entry));
    control.addEventListener('click', event => { event.preventDefault(); choose(entry); });
    entry.control = control;
    item.append(control);
    list.append(item);
  });
  const links = menu.querySelector('.sm-links');
  socials.forEach(link => {
    const copy = document.createElement('a');
    copy.href = link.href;
    if (link.target) { copy.target = link.target; copy.rel = 'noreferrer'; }
    copy.textContent = /linkedin/i.test(link.href) ? 'LinkedIn' : /instagram/i.test(link.href) ? 'Instagram' : /mailto/i.test(link.href) ? 'Email' : link.textContent.trim();
    links.append(copy);
  });
  document.body.append(menu);
  menuButton.setAttribute('aria-controls', 'site-menu');

  const stage = menu.querySelector('.sm-stage');
  const typed = menu.querySelector('.sm-typed');
  const meta = menu.querySelector('.sm-meta');
  const note = menu.querySelector('.sm-note');
  const home = entries.find(entry => entry.current) || entries[0];

  // ---- the window ------------------------------------------------------------
  let shown = null, typing = 0, text = '';
  const typeTo = word => {
    clearTimeout(typing);
    if (reduced.matches) { text = word; typed.textContent = word; return; }
    stage.classList.add('is-typing');
    const step = () => {
      if (!word.startsWith(text)) { text = text.slice(0, -1); typed.textContent = text; typing = setTimeout(step, 28); return; }
      if (text.length < word.length) { text = word.slice(0, text.length + 1); typed.textContent = text; typing = setTimeout(step, 62); return; }
      typing = setTimeout(() => stage.classList.remove('is-typing'), 500);
    };
    step();
  };
  function show(entry) {
    if (shown === entry) return;
    shown = entry;
    entries.forEach(item => item.control.classList.toggle('is-shown', item === entry));
    stage.dataset.theme = entry.theme;
    meta.querySelector('b').textContent = entry.number;
    meta.querySelector('i').textContent = entry.scale;
    note.textContent = entry.note;
    typeTo(entry.word);
  }
  menu.querySelector('.sm-index').addEventListener('pointerleave', () => show(home));

  // Line fields run only while the menu is open.
  let stops = [];
  const startFields = () => {
    if (stops.length || reduced.matches) return;
    const common = { waveSpeedX: .02, waveSpeedY: .01, waveAmpX: 40, waveAmpY: 20, friction: .9, tension: .01, maxCursorMove: 120, xGap: 13, yGap: 38, pixelRatioCap: 1.25, targetFPS: 45, backgroundColor: 'transparent' };
    [['.sm-field-light', 'rgba(29, 29, 31, 0.26)'], ['.sm-field-dark', 'rgba(245, 245, 247, 0.4)']].forEach(([selector, lineColor]) => {
      const field = menu.querySelector(selector);
      stops.push(Waves({ container: field, canvas: field.querySelector('canvas'), lineColor, ...common }));
    });
  };
  const stopFields = () => { stops.forEach(stop => stop()); stops = []; };

  // ---- open / close ------------------------------------------------------------
  let open = false, closeTimer = 0;
  const setOpen = next => {
    if (next === open) return;
    open = next;
    clearTimeout(closeTimer);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close contents' : 'Open contents');
    header?.classList.toggle('menu-open', open);
    root.classList.toggle('sm-open', open);
    root.classList.toggle('sm-closing', !open);
    if (open) {
      // The site cursor may still be wearing the menu button's hover label.
      document.querySelector('.fx-cursor')?.classList.remove('is-action', 'is-label');
      menu.hidden = false;
      shown = null; text = ''; typed.textContent = '';
      void menu.offsetWidth;
      menu.classList.add('is-open');
      // (The windows are plain paper now; the line fields are not started.)
      setTimeout(() => { if (open) show(home); }, reduced.matches ? 0 : 380);
      (home.control || entries[0]?.control)?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      clearTimeout(typing);
      closeTimer = setTimeout(() => { if (!open) { menu.hidden = true; stopFields(); root.classList.remove('sm-closing'); } }, reduced.matches ? 0 : 560);
    }
  };
  const choose = entry => {
    // With the page flow (route-entry.js) the next page rises straight over
    // the open menu, so there is no need to lift it first.
    if (window.alobiFlow && !entry.current) { entry.source.click(); return; }
    setOpen(false);
    // The page's own link does the navigating, with its own transition.
    setTimeout(() => entry.source.click(), reduced.matches ? 0 : 180);
  };

  // Take the menu button before the older handlers in route-entry.js and the
  // page scripts, which would open the old panel.
  addEventListener('click', event => {
    // The ZH logo always goes back to the main page. On the home page itself
    // its link only points at #top, so with the menu open close the menu and
    // jump to the top underneath it as the sheet lifts.
    const logo = open && event.target.closest?.('.site-head .identity');
    if (logo) {
      const url = new URL(logo.href, location.href);
      if (url.pathname === location.pathname) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen(false);
        if (window.siteScroll?.scrollTo) window.siteScroll.scrollTo(0, { immediate: true });
        else scrollTo(0, 0);
        if (location.hash) history.replaceState(null, '', location.pathname + location.search);
        return;
      }
    }
    const button = event.target.closest?.('.menu-button');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setOpen(!open);
  }, true);
  addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); setOpen(false); menuButton.focus({ preventScroll: true }); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const controls = entries.map(entry => entry.control);
      const at = controls.indexOf(document.activeElement);
      const next = controls[(at + (event.key === 'ArrowDown' ? 1 : -1) + controls.length) % controls.length];
      next?.focus();
    }
  }, true);
  // The page underneath stays put while the menu is open.
  menu.addEventListener('wheel', event => { event.preventDefault(); event.stopPropagation(); }, { passive: false });
  menu.addEventListener('touchmove', event => { if (!event.target.closest('.sm-index')) event.preventDefault(); }, { passive: false });
  // Coming back with the Back button: closed.
  addEventListener('pageshow', event => { if (event.persisted) { open = true; setOpen(false); menu.hidden = true; stopFields(); } });
  if (!fine.matches) menu.classList.add('is-touch');
}
