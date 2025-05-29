
const GAME_KEYS = new Set([
  'w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'
]);
let keyHistory = [];
const HISTORY_WINDOW_MS = 10000;

document.addEventListener('keydown', (e) => {
  const now = Date.now();
  keyHistory.push({ key: e.key, time: now });
  keyHistory = keyHistory.filter(entry => now - entry.time < HISTORY_WINDOW_MS);
});

function calculateGameProbability() {
  if (keyHistory.length === 0) return 0;
  const gameKeyCount = keyHistory.filter(entry => GAME_KEYS.has(entry.key.toLowerCase())).length;
  return gameKeyCount / keyHistory.length;
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
