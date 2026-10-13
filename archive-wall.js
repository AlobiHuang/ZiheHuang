// The personal archive: an endless wall of 47 photographs between MY ___?
// and LENS, played by scrolling alone.
//
//  - In: the MY ___? page lifts off like a sheet, and the wall is already
//    lying underneath it (the stage holds still while the section's top edge
//    travels up the screen, so the edge uncovers it).
//  - Through: the wall keeps drifting up and slightly sideways as you scroll,
//    with a title card for a moment. With a mouse it can also be dragged.
//  - Out: LENS slides up over the still wall, which sinks back a little.
//
// The wall is one tile of photos (eight columns, cut to equal height) repeated
// in both directions, so it never ends. Photos come from
// assets/personal-gallery/thumbs (small copies of the originals).
const section = document.querySelector('[data-archive-wall]');
if (section) {
  const stage = section.querySelector('.aw-stage');
  const plane = section.querySelector('.aw-plane');
  const card = section.querySelector('.aw-card');
  const veil = section.querySelector('.aw-veil');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');

  // 47 photos: portrait (3:4) or landscape (4:3), as in manifest.json.
  const PORTRAIT = new Set([1, 4, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23, 27, 28, 29, 31, 33, 34, 35, 37, 38, 41, 42, 43, 47]);
  const photos = Array.from({ length: 47 }, (_, i) => ({ n: i + 1 }));
  const ratioOf = n => (PORTRAIT.has(n) ? 4 / 3 : 3 / 4); // height / width
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };

  let tiles = [], TW = 1, TH = 1, w = 0, h = 0, loaded = false;
  const COLS = 8;

  const build = () => {
    w = stage.clientWidth; h = stage.clientHeight;
    const narrow = w < 700;
    const colW = narrow ? 128 : Math.round(clamp(w * .15, 170, 250));
    const gap = narrow ? 14 : 26;
    const pitch = colW + gap;
    // Deal the photos into columns (always to the shortest), starting each
    // column at a different point so neighbours never repeat.
    const order = photos.map((p, i) => photos[(i * 17) % photos.length]);
    const cols = Array.from({ length: COLS }, () => ({ items: [], height: 0 }));
    order.forEach(p => {
      const col = cols.reduce((a, b) => (b.height < a.height ? b : a));
      const ph = colW * ratioOf(p.n);
      col.items.push({ n: p.n, h: ph });
      col.height += ph + gap;
    });
    TH = Math.round(Math.max(...cols.map(c => c.height)));
    TW = COLS * pitch;
    // Shorter columns share out the difference, so every column ends exactly
    // where the next tile begins.
    cols.forEach(col => {
      const extra = (TH - col.height) / col.items.length;
      col.items.forEach(item => { item.h += extra; });
    });
    const nx = Math.ceil(w / TW) + 1, ny = Math.ceil(h / TH) + 1;
    plane.textContent = '';
    tiles = [];
    for (let ty = 0; ty < ny; ty++) for (let tx = 0; tx < nx; tx++) {
      const tile = document.createElement('div');
      tile.className = 'aw-tile';
      tile.style.width = `${TW}px`; tile.style.height = `${TH}px`;
      cols.forEach((col, ci) => {
        let y = 0;
        col.items.forEach(item => {
          const f = document.createElement('figure');
          f.className = 'aw-photo';
          f.style.cssText = `left:${ci * pitch + gap / 2}px;top:${y.toFixed(1)}px;width:${colW}px;height:${item.h.toFixed(1)}px`;
          const label = String(item.n).padStart(2, '0');
          f.innerHTML = `<img alt="" decoding="async" data-src="assets/personal-gallery/thumbs/personal-${label}.webp"><figcaption>P—${label}</figcaption>`;
          tile.append(f);
          y += item.h + gap;
        });
      });
      tile.dataset.tx = tx; tile.dataset.ty = ty;
      plane.append(tile);
      tiles.push(tile);
    }
    if (loaded) load();
    wake();
  };
  const load = () => {
    loaded = true;
    plane.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  };

  // Dragging (mouse and pen; on touch the page just scrolls).
  let dragX = 0, dragY = 0, vx = 0, vy = 0, dragging = null;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    dragging = { x: event.clientX, y: event.clientY, t: performance.now(), moved: false };
    stage.setPointerCapture(event.pointerId);
    vx = vy = 0;
  });
  stage.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - dragging.x, dy = event.clientY - dragging.y;
    const now = performance.now(), dt = Math.max(1, now - dragging.t);
    if (Math.abs(dx) + Math.abs(dy) > 3) { dragging.moved = true; stage.classList.add('is-dragging'); }
    dragX += dx; dragY += dy;
    vx = dx / dt * 16; vy = dy / dt * 16;
    dragging.x = event.clientX; dragging.y = event.clientY; dragging.t = now;
    wake();
  });
  const release = () => { if (!dragging) return; dragging = null; stage.classList.remove('is-dragging'); wake(); };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  // The site cursor says DRAG over the wall (see my-picker.js for why twice).
  const labelCursor = () => {
    const cursor = document.querySelector('.fx-cursor');
    if (!cursor || !stage.matches(':hover')) return;
    const label = cursor.querySelector('span');
    if (label) label.textContent = 'DRAG';
    cursor.classList.add('is-action', 'is-label');
  };
  stage.addEventListener('pointerover', event => { if (event.pointerType === 'mouse') { labelCursor(); requestAnimationFrame(labelCursor); } });
  stage.addEventListener('pointerleave', () => document.querySelector('.fx-cursor')?.classList.remove('is-action', 'is-label'));

  let frame = 0, visible = false;
  const render = () => {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const span = section.offsetHeight / h; // screens this section is tall
    const s = -rect.top / h;               // -1 as it enters, span as it leaves
    // Hold the stage still on screen while the section's edges pass.
    let hold = 0;
    if (rect.top > 0) hold = -rect.top;
    else if (rect.bottom < h) hold = h - rect.bottom;
    stage.style.transform = hold ? `translate3d(0,${hold.toFixed(1)}px,0)` : '';
    // Inertia after a drag.
    if (!dragging && (Math.abs(vx) > .05 || Math.abs(vy) > .05)) { dragX += vx; dragY += vy; vx *= .93; vy *= .93; }
    const move = reduced.matches ? 0 : 1;
    const camX = (s + 1) * TW * .07 * move - dragX;
    const camY = (s + 1) * h * .55 * move - dragY;
    const ox = ((camX % TW) + TW) % TW, oy = ((camY % TH) + TH) % TH;
    tiles.forEach(tile => {
      tile.style.transform = `translate3d(${(tile.dataset.tx * TW - ox).toFixed(1)}px,${(tile.dataset.ty * TH - oy).toFixed(1)}px,0)`;
    });
    // In: the wall settles as it is uncovered. Out: it sinks back under LENS.
    const enter = smooth(s + 1), leave = smooth(s - (span - 1));
    const scale = reduced.matches ? 1 : 1.08 - .08 * enter - .06 * leave;
    plane.style.transform = `scale(${scale.toFixed(4)})`;
    veil.style.opacity = String((.28 * leave).toFixed(3));
    // The title card, for a stretch in the middle.
    const show = smooth((s - .15) / .45) * (1 - smooth((s - (span - 1.9)) / .5));
    card.style.opacity = show.toFixed(3);
    card.style.transform = `translate3d(0,${((1 - show) * 24).toFixed(1)}px,0)`;
    card.style.visibility = show > .01 ? 'visible' : 'hidden';
    if (visible && (dragging || Math.abs(vx) > .05 || Math.abs(vy) > .05)) wake();
  };
  function wake() { if (!frame && visible) frame = requestAnimationFrame(render); }

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) wake();
  }, { rootMargin: '10% 0px' }).observe(section);
  // Start loading the photos a couple of screens before the wall arrives.
  new IntersectionObserver(entries => { if (entries[0].isIntersecting && !loaded) load(); }, { rootMargin: '200% 0px' }).observe(section);
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', build);
  build();
}
