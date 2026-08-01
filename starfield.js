// ── Starfield + parallax nebula system ───────────────
// Layered backdrop: two animated nebulas at different parallax depths
// plus a foreground star field. Add more nebulas by calling
// createNebulaLayer({ speed, build }) with your own build(nc, W, H) function.

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let W = 0, VH = 0, DOC_H = 0;

let stars = [];
let shootingStars = [];

function getDocHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    2000
  );
}

// ── Shared blob painter ──────────────────────────────
// Draws one wispy nebula blob as layered, noise-displaced radial ellipses.
// `color` must look like 'rgba(r,g,b,A)' — the token A is swapped per layer
// for the alpha value, so the blob feathers from its core out to transparent.
function drawWispyBlob(nc, cx, cy, rx, ry, angle, color, layers) {
  for (let l = 0; l < layers; l++) {
    const t = l / layers;
    const scaleX = rx * (1 - t * 0.55) + (Math.random() - 0.5) * rx * 0.3;
    const scaleY = ry * (1 - t * 0.45) + (Math.random() - 0.5) * ry * 0.2;
    const offX = (Math.random() - 0.5) * rx * 0.5;
    const offY = (Math.random() - 0.5) * ry * 0.6;
    const alpha = (1 - t) * 0.12 + 0.03;
    const pad = Math.max(rx, ry) * 0.35;

    nc.save();
    nc.translate(cx + offX, cy + offY);
    nc.rotate(angle + (Math.random() - 0.5) * 0.4);
    const g = nc.createRadialGradient(0, 0, 0, 0, 0, Math.max(scaleX, scaleY) + pad);
    g.addColorStop(0, color.replace('A', alpha.toFixed(2)));
    g.addColorStop(0.5, color.replace('A', (alpha * 0.4).toFixed(2)));
    g.addColorStop(1, 'transparent');
    nc.fillStyle = g;
    nc.scale(scaleX / Math.max(scaleX, scaleY), scaleY / Math.max(scaleX, scaleY));
    nc.beginPath();
    nc.arc(0, 0, Math.max(scaleX, scaleY) + pad, 0, Math.PI * 2);
    nc.fill();
    nc.restore();
  }
}

// ── Nebula layer registry ────────────────────────────
// Each nebula is rendered ONCE to its own offscreen canvas, then blitted
// every frame with parallax + slow drift + breathing + alpha pulse — cheap
// to animate, looks alive. `speed` is the fraction of page scroll the layer
// follows (0 = motionless, 1 = tracks the page exactly).
const layers = [];

function createNebulaLayer({
  speed = 0.15,
  drift = 0.00028,
  driftAmp = 45,
  breath = 0.0006,
  breathAmp = 0.04,
  alphaPulse = 0.0004,
  alphaAmp = 0.12,
  baseAlpha = 0.85,
  build,
}) {
  const off = document.createElement('canvas');
  const layer = {
    canvas: off,
    ctx: off.getContext('2d'),
    speed,
    drift, driftAmp,
    breath, breathAmp,
    alphaPulse, alphaAmp, baseAlpha,
    build,
    phase: Math.random() * 1000,
  };
  layers.push(layer);
  return layer;
}

// ── Nebula A — far, deep, dim, cool-leaning ──────────
// Sits high on the page, barely shifts with scroll (speed 0.08).
function buildNebulaA(nc, w, h) {
  const bandY = h * 0.26;
  const slope = -0.06;
  const spreadX = w * 0.18;

  // deep crimson base
  for (let i = 0; i < 6; i++) {
    const bx = w * (0.06 + i * 0.18) - spreadX;
    const by = bandY + bx * slope + (Math.random() - 0.5) * h * 0.04;
    drawWispyBlob(nc, bx, by, w * 0.36, h * 0.12, -0.14, 'rgba(110,18,48,A)', 14);
  }
  // dark rose spine
  for (let i = 0; i < 7; i++) {
    const bx = w * (0.03 + i * 0.15) - spreadX * 0.6;
    const by = bandY + bx * slope + (Math.random() - 0.5) * h * 0.025;
    drawWispyBlob(nc, bx, by, w * 0.20, h * 0.06, -0.09, 'rgba(140,30,68,A)', 16);
  }
  // deep indigo-blue drifts
  for (let i = 0; i < 5; i++) {
    const bx = w * Math.random() - spreadX * 0.25;
    const by = bandY + bx * slope + (Math.random() - 0.5) * h * 0.10;
    drawWispyBlob(nc, bx, by, w * 0.18, h * 0.07, 0.05, 'rgba(35,60,130,A)', 12);
  }
  // faint teal accents
  for (const px of [0.2, 0.5, 0.82]) {
    const bx = w * px - spreadX * 0.15;
    const by = bandY + bx * slope + h * 0.02;
    drawWispyBlob(nc, bx, by, w * 0.10, h * 0.04, 0.1, 'rgba(20,85,105,A)', 10);
  }
}

// ── Nebula B — near, bright, warm-leaning ────────────
// Lower band, moves faster with scroll (speed 0.28). Adds coral + cyan to
// the original hot-pink / rose / blue family.
function buildNebulaB(nc, w, h) {
  const bandY = h * 0.40;
  const slope = -0.12;
  const spreadX = w * 0.16;

  // deep crimson underlayer
  for (let i = 0; i < 6; i++) {
    const bx = w * (0.05 + i * 0.18) - spreadX;
    const by = bandY + bx * slope + (Math.random() - 0.5) * h * 0.04;
    drawWispyBlob(nc, bx, by, w * 0.34, h * 0.11, -0.15, 'rgba(160,20,60,A)', 14);
  }
  // hot pink ridge
  for (let i = 0; i < 8; i++) {
    const bx = w * (0.02 + i * 0.14) - spreadX * 0.7;
    const by = bandY + bx * slope + (Math.random() - 0.5) * h * 0.025;
    drawWispyBlob(nc, bx, by, w * 0.20, h * 0.055, -0.1, 'rgba(240,50,110,A)', 18);
  }
  // rose highlights
  for (const px of [0.08, 0.25, 0.44, 0.6, 0.78, 0.93]) {
    const bx = w * px - spreadX * 0.4;
    const by = bandY + bx * slope - h * (0.01 + Math.random() * 0.02);
    drawWispyBlob(nc, bx, by, w * 0.11, h * 0.035, -0.08, 'rgba(255,95,140,A)', 20);
  }
  // coral hot spots (new warm hue in the same palette)
  for (const px of [0.15, 0.52, 0.86]) {
    const bx = w * px - spreadX * 0.2;
    const by = bandY + bx * slope - h * 0.005;
    drawWispyBlob(nc, bx, by, w * 0.09, h * 0.03, -0.05, 'rgba(255,120,85,A)', 16);
  }
  // soft magenta outskirts
  for (let i = 0; i < 10; i++) {
    const bx = w * Math.random() - spreadX * 0.2;
    const spread = (Math.random() - 0.5);
    const by = bandY + bx * slope + spread * h * 0.08;
    drawWispyBlob(nc, bx, by, w * 0.16, h * 0.065, -0.05 + Math.random() * 0.1, 'rgba(200,40,90,A)', 10);
  }
  // bright blue clusters
  for (const bpx of [0.35, 0.62]) {
    const bx = w * bpx - spreadX * 0.1;
    const by = bandY + bx * slope + h * 0.015;
    drawWispyBlob(nc, bx, by, w * 0.09, h * 0.03, 0.1, 'rgba(120,165,255,A)', 12);
  }
  // cyan accents (new cool hue in the same palette)
  for (const px of [0.22, 0.7]) {
    const bx = w * px - spreadX * 0.15;
    const by = bandY + bx * slope + h * 0.025;
    drawWispyBlob(nc, bx, by, w * 0.08, h * 0.028, 0.08, 'rgba(90,205,225,A)', 12);
  }
}

createNebulaLayer({ speed: 0.30, baseAlpha: 0.80, build: buildNebulaA });
createNebulaLayer({ speed: 0.50, baseAlpha: 0.90, build: buildNebulaB });

// ── Stars (background, slowest parallax = farthest) ─
const STAR_SPEED = 0.08;

function buildStars() {
  const count = Math.floor((W * DOC_H) / 5000);
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * DOC_H,
      r: Math.random() * 1.5 + 0.25,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.018 + 0.004,
    });
  }
}

// ── Resize / (re)build every layer ───────────────────
function resize() {
  W = window.innerWidth;
  VH = window.innerHeight;
  DOC_H = getDocHeight();
  if (W <= 0 || VH <= 0 || DOC_H <= 0) return;

  canvas.width = W;
  canvas.height = VH;

  for (const layer of layers) {
    const EXTRA = W * 0.5; // 50% padding on each side

  layer.canvas.width = W + EXTRA * 2;
  layer.canvas.height = DOC_H;

  layer.ctx.clearRect(0, 0, layer.canvas.width, DOC_H);

  // Build using the larger canvas
  layer.build(layer.ctx, layer.canvas.width, DOC_H);
  }

  buildStars();
}

// ── Render loop ──────────────────────────────────────
function frame(now) {
  const sy = window.scrollY;
  ctx.clearRect(0, 0, W, VH);

  // stars: farthest layer — drawn first so nebulas sit in front
  const starOff = -sy * STAR_SPEED;
  for (const s of stars) {
    const y = s.y + starOff;
    if (y < -10 || y > VH + 10) continue;
    s.tw += s.sp;
    const a = Math.sin(s.tw) * 0.4 + 0.6;
    ctx.beginPath();
    ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 210, 255, ${a.toFixed(2)})`;
    ctx.fill();
  }

  // nebulas: closer layers — drawn on top of stars, faster parallax
  for (const layer of layers) {
    if (layer.canvas.width <= 0 || layer.canvas.height <= 0) continue;
    const driftY = Math.sin(now * layer.drift + layer.phase) * layer.driftAmp;
    const driftX = Math.cos(now * layer.drift * 0.8 + layer.phase) * layer.driftAmp * 0.4;
    const drawY = -sy * layer.speed + driftY;
    const breath = 1 + Math.sin(now * layer.breath + layer.phase) * layer.breathAmp;
    const alpha = Math.max(0, Math.min(1,
      layer.baseAlpha + Math.sin(now * layer.alphaPulse + layer.phase) * layer.alphaAmp
    ));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(W / 2, VH / 2);
    ctx.scale(breath, breath);
    ctx.translate(-W / 2 + driftX, -VH / 2);
    const offsetX = -(layer.canvas.width - W) / 2;
    ctx.drawImage(layer.canvas, offsetX, drawY);
    ctx.restore();
  }

  // shooting stars (viewport space)
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += ss.vx;
    ss.y += ss.vy;
    ss.life -= 0.012;
    if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.strokeStyle = `rgba(200, 190, 255, ${ss.life.toFixed(2)})`;
    ctx.lineWidth = 1.5;
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
    ctx.stroke();
  }

  requestAnimationFrame(frame);
}

function spawnShootingStar() {
  if (Math.random() > 0.997) {
    shootingStars.push({
      x: Math.random() * W,
      y: Math.random() * VH * 0.5,
      vx: (Math.random() * 4 + 4) * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.random() * 2 + 1,
      life: 1,
    });
  }
}

// ── Events + init ────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 120);
});

function init() {
  resize();
  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
