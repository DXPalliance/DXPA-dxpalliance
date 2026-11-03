const { execSync } = require("child_process");
const fs = require("fs");

console.log("=== 1. BUILDING CLEAN HERO 1 (CASH CHECKS & REAL EDUCATION) ===");

// Left card: 592x800
execSync(`
  convert public/assets/hero_1_poster_left.png \\
    -fill "#07172C" -draw "rectangle 0,605 592,800" \\
    -stroke "#D9A441" -strokewidth 2.5 -draw "line 0,605 592,605" \\
    public/assets/hero_1_poster_left_base.png
`);

// Add centered labels with exact bounding box so nothing ever clips
execSync(`
  convert public/assets/hero_1_poster_left_base.png \\
    -fill "#FFE082" -font DejaVu-Serif-Bold -pointsize 19 -gravity north -annotate +0+622 "THE DISCOVERY EXCHANGE" \\
    -fill "#FFFFFF" -font DejaVu-Sans-Bold -pointsize 15 -gravity north -annotate +0+656 "PARENTS ALLIANCE" \\
    -fill "#FBD38D" -font DejaVu-Sans -pointsize 13 -gravity north -annotate +0+692 "Real Education. Brighter Futures." \\
    -fill "#94A3B8" -font DejaVu-Sans -pointsize 10 -gravity north -annotate +0+730 "A 21st-Century Alliance of the People, by the People, for the People." \\
    public/assets/hero_1_poster_left_clean.png
`);

// Right side crowd with cash checks: 1408x800
execSync(`
  convert src/assets/images/thousands_students_teachers_cash_prize_1793691284440.jpg \\
    -resize 1408x800^ -gravity center -extent 1408x800 \\
    public/assets/hero_1_right_photo.png
`);

// Top banner card: 1100x175
execSync(`
  convert -size 1100x175 xc:"rgba(255,255,255,0.92)" \\
    -stroke "#D9A441" -strokewidth 2.5 -fill none -draw "roundrectangle 3,3 1097,172 14,14" \\
    -stroke none \\
    -fill "#0F294A" -font DejaVu-Serif-Bold -pointsize 16 -gravity north -annotate +0+14 "— The Discovery Exchange —" \\
    -fill "#A86500" -font DejaVu-Serif-Bold -pointsize 28 -gravity north -annotate +0+40 "Inspired by the Nobel Prize," \\
    -fill "#0A1F3C" -font DejaVu-Sans-Bold -pointsize 17 -gravity north -annotate +0+88 "The Discovery Exchange has established the National Discovery Prize" \\
    -fill "#1E3A8A" -font DejaVu-Sans-Bold -pointsize 15 -gravity north -annotate +0+122 "for K-12 public school students and teachers across America." \\
    public/assets/hero_1_top_banner.png
`);

// Composite right half
execSync(`
  convert public/assets/hero_1_right_photo.png \\
    public/assets/hero_1_top_banner.png -gravity north -geometry +0+16 -composite \\
    public/assets/hero_1_right_complete.png
`);

// Combine side-by-side with gold divider line only between the two images (592,0 to 592,800)
execSync(`
  convert +append public/assets/hero_1_poster_left_clean.png public/assets/hero_1_right_complete.png \\
    -stroke "#D9A441" -strokewidth 2 -draw "line 592,0 592,800" \\
    public/assets/hero/hero_1_curriculum_nobel.jpg
`);

console.log("Hero 1 completed successfully.");

console.log("=== 2. UPDATING HERO 7 (GAS PRICES CLOSE TO $6 IN LAS VEGAS, NO DXPA) ===");

// Crop and patch the 2026 gas pump price box
// The pump display in pump_2026_test.png is located at x=980..1140, y=200..360 in the main 2000x800 image
// Let us redraw the digital price display: $5.95 9/10 and Full tank $95
execSync(`
  convert public/assets/hero/hero_7_gas_prices.jpg \\
    -fill "#111111" -draw "rectangle 988,208 1135,274" \\
    -fill "#FF2222" -font DejaVu-Sans-Bold -pointsize 38 -gravity northwest -annotate +994+218 "\\$5.95" \\
    -fill "#FF3333" -font DejaVu-Sans-Bold -pointsize 19 -gravity northwest -annotate +1102+222 "9/10" \\
    -fill "#FFFFFF" -draw "rectangle 994,366 1125,432" \\
    -fill "#111111" -font DejaVu-Sans-Bold -pointsize 52 -gravity northwest -annotate +1002+372 "\\$95" \\
    public/assets/hero_7_price_updated.jpg
`);

// Update the bottom banner of hero 7 to remove "DXPA"
execSync(`
  convert public/assets/hero_7_price_updated.jpg \\
    -fill "#07172C" -draw "rectangle 700,640 1300,750" \\
    -fill "#FFE082" -font DejaVu-Serif-Bold -pointsize 32 -gravity north -annotate +0+646 "THE DISCOVERY EXCHANGE" \\
    -fill "#FFFFFF" -font DejaVu-Sans-Bold -pointsize 18 -gravity north -annotate +0+688 "PARENTS ALLIANCE" \\
    -fill "#94A3B8" -font DejaVu-Sans -pointsize 12 -gravity north -annotate +0+718 "A 21st-Century Alliance of the People, by the People, for the People." \\
    public/assets/hero/hero_7_gas_prices.jpg
`);

console.log("Hero 7 gas prices updated to $5.95/gal (close to $6) and DXPA removed.");

console.log("=== 3. UPDATING CHULA MASCOT IMAGE ===");
// Copy new beautiful Chula image to pip_mascot_clean.png
fs.copyFileSync(
  "src/assets/images/chula_puppy_mascot_1793691284440.jpg" || "src/assets/images/chula_puppy_mascot_1793691258552.jpg",
  "src/assets/images/pip_mascot_clean.png"
);
fs.copyFileSync(
  "src/assets/images/chula_puppy_mascot_1793691258552.jpg",
  "public/assets/chula_puppy_mascot.jpg"
);

console.log("Chula mascot updated successfully.");
