export const TILE_SIZE = 40;
export const TILE_GAP = 4;
export const CELL = TILE_SIZE + TILE_GAP;

export const COLOR_MAP = {
  red: '#e94560', orange: '#ff8c42', yellow: '#ffd700',
  green: '#4caf50', blue: '#4fc3f7', purple: '#ce93d8',
};

/** Draw a single tile at canvas pixel (px, py). */
export function drawTile(ctx, tile, px, py, size = TILE_SIZE, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#2a2a4a';
  ctx.strokeStyle = COLOR_MAP[tile.color];
  ctx.lineWidth = 3;
  roundRect(ctx, px + 2, py + 2, size - 4, size - 4, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = COLOR_MAP[tile.color];
  ctx.strokeStyle = COLOR_MAP[tile.color];
  drawShape(ctx, tile.shape, px + size / 2, py + size / 2, size * 0.28);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawShape(ctx, shape, cx, cy, r) {
  ctx.beginPath();
  switch (shape) {
    case 'circle':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      break;
    case 'diamond':
      ctx.moveTo(cx, cy - r * 1.3);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r * 1.3);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
      ctx.fill();
      break;
    case 'cross': {
      const t = r * 0.4;
      ctx.fillRect(cx - t, cy - r, t * 2, r * 2);
      ctx.fillRect(cx - r, cy - t, r * 2, t * 2);
      break;
    }
    case 'star':
      drawStar(ctx, cx, cy, 5, r, r * 0.45);
      ctx.fill();
      break;
    case 'clover':
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        ctx.arc(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.45, 0, Math.PI * 2);
      }
      ctx.fill();
      break;
  }
}

function drawStar(ctx, cx, cy, points, outer, inner) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    i === 0
      ? ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
      : ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  }
  ctx.closePath();
}
