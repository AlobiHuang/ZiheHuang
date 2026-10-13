// The site's own scroll bar, drawn in the site's ink, replacing the browser's.
//
// A hairline rail runs down the right edge with a thumb for the part of the
// page on screen. Drag the thumb to move through the page directly; press
// anywhere on the rail to glide there. Sections marked with data-rail="NAME"
// get a tick on the rail that names itself on hover and can be clicked.
// Touch screens keep their own scrolling and don't get the rail.
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return;
  const root = document.documentElement;

  const style = document.createElement('style');
  style.textContent = `
html.has-rail{scrollbar-width:none}
html.has-rail::-webkit-scrollbar{display:none;width:0;height:0}
.site-rail{position:fixed;z-index:2147482990;top:0;right:0;bottom:0;width:22px;cursor:pointer;mix-blend-mode:difference;touch-action:none;-webkit-user-select:none;user-select:none}
.site-rail-line{position:absolute;top:10px;bottom:10px;right:9px;width:1px;background:#fff;opacity:.28;transition:opacity .25s}
.site-rail-thumb{position:absolute;z-index:2;top:10px;right:8px;width:3px;min-height:28px;background:#fff;border-radius:2px;transition:width .2s,right .2s;will-change:transform}
.site-rail:hover .site-rail-line,.site-rail.is-dragging .site-rail-line{opacity:.55}
.site-rail:hover .site-rail-thumb,.site-rail.is-dragging .site-rail-thumb{width:5px;right:7px}
.site-rail.is-dragging{cursor:grabbing}
.site-rail-tick{position:absolute;right:7px;width:5px;height:1px;background:#fff;opacity:.6;transform:translateY(-.5px)}
.site-rail-tick:after{content:"";position:absolute;inset:-5px -6px}
.site-rail-tick span,.site-rail-readout{position:absolute;right:14px;top:50%;transform:translateY(-50%);padding:3px 6px;background:#fff;color:#000;font:600 9px/1 "DM Mono",ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.1em;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s}
.site-rail-tick:hover span,.site-rail.is-dragging .site-rail-readout{opacity:1}
.site-rail:hover .site-rail-tick span{opacity:.9}
html.has-rail .fx-counter{right:34px;transition:opacity .2s}
html.rail-dragging .fx-counter{opacity:0}
@media print{.site-rail{display:none}}
`;
  document.head.append(style);

  const rail = document.createElement('div');
  rail.className = 'site-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<i class="site-rail-line"></i><i class="site-rail-thumb"><span class="site-rail-readout"></span></i>';
  const thumb = rail.querySelector('.site-rail-thumb');
  const readout = rail.querySelector('.site-rail-readout');

  const PAD = 10;
  let frame = 0, drag = null, ticks = [];
  const maxScroll = () => Math.max(1, root.scrollHeight - innerHeight);
  const trackLength = () => innerHeight - PAD * 2;
  const thumbLength = () => Math.max(28, trackLength() * Math.min(1, innerHeight / root.scrollHeight));
  const scrollToY = (y, immediate) => {
    const value = Math.max(0, Math.min(maxScroll(), y));
    if (window.siteScroll) window.siteScroll.scrollTo(value, { immediate });
    else scrollTo({ top: value, behavior: immediate ? 'instant' : 'smooth' });
  };
  // Position on the rail (px from its top) for a scroll position, and back.
  const railFor = y => (y / maxScroll()) * (trackLength() - thumbLength());
  const scrollFor = railY => (railY / Math.max(1, trackLength() - thumbLength())) * maxScroll();

  const render = () => {
    frame = 0;
    const length = thumbLength();
    thumb.style.height = `${length.toFixed(1)}px`;
    thumb.style.transform = `translate3d(0,${railFor(scrollY).toFixed(1)}px,0)`;
    rail.style.display = root.scrollHeight > innerHeight + 2 ? '' : 'none';
    if (drag) readout.textContent = `${String(Math.round(scrollY / maxScroll() * 100)).padStart(2, '0')}%`;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };

  // Is the pointer on the thumb? Checked by position, with a little slack, so
  // ticks or labels lying over it never steal a drag.
  const overThumb = event => {
    const box = thumb.getBoundingClientRect();
    return event.clientY >= box.top - 4 && event.clientY <= box.bottom + 4;
  };

  // Section ticks, placed where each marked section starts.
  const buildTicks = () => {
    ticks.forEach(tick => tick.remove());
    ticks = [...document.querySelectorAll('[data-rail]')].map(section => {
      const tick = document.createElement('b');
      tick.className = 'site-rail-tick';
      tick.innerHTML = `<span>${section.dataset.rail}</span>`;
      const top = section.getBoundingClientRect().top + scrollY;
      tick.style.top = `${(PAD + railFor(Math.min(top, maxScroll())) + thumbLength() / 2).toFixed(1)}px`;
      tick.addEventListener('pointerdown', event => {
        // The thumb wins when it sits over a tick (e.g. HOME at the very top).
        if (overThumb(event)) return;
        event.stopPropagation(); scrollToY(top, false);
      });
      rail.append(tick);
      return tick;
    });
  };

  rail.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    const onThumb = overThumb(event);
    const railTop = rail.getBoundingClientRect().top + PAD;
    if (!onThumb) {
      // Press on the rail: glide so the thumb centres where you pressed, and
      // keep hold to go on dragging from there.
      const railY = event.clientY - railTop - thumbLength() / 2;
      scrollToY(scrollFor(railY), false);
      drag = { offset: thumbLength() / 2, railTop };
    } else {
      drag = { offset: event.clientY - railTop - railFor(scrollY), railTop };
    }
    rail.setPointerCapture?.(event.pointerId);
    rail.classList.add('is-dragging');
    root.classList.add('rail-dragging');
    schedule();
  });
  rail.addEventListener('pointermove', event => {
    if (!drag) return;
    scrollToY(scrollFor(event.clientY - drag.railTop - drag.offset), true);
  });
  const end = () => { drag = null; rail.classList.remove('is-dragging'); root.classList.remove('rail-dragging'); };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);

  const start = () => {
    root.classList.add('has-rail');
    document.body.append(rail);
    render();
    buildTicks();
    new ResizeObserver(() => { schedule(); buildTicks(); }).observe(document.body);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
