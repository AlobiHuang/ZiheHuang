import heroEntrance from '../hero-entrance.js?v=20260916-speed-1265';

const hero = document.querySelector('.hci-blank-hero');
const field = document.querySelector('[data-hci-field]');
const typeTarget = document.querySelector('[data-hci-title-type]');
const title = typeTarget?.closest('.hci-uiux-title');

if (hero && field && typeTarget && title) {
  heroEntrance({ field, typeTarget, title, hero, text: 'UIUX' });
}

const panel = document.querySelector('.index-panel');
const menu = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-head');

if (panel && menu && siteHeader) {
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
}
