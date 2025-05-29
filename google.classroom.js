(() => {
  const shadowHost = document.createElement('div');
  const root = shadowHost.attachShadow({ mode: 'closed' });
  document.body.appendChild(shadowHost);

  const cloak = () => {
    while (document.body.firstChild && document.body.firstChild !== shadowHost) {
      root.appendChild(document.body.firstChild);
    }
  };
  cloak();
  setInterval(cloak, 500); 

  const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];

  document.addEventListener('keydown', e => {
    if (gameKeys.includes(e.code)) {
      e.stopImmediatePropagation();
      e.preventDefault();

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const fakeEvent = new KeyboardEvent('keydown', {
            key: 'n',
            code: 'KeyN',
            bubbles: true,
            cancelable: true
          });
          document.dispatchEvent(fakeEvent);
        }, i * 50);
      }
    }
  }, true);

  const killScripts = node => {
    if (node.tagName === 'SCRIPT') {
      const text = node.textContent || '';
      const src = node.src || '';
      if (/deledao|filter|activescan|gametracker|analyzer/i.test(text + src)) {
        node.remove();
      }
    }
  };

  const scanTree = node => {
    if (node.nodeType === 1) killScripts(node);
    if (node.childNodes && node.childNodes.length) {
      node.childNodes.forEach(scanTree);
    }
  };

  const guard = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => scanTree(node));
    });
  });

  guard.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setInterval(() => scanTree(document.documentElement), 1000);

})();
