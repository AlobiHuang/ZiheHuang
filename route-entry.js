(() => {
  const storageKey = 'alobi-route-reveal';
  try {
    const rawState = sessionStorage.getItem(storageKey);
    if (!rawState) return;
    const state = JSON.parse(rawState);
    if (state?.createdAt && Date.now() - state.createdAt < 10000) {
      document.documentElement.classList.add('route-enter-pending');
      const prepaintStyle = document.createElement('style');
      prepaintStyle.id = 'route-prepaint-style';
      prepaintStyle.textContent = `
        html.route-enter-pending,
        html.route-enter-pending body { background: ${state.effect === 'line' ? '#f5f5f7' : '#171816'} !important; }
        html.route-enter-pending body > *:not(.page-transition) { visibility: hidden !important; }
        html.route-enter-pending .page-transition {
          visibility: visible !important;
          background: ${state.effect === 'line' ? '#f5f5f7' : '#171816'} !important;
        }
      `;
      document.head.append(prepaintStyle);
    } else {
      sessionStorage.removeItem(storageKey);
    }
  } catch {
    sessionStorage.removeItem(storageKey);
  }
})();
