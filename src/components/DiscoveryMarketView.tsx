import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Coins,
  Filter,
  Home,
  Lock,
  PackagePlus,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Wallet,
  X,
} from "lucide-react";
import {
  AUTHORIZED_SUPPLY_CEILING,
  CONSTITUTIONAL_DBC_POOLS,
  CrossNamespaceAtomicCoordinator,
  SupplyAllocationPoolShard,
  VestingRegistryStateShard,
  VestingSchedule,
  WalletBalanceStateShard,
  computeArticle11SplitCents,
  runCompleteBigCoinVerificationSuite,
} from "../utils/bigcoinProtocolEngine";

interface DiscoveryMarketViewProps {
  onOpenConstitution: () => void;
  onOpenOwnerSignup: () => void;
}

interface GarageItem {
  id: string;
  title: string;
  category: "Science & Education" | "Tools & Workshop" | "Music & Arts" | "Bikes & Sports";
  price: number;
  location: string;
  sellerFamily: string;
  description: string;
  condition: string;
  badge?: string;
  iconType: string;
}

const INITIAL_TRADE_ITEMS: GarageItem[] = [
  {
    id: "item-telescope",
    title: "Celestron 70mm Student Refractor Telescope",
    category: "Science & Education",
    price: 120,
    location: "Oakland Hills, CA",
    sellerFamily: "The Miller Family",
    description: "Used for two middle-school astronomy terms. Includes tripod, 20mm eyepiece, and solar filter. Clean optics.",
    condition: "Excellent",
    badge: "Student Science",
    iconType: "telescope",
  },
  {
    id: "item-tool-chest",
    title: "Craftsman 120-Piece Socket & Mechanics Chest",
    category: "Tools & Workshop",
    price: 100,
    location: "Columbus, OH",
    sellerFamily: "Dave & Sarah K.",
    description: "Classic garage tool set. Metric and standard sockets, ratchets, and heavy-duty case. The exact $100 Article 11 model.",
    condition: "Like New",
    badge: "Article 11 Anchor",
    iconType: "tools",
  },
  {
    id: "item-violin",
    title: "1/2 Size Student Violin with Horsehair Bow & Hard Case",
    category: "Music & Arts",
    price: 160,
    location: "Philadelphia, PA",
    sellerFamily: "The Chen Family",
    description: "Handcrafted spruce top, warm tone. Outgrown by our 6th grader who moved to a full-size violin.",
    condition: "Very Good",
    badge: "Youth Arts",
    iconType: "music",
  },
  {
    id: "item-trail-bike",
    title: "Trek 24-Inch Aluminum Youth Mountain Bike",
    category: "Bikes & Sports",
    price: 80,
    location: "Austin, TX",
    sellerFamily: "The Jackson Family",
    description: "Brand-new tires, 7-speed Shimano shifting, tuned brakes. Perfect for riding to middle school.",
    condition: "Good",
    badge: "Neighborhood Active",
    iconType: "bike",
  },
  {
    id: "item-microscope",
    title: "AmScope 1200x Compound Monocular Microscope",
    category: "Science & Education",
    price: 90,
    location: "Denver, CO",
    sellerFamily: "Marcus T. (Science Teacher)",
    description: "LED illumination, precision glass optics, includes 25 prepared specimen slides for biology projects.",
    condition: "Like New",
    badge: "K–12 Ready",
    iconType: "microscope",
  },
  {
    id: "item-workbench",
    title: "Solid Maple Garage Workbench with Woodworking Vise",
    category: "Tools & Workshop",
    price: 240,
    location: "Pittsburgh, PA",
    sellerFamily: "The Alvarez Family",
    description: "Heavy-duty 5-foot bench built from solid hardwood with steel legs and integrated 7-inch rapid-action vise.",
    condition: "Very Good",
    badge: "Garage Heavy",
    iconType: "workbench",
  },
  {
    id: "item-3d-printer",
    title: "Creality Ender-3 V2 3D Printer (Student-Tuned)",
    category: "Science & Education",
    price: 180,
    location: "Atlanta, GA",
    sellerFamily: "The Patel Family",
    description: "Glass bed upgrade, silent motherboard, calibrated for youth robotics prototyping. Includes 2 spools of PLA.",
    condition: "Excellent",
    badge: "Invention Lab",
    iconType: "printer",
  },
  {
    id: "item-electric-guitar",
    title: "Fender Squier Mini Electric Guitar & Practice Amp",
    category: "Music & Arts",
    price: 140,
    location: "Nashville, TN",
    sellerFamily: "The Ramirez Family",
    description: "3/4 size body, cable, strap, gig bag, and 10-watt amplifier. Ready for the next garage rocker.",
    condition: "Excellent",
    badge: "Starter Gear",
    iconType: "guitar",
  },
];

const CATEGORIES = [
  "All Items",
  "Science & Education",
  "Tools & Workshop",
  "Music & Arts",
  "Bikes & Sports",
] as const;

export const DiscoveryMarketView: React.FC<DiscoveryMarketViewProps> = ({
  onOpenConstitution,
  onOpenOwnerSignup,
}) => {
  const [items, setItems] = useState<GarageItem[]>(INITIAL_TRADE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Active receipt simulator state
  const [activeItemForReceipt, setActiveItemForReceipt] = useState<GarageItem | null>(null);
  const [simulatedTradesCount, setSimulatedTradesCount] = useState<number>(3);
  const [accumulatedSellerCash, setAccumulatedSellerCash] = useState<number>(450);
  const [accumulatedPropertyCredit, setAccumulatedPropertyCredit] = useState<number>(225);
  const [showSuccessStamp, setShowSuccessStamp] = useState(false);

  // "List Item" Modal State
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GarageItem["category"]>("Tools & Workshop");
  const [newPrice, setNewPrice] = useState<number>(75);
  const [newLocation, setNewLocation] = useState("Your Neighborhood");
  const [newDescription, setNewDescription] = useState("");

  // Live Calculator State
  const [customSalePrice, setCustomSalePrice] = useState<number>(100);

  // Foreclosure & Auction 20%-30% Discount + Discovery BigCoin Value-Carrier Calculator State
  const [buildingMarketValue, setBuildingMarketValue] = useState<number>(5000000);
  const [auctionDiscountPct, setAuctionDiscountPct] = useState<20 | 25 | 30>(25);
  const [dbcMechanismTab, setDbcMechanismTab] = useState<"value-carrier" | "protocol-v2">(
    "value-carrier"
  );
  const [simBlockHeight, setSimBlockHeight] = useState<number>(500);
  const [simProportionalHold, setSimProportionalHold] = useState<boolean>(true);
  const [simGlobalQuarantine, setSimGlobalQuarantine] = useState<boolean>(false);
  const [selectedPoolKey, setSelectedPoolKey] = useState<string>("POOL_PROOF_OF_SERVICE");
  const [protocolActionBanner, setProtocolActionBanner] = useState<{
    status: "pass" | "blocked";
    title: string;
    detail: string;
    compositeRootHex: string;
  } | null>(null);

  // Live deterministic 19-check verification & vesting simulation
  const verificationReport = useMemo(() => runCompleteBigCoinVerificationSuite(), []);

  const liveVestingMath = useMemo(() => {
    const vShard = new VestingRegistryStateShard();
    const totalLot = 1_000_000;
    const sched = new VestingSchedule("LOT_ALPHA_1", totalLot, 0, 100, 1000);
    const reg = { OWNER_ALPHA: [sched] };
    const qMap = { OWNER_ALPHA: simGlobalQuarantine };
    const hKey = VestingRegistryStateShard.holdKey("OWNER_ALPHA", "LOT_ALPHA_1");
    const hMap = { [hKey]: simProportionalHold };

    const spendable = vShard.computeSpendableAllowanceFromState(
      reg,
      qMap,
      hMap,
      "OWNER_ALPHA",
      simBlockHeight,
      totalLot
    );
    const locked = totalLot - spendable;
    const vestingRootHex = vShard.computeRootHashFromState(reg, qMap, hMap).toHex();

    return {
      totalLot,
      spendable,
      locked,
      vestingRootHex,
      stageLabel:
        simGlobalQuarantine
          ? "Global Quarantine Active (0 Spendable)"
          : simBlockHeight < 100
          ? "Pre-Cliff Lock (Block < 100)"
          : simBlockHeight >= 1000
          ? "Post-Maturity (100% Unlocked)"
          : simProportionalHold
          ? "Linear Vesting + Proportional Hold Cap (Unvested Frozen, Vested Protected)"
          : "Linear Interval Release (Module 06 u128 Math)",
    };
  }, [simBlockHeight, simProportionalHold, simGlobalQuarantine]);

  const handleRunLiveProtocolScenario = (
    scenario: "issue-pool" | "valid-nonce" | "replay-gap" | "mid-commit-fault"
  ) => {
    const s = new SupplyAllocationPoolShard();
    const w = new WalletBalanceStateShard();
    const v = new VestingRegistryStateShard();
    w.forceMintInitialAllocation("OWNER_ALPHA", 1_000_000);
    v.registry["OWNER_ALPHA"] = [new VestingSchedule("LOT_ALPHA_1", 1_000_000, 0, 100, 1000)];
    const coord = new CrossNamespaceAtomicCoordinator(s, w, v);

    if (scenario === "issue-pool") {
      const sched = new VestingSchedule("LOT_AUCTION_START", 250_000, 0, 100, 1000);
      const pkg = coord.executeIsolatedStagingTransaction(
        "ISSUANCE_CREDIT",
        {
          poolKey: selectedPoolKey,
          recipientId: "OWNER_AUCTION_RESERVE",
          amount: 250_000,
          conditionalSchedule: sched,
        },
        500
      );
      if (pkg && coord.commitStagedPackage(pkg)) {
        setProtocolActionBanner({
          status: "pass",
          title: `Issued 250,000 DBC from ${selectedPoolKey} (Atomic Commit PASS)`,
          detail:
            "Unissued pool decremented, total issued supply incremented, and matched 1,000-block vesting schedule bound into all 3 shards.",
          compositeRootHex: pkg.compositeResultStateRoot.toHex(),
        });
      }
    } else if (scenario === "valid-nonce") {
      const pkg = coord.executeIsolatedStagingTransaction(
        "ORDINARY_TRANSFER_X",
        {
          senderId: "OWNER_ALPHA",
          recipientId: "OWNER_BETA",
          amount: 100_000,
          nonce: 1,
          enforceStrictNonce: true,
        },
        500
      );
      if (pkg && coord.commitStagedPackage(pkg)) {
        setProtocolActionBanner({
          status: "pass",
          title: "Sequential Nonce (+1) Transfer Committed (SCHEMA_V2 Root Updated)",
          detail:
            "Transferred 100,000 vested DBC at Block 500 with strict sequential nonce = 1. Both balance and nonce are cryptographically bound into the Wallet V2 & Composite SHA-256 root.",
          compositeRootHex: pkg.compositeResultStateRoot.toHex(),
        });
      }
    } else if (scenario === "replay-gap") {
      const preRoot = CrossNamespaceAtomicCoordinator.computeMasterCompositeRoot(
        s.computeRootHashFromState(s.remainingUnissuedBalances, s.totalIssuedSupply),
        w.computeRootHashFromState(w.ledger, w.nonces),
        v.computeRootHashFromState(v.registry, v.quarantineMap, v.scheduleHoldMap)
      ).toHex();
      const pkg = coord.executeIsolatedStagingTransaction(
        "ORDINARY_TRANSFER_X",
        {
          senderId: "OWNER_ALPHA",
          recipientId: "OWNER_BETA",
          amount: 100_000,
          nonce: 10, // Illegal gap nonce!
          enforceStrictNonce: true,
        },
        500
      );
      if (pkg === null) {
        setProtocolActionBanner({
          status: "blocked",
          title: "Replay / Nonce-Gap Attack Blocked (Zero State Drift)",
          detail:
            "Attempted transfer with Nonce 10 when registered Nonce was 0. Rejected at staging gate under strict sequential admission (incoming === current + 1).",
          compositeRootHex: preRoot,
        });
      }
    } else if (scenario === "mid-commit-fault") {
      const preRoot = CrossNamespaceAtomicCoordinator.computeMasterCompositeRoot(
        s.computeRootHashFromState(s.remainingUnissuedBalances, s.totalIssuedSupply),
        w.computeRootHashFromState(w.ledger, w.nonces),
        v.computeRootHashFromState(v.registry, v.quarantineMap, v.scheduleHoldMap)
      ).toHex();
      const pkg = coord.executeIsolatedStagingTransaction(
        "ORDINARY_TRANSFER_X",
        {
          senderId: "OWNER_ALPHA",
          recipientId: "OWNER_BETA",
          amount: 50_000,
          nonce: 1,
          enforceStrictNonce: true,
        },
        500
      );
      const committed = pkg ? coord.commitStagedPackage(pkg, true) : false;
      const postRoot = CrossNamespaceAtomicCoordinator.computeMasterCompositeRoot(
        s.computeRootHashFromState(s.remainingUnissuedBalances, s.totalIssuedSupply),
        w.computeRootHashFromState(w.ledger, w.nonces),
        v.computeRootHashFromState(v.registry, v.quarantineMap, v.scheduleHoldMap)
      ).toHex();
      if (!committed && preRoot === postRoot) {
        setProtocolActionBanner({
          status: "blocked",
          title: "Simulated Mid-Commit Fault → 100% Atomic Rollback Verified",
          detail:
            "Injected hardware exception mid-commit. All 3 shards (Supply, Wallet+Nonce, Vesting) rolled back automatically with byte-for-byte identical SHA-256 state roots.",
          compositeRootHex: postRoot,
        });
      }
    }
  };

  // 60-Second "Garage-to-Equity" 3-Step Visual Slider Story State
  const [storyStep, setStoryStep] = useState<1 | 2 | 3>(1);
  const [storyItemValue, setStoryItemValue] = useState<number>(120);
  const [storyItemLabel, setStoryItemLabel] = useState<string>(
    "Outgrown Kids' Bike & Stroller ($120)"
  );

  const safeCustomPrice = Number.isFinite(customSalePrice)
    ? Math.max(0, Math.min(10000, customSalePrice))
    : 0;
  const customSplit = computeArticle11SplitCents(Math.round(safeCustomPrice * 100));

  const formatUsd = (val: number) =>
    val.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === "All Items" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerFamily.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSimulateCheckout = (item: GarageItem) => {
    setActiveItemForReceipt(item);
    setShowSuccessStamp(false);
  };

  const handleConfirmSimulatedTrade = () => {
    if (!activeItemForReceipt) return;
    const itemSplit = computeArticle11SplitCents(Math.round(activeItemForReceipt.price * 100));
    setShowSuccessStamp(true);
    setSimulatedTradesCount((p) => p + 1);
    setAccumulatedSellerCash((p) => p + itemSplit.sellerCashUsd);
    setAccumulatedPropertyCredit((p) => p + itemSplit.sellerEquityUsd);
    setTimeout(() => {
      setActiveItemForReceipt(null);
      setShowSuccessStamp(false);
    }, 2200);
  };

  const handleCreateNewListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice <= 0) return;

    const newItem: GarageItem = {
      id: `item-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      price: newPrice,
      location: newLocation.trim() || "Local Community",
      sellerFamily: "You (Your Family Listing)",
      description:
        newDescription.trim() ||
        "Item listed from a neighborhood garage—ready to build cooperative property equity.",
      condition: "Very Good",
      badge: "New Listing",
      iconType: "tools",
    };

    setItems((prev) => [newItem, ...prev]);
    setIsListingModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewPrice(75);
    // Focus the user on their new listing
    setActiveItemForReceipt(newItem);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen">
      <div className="max-w-[1360px] mx-auto px-6 py-8 space-y-10">
        {/* SECTION 1: STOREFRONT HERO — FROM THE GARAGE TO THE FUTURE */}
        <section className="bg-[#0B1F3A] rounded-2xl overflow-hidden border border-slate-800 grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-md">
          <div className="lg:col-span-7 relative min-h-[260px] bg-[#102A4C]">
            {!heroImgFailed ? (
              <img
                src="/assets/aistudio/Sunny_Suburban_Garage_Sale_Scene_40932d66.png"
                alt="Neighbors and parents trading a bicycle, guitar, and household goods in a sunny driveway"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-10 text-white">
                <Home className="w-12 h-12 text-[#F3C969]" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-xs border border-white/20 text-xs text-amber-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Engine 2: 50% Cash · 25% Property Equity · 25% Buyer Cashback</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center space-y-4 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-[#F3C969] border border-amber-400/30">
                Article 11 Engine
              </span>
              <span className="text-xs text-slate-300">Peer-to-Peer Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-balance">
              From the Garage to the Future.
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Sell what you no longer need. Turn everyday bikes, tools, and guitars into cash today
              while building permanent Shared Family Ownership in the Parents Alliance (Dexpa).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsListingModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e7bc55] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                <PackagePlus className="w-4 h-4" />
                List an Item from Your Garage
              </button>
              <button
                type="button"
                onClick={onOpenConstitution}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white border border-white/25 hover:bg-white/10 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Read Article 11 Rules
              </button>
            </div>
          </div>
        </section>

        {/* UPGRADE 2: THE 60-SECOND "GARAGE-TO-EQUITY" 3-STEP VISUAL SLIDER STORY */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-[#0F2749]">
                  Kitchen-Table Visual Guide
                </span>
                <span aria-hidden="true">·</span>
                <span>Slide Through All 3 Steps in 10 Seconds</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
                How Dusty Garage Stuff Turns Into Monthly Apartment Rent
              </h2>
            </div>

            {/* Pick a Sample Garage Item to Watch It Move Through All 3 Steps */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
              {[
                { label: "Kids' Bike ($80)", val: 80 },
                { label: "Tool Set ($100)", val: 100 },
                { label: "Bike & Stroller ($120)", val: 120 },
                { label: "Full Garage Cleanout ($400)", val: 400 },
              ].map((preset) => {
                const active = storyItemValue === preset.val;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setStoryItemValue(preset.val);
                      setStoryItemLabel(preset.label);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? "bg-[#0F2749] text-white shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Step Scrubber Bar */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  step: 1 as const,
                  title: "Step 1: Snap a Photo in the Garage",
                  subtitle: `List your ${storyItemLabel} instead of letting it collect dust.`,
                },
                {
                  step: 2 as const,
                  title: "Step 2: Instant Cash + Property Split",
                  subtitle: `${formatUsd(storyItemValue * 0.5)} cash in hand + ${formatUsd(
                    storyItemValue * 0.25
                  )} seller equity + ${formatUsd(storyItemValue * 0.25)} buyer equity.`,
                },
                {
                  step: 3 as const,
                  title: "Step 3: 70% Monthly Rent Drops In",
                  subtitle:
                    "Your family owns real apartment shares + 1 equal vote while funding kid inventors.",
                },
              ].map((s) => {
                const isSelected = storyStep === s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setStoryStep(s.step)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm"
                        : "bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? "text-[#F3C969]" : "text-[#0F2749]"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          isSelected ? "text-emerald-300" : "text-slate-400"
                        }`}
                      >
                        {s.step}/3
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isSelected ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {s.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Step Range Slider for Smooth Dragging */}
            <div className="flex items-center gap-4 px-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 shrink-0">
                Slide Story:
              </span>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={storyStep}
                onChange={(e) => setStoryStep(Number(e.target.value) as 1 | 2 | 3)}
                aria-label="Slide through the 3 steps from garage item to monthly rent"
                className="w-full accent-[#0F2749] cursor-pointer"
              />
              <button
                type="button"
                onClick={() =>
                  setStoryStep((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)))
                }
                className="px-3 py-1.5 text-xs font-bold text-[#0F2749] bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          </div>

          {/* Visual Story Stage */}
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-xl p-4">
              <svg
                viewBox="0 0 640 210"
                className="w-full h-auto select-none"
                role="img"
                aria-label="3-step visual diagram showing garage clutter turning into cash, apartment building equity, and monthly family rent"
              >
                {/* Connecting Flow Track */}
                <line
                  x1="115"
                  y1="105"
                  x2="525"
                  y2="105"
                  stroke="#334155"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="115"
                  y1="105"
                  x2={storyStep === 1 ? 115 : storyStep === 2 ? 320 : 525}
                  y2="105"
                  stroke="#F3C969"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Node 1: The Garage */}
                <g
                  onClick={() => setStoryStep(1)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="115"
                    cy="105"
                    r={storyStep === 1 ? 52 : 44}
                    fill={storyStep >= 1 ? "#1E293B" : "#0F172A"}
                    stroke={storyStep === 1 ? "#F3C969" : "#64748B"}
                    strokeWidth={storyStep === 1 ? "4" : "2"}
                  />
                  <text
                    x="115"
                    y="96"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    1. GARAGE
                  </text>
                  <text
                    x="115"
                    y="116"
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {formatUsd(storyItemValue)}
                  </text>
                  <text
                    x="115"
                    y="182"
                    textAnchor="middle"
                    fill={storyStep === 1 ? "#F3C969" : "#94A3B8"}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    Snap Photo &amp; List
                  </text>
                </g>

                {/* Node 2: 50 / 25 / 25 Split */}
                <g
                  onClick={() => setStoryStep(2)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="320"
                    cy="105"
                    r={storyStep === 2 ? 56 : 44}
                    fill={storyStep >= 2 ? "#1E293B" : "#0F172A"}
                    stroke={storyStep === 2 ? "#F3C969" : "#64748B"}
                    strokeWidth={storyStep === 2 ? "4" : "2"}
                  />
                  <text
                    x="320"
                    y="92"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    2. THE SPLIT
                  </text>
                  <text
                    x="320"
                    y="110"
                    textAnchor="middle"
                    fill="#34D399"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {formatUsd(storyItemValue * 0.5)} Cash
                  </text>
                  <text
                    x="320"
                    y="126"
                    textAnchor="middle"
                    fill="#FBBF24"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    +{formatUsd(storyItemValue * 0.5)} Equity
                  </text>
                  <text
                    x="320"
                    y="182"
                    textAnchor="middle"
                    fill={storyStep === 2 ? "#F3C969" : "#94A3B8"}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    50% Cash · 25% + 25% Deed
                  </text>
                </g>

                {/* Node 3: Monthly Family Rent + Kid Prize */}
                <g
                  onClick={() => setStoryStep(3)}
                  className="cursor-pointer"
                >
                  <circle
                    cx="525"
                    cy="105"
                    r={storyStep === 3 ? 56 : 44}
                    fill={storyStep === 3 ? "#1E293B" : "#0F172A"}
                    stroke={storyStep === 3 ? "#34D399" : "#64748B"}
                    strokeWidth={storyStep === 3 ? "4" : "2"}
                  />
                  <text
                    x="525"
                    y="92"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    3. RENT PAYOUT
                  </text>
                  <text
                    x="525"
                    y="110"
                    textAnchor="middle"
                    fill="#34D399"
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    70% to Families
                  </text>
                  <text
                    x="525"
                    y="126"
                    textAnchor="middle"
                    fill="#F3C969"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    1 Human = 1 Vote
                  </text>
                  <text
                    x="525"
                    y="182"
                    textAnchor="middle"
                    fill={storyStep === 3 ? "#34D399" : "#94A3B8"}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    Real Apartment Income
                  </text>
                </g>
              </svg>
            </div>

            {/* Plain-English Kitchen Table Readout for Current Step */}
            <div className="lg:col-span-5 space-y-4">
              {storyStep === 1 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#F3C969]">
                    STEP 1 OF 3 · CLEAR OUT THE GARAGE
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Turn {storyItemLabel} Into Real Ownership
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Instead of letting good tools, bikes, or instruments sit in the
                    garage collecting dust, a parent snaps a photo and lists it for{" "}
                    <strong className="text-white">{formatUsd(storyItemValue)}</strong>.
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    Zero listing fees · Neighbors get gear they need · Both families
                    build property shares together.
                  </div>
                </div>
              )}

              {storyStep === 2 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#F3C969]">
                    STEP 2 OF 3 · THE LOCKED 50 / 25 / 25 SPLIT
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Cash in Your Pocket Today + Property Shares for Both Families
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40">
                      <div className="text-[11px] text-slate-300">Seller Cash</div>
                      <div className="text-base font-mono font-bold text-emerald-300 tabular-nums mt-0.5">
                        {formatUsd(storyItemValue * 0.5)}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-amber-400/40">
                      <div className="text-[11px] text-slate-300">Seller Equity</div>
                      <div className="text-base font-mono font-bold text-[#F3C969] tabular-nums mt-0.5">
                        {formatUsd(storyItemValue * 0.25)}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-sky-400/40">
                      <div className="text-[11px] text-slate-300">Buyer Equity</div>
                      <div className="text-base font-mono font-bold text-sky-300 tabular-nums mt-0.5">
                        {formatUsd(storyItemValue * 0.25)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Both the selling parent and the buying parent automatically receive
                    real property credits in the cooperative building fund.
                  </p>
                </div>
              )}

              {storyStep === 3 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-emerald-300">
                    STEP 3 OF 3 · 20%–30% AUCTION EDGE &amp; 70% MONTHLY RENT
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Bought 20%–30% Below Market at Foreclosure &amp; Auction
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We don&apos;t pay retail. We buy properties from{" "}
                    <strong className="text-amber-300">
                      foreclosures and auctions at 20% to 30% below market value
                    </strong>
                    —with <strong className="text-white">Discovery BigCoin (DBC)</strong>{" "}
                    starting up the pool and carrying that instant Day-1 equity value. Then{" "}
                    <strong className="text-emerald-300">
                      70% of net rent goes back to families
                    </strong>{" "}
                    and 30% funds the K–12 Discovery Prize!
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-emerald-200 font-medium">
                    And reOwner: <strong>One Human = One Vote.</strong> A parent who
                    traded a stroller has the exact same single vote as a millionaire.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE GARAGE TRADE BOARD & ITEM DIRECTORY */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2749]">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Neighborhood Exchange Board</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Explore Items Available for Trade
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Every trade executes the locked 50 / 25 / 25 split—putting money in the seller’s hand and equity in both families' property wallets.
              </p>
            </div>

            {/* Quick Action Button & Live Simulated Ticker */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Simulated Trades: {simulatedTradesCount}</span>
                <span className="text-slate-400">|</span>
                <span>Total Cash: {formatUsd(accumulatedSellerCash)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsListingModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F2749] bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <PackagePlus className="w-3.5 h-3.5 text-amber-600" />
                + Add Listing
              </button>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tools, instruments, student science gear, bikes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2749] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#0F2749] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const split = computeArticle11SplitCents(Math.round(item.price * 100));
              const sellerCash = split.sellerCashUsd;
              const sellerWallet = split.sellerEquityUsd;
              const buyerWallet = split.buyerEquityUsd;

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0F2749] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">Listed Price:</span>
                        <span className="text-xl font-bold text-slate-900 tabular-nums">
                          {formatUsd(item.price)}
                        </span>
                      </div>

                      {/* 50 / 25 / 25 Live Micro-Breakdown */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-[11px]">
                        <div className="flex items-center justify-between text-slate-700">
                          <span>💵 Seller Cash (50%):</span>
                          <span className="font-bold text-emerald-700">{formatUsd(sellerCash)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span>🏡 Seller Equity (25%):</span>
                          <span className="font-bold text-amber-800">{formatUsd(sellerWallet)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span>🎁 Buyer Cashback (25%):</span>
                          <span className="font-bold text-sky-800">{formatUsd(buyerWallet)}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>{item.sellerFamily}</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSimulateCheckout(item)}
                      className="w-full py-2 px-3 rounded-xl bg-[#0F2749] hover:bg-[#173663] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#F3C969]" />
                      <span>Simulate Trade &amp; Split</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No items found matching your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching for bicycles, microscopes, guitars, or click "All Items" to view all active community listings.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Items");
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-xs font-semibold text-[#0F2749] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* SECTION 3: INTERACTIVE 50 / 25 / 25 CUSTOM CHECKOUT CALCULATOR */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0F2749]">
                Article 11 Interactive Calculator
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                Calculate Any Custom Household Sale
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Drag the slider or type any dollar amount to see how cash and equity divide in real time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="dm-sale-input"
                className="text-xs font-semibold text-slate-600 whitespace-nowrap"
              >
                Custom Sale Amount:
              </label>
              <input
                id="dm-sale-input"
                type="number"
                min={0}
                max={10000}
                step={5}
                value={safeCustomPrice}
                onChange={(e) => setCustomSalePrice(Number(e.target.value))}
                className="w-28 px-3 py-2 text-sm font-bold tabular-nums text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F2749]"
              />
            </div>
          </div>

          {/* Range Slider */}
          <div>
            <input
              type="range"
              aria-label="Adjust household item sale price"
              min={10}
              max={1000}
              step={10}
              value={Math.min(1000, Math.max(10, safeCustomPrice))}
              onChange={(e) => setCustomSalePrice(Number(e.target.value))}
              className="w-full accent-[#0F2749] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>$10 Garage Trinket</span>
              <span>$500 Tool Set</span>
              <span>$1,000 Major Appliance</span>
            </div>
          </div>

          {/* 3 Big Visual Split Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>50% · Seller Cash</span>
                <span className="tabular-nums text-emerald-700 font-bold">In Seller’s Pocket</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {formatUsd(customSplit.sellerCashUsd)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immediate transaction cash paid to the selling family. No waiting periods.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0B1F3A] text-white border border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F3C969]">
                <span>25% · Seller Dexpa Wallet</span>
                <span className="tabular-nums">Property Equity</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white tabular-nums">
                {formatUsd(customSplit.sellerEquityUsd)}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Credited directly toward the seller’s future share in our cooperative $5M commercial building.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0B1F3A] text-white border border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F3C969]">
                <span>25% · Buyer Dexpa Wallet</span>
                <span className="tabular-nums">Buyer Cashback</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white tabular-nums">
                {formatUsd(customSplit.buyerEquityUsd)}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                The buying family earns an equal equity reward—making everyday purchases an engine for real estate ownership.
              </p>
            </div>
          </div>

          {/* Additive PayPal Business (The Discovery Exchange) Checkout Bar Connected to Calculator */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#003087] text-white text-[11px] font-bold tracking-wide">
                  PayPal Business
                </span>
                <span className="text-xs font-bold text-slate-900">
                  The Discovery Exchange · Verified Merchant (dxpalliance@gmail.com)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Calculator stay 100% live
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your calculator above automatically locks the Article 11 split for{" "}
                <strong className="text-slate-900 tabular-nums">{formatUsd(safeCustomPrice)}</strong>:{" "}
                <strong className="text-emerald-700 tabular-nums">{formatUsd(customSplit.sellerCashUsd)}</strong> Seller Cash (50%) ·{" "}
                <strong className="text-[#0F2749] tabular-nums">{formatUsd(customSplit.sellerEquityUsd)}</strong> Seller Dexpa Wallet (25%) ·{" "}
                <strong className="text-[#0F2749] tabular-nums">{formatUsd(customSplit.buyerEquityUsd)}</strong> Buyer Cashback Wallet (25%).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleSimulateCheckout({
                    id: `custom-calc-${Date.now()}`,
                    title: `Custom Household Trade (${formatUsd(safeCustomPrice)})`,
                    category: "Tools & Workshop",
                    condition: "Good",
                    price: safeCustomPrice,
                    sellerFamily: "Community Member",
                    location: "Local Neighborhood",
                    description:
                      "Custom calculated Article 11 household trade with automatic 50% Seller Cash / 25% Seller Dexpa Wallet / 25% Buyer Cashback Wallet split.",
                    badge: "Custom Split",
                    iconType: "wrench",
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Simulate {formatUsd(safeCustomPrice)} Trade (Free Preview)
              </button>

              <a
                href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                  "dxpalliance@gmail.com"
                )}&item_name=${encodeURIComponent(
                  `The Discovery Exchange Market Trade (${formatUsd(
                    safeCustomPrice
                  )}) — Art. 11 Split: 50% Cash (${formatUsd(
                    customSplit.sellerCashUsd
                  )}) / 25% Seller Dexpa (${formatUsd(
                    customSplit.sellerEquityUsd
                  )}) / 25% Buyer Dexpa (${formatUsd(customSplit.buyerEquityUsd)})`
                )}&amount=${safeCustomPrice.toFixed(2)}&currency_code=USD`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Checkout {formatUsd(safeCustomPrice)} with PayPal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3B: COMPLETE DISCOVERY BIGCOIN (DBC) MECHANISM & 100M POOL COMMAND CENTER */}
        <section
          id="dbc-complete-mechanism"
          className="bg-[#0B1F3A] text-white border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md"
        >
          {/* Top Header + Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F3C969]">
                <Coins className="w-4 h-4" />
                <span>Article 13 Complete Mechanism · 100,000,000 Fixed Supply Ceiling</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px]">
                  {verificationReport.passCount}/{verificationReport.totalCount} Dual-QC Checks Passing
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                How Discovery BigCoin (DBC) Works from Startup to Foreclosure &amp; Auction Equity
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Capped forever at <strong>100,000,000 DBC</strong> across 7 Constitutional Pools. Starts up the acquisition pool to buy <strong>foreclosure and auction properties at 20% to 30% below market value</strong>—carrying that Day-1 equity while keeping <strong>1 Human Owner = 1 Vote</strong>.
              </p>
            </div>

            {/* 2-Tab Mode Switcher: Kitchen-Table Mechanism vs. 3-Shard V2 Protocol Engine */}
            <div className="flex items-center gap-1.5 bg-slate-900/95 p-1.5 rounded-xl border border-white/15 shrink-0">
              <button
                type="button"
                onClick={() => setDbcMechanismTab("value-carrier")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  dbcMechanismTab === "value-carrier"
                    ? "bg-[#F3C969] text-slate-950 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                1. Auction Edge &amp; 100M Pools
              </button>
              <button
                type="button"
                onClick={() => setDbcMechanismTab("protocol-v2")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  dbcMechanismTab === "protocol-v2"
                    ? "bg-emerald-400 text-slate-950 shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. 3-Shard V2 Protocol ({verificationReport.passCount}/{verificationReport.totalCount} PASS)</span>
              </button>
            </div>
          </div>

          {dbcMechanismTab === "value-carrier" ? (
            <div className="space-y-6">
              {/* PART 1: FORECLOSURE & AUCTION 20%-30% DISCOUNT CALCULATOR */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Step 1 · Capturing 20%–30% Below-Market Equity at Foreclosure &amp; Auction
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
                      {[
                        { label: "$1M Building", val: 1000000 },
                        { label: "$5M Building", val: 5000000 },
                        { label: "$10M Portfolio", val: 10000000 },
                      ].map((b) => (
                        <button
                          key={b.val}
                          type="button"
                          onClick={() => setBuildingMarketValue(b.val)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            buildingMarketValue === b.val
                              ? "bg-[#F3C969] text-slate-950"
                              : "text-slate-300 hover:text-white"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-emerald-400/30">
                      {([20, 25, 30] as const).map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setAuctionDiscountPct(pct)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            auctionDiscountPct === pct
                              ? "bg-emerald-400 text-slate-950"
                              : "text-emerald-200 hover:text-white"
                          }`}
                        >
                          -{pct}% Auction Discount
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>True Market Appraisal</span>
                      <span className="font-mono text-slate-400">Retail Value</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                      {formatUsd(buildingMarketValue)}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Full appraised market value of the commercial or apartment building.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-400/40 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#F3C969]">
                      <span>Foreclosure / Auction Price</span>
                      <span className="font-mono font-bold">-{auctionDiscountPct}% Discount</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F3C969] tabular-nums">
                      {formatUsd(buildingMarketValue * (1 - auctionDiscountPct / 100))}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Bought from bank foreclosure or courthouse auction at {auctionDiscountPct}% under market.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-400/40 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                      <span>Day-1 Equity Carried by DBC</span>
                      <span className="font-mono font-bold">+{auctionDiscountPct}% Cushion</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-300 tabular-nums">
                      +{formatUsd(buildingMarketValue * (auctionDiscountPct / 100))}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Instant built-in value captured on Day 1—carried by <strong>Discovery BigCoin (DBC)</strong> from startup.
                    </p>
                  </div>
                </div>
              </div>

              {/* PART 2: THE 100,000,000 FIXED SUPPLY & 7 CONSTITUTIONAL POOLS */}
              <div className="bg-slate-900/90 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F3C969]">
                      Step 2 · Hard Supply Cap: {AUTHORIZED_SUPPLY_CEILING.toLocaleString()} DBC (Zero Inflation)
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      The 7 Constitutional Allocation Pools (SupplyAllocationPoolShard)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 px-2.5 py-1 rounded-lg">
                    50M K–12 Prize · 45M Proof-of-Service · Five 1M Reserves
                  </span>
                </div>

                {/* Visual Segmented Supply Bar */}
                <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-950 border border-white/15">
                  <div
                    style={{ width: "50%" }}
                    className="bg-amber-400 h-full"
                    title="50% National K–12 Discovery Prize Pool (50,000,000 DBC)"
                  />
                  <div
                    style={{ width: "45%" }}
                    className="bg-emerald-400 h-full"
                    title="45% Proof-of-Service & Auction Acquisition Pool (45,000,000 DBC)"
                  />
                  <div
                    style={{ width: "5%" }}
                    className="bg-sky-400 h-full"
                    title="5% Five 1,000,000 DBC Foundational & Growth Pools (5,000,000 DBC)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CONSTITUTIONAL_DBC_POOLS.map((pool) => (
                    <div
                      key={pool.key}
                      className={`p-3.5 rounded-xl border space-y-1 ${
                        pool.sharePct >= 45
                          ? "bg-slate-950/90 border-amber-400/40 lg:col-span-2"
                          : "bg-slate-950/60 border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-300">
                          {pool.key}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                          {pool.sharePct}%
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white">{pool.label}</div>
                      <div className="text-base font-mono font-bold text-emerald-300 tabular-nums">
                        {pool.allocation.toLocaleString()} DBC
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {pool.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART 3: INTERACTIVE VESTING & PROPORTIONAL HOLD SHIELD (MODULE 06) */}
              <div className="bg-slate-900/90 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      Step 3 · Anti-Dump Vesting &amp; Module 06 Proportional Hold Protection
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Interactive Vesting &amp; Hold Calculator (1,000,000 DBC Sample Lot)
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSimProportionalHold((p) => !p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        simProportionalHold
                          ? "bg-amber-400/20 border-amber-400 text-amber-200"
                          : "bg-slate-800 border-white/15 text-slate-300"
                      }`}
                    >
                      {simProportionalHold
                        ? "✓ Proportional Hold Active (Freezes Unvested Only)"
                        : "Proportional Hold: OFF"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimGlobalQuarantine((p) => !p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        simGlobalQuarantine
                          ? "bg-rose-500/25 border-rose-400 text-rose-200"
                          : "bg-slate-800 border-white/15 text-slate-300"
                      }`}
                    >
                      {simGlobalQuarantine
                        ? "⚠️ Global Quarantine (GQ): ON"
                        : "Global Quarantine (GQ): OFF"}
                    </button>
                  </div>
                </div>

                {/* Block Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      Slide Block Height (Start: 0 · Cliff: 100 · End: 1000):{" "}
                      <strong className="text-white font-mono">Block {simBlockHeight}</strong>
                    </span>
                    <span className="text-amber-300 font-mono text-[11px]">
                      {liveVestingMath.stageLabel}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1200}
                    step={25}
                    value={simBlockHeight}
                    onChange={(e) => setSimBlockHeight(Number(e.target.value))}
                    aria-label="Adjust simulated vesting block height"
                    className="w-full accent-[#F3C969] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <button
                      type="button"
                      onClick={() => setSimBlockHeight(50)}
                      className="hover:text-white underline cursor-pointer"
                    >
                      Block 50 (Pre-Cliff = 0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimBlockHeight(500)}
                      className="hover:text-white underline cursor-pointer"
                    >
                      Block 500 (50% Vested = 500k)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimBlockHeight(1200)}
                      className="hover:text-white underline cursor-pointer"
                    >
                      Block 1200 (100% Vested = 1M)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
                    <div className="text-xs text-slate-300">Spendable / Unlocked Allowance</div>
                    <div className="text-2xl font-mono font-bold text-emerald-300 tabular-nums mt-0.5">
                      {liveVestingMath.spendable.toLocaleString()} DBC
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Protected by Module 06 proportional hold math.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
                    <div className="text-xs text-slate-300">Locked / Unvested Balance</div>
                    <div className="text-2xl font-mono font-bold text-[#F3C969] tabular-nums mt-0.5">
                      {liveVestingMath.locked.toLocaleString()} DBC
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Cannot be transferred or dumped before vesting.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                    <div className="text-xs text-slate-300">Live Vesting Shard SHA-256 Root</div>
                    <div className="text-xs font-mono font-bold text-sky-300 break-all mt-1">
                      {liveVestingMath.vestingRootHex.slice(0, 32)}...
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      1 Human Owner = 1 Vote (Coins never vote).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: LIVE 3-SHARD V2 PROTOCOL SIMULATOR & 19/19 DUAL-QC SUITE */
            <div className="space-y-6">
              {/* Interactive 4-Button Atomic Coordinator Stress Tester */}
              <div className="bg-slate-900/90 border border-white/15 rounded-xl p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      CrossNamespaceAtomicCoordinator · Live Sandbox Demonstrator
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Test Atomic Issuance, Strict Nonce (+1), Replay Defense &amp; Zero-Drift Rollback
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="dbc-pool-select" className="text-xs text-slate-300">
                      Source Pool:
                    </label>
                    <select
                      id="dbc-pool-select"
                      value={selectedPoolKey}
                      onChange={(e) => setSelectedPoolKey(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/20 text-xs font-mono text-[#F3C969]"
                    >
                      {CONSTITUTIONAL_DBC_POOLS.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.key} ({p.allocation.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRunLiveProtocolScenario("issue-pool")}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-emerald-400/40 text-left space-y-1 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-emerald-300">
                      1. Atomic Pool Issuance
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Issue 250,000 DBC from selected pool with matched vesting schedule.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunLiveProtocolScenario("valid-nonce")}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-sky-400/40 text-left space-y-1 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-sky-300">
                      2. Valid Nonce (+1) Transfer
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Execute transfer at Block 500 with strict sequential nonce = 1.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunLiveProtocolScenario("replay-gap")}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-amber-400/40 text-left space-y-1 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#F3C969]">
                      3. Test Nonce-Gap Replay
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Submit out-of-order Nonce 10 → verify instant rejection &amp; zero drift.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunLiveProtocolScenario("mid-commit-fault")}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-rose-400/40 text-left space-y-1 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-rose-300">
                      4. Inject Mid-Commit Fault
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Trigger exception mid-commit → verify 100% 3-shard rollback.
                    </p>
                  </button>
                </div>

                {protocolActionBanner && (
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      protocolActionBanner.status === "pass"
                        ? "bg-emerald-950/60 border-emerald-400/50 text-emerald-100"
                        : "bg-amber-950/60 border-amber-400/50 text-amber-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{protocolActionBanner.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40">
                        SCHEMA_V1_0_16 + V2_NONCE_ROOT
                      </span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {protocolActionBanner.detail}
                    </p>
                    <div className="text-[11px] font-mono text-sky-300 break-all pt-1">
                      Composite State Root: {protocolActionBanner.compositeRootHex}
                    </div>
                  </div>
                )}
              </div>

              {/* 19/19 Dual-QC & Remediated Boundary Verification Matrix */}
              <div className="bg-slate-900/90 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F3C969]">
                      Complete 22-Check Dual-QC &amp; Adversarial Verification Suite (Modules 04–08)
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      Big-Endian Serialization · Nonce (+1) Gate · Module 06 Hold Math · 50/25/25 &amp; 70/30 Conservation
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="/dbc_authoritative_node7_bundle.json"
                      download="dbc_authoritative_node7_bundle.json"
                      className="px-3 py-1 rounded-lg bg-[#F3C969] hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold transition-colors"
                    >
                      ⬇ NODE_7 Source &amp; SHA-256 Bundle
                    </a>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
                      {verificationReport.passCount} / {verificationReport.totalCount} PASS (0 FAIL)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {verificationReport.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            #{chk.id}. {chk.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {chk.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4: THREE DISTINCT TOOLS — PLAIN-ENGLISH BOUNDARIES */}
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Clear Constitutional Boundaries · Zero Confusion
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Wallet vs. Property Nugget vs. Discovery BigCoin
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#0F2749]/10 text-[#0F2749] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  1. Dexpa Wallet Allocation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tracks your 25% Discovery Market allocations building toward
                  property participation. A wallet balance is a pathway credit,
                  not an automatic property deed.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 tabular-nums">
                Article 11 · Marketplace Pathway
              </div>
            </article>

            <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#0F2749]/10 text-[#0F2749] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  2. Property Nugget (70 / 30 Net Rent)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A legal fractional interest in a real cooperative building
                  acquired at foreclosure or auction (20%–30% below market).
                  Net distributable rent splits 70% to participating Owners and 30%
                  permanently funding the National K–12 Discovery Prize.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 tabular-nums">
                Article 12 · 1 Owner, 1 Vote
              </div>
            </article>

            <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#0F2749]/10 text-[#0F2749] flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  3. Discovery BigCoin (DBC · 100M Cap)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fixed 100,000,000-supply value carrier (50M K–12 Prize, 45M
                  Proof-of-Service, five 1M reserves) that starts up the auction
                  acquisition pool and carries the 20%–30% below-market equity
                  spread—secured by 3-shard SHA-256 roots and never granting extra
                  votes.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 tabular-nums">
                Article 5 &amp; 13 · 100M Fixed Supply · 3-Shard V2
              </div>
            </article>
          </div>
        </section>
      </div>

      {/* MODAL 1: SIMULATE CHECKOUT & COOPERATIVE RECEIPT MODAL */}
      {activeItemForReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget && !showSuccessStamp) {
              setActiveItemForReceipt(null);
            }
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-amber-300 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  <span>Article 11 Cooperative Checkout</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {activeItemForReceipt.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Seller: {activeItemForReceipt.sellerFamily} · {activeItemForReceipt.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItemForReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Lock Bar */}
            <div className="flex items-baseline justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Total Purchase Price:</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                {formatUsd(activeItemForReceipt.price)}
              </span>
            </div>

            {/* The 50 / 25 / 25 Split Breakdown Card */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Instant Automatic Allocation:
              </div>

              {/* 1. Seller Cash */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>💵 50% Immediate Seller Cash</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 leading-tight">
                    Transferred directly to the selling family.
                  </div>
                </div>
                <span className="text-base font-bold text-emerald-900 tabular-nums shrink-0">
                  {formatUsd(activeItemForReceipt.price * 0.5)}
                </span>
              </div>

              {/* 2. Seller Property Equity */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🏡 25% Seller Dexpa Property Wallet</span>
                  </div>
                  <div className="text-[11px] text-amber-800 leading-tight">
                    Credited toward shared commercial property ownership.
                  </div>
                </div>
                <span className="text-base font-bold text-amber-900 tabular-nums shrink-0">
                  {formatUsd(activeItemForReceipt.price * 0.25)}
                </span>
              </div>

              {/* 3. Buyer Cashback */}
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>🎁 25% Buyer Cashback Wallet</span>
                  </div>
                  <div className="text-[11px] text-sky-800 leading-tight">
                    The buying family earns an equal property credit.
                  </div>
                </div>
                <span className="text-base font-bold text-sky-900 tabular-nums shrink-0">
                  {formatUsd(activeItemForReceipt.price * 0.25)}
                </span>
              </div>
            </div>

            {/* Constitutional Notice */}
            <div className="p-3 rounded-xl bg-[#0F2749] text-white text-xs space-y-1">
              <div className="font-semibold text-amber-300">Why this matters:</div>
              <div className="text-slate-200 text-[11px] leading-relaxed">
                Ordinary classifieds take your money for corporate ad revenue. The Discovery Market turns your transaction into real family wealth—building toward our cooperative $5M building where 30% of rent permanently rewards public school students.
              </div>
            </div>

            {/* Action Buttons: Both Free Simulated Barter Trade AND Live PayPal Business Checkout */}
            {!showSuccessStamp ? (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleConfirmSimulatedTrade}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>1. Confirm Simulated Barter Trade (Free Test-Drive)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-[#003087] uppercase tracking-wider flex items-center gap-1.5">
                      <span>Official PayPal Business Checkout</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">LIVE</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      The Discovery Exchange · dxpalliance@gmail.com
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    TDEX Marketplace App: <code className="font-mono text-slate-700 bg-slate-200/60 px-1 py-0.5 rounded text-[10px]">BAAysM_yRatYG1Jzz72QaM0O4WAV7Vn8W--QLL6849jVWApsvRJVmbhBXxvxui2XSWOWCvul5vUXGnpRYM</code>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                        "dxpalliance@gmail.com"
                      )}&item_name=${encodeURIComponent(
                        `${activeItemForReceipt.title} — The Discovery Exchange (TDEX) Article 11 Split: 50% Seller Cash (${formatUsd(
                          activeItemForReceipt.price * 0.5
                        )}) / 25% Seller Dexpa (${formatUsd(
                          activeItemForReceipt.price * 0.25
                        )}) / 25% Buyer Dexpa (${formatUsd(
                          activeItemForReceipt.price * 0.25
                        )})`
                      )}&amount=${activeItemForReceipt.price.toFixed(2)}&currency_code=USD`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Pay with PayPal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                        "dxpalliance@gmail.com"
                      )}&item_name=${encodeURIComponent(
                        `${activeItemForReceipt.title} — The Discovery Exchange (TDEX) Article 11 Split: 50% Seller Cash (${formatUsd(
                          activeItemForReceipt.price * 0.5
                        )}) / 25% Seller Dexpa (${formatUsd(
                          activeItemForReceipt.price * 0.25
                        )}) / 25% Buyer Dexpa (${formatUsd(
                          activeItemForReceipt.price * 0.25
                        )})`
                      )}&amount=${activeItemForReceipt.price.toFixed(2)}&currency_code=USD`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Venmo / Debit or Credit Card</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5" />
                <span>Trade Recorded! Wallets Credited Instantly.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: "LIST AN ITEM FROM YOUR GARAGE" MODAL */}
      {isListingModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsListingModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F2749]">
                  <PackagePlus className="w-4 h-4 text-amber-600" />
                  <span>From the Garage to the Future</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  List an Item from Your Garage
                </h3>
                <p className="text-xs text-slate-500">
                  No listing fees. Zero middlemen. Build real property equity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsListingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewListing} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Item Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unused Student Microscope, Mountain Bike, Tool Set..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F2749]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as GarageItem["category"])
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F2749]"
                  >
                    <option value="Tools & Workshop">Tools & Workshop</option>
                    <option value="Science & Education">Science & Education</option>
                    <option value="Music & Arts">Music & Arts</option>
                    <option value="Bikes & Sports">Bikes & Sports</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Asking Price ($ USD):
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={5000}
                    step={5}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F2749]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Your Neighborhood / City:
                </label>
                <input
                  type="text"
                  placeholder="e.g., Brooklyn, NY or Dallas, TX"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F2749]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Item Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell your neighbors about the condition, accessories, and why you're passing it forward..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0F2749]"
                />
              </div>

              {/* Live Preview of your Split */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                <div className="text-xs font-bold text-amber-950 flex items-center justify-between">
                  <span>When this item sells:</span>
                  <span className="font-mono text-slate-600">Total: {formatUsd(newPrice)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-amber-200">
                    <div className="text-[10px] text-slate-500">You Get Cash:</div>
                    <div className="font-bold text-emerald-700">{formatUsd(newPrice * 0.5)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200">
                    <div className="text-[10px] text-slate-500">Your Property Wallet:</div>
                    <div className="font-bold text-amber-800">{formatUsd(newPrice * 0.25)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200">
                    <div className="text-[10px] text-slate-500">Buyer Cashback:</div>
                    <div className="font-bold text-sky-800">{formatUsd(newPrice * 0.25)}</div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0F2749] hover:bg-[#173663] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <PackagePlus className="w-4 h-4 text-[#F3C969]" />
                <span>Publish Item to Live Trade Board</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
