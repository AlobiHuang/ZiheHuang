// Site-wide inertial wheel scrolling. The page glides to where the wheel sends
// it and keeps moving briefly after the wheel stops, in the style of Lenis.
// Touch, keyboard, scrollbar and in-page links keep their native behaviour.
// Other scripts can steer it through window.siteScroll (see walk-gallery.js).
(() => {
  // Seconds for the page to cover ~63% of the remaining distance. Higher = heavier glide.
  const GLIDE = .22;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  let target = scrollY;
  let current = scrollY;
  let applied = scrollY;
  let frame = 0;
  let last = 0;

  const maxScroll = () => Math.max(0, root.scrollHeight - innerHeight);
  const clamp = value => Math.max(0, Math.min(maxScroll(), value));
  const locked = () => getComputedStyle(root).overflowY === 'hidden' || getComputedStyle(document.body).overflowY === 'hidden';

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    target = current = applied = scrollY;
  };

  const tick = now => {
    frame = 0;
    // Someone else moved the page (keyboard, scrollbar, a script): follow them.
    if (Math.abs(scrollY - applied) > 2) { stop(); return; }
    const dt = Math.min(.05, Math.max(.001, (now - (last || now - 16)) / 1000));
    last = now;
    current += (target - current) * (1 - Math.exp(-dt / GLIDE));
    if (Math.abs(target - current) < .3) current = target;
    window.scrollTo({ top: current, left: scrollX, behavior: 'instant' });
    // Remember where we asked to be rather than reading scrollY back, which
    // would force the browser to lay the page out again mid-frame.
    applied = current;
    if (current !== target) frame = requestAnimationFrame(tick);
    else last = 0;
  };

  const glideTo = value => {
    if (!frame) { current = applied = scrollY; last = 0; }
    target = clamp(value);
    if (!frame) frame = requestAnimationFrame(tick);
  };

  // An element under the pointer that can itself scroll this way keeps the wheel.
  const nestedScroller = (node, dy) => {
    for (let el = node instanceof Element ? node : node?.parentElement; el && el !== document.body && el !== root; el = el.parentElement) {
      if (el.closest('[aria-modal="true"],[data-native-scroll]')) return true;
      const style = getComputedStyle(el);
      if (!/(auto|scroll)/.test(style.overflowY) || el.scrollHeight <= el.clientHeight + 1) continue;
      if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
    }
    return false;
  };

  const onWheel = event => {
    if (reduced.matches || event.defaultPrevented || event.ctrlKey || event.shiftKey) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const dy = event.deltaY * unit;
    if (!dy || !event.cancelable) return;
    if (locked()) { if (frame) stop(); return; }
    if (nestedScroller(event.target, dy)) return;
    event.preventDefault();
    glideTo((frame ? target : scrollY) + dy);
  };

  window.siteScroll = {
    get target() { return frame ? target : scrollY; },
    get moving() { return !!frame; },
    scrollTo(value, { immediate = false } = {}) {
      if (immediate || reduced.matches) {
        stop();
        window.scrollTo({ top: clamp(value), left: scrollX, behavior: 'instant' });
        target = current = applied = scrollY;
        return;
      }
      glideTo(value);
    },
    stop
  };

  // Registered once every deferred script has run, so page-specific wheel
  // handlers (walk gallery brake, easter egg, galleries) see the wheel first
  // and can claim it with preventDefault().
  // (Deferred scripts run before DOMContentLoaded, so wait for it even when
  // readyState is already "interactive".)
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    addEventListener('wheel', onWheel, { passive: false });
  };
  if (document.readyState === 'complete') start();
  else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
    addEventListener('load', start, { once: true });
  }
  addEventListener('resize', () => { if (frame) target = clamp(target); });
})();
