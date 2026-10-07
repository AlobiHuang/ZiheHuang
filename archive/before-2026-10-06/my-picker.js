// "MY ______?" — the section after the ME exit.
//
// Scrolling through it (the stage is pinned; the section is 760svh):
//  1. RISE    the question rises from the bottom of the screen to the middle.
//  2. SPIN    as the question rises, a slot drum in the blank spins through
//             STYLE / SKILLS / HOBBIES and comes to rest on one by itself.
//             Click it (or press Enter/Space) to stop it, or drag it up or down
//             to turn it to the word you want; if the
//             visitor keeps scrolling it stops by itself on whatever is showing.
//  3. SWEEP   the room's lines slide in from the right edge to a third of the
//             way across, pushing the question into the left third.
//  4. RECORDS the chosen topic's records ride up the room's centre strip:
//             STYLE  square previews of visual UI/UX styles,
//             SKILLS a wheel of tools turning vertically,
//             HOBBIES what I do away from the desk.
// Clicking the question again spins the drum again and swaps the records.
import { drawRoomLines } from './me-portal.js?v=20260923-cursor-room-1';

const section = document.querySelector('[data-my-picker]');
if (section) {
  const stage = section.querySelector('.my-stage');
  const canvas = section.querySelector('.my-room');
  const ctx = canvas.getContext('2d');
  const sweepLine = section.querySelector('.my-sweep');
  const title = section.querySelector('.my-title');
  const slot = section.querySelector('.my-slot');
  const drum = section.querySelector('.my-drum');
  const hint = section.querySelector('.my-hint');
  const column = section.querySelector('.my-column');
  const status = section.querySelector('.my-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;

  // Screens of scroll for each phase.
  const RISE = .8, SPIN = .5, SWEEP = .8, RECORDS = 4.2;
  const SPIN_AT = RISE, SWEEP_AT = RISE + SPIN, RECORDS_AT = SWEEP_AT + SWEEP;

  // ---- content --------------------------------------------------------
  const topics = [
    { key: 'style', word: 'STYLE' },
    { key: 'skills', word: 'SKILLS' },
    { key: 'hobbies', word: 'HOBBIES' }
  ];

  // Each preview is drawn with plain HTML/CSS inside a square (see my-picker.css).
  const styles = [
    { cls: 'min', name: 'Refined Minimalism', years: '2010s—', note: 'Few elements, generous space and exact type, so the product is the hero. Calm and confident, never decorative. The school of Apple.', tags: ['Clarity', 'Whitespace', 'Precision'],
      preview: '<small>New</small><b>Made quiet.</b><span>Nothing extra. Everything considered.</span><em>Learn more&nbsp;›</em><i></i>' },
    { cls: 'glitch', name: 'Glitch / Cyberpunk', years: '1980s— · revived', note: 'Broken signal as a look: split RGB channels, torn scan lines and neon on black. Bold, loud and deliberately imperfect.', tags: ['Glitch art', 'Neon', 'Distortion'],
      preview: '<b data-t="SIGNAL">SIGNAL</b><i></i><i></i><i></i><code>ERR_0x2F // NO CARRIER</code>' },
    { cls: 'brut', name: 'Brutalism', years: '1950s— · béton brut', note: 'Raw concrete left as it was poured: heavy mass, deep openings and the grain of the formwork on every surface. Structure with nothing hidden.', tags: ['Béton brut', 'Mass', 'Honesty'],
      preview: '<b>BÉTON<br>BRUT</b><i></i><i></i><i></i><em></em>' },
    { cls: '4', name: 'Neumorphism', years: '2019—', note: 'Controls pushed out of, or pressed into, one soft surface with twin light and shadow.', tags: ['Soft UI', 'Extruded', 'Tactile'],
      preview: '<span></span><i><b></b></i><em></em>' },
    { cls: 'contour', name: 'Contour Drafting', years: 'this site', note: 'Paper, ink hairlines and a landscape of contour lines, drawn like an architectural plate. The house style you are reading.', tags: ['Drawing', 'Topography', 'Monochrome'],
      preview: '<span>ALOBI</span>' }
  ];

  // Tools, grouped the way the portfolio pages group them. PD polish (Oct 5):
  // product design tools come first; the original order is in
  // archive/before-pd-polish-2026-10-05/my-picker.js.
  const skills = [
    ['figma', 'Figma', 'Product design & prototyping', 'Interfaces, flows & components'],
    ['axure', 'Axure', 'Product design & prototyping', 'Interactive prototypes'],
    ['html', 'HTML', 'Technical prototyping', 'Structure'],
    ['css', 'CSS', 'Technical prototyping', 'Style & motion'],
    ['javascript', 'JavaScript', 'Technical prototyping', 'Behaviour'],
    ['python', 'Python', 'Technical prototyping', 'Automation & data'],
    ['excel', 'Excel', 'Data & decisions', 'Analysis'],
    ['tableau', 'Tableau', 'Data & decisions', 'Dashboards'],
    ['adobe', 'Adobe Creative Suite', 'Creative production', 'Visual design & post-production'],
    ['powerpoint', 'PowerPoint', 'Alignment & communication', 'Stories & decks'],
    ['word', 'Word', 'Alignment & communication', 'Briefs & reports'],
    ['rhino', 'Rhino', 'Spatial design & BIM', '3D modelling'],
    ['grasshopper', 'Grasshopper', 'Spatial design & BIM', 'Parametric design'],
    ['revit', 'Revit', 'Spatial design & BIM', 'BIM documentation'],
    ['3dsmax', '3ds Max', 'Spatial design & BIM', 'Modelling & rendering'],
    ['vray', 'V-Ray', 'Spatial design & BIM', 'Photoreal rendering'],
    ['d5render', 'D5 Render', 'Spatial design & BIM', 'Real-time rendering'],
    ['autocad', 'AutoCAD', 'Spatial design & BIM', 'Drawings']
  ];

  // Away from the desk. (The earlier PROCESS steps are in archive/my-process-v1.)
  const hobbies = [
    { name: 'Music', line: 'Always playing', note: 'Listening widely, and the quickest way to change the mood of a room or a long night in studio.',
      svg: '<path d="M26 58V46a24 24 0 0 1 48 0v12" class="o"/><rect x="20" y="56" width="12" height="22" rx="4" class="o"/><rect x="68" y="56" width="12" height="22" rx="4" class="o"/>' },
    { name: 'Photography', line: 'Moments in motion', note: 'Catching light, people and places as they pass. Many of them end up on the wall further down this page.',
      svg: '<rect x="16" y="32" width="68" height="44" rx="5" class="o"/><path d="M36 32l5-9h18l5 9" class="o"/><circle cx="50" cy="54" r="13" class="o"/><circle cx="50" cy="54" r="5"/><circle cx="74" cy="40" r="2"/>' },
    { name: 'Travel', line: 'Shenzhen · Pittsburgh · beyond', note: 'New places keep widening the way I understand space, and how people live in it.',
      svg: '<circle cx="50" cy="50" r="30" class="o"/><path d="M20 50h60M50 20c-12 10-12 50 0 60M50 20c12 10 12 50 0 60" class="o"/><circle cx="34" cy="38" r="3"/><circle cx="64" cy="60" r="3"/>' },
    { name: 'Food', line: 'Taste of a place', note: 'Trying what a place eats is the fastest way into how it lives, and the best excuse to bring people together.',
      svg: '<path d="M18 50h64a32 32 0 0 1-64 0Z" class="o"/><path d="M40 82h20" class="o"/><path d="M58 16l-10 30M70 18l-14 28" class="o"/><path d="M36 40c0-6 4-6 4-12M46 40c0-6 4-6 4-12" class="o"/>' },
    { name: 'People', line: 'The ones close to me', note: 'Friends and family keep life playful and the work grounded.',
      svg: '<circle cx="36" cy="38" r="9" class="o"/><circle cx="64" cy="38" r="9" class="o"/><path d="M18 76c0-12 8-20 18-20s18 8 18 20M46 76c0-12 8-20 18-20s18 8 18 20" class="o"/>' }
  ];

  // ---- build the drum and the records -----------------------------------
  const FACES = 12; // three words repeated round the drum
  const STEP = 360 / FACES;
  const faces = Array.from({ length: FACES }, (_, index) => {
    const face = document.createElement('span');
    face.className = 'my-face';
    face.textContent = topics[index % topics.length].word;
    face.setAttribute('aria-hidden', 'true');
    drum.append(face);
    return face;
  });

  const tracks = {};
  const makeTrack = (key, html) => {
    const track = document.createElement('div');
    track.className = `my-track my-track-${key}`;
    track.dataset.topic = key;
    track.innerHTML = html;
    column.append(track);
    tracks[key] = track;
  };
  makeTrack('style', styles.map((item, index) => `
    <article class="my-record">
      <header><span>S—${String(index + 1).padStart(2, '0')}</span><span>${item.years}</span></header>
      <div class="my-preview my-preview-${item.cls}" aria-hidden="true">${item.preview}</div>
      <h3>${item.name}</h3>
      <p>${item.note}</p>
      <footer>${item.tags.map(tag => `<i>${tag}</i>`).join('')}</footer>
    </article>`).join(''));
  makeTrack('skills', `<div class="my-wheel">${skills.map(([slug, name, group, use], index) => `
    <article class="my-skill" data-index="${index}">
      <span class="my-skill-no">T—${String(index + 1).padStart(2, '0')}</span>
      <img src="assets/tool-logos/${slug}.svg" alt="" loading="lazy" decoding="async">
      <h3>${name}</h3>
      <p><b>${group}</b>${use}</p>
    </article>`).join('')}</div><div class="my-wheel-window" aria-hidden="true"></div>`);
  makeTrack('hobbies', hobbies.map((item, index) => `
    <article class="my-record my-step">
      <header><span>H—${String(index + 1).padStart(2, '0')}</span><span>${item.line}</span></header>
      <div class="my-preview my-diagram" aria-hidden="true"><svg viewBox="0 0 100 100">${item.svg}</svg></div>
      <h3>${item.name}</h3>
      <p>${item.note}</p>
    </article>`).join(''));
  const wheelCards = [...tracks.skills.querySelectorAll('.my-skill')];

  // ---- the drum ----------------------------------------------------------
  // rot is measured in faces; the face under the window is round(rot).
  const drumState = { rot: 0, v: 0, mode: 'waiting', from: 0, to: 0, at: 0, choice: null };
  const faceHeight = () => slot.clientHeight;
  const topicAt = rot => topics[((Math.round(rot) % topics.length) + topics.length) % topics.length];

  const layoutDrum = () => {
    const radius = faceHeight() / 2 / Math.tan(Math.PI / FACES);
    faces.forEach((face, index) => {
      let angle = (index - drumState.rot) * STEP;
      angle = ((angle + 180) % 360 + 360) % 360 - 180;
      const visible = Math.abs(angle) < 75;
      face.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) return;
      // Pushed back by the radius first, so the front face sits at its true size.
      face.style.transform = `translateZ(${(-radius).toFixed(1)}px) rotateX(${(-angle).toFixed(2)}deg) translateZ(${radius.toFixed(1)}px)`;
      face.style.opacity = String(Math.max(0, Math.cos(angle * Math.PI / 180) ** 3).toFixed(3));
    });
    slot.classList.toggle('is-blurred', Math.abs(drumState.v) > 6);
  };

  const spin = () => {
    if (reduced.matches) return;
    drumState.mode = 'spinning';
    drumState.v = Math.max(drumState.v, 3);
    autoStop();
    section.classList.add('is-spinning');
    section.classList.remove('is-chosen');
    status.textContent = 'Spinning';
    wake();
  };

  // Stop on a face: the next few faces ahead, easing in with a small kick back.
  // As soon as the wheel knows where it will land, the records start their
  // switch, so both wheels turn together.
  const chooseLanding = () => {
    const dir = Math.sign(drumState.to - (drumState.choiceRot ?? drumState.from)) || 1;
    choose(topicAt(drumState.to), dir);
    drumState.choiceRot = drumState.to;
  };
  const stop = offset => {
    if (drumState.mode !== 'spinning') return;
    drumState.mode = 'stopping';
    drumState.from = drumState.rot;
    drumState.to = Math.ceil(drumState.rot) + (offset ?? Math.max(1, Math.round(drumState.v * .18)));
    drumState.at = performance.now();
    chooseLanding();
    wake();
  };

  // Switching topics: the records strip spins the same way the word wheel
  // turned: the old records rush off, a blur of travel, and the new ones slow
  // into place (see render). The very first choice simply fades in.
  let swap = null;
  // Switching topic: the old records leave, then the new ones arrive.
  const MOVE_MS = 725, FADE_MS = 150, IN_AT = 650, SWAP_MS = IN_AT + MOVE_MS;
  const choose = (topic, dir = 1) => {
    const previous = drumState.choice;
    drumState.choiceRot = drumState.rot;
    if (previous === topic.key) { section.classList.remove('is-spinning'); section.classList.add('is-chosen'); return; }
    drumState.choice = topic.key;
    section.dataset.topic = topic.key;
    section.classList.remove('is-spinning');
    section.classList.add('is-chosen');
    slot.setAttribute('aria-label', `My ${topic.word.toLowerCase()}. Choose another topic`);
    status.textContent = `Showing my ${topic.word.toLowerCase()}`;
    if (swap) finishSwap();
    if (previous && !reduced.matches && column.style.visibility === 'visible') {
      swap = { from: previous, to: topic.key, dir, at: performance.now() };
      tracks[previous].classList.add('is-leaving');
      tracks[topic.key].classList.add('is-current', 'is-entering');
      wake();
      return;
    }
    Object.values(tracks).forEach(track => track.classList.toggle('is-current', track.dataset.topic === topic.key));
  };
  const finishSwap = () => {
    if (!swap) return;
    const leaving = tracks[swap.from], entering = tracks[swap.to];
    leaving.classList.remove('is-current', 'is-leaving');
    entering.classList.remove('is-entering');
    [leaving, entering].forEach(track => { track.style.translate = ''; track.style.opacity = ''; track.style.filter = ''; });
    swap = null;
  };

  const stepDrum = (now, dt) => {
    if (drumState.mode === 'dragging') return true;
    if (drumState.mode === 'spinning') {
      drumState.v += (16 - drumState.v) * (1 - Math.exp(-dt / .35)); // spin up to 16 faces/s
      drumState.rot += drumState.v * dt;
      if (now > drumState.stopAt) stop();
      return true;
    }
    if (drumState.mode === 'stopping') {
      const t = clamp((now - drumState.at) / Math.min(1900, 900 + 160 * Math.abs(drumState.to - drumState.from)));
      // ease out with a slight overshoot, like a reel catching its detent
      const back = 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
      const previous = drumState.rot;
      drumState.rot = mix(drumState.from, drumState.to, back);
      drumState.v = dt > 0 ? (drumState.rot - previous) / dt : 0;
      if (t >= 1) {
        drumState.rot = drumState.to;
        drumState.v = 0;
        drumState.mode = 'chosen';
        choose(topicAt(drumState.rot), Math.sign(drumState.rot - (drumState.choiceRot ?? drumState.rot)) || 1);
        return false;
      }
      return true;
    }
    return false;
  };

  const turnTo = direction => {
    if (drumState.mode === 'spinning' || drumState.mode === 'stopping') return;
    drumState.mode = 'spinning'; drumState.v = 0;
    stop(direction);
  };

  // Dragging the wheel: grab it (even mid-spin) and turn it up or down, one
  // word per word-height; let go and it settles on the nearest word, carried
  // on a little by a fling. That word becomes the choice.
  let drag = null, dragged = false;
  slot.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drumState.mode === 'waiting') return;
    drag = { y: event.clientY, rot: drumState.rot, moved: 0, id: event.pointerId, samples: [[performance.now(), drumState.rot]] };
  });
  slot.addEventListener('pointermove', event => {
    if (!drag) return;
    const dy = event.clientY - drag.y;
    drag.moved = Math.max(drag.moved, Math.abs(dy));
    if (drag.moved < 4) return;
    if (drumState.mode !== 'dragging') {
      slot.setPointerCapture?.(drag.id);
      drumState.mode = 'dragging'; drumState.v = 0;
      slot.classList.add('is-dragging');
    }
    drumState.rot = drag.rot - dy / Math.max(20, faceHeight());
    drag.samples.push([performance.now(), drumState.rot]);
    if (drag.samples.length > 6) drag.samples.shift();
    wake();
  });
  const endDrag = () => {
    if (!drag) return;
    const wasDragging = drumState.mode === 'dragging';
    const { samples } = drag;
    drag = null;
    slot.classList.remove('is-dragging');
    if (!wasDragging) return;
    dragged = true;
    const [t0, r0] = samples[0], [t1, r1] = samples[samples.length - 1];
    const velocity = t1 > t0 ? (r1 - r0) / ((t1 - t0) / 1000) : 0;
    drumState.mode = 'stopping';
    drumState.from = drumState.rot;
    drumState.to = Math.round(drumState.rot + clamp(velocity * .35, -6, 6));
    // A drag should change the topic: if the throw happens to come round to
    // the same word, carry on one more word in the direction of the throw.
    const direction = Math.sign(velocity || (drumState.rot - (drumState.choiceRot ?? drumState.rot))) || 1;
    if (topicAt(drumState.to).key === drumState.choice) drumState.to += direction;
    drumState.at = performance.now();
    chooseLanding();
    wake();
  };
  slot.addEventListener('pointerup', endDrag);
  slot.addEventListener('pointercancel', endDrag);

  slot.addEventListener('click', () => {
    if (dragged) { dragged = false; return; }
    if (drumState.mode === 'spinning') stop();
    else if (drumState.mode !== 'stopping') spin();
  });
  slot.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); slot.click(); }
    if (event.key === 'ArrowDown') { event.preventDefault(); turnTo(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); turnTo(-1); }
  });

  // The wheel spins by itself for a moment, then comes to rest on its own.
  const autoStop = () => { drumState.stopAt = performance.now() + 1300 + Math.random() * 900; };

  // Over the wheel the site cursor carries a word: DRAG. (The cursor is
  // made by spectacle.js, which also labels every button OPEN, so the label
  // is set again on the next frame, after its own handler has run.)
  const getCursor = () => document.querySelector('.fx-cursor');
  const labelCursor = () => {
    const cursor = getCursor();
    if (!cursor || !slot.matches(':hover')) return;
    const label = cursor.querySelector('span');
    if (label) label.textContent = 'DRAG';
    cursor.classList.add('is-action', 'is-label');
  };
  const unlabelCursor = () => { const cursor = getCursor(); if (cursor && !(drumState.mode === 'dragging') && !slot.matches(':hover')) cursor.classList.remove('is-action', 'is-label'); };
  slot.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { labelCursor(); requestAnimationFrame(labelCursor); } });
  slot.addEventListener('pointerleave', () => { const cursor = getCursor(); if (cursor && !(drumState.mode === 'dragging')) cursor.classList.remove('is-action', 'is-label'); });
  slot.addEventListener('lostpointercapture', () => requestAnimationFrame(unlabelCursor));

  // ---- scroll-driven scene ----------------------------------------------
  let w = 0, h = 0, frame = 0, last = 0, visible = false;

  const resize = () => {
    w = stage.clientWidth; h = stage.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    title.style.transform = 'none';
    // The blank is as wide as the longest word.
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap';
    title.append(probe);
    slot.style.width = `${Math.ceil(Math.max(...topics.map(topic => { probe.textContent = topic.word; return probe.offsetWidth; })))}px`;
    probe.remove();
    wake();
  };

  const render = now => {
    frame = 0;
    const dt = Math.min(.05, Math.max(0, (now - (last || now)) / 1000));
    last = now;
    const rect = section.getBoundingClientRect();
    const screens = clamp(-rect.top / Math.max(1, section.offsetHeight - h), 0, 1) * (section.offsetHeight - h) / Math.max(1, h);

    // 1. rise
    const rise = smooth(screens / RISE);
    // 2. spin: starts by itself the first time; stops by itself on the way out
    if (screens >= .25 && drumState.mode === 'waiting') {
      if (reduced.matches) { drumState.mode = 'chosen'; choose(topics[0]); } else spin();
    }
    if (screens >= SWEEP_AT - .1 && drumState.mode === 'spinning') stop(1);
    const moving = stepDrum(now, dt);
    layoutDrum();
    section.classList.toggle('is-ready', screens >= .2);

    // 3. sweep: the room slides in from the right to a third of the way across
    const narrow = w < 760;
    const sweep = smooth((screens - SWEEP_AT) / SWEEP);
    // Once the room is in, the cursor shows its up-and-down way (cursor-shape.js).
    const roomAxis = sweep > .5 && rect.top <= 0 && rect.bottom >= h - 1 ? 'y' : '';
    if ((document.documentElement.dataset.roomMy || '') !== roomAxis) {
      if (roomAxis) document.documentElement.dataset.roomMy = roomAxis; else delete document.documentElement.dataset.roomMy;
    }
    const sweepTo = narrow ? 0 : w / 3;
    const sweepX = mix(w, sweepTo, sweep);
    const areaW = w - sweepTo;

    // The question: rises to the middle, then is pushed left (or up on phones).
    const titleW = title.offsetWidth, titleH = title.offsetHeight;
    const centeredLeft = (w - titleW) / 2;
    let x = 0, y = (1 - rise) * h * .55, scale = 1;
    if (!narrow) {
      const endScale = Math.min(1, (w / 3 - 48 - 32) / titleW);
      scale = mix(1, endScale, sweep);
      const left = Math.min(centeredLeft, sweepX - 32 - titleW * scale);
      x = Math.max(48, left) - centeredLeft;
    } else {
      scale = mix(1, .56, sweep);
      y += -sweep * (h / 2 - titleH * .3 - 70);
      x = -sweep * (centeredLeft - 20);
    }
    title.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
    title.style.opacity = String(clamp(screens / .35));
    if (hint) hint.style.opacity = String(clamp((screens - SPIN_AT + .1) / .2) * (1 - sweep));

    // The room drawing, rigid, sliding in behind its leading edge.
    ctx.clearRect(0, 0, w, h);
    if (sweep > 0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(sweepX, 0, w - sweepX, h); ctx.clip();
      ctx.fillStyle = '#f5f5f7'; ctx.fillRect(sweepX, 0, w - sweepX, h);
      ctx.translate(sweepX, 0);
      drawRoomLines(ctx, areaW, h, Math.max(0, -rect.top));
      ctx.restore();
    }
    sweepLine.style.transform = `translate3d(${sweepX.toFixed(1)}px,0,0)`;
    sweepLine.style.opacity = sweep > 0 && sweep < 1 ? 1 : sweep >= 1 ? .0 : 0;

    // 4. records: the centre strip of the room, riding in with the sweep.
    const strip = areaW * (areaW < 701 ? .72 : .44);
    const columnLeft = sweepX + (areaW - strip) / 2;
    column.style.width = `${strip.toFixed(1)}px`;
    column.style.transform = `translate3d(${columnLeft.toFixed(1)}px,0,0)`;
    column.style.visibility = sweep > 0 ? 'visible' : 'hidden';
    const progress = clamp((screens - RECORDS_AT + SWEEP * .5) / (RECORDS + SWEEP * .5));
    let swapT = null;
    if (swap) { swapT = now - swap.at; if (swapT >= SWAP_MS) { finishSwap(); swapT = null; } }
    Object.values(tracks).forEach(track => {
      if (!track.classList.contains('is-current')) return;
      // During a switch: the leaving records speed off in the wheel's
      // direction and blur, the arriving ones come in from the other side
      // and slow to a stop.
      let travel = 0;
      if (swapT !== null && (track.dataset.topic === swap.from || track.dataset.topic === swap.to)) {
        const leaving = track.dataset.topic === swap.from;
        // The way out is the way in played backwards, so both move at the
        // same speed: each takes MOVE_MS, fading over its outer FADE_MS.
        const inT = swapT - IN_AT;
        const k = leaving ? clamp(swapT / MOVE_MS) ** 2.6 : (1 - clamp(inT / MOVE_MS)) ** 2.6;
        travel = (leaving ? -1 : 1) * swap.dir * k * h * 2.6;
        track.style.opacity = String(leaving ? 1 - clamp((swapT - (MOVE_MS - FADE_MS)) / FADE_MS) : clamp(inT / FADE_MS));
        track.style.filter = k > .02 ? `blur(${(k * 9).toFixed(1)}px)` : '';
      }
      if (track.dataset.topic === 'skills') {
        // A wheel turning vertically: one tool after another comes to the front.
        const cardH = Math.min(h * .3, 260);
        const turn = progress * (wheelCards.length - 1) - travel / cardH * 1.1;
        const radius = cardH / 2 / Math.tan(Math.PI / 18);
        wheelCards.forEach((card, index) => {
          const angle = (index - turn) * 20;
          const show = Math.abs(angle) < 80;
          card.style.visibility = show ? 'visible' : 'hidden';
          if (!show) return;
          card.style.transform = `translate3d(0,-50%,${(-radius).toFixed(1)}px) rotateX(${(-angle).toFixed(2)}deg) translateZ(${radius.toFixed(1)}px)`;
          card.style.opacity = String(Math.max(0, Math.cos(angle * Math.PI / 180) ** 2).toFixed(3));
          card.classList.toggle('is-front', Math.abs(angle) < 10);
        });
        track.style.setProperty('--wheel-radius', `${radius.toFixed(1)}px`);
      } else {
        const trackH = track.scrollHeight;
        const from = h * .62, to = h * .3 - trackH;
        track.style.transform = `translate3d(0,${mix(from, to, progress).toFixed(1)}px,0)`;
        track.style.translate = travel ? `0 ${travel.toFixed(1)}px` : '';
      }
    });

    if (visible && (moving || swap || drumState.mode === 'spinning' || drumState.mode === 'stopping' || drumState.mode === 'dragging')) wake();
  };

  function wake() { if (!frame && visible) frame = requestAnimationFrame(render); }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) { last = 0; wake(); } else delete document.documentElement.dataset.roomMy; }).observe(section);
  addEventListener('scroll', wake, { passive: true });

  // One scroll is enough: from the question, a single turn of the wheel glides
  // the page all the way into the records (the room sweeping in on the way),
  // and a single turn back up returns to the question. Registered before the
  // site-wide smooth scroller, so it gets the wheel first.
  const sectionTop = () => section.getBoundingClientRect().top + scrollY;
  let snapTarget = null;
  addEventListener('wheel', event => {
    if (reduced.matches || event.defaultPrevented || event.ctrlKey || !window.siteScroll) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    const top = sectionTop(), screens = (scrollY - top) / h;
    const question = top + (RISE + .05) * h, records = top + RECORDS_AT * h;
    // While the glide is still on its way, further turns of the wheel are absorbed.
    if (snapTarget !== null && window.siteScroll.moving && Math.abs(scrollY - snapTarget) > 60) { event.preventDefault(); return; }
    snapTarget = null;
    if (event.deltaY > 0 && screens >= RISE - .1 && screens < RECORDS_AT - .05) snapTarget = records;
    else if (event.deltaY < 0 && screens > RISE + .15 && screens <= RECORDS_AT + .05) snapTarget = question;
    if (snapTarget === null) return;
    event.preventDefault();
    window.siteScroll.scrollTo(snapTarget);
  }, { passive: false });
  addEventListener('resize', resize);
  reduced.addEventListener('change', wake);
  document.fonts?.ready.then(resize);
  resize();
}
