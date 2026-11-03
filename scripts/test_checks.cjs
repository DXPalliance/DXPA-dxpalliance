const { execSync } = require("child_process");

console.log("Testing check replacement on thousands_students_teachers_cash_prize...");

// Base image: src/assets/images/thousands_students_teachers_cash_prize_1793691284440.jpg (1376x768)
// On 1376x768:
// Center check "$50,000":
// Box: x ~600 to 830, y ~440 to 495
// Left check "$25,000" (tilted -10 deg):
// Box: x ~270 to 490, y ~490 to 555
// Right check "$10,000" (tilted +5 deg):
// Box: x ~940 to 1160, y ~490 to 550

// Let us test with sharp or convert to render clean text overlays
