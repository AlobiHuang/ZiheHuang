// The site cursor (made by spectacle.js) as a hollow square that shows which
// way the page moves. Its colour-flip blend is unchanged.
//  - While scrolling it snaps to a tall rectangle (vertical) or a wide one
//    (sideways swipes, shift-scroll, panels scrolling sideways), and back
//    to a square the moment the page stops, each change a quick morph.
//  - Inside the 3D rooms it keeps the room's direction the whole time: wide
//    in the sideways WORK walk, tall once the room has turned, in the ME room
//    and in the MY ___? room. Those sections say so with data-room-walk,
//    data-room-me and data-room-my ("x" or "y") on <html>.
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const root = document.documentElement;
  const style = document.createElement('style');
  style.textContent = `
.fx-cursor,.fx-cursor:before,.arrival-cursor,.arrival-cursor:after{border-radius:0!important}
.fx-cursor.is-scroll-y:not(.is-action){width:24px!important;height:66px!important;margin:-7px 0 0 14px!important}
.fx-cursor.is-scroll-x:not(.is-action){width:66px!important;height:24px!important;margin:14px 0 0 -7px!important}
/* A quick morph between square, tall and wide (and the larger hover shape). */
.fx-cursor{transition:width .13s cubic-bezier(.3,.7,.2,1),height .13s cubic-bezier(.3,.7,.2,1),margin .13s cubic-bezier(.3,.7,.2,1),background-color .2s,color .2s,border-color .2s,opacity .15s!important}
`;
  document.head.append(style);

  let scrolling = '', shown = '', timer = 0;
  const roomAxis = () => root.dataset.roomWalk || root.dataset.roomMe || root.dataset.roomMy || '';
  const apply = () => {
    const next = roomAxis() || scrolling;
    if (next === shown) return;
    shown = next;
    const cursor = document.querySelector('.fx-cursor');
    if (!cursor) return;
    cursor.classList.toggle('is-scroll-y', shown === 'y');
    cursor.classList.toggle('is-scroll-x', shown === 'x');
  };
  const moving = axis => {
    scrolling = axis;
    apply();
    clearTimeout(timer);
    timer = setTimeout(() => { scrolling = ''; apply(); }, 90);
  };

  // The page (or a panel inside it) scrolled.
  const lefts = new WeakMap();
  let lastY = scrollY, lastT = performance.now();
  document.addEventListener('scroll', event => {
    const target = event.target;
    if (target === document || target === root || target === document.body) {
      // Only while the page is visibly moving: the slow last pixels of the
      // smooth-scroll glide already count as stopped.
      const now = performance.now(), speed = Math.abs(scrollY - lastY) / Math.max(1, now - lastT);
      lastY = scrollY; lastT = now;
      if (speed > .06) moving('y');
      return;
    }
    if (!(target instanceof Element)) return;
    const left = target.scrollLeft, before = lefts.get(target);
    lefts.set(target, left);
    moving(before !== undefined && before !== left ? 'x' : 'y');
  }, { capture: true, passive: true });

  // A sideways swipe or shift-scroll reads as sideways even before anything moves.
  addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 1) moving('x');
  }, { passive: true });

  // Entering or leaving a room.
  new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ['data-room-walk', 'data-room-me', 'data-room-my'] });
})();
