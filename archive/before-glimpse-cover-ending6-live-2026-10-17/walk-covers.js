// Oct 13: animated covers for the product frames in the WORK walk (styles in walk-covers.css).
// walk-gallery.js puts coverMarkup(kind) in a frame's picture window and calls startCover().
// Each cover is a loop of scenes: data-scenes lists when each scene starts (ms) and data-loop
// is the loop's length. A cover only runs while it is on screen; with reduced motion it rests
// on one representative scene (data-still).

// The real OpenGym logo (cmuopengym.com).
const OPENGYM_LOGO = 'https://cmuopengym.com/images/light_mode_logo.png';
// Its gym photos (uc = Cohon Lower, ucA1 = Cohon Upper, tepper = Tepper).
const OG_IMAGES = 'https://cmuopengym.com/images/';
// The footer's social links (GitHub, Instagram, LinkedIn), drawn like the real site's Ionicons.
const GITHUB = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';
const INSTAGRAM = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.2" y="1.2" width="13.6" height="13.6" rx="4"/><circle cx="8" cy="8" r="3.1"/><circle cx="12" cy="4" r=".5" fill="currentColor"/></svg>';
const LINKEDIN = '<svg viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm1.4 6.1v7h2.2v-7zm1.1-3.6a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm2.8 3.6v7h2.2V9.6c0-.9.2-1.7 1.3-1.7s1.1 1 1.1 1.8v3.4h2.2V9.3c0-1.9-.4-3.4-2.6-3.4-1.1 0-1.8.6-2.1 1.1V6.1z"/></svg>';

const markup = {
  // CMUsed: its wordmark holds still while the marketplace's real categories roll past;
  // when the reel stops on Home Decor, a real listing card drops in.
  cmused: (b) => `<div class="walk-cover wc-cm" data-reel aria-hidden="true">
    <span class="wc-brand">CMUsed</span><div class="wc-reel"><ul></ul></div><div class="wc-fade"></div>
    <img class="wc-listing" src="${b}assets/pd/cmused-card.webp?v=2" alt="" loading="lazy" decoding="async"></div>`,
  // Glimpse (Oct 16–17, built up like Jean Chen's Typistry cover; prototype: assets/pd/glimpse/v3/cover-proto.html):
  // it opens on the hour-ring logo, which shrinks onto the photo circle as the phone rises around it; then
  // one phone playing "Your world, filling in" (the circle of your photos fills, 23.0 GB kept off your iPhone);
  // as its tiles break out the Now and camera phones slide out from behind it; the view pulls back and the
  // desktop app rises behind on two MacBooks (Search, Layers of Alfama); everything goes back behind the
  // phone; its photos come straight out of its map, form a dial of photos (dark ones at the top, light at the
  // bottom) and close into the hour-dial logo on the cover itself, with "glimpse" (v3/glimpse-cover-ending4, drawn
  // at the cover's 16:10 from the phone's own last frame; Oct 17). The one-phone
  // cover is in archive/before-glimpse-cover-build-2026-10-16/, the three-phone one in before-glimpse-cover-2026-10-16/.
  glimpse: (b) => {
    const g = `${b}assets/pd/glimpse/v3/`;
    const V = (n, v = 'cosmos-1') => `<video muted playsinline preload="metadata" poster="${g}${n}.jpg?v=${v}"><source src="${g}${n}.mp4?v=${v}" type='video/mp4; codecs="avc1.640028"'><source src="${g}${n}.webm?v=${v}" type="video/webm"></video>`;
    const mac = (cls, img) => `<div class="wc-mac ${cls}"><div class="wc-lid"><img src="${g}${img}.webp?v=1" alt="" loading="lazy" decoding="async"><i class="wc-notch"></i></div><div class="wc-base"></div></div>`;
    return `<div class="walk-cover wc-gl3" aria-hidden="true">
    ${mac('wc-mac-l', 'glimpse-desk-search')}${mac('wc-mac-r', 'glimpse-desk-layers')}
    <div class="wc-ph wc-ph-l">${V('glimpse-now-swipe')}</div><div class="wc-ph wc-ph-r">${V('glimpse-camera-shoot')}</div>
    <video class="wc-ring" muted playsinline preload="metadata"><source src="${g}glimpse-cover-ending4.mp4?v=1" type='video/mp4; codecs="avc1.640028"'><source src="${g}glimpse-cover-ending4.webm?v=1" type="video/webm"></video>
    <div class="wc-ph wc-ph-m">${V('glimpse-cover-world2', '1')}</div></div>`;
  },
  // Kumi (Oct 17): its own promo (D:\gpt\ChatGPT\dashboard, scripts/promo-render.mjs, 8.2 s at 1920×1080): the Kumi
  // tile turns into the apps it gathers (Google Calendar, Claude, Slack, Drive, Discord …) and ends on the wordmark,
  // "One glance tells you what's next." Shown on its own cream, cropped from 16:9 to the cover's 16:10.
  kumi: (b) => `<div class="walk-cover wc-km" aria-hidden="true">
    <video muted playsinline loop preload="metadata" poster="${b}assets/pd/kumi/kumi-promo.jpg?v=1"><source src="${b}assets/pd/kumi/kumi-promo.mp4?v=1" type='video/mp4; codecs="avc1.640028"'><source src="${b}assets/pd/kumi/kumi-promo.webm?v=1" type="video/webm"></video></div>`,
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
        <svg class="wc-moon wc-fade" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7z"/></svg>
        <span class="wc-tagline wc-fade">Beat the rush - see gym occupancy in real-time!</span><i class="wc-rule wc-fade"></i>
        <div class="wc-home">
          ${card('uc.jpg', 'Cohon Fitness Center Lower', 62, 'Closes in 6h 16m (today at 11:00 PM)')}
          ${card('ucA1.jpg', 'Cohon Fitness Center Upper', 38, 'Closes in 6h 16m (today at 11:00 PM)')}
          ${card('tepper.jpg', 'Tepper Fitness Center', 21, 'Closes in 3h 16m (today at 8:00 PM)')}
          <div class="wc-foot"><img class="wc-btg" src="${b}assets/pd/opengym-btg.svg" alt="" decoding="async"><b>Open Gym</b><span>© 2026</span>
            <div class="wc-social">${GITHUB}${INSTAGRAM}${LINKEDIN}</div><i></i>
            <small>Copyright (c) 2025 Carnegie Mellon University Business Technology Group. All rights reserved.<br>Unauthorized copying, modification, distribution, or use of this code is strictly prohibited.</small></div>
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
function glimpseBuild(cover) {
  // Two clocks (Oct 17, prototype: assets/pd/glimpse/v3/cover-proto.html). The middle phone's (the cover's copy of
  // "Your world, filling in", v3/glimpse-cover-world2, 13.15 s): 5.15 s its tiles break out, the side phones come
  // out; 6.1 s its map starts to slide, the view pulls back and the MacBooks rise; the full picture holds until
  // 11.15 s, when everything goes back behind it; "Your world, one photo at a time." shows, and at 12.65 s the
  // ending video, lying under the phone and showing exactly its frame, takes over. The ending's
  // (v3/glimpse-cover-ending4, 8.45 s; "glimpse" in the app's wordmark style, Inter 400): the photos come straight
  // out of the phone's map, east to west, and form a
  // dial of photos (darkest at the top, by the night slices; lightest at the bottom, by noon), which closes into
  // the logo; the logo holds from 4.35 s (where the cover starts the first time); from 6.6 s the opening, one step
  // at a time: the word fades in place, the ring alone shrinks onto the place of the phone's empty photo circle, the
  // phone (drawn in the video) fades in around it without moving, then the ring fades; the video ends on exactly
  // the middle video's first frame, which takes over. The logo it ends on and the one it
  // starts on are the same frames, so the loop has no seam.
  // Boxes in cqw of the 100 x 62.5 frame (left, top, height; a phone is 800/1488 as wide as it is tall).
  const PW = 800 / 1488, box = (l, t, h) => ({ l, t, h });
  const SINGLE = box(34.95, 3.25, 56), BEHIND = box(37.05, 7.15, 48.2);
  const SIDE2_L = box(12.5, 9, 47), SIDE2_R = box(100 - 12.5 - 47 * PW, 9, 47);
  const MID3 = box(50 - 21 * PW, 15.5, 42), SIDE3_L = box(21, 21.5, 35), SIDE3_R = box(100 - 21 - 35 * PW, 21.5, 35);
  const T = { breakOut: 5.15, pull: 6.1, back: 11.15, merge: 12.65 };
  const END = { logo: 4.35, intro: 6.6, len: 8.45 };
  const clamp = (x) => Math.min(1, Math.max(0, x)), prog = (t, a, b) => clamp((t - a) / (b - a));
  const out = (x) => 1 - Math.pow(1 - clamp(x), 3.2);
  const inOut = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const mix = (a, b, k) => ({ l: a.l + (b.l - a.l) * k, t: a.t + (b.t - a.t) * k, h: a.h + (b.h - a.h) * k });
  const mid = cover.querySelector('.wc-ph-m'), L = cover.querySelector('.wc-ph-l'), R = cover.querySelector('.wc-ph-r');
  const lap = cover.querySelector('.wc-mac-l'), mon = cover.querySelector('.wc-mac-r');
  const vm = mid.querySelector('video'), vl = L.querySelector('video'), vr = R.querySelector('video'), vg = cover.querySelector('.wc-ring');
  // each phone sits at its box in the full composition; a transform shows where it is at the moment
  const home = new Map([[mid, MID3], [L, SIDE3_L], [R, SIDE3_R]]);
  for (const [el, b] of home) Object.assign(el.style, { left: b.l + 'cqw', top: b.t + 'cqw', height: b.h + 'cqw', width: b.h * PW + 'cqw' });
  const put = (el, b) => { const h = home.get(el); el.style.transform = `translate(${b.l - h.l}cqw, ${b.t - h.t}cqw) scale(${b.h / h.h})`; };
  let sidesOn = false, frame = 0, live = false;
  // the composition, on the middle video's clock t; enter: the middle phone's opacity (it rises in as it appears)
  const render = (t, enter = 1) => {
    const e2 = out(prog(t, T.breakOut, T.breakOut + .9));
    const e3 = inOut(prog(t, T.pull, T.pull + 1.2)), eb = inOut(prog(t, T.back, T.back + .9));
    const m = mix(mix(SINGLE, MID3, e3), SINGLE, eb);
    put(mid, { l: m.l, t: m.t + (1 - enter) * 2.5, h: m.h });
    mid.style.opacity = enter;
    for (const [el, s2, s3] of [[L, SIDE2_L, SIDE3_L], [R, SIDE2_R, SIDE3_R]]) {
      put(el, mix(mix(mix(BEHIND, s2, e2), s3, e3), BEHIND, eb));
      el.style.opacity = clamp(e2 * 2.5) * (1 - prog(eb, .55, 1));
    }
    [[lap, 0], [mon, .12]].forEach(([el, d]) => {
      const up = out(prog(t, T.pull + .2 + d, T.pull + 1.4 + d)), down = out(prog(t, T.back - .1 + d, T.back + .5 + d));
      el.style.opacity = up * (1 - down);
      el.style.transform = `translateY(${(1 - up) * 7 + down * 5}cqw)`;
    });
    if (t >= T.breakOut && t < T.back + .9 && !sidesOn) { sidesOn = true; vl.currentTime = 0; vr.currentTime = 1.5; vl.play().catch(() => {}); vr.play().catch(() => {}); }
    if ((t >= T.back + .9 || t < T.breakOut) && sidesOn) { sidesOn = false; vl.pause(); vr.pause(); }
  };
  // the ending, on its own clock u: the phone fades off the same frame in the video under it, then waits, hidden,
  // on its first frame, which is the ending's last
  const ending = (u) => {
    if (u < .2) { render(T.merge); mid.style.opacity = 1 - prog(u, .04, .16); return; }   // fades in place
    render(0, 0);
  };
  if (reduced()) {
    // a still: the full composition, the circle on 23.0 GB, Now at 4 pm, the camera's rating card
    const still = () => { render(7.4); try { vm.currentTime = 4.5; vl.currentTime = .3; vr.currentTime = 3.6; } catch {} };
    [vm, vl, vr].forEach((v) => (v.preload = 'auto'));
    vm.addEventListener('loadedmetadata', still, { once: true }); still();
    return;
  }
  // one loop: the ending (the first time from the logo), the middle video until the merge, the ending again
  let phase = 'ending', first = true, rewound = true, under = false;
  vm.loop = vg.loop = false;
  vg.currentTime = END.logo; vg.style.opacity = 0;
  ending(END.logo);
  const loop = () => {
    if (!live) return;
    if (phase === 'ending') {
      const u = vg.currentTime;
      vg.style.opacity = first ? out(prog(u, END.logo, END.logo + .45)) : 1;
      ending(u);
      if (u > .2 && !rewound) { rewound = true; vm.pause(); vm.currentTime = 0; }
      if (vg.ended || u >= END.len - .02) {
        // the ending's last frame is the middle video's first: it stays under the phone until the phone's video
        // is surely showing frames (its first 0.3 s are still), so a slow first frame never shows the bare plate
        phase = 'video'; first = false; under = true;
        if (vm.currentTime !== 0) vm.currentTime = 0;
        vm.play().catch(() => {});
      }
    } else {
      const t = vm.currentTime;
      render(t);
      if (under && t > .25) { under = false; vg.pause(); vg.style.opacity = 0; vg.currentTime = 0; }   // ready for the next merge
      if (t >= T.merge || vm.ended) {
        phase = 'ending'; rewound = false;
        vm.pause(); vg.style.opacity = 1; vg.play().catch(() => {});
        ending(0);
      }
    }
    frame = requestAnimationFrame(loop);
  };
  whenOnScreen(cover, () => {
    if (live) return;
    live = true; [vm, vl, vr, vg].forEach((v) => (v.preload = 'auto'));
    (phase === 'video' ? vm : vg).play().catch(() => {});
    frame = requestAnimationFrame(loop);
  }, () => {
    live = false; cancelAnimationFrame(frame); [vm, vl, vr, vg].forEach((v) => v.pause()); sidesOn = false;
  });
}

// The Kumi cover: its promo plays only while the cover is on screen; with reduced motion it rests on
// the poster (the wordmark).
function kumi(cover) {
  const video = cover.querySelector('video');
  if (reduced()) return;
  whenOnScreen(cover, () => video.play().catch(() => {}), () => video.pause());
}

export function startCover(root) {
  const cover = root.querySelector('.walk-cover');
  if (!cover) return;
  if (cover.matches('.wc-gl3')) glimpseBuild(cover);
  if (cover.matches('.wc-og')) opengym(cover);
  if (cover.matches('.wc-km')) kumi(cover);
  if (cover.matches('.wc-gl')) glimpse(cover);
  if (cover.matches('[data-reel]')) reel(cover);
  if (cover.dataset.scenes) scenes(cover);
}
