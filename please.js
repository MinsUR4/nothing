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

  // Recursively encode all text nodes
  function encodeTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      node.nodeValue = encode(node.nodeValue);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(encodeTextNodes);
    }
  }

  // Recursively decode all text nodes
  function decodeTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      node.nodeValue = decode(node.nodeValue);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(decodeTextNodes);
    }
  }

  // Encode on DOMContentLoaded, then decode immediately for the user
  document.addEventListener('DOMContentLoaded', function() {
    encodeTextNodes(document.body);
    setTimeout(function() {
      decodeTextNodes(document.body);
    }, 0); // decode right after encoding for user
  });

  // Optionally, re-decode on user interaction (for dynamic content)
  document.addEventListener('mousemove', function() {
    decodeTextNodes(document.body);
  });
  document.addEventListener('keydown', function() {
    decodeTextNodes(document.body);
  });
})();
