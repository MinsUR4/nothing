
const GAME_KEYS = new Set([
  'w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape', 'Shift', 'Control'
]);
let keyHistory = [];
const HISTORY_WINDOW_MS = 5000; 

function recordKey(key) {
  const now = Date.now();
  keyHistory.push({ key, time: now });
  keyHistory = keyHistory.filter(entry => now - entry.time < HISTORY_WINDOW_MS);
}

document.addEventListener('keydown', e => recordKey(e.key));

// Listen for key events from iframes (same-origin only)
window.addEventListener('message', e => {
  if (e.data && e.data.type === 'iframe-keydown' && typeof e.data.key === 'string') {
    recordKey(e.data.key);
  }
});

function calculateGameProbability() {
  if (keyHistory.length === 0) return 0;
  // Heuristic: rapid, repeated, and diverse game keys = higher probability
  const now = Date.now();
  const recent = keyHistory.filter(entry => now - entry.time < HISTORY_WINDOW_MS);
  const gameKeyCount = recent.filter(entry => GAME_KEYS.has(entry.key.toLowerCase())).length;
  const uniqueGameKeys = new Set(recent.filter(entry => GAME_KEYS.has(entry.key.toLowerCase())).map(entry => entry.key.toLowerCase())).size;
  const rate = gameKeyCount / (HISTORY_WINDOW_MS / 1000); // keys per second
  // Weighted formula: rapid + diverse = more likely a game
  let prob = Math.min(1, (gameKeyCount * 0.5 + uniqueGameKeys * 2 + rate * 3) / 20);
  return prob;
}

const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '10px';
overlay.style.right = '10px';
overlay.style.background = 'rgba(0,0,0,0.7)';
overlay.style.color = 'white';
overlay.style.padding = '10px 20px';
overlay.style.borderRadius = '8px';
overlay.style.fontSize = '18px';
overlay.style.zIndex = 99999;
overlay.style.fontFamily = 'monospace';
document.body.appendChild(overlay);

function updateOverlay() {
  const prob = calculateGameProbability();
  overlay.textContent = `Game Probability: ${(prob * 100).toFixed(1)}%`;
  overlay.style.background = prob > 0.7 ? 'rgba(200,0,0,0.8)' : 'rgba(0,0,0,0.7)';
}
setInterval(updateOverlay, 500);
