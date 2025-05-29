(() => {
  const iframeID = 'safe-frame';
  const frame = document.getElementById(iframeID);

  const shadowHost = document.createElement('div');
  const root = shadowHost.attachShadow({ mode: 'closed' });

  const isolateAndCloak = () => {
    Array.from(document.body.children).forEach(el => {
      if (el !== frame && el !== shadowHost) root.appendChild(el);
    });
    if (!document.body.contains(shadowHost)) {
      document.body.insertBefore(shadowHost, frame);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', isolateAndCloak);
  } else {
    isolateAndCloak();
  }

  setInterval(isolateAndCloak, 500);

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
      const txt = node.textContent || '';
      const src = node.src || '';
      if (/deledao|filter|scanner|analyze|block/i.test(txt + src)) {
        node.remove();
      }
    }
  };

  const scanTree = node => {
    if (node.nodeType === 1) killScripts(node);
    if (node.childNodes) node.childNodes.forEach(scanTree);
  };

  const guard = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(scanTree));
  });
  guard.observe(document.documentElement, { childList: true, subtree: true });

  setInterval(() => scanTree(document.documentElement), 1000);
})();
