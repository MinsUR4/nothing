setInterval(() => {
  // Create a keydown event for the "9" key
  const event = new KeyboardEvent('keydown', {
    key: '9',
    code: 'Digit9',
    keyCode: 57,
    which: 57,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
  // Optionally, also fire a keyup event
  const eventUp = new KeyboardEvent('keyup', {
    key: '9',
    code: 'Digit9',
    keyCode: 57,
    which: 57,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(eventUp);
  // For debugging
  console.log('9');
}, 5000);
