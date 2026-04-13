import { createGame, stagePlace, unstage, commitTurn, swapTiles, passTurn } from './game.js';
import { validatePlacement } from './rules.js';
import { drawTile, TILE_SIZE, CELL } from './ui.js';
import { getTile } from './board.js';

// --- DOM refs ---
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const playerCountSel = document.getElementById('player-count');
const playerNamesDiv = document.getElementById('player-names');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const canvas = document.getElementById('board-canvas');
const ctx = canvas.getContext('2d');
const handTiles = document.getElementById('hand-tiles');
const btnPlay = document.getElementById('btn-play');
const btnSwap = document.getElementById('btn-swap');
const btnPass = document.getElementById('btn-pass');
const currentPlayerEl = document.getElementById('current-player');
const bagCountEl = document.getElementById('bag-count');
const scoresEl = document.getElementById('scores');
const finalScoresEl = document.getElementById('final-scores');

// --- State ---
let game = null;
let selectedHandTile = null;
let swapSelection = [];
let swapMode = false;
let camera = { x: 0, y: 0, zoom: 1 };
let drag = { active: false, startX: 0, startY: 0, camX: 0, camY: 0, moved: false };

// --- Start screen ---
function updateNameInputs() {
  const count = parseInt(playerCountSel.value);
  playerNamesDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const label = document.createElement('label');
    label.innerHTML = 'Player ' + (i + 1) + ' name <input type="text" value="Player ' + (i + 1) + '" id="pname-' + i + '" />';
    playerNamesDiv.appendChild(label);
  }
}
playerCountSel.addEventListener('change', updateNameInputs);
updateNameInputs();

btnStart.addEventListener('click', () => {
  const count = parseInt(playerCountSel.value);
  const names = Array.from({ length: count }, (_, i) => {
    const inp = document.getElementById('pname-' + i);
    return inp.value.trim() || ('Player ' + (i + 1));
  });
  startGame(names);
});

btnRestart.addEventListener('click', () => {
  endScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  updateNameInputs();
});

// --- Game start ---
function startGame(names) {
  game = createGame(names);
  startScreen.style.display = 'none';
  camera = { x: 0, y: 0, zoom: 1 };
  selectedHandTile = null;
  swapSelection = [];
  swapMode = false;
  resizeCanvas();
  render();
  updateSidebar();
  renderHand();
}

// --- Canvas resize ---
function resizeCanvas() {
  const wrap = document.getElementById('canvas-wrap');
  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
}
window.addEventListener('resize', () => { resizeCanvas(); render(); });

// --- Render board ---
function render() {
  if (!game) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2 + camera.x, canvas.height / 2 + camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  const gridR = 20;
  ctx.fillStyle = '#ffffff10';
  for (let gx = -gridR; gx <= gridR; gx++) {
    for (let gy = -gridR; gy <= gridR; gy++) {
      ctx.beginPath();
      ctx.arc(gx * CELL + CELL / 2, gy * CELL + CELL / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const [key, tile] of game.board) {
    const [bx, by] = key.split(',').map(Number);
    drawTile(ctx, tile, bx * CELL, by * CELL);
  }

  for (const { x, y, tile } of game.staged) {
    drawTile(ctx, tile, x * CELL, y * CELL, TILE_SIZE, 0.6);
  }

  if (selectedHandTile) {
    ctx.strokeStyle = '#ffffff44';
    ctx.lineWidth = 1;
    for (let gx = -gridR; gx <= gridR; gx++) {
      for (let gy = -gridR; gy <= gridR; gy++) {
        const occupied = getTile(game.board, gx, gy) !== null ||
          game.staged.some(p => p.x === gx && p.y === gy);
        if (!occupied) {
          const test = validatePlacement(game.board,
            [...game.staged, { x: gx, y: gy, tile: selectedHandTile }]);
          if (test.valid) {
            ctx.strokeRect(gx * CELL + 2, gy * CELL + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          }
        }
      }
    }
  }

  ctx.restore();
}

// --- Render hand ---
function renderHand() {
  if (!game) return;
  handTiles.innerHTML = '';
  const cp = game.players[game.currentPlayerIndex];
  for (const tile of cp.hand) {
    const cvs = document.createElement('canvas');
    cvs.width = TILE_SIZE;
    cvs.height = TILE_SIZE;
    cvs.style.cursor = 'pointer';
    cvs.style.borderRadius = '8px';
    drawTile(cvs.getContext('2d'), tile, 0, 0, TILE_SIZE, 1);
    const selected = swapMode ? swapSelection.includes(tile) : tile === selectedHandTile;
    if (selected) {
      const c = cvs.getContext('2d');
      c.strokeStyle = '#fff';
      c.lineWidth = 3;
      c.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }
    cvs.addEventListener('click', () => onHandTileClick(tile));
    handTiles.appendChild(cvs);
  }
  btnPlay.disabled = game.staged.length === 0;
  btnSwap.disabled = swapMode && swapSelection.length === 0;
  btnSwap.textContent = swapMode ? ('Swap (' + swapSelection.length + ')') : 'Swap';
}

function onHandTileClick(tile) {
  if (swapMode) {
    const idx = swapSelection.indexOf(tile);
    if (idx === -1) swapSelection.push(tile); else swapSelection.splice(idx, 1);
    renderHand();
    return;
  }
  selectedHandTile = tile === selectedHandTile ? null : tile;
  renderHand();
  render();
}

// --- Canvas click ---
canvas.addEventListener('click', (e) => {
  if (!selectedHandTile || drag.moved) return;
  const { bx, by } = canvasToBoard(e.clientX, e.clientY);
  const stagedIdx = game.staged.findIndex(p => p.x === bx && p.y === by);
  if (stagedIdx !== -1) {
    unstage(game, bx, by);
    selectedHandTile = null;
    renderHand(); render();
    return;
  }
  if (getTile(game.board, bx, by) !== null) return;
  const test = validatePlacement(game.board,
    [...game.staged, { x: bx, y: by, tile: selectedHandTile }]);
  if (!test.valid) return;
  stagePlace(game, bx, by, selectedHandTile);
  selectedHandTile = null;
  renderHand(); render();
});

function canvasToBoard(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const cx = (clientX - rect.left - canvas.width / 2 - camera.x) / camera.zoom;
  const cy = (clientY - rect.top - canvas.height / 2 - camera.y) / camera.zoom;
  return { bx: Math.floor(cx / CELL), by: Math.floor(cy / CELL) };
}

// --- Pan ---
canvas.addEventListener('mousedown', (e) => {
  drag = { active: true, startX: e.clientX, startY: e.clientY, camX: camera.x, camY: camera.y, moved: false };
  canvas.classList.add('dragging');
});
window.addEventListener('mousemove', (e) => {
  if (!drag.active) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
  camera.x = drag.camX + dx;
  camera.y = drag.camY + dy;
  render();
});
window.addEventListener('mouseup', () => { drag.active = false; canvas.classList.remove('dragging'); });

// --- Zoom ---
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  camera.zoom = Math.max(0.3, Math.min(3, camera.zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
  render();
}, { passive: false });

// --- Action buttons ---
btnPlay.addEventListener('click', () => {
  if (game.staged.length === 0) return;
  commitTurn(game);
  selectedHandTile = null; swapSelection = []; swapMode = false;
  if (game.over) { showEndScreen(); return; }
  renderHand(); render(); updateSidebar();
});

btnSwap.addEventListener('click', () => {
  if (!swapMode) {
    swapMode = true;
    while (game.staged.length) unstage(game, game.staged[0].x, game.staged[0].y);
    selectedHandTile = null;
    renderHand(); render();
    return;
  }
  if (swapSelection.length === 0) return;
  swapTiles(game, swapSelection);
  swapMode = false; swapSelection = [];
  renderHand(); updateSidebar();
});

btnPass.addEventListener('click', () => {
  passTurn(game);
  selectedHandTile = null; swapMode = false; swapSelection = [];
  if (game.over) { showEndScreen(); return; }
  renderHand(); render(); updateSidebar();
});

// --- Sidebar ---
function updateSidebar() {
  if (!game) return;
  const cp = game.players[game.currentPlayerIndex];
  currentPlayerEl.textContent = cp.name + "'s turn";
  bagCountEl.textContent = 'Bag: ' + game.bag.length;
  scoresEl.innerHTML = game.players.map((p, i) =>
    '<div class="score-entry ' + (i === game.currentPlayerIndex ? 'current' : '') + '">' +
    '<span>' + p.name + '</span><span>' + p.score + '</span></div>'
  ).join('');
}

// --- End screen ---
function showEndScreen() {
  const sorted = [...game.players].sort((a, b) => b.score - a.score);
  finalScoresEl.innerHTML = sorted.map((p, i) =>
    '<li>' + (i + 1) + '. ' + p.name + ' \u2014 ' + p.score + ' pts</li>'
  ).join('');
  endScreen.style.display = 'flex';
}
