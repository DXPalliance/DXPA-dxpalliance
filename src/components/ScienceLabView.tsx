import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as $3Dmol from "3dmol";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Gauge,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sliders,
  Sun,
  SunMoon,
  Thermometer,
  Wrench,
} from "lucide-react";

interface ScienceLabViewProps {
  onDraftScienceCampaign: (briefText: string) => void;
}

type LabWorkspaceMode = "prize_showcase" | "molecular_workbench";
type DiscoveryTrackFilter = "all" | "Applied Discovery" | "Analytical Discovery" | "Hybrid Discovery";
type EntityMode = "alphafold" | "pdb" | "pubchem";
type ViewerStyleMode = "cartoon" | "stick" | "sphere";

interface QuickExample {
  label: string;
  mode: EntityMode;
  accession: string;
  litQuery: string;
}

interface StructureSummary {
  title: string;
  accession: string;
  organismOrMethod: string;
  description: string;
  provenanceLabel: string;
  sourceUrl: string;
  sequenceLengthOrRes?: string;
}

interface CompoundProperties {
  cid: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: string;
  xLogP: string;
  hBondDonor: number;
  hBondAcceptor: number;
  tpsa: string;
  smiles: string;
  lipinskiViolations: number;
}

interface LiteratureItem {
  id: string;
  title: string;
  authors: string;
  year: string;
  sourceDb: "Europe PMC" | "arXiv";
  url: string;
}

interface GarageBomItem {
  part: string;
  source: string;
  costUsd: number;
}

interface StudentInventionProject {
  id: string;
  title: string;
  track: "Applied Discovery" | "Analytical Discovery" | "Hybrid Discovery";
  gradeLevel: string;
  regionLabel: string;
  totalBomUsd: number;
  coreQuestion: string;
  scientificPrinciple: string;
  everydayImpact: string;
  bom: GarageBomItem[];
  linkedMolecule: {
    label: string;
    mode: EntityMode;
    accession: string;
    litQuery: string;
  };
}

interface BlindSubmissionReceipt {
  submissionCode: string;
  timestamp: string;
  track: "Applied Discovery" | "Analytical Discovery" | "Hybrid Discovery";
  participantRole: string;
  gradeBand: string;
  projectTitle: string;
  garageMaterials: string;
  hypothesisSummary: string;
  estimatedCostUsd: number;
}

const STUDENT_INVENTIONS: StudentInventionProject[] = [
  {
    id: "solar-water-purifier",
    title: "Solar Water Purifier Made from Copper Pipe & Old Mirrors",
    track: "Applied Discovery",
    gradeLevel: "9th Grade · Public High School",
    regionLabel: "Midwest Country School",
    totalBomUsd: 24,
    coreQuestion:
      "Can broken bedroom mirrors and a hardware-store copper pipe heat dirty well water hot enough to make it safe to drink—with zero electricity?",
    scientificPrinciple:
      "12 small mirrors bounce sunlight onto one black copper pipe. Once the water inside hits 149°F (65°C), the heat kills 99.99% of germs.",
    everydayImpact:
      "Makes 3 gallons of clean, safe drinking water every sunny afternoon using $24 of leftover garage parts.",
    bom: [
      { part: "Copper Pipe Coil (5 feet)", source: "Hardware Store Scrap", costUsd: 11 },
      { part: "12 Small Mirror Squares", source: "Old Broken Bedroom Mirror", costUsd: 0 },
      { part: "Curved Plywood Frame", source: "Garage Scrap Wood", costUsd: 4 },
      { part: "Flat Black Grill Paint", source: "Leftover Spray Can", costUsd: 5 },
      { part: "Clear Water Hose & Valve", source: "Hardware Bin", costUsd: 4 },
    ],
    linkedMolecule: {
      label: "See 3D Water Channel Model",
      mode: "pdb",
      accession: "1J4N",
      litQuery: "solar water pasteurization aquaporin thermal inactivation",
    },
  },
  {
    id: "fishing-line-prosthetic",
    title: "Helping-Hand Gripper Made from PVC Pipe & Fishing Line",
    track: "Applied Discovery",
    gradeLevel: "10th Grade · Public High School",
    regionLabel: "Great Lakes Town",
    totalBomUsd: 18,
    coreQuestion:
      "How can a teen build a light, easy-to-fix hand helper for a grandparent with stiff fingers for under $20?",
    scientificPrinciple:
      "Strong fishing line runs through small white PVC pipe joints like real finger tendons. Bending the wrist pulls the fingers closed with a firm grip.",
    everydayImpact:
      "Any family can fix or tighten it at the kitchen table in 5 minutes with a screwdriver and spare fishing line.",
    bom: [
      { part: "White PVC Pipe Pieces", source: "Plumbing Scrap Bucket", costUsd: 5 },
      { part: "50-lb Braided Fishing Line", source: "Dad's Tackle Box", costUsd: 4 },
      { part: "Stretchy Bungee Cord", source: "Old Camping Tent", costUsd: 3 },
      { part: "Soft Foam Padding", source: "Old Exercise Mat", costUsd: 2 },
      { part: "Velcro Wrist Strap", source: "Garage Tool Drawer", costUsd: 4 },
    ],
    linkedMolecule: {
      label: "See 3D Muscle Fiber Model",
      mode: "alphafold",
      accession: "P35579",
      litQuery: "biomechanical tendon routing myosin force generation",
    },
  },
  {
    id: "laser-water-spectrometer",
    title: "Creek Water Dirt Tester Made with a Laser Pointer & Old DVD",
    track: "Hybrid Discovery",
    gradeLevel: "11th Grade · Public High School",
    regionLabel: "Mountain Valley School",
    totalBomUsd: 14,
    coreQuestion:
      "Can a $5 cat-toy laser pointer and an old scratched DVD measure mud and rust in neighborhood creek water?",
    scientificPrinciple:
      "Shining the laser through a clear spice jar of creek water bounces light off tiny dirt specks. A phone camera reads the rainbow on the DVD piece.",
    everydayImpact:
      "Gives any public school science class a working water tester for $14 instead of buying a $1,200 lab machine.",
    bom: [
      { part: "Red Keychain Laser Pointer", source: "Kitchen Drawer", costUsd: 5 },
      { part: "Old Blank DVD Disc", source: "Desk Drawer", costUsd: 1 },
      { part: "Black Shoebox", source: "Bedroom Closet", costUsd: 0 },
      { part: "Clear Glass Spice Jar", source: "Kitchen Rack", costUsd: 4 },
      { part: "AA Battery Holder & Switch", source: "Broken Flashlight", costUsd: 4 },
    ],
    linkedMolecule: {
      label: "See 3D Light Sensor Model",
      mode: "pdb",
      accession: "1F88",
      litQuery: "optical nephelometry water turbidity smartphone spectroscopy",
    },
  },
  {
    id: "acoustic-soil-sensor",
    title: "Garden Soil Water Checker Made from a Soup Can & Bike Spokes",
    track: "Hybrid Discovery",
    gradeLevel: "8th Grade · Public Middle School",
    regionLabel: "Farming Valley School",
    totalBomUsd: 16,
    coreQuestion:
      "How can families tell if deep plant roots already have enough water instead of wasting water on a timer?",
    scientificPrinciple:
      "A $3 musical greeting-card buzzer hums through steel bike spokes stuck in the dirt. Wet soil changes the sound pitch, which a phone mic reads.",
    everydayImpact:
      "Saved nearly 40% of water in the school vegetable garden and never rusts out like store-bought sensors.",
    bom: [
      { part: "Musical Greeting Card Buzzers (2)", source: "Old Birthday Card", costUsd: 3 },
      { part: "Steel Bicycle Spokes (4)", source: "Neighborhood Bike Shop", costUsd: 4 },
      { part: "Empty Tin Soup Can", source: "Kitchen Recycling", costUsd: 0 },
      { part: "Headphone Cord Plug", source: "Broken Earbuds", costUsd: 5 },
      { part: "Waterproof Glue", source: "Garage Shelf", costUsd: 4 },
    ],
    linkedMolecule: {
      label: "See 3D Plant Root Model",
      mode: "pdb",
      accession: "3CN5",
      litQuery: "plant root water uptake aquaporin soil moisture",
    },
  },
  {
    id: "altitude-hemoglobin-model",
    title: "Cardboard & Rubber-Band Breathing Helper Model",
    track: "Analytical Discovery",
    gradeLevel: "12th Grade · Public High School",
    regionLabel: "Mountain Town School",
    totalBomUsd: 12,
    coreQuestion:
      "Why do runners get out of breath faster high up in the mountains, and how can kids see how blood carries oxygen?",
    scientificPrinciple:
      "Uses cardboard strips, brass pins, and rubber bands to draw the exact curve showing how red blood cells let go of oxygen when muscles work hard.",
    everydayImpact:
      "Turns a hard medical textbook chart into a simple moving toy that any 9th grader can pull with their hands and understand.",
    bom: [
      { part: "Cardboard Strips & Brass Pins", source: "Old Clipboard", costUsd: 5 },
      { part: "Rubber Bands", source: "Kitchen Junk Drawer", costUsd: 2 },
      { part: "Graph Poster Board", source: "School Supply Room", costUsd: 3 },
      { part: "Metal Washers (Weights)", source: "Garage Bolt Jar", costUsd: 2 },
    ],
    linkedMolecule: {
      label: "See 3D Blood Oxygen Model",
      mode: "pdb",
      accession: "4HHB",
      litQuery: "human deoxyhemoglobin Bohr effect oxygen transport",
    },
  },
  {
    id: "carbon-felt-water-softener",
    title: "Charcoal & Carpenter-Pencil Salty Water Filter",
    track: "Analytical Discovery",
    gradeLevel: "11th Grade · Public High School",
    regionLabel: "Coastal Town School",
    totalBomUsd: 21,
    coreQuestion:
      "Can backyard grill charcoal and thick carpenter pencils pull salt out of slightly salty well water using one AA battery?",
    scientificPrinciple:
      "When hooked to a 1.2-volt rechargeable battery, the porous charcoal and pencil lead act like a magnet that traps salt particles as water drips through.",
    everydayImpact:
      "Shows how low-cost household materials can clean salty well water without big factory filters.",
    bom: [
      { part: "Natural Lump Grill Charcoal", source: "Backyard BBQ Bag", costUsd: 6 },
      { part: "Flat Carpenter Pencils", source: "Toolbox", costUsd: 5 },
      { part: "Paper Coffee Filters", source: "Kitchen Counter", costUsd: 2 },
      { part: "Clear Plastic Plates & Wingnuts", source: "Hardware Scrap", costUsd: 8 },
    ],
    linkedMolecule: {
      label: "See Simple Molecule View",
      mode: "pubchem",
      accession: "311",
      litQuery: "capacitive deionization porous carbon brackish water",
    },
  },
  {
    id: "bike-wheel-wind-charger",
    title: "Bicycle-Wheel Wind Phone & Lantern Charger",
    track: "Applied Discovery",
    gradeLevel: "8th Grade · Public Middle School",
    regionLabel: "Prairie Town School",
    totalBomUsd: 19,
    coreQuestion:
      "Can an old bent bicycle wheel, plastic bucket blades, and fridge magnets charge a family phone and camping lantern when the power goes out?",
    scientificPrinciple:
      "Wind spins plastic bucket blades bolted to bike spokes. Magnets glued to the wheel rim whip past copper wire from a broken fan, making free electricity.",
    everydayImpact:
      "Charges a phone or LED emergency lantern in a backyard breeze for $19—perfect for kids who love bikes, gears, and fixing things.",
    bom: [
      { part: "Old 20-Inch Kid's Bike Wheel", source: "Backyard Shed", costUsd: 0 },
      { part: "5-Gallon Plastic Bucket (Cut into Blades)", source: "Garage Corner", costUsd: 4 },
      { part: "8 Strong Ceramic Magnets", source: "Hardware Store Aisle", costUsd: 6 },
      { part: "Copper Wire Spool (from Broken Fan)", source: "Scrap Bin", costUsd: 4 },
      { part: "12V Car-to-USB Phone Plug", source: "Dollar Store", costUsd: 5 },
    ],
    linkedMolecule: {
      label: "See 3D Energy Cell Model",
      mode: "pdb",
      accession: "1E79",
      litQuery: "rotary motor ATP synthase mechanical energy conversion",
    },
  },
  {
    id: "dog-bowl-freeze-stopper",
    title: "Solar Dog-Bowl Freeze Stopper for Winter Backyards",
    track: "Applied Discovery",
    gradeLevel: "7th Grade · Public Middle School",
    regionLabel: "Northern Country School",
    totalBomUsd: 15,
    coreQuestion:
      "How can a kid keep an outside dog's water bowl from freezing solid on cold winter days without running dangerous extension cords across the snow?",
    scientificPrinciple:
      "A black cookie tin packed with beeswax or candle wax sits under a clear cake cover. Midday sun melts the wax, which slowly lets out heat for 6 hours.",
    everydayImpact:
      "Keeps drinking water liquid for pets, chickens, and backyard birds down to 18°F using zero electricity.",
    bom: [
      { part: "Metal Holiday Cookie Tin", source: "Kitchen Pantry", costUsd: 0 },
      { part: "3 Old Unscented Pillar Candles (Wax)", source: "Thrift Store", costUsd: 5 },
      { part: "Dark Slate or Ceramic Floor Tile", source: "Garage Leftover", costUsd: 3 },
      { part: "Clear Plastic Cake Dome", source: "Grocery Bakery Bin", costUsd: 3 },
      { part: "Foil Bubble Wrap Insulation", source: "Shipping Box", costUsd: 4 },
    ],
    linkedMolecule: {
      label: "See 3D Ice-Stopper Protein",
      mode: "pdb",
      accession: "1HG7",
      litQuery: "antifreeze protein thermal hysteresis ice crystal inhibition",
    },
  },
  {
    id: "red-cabbage-food-sticker",
    title: "Red-Cabbage Juice Smart Sticker That Warns If Milk Is Spoiled",
    track: "Analytical Discovery",
    gradeLevel: "9th Grade · Public High School",
    regionLabel: "City Neighborhood School",
    totalBomUsd: 14,
    coreQuestion:
      "Can purple juice boiled from a grocery-store red cabbage tell a family if milk or fish is starting to spoil before anyone gets a stomachache?",
    scientificPrinciple:
      "Natural purple pigment in red cabbage changes color from purple to blue-green as spoiling food lets off tiny gas vapors inside a container.",
    everydayImpact:
      "Costs less than 2 cents per paper strip and helps families and school cafeterias avoid throwing away good food or eating spoiled food.",
    bom: [
      { part: "1 Head of Red Cabbage", source: "Grocery Store Produce", costUsd: 3 },
      { part: "White Coffee Filter Paper", source: "Kitchen Counter", costUsd: 2 },
      { part: "Unflavored Gelatin Packets", source: "Baking Shelf", costUsd: 4 },
      { part: "Clear Packing Tape", source: "Desk Drawer", costUsd: 3 },
      { part: "Lemon Juice & Baking Soda (To Test)", source: "Kitchen", costUsd: 2 },
    ],
    linkedMolecule: {
      label: "See Molecule Structure",
      mode: "pubchem",
      accession: "441667",
      litQuery: "anthocyanin pH indicator smart food packaging spoilage",
    },
  },
  {
    id: "banana-peel-soil-sponge",
    title: "Banana-Peel & Potato-Starch Sponge That Holds Water for Plants",
    track: "Hybrid Discovery",
    gradeLevel: "8th Grade · Public Middle School",
    regionLabel: "Southwest Desert School",
    totalBomUsd: 13,
    coreQuestion:
      "Can leftover banana peels and potato water from dinner be baked into soft sponges that hold rain around tomato roots in dry weather?",
    scientificPrinciple:
      "Boiling and baking banana peels with a spoon of vinegar links natural plant fibers into a sponge that drinks up 15 times its weight in water.",
    everydayImpact:
      "Turns kitchen trash into a natural garden helper that feeds the soil instead of leaving plastic behind.",
    bom: [
      { part: "6 Ripe Banana Peels", source: "Breakfast Table", costUsd: 0 },
      { part: "Cornstarch or Potato Starch", source: "Kitchen Pantry", costUsd: 3 },
      { part: "White Vinegar & Vegetable Glycerin", source: "Grocery Aisle", costUsd: 6 },
      { part: "Old Muffin Tin & Blender", source: "Kitchen Cupboard", costUsd: 4 },
    ],
    linkedMolecule: {
      label: "See 3D Plant Cellulose Model",
      mode: "pdb",
      accession: "4B9F",
      litQuery: "biodegradable hydrogel banana peel pectin water retention soil",
    },
  },
  {
    id: "basketball-shoe-grip-tester",
    title: "Basketball Shoe Grip & Dusty Gym Floor Tester",
    track: "Analytical Discovery",
    gradeLevel: "10th Grade · Public High School",
    regionLabel: "Suburban Public High School",
    totalBomUsd: 19,
    coreQuestion:
      "Why do basketball players slip on dusty gym floors in the 4th quarter, and what simple wipe gives sneakers the best grip to prevent twisted ankles?",
    scientificPrinciple:
      "Uses a $9 fishing scale and a 10-pound backpack weight inside an old sneaker to measure the exact pounds of pull needed before the shoe slides.",
    everydayImpact:
      "Proved that a damp microfiber towel Pad by the team bench boosts shoe grip by 42%—adopted by the school JV basketball team.",
    bom: [
      { part: "Digital Handheld Fish Scale", source: "Tackle Box / Sporting Goods", costUsd: 9 },
      { part: "Old Basketball Sneaker", source: "Gym Bag", costUsd: 0 },
      { part: "10-lb Sandbag (Rice in Sock)", source: "Pantry & Closet", costUsd: 4 },
      { part: "Microfiber Cloth & Spray Bottle", source: "Cleaning Bucket", costUsd: 6 },
    ],
    linkedMolecule: {
      label: "See 3D Tendon Collagen Model",
      mode: "pdb",
      accession: "1BKV",
      litQuery: "basketball shoe traction coefficient of friction ankle injury",
    },
  },
  {
    id: "box-fan-smoke-cleaner",
    title: "Window Box-Fan Bedroom Air Cleaner for Wildfire Smoke Days",
    track: "Applied Discovery",
    gradeLevel: "9th Grade · Public High School",
    regionLabel: "Western Timber Town",
    totalBomUsd: 22,
    coreQuestion:
      "How can a family build a quiet bedroom air cleaner for a kid with asthma during summer wildfire smoke for under $25?",
    scientificPrinciple:
      "Taping two house furnace filters in a triangle ('V' shape) on the back of a cheap box fan doubles the airflow and traps 90% of smoke dust without overheating the motor.",
    everydayImpact:
      "Cleans a bedroom's air in 18 minutes for $22 instead of buying a $250 store air purifier.",
    bom: [
      { part: "20-Inch Square Box Fan", source: "Hall Closet / Yard Sale", costUsd: 8 },
      { part: "2 Pleated Home Furnace Filters", source: "Hardware Store", costUsd: 12 },
      { part: "Cardboard Triangles (From Moving Box)", source: "Garage Recycling", costUsd: 0 },
      { part: "Roll of Painter's Tape", source: "Tool Drawer", costUsd: 2 },
    ],
    linkedMolecule: {
      label: "See 3D Lung Airway Model",
      mode: "pdb",
      accession: "4HHB",
      litQuery: "Corsi Rosenthal box fan filtration PM2.5 wildfire smoke indoor air",
    },
  },
];

const QUICK_EXAMPLES: QuickExample[] = [
  {
    label: "TP53 · P04637 (AlphaFold)",
    mode: "alphafold",
    accession: "P04637",
    litQuery: "TP53 tumor suppressor structure mechanism",
  },
  {
    label: "Hemoglobin · 4HHB (PDB)",
    mode: "pdb",
    accession: "4HHB",
    litQuery: "human deoxyhemoglobin oxygen transport",
  },
  {
    label: "Aquaporin · 1J4N (PDB)",
    mode: "pdb",
    accession: "1J4N",
    litQuery: "aquaporin water channel structure permeation",
  },
  {
    label: "CRISPR-Cas9 · 4OO8 (PDB)",
    mode: "pdb",
    accession: "4OO8",
    litQuery: "CRISPR Cas9 guide RNA crystal structure",
  },
  {
    label: "Aspirin · CID 2244 (PubChem)",
    mode: "pubchem",
    accession: "2244",
    litQuery: "acetylsalicylic acid cyclooxygenase inhibition",
  },
];

// Canonical AlphaFold 4-band pLDDT color scale per science/SKILL.md
function plddtColor(atom: $3Dmol.AtomSpec): string {
  const score = typeof atom.b === "number" ? atom.b : 80;
  if (score > 90) return "#0053D6";
  if (score >= 70) return "#65CBF3";
  if (score >= 50) return "#FFDB13";
  return "#FF7D45";
}

export const ScienceLabView: React.FC<ScienceLabViewProps> = ({
  onDraftScienceCampaign,
}) => {
  // Primary Mode: Showcase vs Molecular Workbench
  const [workspaceMode, setWorkspaceMode] =
    useState<LabWorkspaceMode>("prize_showcase");

  // Solar Copper-Pipe Water Purifier Interactive Sandbox State
  const [mirrorAlignmentPct, setMirrorAlignmentPct] = useState<number>(92);
  const [solarIrradianceWm2, setSolarIrradianceWm2] = useState<number>(850);
  const [waterFlowMlMin, setWaterFlowMlMin] = useState<number>(110);
  const [inletTempC, setInletTempC] = useState<number>(20);

  // Student Invention Gallery State
  const [trackFilter, setTrackFilter] = useState<DiscoveryTrackFilter>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    STUDENT_INVENTIONS[0].id
  );

  // Article 10 Anonymized Student Discovery Entry Simulator State
  const [participantRole, setParticipantRole] = useState<string>(
    "Student Inventor (Grades 7–12)"
  );
  const [entryTrack, setEntryTrack] = useState<
    "Applied Discovery" | "Analytical Discovery" | "Hybrid Discovery"
  >("Applied Discovery");
  const [entryGradeBand, setEntryGradeBand] = useState<string>("Grades 9–10");
  const [entryTitle, setEntryTitle] = useState<string>(
    "Copper-Pipe & Mirror Solar Water Cleaner"
  );
  const [entryMaterials, setEntryMaterials] = useState<string>(
    "5 ft copper pipe, 12 old mirror squares, scrap plywood, clear water hose"
  );
  const [entryHypothesis, setEntryHypothesis] = useState<string>(
    "Focusing sunlight with 12 old mirror squares onto a black copper pipe heats dirty water past 149°F so it is safe for a family to drink with zero electricity."
  );
  const [entryCostUsd, setEntryCostUsd] = useState<number>(24);
  const [generatedReceipt, setGeneratedReceipt] =
    useState<BlindSubmissionReceipt | null>(null);

  // 3D Molecular Workbench State
  const [entityMode, setEntityMode] = useState<EntityMode>("alphafold");
  const [accessionInput, setAccessionInput] = useState<string>("P04637");
  const [viewerStyle, setViewerStyle] = useState<ViewerStyleMode>("cartoon");
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [darkCanvas, setDarkCanvas] = useState<boolean>(false);

  const [isLoadingEntity, setIsLoadingEntity] = useState<boolean>(false);
  const [structureMeta, setStructureMeta] = useState<StructureSummary | null>(
    null
  );
  const [compoundProps, setCompoundProps] =
    useState<CompoundProperties | null>(null);
  const [entityError, setEntityError] = useState<string | null>(null);

  const [litQuery, setLitQuery] = useState<string>(
    "TP53 tumor suppressor structure mechanism"
  );
  const [isLoadingLit, setIsLoadingLit] = useState<boolean>(false);
  const [papers, setPapers] = useState<LiteratureItem[]>([]);

  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<$3Dmol.GLViewer | null>(null);
  const loadedCifRef = useRef<{ cifText: string; mode: EntityMode } | null>(
    null
  );

  // Simple math for the Solar Copper-Pipe Water Purifier
  const solarMetrics = useMemo(() => {
    const collectorAreaM2 = 0.65;
    const opticalEfficiency = 0.72 * (mirrorAlignmentPct / 100);
    const thermalPowerWatts =
      solarIrradianceWm2 * collectorAreaM2 * opticalEfficiency;

    const massFlowGs = Math.max(0.5, waterFlowMlMin / 60);
    const deltaTC = thermalPowerWatts / (massFlowGs * 4.184);
    const outletTempC = Math.min(98, inletTempC + deltaTC);
    const outletTempF = outletTempC * 1.8 + 32;

    // Safe water target: 149°F (65°C) kills water germs
    const isPasteurized = outletTempC >= 65;

    const germStatusLabel =
      outletTempC >= 72
        ? "99.999% Germs Killed (Safe)"
        : outletTempC >= 65
        ? "99.99% Germs Killed (Safe)"
        : outletTempC >= 55
        ? "Getting Warm — Slow the Water"
        : "Too Cool — Aim the Mirrors";

    const gallonsPerAfternoon = ((waterFlowMlMin * 60 * 4) / 3785).toFixed(1);

    return {
      thermalPowerWatts: Math.round(thermalPowerWatts),
      outletTempC: outletTempC.toFixed(0),
      outletTempF: outletTempF.toFixed(0),
      isPasteurized,
      germStatusLabel,
      gallonsPerAfternoon,
    };
  }, [inletTempC, mirrorAlignmentPct, solarIrradianceWm2, waterFlowMlMin]);

  // Interactive Garage Lab #2 State: $19 Bicycle-Wheel Wind Phone & Lantern Charger
  const [windSpeedMph, setWindSpeedMph] = useState<number>(14);
  const [magnetCount, setMagnetCount] = useState<number>(8);
  const [coilGapMm, setCoilGapMm] = useState<number>(3);

  const windMetrics = useMemo(() => {
    const wheelRpm = Math.round(windSpeedMph * 14.5);
    const gapFactor = Math.max(0.25, 1.15 - coilGapMm * 0.12);
    const openVolts = Math.min(
      14.8,
      (windSpeedMph * 0.32 + magnetCount * 0.42) * gapFactor
    );
    const wattsGenerated = Math.max(
      0.5,
      Math.min(28, (Math.pow(windSpeedMph, 1.65) * magnetCount * gapFactor) / 28)
    );
    const canChargePhone = openVolts >= 5.0 && wattsGenerated >= 4.5;
    const phoneChargeHours = (12 / Math.max(1.5, wattsGenerated)).toFixed(1);

    return {
      wheelRpm,
      openVolts: openVolts.toFixed(1),
      wattsGenerated: wattsGenerated.toFixed(1),
      canChargePhone,
      phoneChargeHours,
      statusLabel:
        wattsGenerated >= 10
          ? "CHARGING PHONE + LANTERN FAST"
          : canChargePhone
          ? "CHARGING PHONE STEADILY (5V+)"
          : "SPINNING TOO SLOW — ADD MAGNETS OR MOVE COIL CLOSER",
    };
  }, [coilGapMm, magnetCount, windSpeedMph]);

  // Interactive Garage Lab #3 State: $16 Musical Soup-Can & Bike-Spoke Soil Water Checker
  const [soilMoisturePct, setSoilMoisturePct] = useState<number>(48);
  const [spokeDepthInches, setSpokeDepthInches] = useState<number>(6);
  const [soilClayLevel, setSoilClayLevel] = useState<number>(2); // 1=Sandy, 2=Backyard Loam, 3=Clay

  const soilMetrics = useMemo(() => {
    // Dry soil = higher pitch (~780 Hz), wet soil dampens & shifts resonance lower (~340 Hz)
    const soundFreqHz = Math.round(
      820 - soilMoisturePct * 4.4 - spokeDepthInches * 9 - soilClayLevel * 18
    );
    const deepRootMoisture = Math.min(
      98,
      Math.max(8, Math.round(soilMoisturePct + (spokeDepthInches - 4) * 3))
    );
    const rootsHappy = deepRootMoisture >= 40 && deepRootMoisture <= 78;
    const gallonsSavedMonth = Math.round(spokeDepthInches * 18 + 35);

    return {
      soundFreqHz,
      deepRootMoisture,
      rootsHappy,
      gallonsSavedMonth,
      adviceLabel:
        deepRootMoisture < 35
          ? "ROOTS ARE THIRSTY · TURN ON HOSE"
          : deepRootMoisture <= 78
          ? "ROOTS HAVE PLENTY OF WATER · SAVE WATER"
          : "SOIL IS SOAKED · SKIP WATERING",
    };
  }, [soilClayLevel, soilMoisturePct, spokeDepthInches]);

  // Interactive Garage Lab #4 State: $14 Keychain-Laser & Old-DVD Water Drop Microscope
  const [waterSampleType, setWaterSampleType] = useState<number>(2); // 1=Tap Water, 2=Creek Water, 3=Green Pond Drop
  const [wallDistanceInches, setWallDistanceInches] = useState<number>(24);
  const [boxSteadyPct, setBoxSteadyPct] = useState<number>(90);

  const laserMetrics = useMemo(() => {
    const zoomPower = Math.round(wallDistanceInches * 6.5);
    const specksVisible =
      waterSampleType === 1 ? 2 : waterSampleType === 2 ? 14 : 32;
    const isClearFocus = boxSteadyPct >= 70 && wallDistanceInches >= 12;

    return {
      zoomPower,
      specksVisible,
      isClearFocus,
      waterName:
        waterSampleType === 1
          ? "Clean Tap Water"
          : waterSampleType === 2
          ? "Backyard Creek Water"
          : "Pond Water (Swimming Micro-Life)",
      statusLabel: isClearFocus
        ? `SHARP ${zoomPower}x WALL PROJECTION`
        : "BLURRY — STEADY THE SHOEBOX ON BOOKS",
    };
  }, [boxSteadyPct, wallDistanceInches, waterSampleType]);

  const filteredProjects = useMemo(() => {
    if (trackFilter === "all") return STUDENT_INVENTIONS;
    return STUDENT_INVENTIONS.filter((p) => p.track === trackFilter);
  }, [trackFilter]);

  const activeProject = useMemo(
    () =>
      STUDENT_INVENTIONS.find((p) => p.id === selectedProjectId) ||
      filteredProjects[0] ||
      STUDENT_INVENTIONS[0],
    [filteredProjects, selectedProjectId]
  );

  const applyViewerStyle = useCallback(
    (
      viewer: $3Dmol.GLViewer,
      styleMode: ViewerStyleMode,
      mode: EntityMode,
      isDark: boolean,
      spin: boolean
    ) => {
      viewer.setBackgroundColor(isDark ? "#0F172A" : "#FFFFFF");
      const colorRule =
        mode === "alphafold"
          ? { colorfunc: plddtColor }
          : { color: "spectrum" };

      if (styleMode === "cartoon") {
        viewer.setStyle({}, { cartoon: colorRule });
      } else if (styleMode === "stick") {
        viewer.setStyle({}, { stick: { radius: 0.16, ...colorRule } });
      } else {
        viewer.setStyle({}, { sphere: { scale: 0.32, ...colorRule } });
      }
      viewer.spin(spin ? "y" : false, 0.6);
      viewer.render();
    },
    []
  );

  // Initialize 3Dmol WebGL viewer + ResizeObserver
  useEffect(() => {
    const el = viewerContainerRef.current;
    if (!el) return;

    const viewer = $3Dmol.createViewer(el, {
      backgroundColor: "#FFFFFF",
      antialias: true,
    });
    viewerInstanceRef.current = viewer;

    const ro = new ResizeObserver(() => {
      viewer.resize();
      viewer.render();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      viewer.clear();
      viewerInstanceRef.current = null;
    };
  }, []);

  // Ensure WebGL viewer resizes cleanly when switching to molecular_workbench tab
  useEffect(() => {
    if (workspaceMode === "molecular_workbench" && viewerInstanceRef.current) {
      const timer = setTimeout(() => {
        viewerInstanceRef.current?.resize();
        viewerInstanceRef.current?.zoomTo();
        viewerInstanceRef.current?.render();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [workspaceMode]);

  // Re-apply visual style/spin/canvas without refetching CIF
  useEffect(() => {
    if (!viewerInstanceRef.current || !loadedCifRef.current) return;
    applyViewerStyle(
      viewerInstanceRef.current,
      viewerStyle,
      loadedCifRef.current.mode,
      darkCanvas,
      isSpinning
    );
  }, [applyViewerStyle, darkCanvas, isSpinning, viewerStyle]);

  const fetchLiterature = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setIsLoadingLit(true);
    try {
      const results: LiteratureItem[] = [];

      const epmcUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(
        trimmed
      )}&format=json&pageSize=4`;
      const epmcRes = await fetch(epmcUrl);
      if (epmcRes.ok) {
        const epmcJson = (await epmcRes.json()) as {
          resultList?: {
            result?: Array<{
              id?: string;
              title?: string;
              authorString?: string;
              pubYear?: string;
              doi?: string;
              pmid?: string;
            }>;
          };
        };
        for (const r of epmcJson.resultList?.result || []) {
          results.push({
            id: `epmc-${r.id || Math.random()}`,
            title: (r.title || "Untitled Article").replace(/<[^>]+>/g, ""),
            authors: r.authorString || "Authors listed in source",
            year: r.pubYear || "n.d.",
            sourceDb: "Europe PMC",
            url: r.doi
              ? `https://doi.org/${r.doi}`
              : r.pmid
              ? `https://europepmc.org/article/MED/${r.pmid}`
              : "https://europepmc.org",
          });
        }
      }

      const arxivRes = await fetch(
        `/api/science/arxiv?query=${encodeURIComponent(
          `all:${trimmed}`
        )}&max_results=3`
      );
      if (arxivRes.ok) {
        const xmlText = await arxivRes.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const entries = Array.from(xmlDoc.querySelectorAll("entry"));
        for (const entry of entries) {
          const idUrl =
            entry.querySelector("id")?.textContent?.trim() ||
            "https://arxiv.org";
          const title = (entry.querySelector("title")?.textContent || "")
            .replace(/\s+/g, " ")
            .trim();
          const published =
            entry.querySelector("published")?.textContent?.slice(0, 4) || "";
          const authorNames = Array.from(entry.querySelectorAll("author > name"))
            .slice(0, 3)
            .map((n) => n.textContent?.trim())
            .filter(Boolean)
            .join(", ");
          if (title) {
            results.push({
              id: `arxiv-${idUrl}`,
              title,
              authors: authorNames || "arXiv Preprint Authors",
              year: published,
              sourceDb: "arXiv",
              url: idUrl,
            });
          }
        }
      }

      setPapers(results);
    } catch {
      // Keep prior papers if network error
    } finally {
      setIsLoadingLit(false);
    }
  }, []);

  const loadScientificEntity = useCallback(
    async (mode: EntityMode, rawAcc: string) => {
      const acc = rawAcc.trim();
      if (!acc) return;

      setIsLoadingEntity(true);
      setEntityError(null);

      try {
        if (mode === "alphafold") {
          setCompoundProps(null);
          const uniprotId = acc.toUpperCase();

          const afRes = await fetch(
            `https://alphafold.ebi.ac.uk/api/prediction/${encodeURIComponent(
              uniprotId
            )}`
          );
          if (!afRes.ok) {
            throw new Error(
              `AlphaFold DB could not find UniProt accession "${uniprotId}". Try P04637 (TP53) or P01308 (Insulin).`
            );
          }
          const afArr = (await afRes.json()) as Array<{
            cifUrl?: string;
            uniprotDescription?: string;
            organismScientificName?: string;
            uniprotEnd?: number;
          }>;
          const afEntry = afArr[0];
          if (!afEntry?.cifUrl) {
            throw new Error("AlphaFold prediction response lacked a cifUrl.");
          }

          let functionSummary =
            "Predicted 3D protein coordinates resolved from AlphaFold Protein Structure Database.";
          try {
            const upRes = await fetch(
              `https://rest.uniprot.org/uniprotkb/${encodeURIComponent(
                uniprotId
              )}.json`
            );
            if (upRes.ok) {
              const upJson = (await upRes.json()) as {
                comments?: Array<{
                  commentType?: string;
                  texts?: Array<{ value?: string }>;
                }>;
              };
              const fnComment = upJson.comments?.find(
                (c) => c.commentType === "FUNCTION"
              );
              if (fnComment?.texts?.[0]?.value) {
                functionSummary = fnComment.texts[0].value;
              }
            }
          } catch {
            // Non-blocking enrichment
          }

          const cifResp = await fetch(afEntry.cifUrl);
          if (!cifResp.ok) {
            throw new Error("Could not download AlphaFold mmCIF coordinates.");
          }
          const cifText = await cifResp.text();

          if (viewerInstanceRef.current) {
            viewerInstanceRef.current.clear();
            viewerInstanceRef.current.addModel(cifText, "cif");
            loadedCifRef.current = { cifText, mode: "alphafold" };
            applyViewerStyle(
              viewerInstanceRef.current,
              viewerStyle,
              "alphafold",
              darkCanvas,
              isSpinning
            );
            viewerInstanceRef.current.zoomTo();
            viewerInstanceRef.current.render();
          }

          setStructureMeta({
            title: afEntry.uniprotDescription || `UniProt ${uniprotId}`,
            accession: uniprotId,
            organismOrMethod:
              afEntry.organismScientificName || "Homo sapiens",
            description: functionSummary,
            provenanceLabel: "Predicted Structure · AlphaFold DB (pLDDT)",
            sourceUrl: `https://alphafold.ebi.ac.uk/entry/${uniprotId}`,
            sequenceLengthOrRes: afEntry.uniprotEnd
              ? `${afEntry.uniprotEnd} residues`
              : undefined,
          });
        } else if (mode === "pdb") {
          setCompoundProps(null);
          const pdbId = acc.toUpperCase();

          const metaRes = await fetch(
            `https://data.rcsb.org/rest/v1/core/entry/${encodeURIComponent(
              pdbId
            )}`
          );
          if (!metaRes.ok) {
            throw new Error(
              `RCSB PDB entry "${pdbId}" not found. Try 4HHB (Hemoglobin) or 4OO8 (CRISPR-Cas9).`
            );
          }
          const metaJson = (await metaRes.json()) as {
            struct?: { title?: string; pdbx_descriptor?: string };
            exptl?: Array<{ method?: string }>;
            rcsb_entry_info?: { resolution_combined?: number[] };
          };

          const cifRes = await fetch(
            `https://files.rcsb.org/download/${encodeURIComponent(pdbId)}.cif`
          );
          if (!cifRes.ok) {
            throw new Error(`Could not download experimental mmCIF for ${pdbId}.`);
          }
          const cifText = await cifRes.text();

          if (viewerInstanceRef.current) {
            viewerInstanceRef.current.clear();
            viewerInstanceRef.current.addModel(cifText, "cif");
            loadedCifRef.current = { cifText, mode: "pdb" };
            applyViewerStyle(
              viewerInstanceRef.current,
              viewerStyle,
              "pdb",
              darkCanvas,
              isSpinning
            );
            viewerInstanceRef.current.zoomTo();
            viewerInstanceRef.current.render();
          }

          const method =
            metaJson.exptl?.[0]?.method || "X-RAY DIFFRACTION";
          const resAngstrom =
            metaJson.rcsb_entry_info?.resolution_combined?.[0];

          setStructureMeta({
            title: metaJson.struct?.title || `PDB ${pdbId}`,
            accession: pdbId,
            organismOrMethod: method,
            description:
              metaJson.struct?.pdbx_descriptor ||
              "Experimentally determined macromolecular structure from RCSB Protein Data Bank.",
            provenanceLabel: "Experimental Structure · RCSB PDB",
            sourceUrl: `https://www.rcsb.org/structure/${pdbId}`,
            sequenceLengthOrRes: resAngstrom
              ? `${resAngstrom.toFixed(2)} Å resolution`
              : undefined,
          });
        } else {
          const cid = acc.replace(/[^0-9]/g, "") || "2244";
          const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${encodeURIComponent(
            cid
          )}/property/MolecularFormula,MolecularWeight,IUPACName,XLogP,HBondDonorCount,HBondAcceptorCount,TPSA,CanonicalSMILES/JSON`;

          const propRes = await fetch(propUrl);
          if (!propRes.ok) {
            throw new Error(
              `PubChem CID "${cid}" not found. Try 2244 (Aspirin) or 311 (Citric Acid).`
            );
          }
          const propJson = (await propRes.json()) as {
            PropertyTable?: {
              Properties?: Array<{
                CID?: number;
                IUPACName?: string;
                MolecularFormula?: string;
                MolecularWeight?: string | number;
                XLogP?: number;
                HBondDonorCount?: number;
                HBondAcceptorCount?: number;
                TPSA?: number;
                CanonicalSMILES?: string;
              }>;
            };
          };
          const p = propJson.PropertyTable?.Properties?.[0];
          if (!p) throw new Error("No properties returned from PubChem.");

          const mw = Number(p.MolecularWeight || 0);
          const xlogp = Number(p.XLogP ?? 0);
          const hbd = Number(p.HBondDonorCount ?? 0);
          const hba = Number(p.HBondAcceptorCount ?? 0);
          let violations = 0;
          if (mw > 500) violations++;
          if (xlogp > 5) violations++;
          if (hbd > 5) violations++;
          if (hba > 10) violations++;

          setCompoundProps({
            cid: String(p.CID || cid),
            iupacName: p.IUPACName || `Compound CID ${cid}`,
            molecularFormula: p.MolecularFormula || "",
            molecularWeight: String(p.MolecularWeight || ""),
            xLogP: p.XLogP !== undefined ? String(p.XLogP) : "N/A",
            hBondDonor: hbd,
            hBondAcceptor: hba,
            tpsa: p.TPSA !== undefined ? `${p.TPSA} Å²` : "N/A",
            smiles: p.CanonicalSMILES || "",
            lipinskiViolations: violations,
          });

          setStructureMeta({
            title: `PubChem CID ${cid} (${p.MolecularFormula || ""})`,
            accession: `CID ${cid}`,
            organismOrMethod: "Small Molecule · Lipinski Rule-of-Five Profile",
            description: `IUPAC: ${p.IUPACName || "Standardized small molecule"}. Evaluated for oral bioavailability teaching examples.`,
            provenanceLabel: "Curated Chemical Record · NCBI PubChem",
            sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
            sequenceLengthOrRes: `${mw.toFixed(2)} g/mol`,
          });
        }
      } catch (err) {
        setEntityError(
          err instanceof Error
            ? err.message
            : "Failed to load scientific record."
        );
      } finally {
        setIsLoadingEntity(false);
      }
    },
    [applyViewerStyle, darkCanvas, isSpinning, viewerStyle]
  );

  // Auto-load TP53 (P04637) + literature on initial mount
  useEffect(() => {
    loadScientificEntity("alphafold", "P04637");
    fetchLiterature("TP53 tumor suppressor structure mechanism");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDraftSpotlight = () => {
    if (!structureMeta) return;
    const topPaper = papers[0];
    const brief = `Create a National K–12 Discovery Prize STEM Spotlight email campaign inspired by ${structureMeta.title} (${structureMeta.accession}, ${structureMeta.provenanceLabel}).
Summary: ${structureMeta.description.slice(0, 380)}
${
  topPaper
    ? `Reference Literature Context: "${topPaper.title}" (${topPaper.sourceDb}, ${topPaper.year}).`
    : ""
}
Show grades 7–12 public school students and educators how everyday curiosity connects to real-world discovery.`;

    onDraftScienceCampaign(brief);
  };

  const handleDraftInventionSpotlight = (project: StudentInventionProject) => {
    const bomSummary = project.bom
      .map((b) => `${b.part} ($${b.costUsd})`)
      .join(", ");
    const brief = `Write a warm, plain-English National K–12 Discovery Prize newsletter sharing the student garage invention "${project.title}" (${project.gradeLevel}).
Question the student asked: ${project.coreQuestion}
How it works: ${project.scientificPrinciple}
Garage parts used ($${project.totalBomUsd} total): ${bomSummary}.
Show parents, teachers, principals, and kids how 30% of Dexpa property rent supports student inventors across America.`;
    onDraftScienceCampaign(brief);
  };

  const handleInspectLinkedMolecule = (project: StudentInventionProject) => {
    const { mode, accession, litQuery: q } = project.linkedMolecule;
    setEntityMode(mode);
    setAccessionInput(accession);
    setLitQuery(q);
    setWorkspaceMode("molecular_workbench");
    loadScientificEntity(mode, accession);
    fetchLiterature(q);
    document
      .getElementById("molecule-3d-window")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCreateBlindReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryHypothesis.trim()) return;
    const hashSuffix = Math.abs(
      Array.from(entryTitle + entryHypothesis).reduce(
        (acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0,
        7919
      )
    )
      .toString(16)
      .toUpperCase()
      .padStart(6, "0");

    setGeneratedReceipt({
      submissionCode: `TDEX-K12-${hashSuffix}`,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC",
      track: entryTrack,
      participantRole,
      gradeBand: entryGradeBand,
      projectTitle: entryTitle.trim(),
      garageMaterials: entryMaterials.trim(),
      hypothesisSummary: entryHypothesis.trim(),
      estimatedCostUsd: entryCostUsd,
    });
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* TOP BANNER — PLAIN MOM & POP ENGLISH WITH PHOTO */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-950">
          <img
            src="/assets/aistudio/header_01_national_discovery_prize_f8dc3dfc.webp"
            alt="The National K-12 Discovery Prize: Inspired by the Nobel Prize for America's public school students"
            className="w-full h-56 sm:h-72 object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent flex items-end p-6 sm:p-8">
            <div className="space-y-1.5 text-white max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#F3C969] border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Inspired by the Nobel Prize · Grades 7 to 12 Focus</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                The National K–12 Discovery Prize
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Great ideas do not come from money. They come from kids who ask questions and build real things out of what they find in the garage. Cash awards and national recognition judged 100% on the prototype itself.
              </p>
            </div>
          </div>
        </div>

        <section className="bg-[#0B1F3A] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-amber-200">
            <span className="font-bold text-white">Rule #1:</span>
            <span>&ldquo;Tired parents understand pictures, not textbooks. Don&apos;t complicate something, simplify it.&rdquo;</span>
          </div>

          {/* Quick Jump Buttons — Both Sections Always Visible */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/15 shrink-0">
            <button
              type="button"
              onClick={() => {
                setWorkspaceMode("prize_showcase");
                document
                  .getElementById("solar-water-cleaner")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 bg-[#F3C969] text-slate-950 shadow-xs hover:bg-amber-300"
            >
              <Wrench className="w-3.5 h-3.5" />
              4 Hands-On Garage Labs
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkspaceMode("molecular_workbench");
                document
                  .getElementById("molecule-3d-window")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 bg-white/10 text-white hover:bg-white/20"
            >
              <Atom className="w-3.5 h-3.5 text-[#F3C969]" />
              Interactive 3D Molecules
            </button>
          </div>
        </section>

        {/* KID INTEREST BAR — BECAUSE NOT EVERY KID LIKES THE SAME THING */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs sm:text-sm font-bold text-slate-900">
              Not Every Kid Likes the Same Thing — Pick What Grabs Your Eye First:
            </div>
            <span className="text-xs text-slate-500">
              Click any topic below to jump straight to it (or scroll down to try them all)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("molecule-3d-window")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-[#D97706] group-hover:text-[#F3C969]">
                3D Microscope
              </div>
              <div className="text-xs font-bold mt-0.5">
                Spin 3D Molecules
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("solar-water-cleaner")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-amber-700 group-hover:text-[#F3C969]">
                Sun &amp; Camping ($24)
              </div>
              <div className="text-xs font-bold mt-0.5">
                Solar Water Cleaner
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("bike-wind-charger")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-sky-700 group-hover:text-[#F3C969]">
                Bikes &amp; Gears ($19)
              </div>
              <div className="text-xs font-bold mt-0.5">
                Bike-Wheel Wind Charger
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("musical-soil-checker")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-emerald-700 group-hover:text-[#F3C969]">
                Music &amp; Plants ($16)
              </div>
              <div className="text-xs font-bold mt-0.5">
                Soup-Can Soil Singer
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("laser-dvd-microscope")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-rose-700 group-hover:text-[#F3C969]">
                Lasers &amp; Phones ($14)
              </div>
              <div className="text-xs font-bold mt-0.5">
                Laser &amp; DVD Microscope
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("twelve-starter-ideas")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-semibold text-[#0F2749] group-hover:text-[#F3C969]">
                Pets, Sports &amp; Food
              </div>
              <div className="text-xs font-bold mt-0.5">
                12 Starter Idea Cards
              </div>
            </button>
          </div>
        </section>

        {/* =====================================================================
            SECTION 1: KID GARAGE INVENTIONS & SOLAR WATER CLEANER (ALWAYS VISIBLE)
           ===================================================================== */}
        <div id="solar-water-cleaner" className="space-y-10 scroll-mt-6">
          {/* THE $24 SOLAR WATER CLEANER */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#0F2749]">
                    Featured 9th-Grade Garage Project
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Built for $24</span>
                  <span aria-hidden="true">·</span>
                  <span>Try the Sliders Below</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
                  Clean Drinking Water Using a Copper Pipe &amp; Old Mirrors
                </h2>
              </div>

              {/* 3 Easy Weather Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMirrorAlignmentPct(62);
                    setSolarIrradianceWm2(450);
                    setWaterFlowMlMin(160);
                    setInletTempC(18);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Cloudy Morning
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMirrorAlignmentPct(94);
                    setSolarIrradianceWm2(850);
                    setWaterFlowMlMin(110);
                    setInletTempC(20);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-900 shadow-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Sunny Day (Best)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMirrorAlignmentPct(100);
                    setSolarIrradianceWm2(960);
                    setWaterFlowMlMin(75);
                    setInletTempC(22);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Hot Summer Noon
                </button>
              </div>
            </div>

            {/* Two-Zone Layout: Left Picture + Right Sliders & Parts List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* LEFT 7 COLUMNS: Interactive Picture */}
              <div className="lg:col-span-7 p-6 bg-[#0F172A] text-white flex flex-col justify-between space-y-6">
                {/* Top Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-300">
                      Goal: Heat water past <strong>149°F (65°C)</strong> to kill water germs
                    </div>
                    <div className="text-sm font-bold tracking-tight text-white">
                      How the Mirrors Heat the Copper Pipe
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tabular-nums border ${
                      solarMetrics.isPasteurized
                        ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
                        : "bg-amber-950/90 border-amber-500/50 text-amber-300"
                    }`}
                  >
                    {solarMetrics.isPasteurized
                      ? `● SAFE TO DRINK · ${solarMetrics.outletTempF}°F (${solarMetrics.outletTempC}°C)`
                      : `▲ NEEDS MORE HEAT · ${solarMetrics.outletTempF}°F (${solarMetrics.outletTempC}°C)`}
                  </div>
                </div>

                {/* Simple Visual Drawing */}
                <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/90 border border-slate-800 p-4">
                  <svg
                    viewBox="0 0 680 300"
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label="Drawing showing how old mirrors bounce sunlight onto a copper water pipe"
                  >
                    <defs>
                      <linearGradient id="copperPipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0284C7" />
                        <stop
                          offset="45%"
                          stopColor={
                            solarMetrics.isPasteurized ? "#D97706" : "#0284C7"
                          }
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            solarMetrics.isPasteurized ? "#DC2626" : "#F59E0B"
                          }
                        />
                      </linearGradient>
                      <radialGradient id="focalGlow" cx="50%" cy="50%" r="50%">
                        <stop
                          offset="0%"
                          stopColor={
                            solarMetrics.isPasteurized ? "#FBBF24" : "#38BDF8"
                          }
                          stopOpacity={0.55}
                        />
                        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Background Grid */}
                    <g stroke="#1E293B" strokeWidth="1">
                      <line x1="0" y1="60" x2="680" y2="60" />
                      <line x1="0" y1="140" x2="680" y2="140" />
                      <line x1="0" y1="220" x2="680" y2="220" />
                      <line x1="170" y1="0" x2="170" y2="300" />
                      <line x1="340" y1="0" x2="340" y2="300" />
                      <line x1="510" y1="0" x2="510" y2="300" />
                    </g>

                    {/* Sunbeams */}
                    {[150, 220, 290, 390, 460, 530].map((xPos, idx) => {
                      const rayOpacity = Math.max(
                        0.2,
                        Math.min(0.95, solarIrradianceWm2 / 1000)
                      );
                      const focalX =
                        340 +
                        (100 - mirrorAlignmentPct) *
                          (idx % 2 === 0 ? 1.2 : -1.2);
                      const focalY = 128;
                      const mirrorY =
                        245 - Math.pow((xPos - 340) / 210, 2) * 70;
                      return (
                        <g key={xPos} opacity={rayOpacity}>
                          <line
                            x1={xPos}
                            y1={14}
                            x2={xPos}
                            y2={mirrorY}
                            stroke="#FDE047"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                          />
                          <line
                            x1={xPos}
                            y1={mirrorY}
                            x2={focalX}
                            y2={focalY}
                            stroke="#F59E0B"
                            strokeWidth="2.5"
                          />
                        </g>
                      );
                    })}

                    {/* Curved Plywood + 12 Mirror Squares */}
                    <path
                      d="M 115 168 Q 340 315 565 168"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 120 164 Q 340 307 560 164"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="4"
                      strokeDasharray="28 6"
                    />
                    <text
                      x="340"
                      y="272"
                      textAnchor="middle"
                      fill="#CBD5E1"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      12 Old Mirror Squares on Scrap Plywood ({mirrorAlignmentPct}% Aimed)
                    </text>

                    {/* Heat Glow on Copper Pipe */}
                    <circle
                      cx="340"
                      cy="128"
                      r={28 + (solarMetrics.thermalPowerWatts / 400) * 24}
                      fill="url(#focalGlow)"
                    />

                    {/* Cold Water Going In (Left) */}
                    <text
                      x="24"
                      y="108"
                      fill="#7DD3FC"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      COLD WATER IN
                    </text>

                    {/* Copper Pipe */}
                    <rect
                      x="60"
                      y="118"
                      width="560"
                      height="20"
                      rx="10"
                      fill="url(#copperPipeGrad)"
                      stroke="#FDE68A"
                      strokeWidth="1.5"
                    />

                    {/* Hot Spot in Middle */}
                    <circle
                      cx="340"
                      cy="128"
                      r="14"
                      fill={solarMetrics.isPasteurized ? "#DC2626" : "#0284C7"}
                      stroke="#FEF08A"
                      strokeWidth="2.5"
                    />

                    {/* Clean Hot Water Coming Out (Right) */}
                    <text
                      x="656"
                      y="108"
                      textAnchor="end"
                      fill={solarMetrics.isPasteurized ? "#6EE7B7" : "#FCD34D"}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      CLEAN WATER OUT: {solarMetrics.outletTempF}°F
                    </text>
                  </svg>
                </div>

                {/* 4 Simple Readout Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Water Temp Coming Out
                    </div>
                    <div className="text-lg font-mono font-bold text-white tabular-nums">
                      {solarMetrics.outletTempF}°F{" "}
                      <span className="text-xs font-normal text-slate-400">
                        ({solarMetrics.outletTempC}°C)
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Free Sun Heat Captured
                    </div>
                    <div className="text-lg font-mono font-bold text-amber-300 tabular-nums">
                      {solarMetrics.thermalPowerWatts} Watts
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Clean Water Made
                    </div>
                    <div className="text-lg font-mono font-bold text-sky-300 tabular-nums">
                      {solarMetrics.gallonsPerAfternoon} Gal / afternoon
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Water Safety Check
                    </div>
                    <div
                      className={`text-xs font-mono font-bold tabular-nums leading-snug ${
                        solarMetrics.isPasteurized
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {solarMetrics.germStatusLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLUMNS: 3 Easy Sliders & $24 Garage Shopping List */}
              <div className="lg:col-span-5 p-6 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0F2749]" />
                      Move the Sliders to Test It
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700">
                      100% Free Sunlight
                    </span>
                  </div>

                  {/* Slider 1: Aiming the Mirrors */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor="slider-mirror-align"
                        className="font-semibold text-slate-700 flex items-center gap-1.5"
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-600" />
                        1. How Well Are the Mirrors Aimed?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {mirrorAlignmentPct}% Aimed
                      </span>
                    </div>
                    <input
                      id="slider-mirror-align"
                      type="range"
                      min={40}
                      max={100}
                      step={2}
                      value={mirrorAlignmentPct}
                      onChange={(e) =>
                        setMirrorAlignmentPct(Number(e.target.value))
                      }
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Loose (40%)</span>
                      <span>Good (75%)</span>
                      <span>Locked On (100%)</span>
                    </div>
                  </div>

                  {/* Slider 2: How Bright Is the Sun */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor="slider-solar-wm2"
                        className="font-semibold text-slate-700 flex items-center gap-1.5"
                      >
                        <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                        2. How Bright Is the Sun Outside?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {solarIrradianceWm2 >= 800
                          ? "Bright Sun"
                          : solarIrradianceWm2 >= 550
                          ? "Partly Sunny"
                          : "Cloudy"}
                      </span>
                    </div>
                    <input
                      id="slider-solar-wm2"
                      type="range"
                      min={300}
                      max={1000}
                      step={25}
                      value={solarIrradianceWm2}
                      onChange={(e) =>
                        setSolarIrradianceWm2(Number(e.target.value))
                      }
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Cloudy Day</span>
                      <span>Nice Afternoon</span>
                      <span>Hot Noon Sun</span>
                    </div>
                  </div>

                  {/* Slider 3: How Fast Does the Water Flow */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor="slider-water-flow"
                        className="font-semibold text-slate-700 flex items-center gap-1.5"
                      >
                        <Gauge className="w-3.5 h-3.5 text-sky-700" />
                        3. How Fast Is the Water Flowing?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {waterFlowMlMin <= 90
                          ? "Slow Drip (Hotter)"
                          : waterFlowMlMin <= 150
                          ? "Steady Stream"
                          : "Fast Flow (Cooler)"}
                      </span>
                    </div>
                    <input
                      id="slider-water-flow"
                      type="range"
                      min={50}
                      max={260}
                      step={10}
                      value={waterFlowMlMin}
                      onChange={(e) =>
                        setWaterFlowMlMin(Number(e.target.value))
                      }
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Slow (Gets Hotter)</span>
                      <span>Medium Flow</span>
                      <span>Fast (Stays Cooler)</span>
                    </div>
                  </div>

                  {/* Garage Parts List */}
                  <div className="pt-4 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        What the Student Used from the Garage:
                      </span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        Total Cost: $24
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {STUDENT_INVENTIONS[0].bom.map((item) => (
                        <div
                          key={item.part}
                          className="py-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <span className="font-medium text-slate-800">
                              {item.part}
                            </span>{" "}
                            <span className="text-slate-400">·</span>{" "}
                            <span className="text-slate-500">{item.source}</span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                            ${item.costUsd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleInspectLinkedMolecule(STUDENT_INVENTIONS[0])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-[#F3C969] hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    Spin 3D Water Molecule Below
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDraftInventionSpotlight(STUDENT_INVENTIONS[0])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Share This Student Story
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 2: INTERACTIVE 3D MOLECULE WINDOW & SCIENCE LIBRARY
             ===================================================================== */}
          <div
            id="molecule-3d-window"
            className="space-y-6 pt-2 scroll-mt-6"
          >
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2749] mb-1">
                  <Atom className="w-4 h-4 text-[#D97706]" />
                  <span>Interactive 3D Molecule Window · Click &amp; Drag with Your Mouse to Spin</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  3D Microscope &amp; Science Library
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                  Grab any molecule below with your mouse or finger to turn it
                  around in 3D and zoom in—100% free for every public school
                  student, teacher, and family.
                </p>
              </div>

              {structureMeta && (
                <button
                  type="button"
                  onClick={handleDraftSpotlight}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Share {structureMeta.accession} in Email Studio
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick-Try Examples Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 mr-1">
                  Click to View in 3D:
                </span>
                {QUICK_EXAMPLES.map((ex) => {
                  const active =
                    entityMode === ex.mode &&
                    accessionInput.toUpperCase() === ex.accession.toUpperCase();
                  return (
                    <button
                      key={ex.label}
                      type="button"
                      onClick={() => {
                        setEntityMode(ex.mode);
                        setAccessionInput(ex.accession);
                        setLitQuery(ex.litQuery);
                        loadScientificEntity(ex.mode, ex.accession);
                        fetchLiterature(ex.litQuery);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? "bg-[#0F2749] text-white border-[#0F2749]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {ex.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Lookup Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadScientificEntity(entityMode, accessionInput);
                }}
                className="flex items-center gap-2"
              >
                <select
                  value={entityMode}
                  onChange={(e) => setEntityMode(e.target.value as EntityMode)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="alphafold">AlphaFold (UniProt ID)</option>
                  <option value="pdb">RCSB PDB (4-char ID)</option>
                  <option value="pubchem">PubChem (CID)</option>
                </select>
                <input
                  type="text"
                  value={accessionInput}
                  onChange={(e) => setAccessionInput(e.target.value)}
                  placeholder="e.g. P04637, 4HHB, 2244"
                  className="w-36 px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F2749]"
                />
                <button
                  type="submit"
                  disabled={isLoadingEntity}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  Load
                </button>
              </form>
            </div>

            {entityError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                {entityError}
              </div>
            )}

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT PANE: 3D Viewer */}
              <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    {entityMode === "pubchem" ? (
                      <FlaskConical className="w-4 h-4 text-[#0F2749]" />
                    ) : (
                      <Atom className="w-4 h-4 text-[#0F2749]" />
                    )}
                    <span className="font-bold text-slate-900">
                      {structureMeta?.title || "3D View"}
                    </span>
                    {structureMeta?.sequenceLengthOrRes && (
                      <>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-600 tabular-nums">
                          {structureMeta.sequenceLengthOrRes}
                        </span>
                      </>
                    )}
                  </div>

                  {entityMode !== "pubchem" && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                        {(["cartoon", "stick", "sphere"] as ViewerStyleMode[]).map(
                          (st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setViewerStyle(st)}
                              className={`px-2.5 py-1 text-xs font-medium capitalize rounded-md transition-colors cursor-pointer ${
                                viewerStyle === st
                                  ? "bg-white text-slate-900 shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSpinning((s) => !s)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          isSpinning
                            ? "border-[#0F2749] bg-slate-100 text-slate-900"
                            : "border-slate-200 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {isSpinning ? "Spin: On" : "Spin"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDarkCanvas((d) => !d)}
                        title="Toggle Light / Dark background"
                        className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <SunMoon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          viewerInstanceRef.current?.zoomTo();
                          viewerInstanceRef.current?.render();
                        }}
                        title="Center view"
                        className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 3Dmol Container */}
                <div
                  className={
                    entityMode === "pubchem" ? "hidden" : "relative w-full h-[480px]"
                  }
                >
                  {isLoadingEntity && (
                    <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center gap-2 text-xs font-medium text-slate-700">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0F2749]" />
                      Loading 3D model...
                    </div>
                  )}
                  <div
                    ref={viewerContainerRef}
                    className="relative w-full h-[480px] overflow-hidden"
                  />
                </div>

                {/* PubChem 2D View */}
                {entityMode === "pubchem" && compoundProps && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center">
                      <img
                        src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${encodeURIComponent(
                          compoundProps.cid
                        )}/PNG?image_size=400x400`}
                        alt={compoundProps.iupacName}
                        className="w-64 h-64 object-contain"
                      />
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-slate-500">Formula</div>
                        <div className="font-mono text-sm font-bold text-slate-900">
                          {compoundProps.molecularFormula}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 tabular-nums">
                        <div>
                          <div className="text-slate-500">Weight</div>
                          <div className="font-mono font-semibold text-slate-900">
                            {compoundProps.molecularWeight} g/mol
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">XLogP3</div>
                          <div className="font-mono font-semibold text-slate-900">
                            {compoundProps.xLogP}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">H-Bond Donors / Acc.</div>
                          <div className="font-mono font-semibold text-slate-900">
                            {compoundProps.hBondDonor} /{" "}
                            {compoundProps.hBondAcceptor}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Surface Area</div>
                          <div className="font-mono font-semibold text-slate-900">
                            {compoundProps.tpsa}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Legend */}
                {entityMode === "alphafold" && (
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-700">
                      3D Model Confidence Colors:
                    </span>
                    <div className="flex flex-wrap items-center gap-4 tabular-nums text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#0053D6]" />
                        Very High
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#65CBF3]" />
                        Good
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#FFDB13]" />
                        Medium
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#FF7D45]" />
                        Flexible
                      </span>
                    </div>
                  </div>
                )}
              </section>

              {/* RIGHT PANE: Description + Articles */}
              <div className="lg:col-span-5 space-y-5">
                {structureMeta && (
                  <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#A16207]">
                        {structureMeta.provenanceLabel}
                      </span>
                      <a
                        href={structureMeta.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#0F2749] hover:underline shrink-0"
                      >
                        Open Source Record
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {structureMeta.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {structureMeta.organismOrMethod}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {structureMeta.description}
                    </p>
                  </section>
                )}

                <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0F2749]" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Free Science Articles
                      </h3>
                      <p className="text-xs text-slate-500">
                        Public research papers for students and teachers
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchLiterature(litQuery);
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={litQuery}
                      onChange={(e) => setLitQuery(e.target.value)}
                      placeholder="Search science articles..."
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F2749]"
                    />
                    <button
                      type="submit"
                      disabled={isLoadingLit}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isLoadingLit ? "Searching..." : "Search"}
                    </button>
                  </form>

                  <div className="divide-y divide-slate-200 max-h-[340px] overflow-y-auto">
                    {papers.map((p) => (
                      <article
                        key={p.id}
                        className="py-3 first:pt-0 last:pb-0 space-y-1"
                      >
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-slate-900 hover:text-[#0F2749] hover:underline inline-flex items-start gap-1 leading-snug"
                        >
                          <span>{p.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 mt-0.5" />
                        </a>
                        <div className="text-[11px] text-slate-500 tabular-nums">
                          <span>{p.sourceDb}</span> · <span>{p.year}</span> ·{" "}
                          <span className="truncate">{p.authors}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* =====================================================================
              INTERACTIVE GARAGE LAB #2: FOR KIDS WHO LOVE BIKES, GEARS & FREE POWER
             ===================================================================== */}
          <section
            id="bike-wind-charger"
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#0F2749]">
                    Interactive Garage Lab #2 · For Kids Who Love Bikes &amp; Fixing Things
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Built for $19</span>
                  <span aria-hidden="true">·</span>
                  <span>Try the Sliders Below</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
                  Charge a Phone &amp; Camping Lantern with an Old Bike Wheel in the Wind
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setWindSpeedMph(7);
                    setMagnetCount(4);
                    setCoilGapMm(6);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Light Breeze
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWindSpeedMph(14);
                    setMagnetCount(8);
                    setCoilGapMm(3);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-900 shadow-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Backyard Wind (Best)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWindSpeedMph(22);
                    setMagnetCount(12);
                    setCoilGapMm(2);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Stormy Gust
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* LEFT 7 COLS: Interactive Bike-Wheel Wind Drawing */}
              <div className="lg:col-span-7 p-6 bg-[#0F172A] text-white flex flex-col justify-between space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-300">
                      Goal: Make past <strong>5.0 Volts</strong> so a USB phone charger turns on
                    </div>
                    <div className="text-sm font-bold tracking-tight text-white">
                      How Spinning Magnets Past Copper Wire Makes Free Electricity
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tabular-nums border ${
                      windMetrics.canChargePhone
                        ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
                        : "bg-amber-950/90 border-amber-500/50 text-amber-300"
                    }`}
                  >
                    {windMetrics.canChargePhone
                      ? `● ${windMetrics.openVolts}V · ${windMetrics.wattsGenerated}W CHARGING`
                      : `▲ ${windMetrics.openVolts}V · NEEDS 5.0V TO CHARGE`}
                  </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/90 border border-slate-800 p-4">
                  <svg
                    viewBox="0 0 680 280"
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label="Drawing of a bicycle wheel with plastic bucket blades and magnets spinning past a copper coil to charge a phone"
                  >
                    <g stroke="#1E293B" strokeWidth="1">
                      <line x1="0" y1="70" x2="680" y2="70" />
                      <line x1="0" y1="140" x2="680" y2="140" />
                      <line x1="0" y1="210" x2="680" y2="210" />
                    </g>

                    {/* Wind Arrows from Left */}
                    {[65, 115, 165, 215].map((yPos, i) => (
                      <g
                        key={yPos}
                        opacity={Math.min(1, 0.3 + windSpeedMph / 25)}
                      >
                        <line
                          x1={24}
                          y1={yPos}
                          x2={95 + (i % 2) * 20}
                          y2={yPos}
                          stroke="#38BDF8"
                          strokeWidth="3"
                          strokeDasharray="10 5"
                        />
                        <polygon
                          points={`${102 + (i % 2) * 20},${yPos} ${90 + (i % 2) * 20},${yPos - 5} ${90 + (i % 2) * 20},${yPos + 5}`}
                          fill="#38BDF8"
                        />
                      </g>
                    ))}
                    <text
                      x="24"
                      y="42"
                      fill="#7DD3FC"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      WIND: {windSpeedMph} MPH
                    </text>

                    {/* 20-Inch Bike Wheel */}
                    <circle
                      cx="250"
                      cy="140"
                      r="92"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="7"
                    />
                    <circle
                      cx="250"
                      cy="140"
                      r="74"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                    />

                    {/* Spokes & Plastic Bucket Blades */}
                    {Array.from({ length: magnetCount }).map((_, idx) => {
                      const angle = (idx * 360) / magnetCount;
                      const rad = (angle * Math.PI) / 180;
                      const x2 = 250 + Math.cos(rad) * 88;
                      const y2 = 140 + Math.sin(rad) * 88;
                      const mx = 250 + Math.cos(rad) * 76;
                      const my = 140 + Math.sin(rad) * 76;
                      return (
                        <g key={angle}>
                          <line
                            x1="250"
                            y1="140"
                            x2={x2}
                            y2={y2}
                            stroke="#64748B"
                            strokeWidth="2"
                          />
                          {/* Magnet on Spoke */}
                          <circle
                            cx={mx}
                            cy={my}
                            r="6.5"
                            fill="#F59E0B"
                            stroke="#FEF08A"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}
                    <circle cx="250" cy="140" r="14" fill="#E2E8F0" />

                    {/* Copper Wire Stator Coil Next to Rim */}
                    <rect
                      x={348 + coilGapMm * 2.5}
                      y="112"
                      width="38"
                      height="56"
                      rx="6"
                      fill="#B45309"
                      stroke="#FBBF24"
                      strokeWidth="2.5"
                    />
                    <text
                      x={367 + coilGapMm * 2.5}
                      y="102"
                      textAnchor="middle"
                      fill="#FCD34D"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      COPPER COIL ({coilGapMm}mm gap)
                    </text>

                    {/* Wires to Phone & Lantern */}
                    <path
                      d={`M ${386 + coilGapMm * 2.5} 132 L 500 132`}
                      stroke={windMetrics.canChargePhone ? "#34D399" : "#64748B"}
                      strokeWidth="3.5"
                    />
                    <path
                      d={`M ${386 + coilGapMm * 2.5} 148 L 500 148`}
                      stroke={windMetrics.canChargePhone ? "#FBBF24" : "#475569"}
                      strokeWidth="3.5"
                    />

                    {/* Phone & Lantern Box */}
                    <rect
                      x="500"
                      y="82"
                      width="145"
                      height="116"
                      rx="14"
                      fill="#1E293B"
                      stroke={windMetrics.canChargePhone ? "#10B981" : "#475569"}
                      strokeWidth="2.5"
                    />
                    <text
                      x="572"
                      y="114"
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      USB PHONE + LIGHT
                    </text>
                    <text
                      x="572"
                      y="142"
                      textAnchor="middle"
                      fill={windMetrics.canChargePhone ? "#6EE7B7" : "#FCD34D"}
                      fontSize="18"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {windMetrics.openVolts} VOLTS
                    </text>
                    <text
                      x="572"
                      y="168"
                      textAnchor="middle"
                      fill="#CBD5E1"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {windMetrics.wheelRpm} RPM SPIN
                    </text>
                  </svg>
                </div>

                {/* 4 Simple Readout Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Voltage Made
                    </div>
                    <div className="text-lg font-mono font-bold text-white tabular-nums">
                      {windMetrics.openVolts} V
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Free Wind Power
                    </div>
                    <div className="text-lg font-mono font-bold text-amber-300 tabular-nums">
                      {windMetrics.wattsGenerated} Watts
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Full Phone Charge
                    </div>
                    <div className="text-lg font-mono font-bold text-sky-300 tabular-nums">
                      {windMetrics.phoneChargeHours} hrs
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Charger Status
                    </div>
                    <div
                      className={`text-xs font-mono font-bold tabular-nums leading-snug ${
                        windMetrics.canChargePhone
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {windMetrics.statusLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: Sliders & $19 Parts List */}
              <div className="lg:col-span-5 p-6 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0F2749]" />
                      Test the Bike-Wheel Wind Charger
                    </h3>
                    <span className="text-xs font-semibold text-sky-700">
                      Free Wind Power
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        1. How Fast Is the Wind Blowing?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {windSpeedMph} mph
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={28}
                      step={1}
                      value={windSpeedMph}
                      onChange={(e) => setWindSpeedMph(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Gentle Breeze (5 mph)</span>
                      <span>Windy Day (15 mph)</span>
                      <span>Strong Gust (28 mph)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        2. How Many Magnets Glued to the Spokes?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {magnetCount} Magnets
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={12}
                      step={2}
                      value={magnetCount}
                      onChange={(e) => setMagnetCount(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>4 Magnets</span>
                      <span>8 Magnets</span>
                      <span>12 Magnets</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        3. How Close Is the Copper Wire Coil?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {coilGapMm} mm gap ({coilGapMm <= 3 ? "Sweet Spot" : "Too Far"})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={coilGapMm}
                      onChange={(e) => setCoilGapMm(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Super Close (1mm)</span>
                      <span>Medium (4mm)</span>
                      <span>Too Far (8mm)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        What the Student Used from the Garage:
                      </span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        Total Cost: $19
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {STUDENT_INVENTIONS[6].bom.map((item) => (
                        <div
                          key={item.part}
                          className="py-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <span className="font-medium text-slate-800">
                              {item.part}
                            </span>{" "}
                            <span className="text-slate-400">·</span>{" "}
                            <span className="text-slate-500">{item.source}</span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                            ${item.costUsd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleInspectLinkedMolecule(STUDENT_INVENTIONS[6])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-[#F3C969] hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    Spin 3D Energy Motor Above
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDraftInventionSpotlight(STUDENT_INVENTIONS[6])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Share This Student Story
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              INTERACTIVE GARAGE LAB #3: FOR KIDS WHO LOVE MUSIC, SOUND & NATURE
             ===================================================================== */}
          <section
            id="musical-soil-checker"
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#0F2749]">
                    Interactive Garage Lab #3 · For Kids Who Love Music, Sound &amp; Plants
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Built for $16</span>
                  <span aria-hidden="true">·</span>
                  <span>Try the Sliders Below</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
                  Check If Garden Plant Roots Are Thirsty Using a Musical Greeting Card &amp; Soup Can
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSoilMoisturePct(18);
                    setSpokeDepthInches(5);
                    setSoilClayLevel(1);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Dry Thirsty Dirt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSoilMoisturePct(52);
                    setSpokeDepthInches(6);
                    setSoilClayLevel(2);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-900 shadow-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Happy Garden Roots (Best)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSoilMoisturePct(88);
                    setSpokeDepthInches(8);
                    setSoilClayLevel(3);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  After Heavy Rain
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* LEFT 7 COLS: Interactive Musical Soil Drawing */}
              <div className="lg:col-span-7 p-6 bg-[#0F172A] text-white flex flex-col justify-between space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-300">
                      How it works: Dry dirt rings at a <strong>high musical pitch</strong>; wet dirt hums at a <strong>low pitch</strong>
                    </div>
                    <div className="text-sm font-bold tracking-tight text-white">
                      Soup Can &amp; 4 Bike Spokes Listening to Deep Plant Roots
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tabular-nums border ${
                      soilMetrics.rootsHappy
                        ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
                        : "bg-amber-950/90 border-amber-500/50 text-amber-300"
                    }`}
                  >
                    ♪ {soilMetrics.soundFreqHz} Hz NOTE · {soilMetrics.deepRootMoisture}% ROOT WATER
                  </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/90 border border-slate-800 p-4">
                  <svg
                    viewBox="0 0 680 280"
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label="Drawing of a tin soup can and 4 bicycle spokes pushed into garden soil humming sound waves between plant roots"
                  >
                    {/* Sky & Ground Line */}
                    <rect
                      x="0"
                      y="105"
                      width="680"
                      height="175"
                      fill={
                        soilMoisturePct >= 60
                          ? "#1E293B"
                          : soilMoisturePct >= 35
                          ? "#27272A"
                          : "#451A03"
                      }
                    />
                    <line
                      x1="0"
                      y1="105"
                      x2="680"
                      y2="105"
                      stroke="#10B981"
                      strokeWidth="3"
                    />

                    {/* Tin Soup Can on Top of Soil */}
                    <rect
                      x="275"
                      y="38"
                      width="130"
                      height="67"
                      rx="8"
                      fill="#94A3B8"
                      stroke="#F8FAFC"
                      strokeWidth="2"
                    />
                    <text
                      x="340"
                      y="68"
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      TIN SOUP CAN +
                    </text>
                    <text
                      x="340"
                      y="84"
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      $3 CARD BUZZER
                    </text>

                    {/* 4 Steel Bicycle Spokes Going Down Into Soil */}
                    {[290, 323, 357, 390].map((sx) => {
                      const depthPx = 105 + spokeDepthInches * 14;
                      return (
                        <line
                          key={sx}
                          x1={sx}
                          y1={105}
                          x2={sx}
                          y2={depthPx}
                          stroke="#E2E8F0"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      );
                    })}

                    {/* Sound Wave Ripples Underground */}
                    {[135, 165, 195].map((wy, idx) => (
                      <path
                        key={wy}
                        d={`M 290 ${wy} Q 315 ${wy - 14 + idx * 3} 340 ${wy} T 390 ${wy}`}
                        fill="none"
                        stroke={soilMetrics.rootsHappy ? "#34D399" : "#FBBF24"}
                        strokeWidth="2.5"
                      />
                    ))}

                    <text
                      x="340"
                      y="258"
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      4 Steel Bike Spokes ({spokeDepthInches} inches deep) · Musical Hum: {soilMetrics.soundFreqHz} Hz
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Musical Note Pitch
                    </div>
                    <div className="text-lg font-mono font-bold text-white tabular-nums">
                      {soilMetrics.soundFreqHz} Hz
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Deep Root Water
                    </div>
                    <div className="text-lg font-mono font-bold text-sky-300 tabular-nums">
                      {soilMetrics.deepRootMoisture}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Water Saved / Month
                    </div>
                    <div className="text-lg font-mono font-bold text-emerald-300 tabular-nums">
                      {soilMetrics.gallonsSavedMonth} Gal
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      What to Do Today
                    </div>
                    <div
                      className={`text-xs font-mono font-bold tabular-nums leading-snug ${
                        soilMetrics.rootsHappy
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {soilMetrics.adviceLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: Sliders & $16 Parts List */}
              <div className="lg:col-span-5 p-6 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0F2749]" />
                      Test the Musical Soil Checker
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700">
                      Never Rusts Out
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        1. How Wet Is the Deep Garden Dirt?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {soilMoisturePct}% Wet
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={95}
                      step={5}
                      value={soilMoisturePct}
                      onChange={(e) => setSoilMoisturePct(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Bone Dry (10%)</span>
                      <span>Just Right (50%)</span>
                      <span>Muddy (95%)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        2. How Deep Are the Bike Spokes Pushed In?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {spokeDepthInches} inches deep
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={10}
                      step={1}
                      value={spokeDepthInches}
                      onChange={(e) => setSpokeDepthInches(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Shallow (3 in)</span>
                      <span>Tomato Roots (6 in)</span>
                      <span>Deep Roots (10 in)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        3. What Kind of Dirt Is in the Yard?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {soilClayLevel === 1
                          ? "Sandy Dirt"
                          : soilClayLevel === 2
                          ? "Backyard Garden Soil"
                          : "Thick Clay Dirt"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={1}
                      value={soilClayLevel}
                      onChange={(e) => setSoilClayLevel(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Sandy</span>
                      <span>Garden Soil</span>
                      <span>Heavy Clay</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        What the Student Used from the Garage:
                      </span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        Total Cost: $16
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {STUDENT_INVENTIONS[3].bom.map((item) => (
                        <div
                          key={item.part}
                          className="py-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <span className="font-medium text-slate-800">
                              {item.part}
                            </span>{" "}
                            <span className="text-slate-400">·</span>{" "}
                            <span className="text-slate-500">{item.source}</span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                            ${item.costUsd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleInspectLinkedMolecule(STUDENT_INVENTIONS[3])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-[#F3C969] hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    Spin 3D Plant Root Model
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDraftInventionSpotlight(STUDENT_INVENTIONS[3])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Share This Student Story
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              INTERACTIVE GARAGE LAB #4: FOR KIDS WHO LOVE LASERS & CAMERAS
             ===================================================================== */}
          <section
            id="laser-dvd-microscope"
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#0F2749]">
                    Interactive Garage Lab #4 · For Kids Who Love Lasers, Cameras &amp; Hidden Worlds
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Built for $14</span>
                  <span aria-hidden="true">·</span>
                  <span>Try the Sliders Below</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
                  See Tiny Pond Life 150x Bigger Using a $5 Laser Pointer, a Shoebox &amp; an Old DVD
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setWaterSampleType(1);
                    setWallDistanceInches(18);
                    setBoxSteadyPct(92);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Kitchen Tap Water
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWaterSampleType(2);
                    setWallDistanceInches(24);
                    setBoxSteadyPct(92);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-900 shadow-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Creek Water
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWaterSampleType(3);
                    setWallDistanceInches(34);
                    setBoxSteadyPct(96);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Pond Drop (150x Zoom!)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* LEFT 7 COLS: Laser & DVD Projection Drawing */}
              <div className="lg:col-span-7 p-6 bg-[#0F172A] text-white flex flex-col justify-between space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-300">
                      How it works: A hanging drop of water acts like a <strong>magnifying glass lens</strong> for the laser beam
                    </div>
                    <div className="text-sm font-bold tracking-tight text-white">
                      Inside the Black Shoebox Water-Drop Projector
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tabular-nums border ${
                      laserMetrics.isClearFocus
                        ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
                        : "bg-amber-950/90 border-amber-500/50 text-amber-300"
                    }`}
                  >
                    ● {laserMetrics.zoomPower}x ZOOM · {laserMetrics.specksVisible} TINY SPECKS SEEN
                  </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/90 border border-slate-800 p-4">
                  <svg
                    viewBox="0 0 680 280"
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label="Drawing showing a laser pointer shining through a hanging drop of water and an old DVD onto a wall circle"
                  >
                    {/* Laser Pointer on Left */}
                    <rect
                      x="30"
                      y="124"
                      width="95"
                      height="32"
                      rx="8"
                      fill="#334155"
                      stroke="#94A3B8"
                      strokeWidth="2"
                    />
                    <text
                      x="77"
                      y="144"
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      $5 LASER
                    </text>

                    {/* Laser Beam to Water Drop */}
                    <line
                      x1="125"
                      y1="140"
                      x2="255"
                      y2="140"
                      stroke="#EF4444"
                      strokeWidth="4"
                    />

                    {/* Hanging Water Drop + DVD Piece */}
                    <circle
                      cx="265"
                      cy="140"
                      r="16"
                      fill="#38BDF8"
                      fillOpacity="0.45"
                      stroke="#7DD3FC"
                      strokeWidth="2.5"
                    />
                    <text
                      x="265"
                      y="182"
                      textAnchor="middle"
                      fill="#7DD3FC"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      WATER DROP + DVD
                    </text>

                    {/* Expanding Laser Cone to Wall Projection */}
                    <polygon
                      points="280,140 495,55 495,225"
                      fill="#EF4444"
                      fillOpacity="0.16"
                      stroke="#F87171"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />

                    {/* Giant Magnified Wall Circle */}
                    <circle
                      cx="545"
                      cy="140"
                      r={55 + wallDistanceInches * 0.8}
                      fill="#450A0A"
                      stroke="#F87171"
                      strokeWidth="3"
                    />
                    {Array.from({ length: Math.min(18, laserMetrics.specksVisible) }).map(
                      (_, idx) => {
                        const angle = idx * 137.5;
                        const dist = ((idx * 11) % 45) + 6;
                        const sx = 545 + Math.cos(angle) * dist;
                        const sy = 140 + Math.sin(angle) * dist;
                        return (
                          <circle
                            key={idx}
                            cx={sx}
                            cy={sy}
                            r={idx % 3 === 0 ? 4.5 : 2.8}
                            fill="#FCA5A5"
                          />
                        );
                      }
                    )}
                    <text
                      x="545"
                      y="248"
                      textAnchor="middle"
                      fill="#FCA5A5"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      WALL SCREEN: {laserMetrics.zoomPower}x MAGNIFIED
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Magnifying Power
                    </div>
                    <div className="text-lg font-mono font-bold text-white tabular-nums">
                      {laserMetrics.zoomPower}x Bigger
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Tiny Specks Seen
                    </div>
                    <div className="text-lg font-mono font-bold text-rose-300 tabular-nums">
                      {laserMetrics.specksVisible} per drop
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Water Drop Tested
                    </div>
                    <div className="text-xs font-mono font-bold text-sky-300 tabular-nums leading-snug">
                      {laserMetrics.waterName}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400">
                      Picture Focus
                    </div>
                    <div
                      className={`text-xs font-mono font-bold tabular-nums leading-snug ${
                        laserMetrics.isClearFocus
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {laserMetrics.statusLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: Sliders & $14 Parts List */}
              <div className="lg:col-span-5 p-6 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0F2749]" />
                      Test the Laser &amp; DVD Microscope
                    </h3>
                    <span className="text-xs font-semibold text-rose-700">
                      Replaces a $1,200 Lab Tool
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        1. What Water Drop Is Hanging on the Toothpick?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {laserMetrics.waterName}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={1}
                      value={waterSampleType}
                      onChange={(e) => setWaterSampleType(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Tap Water</span>
                      <span>Creek Water</span>
                      <span>Pond Drop</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        2. How Far Away Is the Wall? (Further = Bigger Zoom)
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {wallDistanceInches} inches ({laserMetrics.zoomPower}x Zoom)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={40}
                      step={2}
                      value={wallDistanceInches}
                      onChange={(e) => setWallDistanceInches(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Close (10 in)</span>
                      <span>Medium (24 in)</span>
                      <span>Far Wall (40 in)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        3. How Steady Is the Shoebox?
                      </label>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {boxSteadyPct}% Steady
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      step={5}
                      value={boxSteadyPct}
                      onChange={(e) => setBoxSteadyPct(Number(e.target.value))}
                      className="w-full accent-[#0F2749] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Held by Hand (Shaky)</span>
                      <span>On Table</span>
                      <span>Propped on Books (Steady)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        What the Student Used from the Garage:
                      </span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        Total Cost: $14
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {STUDENT_INVENTIONS[2].bom.map((item) => (
                        <div
                          key={item.part}
                          className="py-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <span className="font-medium text-slate-800">
                              {item.part}
                            </span>{" "}
                            <span className="text-slate-400">·</span>{" "}
                            <span className="text-slate-500">{item.source}</span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                            ${item.costUsd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleInspectLinkedMolecule(STUDENT_INVENTIONS[2])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-[#F3C969] hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Atom className="w-3.5 h-3.5" />
                    Spin 3D Light Sensor Model
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDraftInventionSpotlight(STUDENT_INVENTIONS[2])
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Share This Student Story
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: 12 STARTER GARAGE IDEAS FOR EVERY KIND OF KID */}
          <section id="twelve-starter-ideas" className="space-y-5 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#0F2749]">
                    Starter Idea Book · Because Not All Kids Like the Same Thing
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>All 12 Built Under $25</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
                  12 Starter Ideas for Kids Who Love Animals, Sports, Bikes, Music, Food, or Nature
                </h2>
              </div>

              {/* Track Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
                {(
                  [
                    "all",
                    "Applied Discovery",
                    "Analytical Discovery",
                    "Hybrid Discovery",
                  ] as DiscoveryTrackFilter[]
                ).map((track) => {
                  const active = trackFilter === track;
                  const friendlyLabel =
                    track === "all"
                      ? "All 12 Starter Ideas"
                      : track === "Applied Discovery"
                      ? "Hands-On Builds (Applied)"
                      : track === "Analytical Discovery"
                      ? "Smart Figuring (Analytical)"
                      : "Mix of Both (Hybrid)";
                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setTrackFilter(track)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? "bg-[#0F2749] text-white shadow-xs"
                          : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      {friendlyLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Cards + Simple Parts List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Cols: Clickable Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProjects.map((project) => {
                  const isSelected = project.id === activeProject.id;
                  return (
                    <article
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-md"
                          : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-2">
                        <div
                          className={`flex items-center justify-between gap-2 text-xs ${
                            isSelected ? "text-[#F3C969]" : "text-slate-500"
                          }`}
                        >
                          <span className="font-semibold">{project.track}</span>
                          <span className="font-mono font-bold tabular-nums">
                            Cost: ${project.totalBomUsd}
                          </span>
                        </div>

                        <h3 className="text-base font-bold leading-snug">
                          {project.title}
                        </h3>

                        <p
                          className={`text-xs leading-relaxed ${
                            isSelected ? "text-slate-200" : "text-slate-600"
                          }`}
                        >
                          {project.coreQuestion}
                        </p>
                      </div>

                      <div
                        className={`pt-3 border-t flex items-center justify-between gap-2 text-xs ${
                          isSelected
                            ? "border-white/15 text-slate-300"
                            : "border-slate-100 text-slate-500"
                        }`}
                      >
                        <span>{project.gradeLevel}</span>
                        <span className="font-semibold inline-flex items-center gap-1">
                          See Parts List
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Right 5 Cols: Plain-English Details of Selected Card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="space-y-1.5 border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#0F2749]">
                      {activeProject.track}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeProject.gradeLevel}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {activeProject.title}
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <div className="font-bold text-slate-900 mb-0.5">
                      How It Works in Plain English:
                    </div>
                    <p className="text-slate-600">
                      {activeProject.scientificPrinciple}
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 mb-0.5">
                      How It Helps People:
                    </div>
                    <p className="text-slate-600">
                      {activeProject.everydayImpact}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      Garage &amp; Household Parts Used:
                    </span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      Total Cost: ${activeProject.totalBomUsd}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {activeProject.bom.map((item) => (
                      <div
                        key={item.part}
                        className="py-1.5 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-medium text-slate-800">
                            {item.part}
                          </span>{" "}
                          <span className="text-slate-400">·</span>{" "}
                          <span className="text-slate-500">{item.source}</span>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                          ${item.costUsd}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleInspectLinkedMolecule(activeProject)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Atom className="w-3.5 h-3.5 text-[#F3C969]" />
                    {activeProject.linkedMolecule.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDraftInventionSpotlight(activeProject)}
                    className="px-3.5 py-2.5 text-xs font-semibold text-[#0F2749] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center gap-1"
                  >
                    Share Story
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: FAIR BLIND JUDGING — HOW KIDS ENTER */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Cols: Simple Form */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#0F2749]">
                      100% Fair Judging (Article 10)
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Students · Teachers · Principals · Parents</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    See How We Hide Names So Every Kid Gets a Fair Shot
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    When a student enters an idea, our system hides their name,
                    their school name, and their zip code. Judges only see the
                    idea itself—so money or connections can never buy a win.
                  </p>
                </div>

                {/* UPGRADE 3: ONE-CLICK BLIND ENTRY TEST DRIVE */}
                <div className="p-4 rounded-xl bg-[#0B1F3A] text-white space-y-3 border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F3C969]">
                      One-Click Test Drive — Click Any Kid Project to Simulate Blind Judging:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const samples = [
                          {
                            role: "Student Inventor (Grades 7–12)",
                            track: "Applied Discovery" as const,
                            grade: "Grades 9–10",
                            cost: 24,
                            title: "Copper-Pipe & Broken-Mirror Solar Water Cleaner",
                            parts: "5ft copper pipe, 12 broken mirror squares, scrap plywood, black grill paint",
                            problem: "Heats dirty well water past 149°F (65°C) using free sunlight to kill 99.99% of water germs.",
                          },
                          {
                            role: "Student Inventor (Grades 7–12)",
                            track: "Hybrid Discovery" as const,
                            grade: "Grades 7–8",
                            cost: 16,
                            title: "Soup-Can & Bike-Spoke Musical Soil Checker",
                            parts: "Empty tin soup can, $3 greeting-card buzzer, 4 steel bicycle spokes",
                            problem: "Hums a musical note through deep garden dirt so families know if plant roots need water.",
                          },
                          {
                            role: "Public School Teacher",
                            track: "Hybrid Discovery" as const,
                            grade: "Grades 11–12",
                            cost: 14,
                            title: "Cat-Laser & Scratched-DVD Creek Water Tester",
                            parts: "$5 red laser pointer, old blank DVD, black shoebox, glass spice jar",
                            problem: "Replaces a $1,200 lab water tester for $14 so any public school class can check local creek water.",
                          },
                        ];
                        const pick =
                          samples[Math.floor(Math.random() * samples.length)];
                        const randHex = Math.floor(
                          100000 + Math.random() * 900000
                        )
                          .toString(16)
                          .toUpperCase()
                          .slice(0, 4);
                        const randHex2 = Math.floor(
                          100000 + Math.random() * 900000
                        )
                          .toString(16)
                          .toUpperCase()
                          .slice(0, 4);
                        setParticipantRole(pick.role);
                        setEntryTrack(pick.track);
                        setEntryGradeBand(pick.grade);
                        setEntryCostUsd(pick.cost);
                        setEntryTitle(pick.title);
                        setEntryMaterials(pick.parts);
                        setEntryHypothesis(pick.problem);
                        setGeneratedReceipt({
                          submissionCode: `TDEX-${randHex}-${randHex2}`,
                          timestamp:
                            new Date()
                              .toISOString()
                              .slice(0, 19)
                              .replace("T", " ") + " UTC",
                          track: pick.track,
                          participantRole: pick.role,
                          gradeBand: pick.grade,
                          projectTitle: pick.title,
                          garageMaterials: pick.parts,
                          hypothesisSummary: pick.problem,
                          estimatedCostUsd: pick.cost,
                        });
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Generate Test Code &amp; Simulate Blind Judging
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Watch the Blind Judging Card on the right strip out the student&apos;s name, school, and zip code and assign a fresh <code className="text-[#F3C969]">TDEX-XXXX-XXXX</code> code!
                  </p>
                </div>

                <form onSubmit={handleCreateBlindReceipt} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Who Are You?
                      </label>
                      <select
                        value={participantRole}
                        onChange={(e) => setParticipantRole(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                      >
                        <option value="Student Inventor (Grades 7–12)">
                          Student (Grades 7–12)
                        </option>
                        <option value="Public School Teacher">
                          Public School Teacher
                        </option>
                        <option value="School Principal">
                          School Principal
                        </option>
                        <option value="Parent / Family Owner">
                          Parent / Family Owner
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Type of Project
                      </label>
                      <select
                        value={entryTrack}
                        onChange={(e) =>
                          setEntryTrack(
                            e.target.value as
                              | "Applied Discovery"
                              | "Analytical Discovery"
                              | "Hybrid Discovery"
                          )
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                      >
                        <option value="Applied Discovery">
                          Hands-On Build (Applied)
                        </option>
                        <option value="Analytical Discovery">
                          Smart Figuring (Analytical)
                        </option>
                        <option value="Hybrid Discovery">
                          Mix of Both (Hybrid)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Grade &amp; Cost ($)
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={entryGradeBand}
                          onChange={(e) => setEntryGradeBand(e.target.value)}
                          className="flex-1 px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                        >
                          <option value="Grades 7–8">Grades 7–8</option>
                          <option value="Grades 9–10">Grades 9–10</option>
                          <option value="Grades 11–12">Grades 11–12</option>
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={500}
                          value={entryCostUsd}
                          onChange={(e) =>
                            setEntryCostUsd(Number(e.target.value))
                          }
                          aria-label="Parts cost in dollars"
                          className="w-20 px-2.5 py-2 text-xs font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Name of the Invention
                      </label>
                      <input
                        type="text"
                        required
                        value={entryTitle}
                        onChange={(e) => setEntryTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        What Garage Parts Were Used?
                      </label>
                      <input
                        type="text"
                        required
                        value={entryMaterials}
                        onChange={(e) => setEntryMaterials(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      What Problem Does It Solve?
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={entryHypothesis}
                      onChange={(e) => setEntryHypothesis(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0F2749]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F3C969]" />
                    Preview What the Judges See
                  </button>
                </form>
              </div>

              {/* Right 5 Cols: What the Judges Actually See */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Blind Judging Card</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {generatedReceipt
                      ? generatedReceipt.submissionCode
                      : "TDEX-K12-PREVIEW"}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Student &amp; School Name:</span>
                    <span className="font-mono font-semibold text-emerald-700">
                      HIDDEN FOR FAIRNESS
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Submitted By:</span>
                    <span className="font-medium text-slate-900">
                      {generatedReceipt
                        ? generatedReceipt.participantRole
                        : participantRole}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Category &amp; Grade:</span>
                    <span className="font-medium text-slate-900">
                      {generatedReceipt ? generatedReceipt.track : entryTrack} ·{" "}
                      {generatedReceipt
                        ? generatedReceipt.gradeBand
                        : entryGradeBand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Total Garage Cost:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      $
                      {generatedReceipt
                        ? generatedReceipt.estimatedCostUsd
                        : entryCostUsd}
                      .00
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900">
                    {generatedReceipt
                      ? generatedReceipt.projectTitle
                      : entryTitle}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {generatedReceipt
                      ? generatedReceipt.hypothesisSummary
                      : entryHypothesis}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <strong className="text-slate-700">Parts Used:</strong>{" "}
                    {generatedReceipt
                      ? generatedReceipt.garageMaterials
                      : entryMaterials}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Safety Note: This is a practice preview. We never collect
                  private kid information on this screen.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
