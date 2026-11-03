import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'public/assets/aistudio/Wobbly_Robotic_Puppy_Portrait_99d2bb18.png';
const outputPath = 'public/assets/aistudio/pip_cutout_clean.png';

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const data = this.data;

    // Helper to get pixel
    function getRGB(x, y) {
      if (x < 0 || x >= w || y < 0 || y >= h) return null;
      const idx = (y * w + x) * 4;
      return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
    }

    // Is definitely foreground (Pip character core features)
    function isDefinitePip(r, g, b, y) {
      // Glowing gold rims, soundwaves, crest, paws, medal
      if (r > 165 && g > 120 && b < 110) return true;
      if (r > 200 && g > 150) return true;
      // White/silver metal (face, muzzle, screws, legs)
      if (r > 130 && g > 130 && b > 130 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25) return true;
      // Bright cyan robot eyes
      if (b > 160 && g > 140 && r < 100) return true;
      // Dark nose / mouth
      if (r < 30 && g < 30 && b < 30 && y < 800) return true;
      return false;
    }

    // Is definitely background floor below paws
    function isDefiniteFloor(y) {
      return y >= 1235;
    }

    // Mask: 0 = unknown, 1 = background, 2 = foreground
    const mask = new Uint8Array(w * h);

    // Queue for BFS
    const queue = [];

    // Seed top, left, right borders
    for (let x = 0; x < w; x++) {
      queue.push(x, 0);
      mask[x] = 1;
      // Bottom floor row
      queue.push(x, h - 1);
      mask[(h - 1) * w + x] = 1;
    }
    for (let y = 0; y < h; y++) {
      queue.push(0, y);
      mask[y * w] = 1;
      queue.push(w - 1, y);
      mask[y * w + (w - 1)] = 1;
    }

    // Also seed known background pockets:
    // Tail pocket (around x: 670, y: 550) if smooth background
    const bgPockets = [
      [680, 560],
      [630, 480],
      [490, 750],
      [50, 1100],
      [1150, 1100],
      [470, 1150]
    ];
    for (const [px, py] of bgPockets) {
      const idx = py * w + px;
      if (mask[idx] === 0) {
        const rgb = getRGB(px, py);
        if (!isDefinitePip(rgb[0], rgb[1], rgb[2], py)) {
          mask[idx] = 1;
          queue.push(px, py);
        }
      }
    }

    let head = 0;
    while (head < queue.length) {
      const cx = queue[head++];
      const cy = queue[head++];
      const cIdx = (cy * w + cx) * 4;
      const cr = data[cIdx], cg = data[cIdx + 1], cb = data[cIdx + 2];

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (let i = 0; i < 4; i++) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;

        const nPos = ny * w + nx;
        if (mask[nPos] !== 0) continue;

        const nIdx = nPos * 4;
        const nr = data[nIdx], ng = data[nIdx + 1], nb = data[nIdx + 2];

        // If it's definitely Pip, stop
        if (isDefinitePip(nr, ng, nb, ny)) {
          continue;
        }

        // Check if floor below paws
        if (isDefiniteFloor(ny)) {
          mask[nPos] = 1;
          queue.push(nx, ny);
          continue;
        }

        // Check step difference
        const stepDiff = Math.abs(cr - nr) + Math.abs(cg - ng) + Math.abs(cb - nb);
        if (stepDiff < 32) {
          mask[nPos] = 1;
          queue.push(nx, ny);
        }
      }
    }

    // Now apply transparency to all mask === 1 pixels
    // And smooth alpha on boundary
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pos = y * w + x;
        const idx = pos * 4;
        if (mask[pos] === 1) {
          data[idx + 3] = 0; // Transparent!
        }
      }
    }

    // Edge softening pass (anti-aliasing)
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const pos = y * w + x;
        const idx = pos * 4;
        if (data[idx + 3] > 0) {
          // Count transparent neighbors
          let transparentNeighbors = 0;
          if (data[(pos - 1) * 4 + 3] === 0) transparentNeighbors++;
          if (data[(pos + 1) * 4 + 3] === 0) transparentNeighbors++;
          if (data[(pos - w) * 4 + 3] === 0) transparentNeighbors++;
          if (data[(pos + w) * 4 + 3] === 0) transparentNeighbors++;

          if (transparentNeighbors === 3) {
            data[idx + 3] = 100;
          } else if (transparentNeighbors === 2) {
            data[idx + 3] = 175;
          } else if (transparentNeighbors === 1) {
            data[idx + 3] = 220;
          }
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath))
      .on('finish', () => console.log('Successfully saved to', outputPath));
  });
