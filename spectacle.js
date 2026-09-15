(() => {
  const ready = callback => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', callback, { once: true }) : callback();
  ready(() => requestAnimationFrame(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(pointer:fine)').matches;
    const root = document.documentElement;
    const body = document.body;
    if (!document.querySelector('.loader')) body.classList.add('fx-no-loader');

    const aura = document.createElement('div');
    aura.className = 'fx-aura';
    const grid = document.createElement('div');
    grid.className = 'fx-grid';
    body.append(aura, grid);

    const sections = [...document.querySelectorAll('main > section')];
    const counter = document.createElement('div');
    counter.className = 'fx-counter';
    counter.innerHTML = `<strong>01</strong><i></i><span>${String(Math.max(sections.length, 1)).padStart(2, '0')}</span>`;
    body.append(counter);
    const homeHero = document.querySelector('.hero');

    sections.forEach((section, index) => {
      if (!section.id) section.id = `chapter-${index + 1}`;
    });

    let currentSection = 0;
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      currentSection = Math.max(0, sections.indexOf(entry.target));
      counter.querySelector('strong').textContent = String(currentSection + 1).padStart(2, '0');
    }), { rootMargin: '-42% 0px -42%', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fx-seen');
        revealObserver.unobserve(entry.target);
      }
    }), { rootMargin: '0px 0px -8%', threshold: .02 });
    sections.slice(1).forEach(section => {
      section.classList.add('fx-section');
      const dark = getComputedStyle(section).backgroundColor.match(/rgb\((\d+)/)?.[1] < 60;
      section.style.setProperty('--fx-section-cover', dark ? '#000' : '#f5f5f7');
      revealObserver.observe(section);
    });

    // Let key statements settle word by word as their chapter is uncovered.
    // Text nodes are wrapped in place so the wording and inline emphasis stay intact.
    const kineticCopy = document.querySelectorAll('.manifesto > p,.intro-voice h2,.lens-gateway-title h2');
    kineticCopy.forEach(copy => {
      const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      let wordIndex = 0;
      textNodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(part);
            return;
          }
          const word = document.createElement('span');
          word.className = 'fx-word';
          word.style.setProperty('--fx-word-delay', `${Math.min(wordIndex++, 24) * 22}ms`);
          word.textContent = part;
          fragment.append(word);
        });
        node.replaceWith(fragment);
      });
      copy.classList.add('fx-kinetic-copy');
    });

    let mouseX = innerWidth / 2, mouseY = innerHeight / 2, targetX = mouseX, targetY = mouseY;
    let previousX = mouseX, previousY = mouseY;
    let pointerFrame = 0;
    const updatePointer = () => {
      mouseX = targetX;
      mouseY = targetY;
      const velocity = Math.min(1, Math.hypot(mouseX - previousX, mouseY - previousY) / 30);
      root.style.setProperty('--fx-x', `${mouseX}px`);
      root.style.setProperty('--fx-y', `${mouseY}px`);
      root.style.setProperty('--fx-velocity', velocity.toFixed(3));
      if (cursor) {
        cursor.style.setProperty('--cursor-x', `${mouseX}px`);
        cursor.style.setProperty('--cursor-y', `${mouseY}px`);
      }
      previousX = mouseX; previousY = mouseY;
      pointerFrame = 0;
    };
    window.addEventListener('pointermove', event => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
    }, { passive: true });

    let cursor = null;
    if (finePointer && !reduced) {
      cursor = document.createElement('div');
      cursor.className = 'fx-cursor';
      cursor.innerHTML = '<span>VIEW</span>';
      body.append(cursor);
      body.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
      body.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
      document.querySelectorAll('a,button,.gallery-item,.portfolio-showcase figure').forEach(element => {
        element.addEventListener('pointerenter', () => {
          cursor.querySelector('span').textContent = element.matches('a,button') ? 'OPEN' : 'VIEW';
          cursor.classList.add('is-action');
        });
        element.addEventListener('pointerleave', () => cursor.classList.remove('is-action'));
      });
      updatePointer();
    }

    const contentsPanel = document.querySelector('.index-panel');
    if (contentsPanel) {
      const contentsPreview = document.createElement('div');
      contentsPreview.className = 'fx-index-preview';
      contentsPreview.setAttribute('aria-hidden', 'true');
      contentsPreview.innerHTML = '<span class="fx-index-orbit"></span><small>SELECT / EXPLORE</small><strong></strong><i></i>';
      contentsPanel.append(contentsPreview);

      const previewTitle = contentsPreview.querySelector('strong');
      const previewNumber = contentsPreview.querySelector('i');
      const contentsLinks = [...contentsPanel.querySelectorAll('[data-nav-key]')];
      const showContentsPreview = item => {
        if (!item) return;
        contentsPanel.dataset.fxPreview = item.dataset.navKey;
        previewTitle.textContent = item.querySelector('b')?.textContent || '';
        previewNumber.textContent = item.querySelector('span')?.textContent || '';
        contentsPreview.classList.remove('is-changing');
        void contentsPreview.offsetWidth;
        contentsPreview.classList.add('is-changing');
      };
      const restoreContentsPreview = () => showContentsPreview(contentsPanel.querySelector('[aria-current="page"]') || contentsLinks[0]);

      contentsLinks.forEach(item => {
        item.addEventListener('pointerenter', () => showContentsPreview(item));
        item.addEventListener('focus', () => showContentsPreview(item));
      });
      contentsPanel.addEventListener('pointermove', event => {
        const bounds = contentsPreview.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        contentsPanel.style.setProperty('--menu-x', `${Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))}%`);
        contentsPanel.style.setProperty('--menu-y', `${Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100))}%`);
      }, { passive: true });
      contentsPanel.addEventListener('pointerleave', restoreContentsPreview);
      restoreContentsPreview();
    }

    let scrollFrame = 0;
    const updateScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const value = Math.max(0, Math.min(1, scrollY / max));
      root.style.setProperty('--fx-scroll', value.toFixed(4));
      counter.classList.toggle('is-visible', !homeHero || scrollY > 24);
      document.querySelectorAll('.fx-image').forEach(frame => {
        const bounds = frame.getBoundingClientRect();
        const shift = Math.max(-34, Math.min(34, (innerHeight * .5 - (bounds.top + bounds.height * .5)) * .055));
        frame.style.setProperty('--image-shift', `${shift}px`);
      });
      scrollFrame = 0;
    };
    addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
    addEventListener('resize', updateScroll);

    const headings = document.querySelectorAll('.hero h1,.category-hero h1:not(.selected-works-title),.about-hero h1,.project-gateway h1,.lens-gateway-title h2,.record-question');
    headings.forEach(heading => {
      heading.classList.add('fx-heading');
      heading.closest('section')?.addEventListener('pointermove', event => {
        const bounds = heading.getBoundingClientRect();
        heading.style.setProperty('--fx-heading-x', (((event.clientX / innerWidth) - .5) * 12).toFixed(2));
        heading.style.setProperty('--fx-heading-y', (((event.clientY - bounds.top) / Math.max(bounds.height, 1) - .5) * 7).toFixed(2));
      });
    });

    document.querySelectorAll('.lens-choice,.about-portal,.arch-work-card,.method-card,.qr-card,.project-sequence a').forEach(card => {
      card.classList.add('fx-tilt');
      card.addEventListener('pointermove', event => {
        if (!finePointer || reduced) return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty('--tilt-x', `${(y - .5) * -5}deg`);
        card.style.setProperty('--tilt-y', `${(x - .5) * 5}deg`);
        card.style.setProperty('--glare-x', `${x * 100}%`);
        card.style.setProperty('--glare-y', `${y * 100}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
      });
    });

    document.querySelectorAll('.header-contact,.menu-button,.scroll-cue,.category-scroll,.about-enter,.project-enter,.contact-compose button').forEach(item => {
      item.classList.add('fx-magnetic');
      item.addEventListener('pointermove', event => {
        if (!finePointer || reduced) return;
        const bounds = item.getBoundingClientRect();
        item.style.setProperty('--mag-x', `${(event.clientX - bounds.left - bounds.width / 2) * .24}px`);
        item.style.setProperty('--mag-y', `${(event.clientY - bounds.top - bounds.height / 2) * .24}px`);
      });
      item.addEventListener('pointerleave', () => { item.style.setProperty('--mag-x', '0px'); item.style.setProperty('--mag-y', '0px'); });
    });

    document.querySelectorAll('.portfolio-showcase figure,.arch-work-image,.project-hero-media,.gallery-item,.intro-portrait,.about-portrait').forEach((frame, index) => {
      frame.classList.add('fx-image');
      frame.style.setProperty('--fx-image-index', index % 4);
    });

    const photoWall = document.querySelector('.photo-wall-viewport');
    if (photoWall) {
      const photoSection = photoWall.closest('.portfolio-showcase');
      const wallCount = photoSection.querySelector('.photo-wall-status b');
      const wallPrevious = photoSection.querySelector('[data-wall-previous]');
      const wallNext = photoSection.querySelector('[data-wall-next]');
      let dragging = false;
      let moved = false;
      let suppressClick = false;
      let startX = 0;
      let startScroll = 0;
      let lastX = 0;
      let lastTime = 0;
      let velocity = 0;
      let momentumFrame = 0;
      let archivePull = 0;
      let archiveLaunching = false;

      const setArchivePull = distance => {
        const threshold = Math.max(220, photoWall.clientWidth * .55);
        archivePull = Math.max(0, Math.min(threshold + 72, distance));
        const pullProgress = archivePull / threshold;
        const revealProgress = Math.min(1, pullProgress);
        photoSection.style.setProperty('--arch-pull', pullProgress.toFixed(3));
        photoSection.style.setProperty('--more-work-opacity', Math.min(1, pullProgress * 1.15).toFixed(3));
        photoSection.style.setProperty('--more-work-scale', (.38 + revealProgress * .72).toFixed(3));
        photoSection.style.setProperty('--more-work-blur', `${((1 - revealProgress) * 4).toFixed(2)}px`);
        photoSection.classList.toggle('is-arch-pulling', archivePull > 0);
        photoSection.classList.toggle('is-arch-armed', archivePull >= threshold);
      };

      const updatePhotoWall = () => {
        const max = Math.max(1, photoWall.scrollWidth - photoWall.clientWidth);
        const progress = Math.max(0, Math.min(1, photoWall.scrollLeft / max));
        photoSection.style.setProperty('--wall-progress', progress.toFixed(4));
        if (wallCount) wallCount.textContent = `${String(Math.round(progress * 100)).padStart(2, '0')}%`;
      };

      const coast = () => {
        velocity *= .94;
        if (Math.abs(velocity) < .08) { momentumFrame = 0; return; }
        photoWall.scrollLeft += velocity * 16;
        momentumFrame = requestAnimationFrame(coast);
      };
      const finishDrag = event => {
        if (!dragging) return;
        dragging = false;
        photoWall.classList.remove('is-dragging');
        try { photoWall.releasePointerCapture(event.pointerId); } catch {}
        suppressClick = moved;
        if (archivePull >= Math.max(220, photoWall.clientWidth * .55) && !archiveLaunching) {
          archiveLaunching = true;
          photoSection.classList.add('is-arch-launching');
          if (cursor) cursor.querySelector('span').textContent = 'ARCH';
          window.setTimeout(() => {
            const architectureControl = document.querySelector('.scale[data-discipline="architecture"]');
            if (!reduced && window.alobiNavigateToArchitectureSlide) window.alobiNavigateToArchitectureSlide();
            else if (!reduced && architectureControl) architectureControl.click();
            else window.location.assign('architecture/');
          }, reduced ? 0 : 520);
          return;
        }
        const shouldRecoil = archivePull > 0;
        setArchivePull(0);
        if (shouldRecoil && !reduced) {
          photoSection.classList.add('is-arch-recoiling');
          window.setTimeout(() => photoSection.classList.remove('is-arch-recoiling'), 560);
        }
        if (cursor) cursor.querySelector('span').textContent = 'DRAG';
        if (!reduced && Math.abs(velocity) > .08) momentumFrame = requestAnimationFrame(coast);
      };

      photoWall.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        cancelAnimationFrame(momentumFrame);
        dragging = true;
        moved = false;
        startX = lastX = event.clientX;
        startScroll = photoWall.scrollLeft;
        lastTime = performance.now();
        velocity = 0;
        if (cursor) cursor.querySelector('span').textContent = 'HOLD';
      });
      photoWall.addEventListener('pointermove', event => {
        if (!dragging) return;
        const now = performance.now();
        const delta = event.clientX - startX;
        if (!moved && Math.abs(delta) > 5) {
          moved = true;
          photoWall.classList.add('is-dragging');
          photoWall.setPointerCapture(event.pointerId);
        }
        if (!moved) return;
        const max = Math.max(0, photoWall.scrollWidth - photoWall.clientWidth);
        const dragMultiplier = innerWidth <= 900 ? 2.35 : 1.18;
        const desiredScroll = startScroll - delta * dragMultiplier;
        photoWall.scrollLeft = desiredScroll;
        setArchivePull(desiredScroll > max ? desiredScroll - max : 0);
        velocity = Math.max(-2.6, Math.min(2.6, (lastX - event.clientX) / Math.max(8, now - lastTime)));
        lastX = event.clientX;
        lastTime = now;
        if (moved) event.preventDefault();
      });
      photoWall.addEventListener('pointerup', finishDrag);
      photoWall.addEventListener('pointercancel', finishDrag);
      photoWall.addEventListener('lostpointercapture', event => { if (dragging) finishDrag(event); });
      photoWall.addEventListener('click', event => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClick = false;
      }, true);
      photoWall.addEventListener('dragstart', event => event.preventDefault());
      photoWall.addEventListener('scroll', updatePhotoWall, { passive: true });
      photoWall.addEventListener('wheel', event => {
        if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        photoWall.scrollLeft += event.deltaX || event.deltaY;
      }, { passive: false });
      photoWall.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        const left = event.key === 'Home' ? 0 : event.key === 'End' ? photoWall.scrollWidth : photoWall.scrollLeft + direction * photoWall.clientWidth * .35;
        photoWall.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
      });
      const moveMobilePreview = direction => {
        const firstCard = photoWall.querySelector('figure');
        const gap = parseFloat(getComputedStyle(photoWall.querySelector('.photo-wall-track')).gap) || 12;
        const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : photoWall.clientWidth * .82;
        photoWall.scrollBy({ left: direction * distance, behavior: reduced ? 'auto' : 'smooth' });
      };
      wallPrevious?.addEventListener('click', () => moveMobilePreview(-1));
      wallNext?.addEventListener('click', () => moveMobilePreview(1));
      photoWall.addEventListener('pointerenter', () => { if (cursor) { cursor.querySelector('span').textContent = 'DRAG'; cursor.classList.add('is-action'); } });
      photoWall.addEventListener('pointerleave', () => { if (cursor && !dragging) cursor.classList.remove('is-action'); });
      photoWall.querySelectorAll('figure').forEach(frame => frame.addEventListener('pointerenter', () => {
        if (cursor) cursor.querySelector('span').textContent = 'VIEW';
      }));

      const cropFrames = [...photoWall.querySelectorAll('.photo-wall-panel figure')];
      const classifyCrop = frame => {
        const image = frame.querySelector('img');
        if (!image?.naturalWidth || !image.naturalHeight || !frame.clientWidth || !frame.clientHeight) return;
        const imageRatio = image.naturalWidth / image.naturalHeight;
        const frameRatio = frame.clientWidth / frame.clientHeight;
        const visibleFraction = Math.min(imageRatio / frameRatio, frameRatio / imageRatio);
        const isCropped = getComputedStyle(image).objectFit === 'cover' && visibleFraction < .82;
        frame.classList.toggle('is-crop-expandable', isCropped);
        if (!isCropped) {
          frame.style.removeProperty('--crop-expand-x');
          frame.style.removeProperty('--crop-expand-y');
          return;
        }
        const expandX = imageRatio > frameRatio ? Math.min(1.9, imageRatio / frameRatio) : 1;
        const expandY = imageRatio < frameRatio ? Math.min(1.65, frameRatio / imageRatio) : 1;
        frame.style.setProperty('--crop-expand-x', expandX.toFixed(3));
        frame.style.setProperty('--crop-expand-y', expandY.toFixed(3));
      };
      const classifyCrops = () => cropFrames.forEach(classifyCrop);
      cropFrames.forEach(frame => {
        const image = frame.querySelector('img');
        if (image?.complete) classifyCrop(frame);
        else image?.addEventListener('load', () => classifyCrop(frame), { once: true });
      });
      new ResizeObserver(classifyCrops).observe(photoWall);

      updatePhotoWall();
    }

    body.addEventListener('click', event => {
      if (reduced) return;
      const ripple = document.createElement('i');
      ripple.className = 'fx-ripple'; ripple.style.left = `${event.clientX}px`; ripple.style.top = `${event.clientY}px`;
      body.append(ripple); setTimeout(() => ripple.remove(), 900);
      for (let i = 0; i < 7; i += 1) {
        const spark = document.createElement('i');
        const angle = (Math.PI * 2 * i) / 7;
        const distance = 26 + Math.random() * 38;
        spark.className = 'fx-spark'; spark.style.left = `${event.clientX}px`; spark.style.top = `${event.clientY}px`;
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`); spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        body.append(spark); setTimeout(() => spark.remove(), 760);
      }
    });

    const galleryImages = [...document.querySelectorAll('.gallery-item img,.portfolio-showcase img')];
    if (galleryImages.length) {
      const lightbox = document.createElement('div');
      lightbox.className = 'fx-lightbox'; lightbox.setAttribute('role', 'dialog'); lightbox.setAttribute('aria-modal', 'true'); lightbox.setAttribute('aria-label', 'Image viewer. Click anywhere to close.'); lightbox.tabIndex = -1;
      lightbox.innerHTML = '<button class="fx-lightbox-prev" aria-label="Previous image">←</button><img alt=""><button class="fx-lightbox-next" aria-label="Next image">→</button><span class="fx-lightbox-meta">ALOBI / VISUAL RECORD</span><span class="fx-lightbox-count"></span>';
      body.append(lightbox);
      const image = lightbox.querySelector('img'); const count = lightbox.querySelector('.fx-lightbox-count');
      let active = 0;
      let transitioning = false;
      const setImage = index => {
        active = (index + galleryImages.length) % galleryImages.length;
        image.src = galleryImages[active].currentSrc || galleryImages[active].src;
        image.alt = galleryImages[active].alt;
        count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
      };
      const preload = src => new Promise(resolve => {
        const nextImage = new Image();
        nextImage.onload = resolve;
        nextImage.onerror = resolve;
        nextImage.src = src;
        if (nextImage.complete) resolve();
      });
      const show = async (index, direction = 1, immediate = false) => {
        const nextIndex = (index + galleryImages.length) % galleryImages.length;
        if (immediate || reduced || typeof image.animate !== 'function') { setImage(nextIndex); return; }
        if (transitioning || nextIndex === active) return;
        transitioning = true;
        lightbox.classList.add('is-switching');
        const source = galleryImages[nextIndex].currentSrc || galleryImages[nextIndex].src;
        const outgoing = image.animate([
          { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0)' },
          { opacity: 0, transform: `translate3d(${-direction * 46}px,0,0) scale(.985)`, filter: 'blur(8px)' }
        ], { duration: 190, easing: 'cubic-bezier(.4,0,1,1)', fill: 'both' });
        try {
          await Promise.all([outgoing.finished.catch(() => {}), preload(source)]);
          outgoing.cancel();
          setImage(nextIndex);
          const incoming = image.animate([
            { opacity: 0, transform: `translate3d(${direction * 72}px,0,0) scale(.975)`, filter: 'blur(10px)' },
            { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0)' }
          ], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
          await incoming.finished.catch(() => {});
          incoming.cancel();
        } finally {
          transitioning = false;
          lightbox.classList.remove('is-switching');
        }
      };
      const open = index => { show(index, 1, true); lightbox.classList.add('is-open'); body.style.overflow = 'hidden'; lightbox.focus({ preventScroll: true }); };
      const close = () => { lightbox.classList.remove('is-open'); body.style.overflow = ''; };
      galleryImages.forEach((item, index) => { item.parentElement.tabIndex = 0; item.parentElement.setAttribute('role', 'button'); item.parentElement.addEventListener('click', () => open(index)); item.parentElement.addEventListener('keydown', event => { if (event.key === 'Enter') open(index); }); });
      lightbox.querySelector('.fx-lightbox-prev').addEventListener('click', event => { event.stopPropagation(); show(active - 1, -1); });
      lightbox.querySelector('.fx-lightbox-next').addEventListener('click', event => { event.stopPropagation(); show(active + 1, 1); });
      lightbox.addEventListener('click', close);
      document.addEventListener('keydown', event => { if (!lightbox.classList.contains('is-open')) return; if (event.key === 'Escape') close(); if (event.key === 'ArrowLeft') show(active - 1, -1); if (event.key === 'ArrowRight') show(active + 1, 1); });
    }

    if (!finePointer) updatePointer();
    updateScroll(); body.classList.add('fx-ready');
  }));
})();
