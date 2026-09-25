// Arriving from a frame in the home page's room (walk-gallery.js): the home
// page ends on the project's picture filling the screen, so this page starts
// on exactly that picture, then the picture slides straight down, all the way
// past the bottom edge, uncovering the project page underneath. (The way back
// is the same move reversed: on the home page the picture slides up from
// below and shrinks into its frame.)
(() => {
  let hand = null;
  try {
    hand = JSON.parse(sessionStorage.getItem('alobi-zoom-hand') || 'null');
    sessionStorage.removeItem('alobi-zoom-hand');
  } catch {}
  if (!hand || !hand.at || Date.now() - hand.at > 8000) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const src = typeof hand.src === 'string' && /^https?:/.test(hand.src) ? hand.src : '';
  root.classList.add('zoom-arriving');
  // Painted before anything else on the page, so there is no gap.
  const style = document.createElement('style');
  style.textContent = `
html.zoom-arriving body:before{content:"";position:fixed;inset:0;z-index:450;background:#f5f5f7 ${src ? `url("${src.replace(/"/g, '%22')}") center/cover no-repeat` : ''}}
.zoom-arrive{position:fixed;z-index:450;left:0;top:0;width:100vw;height:100vh;overflow:hidden;pointer-events:none;background:#f5f5f7;box-shadow:0 0 0 .75px #180400;will-change:transform}
.zoom-arrive img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
`;
  document.head.append(style);

  const start = () => {
    const layer = document.createElement('div');
    layer.className = 'zoom-arrive';
    layer.setAttribute('aria-hidden', 'true');
    let img = null;
    if (src) { img = new Image(); img.decoding = 'sync'; img.alt = ''; img.src = src; layer.append(img); }
    let removed = false;
    const done = () => { if (removed) return; removed = true; layer.remove(); root.classList.remove('zoom-arriving'); };
    const play = () => {
      // Swap the painted picture for the real layer only once the layer's
      // picture is ready, so there is never a blank frame in between.
      document.body.append(layer);
      requestAnimationFrame(() => {
        root.classList.remove('zoom-arriving');
        // The picture is on screen here now: end the page handover, which
        // kept the home page's last frame on top until this moment (see
        // page-flow.css), then let the picture fall away past the bottom edge.
        requestAnimationFrame(() => { window.alobiReadyToSwap = true; try { window.alobiViewTransition?.skipTransition(); } catch {} });
        setTimeout(() => {
          const slide = layer.animate([
            { transform: 'translateY(0)' },
            { transform: `translateY(${innerHeight + 4}px)` }
          ], { duration: 1000, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
          slide.finished.then(done, done);
        }, 140);
      });
      setTimeout(done, 3200);
    };
    if (img && img.decode) img.decode().then(play, play);
    else play();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
