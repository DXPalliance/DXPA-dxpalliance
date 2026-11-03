import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'public/assets/aistudio/Wobbly_Robotic_Puppy_Portrait_99d2bb18.png';
const outputPath = 'public/assets/aistudio/pip_mascot_cutout.png';

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const data = this.data;

    // Check if pixel is definitely background
    // Background is dark navy with B > G > R or reflective floor at bottom
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Below paws: floor reflection
        if (y >= 1220) {
          data[idx + 3] = 0;
          continue;
        }

        // Far left and right margins outside Pip's ears & tail
        if (x < 75 && y < 1000) {
          data[idx + 3] = 0;
          continue;
        }
        if (x > 1040 && (y < 450 || y > 750)) {
          data[idx + 3] = 0;
          continue;
        }

        // Top margins above Pip's crest
        if (y < 20) {
          data[idx + 3] = 0;
          continue;
        }

        // Standard navy studio wall (dark, blue-dominated, low red, low green)
        // Ensure we NEVER touch gold (r > 150, g > 110) or white metal (r > 110, g > 110, b > 110)
        const isWarmGold = (r > 130 && g > 95 && r > b);
        const isWhiteSilver = (r > 110 && g > 110 && b > 110);
        const isCyanEye = (b > 150 && g > 130 && r < 100);
        const isPupilOrNose = (r < 40 && g < 40 && b < 40 && x > 300 && x < 800 && y > 200 && y < 650);
        const isPipInnerBlue = (b > 60 && x > 150 && x < 950 && y > 150 && y < 1150);

        // Outside Pip's main body bounding areas:
        // Left gap between ear and front paw: x < 210, y > 580 && y < 1000
        if (x < 200 && y > 600 && y < 1000) {
          if (!isWarmGold && !isWhiteSilver) {
            data[idx + 3] = 0;
            continue;
          }
        }

        // Right gap behind rear legs: x > 860, y > 750
        if (x > 860 && y > 750) {
          if (!isWarmGold && !isWhiteSilver) {
            data[idx + 3] = 0;
            continue;
          }
        }

        // Floor between left and right paws: y > 1180, x between 380 and 520
        if (y > 1170 && x > 380 && x < 520) {
          if (!isWarmGold) {
            data[idx + 3] = 0;
            continue;
          }
        }

        // Top-left and Top-right corner studio wall
        if ((x < 250 && y < 250) || (x > 850 && y < 200)) {
          if (!isWarmGold && !isWhiteSilver) {
            // Check if standard blue background: B > 50, B > R + 25
            if (b > 50 && b > r + 20 && r < 75) {
              data[idx + 3] = 0;
              continue;
            }
          }
        }

        // Pure studio wall detection (away from character center)
        if (b > 50 && b > r + 25 && r < 65 && !isWarmGold && !isWhiteSilver && !isPupilOrNose) {
          // If in outer periphery
          if (x < 300 || x > 780 || y < 150) {
            data[idx + 3] = 0;
            continue;
          }
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath))
      .on('finish', () => console.log('Saved cutout to', outputPath));
  });
