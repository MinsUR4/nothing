(function() {
  // Simple base64 encode/decode for demonstration
  function encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function decode(str) {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      return str;
    }
  }

  // Encode all text nodes in the body
  function encodeTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      node.nodeValue = encode(node.nodeValue);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(encodeTextNodes);
    }
  }

  // Clone and decode all text nodes for display
  function cloneAndDecode(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      return document.createTextNode(decode(node.nodeValue));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      Array.from(node.childNodes).forEach(child => {
        clone.appendChild(cloneAndDecode(child));
      });
      return clone;
    }
    return node.cloneNode(false);
  }

  function obfuscateDOM() {
    encodeTextNodes(document.body);

    // Create a shadow host overlay
    let shadowHost = document.createElement('div');
    shadowHost.style.position = 'fixed';
    shadowHost.style.top = 0;
    shadowHost.style.left = 0;
    shadowHost.style.width = '100vw';
    shadowHost.style.height = '100vh';
    shadowHost.style.zIndex = 2147483647;
    shadowHost.style.pointerEvents = 'auto'; // allow interaction
    shadowHost.style.background = 'white';

    document.body.appendChild(shadowHost);

    // Attach shadow root and render decoded DOM
    let shadow = shadowHost.attachShadow({mode: 'open'});
    let decoded = cloneAndDecode(document.body);
    shadow.appendChild(decoded);

    // Remove everything else from the body except the shadow host
    Array.from(document.body.childNodes).forEach(node => {
      if (node !== shadowHost) document.body.removeChild(node);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', obfuscateDOM);
  } else {
    obfuscateDOM();
  }
})();
