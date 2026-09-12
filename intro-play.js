(() => {
  const stage = document.querySelector('.intro-playground');
  if (!stage) return;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const sticker = stage.querySelector('.intro-sticker');
  const noteSecret = stage.querySelector('.intro-note-secret');
  const noteReset = stage.querySelector('.intro-note-reset');
  const pull = stage.querySelector('.intro-pull');
  const pullLabel = pull.querySelector('span');
  const hobbyNotes = [...stage.querySelectorAll('.intro-hobby-note')];
  const hobbyNotesGroup = stage.querySelector('.intro-hobby-notes');
  const fieldOrbit = stage.querySelector('.intro-field-orbit');
  const gallery = document.querySelector('.note-gallery');
  const galleryClose = gallery?.querySelector('.note-gallery-close');
  const galleryField = gallery?.querySelector('.note-gallery-field');
  const galleryPlane = gallery?.querySelector('.note-gallery-plane');
  const galleryTemplates = gallery ? [...gallery.querySelectorAll('.note-gallery-templates .note-gallery-card')] : [];
  let galleryCards = [];
  let galleryItems = [];
  const galleryBurst = gallery?.querySelector('.note-gallery-burst');
  const magnets = [...stage.querySelectorAll('[data-intro-magnet]')];

  let stickerPointer = null;
  let stickerStartX = 0;
  let stickerStartY = 0;
  let stickerDistance = 0;
  let stickerMoved = false;

  const setNoteOpen = open => {
    stage.classList.toggle('is-note-open', open);
    sticker.setAttribute('aria-expanded', String(open));
    sticker.tabIndex = open ? -1 : 0;
    noteSecret.setAttribute('aria-hidden', String(!open));
    noteReset.disabled = !open;
    stage.style.removeProperty('--sticker-x');
    stage.style.removeProperty('--sticker-y');
    stage.style.removeProperty('--sticker-rotate');
  };

  const finishSticker = event => {
    if (stickerPointer === null || (event.pointerId !== undefined && event.pointerId !== stickerPointer)) return;
    const open = stickerDistance > 55;
    const activePointer = stickerPointer;
    stickerPointer = null;
    try { sticker.releasePointerCapture(activePointer); } catch {}
    stage.classList.remove('is-note-dragging');
    if (open) beginHobbyPeeling();
    else setNoteOpen(false);
  };

  sticker.addEventListener('pointerdown', event => {
    if (event.button !== 0 || stage.classList.contains('is-note-open')) return;
    stickerPointer = event.pointerId;
    stickerStartX = event.clientX;
    stickerStartY = event.clientY;
    stickerDistance = 0;
    stickerMoved = false;
    stage.classList.add('is-note-dragging');
    sticker.setPointerCapture(event.pointerId);
  });
  sticker.addEventListener('pointermove', event => {
    if (event.pointerId !== stickerPointer) return;
    const dx = event.clientX - stickerStartX;
    const dy = event.clientY - stickerStartY;
    stickerDistance = Math.hypot(dx, dy);
    if (stickerDistance > 4) stickerMoved = true;
    stage.style.setProperty('--sticker-x', `${clamp(dx * .72, -65, 220)}px`);
    stage.style.setProperty('--sticker-y', `${clamp(dy * .72, -110, 135)}px`);
    stage.style.setProperty('--sticker-rotate', `${clamp(dx * .065 - dy * .025 - 2, -13, 17)}deg`);
    if (stickerMoved) event.preventDefault();
  });
  sticker.addEventListener('pointerup', finishSticker);
  sticker.addEventListener('pointercancel', finishSticker);
  sticker.addEventListener('lostpointercapture', event => { if (stickerPointer !== null) finishSticker(event); });
  sticker.addEventListener('click', () => {
    if (stickerMoved) { stickerMoved = false; return; }
    beginHobbyPeeling();
  });
  noteReset.addEventListener('click', () => { resetExperience(); sticker.focus(); });

  let pullPointer = null;
  let pullStartY = 0;
  let pullStartProgress = 0;
  let pullProgress = 0;
  let pullMoved = false;
  let pullRewinding = false;
  let pullPhase = 0;
  let pullResetting = false;
  let galleryReturnFocus = null;

  const setFieldProgress = (progress, remaining = hobbyNotes.length) => {
    stage.style.setProperty('--field-progress', String(clamp(progress, 0, 1)));
    const readout = fieldOrbit?.querySelector('span');
    if (readout) readout.textContent = String(Math.max(0, remaining));
    const label = fieldOrbit?.querySelector('b');
    if (label) label.textContent = remaining === 1 ? 'note left' : 'notes left';
  };

  const setPullProgress = progress => {
    pullProgress = clamp(progress, 0, 1);
    stage.style.setProperty('--pull-progress', String(pullProgress));
    if (pullPhase === 1) setFieldProgress(hobbyPeelIndex / hobbyNotes.length, hobbyNotes.length - hobbyPeelIndex);
  };

  // The opening pull has seven timing windows: the cover plus six notes.
  // Animate only those cards; the full stack is activated after the pull.
  const peelCards = [sticker, ...hobbyNotes.slice(0, 6)];
  const peelStarts = [0, .26, .45, .59, .70, .79, .86];
  const peelEnds = [.26, .45, .59, .70, .79, .86, 1];
  let hobbyPeelIndex = 0;
  let hobbyPointer = null;
  let hobbyStartX = 0;
  let hobbyStartY = 0;
  let hobbyDistance = 0;
  let hobbyPullOrigin = 0;

  const renderHobbyStack = () => {
    hobbyNotesGroup.setAttribute('aria-hidden', 'false');
    hobbyNotes.forEach((note, index) => {
      const depth = index - hobbyPeelIndex;
      const isPeeled = depth < 0;
      const isTop = depth === 0;
      note.style.transform = isPeeled
        ? 'translate3d(220px, -150px, 0) rotate(18deg) scale(.94)'
        : `translate3d(${Math.min(depth, 5) * -2}px, ${Math.min(depth, 5) * -3}px, 0) rotate(${Math.min(depth, 5) * .7 - 2}deg)`;
      note.style.opacity = isPeeled ? '0' : '1';
      note.style.filter = 'none';
      note.style.visibility = isPeeled || depth > 5 ? 'hidden' : 'visible';
      note.style.zIndex = String(hobbyNotes.length - index + 8);
      note.style.pointerEvents = isTop ? 'auto' : 'none';
      note.tabIndex = isTop ? 0 : -1;
      note.setAttribute('aria-hidden', String(!isTop));
    });
  };

  const beginHobbyPeeling = () => {
    if (pullPhase === 1) return;
    // The second pull uses a longer rail. Convert the handle's current pixel
    // position to that rail so it does not jump when the interaction changes.
    hobbyPullOrigin = pullProgress / 2;
    pullPhase = 1;
    hobbyPeelIndex = 0;
    setNoteOpen(true);
    sticker.hidden = true;
    stage.classList.add('is-hobbies-open');
    stage.classList.remove('is-auto-peeling');
    setPullProgress(hobbyPullOrigin);
    renderHobbyStack();
    pull.setAttribute('aria-expanded', 'true');
    pullLabel.textContent = `Peel 01 / ${String(hobbyNotes.length).padStart(2, '0')}`;
    pullResetting = false;
    setFieldProgress(0, hobbyNotes.length);
  };

  const peelHobbyNote = index => {
    if (pullPhase !== 1 || index !== hobbyPeelIndex) return;
    hobbyPeelIndex += 1;
    setPullProgress(hobbyPullOrigin + (hobbyPeelIndex / hobbyNotes.length) * (1 - hobbyPullOrigin));
    renderHobbyStack();
    setFieldProgress(hobbyPeelIndex / hobbyNotes.length, hobbyNotes.length - hobbyPeelIndex);
    if (hobbyPeelIndex === hobbyNotes.length) {
      pullLabel.textContent = 'Open all notes';
      window.setTimeout(openGallery, 260);
    } else {
      pullLabel.textContent = `Peel ${String(hobbyPeelIndex + 1).padStart(2, '0')} / ${String(hobbyNotes.length).padStart(2, '0')}`;
      hobbyNotes[hobbyPeelIndex].focus({ preventScroll: true });
    }
  };

  const renderPulleyHobbyPeel = progress => {
    const p = clamp(progress, 0, 1);
    const travel = clamp((p - hobbyPullOrigin) / Math.max(.001, 1 - hobbyPullOrigin), 0, 1);
    const exact = travel * hobbyNotes.length;
    const completedInPull = Math.min(hobbyNotes.length, Math.floor(exact + .0001));
    const activeIndex = completedInPull;
    const local = activeIndex < hobbyNotes.length ? exact - completedInPull : 0;
    hobbyPeelIndex = activeIndex;

    hobbyNotes.forEach((note, index) => {
      const depth = index - activeIndex;
      const isPeeled = depth < 0;
      const isActive = depth === 0 && activeIndex < hobbyNotes.length;
      if (isActive) {
        const eased = 1 - Math.pow(1 - local, 3);
        note.style.transform = `translate3d(${(205 * eased).toFixed(1)}px,${(-132 * eased).toFixed(1)}px,${(24 * local).toFixed(1)}px) rotate(${(-2 + 20 * eased).toFixed(1)}deg) scale(${(1 - .06 * local).toFixed(3)})`;
        note.style.opacity = String(1 - clamp((local - .72) / .28, 0, 1));
      } else {
        note.style.transform = isPeeled
          ? 'translate3d(220px, -150px, 0) rotate(18deg) scale(.94)'
          : `translate3d(${Math.min(depth, 5) * -2}px, ${Math.min(depth, 5) * -3}px, 0) rotate(${Math.min(depth, 5) * .7 - 2}deg)`;
        note.style.opacity = isPeeled ? '0' : '1';
      }
      note.style.visibility = isPeeled || depth > 5 ? 'hidden' : 'visible';
      note.style.pointerEvents = 'none';
      note.tabIndex = -1;
      note.setAttribute('aria-hidden', 'true');
    });

    const remaining = hobbyNotes.length - activeIndex;
    setFieldProgress(activeIndex / hobbyNotes.length, remaining);
    pullLabel.textContent = remaining > 0
      ? `Peeling ${String(activeIndex + 1).padStart(2, '0')} / ${String(hobbyNotes.length).padStart(2, '0')}`
      : 'All notes revealed';
  };

  hobbyNotes.forEach((note, index) => {
    note.setAttribute('role', 'button');
    note.setAttribute('aria-label', `Peel ${note.querySelector('strong')?.textContent || `field note ${index + 1}`}`);
    const finishHobbyPeel = event => {
      if (hobbyPointer === null || (event.pointerId !== undefined && event.pointerId !== hobbyPointer)) return;
      const activePointer = hobbyPointer;
      hobbyPointer = null;
      try { note.releasePointerCapture(activePointer); } catch {}
      stage.classList.remove('is-hobby-note-dragging');
      if (hobbyDistance > 72) peelHobbyNote(index);
      else renderHobbyStack();
    };
    note.addEventListener('pointerdown', event => {
      if (event.button !== 0 || pullPhase !== 1 || index !== hobbyPeelIndex) return;
      hobbyPointer = event.pointerId;
      hobbyStartX = event.clientX;
      hobbyStartY = event.clientY;
      hobbyDistance = 0;
      stage.classList.add('is-hobby-note-dragging');
      note.setPointerCapture(event.pointerId);
    });
    note.addEventListener('pointermove', event => {
      if (event.pointerId !== hobbyPointer) return;
      const dx = event.clientX - hobbyStartX;
      const dy = event.clientY - hobbyStartY;
      hobbyDistance = Math.hypot(dx, dy);
      note.style.transform = `translate3d(${clamp(dx * .82, -90, 240)}px, ${clamp(dy * .82, -145, 150)}px, 0) rotate(${clamp(dx * .06 - dy * .025 - 2, -15, 20)}deg)`;
      if (hobbyDistance > 4) event.preventDefault();
    });
    note.addEventListener('pointerup', finishHobbyPeel);
    note.addEventListener('pointercancel', finishHobbyPeel);
    note.addEventListener('lostpointercapture', finishHobbyPeel);
    note.addEventListener('click', () => {
      if (pullPhase !== 1 || index !== hobbyPeelIndex) return;
      peelHobbyNote(index);
    });
    note.addEventListener('keydown', event => {
      if (!['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      peelHobbyNote(index);
    });
  });

  const renderPeelSequence = progress => {
    const p = clamp(progress, 0, 1);
    peelCards.forEach((card, index) => {
      const local = clamp((p - peelStarts[index]) / (peelEnds[index] - peelStarts[index]), 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);
      const baseRotation = index === 0 ? -2 : (index - 3) * .65;
      const x = (54 * eased + 176 * local) * (1 + index * .025);
      const y = (-30 * eased - 142 * local) * (1 + index * .018);
      const rotation = baseRotation + (15 + index * 2.1) * eased;
      const opacity = local < .7 ? 1 : 1 - (local - .7) / .3;
      card.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${(local * 34).toFixed(1)}px) rotateY(${(local * 38).toFixed(1)}deg) rotateZ(${rotation.toFixed(1)}deg) scale(${(1 - local * .07).toFixed(3)})`;
      card.style.opacity = String(clamp(opacity, 0, 1));
      card.style.filter = 'none';
      card.style.pointerEvents = local > .02 ? 'none' : '';
      if (index > 0) card.style.zIndex = String(hobbyNotes.length - index + 1);
    });
    const peeled = peelEnds.filter(end => p >= end).length;
    if (pullPhase === 0 && p > .015) pullLabel.textContent = `Peeling ${String(Math.min(7, peeled + 1)).padStart(2, '0')} / 07`;
    hobbyNotesGroup.setAttribute('aria-hidden', String(p <= .01));
  };

  const completeFirstPull = () => {
    beginHobbyPeeling();
  };

  const resetExperience = () => {
    pullPhase = 0;
    sticker.hidden = false;
    hobbyPeelIndex = 0;
    hobbyPullOrigin = 0;
    stage.classList.remove('is-hobbies-open', 'is-auto-peeling');
    pull.setAttribute('aria-expanded', 'false');
    pullLabel.textContent = 'Drag the first note';
    setFieldProgress(0, hobbyNotes.length);
    setPullProgress(0);
    setNoteOpen(false);
    renderPeelSequence(0);
    hobbyNotes.forEach((note, index) => {
      note.tabIndex = -1;
      note.setAttribute('aria-hidden', 'true');
      note.style.visibility = index < 6 ? 'visible' : 'hidden';
    });
    sticker.style.removeProperty('transform');
    sticker.style.removeProperty('opacity');
    sticker.style.removeProperty('filter');
    sticker.style.removeProperty('pointer-events');
  };

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
    galleryTileWidth = Math.max(innerWidth * 1.35, columns * (compact ? 230 : 300));
    galleryTileHeight = Math.max(innerHeight * 1.4, rows * (compact ? 285 : 330));
    galleryPlane.replaceChildren();
    const fragment = document.createDocumentFragment();
    galleryItems = galleryTemplates.map((template, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const jitterX = (((index * 37) % 13) - 6) * (compact ? 2.4 : 3.4);
      const jitterY = (((index * 23) % 11) - 5) * (compact ? 2.1 : 3.1);
      const baseX = (column + .5) / columns * galleryTileWidth - galleryTileWidth / 2 + jitterX;
      const baseY = (row + .5) / rows * galleryTileHeight - galleryTileHeight / 2 + jitterY;
      const item = document.createElement('div');
      item.className = 'note-gallery-item is-primary';
      item.style.setProperty('--photo-ratio', template.style.getPropertyValue('--photo-ratio'));
      const card = template.cloneNode(true);
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
    pullPhase = 2;
    galleryReturnFocus = document.activeElement;
    galleryClosing = false;
    clearTimeout(galleryTransitionTimer);
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
      }, 1320);
    });
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
      (galleryReturnFocus instanceof HTMLElement ? galleryReturnFocus : pull).focus();
    }, 980);
  };

  const animatePull = () => {
    if (pullResetting || pullPhase > 1) return;
    const startingPhase = pullPhase;
    if (startingPhase === 1 && hobbyPeelIndex >= hobbyNotes.length) {
      openGallery();
      return;
    }
    const startingProgress = pullProgress;
    const duration = startingPhase === 0 ? 1050 : 1750;
    const startedAt = performance.now();
    pullResetting = true;
    stage.classList.add('is-pull-dragging');
    if (startingPhase === 0) {
      setNoteOpen(false);
      stage.classList.add('is-auto-peeling');
    }
    const tick = now => {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      setPullProgress(startingPhase === 0 ? progress : startingProgress + (1 - startingProgress) * progress);
      if (startingPhase === 0) renderPeelSequence(progress);
      else renderPulleyHobbyPeel(pullProgress);
      if (progress < 1) { requestAnimationFrame(tick); return; }
      pullResetting = false;
      stage.classList.remove('is-pull-dragging');
      if (startingPhase === 0) completeFirstPull();
      else {
        hobbyPeelIndex = hobbyNotes.length;
        setPullProgress(1);
        renderHobbyStack();
        setFieldProgress(1, 0);
        pullLabel.textContent = 'All notes revealed';
        window.setTimeout(openGallery, 260);
      }
    };
    requestAnimationFrame(tick);
  };

  const finishPull = event => {
    if (pullPointer === null || (event.pointerId !== undefined && event.pointerId !== pullPointer)) return;
    const activePointer = pullPointer;
    pullPointer = null;
    try { pull.releasePointerCapture(activePointer); } catch {}
    stage.classList.remove('is-pull-dragging');
    if (pullPhase === 1) {
      const complete = hobbyPeelIndex >= hobbyNotes.length;
      renderPulleyHobbyPeel(pullProgress);
      setFieldProgress(hobbyPeelIndex / hobbyNotes.length, hobbyNotes.length - hobbyPeelIndex);
      pullLabel.textContent = complete
        ? 'All notes revealed'
        : `Continue ${String(hobbyPeelIndex + 1).padStart(2, '0')} / ${String(hobbyNotes.length).padStart(2, '0')}`;
      if (complete) window.setTimeout(openGallery, 260);
      return;
    }
    if (pullRewinding) {
      pullRewinding = false;
      if (pullProgress <= .32) {
        resetExperience();
      } else {
        pullProgress = 1;
        stage.classList.add('is-hobbies-open');
        stage.style.setProperty('--pull-progress', '0');
        renderPeelSequence(1);
      }
      return;
    }
    if (pullProgress >= .68) {
      if (pullPhase === 0) completeFirstPull();
      else if (hobbyPeelIndex < hobbyNotes.length) peelHobbyNote(hobbyPeelIndex);
      else openGallery();
    } else {
      if (pullPhase === 0) {
        stage.classList.remove('is-auto-peeling');
        renderPeelSequence(pullProgress);
        pullLabel.textContent = 'Continue pulling';
      } else renderHobbyStack();
    }
  };

  pull.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pullResetting || pullPhase > 1) return;
    pullPointer = event.pointerId;
    pullStartY = event.clientY;
    pullStartProgress = pullProgress;
    pullMoved = false;
    pullRewinding = false;
    stage.classList.add('is-pull-dragging');
    if (pullPhase === 0) {
      setNoteOpen(false);
      stage.classList.add('is-auto-peeling');
    }
    pull.setPointerCapture(event.pointerId);
  });
  pull.addEventListener('pointermove', event => {
    if (event.pointerId !== pullPointer) return;
    const delta = event.clientY - pullStartY;
    if (Math.abs(delta) > 4) pullMoved = true;
    const pullStep = parseFloat(getComputedStyle(stage).getPropertyValue('--pull-step')) || 145;
    const activePullRange = pullPhase === 1 ? pullStep * 2 : pullStep;
    if (pullRewinding) {
      pullProgress = clamp(1 + delta / pullStep, 0, 1);
      stage.style.setProperty('--pull-progress', (pullProgress - 1).toFixed(3));
      stage.classList.remove('is-hobbies-open');
      renderPeelSequence(pullProgress);
    } else {
      const minimumProgress = pullPhase === 1 ? pullStartProgress : 0;
      pullProgress = clamp(pullStartProgress + delta / activePullRange, minimumProgress, 1);
      stage.style.setProperty('--pull-progress', pullProgress.toFixed(3));
      if (pullPhase === 0) renderPeelSequence(pullProgress);
      else renderPulleyHobbyPeel(pullProgress);
    }
    if (pullMoved) event.preventDefault();
  });
  pull.addEventListener('pointerup', finishPull);
  pull.addEventListener('pointercancel', finishPull);
  pull.addEventListener('lostpointercapture', event => { if (pullPointer !== null) finishPull(event); });
  pull.addEventListener('click', () => {
    if (pullMoved) { pullMoved = false; return; }
    if (pullResetting || pullPhase > 1) return;
    animatePull();
  });

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
    if (pullPhase === 0) renderPeelSequence(pullProgress);
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
    [[sticker, 'PEEL'], [pull, 'PULL'], [galleryField, 'DRAG'], ...magnets.map(magnet => [magnet, 'DRAG'])].forEach(([element, label]) => {
      if (!element) return;
      element.addEventListener('pointerenter', () => { cursor.textContent = label; });
    });
  }));

  setNoteOpen(false);
  resetExperience();
})();
