(() => {
  const ORIGINAL = document.body;
  const MIRROR = document.createElement('div');
  const SHADOW = MIRROR.attachShadow({ mode: 'open' });
  MIRROR.id = 'shadow-render-host';

  const INPUT_SELECTOR = 'input, textarea, select';

  const cloneLiveDOM = () => {
    try {
      SHADOW.innerHTML = '';
      const clone = ORIGINAL.cloneNode(true);
      SHADOW.appendChild(clone);

      // Mirror input values
      const realInputs = ORIGINAL.querySelectorAll(INPUT_SELECTOR);
      const cloneInputs = SHADOW.querySelectorAll(INPUT_SELECTOR);
      realInputs.forEach((realInput, i) => {
        if (cloneInputs[i]) cloneInputs[i].value = realInput.value;
      });

      // Mirror iframe display
      const realIframes = ORIGINAL.querySelectorAll('iframe');
      const cloneIframes = SHADOW.querySelectorAll('iframe');
      realIframes.forEach((real, i) => {
        if (cloneIframes[i]) {
          cloneIframes[i].src = real.src;
        }
      });
    } catch (e) {
      console.warn('DOM mirror error:', e);
    }
  };

  const installMirror = () => {
    document.body.innerHTML = '';
    document.body.appendChild(MIRROR);
    cloneLiveDOM();
  };

  // Continuous sync
  const observer = new MutationObserver(cloneLiveDOM);
  observer.observe(ORIGINAL, { childList: true, subtree: true, attributes: true });
  setInterval(cloneLiveDOM, 1000); // Emergency resync

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', installMirror)
    : installMirror();

  // Kill hostile Deledao scripts
  const nuke = node => {
    if (node.tagName === 'SCRIPT') {
      const content = (node.textContent || '') + (node.src || '');
      if (/deledao|filter|scan|block|track|detect|watch/i.test(content)) {
        node.remove();
      }
    }
  };
  const treeSweep = node => {
    if (node.nodeType === 1) nuke(node);
    if (node.childNodes) node.childNodes.forEach(treeSweep);
  };
  const antiDele = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(treeSweep)));
  antiDele.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(() => treeSweep(document.documentElement), 1000);
})();
