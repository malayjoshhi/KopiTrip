/**
 * KopiTrip Logo Generator
 * Generates PNG app icons using pngjs (pure JS, no external deps).
 * Draws a coffee cup + travel pin logo with anti-aliasing.
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Brand colors
const OCEAN = [0x00, 0x66, 0xcc];
const SKY = [0x00, 0x99, 0xff];
const CORAL = [0xff, 0x6b, 0x4a];
const WHITE = [0xff, 0xff, 0xff];

// ---- Geometry helpers (all in a 0..1000 coordinate space) ----

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function mixColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

// Distance from point to rounded rect (signed, negative = inside)
function sdRoundRect(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - (hw - r);
  const qy = Math.abs(py - cy) - (hh - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.sqrt(ax * ax + ay * ay) + Math.min(Math.max(qx, qy), 0) - r;
}

// Distance from point to circle
function sdCircle(px, py, cx, cy, r) {
  return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2) - r;
}

// Distance from point to ellipse (axis aligned)
function sdEllipse(px, py, cx, cy, rx, ry) {
  const dx = (px - cx) / rx;
  const dy = (py - cy) / ry;
  return (Math.sqrt(dx * dx + dy * dy) - 1) * Math.min(rx, ry);
}

// Signed distance to a capsule (line segment with radius)
function sdCapsule(px, py, ax, ay, bx, by, r) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = clamp((pax * bax + pay * bay) / (bax * bax + bay * bay), 0, 1);
  const dx = pax - bax * h;
  const dy = pay - bay * h;
  return Math.sqrt(dx * dx + dy * dy) - r;
}

// Signed distance to a "pin" shape formed by union of circle and teardrop
function sdPin(px, py, cx, cy, r) {
  // circle at top
  const dCircle = sdCircle(px, py, cx, cy, r);
  // teardrop (triangle-ish) below
  const dDrop = sdCapsule(px, py, cx, cy, cx, cy + r * 2.2, r * 0.55);
  return Math.min(dCircle, dDrop);
}

// Steam path approximated with capsules
function sdSteam(px, py) {
  const paths = [
    [[-90, -170], [-90, -230]],
    [[0, -180], [0, -240]],
    [[90, -170], [90, -230]],
  ];
  let min = Infinity;
  for (const p of paths) {
    const d = sdCapsule(px, py, p[0][0], p[0][1], p[1][0], p[1][1], 13);
    min = Math.min(min, d);
  }
  return min;
}

// Coffee bean shape via two capsules crossing
function sdBean(px, py, cx, cy, rx, ry) {
  const d1 = sdCapsule(px, py, cx - rx * 0.5, cy - ry * 0.5, cx + rx * 0.5, cy + ry * 0.5, ry * 0.55);
  const d2 = sdCapsule(px, py, cx + rx * 0.5, cy - ry * 0.5, cx - rx * 0.5, cy + ry * 0.5, ry * 0.55);
  return Math.min(d1, d2);
}

// ---- Render one frame ----
function render(size) {
  const png = new PNG({ width: size, height: size });
  const S = 1024; // design space
  const s = size / S; // scale factor

  // Background gradient
  const cx = S / 2, cy = S / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x / s;
      const py = y / s;
      const idx = (y * size + x) * 4;

      // Background gradient (diagonal)
      const t = clamp((px + py) / (2 * S), 0, 1);
      let bg = mixColor(SKY, OCEAN, t);

      // Rounded rect background
      const dRect = sdRoundRect(px, py, cx, cy, 480, 480, 220);
      const bgAlpha = clamp(0.5 - dRect, 0, 1);

      // Coffee cup (white) at center-ish
      const cupBody = sdRoundRect(px, py, 512, 470, 190, 140, 60);
      // Cup handle (right side torus-ish) - capsule arc
      const handle = sdCapsule(px, py, 700, 390, 700, 550, 75);
      const handleOuter = sdCircle(px, py, 700, 470, 150);
      const handleRing = Math.max(handle, -handleOuter); // ring

      // Coffee liquid (coral) top of cup
      const coffee = sdRoundRect(px, py, 512, 380, 190, 35, 35);

      // Steam (white)
      const steam = sdSteam(px, py + 40);

      // Location pin (coral) bottom-right
      const pin = sdPin(px, py, 760, 650, 85);
      const pinHoleOuter = sdCircle(px, py, 760, 640, 45);

      // Coffee bean (white) bottom-left
      const bean = sdBean(px, py, 250, 700, 70, 95);

      // Composite
      let color = bg;
      let alpha = bgAlpha;

      // Cup body
      const cupA = clamp(0.5 - cupBody, 0, 1);
      if (cupA > 0) {
        color = mixColor(color, WHITE, cupA * alpha);
      }
      // Handle ring
      const handleA = clamp(0.5 - handleRing, 0, 1);
      if (handleA > 0) {
        color = mixColor(color, WHITE, handleA * alpha);
      }
      // Coffee liquid
      const coffeeA = clamp(0.5 - coffee, 0, 1);
      if (coffeeA > 0) {
        color = mixColor(color, CORAL, coffeeA * alpha);
      }
      // Steam
      const steamA = clamp(0.5 - steam, 0, 1);
      if (steamA > 0) {
        color = mixColor(color, WHITE, steamA * alpha * 0.9);
      }
      // Pin
      const pinA = clamp(0.5 - pin, 0, 1);
      if (pinA > 0) {
        color = mixColor(color, CORAL, pinA * alpha);
      }
      // Pin hole
      const holeA = clamp(0.5 - (-pinHoleOuter), 0, 1); // inside circle
      if (holeA > 0) {
        color = mixColor(color, WHITE, holeA * alpha);
      }
      // Bean
      const beanA = clamp(0.5 - bean, 0, 1);
      if (beanA > 0) {
        color = mixColor(color, WHITE, beanA * alpha);
      }

      png.data[idx] = color[0];
      png.data[idx + 1] = color[1];
      png.data[idx + 2] = color[2];
      png.data[idx + 3] = Math.round(255 * alpha);
    }
  }

  return png;
}

// ---- Write PNGs ----
const outDir = path.join(__dirname, '..', 'assets', 'images');
const targets = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'splash-icon.png', size: 512 },
  { name: 'favicon.png', size: 48 },
];

for (const target of targets) {
  const png = render(target.size);
  const outPath = path.join(outDir, target.name);
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log(`Generated ${target.name} (${target.size}x${target.size})`);
}

console.log('Logo generation complete.');
