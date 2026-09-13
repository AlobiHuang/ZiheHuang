(() => {
  const stage = document.querySelector('.intro-playground');
  if (!stage) return;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const hobbyNotesGroup = stage.querySelector('.intro-hobby-notes');
  const hobbyNotes = [...stage.querySelectorAll('.intro-hobby-note')];
  const stackToggle = stage.querySelector('.intro-stack-toggle');
  const galleryOpen = stage.querySelector('.intro-gallery-open');
  const fieldOrbit = stage.querySelector('.intro-field-orbit');
  const gallery = document.querySelector('.note-gallery');
  const galleryClose = gallery?.querySelector('.note-gallery-close');
  const galleryField = gallery?.querySelector('.note-gallery-field');
  const galleryPlane = gallery?.querySelector('.note-gallery-plane');
  const galleryTemplates = gallery ? [...gallery.querySelectorAll('.note-gallery-templates .note-gallery-card')] : [];
  const galleryBurst = gallery?.querySelector('.note-gallery-burst');
  const magnets = [...stage.querySelectorAll('[data-intro-magnet]')];
  let galleryCards = [];
  let galleryItems = [];
  let galleryReturnFocus = null;
  let notesSpread = false;
  let spreadPinned = false;
  let activeNote = -1;
  let collapseTimer = 0;
  let launchTimer = 0;

  hobbyNotes.forEach((note, index) => {
    note.style.setProperty('--note-index', String(index));
    note.style.setProperty('--stack-x', `${(index % 3 - 1) * 3}px`);
    note.style.setProperty('--stack-y', `${index * -2.4}px`);
    note.style.setProperty('--stack-r', `${[-3, 2, -1, 4, -2][index % 5]}deg`);
    note.setAttribute('role', 'option');
    note.setAttribute('aria-selected', 'false');
    note.tabIndex = -1;
  });

  const setActiveNote = index => {
    activeNote = index;
    hobbyNotes.forEach((note, noteIndex) => {
      const active = noteIndex === index;
      note.classList.toggle('is-active', active);
      note.setAttribute('aria-selected', String(active));
      note.style.setProperty('--hover-push', index < 0 ? '0px' : `${noteIndex < index ? -40 : noteIndex > index ? 40 : 0}px`);
    });
  };

  const setSpread = (open, pinned = spreadPinned) => {
    clearTimeout(collapseTimer);
    notesSpread = open;
    spreadPinned = open && pinned;
    stage.classList.toggle('is-notes-spread', open);
    stage.classList.toggle('is-notes-pinned', spreadPinned);
    hobbyNotesGroup?.setAttribute('aria-expanded', String(open));
    stackToggle?.setAttribute('aria-expanded', String(open));
    if (stackToggle) stackToggle.querySelector('span').textContent = open ? (spreadPinned ? 'STACK THE NOTES' : 'NOTES ARE OPEN') : 'SPREAD THE NOTES';
    if (!open) setActiveNote(-1);
    const readout = fieldOrbit?.querySelector('span');
    if (readout) readout.textContent = open ? '10' : '10';
  };

  const scheduleCollapse = () => {
    clearTimeout(collapseTimer);
    if (spreadPinned) return;
    collapseTimer = window.setTimeout(() => setSpread(false, false), 180);
  };

  hobbyNotesGroup?.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') setSpread(true, spreadPinned);
  });
  stage.addEventListener('pointerleave', scheduleCollapse);
  hobbyNotesGroup?.addEventListener('pointermove', event => {
    if (!notesSpread || event.pointerType === 'touch') return;
    const rect = hobbyNotesGroup.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    hobbyNotesGroup.style.setProperty('--fan-shift', `${((ratio - .5) * -12).toFixed(1)}px`);
  });
  hobbyNotesGroup?.addEventListener('focus', () => setSpread(true, spreadPinned));
  hobbyNotesGroup?.addEventListener('blur', event => {
    if (!hobbyNotesGroup.contains(event.relatedTarget)) scheduleCollapse();
  });
  hobbyNotesGroup?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSpread(!notesSpread, !notesSpread);
    }
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    setSpread(true, true);
    const next = activeNote < 0 ? 0 : (activeNote + (event.key === 'ArrowRight' ? 1 : -1) + hobbyNotes.length) % hobbyNotes.length;
    setActiveNote(next);
    hobbyNotes[next].focus({ preventScroll: true });
  });

  hobbyNotes.forEach((note, index) => {
    note.addEventListener('pointerenter', () => {
      clearTimeout(collapseTimer);
      setSpread(true, spreadPinned);
      setActiveNote(index);
    });
    note.addEventListener('pointerleave', event => {
      if (hobbyNotesGroup.contains(event.relatedTarget)) setActiveNote(-1);
    });
    note.addEventListener('click', event => {
      event.stopPropagation();
      setSpread(true, true);
      setActiveNote(index);
    });
  });

  stackToggle?.addEventListener('click', () => setSpread(!notesSpread || !spreadPinned, !spreadPinned));

  const createBurstDebris = origin => {
    if (!galleryBurst) return;
    galleryBurst.replaceChildren();
    galleryBurst.style.left = `${origin.x.toFixed(1)}px`;
    galleryBurst.style.top = `${origin.y.toFixed(1)}px`;
    const palette = ['#fff1a8', '#ffffff', '#bcdcff', '#ffc8da', '#bae5c6', '#ffd0ae', '#1d1d1f'];
    const distance = Math.max(innerWidth, innerHeight) * .72;
    for (let index = 0; index < 30; index += 1) {
      const shard = document.createElement('i');
      const angle = Math.PI * 2 * index / 30 + Math.sin(index * 8.31) * .16;
      const travel = distance * (.42 + (index % 7) * .075);
      shard.style.setProperty('--dx', `${(Math.cos(angle) * travel).toFixed(0)}px`);
      shard.style.setProperty('--dy', `${(Math.sin(angle) * travel).toFixed(0)}px`);
      shard.style.setProperty('--spin', `${index % 2 ? 420 + index * 13 : -380 - index * 11}deg`);
      shard.style.setProperty('--w', `${8 + index % 5 * 4}px`);
      shard.style.setProperty('--h', `${12 + index % 4 * 7}px`);
      shard.style.setProperty('--paper', palette[index % palette.length]);
      shard.style.setProperty('--delay', `${(index % 6) * .018}s`);
      shard.style.setProperty('--duration', `${.85 + (index % 5) * .1}s`);
      galleryBurst.append(shard);
    }
  };

  let galleryTileWidth = 0;
  let galleryTileHeight = 0;
  let galleryOffsetX = 0;
  let galleryOffsetY = 0;
  let galleryVelocityX = 0;
  let galleryVelocityY = 0;
  let galleryPointer = null;
  let galleryLastX = 0;
  let galleryLastY = 0;
  let galleryLastTime = 0;
  let galleryDragged = false;
  let galleryMomentum = 0;
  let galleryRenderFrame = 0;
  let suppressGalleryClickUntil = 0;
  let galleryTransitionTimer = 0;
  let galleryClosing = false;

  const wrapGalleryAxis = (value, size) => {
    if (!size) return value;
    return ((value + size / 2) % size + size) % size - size / 2;
  };

  const renderGalleryPosition = () => {
    galleryOffsetX = wrapGalleryAxis(galleryOffsetX, galleryTileWidth);
    galleryOffsetY = wrapGalleryAxis(galleryOffsetY, galleryTileHeight);
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    galleryItems.forEach(({ element, baseX, baseY }) => {
      const x = centerX + wrapGalleryAxis(baseX + galleryOffsetX, galleryTileWidth);
      const y = centerY + wrapGalleryAxis(baseY + galleryOffsetY, galleryTileHeight);
      element.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%)`;
    });
  };

  const queueGalleryRender = () => {
    if (galleryRenderFrame) return;
    galleryRenderFrame = requestAnimationFrame(() => {
      galleryRenderFrame = 0;
      renderGalleryPosition();
    });
  };

  const stopGalleryMomentum = () => {
    if (galleryMomentum) cancelAnimationFrame(galleryMomentum);
    galleryMomentum = 0;
  };

  const buildInfiniteGallery = () => {
    if (!galleryPlane || !galleryTemplates.length) return;
    const compact = innerWidth < 760;
    const columns = compact ? 5 : 9;
    const rows = Math.ceil(galleryTemplates.length / columns);
    const cellWidth = compact ? 290 : 390;
    const cellHeight = compact ? 370 : 450;
    galleryTileWidth = Math.max(innerWidth * 1.55, columns * cellWidth);
    galleryTileHeight = Math.max(innerHeight * 1.65, rows * cellHeight);
    galleryPlane.replaceChildren();
    const fragment = document.createDocumentFragment();
    const angles = [-7, 4, -3, 6, -5, 8, -4, 3, -8, 5];
    galleryItems = galleryTemplates.map((template, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const jitterX = (((index * 37) % 17) - 8) * (compact ? 3.2 : 4.6);
      const jitterY = (((index * 23) % 15) - 7) * (compact ? 3.1 : 4.2);
      const rowStagger = row % 2 ? cellWidth * .34 : 0;
      const baseX = (column + .5) / columns * galleryTileWidth - galleryTileWidth / 2 + rowStagger + jitterX;
      const baseY = (row + .5) / rows * galleryTileHeight - galleryTileHeight / 2 + jitterY;
      const item = document.createElement('div');
      item.className = 'note-gallery-item is-primary';
      item.style.setProperty('--photo-ratio', template.style.getPropertyValue('--photo-ratio'));
      const card = template.cloneNode(true);
      card.style.setProperty('--r', `${angles[index % angles.length]}deg`);
      const image = card.querySelector('img[data-src]');
      if (image) {
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
      }
      card.dataset.noteIndex = String(index);
      card.style.setProperty('--delay', `${(index % 8) * .055}s`);
      card.setAttribute('aria-pressed', 'false');
      item.append(card);
      fragment.append(item);
      return { element: item, baseX, baseY };
    });
    galleryPlane.append(fragment);
    galleryCards = [...galleryPlane.querySelectorAll('.note-gallery-card')];
    renderGalleryPosition();
  };

  const getGalleryOrigin = () => {
    const rect = hobbyNotesGroup.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const prepareGalleryTransition = () => {
    const origin = getGalleryOrigin();
    gallery?.style.setProperty('--burst-origin-x', `${origin.x.toFixed(1)}px`);
    gallery?.style.setProperty('--burst-origin-y', `${origin.y.toFixed(1)}px`);
    gallery?.querySelectorAll('.note-gallery-item.is-primary').forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const card = item.querySelector('.note-gallery-card');
      card?.style.setProperty('--burst-x', `${(origin.x - rect.left - rect.width / 2).toFixed(1)}px`);
      card?.style.setProperty('--burst-y', `${(origin.y - rect.top - rect.height / 2).toFixed(1)}px`);
      card?.style.setProperty('--burst-delay', `${((index % 18) * .018).toFixed(3)}s`);
      card?.style.setProperty('--collect-delay', `${(((galleryTemplates.length - 1 - index) % 18) * .01).toFixed(3)}s`);
    });
    return origin;
  };

  const focusGalleryCard = card => {
    if (performance.now() < suppressGalleryClickUntil) return;
    const focused = card.classList.contains('is-focused');
    galleryCards.forEach(item => {
      item.classList.remove('is-focused');
      item.setAttribute('aria-pressed', 'false');
    });
    card.classList.toggle('is-focused', !focused);
    card.setAttribute('aria-pressed', String(!focused));
  };

  const startGalleryMomentum = () => {
    stopGalleryMomentum();
    let previous = performance.now();
    const coast = now => {
      const elapsed = Math.min(32, now - previous);
      previous = now;
      const decay = Math.pow(.93, elapsed / 16.67);
      galleryVelocityX *= decay;
      galleryVelocityY *= decay;
      galleryOffsetX += galleryVelocityX * elapsed;
      galleryOffsetY += galleryVelocityY * elapsed;
      renderGalleryPosition();
      if (Math.hypot(galleryVelocityX, galleryVelocityY) > .012 && gallery?.classList.contains('is-open')) {
        galleryMomentum = requestAnimationFrame(coast);
      } else {
        galleryMomentum = 0;
      }
    };
    galleryMomentum = requestAnimationFrame(coast);
  };

  galleryField?.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    stopGalleryMomentum();
    galleryPointer = event.pointerId;
    galleryLastX = event.clientX;
    galleryLastY = event.clientY;
    galleryLastTime = performance.now();
    galleryVelocityX = 0;
    galleryVelocityY = 0;
    galleryDragged = false;
    galleryField.classList.add('is-dragging');
    galleryField.setPointerCapture(event.pointerId);
  });
  galleryField?.addEventListener('pointermove', event => {
    if (event.pointerId !== galleryPointer) return;
    const now = performance.now();
    const dx = event.clientX - galleryLastX;
    const dy = event.clientY - galleryLastY;
    const elapsed = Math.max(8, now - galleryLastTime);
    if (Math.hypot(dx, dy) > 2) galleryDragged = true;
    galleryOffsetX += dx;
    galleryOffsetY += dy;
    galleryVelocityX = galleryVelocityX * .55 + dx / elapsed * .45;
    galleryVelocityY = galleryVelocityY * .55 + dy / elapsed * .45;
    galleryLastX = event.clientX;
    galleryLastY = event.clientY;
    galleryLastTime = now;
    queueGalleryRender();
    if (galleryDragged) event.preventDefault();
  });
  const finishGalleryDrag = event => {
    if (galleryPointer === null || (event.pointerId !== undefined && event.pointerId !== galleryPointer)) return;
    const activePointer = galleryPointer;
    galleryPointer = null;
    try { galleryField?.releasePointerCapture(activePointer); } catch {}
    galleryField?.classList.remove('is-dragging');
    if (galleryDragged) {
      suppressGalleryClickUntil = performance.now() + 180;
      startGalleryMomentum();
    }
  };
  galleryField?.addEventListener('pointerup', finishGalleryDrag);
  galleryField?.addEventListener('pointercancel', finishGalleryDrag);
  galleryField?.addEventListener('lostpointercapture', event => { if (galleryPointer !== null) finishGalleryDrag(event); });
  galleryField?.addEventListener('click', event => {
    const card = event.target.closest('.note-gallery-card');
    if (card) focusGalleryCard(card);
  });
  galleryField?.addEventListener('wheel', event => {
    if (!gallery?.classList.contains('is-open')) return;
    stopGalleryMomentum();
    galleryOffsetX -= event.deltaX + (event.shiftKey ? event.deltaY : 0);
    galleryOffsetY -= event.shiftKey ? 0 : event.deltaY;
    renderGalleryPosition();
    event.preventDefault();
  }, { passive: false });

  const openGallery = () => {
    if (!gallery || gallery.classList.contains('is-open') || gallery.classList.contains('is-preparing')) return;
    galleryReturnFocus = document.activeElement;
    galleryClosing = false;
    clearTimeout(galleryTransitionTimer);
    clearTimeout(launchTimer);
    stopGalleryMomentum();
    galleryOffsetX = 0;
    galleryOffsetY = 0;
    buildInfiniteGallery();
    document.body.classList.add('note-gallery-open');
    document.querySelector('main')?.setAttribute('inert', '');
    gallery.setAttribute('aria-hidden', 'false');
    gallery.classList.add('is-preparing');
    requestAnimationFrame(() => {
      const origin = prepareGalleryTransition();
      createBurstDebris(origin);
      gallery.classList.remove('is-preparing');
      gallery.classList.add('is-open', 'is-entering');
      galleryTransitionTimer = window.setTimeout(() => {
        gallery.classList.remove('is-entering');
        galleryClose?.focus();
      }, 1380);
    });
  };

  const launchGallery = () => {
    if (stage.classList.contains('is-launching-gallery')) return;
    setSpread(true, true);
    stage.classList.add('is-launching-gallery');
    hobbyNotes.forEach((note, index) => {
      const angle = -Math.PI * .82 + index / Math.max(1, hobbyNotes.length - 1) * Math.PI * 1.64;
      note.style.setProperty('--launch-x', `${Math.cos(angle) * (210 + index * 9)}px`);
      note.style.setProperty('--launch-y', `${Math.sin(angle) * (155 + index * 5)}px`);
      note.style.setProperty('--launch-r', `${(index - 4.5) * 16}deg`);
    });
    launchTimer = window.setTimeout(openGallery, 430);
  };

  galleryOpen?.addEventListener('click', launchGallery);

  const resetExperience = () => {
    clearTimeout(launchTimer);
    stage.classList.remove('is-launching-gallery');
    hobbyNotesGroup?.style.removeProperty('--fan-shift');
    spreadPinned = false;
    setSpread(false, false);
  };

  const closeGallery = () => {
    if (!gallery || !gallery.classList.contains('is-open') || galleryClosing) return;
    galleryClosing = true;
    clearTimeout(galleryTransitionTimer);
    stopGalleryMomentum();
    galleryCards.forEach(card => { card.classList.remove('is-focused'); card.setAttribute('aria-pressed', 'false'); });
    prepareGalleryTransition();
    gallery.classList.remove('is-entering');
    gallery.classList.add('is-closing');
    galleryTransitionTimer = window.setTimeout(() => {
      gallery.classList.remove('is-open', 'is-closing', 'is-preparing');
      gallery.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('note-gallery-open');
      document.querySelector('main')?.removeAttribute('inert');
      galleryOffsetX = 0;
      galleryOffsetY = 0;
      resetExperience();
      galleryClosing = false;
      (galleryReturnFocus instanceof HTMLElement ? galleryReturnFocus : stackToggle)?.focus();
    }, 1080);
  };

  galleryClose?.addEventListener('click', closeGallery);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && gallery?.classList.contains('is-open')) closeGallery();
    if (!gallery?.classList.contains('is-open') || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const step = event.shiftKey ? 180 : 72;
    galleryOffsetX += event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0;
    galleryOffsetY += event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0;
    renderGalleryPosition();
  });
  window.addEventListener('resize', () => {
    if (gallery?.classList.contains('is-open')) buildInfiniteGallery();
  });

  magnets.forEach(magnet => {
    let pointer = null;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;
    let startBounds = null;
    let stageBounds = null;

    const place = (x, y) => {
      magnet.dataset.x = String(x);
      magnet.dataset.y = String(y);
      magnet.style.setProperty('--magnet-x', `${x}px`);
      magnet.style.setProperty('--magnet-y', `${y}px`);
    };

    const finish = event => {
      if (pointer === null || (event.pointerId !== undefined && event.pointerId !== pointer)) return;
      const activePointer = pointer;
      pointer = null;
      try { magnet.releasePointerCapture(activePointer); } catch {}
      magnet.classList.remove('is-dragging');
    };

    magnet.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      pointer = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      baseX = Number(magnet.dataset.x || 0);
      baseY = Number(magnet.dataset.y || 0);
      startBounds = magnet.getBoundingClientRect();
      stageBounds = stage.getBoundingClientRect();
      magnet.classList.add('is-dragging');
      magnet.setPointerCapture(event.pointerId);
    });
    magnet.addEventListener('pointermove', event => {
      if (event.pointerId !== pointer) return;
      const rawX = baseX + event.clientX - startX;
      const rawY = baseY + event.clientY - startY;
      const x = clamp(rawX, baseX + stageBounds.left + 8 - startBounds.left, baseX + stageBounds.right - 8 - startBounds.right);
      const y = clamp(rawY, baseY + stageBounds.top + 8 - startBounds.top, baseY + stageBounds.bottom - 8 - startBounds.bottom);
      place(Math.round(x), Math.round(y));
      event.preventDefault();
    });
    magnet.addEventListener('pointerup', finish);
    magnet.addEventListener('pointercancel', finish);
    magnet.addEventListener('lostpointercapture', event => { if (pointer !== null) finish(event); });
    magnet.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? 28 : 10;
      const x = Number(magnet.dataset.x || 0) + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0);
      const y = Number(magnet.dataset.y || 0) + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0);
      place(x, y);
    });
    place(0, 0);
  });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const cursor = document.querySelector('.fx-cursor span');
    if (!cursor) return;
    [[hobbyNotesGroup, 'SPREAD'], [galleryOpen, 'OPEN'], [galleryField, 'DRAG'], ...magnets.map(magnet => [magnet, 'DRAG'])].forEach(([element, label]) => {
      if (!element) return;
      element.addEventListener('pointerenter', () => { cursor.textContent = label; });
    });
  }));

  resetExperience();
})();

