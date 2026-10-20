(() => {
  const links = [...document.querySelectorAll('[data-cm-toc]')];
  links.forEach(link => {
    const match = /^(\d{2})\s+(.+)$/.exec(link.textContent.trim());
    if (match) {
      const number = document.createElement('span');
      number.className = 'km-nav-number';
      number.textContent = match[1] + ' ';
      link.replaceChildren(number, document.createTextNode(match[2]));
    }
  });
  let current = null;
  const update = () => {
    const next = links.find(link => link.classList.contains('is-current'));
    if (next !== current) {
      links.forEach(link => {
        if (link === next) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      current = next;
    }
  };
  addEventListener('scroll', update, { passive: true });
  update();

  document.querySelectorAll('.km-story video').forEach(video => {
    const autoplayOnly = video.hasAttribute('data-autoplay-only');
    // These films illustrate the case study and are not interactive players.
    video.controls = false;
    if (autoplayOnly) {
      video.removeAttribute('controls');
      video.disablePictureInPicture = true;
      video.disableRemotePlayback = true;
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const film = video.closest('details');
    const sync = () => {
      if (reduced.matches || (film && !film.open) || (autoplayOnly && document.hidden)) {
        video.pause();
        video.removeAttribute('autoplay');
      } else {
        video.setAttribute('autoplay', '');
        video.play().catch(() => {});
      }
    };
    reduced.addEventListener('change', sync);
    film?.addEventListener('toggle', sync);
    if (autoplayOnly) {
      document.addEventListener('visibilitychange', sync);
      video.addEventListener('pause', () => {
        if (!reduced.matches && !document.hidden) video.play().catch(() => {});
      });
    }
    sync();
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'km-image-dialog';
  dialog.setAttribute('aria-label', 'Enlarged screenshot');
  dialog.innerHTML = '<button class="km-dialog-close" type="button" aria-label="Close enlarged screenshot">Close ×</button><img alt=""><p></p>';
  document.body.append(dialog);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  document.querySelectorAll('.km-story :is(.km-lead, .km-shot, .km-app-example) > img').forEach(img => {
    const button = document.createElement('button');
    button.className = 'km-image-expand';
    button.type = 'button';
    button.setAttribute('aria-label', 'Enlarge: ' + img.alt);
    img.before(button);
    button.append(img);
    button.addEventListener('click', () => {
      dialog.querySelector('img').src = img.currentSrc || img.src;
      dialog.querySelector('img').alt = img.alt;
      dialog.querySelector('p').textContent = img.alt;
      dialog.showModal();
    });
  });
})();
