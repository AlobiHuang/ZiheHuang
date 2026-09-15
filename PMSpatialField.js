const startPMSpatialField = () => {
  const field = document.querySelector('[data-pm-spatial]');
  const canvas = field?.querySelector('canvas');
  const typeTarget = document.querySelector('[data-pm-title-type]');
  if (!field || !canvas || !typeTarget) return;

  const context = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let frame = 0;
  let visible = true;
  let nodes = [];
  const pointer = { x: width * .5, y: height * .5, targetX: width * .5, targetY: height * .5, strength: 0, targetStrength: 0 };

  const seeded = (column, row, offset = 0) => {
    const value = Math.sin(column * 91.31 + row * 37.17 + offset * 13.7) * 43758.5453;
    return value - Math.floor(value);
  };

  const buildNodes = () => {
    const spacing = Math.max(27, Math.min(39, width / 42));
    const columns = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;
    const next = [];
    for (let row = -1; row < rows; row += 1) {
      for (let column = -1; column < columns; column += 1) {
        const x = column * spacing + (row % 2 ? spacing * .5 : 0);
        const y = row * spacing;
        const waveA = (Math.sin(column * .43 + row * .19) + 1) * .5;
        const waveB = (Math.cos(column * .16 - row * .37) + 1) * .5;
        const density = Math.max(0, Math.min(1, waveA * .62 + waveB * .38));
        next.push({
          x,
          y,
          row,
          column,
          spacing,
          density,
          jitterX: (seeded(column, row, 1) - .5) * spacing * .12,
          jitterY: (seeded(column, row, 2) - .5) * spacing * .12,
          radius: 0,
          targetRadius: 0,
          radiusVelocity: 0,
          offsetX: 0,
          offsetY: 0,
          velocityX: 0,
          velocityY: 0,
          phase: seeded(column, row, 3) * Math.PI * 2
        });
      }
    }
    nodes = next;
  };

  const resize = () => {
    const rect = field.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
    if (!pointer.strength) {
      pointer.x = pointer.targetX = width * .5;
      pointer.y = pointer.targetY = height * .5;
    }
  };

  const draw = time => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#f5f5f7';
    context.fillRect(0, 0, width, height);

    pointer.x += (pointer.targetX - pointer.x) * (reduced ? 1 : .055);
    pointer.y += (pointer.targetY - pointer.y) * (reduced ? 1 : .055);
    pointer.strength += (pointer.targetStrength - pointer.strength) * (reduced ? 1 : .035);
    const influenceRadius = Math.max(145, Math.min(245, width * .155));

    nodes.forEach(node => {
      const motionTime = reduced ? 0 : time;
      const baseX = node.x + node.jitterX
        + Math.sin(motionTime * .00042 + node.phase + node.row * .17) * (7 + node.density * 9)
        + Math.cos(motionTime * .00018 + node.column * .31) * 4.5;
      const baseY = node.y + node.jitterY
        + Math.cos(motionTime * .00036 + node.phase + node.column * .13) * (5 + node.density * 8)
        + Math.sin(motionTime * .00015 + node.row * .37) * 4;
      const dx = pointer.x - baseX;
      const dy = pointer.y - baseY;
      const distance = Math.hypot(dx, dy);
      const proximity = distance < influenceRadius
        ? (1 - distance / influenceRadius) ** 2 * pointer.strength
        : 0;
      const directionX = distance > 0 ? dx / distance : 0;
      const directionY = distance > 0 ? dy / distance : 0;
      const targetOffset = proximity * 13;
      const ambientPulse = Math.sin(motionTime * .00072 + node.phase) * (1.4 + node.density * 1.1);
      node.targetRadius = 7.5 + node.density * 11.5 + ambientPulse + proximity * 24;
      if (reduced) {
        node.offsetX = directionX * targetOffset;
        node.offsetY = directionY * targetOffset;
        node.radius = node.targetRadius;
      } else {
        node.velocityX += (directionX * targetOffset - node.offsetX) * .018;
        node.velocityY += (directionY * targetOffset - node.offsetY) * .018;
        node.velocityX *= .91;
        node.velocityY *= .91;
        node.offsetX += node.velocityX;
        node.offsetY += node.velocityY;
        node.radiusVelocity += (node.targetRadius - node.radius) * .014;
        node.radiusVelocity *= .86;
        node.radius += node.radiusVelocity;
      }
      node.drawX = baseX + node.offsetX;
      node.drawY = baseY + node.offsetY;
      node.proximity = proximity;
    });

    context.lineWidth = .65;
    nodes.forEach((node, index) => {
      const right = nodes[index + 1];
      const below = nodes[index + Math.ceil(width / node.spacing) + 2];
      [right, below].forEach(other => {
        if (!other || Math.hypot(other.x - node.x, other.y - node.y) > node.spacing * 1.7) return;
        const energy = Math.max(node.proximity, other.proximity);
        const alpha = .025 + Math.max(node.density, other.density) * .035 + energy * .16;
        context.beginPath();
        context.moveTo(node.drawX, node.drawY);
        context.lineTo(other.drawX, other.drawY);
        context.strokeStyle = `rgba(17,17,17,${alpha})`;
        context.stroke();
      });
    });

    nodes.forEach(node => {
      const edgeFade = Math.min(1, node.drawX / 120, (width - node.drawX) / 120, node.drawY / 90, (height - node.drawY) / 90);
      const alpha = Math.max(0, edgeFade) * (.1 + node.density * .32 + node.proximity * .54);
      context.beginPath();
      context.arc(node.drawX, node.drawY, Math.max(.1, node.radius), 0, Math.PI * 2);
      context.strokeStyle = `rgba(17,17,17,${alpha})`;
      context.lineWidth = .7 + node.proximity * .9;
      context.stroke();

      if (node.density > .68) {
        context.beginPath();
        context.arc(node.drawX, node.drawY, Math.max(.1, node.radius * .63), 0, Math.PI * 2);
        context.strokeStyle = `rgba(17,17,17,${Math.max(0, edgeFade) * (.05 + node.density * .15 + node.proximity * .22)})`;
        context.lineWidth = .55;
        context.stroke();
      }

      if (node.density > .34 || node.proximity > .02) {
        const dotRadius = .65 + node.density * 1.25 + node.proximity * 2.35;
        context.beginPath();
        context.arc(node.drawX, node.drawY, dotRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(8,8,8,${Math.max(0, edgeFade) * (.22 + node.density * .62 + node.proximity * .16)})`;
        context.fill();
      }

      if (node.proximity > .14) {
        context.beginPath();
        context.arc(node.drawX, node.drawY, node.radius + 5 + node.proximity * 9, 0, Math.PI * 2);
        context.strokeStyle = `rgba(17,17,17,${node.proximity * .15})`;
        context.lineWidth = .6;
        context.stroke();
      }
    });
  };

  const tick = time => {
    if (visible && !document.hidden) draw(time);
    frame = requestAnimationFrame(tick);
  };

  const move = event => {
    const rect = field.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    if (inside) {
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.targetStrength = 1;
    } else {
      pointer.targetStrength = 0;
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
  }, { rootMargin: '160px' });
  resizeObserver.observe(field);
  visibilityObserver.observe(field);
  window.addEventListener('pointermove', move, { passive: true });
  resize();
  draw(0);
  frame = requestAnimationFrame(tick);

  const title = typeTarget.closest('.pm-spatial-title');
  const text = 'PROJECTS';
  const type = () => {
    if (title.classList.contains('is-typing')) return;
    title.classList.add('is-typing');
    if (reduced) {
      typeTarget.textContent = text;
      title.classList.add('is-typed');
      return;
    }
    let index = 0;
    const next = () => {
      typeTarget.textContent = text.slice(0, index++);
      if (index <= text.length) setTimeout(next, 38 + Math.random() * 18);
      else title.classList.add('is-typed');
    };
    next();
  };
  const titleObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      type();
      titleObserver.disconnect();
    }
  }, { threshold: .35 });
  titleObserver.observe(title);

  addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', move);
  }, { once: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPMSpatialField, { once: true });
} else {
  startPMSpatialField();
}
