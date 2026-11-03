const { execSync } = require("child_process");

console.log("Assembling photorealistic Hero 1 with authentic checks and user banner...");

// 1. Base clean 2000x800 image
execSync(`
  convert src/assets/images/thousands_students_teachers_cash_prize_1793691284440.jpg \
    -resize 2000x800^ -gravity center -extent 2000x800 +repage \
    /tmp/hero_clean.png
`);

// 2. Left crowd checks - ONLY on the 3 notebooks held in the air, exactly one check per kid
// Kid 1: Girl on far left with orange/white shirt (x=145, y=365, rotated 38 deg)
execSync(`
  convert -size 136x76 xc:"#DFE5EF" \
    -stroke "#1E40AF" -strokewidth 2.2 -fill none -draw "rectangle 2,2 133,73" \
    -stroke "#3B82F6" -strokewidth 1 -draw "rectangle 5,5 130,70" \
    -fill "#0F2642" -stroke none -font Liberation-Sans-Bold -pointsize 18 -gravity center -annotate +0-6 "\\$10,000" \
    -font Liberation-Sans-Bold -pointsize 8.5 -annotate +0+15 "REGIONAL WINNER" \
    -background transparent -rotate 38 \
    /tmp/mini_left_1.png
`);

// Kid 2: Girl in crowd holding spiral notebook (x=280, y=312, rotated -18 deg)
execSync(`
  convert -size 136x76 xc:"#DFE5EF" \
    -stroke "#1E40AF" -strokewidth 2.2 -fill none -draw "rectangle 2,2 133,73" \
    -stroke "#3B82F6" -strokewidth 1 -draw "rectangle 5,5 130,70" \
    -fill "#0F2642" -stroke none -font Liberation-Sans-Bold -pointsize 18 -gravity center -annotate +0-6 "\\$10,000" \
    -font Liberation-Sans-Bold -pointsize 8.5 -annotate +0+15 "STUDENT AWARD" \
    -background transparent -rotate -18 \
    /tmp/mini_left_2.png
`);

// Kid 3: Boy holding green notebook (x=375, y=305, rotated -8 deg)
// He ONLY holds this one sign in his raised hand. (The tan folder at his waist has NO sign).
execSync(`
  convert -size 116x70 xc:"#DFE5EF" \
    -stroke "#1E40AF" -strokewidth 2.2 -fill none -draw "rectangle 2,2 113,67" \
    -stroke "#3B82F6" -strokewidth 1 -draw "rectangle 5,5 110,64" \
    -fill "#0F2642" -stroke none -font Liberation-Sans-Bold -pointsize 18 -gravity center -annotate +0-6 "\\$5,000" \
    -font Liberation-Sans-Bold -pointsize 8.5 -annotate +0+15 "DISCOVERY PRIZE" \
    -background transparent -rotate -8 \
    /tmp/mini_left_3.png
`);

// Composite the 3 left handheld checks onto hero_clean
// ZERO FLOATING CHECKS ON THE RIGHT SIDE! Nobody has a sign covering their face!
execSync(`
  convert /tmp/hero_clean.png \
    /tmp/mini_left_1.png -geometry +145+365 -composite \
    /tmp/mini_left_2.png -geometry +280+312 -composite \
    /tmp/mini_left_3.png -geometry +375+305 -composite \
    /tmp/hero_stage1.png
`);

// 3. Center Grand Prize Check: $500,000
execSync(`
  convert /tmp/hero_stage1.png \
    -fill "#D8DFEB" -stroke "#D8DFEB" -draw "rectangle 870,578 1195,666" \
    -fill "#112A46" -stroke none -font Liberation-Sans-Bold -pointsize 69 -gravity northwest -annotate +872+584 "\\$500,000" \
    /tmp/hero_stage2.png
`);

// 4. Left Teacher Excellence Check: $250,000
execSync(`
  convert -size 380x96 xc:"#DFE6F1" \
    -fill "#112A46" -stroke none -font Liberation-Sans-Bold -pointsize 67 -gravity center -annotate +0-2 "\\$250,000" \
    -background transparent -rotate -10.5 \
    /tmp/patch_250k.png
`);
execSync(`
  convert /tmp/hero_stage2.png \
    /tmp/patch_250k.png -geometry +380+582 -composite \
    /tmp/hero_stage3.png
`);

// 5. Right side checks: Liam holds $1,000 and Mark holds $3,000!
// Check 1 (Liam): $1,000 STUDENT INNOVATION CASH AWARD
execSync(`
  convert -size 240x280 xc:"#DFE5EF" \
    -stroke "#1E40AF" -strokewidth 3.5 -fill none -draw "rectangle 4,4 235,275" \
    -stroke "#3B82F6" -strokewidth 1.2 -draw "rectangle 8,8 231,271" \
    -fill "#0F2642" -stroke none \
    -font Liberation-Sans-Bold -pointsize 12.5 -gravity north -annotate +0+18 "NATIONAL DISCOVERY PRIZE" \
    -font Liberation-Sans-Bold -pointsize 54 -gravity north -annotate +0+52 "\\$1,000" \
    -font Liberation-Sans-Bold -pointsize 13.5 -gravity north -annotate +0+132 "STUDENT INNOVATION" \
    -font Liberation-Sans-Bold -pointsize 12 -gravity north -annotate +0+154 "CASH AWARD" \
    -font Liberation-Sans-Bold -pointsize 13 -gravity south -annotate +0+34 "LIAM O'BRIEN" \
    -font Liberation-Sans -pointsize 11 -gravity south -annotate +0+16 "REGIONAL WINNER" \
    -background transparent -rotate 2.5 \
    /tmp/check_liam_v2.png
`);

// Check 2 (Mark): $3,000 TEACHER MENTOR CASH AWARD
execSync(`
  convert -size 246x280 xc:"#DFE5EF" \
    -stroke "#1E40AF" -strokewidth 3.5 -fill none -draw "rectangle 4,4 241,275" \
    -stroke "#3B82F6" -strokewidth 1.2 -draw "rectangle 8,8 237,271" \
    -fill "#0F2642" -stroke none \
    -font Liberation-Sans-Bold -pointsize 12.5 -gravity north -annotate +0+18 "NATIONAL DISCOVERY PRIZE" \
    -font Liberation-Sans-Bold -pointsize 54 -gravity north -annotate +0+52 "\\$3,000" \
    -font Liberation-Sans-Bold -pointsize 13.5 -gravity north -annotate +0+132 "TEACHER MENTOR" \
    -font Liberation-Sans-Bold -pointsize 12 -gravity north -annotate +0+154 "CASH AWARD" \
    -font Liberation-Sans-Bold -pointsize 13 -gravity south -annotate +0+34 "MARK STEVENS" \
    -font Liberation-Sans -pointsize 11 -gravity south -annotate +0+16 "EXCELLENCE IN TEACHING" \
    -background transparent -rotate 2.5 \
    /tmp/check_mark_v2.png
`);

// Composite both Liam and Mark checks right into their hands
execSync(`
  convert /tmp/hero_stage3.png \
    /tmp/check_liam_v2.png -geometry +1284+522 -composite \
    /tmp/check_mark_v2.png -geometry +1522+532 -composite \
    /tmp/hero_stage4.png
`);

// 6. Header Banner across the top
// High-resolution gold-and-navy banner inspired by user idea
execSync(`
  convert -size 1360x104 xc:transparent \\
    -fill "rgba(2, 6, 23, 0.96)" \\
    -stroke "#F59E0B" -strokewidth 4.5 \\
    -draw "roundrectangle 6,6 1354,98 14,14" \\
    -stroke "#FDE68A" -strokewidth 1.5 -fill none \\
    -draw "roundrectangle 11,11 1349,93 10,10" \\
    \\( public/left_medallion.png -resize 80x80 \\) -geometry +18+12 -composite \\
    \\( public/right_medallion.png -resize 80x80 \\) -geometry +1262+12 -composite \\
    -fill "#FCD34D" -stroke none -font DejaVu-Serif-Bold -pointsize 18 -gravity north -annotate +0+14 "NOT Like OLD Nobel Prize For Just One Person." \\
    -fill "#FFFFFF" -font DejaVu-Serif-Bold -pointsize 28 -gravity north -annotate +0+38 "Meet Your NEW Discovery Prize" \\
    -fill "#93C5FD" -font Liberation-Sans-Bold -pointsize 17 -gravity north -annotate +0+73 "For Thousands of K-12 Teachers and Students" \\
    /tmp/custom_header_banner.png
`);

execSync(`
  convert /tmp/hero_stage4.png \
    /tmp/custom_header_banner.png -geometry +320+12 -composite \
    public/assets/hero/hero_1_curriculum_nobel.jpg
`);

console.log("Hero 1 successfully assembled!");
