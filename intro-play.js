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
  const gallery = document.querySelector('.note-gallery');
  const galleryClose = gallery?.querySelector('.note-gallery-close');
  const galleryField = gallery?.querySelector('.note-gallery-field');
  const galleryPlane = gallery?.querySelector('.note-gallery-plane');
  const galleryTemplates = gallery ? [...gallery.querySelectorAll('.note-gallery-templates .note-gallery-card')] : [];
  let galleryCards = [];
  const galleryBurst = gallery?.querySelector('.note-gallery-burst');
  const magnets = [...stage.querySelectorAll('[data-intro-magnet]')];

  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect();
    stage.style.setProperty('--play-x', `${((event.clientX - bounds.left) / bounds.width * 100).toFixed(1)}%`);
    stage.style.setProperty('--play-y', `${((event.clientY - bounds.top) / bounds.height * 100).toFixed(1)}%`);
  }, { passive: true });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--play-x', '50%');
    stage.style.setProperty('--play-y', '50%');
  });

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

  const setPullProgress = progress => {
    pullProgress = clamp(progress, 0, 1);
    stage.style.setProperty('--pull-progress', String(pullProgress));
  };

  const peelCards = [sticker, ...hobbyNotes];
  const peelStarts = [0, .26, .45, .59, .70, .79, .86];
  const peelEnds = [.26, .45, .59, .70, .79, .86, 1];
  let hobbyPeelIndex = 0;
  let hobbyPointer = null;
  let hobbyStartX = 0;
  let hobbyStartY = 0;
  let hobbyDistance = 0;

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
      note.style.filter = isPeeled ? 'blur(5px)' : 'none';
      note.style.zIndex = String(hobbyNotes.length - index + 8);
      note.style.pointerEvents = isTop ? 'auto' : 'none';
      note.tabIndex = isTop ? 0 : -1;
      note.setAttribute('aria-hidden', String(!isTop));
    });
  };

  const beginHobbyPeeling = () => {
    if (pullPhase === 1) return;
    pullPhase = 1;
    hobbyPeelIndex = 0;
    setNoteOpen(true);
    stage.classList.add('is-hobbies-open');
    stage.classList.remove('is-auto-peeling');
    setPullProgress(0);
    renderHobbyStack();
    pull.setAttribute('aria-expanded', 'true');
    pullLabel.textContent = `Peel 01 / ${String(hobbyNotes.length).padStart(2, '0')}`;
    pullResetting = false;
  };

  const peelHobbyNote = index => {
    if (pullPhase !== 1 || index !== hobbyPeelIndex) return;
    hobbyPeelIndex += 1;
    renderHobbyStack();
    if (hobbyPeelIndex === hobbyNotes.length) {
      pullLabel.textContent = 'Open all notes';
    } else {
      pullLabel.textContent = `Peel ${String(hobbyPeelIndex + 1).padStart(2, '0')} / ${String(hobbyNotes.length).padStart(2, '0')}`;
      hobbyNotes[hobbyPeelIndex].focus({ preventScroll: true });
    }
  };

  hobbyNotes.forEach((note, index) => {
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
      card.style.filter = `blur(${(Math.max(0, local - .72) * 8).toFixed(1)}px)`;
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
    hobbyPeelIndex = 0;
    stage.classList.remove('is-hobbies-open', 'is-auto-peeling');
    pull.setAttribute('aria-expanded', 'false');
    pullLabel.textContent = 'Drag the first note';
    setPullProgress(0);
    setNoteOpen(false);
    renderPeelSequence(0);
    hobbyNotes.forEach(note => {
      note.tabIndex = -1;
      note.setAttribute('aria-hidden', 'true');
    });
    sticker.style.removeProperty('transform');
    sticker.style.removeProperty('opacity');
    sticker.style.removeProperty('filter');
    sticker.style.removeProperty('pointer-events');
  };

  const createBurstDebris = () => {
    if (!galleryBurst) return;
    galleryBurst.replaceChildren();
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

  const wrapGalleryAxis = (value, size) => {
    if (!size) return value;
    return ((value + size / 2) % size + size) % size - size / 2;
  };

  const renderGalleryPosition = () => {
    galleryOffsetX = wrapGalleryAxis(galleryOffsetX, galleryTileWidth);
    galleryOffsetY = wrapGalleryAxis(galleryOffsetY, galleryTileHeight);
    galleryPlane?.style.setProperty('--gallery-x', `${galleryOffsetX.toFixed(2)}px`);
    galleryPlane?.style.setProperty('--gallery-y', `${galleryOffsetY.toFixed(2)}px`);
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
    galleryTileWidth = Math.max(innerWidth * 1.12, innerWidth < 760 ? 920 : 1280);
    galleryTileHeight = Math.max(innerHeight * 1.15, innerWidth < 760 ? 760 : 880);
    galleryPlane.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (let row = -1; row <= 1; row += 1) {
      for (let column = -1; column <= 1; column += 1) {
        galleryTemplates.forEach((template, index) => {
          const item = document.createElement('div');
          item.className = 'note-gallery-item';
          item.style.left = `${column * galleryTileWidth + Number(template.dataset.x) * galleryTileWidth}px`;
          item.style.top = `${row * galleryTileHeight + Number(template.dataset.y) * galleryTileHeight}px`;
          const card = template.cloneNode(true);
          card.removeAttribute('data-x');
          card.removeAttribute('data-y');
          card.dataset.noteIndex = String(index);
          card.style.setProperty('--delay', `${((index + (row + 1) * 3 + column + 1) % 8) * .055}s`);
          card.setAttribute('aria-pressed', 'false');
          if (row !== 0 || column !== 0) {
            card.tabIndex = -1;
            card.setAttribute('aria-hidden', 'true');
          }
          item.append(card);
          fragment.append(item);
        });
      }
    }
    galleryPlane.append(fragment);
    galleryCards = [...galleryPlane.querySelectorAll('.note-gallery-card')];
    queueGalleryRender();
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
    if (!gallery) return;
    pullPhase = 2;
    galleryReturnFocus = document.activeElement;
    stopGalleryMomentum();
    galleryOffsetX = 0;
    galleryOffsetY = 0;
    buildInfiniteGallery();
    createBurstDebris();
    document.body.classList.add('note-gallery-open');
    document.querySelector('main')?.setAttribute('inert', '');
    gallery.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => gallery.classList.add('is-open'));
    window.setTimeout(() => galleryClose?.focus(), 420);
  };

  const closeGallery = () => {
    if (!gallery) return;
    gallery.classList.remove('is-open');
    gallery.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('note-gallery-open');
    document.querySelector('main')?.removeAttribute('inert');
    stopGalleryMomentum();
    galleryOffsetX = 0;
    galleryOffsetY = 0;
    galleryCards.forEach(card => { card.classList.remove('is-focused'); card.setAttribute('aria-pressed', 'false'); });
    resetExperience();
    (galleryReturnFocus instanceof HTMLElement ? galleryReturnFocus : pull).focus();
  };

  const animatePull = () => {
    if (pullResetting || pullPhase > 1) return;
    const startingPhase = pullPhase;
    const duration = startingPhase === 0 ? 1050 : 620;
    const startedAt = performance.now();
    pullResetting = true;
    stage.classList.add('is-pull-dragging');
    if (startingPhase === 0) {
      setNoteOpen(false);
      stage.classList.add('is-auto-peeling');
    }
    const tick = now => {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      setPullProgress(progress);
      if (startingPhase === 0) renderPeelSequence(progress);
      if (progress < 1) { requestAnimationFrame(tick); return; }
      pullResetting = false;
      stage.classList.remove('is-pull-dragging');
      if (startingPhase === 0) completeFirstPull();
      else openGallery();
    };
    requestAnimationFrame(tick);
  };

  const finishPull = event => {
    if (pullPointer === null || (event.pointerId !== undefined && event.pointerId !== pullPointer)) return;
    const activePointer = pullPointer;
    pullPointer = null;
    try { pull.releasePointerCapture(activePointer); } catch {}
    stage.classList.remove('is-pull-dragging');
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
      else openGallery();
    } else {
      setPullProgress(0);
      if (pullPhase === 0) {
        stage.classList.remove('is-auto-peeling');
        renderPeelSequence(0);
        window.setTimeout(() => sticker.style.removeProperty('transform'), 680);
        pullLabel.textContent = 'Pull the notes';
      }
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
    if (pullPhase === 1 && delta < -4) pullRewinding = true;
    if (pullRewinding) {
      pullProgress = clamp(1 + delta / pullStep, 0, 1);
      stage.style.setProperty('--pull-progress', (pullProgress - 1).toFixed(3));
      stage.classList.remove('is-hobbies-open');
      renderPeelSequence(pullProgress);
    } else {
      pullProgress = clamp(pullStartProgress + delta / pullStep, 0, 1);
      stage.style.setProperty('--pull-progress', pullProgress.toFixed(3));
      if (pullPhase === 0) renderPeelSequence(pullProgress);
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
