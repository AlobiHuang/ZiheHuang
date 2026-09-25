// Pixel world map for "Where I'm from": the land drawn as individual black
// cells, with red markers for places. Hover a marker to see its name, click it
// to open a small billboard with a photo; moving away folds it back.
// Europe is too dense for this small map, so its places sit in a magnified
// inset (bottom left) linked to a frame drawn around Europe. Places in the
// same group share one marker whose billboard lists them. Markers that still
// land on top of each other are nudged apart a little.
// Edit PLACES below: lon/lat in degrees, optional image path such as
// 'assets/places/paris.jpg', an optional group name, and inset: 'europe'
// for places shown in the Europe inset.
const PLACES = [
  { name: 'Shenzhen', country: 'China', lon: 114.06, lat: 22.54 },
  { name: 'Beijing', country: 'China', lon: 116.40, lat: 39.90 },
  { name: 'Shanghai', country: 'China', lon: 121.47, lat: 31.23 },
  { name: 'Pittsburgh', country: 'USA', lon: -79.99, lat: 40.44 },
  { name: 'San Francisco', country: 'USA', lon: -122.42, lat: 37.77 },
  { name: 'Las Vegas', country: 'USA', lon: -115.14, lat: 36.17 },
  { name: 'London', country: 'UK', lon: -0.13, lat: 51.51, inset: 'europe' },
  { name: 'Paris', country: 'France', lon: 2.35, lat: 48.86, inset: 'europe' },
  { name: 'Madrid', country: 'Spain', lon: -3.70, lat: 40.42, inset: 'europe' },
  { name: 'Berlin', country: 'Germany', lon: 13.40, lat: 52.52, inset: 'europe' },
  { name: 'Munich', country: 'Germany', lon: 11.58, lat: 48.14, inset: 'europe' },
  { name: 'Köln', country: 'Germany', lon: 6.96, lat: 50.94, inset: 'europe' },
  { name: 'Switzerland', lon: 8.23, lat: 46.80, inset: 'europe' },
  { name: 'Thailand', lon: 100.50, lat: 13.75 },
  { name: 'Japan', lon: 139.69, lat: 35.69 }
];

// Europe inset: 1° cells from 11°W to 21°E and 59°N to 35°N (same source).
const EUROPE = { west: -11, north: 59, step: 1, rows: [
  '....#.##........####..######....',
  '....#####...........##.#####.#..',
  '.....####..........###.#####....',
  '...#######.........#######......',
  '.##########.........#####.######',
  '.####..####.....################',
  '.####..######..#################',
  '.##...#######.##################',
  '.....######.####################',
  '.........#######################',
  '......##########################',
  '.......#########################',
  '.........#######################',
  '..........######################',
  '.........###############..######',
  '..#################..####..#####',
  '..############.....##.####...###',
  '..############......#..#####..##',
  '..##########.......##....####.##',
  '.##########..#.....##......#...#',
  '.##########...............##...#',
  '..########..........#..####.....',
  '....#####..###########...#......',
  '.....###.#############..........'
] };

// Land cells, 100 × 37, equirectangular from 78°N to 55°S (3.6° per cell).
// Generated from Natural Earth land (world-atlas, 1:50m).
const LAND = [
  '................############...##############.........#...........###.....########......##.#........',
  '#..............######.########....##########....................##...#################.#####........',
  '#...############################...########...........#######..#####################################',
  '##..#######################..####..#####....##.......###############################################',
  '....#####################...####....###............####.############################################',
  '.....###...##############...#####...............#..####.###################################.####....',
  '.....#.......##############.######.............###..######################################...##.....',
  '..............#####################............###########################################...#......',
  '...............####################..............#########################################..........',
  '...............##################..............###########..############################.#..........',
  '...............###############.................####...##########.#####################...#..........',
  '................#############...................######..#.##########################.#.##...........',
  '.................###########...................#######..#..#########################..##............',
  '..................##########...................#####################################................',
  '..................#####....#..................######################################................',
  '....................###..#.##................######################..#############..................',
  '.....................#####....#..............#####################....####..#####..#................',
  '.......................####..................####################.....###....####..##...............',
  '..........................#..####............####################......#.....####...#...............',
  '...........................#######............##################........#....#......#...............',
  '............................########...........###..############............###..##.................',
  '...........................##########...............##########...............##.######..............',
  '...........................############..............#########................######..####..........',
  '...........................##############............########..................###......###.........',
  '............................############.............########............................#.#........',
  '............................###########..............#########.#.....................###.#..........',
  '..............................#########..............########.##....................#######.........',
  '..............................#########..............#######..##..................##########........',
  '..............................########................######..#..................############.......',
  '..............................#######.................#####......................############.......',
  '..............................######...................###........................###########.......',
  '..............................#####....................#..........................#.....####......#.',
  '.............................#####.......................................................###......##',
  '.............................###..........................................................#......##.',
  '.............................###................................................................##..',
  '.............................###....................................................................',
  '.............................###....................................................................'
];
const COLS = 100, ROWS = 37, NORTH = 78, STEP = 3.6;

const map = document.querySelector('[data-world-map]');
if (map) {
  const cell = .74; // cell size inside each 1 × 1 grid slot; the rest is the gap
  const cellsPath = rows => {
    let d = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] === '#') d += `M${x + (1 - cell) / 2} ${y + (1 - cell) / 2}h${cell}v${cell}h-${cell}z`;
    });
    return d;
  };
  const euCols = EUROPE.rows[0].length, euRows = EUROPE.rows.length;
  const euEast = EUROPE.west + euCols * EUROPE.step, euSouth = EUROPE.north - euRows * EUROPE.step;
  const worldX = lon => (lon + 180) / STEP, worldY = lat => (NORTH - lat) / STEP;
  map.innerHTML = `<svg class="wm-land" viewBox="0 0 ${COLS} ${ROWS}" preserveAspectRatio="none" aria-hidden="true"><path d="${cellsPath(LAND)}"/>`
    + `<rect class="wm-frame" x="${worldX(EUROPE.west)}" y="${worldY(EUROPE.north)}" width="${euCols * EUROPE.step / STEP}" height="${euRows * EUROPE.step / STEP}"/></svg>`
    + `<svg class="wm-leader" aria-hidden="true"><line/></svg>`
    + `<div class="wm-inset" style="--inset-ratio:${euCols}/${euRows}"><small>EUROPE</small>`
    + `<svg viewBox="0 0 ${euCols} ${euRows}" preserveAspectRatio="none" aria-hidden="true"><path d="${cellsPath(EUROPE.rows)}"/></svg></div>`;
  const inset = map.querySelector('.wm-inset');
  const leader = map.querySelector('.wm-leader');

  const labelOf = place => (place.country ? `${place.name} · ${place.country}` : place.name).toUpperCase();
  const photoOf = place => (place.image ? `<img src="${place.image}" alt="" loading="lazy" decoding="async">` : '<i>IMAGE</i>');

  // One marker per place, or per group.
  const markers = [];
  PLACES.forEach(place => {
    const existing = place.group && markers.find(marker => marker.group === place.group);
    if (existing) existing.places.push(place);
    else markers.push({ group: place.group || null, inset: place.inset || null, places: [place] });
  });

  const setOpen = (marker, open) => {
    marker.classList.toggle('is-open', open);
    marker.querySelector('.wm-pin').setAttribute('aria-expanded', String(open));
  };
  const closeAll = except => map.querySelectorAll('.wm-place.is-open').forEach(marker => { if (marker !== except) setOpen(marker, false); });

  const placed = [];
  markers.forEach(({ group, inset: inInset, places }) => {
    const lon = places.reduce((sum, place) => sum + place.lon, 0) / places.length;
    const lat = places.reduce((sum, place) => sum + place.lat, 0) / places.length;
    const x = inInset ? (lon - EUROPE.west) / (euCols * EUROPE.step) * 100 : (lon + 180) / (STEP * COLS) * 100;
    const y = inInset ? (EUROPE.north - lat) / (euRows * EUROPE.step) * 100 : (NORTH - lat) / (STEP * ROWS) * 100;
    const title = group ? `${group} · ${places.length}`.toUpperCase() : labelOf(places[0]);
    const marker = document.createElement('div');
    marker.className = 'wm-place' + (!inInset && x > 55 ? ' is-east' : '') + (group ? ' is-group' : '');
    marker.style.setProperty('--x', `${x.toFixed(2)}%`);
    marker.style.setProperty('--y', `${y.toFixed(2)}%`);
    marker.style.setProperty('--chars', title.length);
    marker.style.setProperty('--rows', group ? Math.ceil(places.length / 2) : 0);
    const list = group
      ? `<span class="wm-list">${places.map((place, index) => `<button type="button" data-index="${index}"${index ? '' : ' class="is-active"'}>${place.name.toUpperCase()}</button>`).join('')}</span>`
      : '';
    marker.innerHTML = `<button type="button" class="wm-pin" aria-expanded="false" aria-label="${group ? `${group}: ${places.map(place => place.name).join(', ')}` : labelOf(places[0])}">${group ? `<b>${places.length}</b>` : ''}</button>`
      + `<span class="wm-box"><span class="wm-photo">${photoOf(places[0])}</span><span class="wm-label"><span class="wm-title">${title}</span><span class="wm-current">${labelOf(places[0])}</span></span>${list}</span>`;
    marker.querySelector('.wm-pin').addEventListener('click', () => {
      const open = !marker.classList.contains('is-open');
      closeAll(marker);
      setOpen(marker, open);
    });
    marker.querySelectorAll('.wm-list button').forEach(button => button.addEventListener('click', () => {
      const place = places[+button.dataset.index];
      marker.querySelector('.wm-photo').innerHTML = photoOf(place);
      marker.querySelector('.wm-current').textContent = labelOf(place);
      marker.querySelectorAll('.wm-list button').forEach(other => other.classList.toggle('is-active', other === button));
    }));
    // Fold back when the mouse leaves (touch closes on the next tap elsewhere).
    marker.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') setOpen(marker, false); });
    marker.addEventListener('focusout', event => { if (!marker.contains(event.relatedTarget)) setOpen(marker, false); });
    (inInset ? inset : map).append(marker);
    placed.push({ marker, x, y, box: inInset ? inset : map, size: group ? 22 : 14 });
  });

  // Nudge markers that overlap on screen apart, and draw the line that ties
  // the Europe frame to the inset.
  const layout = () => {
    const boxes = new Map();
    placed.forEach(item => {
      if (!boxes.has(item.box)) boxes.set(item.box, item.box.getBoundingClientRect());
      const rect = boxes.get(item.box);
      item.px = item.x / 100 * rect.width; item.py = item.y / 100 * rect.height; item.dx = 0; item.dy = 0;
    });
    for (let round = 0; round < 40; round++) {
      let moved = false;
      for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i], b = placed[j];
        if (a.box !== b.box) continue;
        const gap = (a.size + b.size) / 2 + 1;
        let vx = b.px + b.dx - a.px - a.dx, vy = b.py + b.dy - a.py - a.dy;
        let dist = Math.hypot(vx, vy);
        if (dist >= gap) continue;
        if (dist < .01) { vx = 1; vy = 0; dist = 1; }
        const push = (gap - dist) / 2 / dist;
        a.dx -= vx * push; a.dy -= vy * push; b.dx += vx * push; b.dy += vy * push;
        moved = true;
      }
      if (!moved) break;
    }
    placed.forEach(item => {
      item.marker.style.setProperty('--dx', `${item.dx.toFixed(1)}px`);
      item.marker.style.setProperty('--dy', `${item.dy.toFixed(1)}px`);
    });
    const frame = map.querySelector('.wm-frame').getBoundingClientRect();
    const mapRect = boxes.get(map) || map.getBoundingClientRect();
    const insetRect = inset.getBoundingClientRect();
    const stacked = insetRect.top >= mapRect.bottom - 1;
    leader.setAttribute('viewBox', `0 0 ${mapRect.width} ${Math.max(mapRect.height, insetRect.bottom - mapRect.top)}`);
    leader.style.height = `${Math.max(mapRect.height, insetRect.bottom - mapRect.top)}px`;
    const line = leader.querySelector('line');
    line.setAttribute('x1', frame.left - mapRect.left);
    line.setAttribute('y1', (stacked ? frame.bottom : frame.bottom) - mapRect.top);
    line.setAttribute('x2', (stacked ? insetRect.left + insetRect.width / 2 : insetRect.right) - mapRect.left);
    line.setAttribute('y2', insetRect.top - mapRect.top);
  };
  new ResizeObserver(layout).observe(map);
  document.addEventListener('pointerdown', event => { if (!event.target.closest?.('.wm-place')) closeAll(); });
  addEventListener('keydown', event => { if (event.key === 'Escape') closeAll(); });
}
