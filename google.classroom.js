(() => {
  const shadowHost = document.createElement('div');
  const root = shadowHost.attachShadow({ mode: 'closed' });

  const moveToShadowDOM = () => {
    while (document.body.firstChild) {
      root.appendChild(document.body.firstChild);
    }
    document.body.appendChild(shadowHost);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveToShadowDOM);
  } else {
    moveToShadowDOM();
  }
  const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
  const neutralKey = 'KeyN';

  document.addEventListener('keydown', e => {
    if (gameKeys.includes(e.code)) {
      e.stopImmediatePropagation();
      e.preventDefault();

      const fakeEvent = new KeyboardEvent('keydown', {
        key: 'n',
        code: neutralKey,
        bubbles: true,
        cancelable: true
      });

      document.dispatchEvent(fakeEvent);
    }
  }, true);

  const blockDeledaoScript = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.tagName === 'SCRIPT') {
          const text = node.textContent || '';
          const src = node.src || '';
          if (/deledao|filter|block|gametracker|activescan/i.test(text + src)) {
            node.remove();
          }
        }
      }
    }
  });

  blockDeledaoScript.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

})();
