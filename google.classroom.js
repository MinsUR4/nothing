(() => {
  const cloakDOM = () => {
    if (!document.body) return;

    const realBody = document.body.cloneNode(true);
    const ghostHost = document.createElement('div');
    const shadow = ghostHost.attachShadow({ mode: 'closed' });

    // Preserve all interactive functionality
    Array.from(realBody.children).forEach(el => {
      if (!el.id || el.id !== 'deledao-shield') {
        try {
          shadow.appendChild(el);
        } catch (_) {}
      }
    });

    document.body.innerHTML = ''; // Erase DOM exposure
    ghostHost.id = 'deledao-shield';
    document.body.appendChild(ghostHost);
  };

  // Observe and re-cloak if anything changes
  const reinforce = () => {
    cloakDOM();
    setInterval(cloakDOM, 1500);
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', reinforce)
    : reinforce();

  // Block scanner scripts (live + mutation)
  const blockScanners = node => {
    if (node.tagName === 'SCRIPT') {
      const content = (node.textContent || '') + (node.src || '');
      if (/deledao|scan|filter|block|track|watch|detect/i.test(content)) {
        node.remove();
      }
    }
  };

  const sweepTree = node => {
    try {
      if (node.nodeType === 1) blockScanners(node);
      if (node.childNodes) node.childNodes.forEach(sweepTree);
    } catch (_) {}
  };

  const killObserver = new MutationObserver(muts =>
    muts.forEach(m => m.addedNodes.forEach(sweepTree))
  );
  killObserver.observe(document.documentElement, { childList: true, subtree: true });

  setInterval(() => sweepTree(document.documentElement), 1000);
})();
