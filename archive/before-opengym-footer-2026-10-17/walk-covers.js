// Oct 13: animated covers for the product frames in the WORK walk (styles in walk-covers.css).
// walk-gallery.js puts coverMarkup(kind) in a frame's picture window and calls startCover().
// Each cover is a loop of scenes: data-scenes lists when each scene starts (ms) and data-loop
// is the loop's length. A cover only runs while it is on screen; with reduced motion it rests
// on one representative scene (data-still).

// The real OpenGym logo (cmuopengym.com).
const OPENGYM_LOGO = 'https://cmuopengym.com/images/light_mode_logo.png';
// Its gym photos (uc = Cohon Lower, ucA1 = Cohon Upper, tepper = Tepper).
const OG_IMAGES = 'https://cmuopengym.com/images/';

const markup = {
  // CMUsed: its wordmark holds still while the marketplace's real categories roll past;
  // when the reel stops on Home Decor, a real listing card drops in.
  cmused: (b) => `<div class="walk-cover wc-cm" data-reel aria-hidden="true">
    <span class="wc-brand">CMUsed</span><div class="wc-reel"><ul></ul></div><div class="wc-fade"></div>
    <img class="wc-listing" src="${b}assets/pd/cmused-card.webp?v=2" alt="" loading="lazy" decoding="async"></div>`,
  // Glimpse (Oct 16): one phone on linen playing "Your world, filling in", the advertising video
  // made from the app: the circle of your photos fills year by year, 23.0 GB kept off your iPhone,
  // the photos land across the world, then gather into the hour-dial logo. The earlier three-phone
  // cover is in archive/before-glimpse-cover-2026-10-16/.
  glimpse: (b) => `<div class="walk-cover wc-gl2" aria-hidden="true">
    <div class="wc-one"><video muted playsinline loop preload="metadata" poster="${b}assets/pd/glimpse/v3/glimpse-world-filling.jpg?v=cosmos-1"><source src="${b}assets/pd/glimpse/v3/glimpse-world-filling.mp4?v=cosmos-1" type='video/mp4; codecs="avc1.640028"'><source src="${b}assets/pd/glimpse/v3/glimpse-world-filling.webm?v=cosmos-1" type="video/webm"></video></div></div>`,
  // OpenGym: a visit through the app, rebuilt from its real screens with illustrative
  // numbers (the live counter is offline, so the real site reads 0 everywhere): the logo,
  // the three gyms, a click on Cohon Lower, its page, and a scroll to "How busy it usually is".
  opengym: (b) => {
    const gauge = v => `<svg viewBox="0 0 100 56"><path class="wc-track" d="M8 50 A42 42 0 0 1 92 50" stroke-width="12" fill="none" stroke-linecap="round"/><path class="wc-fill" style="--v:${v}" d="M8 50 A42 42 0 0 1 92 50" stroke-width="12" fill="none" stroke-linecap="round" pathLength="100"/></svg>`;
    const card = (img, name, v, close) => `<div class="wc-card"><div class="wc-photo" style="background-image:url(${OG_IMAGES}${img})"></div><b class="wc-name">${name}</b><div class="wc-sg">${gauge(v)}<b>${v}%</b></div><span class="wc-close">${close}</span></div>`;
    // a day, 7am–11pm: measured (red) until 4pm, right now (5pm), then the usual level (grey)
    const typical = [12, 18, 22, 28, 35, 30, 33, 38, 45, 52, 64, 78, 74, 66, 50, 34, 20];
    const measured = [10, 16, 25, 31, 38, 34, 36, 41, 48, 57];
    const bars = typical.map((t, k) => k < measured.length ? `<u class="m" style="--h:${measured[k]};--i:${k}"></u>`
      : k === 10 ? `<u class="n" style="--h:62;--i:${k}"></u>` : `<u style="--h:${t};--i:${k}"></u>`).join('');
    const hours = ['7am', '', '9am', '', '11am', '', '1pm', '', '3pm', '', '5pm', '', '7pm', '', '9pm', '', ''].map(h => `<span>${h}</span>`).join('');
    const grid = [100, 75, 50, 25, 0].map(p => `<i style="top:${(.6 + 9.4 * (1 - p / 100)).toFixed(2)}cqw"><span>${p}%</span></i>`).join('');
    return `<div class="walk-cover wc-og" data-scenes="0,1000,4300,5300,8000,11000" data-loop="12200" data-still="4" aria-hidden="true">
    <div class="wc-grain"></div>
    <div class="wc-browser"><div class="wc-bar"><i></i><i></i><i></i><b></b></div>
      <div class="wc-page"><div class="wc-scroll">
        <img class="wc-mark" src="${OPENGYM_LOGO}" alt="" decoding="async">
        <span class="wc-tagline wc-fade">Beat the rush - see gym occupancy in real-time!</span><i class="wc-rule wc-fade"></i>
        <div class="wc-home">
          ${card('uc.jpg', 'Cohon Fitness Center Lower', 62, 'Closes in 6h 16m (today at 11:00 PM)')}
          ${card('ucA1.jpg', 'Cohon Fitness Center Upper', 38, 'Closes in 6h 16m (today at 11:00 PM)')}
          ${card('tepper.jpg', 'Tepper Fitness Center', 21, 'Closes in 3h 16m (today at 8:00 PM)')}
          <div class="wc-foot"><b>Open Gym</b><span>© 2026</span><i></i><small>Copyright (c) 2025 Carnegie Mellon University Business Technology Group. All rights reserved.</small></div>
        </div>
        <div class="wc-hero" style="background-image:url(${OG_IMAGES}uc.jpg)"></div>
        <div class="wc-detail">
          <span class="wc-back">‹&nbsp;&nbsp;Back</span>
          <div class="wc-htext"><b>Cohon Fitness Center Lower</b><span>The first floor weight room of the Cohon University Center: squat racks, free weights, and selectorized machines.<br>5000 Forbes Ave, Pittsburgh, PA 15213</span></div>
          <div class="wc-hours"><b>Operating Hours</b><span><em>Mon–Fri</em>6:30am – 11pm</span><span><em>Sat–Sun</em>9am – 9pm</span></div>
          <div class="wc-bg">${gauge(62)}<b data-pct>0%</b><small>of max occupancy</small></div>
          <span class="wc-count" data-count>0 of 94 inside</span><span class="wc-livetag">LIVE · updated just now</span>
          <span class="wc-pill">Open until 11pm</span>
          <b class="wc-h2">How busy it usually is</b>
          <div class="wc-stat wc-s1"><small>BUSIEST HOURS ON AVERAGE</small><b>5pm – 8pm</b><span>About 78% full, from 72 days</span></div>
          <div class="wc-stat wc-s2"><small>LEAST BUSY HOURS ON AVERAGE</small><b>7am – 9am</b><span>About 14% full, from 72 days</span></div>
          <div class="wc-stat wc-s3"><small>TYPICAL RIGHT NOW</small><b>Busier than usual</b><span>62% now vs 49% typical</span></div>
          <span class="wc-day">‹&nbsp; TUESDAY &nbsp;›<em>Today</em></span>
          <div class="wc-chart">${grid}<div class="wc-bars">${bars}</div><div class="wc-hrs">${hours}</div></div>
          <span class="wc-legend"><span style="--c:#dc2626">Measured today</span><span style="--c:#f87171">Right now</span><span style="--c:#e5e7eb">Typical</span></span>
        </div>
      </div></div>
      <span class="wc-pointer"><svg viewBox="0 0 13 21" shape-rendering="crispEdges"><path d="M.5 .5 V17.5 L4.5 13.5 L7.5 20.5 L9.5 19.5 L6.5 12.5 H12.5 Z" fill="#fff" stroke="#000" stroke-width="1" stroke-linejoin="miter"/></svg></span>
    </div></div>`;
  },
};

// base: the path from the page to the site root ('' on the home page, '../' on hci/).
export function coverMarkup(kind, base = '') {
  return markup[kind] ? markup[kind](base) : '';
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const whenOnScreen = (el, on, off) => new IntersectionObserver(([e]) => (e.isIntersecting ? on : off)(), { threshold: .2 }).observe(el);

function scenes(cover) {
  const times = cover.dataset.scenes.split(',').map(Number), loop = +cover.dataset.loop;
  const set = n => { if (cover.dataset.scene !== String(n)) { cover.dataset.scene = n; cover.dispatchEvent(new CustomEvent('scene', { detail: n })); } };
  if (reduced()) { set(+cover.dataset.still); return; }
  let timers = [], running = false;
  const play = () => { times.forEach((t, n) => timers.push(setTimeout(() => set(n), t))); timers.push(setTimeout(play, loop)); };
  whenOnScreen(cover,
    () => { if (!running) { running = true; play(); } },
    () => { if (running) { running = false; timers.forEach(clearTimeout); timers = []; set(0); } });
}

function reel(cover) {
  // One wheel, spinning for ever: five copies of the list, with the active word kept in the
  // middle copy, so there are always 13+ categories above and below it (about 6 show on each
  // side). After a full turn it jumps back one copy, to an identical-looking spot, with the
  // fades switched off for that instant, so the jump can't be seen.
  const words = ['Clothing', 'Furniture', 'Electronics', 'Rideables', 'Appliances', 'Home Decor', 'Other'];
  const ul = cover.querySelector('.wc-reel ul'), n = words.length, COPIES = 5;
  const list = Array.from({ length: COPIES }, () => words).flat();
  ul.innerHTML = list.map(w => `<li>${w}</li>`).join('');
  const items = [...ul.children];
  let i = 2 * n, timer = 0;
  const place = animate => {
    ul.style.transition = animate ? 'transform .75s cubic-bezier(.77,0,.175,1)' : 'none';
    ul.style.transform = `translateY(${-i * 5.6}cqw)`;
    items.forEach((li, k) => { const d = Math.abs(k - i); li.className = d === 0 ? 'wc-on' : d === 1 ? 'wc-d1' : ''; });
    cover.classList.toggle('wc-show-card', list[i] === 'Home Decor');
  };
  const snapBack = () => {
    ul.classList.add('wc-snap'); i -= n; place(false);
    void ul.offsetHeight; ul.classList.remove('wc-snap');
  };
  if (reduced()) { i = 2 * n + words.indexOf('Home Decor'); place(false); return; }
  place(false);
  const step = () => {
    i++; place(true);
    if (i >= 3 * n) setTimeout(snapBack, 800); // after the move has settled
    timer = setTimeout(step, 1500);
  };
  whenOnScreen(cover, () => { clearTimeout(timer); timer = setTimeout(step, 1200); }, () => clearTimeout(timer));
}

function glimpse(cover) {
  // The middle phone plays the real Now-swipe recording at 2×. Measured from its frames, the
  // app changes page at 1.80 s (4 → 5 pm), 3.80 s (6 pm), 5.80 s (7 pm) and 7.80 s (8 pm),
  // the new page coming in from the right. Scene 2 holds 4 pm; in scene 3 the side phones land
  // and the screen swipes on to 8 pm. The background is the app's own page colour for the hour on
  // screen; at each change the new colour sweeps in from the right behind a soft gradient edge,
  // timed by the video's own clock so the edge crosses the middle on the frame the page changes.
  //
  // Oct 13: the side phones are recordings too. Your world (left) shows 2026 at 4 pm, then changes
  // at 2.8 s (2025), 4.2 s (2024), 5.5 s (2023) and 6.8 s (All years, for 8 pm); it is steered from the middle video's clock so
  // each year lands on the frame its hour does. The camera (right) plays 7.0–13.2 s of its
  // recording at 1×: the looks, the shot at 10.7 s, and the rating card from 11.5 s, held there.
  // Oct 14: tighter loop (11.2 s): 4 pm holds ~1.4 s, 8 pm ~1.15 s (the rating card still shows
  // ~1.7 s), and the corners close in ~0.6 s after the phones fade.
  const video = cover.querySelector(".wc-mid video");
  const left = cover.querySelector(".wc-left video"), right = cover.querySelector(".wc-right video");
  const colours = ["#ebb76c", "#e6a15d", "#cb6f47", "#92564d", "#4d4661"]; // 4–8 pm
  const changes = [1.77, 3.77, 5.77, 7.77]; // 1.80 … less one frame: a style change shows on the next frame
  const HALF = 0.45;  // video seconds either side of a change (0.45 s on screen at 2×)
  const BAND = 60;    // width of the gradient edge, % of the cover
  const YEARS = [[0, 1.9], [1.8, 2.8], [3.8, 4.2], [5.8, 5.5], [7.8, 6.8], [8.7, 7.3]]; // middle time → left time
  const LEFT_FROM = 1.9, RIGHT_FROM = 7.0, RIGHT_TO = 13.2, RIGHT_STILL = 12.4, SWIPE_TO = 8.7;
  const rvfc = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
  let stopAt = 0, frameCb = 0, rightCb = 0, live = false, wait = 0;
  const smooth = x => x * x * (3 - 2 * x);
  const seek = (v, t) => { try { v.currentTime = t; } catch {} };
  const paint = t => {
    const before = changes.filter(c => t >= c).length;       // whole hours passed
    const near = changes.findIndex(c => Math.abs(t - c) < HALF);
    if (near >= 0) {
      const q = smooth((t - (changes[near] - HALF)) / (2 * HALF)); // 0 → 1 across the change
      const at = 100 - q * (100 + BAND);                            // edge runs right → left
      const a = colours[near], b = colours[near + 1];
      cover.style.backgroundColor = q < .5 ? a : b;
      cover.style.backgroundImage = `linear-gradient(90deg, ${a} ${at.toFixed(2)}%, ${b} ${(at + BAND).toFixed(2)}%)`;
      cover.classList.toggle("wc-dark", (q < .5 ? near : near + 1) >= 3);
    } else {
      cover.style.backgroundImage = "";
      cover.style.backgroundColor = colours[before];
      cover.classList.toggle("wc-dark", before >= 3);
    }
  };
  // where Your world should be for a moment of the swipe, and how fast it should be moving there
  const yearAt = t => {
    const k = Math.max(0, YEARS.findIndex(([m], i) => i > 0 && t <= m) - 1);
    const [m0, l0] = YEARS[k], [m1, l1] = YEARS[Math.min(k + 1, YEARS.length - 1)];
    const slope = m1 > m0 ? (l1 - l0) / (m1 - m0) : 0;
    return { at: l0 + slope * (Math.min(t, m1) - m0), slope };
  };
  const steerLeft = t => {
    const { at, slope } = yearAt(t), off = at - left.currentTime;
    if (Math.abs(off) > .4) seek(left, at);
    else left.playbackRate = Math.min(4, Math.max(.25, 2 * slope + 3 * off)); // 2×: the middle's own rate
  };
  const onFrame = (now, meta) => {
    const t = meta ? meta.mediaTime : video.currentTime;
    paint(t);
    if (!video.paused) steerLeft(t);
    if (stopAt && video.currentTime >= stopAt) { video.pause(); left.pause(); stopAt = 0; }
    if (live) frameCb = rvfc ? video.requestVideoFrameCallback(onFrame) : requestAnimationFrame(() => onFrame());
  };
  const onRight = () => {
    if (right.currentTime >= RIGHT_TO) { right.pause(); rightCb = 0; return; }
    rightCb = rvfc ? right.requestVideoFrameCallback(onRight) : requestAnimationFrame(onRight);
  };
  const swipe = () => {
    stopAt = SWIPE_TO; video.playbackRate = 2; cover.classList.add("wc-sync");
    video.play().catch(() => {}); left.play().catch(() => {});
  };
  const stopFollowing = () => {
    if (rvfc && frameCb) video.cancelVideoFrameCallback(frameCb); else cancelAnimationFrame(frameCb);
    if (rvfc && rightCb) right.cancelVideoFrameCallback(rightCb); else cancelAnimationFrame(rightCb);
    frameCb = rightCb = 0; clearTimeout(wait);
  };
  const rewind = () => { [video, left, right].forEach(v => v.pause()); seek(video, 0); seek(left, LEFT_FROM); seek(right, RIGHT_FROM); };
  const clear = () => { cover.classList.remove("wc-sync", "wc-dark"); cover.style.backgroundColor = ""; cover.style.backgroundImage = ""; };
  // the side phones open on the frames they start from, not on their posters
  if (left.readyState >= 1) seek(left, LEFT_FROM);
  if (right.readyState >= 1) seek(right, reduced() ? RIGHT_STILL : RIGHT_FROM);
  left.addEventListener("loadedmetadata", () => { if (left.currentTime < LEFT_FROM) seek(left, LEFT_FROM); }, { once: true });
  right.addEventListener("loadedmetadata", () => { if (right.currentTime < RIGHT_FROM) seek(right, reduced() ? RIGHT_STILL : RIGHT_FROM); }, { once: true });
  cover.addEventListener("scene", e => {
    const n = e.detail;
    if (n === 4) return; // looks like scene 3; the videos just carry on
    stopFollowing(); live = n === 2 || n === 3;
    if (n <= 1 || n === 5) { [video, left, right].forEach(v => v.pause()); clear(); }
    if (n === 0) rewind();
    if (n === 2) { rewind(); cover.classList.remove("wc-sync"); paint(0); } // paper → 4 pm, a soft fade
    if (n === 3 && reduced()) { paint(0); seek(right, RIGHT_STILL); live = false; return; } // a still: 4 pm, 2026, the rating
    if (n === 3) {
      right.playbackRate = 1; right.play().catch(() => {}); onRight();
      wait = setTimeout(swipe, 700); // once the side phones have landed
    }
    if (live) frameCb = rvfc ? video.requestVideoFrameCallback(onFrame) : requestAnimationFrame(() => onFrame());
  });
}

function opengym(cover) {
  // The live count on the gym page climbs to 58 of 94 (62%) as its gauge fills.
  const count = cover.querySelector('[data-count]'), pct = cover.querySelector('[data-pct]');
  let raf = 0;
  const show = v => { count.textContent = `${v} of 94 inside`; pct.textContent = `${Math.round(v / 94 * 100)}%`; };
  const run = () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now() + 900, ease = t => 1 - Math.pow(1 - t, 3); // starts with the gauge
    const tick = now => { const t = Math.min(1, Math.max(0, (now - t0) / 1600)); show(Math.round(58 * ease(t))); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
  };
  cover.addEventListener('scene', e => {
    const n = e.detail;
    if (n === 0) { cancelAnimationFrame(raf); show(0); }
    if (n === 3) run();
    if (n === 4 && count.textContent.startsWith('0 ')) show(58); // reduced motion rests here
  });
}

// The Glimpse cover: its video plays only while the cover is on screen; with reduced motion it
// rests on the poster frame.
function glimpseVideo(cover) {
  const video = cover.querySelector('video');
  if (reduced()) return;
  whenOnScreen(cover, () => video.play().catch(() => {}), () => video.pause());
}

export function startCover(root) {
  const cover = root.querySelector('.walk-cover');
  if (!cover) return;
  if (cover.matches('.wc-gl2')) glimpseVideo(cover);
  if (cover.matches('.wc-og')) opengym(cover);
  if (cover.matches('.wc-gl')) glimpse(cover);
  if (cover.matches('[data-reel]')) reel(cover);
  if (cover.dataset.scenes) scenes(cover);
}
