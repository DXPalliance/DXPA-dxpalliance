import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Flame,
  Gavel,
  Handshake,
  Landmark,
  ShieldCheck,
  Sliders,
  Wand2,
} from "lucide-react";
import { pipAudio } from "../utils/pipSoundEffects";
import { analyzeTextReadability } from "../utils/readabilityAnalyzer";
import { ChambersTabId } from "../types/campaign";
import dxpaEveryoneTogetherImg from "../assets/images/dxpa_everyone_together_1793309874777.jpg";

interface DiscoveryStudioViewProps {
  onOpenMarketplace: () => void;
  onOpenScienceLab: () => void;
  onOpenChambers: () => void;
  onOpenChambersWithTab?: (tab: ChambersTabId) => void;
  onOpenConstitution?: () => void;
}

interface OutreachPreset {
  id: string;
  name: string;
  targetAudience: string;
  subject: string;
  headline: string;
  body: string;
  callToAction: string;
}

const OUTREACH_PRESETS: OutreachPreset[] = [
  {
    id: "garage-exchange",
    name: "Neighborhood Garage Exchange",
    targetAudience: "Local Neighbors & Parents",
    subject: "Turn yesterday's garage clutter into real property ownership for your family",
    headline: "From the Garage to the Future: Clean Your Garage, Build Real Property",
    body: "Most of us have old tools, bicycles, and guitars sitting in our garage gathering dust. Through The Discovery Exchange, you don't just sell items for cash—every trade splits 50% cash directly into your pocket, 25% into your family property equity wallet, and 25% cashback to the buyer building shared real estate ownership. Zero platform dues or entry fees, ever.",
    callToAction: "Join Your Local Neighborhood Exchange Counter",
  },
  {
    id: "k12-prize",
    name: "PTA & School Board Brief",
    targetAudience: "Teachers, PTA Parents & Students",
    subject: "Why we're building the National K–12 Discovery Prize for ordinary students",
    headline: "Rewarding Hands-On Ingenuity, Not Big School Budgets",
    body: "Our public school kids have fallen to 26th in math and 10th in science globally. Inspired by the Nobel Prize, The Discovery Exchange created the National K–12 Discovery Prize for thousands of ordinary middle and high school students. Every project is submitted under an anonymous project number so judges evaluate pure usefulness, grit, and ordinary materials rather than zip code wealth.",
    callToAction: "Explore Real Kid Inventions & Cash Awards",
  },
  {
    id: "auction-equity",
    name: "Foreclosure & Auction Brief",
    targetAudience: "Participating Family Owners",
    subject: "How acquiring properties 20% to 30% below market protects everyday families",
    headline: "Building an Immediate Equity Cushion from Day 1",
    body: "Instead of paying peak retail prices, the Discovery Exchange Parents Alliance (Dexpa) acquires real estate from auctions and foreclosures at 20% to 30% below market value. That immediate discount becomes a protective built-in equity cushion for everyday families. Plus, 70% of all net monthly rental income flows back to participating family owners, with 30% funding America's kids.",
    callToAction: "See How the 70/30 Rental Standard Works",
  },
  {
    id: "anti-capture",
    name: "Constitutional Governance",
    targetAudience: "Civic Leaders & Family Advocates",
    subject: "Article 5: One human owner, one vote — why wealth never buys extra ballots",
    headline: "A Glass-Walled House: Never Let Money Buy Control",
    body: "In standard corporations, wealthy investors purchase voting shares and steer decisions. In Dexpa, Article 5 of our Constitution locks in 'One Human Owner, One Vote.' A mother who joined by trading a toaster has the exact same voting power as someone contributing maximum capital. AI engines organize the math in daylight, while human families hold the governance gavel.",
    callToAction: "Read Article 5 of the Constitution",
  },
];

export const DiscoveryStudioView: React.FC<DiscoveryStudioViewProps> = ({
  onOpenMarketplace,
  onOpenScienceLab,
  onOpenChambers,
  onOpenChambersWithTab,
  onOpenConstitution,
}) => {
  // Interactive 3-Step Garage-to-Rent Slider State
  const [garageItemValue, setGarageItemValue] = useState<number>(400); // $50 to $2,500
  const [monthlyBuildingRent, setMonthlyBuildingRent] = useState<number>(35000); // $5,000 to $100,000
  const [rentViewMode, setRentViewMode] = useState<"monthly" | "annual">("monthly");

  // Calculated 50/25/25 split for the Garage Exchange
  const sellerCashShare = Math.round(garageItemValue * 0.5);
  const sellerEquityShare = Math.round(garageItemValue * 0.25);
  const buyerCashbackShare = Math.round(garageItemValue * 0.25);

  // Calculated 70/30 split for Net Distributable Building Rent
  const monthlyFamilyRent = Math.round(monthlyBuildingRent * 0.7);
  const monthlyPrizePool = Math.round(monthlyBuildingRent * 0.3);
  const annualFamilyRent = monthlyFamilyRent * 12;
  const annualPrizePool = monthlyPrizePool * 12;

  // Outreach Studio State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("garage-exchange");
  const [customHeadline, setCustomHeadline] = useState(OUTREACH_PRESETS[0].headline);
  const [customBody, setCustomBody] = useState(OUTREACH_PRESETS[0].body);
  const [customSubject, setCustomSubject] = useState(OUTREACH_PRESETS[0].subject);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const selectedPreset = useMemo(() => {
    return OUTREACH_PRESETS.find((p) => p.id === selectedPresetId) || OUTREACH_PRESETS[0];
  }, [selectedPresetId]);

  const handleSelectPreset = (preset: OutreachPreset) => {
    setSelectedPresetId(preset.id);
    setCustomHeadline(preset.headline);
    setCustomBody(preset.body);
    setCustomSubject(preset.subject);
    pipAudio.playPop();
  };

  const readabilityStats = useMemo(() => {
    return analyzeTextReadability([customBody]);
  }, [customBody]);

  const handleCopyDraft = () => {
    const fullText = `SUBJECT: ${customSubject}\n\n${customHeadline}\n\n${customBody}\n\nCall to Action: ${selectedPreset.callToAction}\n\n--\nThe Discovery Exchange · Parents Alliance (1 Owner, 1 Vote · $0 Fees)`;
    navigator.clipboard.writeText(fullText);
    pipAudio.playSuccess();
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2200);
  };

  // K-12 Blind-Judging Lab Simulator State
  const [rubricIngenuity, setRubricIngenuity] = useState<number>(36); // max 40
  const [rubricUsefulness, setRubricUsefulness] = useState<number>(38); // max 40
  const [rubricMaterials, setRubricMaterials] = useState<number>(18); // max 20
  const totalScore = rubricIngenuity + rubricUsefulness + rubricMaterials;

  return (
    <div className="bg-[#F8FAFC] text-slate-900 w-full min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2749] text-white text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Discovery Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Design Your Discovery Journey
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Interactive tools to help you understand the exchange, reach out to your community, 
            and see how we support the next generation of inventors.
          </p>
        </div>

        {/* -------------------------------------------------------------
            SECTION: TURN GARAGE CLUTTER INTO CASH & REAL PROPERTY
            ------------------------------------------------------------- */}
        <section
          id="garage-to-rent-slider"
          className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7"
        >
          <div className="border-b border-slate-200 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>Plain-English Trade Engine</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Articles 11, 12 &amp; 13 of Constitution v7.4
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Turn Garage Clutter Into Cash &amp; Real Property
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Tired parents don&apos;t have time to read college textbooks. Here is the picture: You clean out your garage or buy everyday goods, walk away with cash in hand, and own a growing stake in real rental properties.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            <img
              src="/assets/aistudio/Sunny_Suburban_Garage_Sale_Scene_40932d66.png"
              alt="Sunny Suburban Garage Sale"
              className="w-full h-56 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 sm:p-5">
              <div className="text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Real Everyday Commerce
                </span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  No Wall Street, No Middlemen: Every trade puts cash in your pocket and buys physical real estate for families.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="garage-clutter-input" className="text-sm font-bold text-slate-900">
                Step 1: Household Garage Clutter Sold
              </label>
              <span className="text-xl font-bold font-mono text-[#0F2749]">
                ${garageItemValue.toLocaleString()}
              </span>
            </div>
            <input
              id="garage-clutter-input"
              type="range"
              min="50"
              max="2500"
              step="25"
              value={garageItemValue}
              onChange={(e) => setGarageItemValue(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2749]"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>$50 (Small Tools)</span>
              <span>$1,000 (Guitar / Bike)</span>
              <span>$2,500 (Full Cleanout)</span>
            </div>

            <div className="pt-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Step 2: The 50 / 25 / 25 Gross-Checkout Split (Article 11)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    50% Cash to Seller
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-700">
                    ${sellerCashShare.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-900 leading-snug">
                    Immediate payout straight to your pocket.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F2749]">
                    25% Seller Property Wallet
                  </span>
                  <div className="text-2xl font-bold font-mono text-blue-700">
                    ${sellerEquityShare.toLocaleString()}
                  </div>
                  <p className="text-xs text-blue-900 leading-snug">
                    Designated toward fractional ownership.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    25% Buyer Cashback Wallet
                  </span>
                  <div className="text-2xl font-bold font-mono text-amber-800">
                    ${buyerCashbackShare.toLocaleString()}
                  </div>
                  <p className="text-xs text-amber-900 leading-snug">
                    Buyers earn property equity by purchasing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-gradient-to-br from-[#0F2749]/5 via-slate-50 to-amber-500/5 border border-slate-200 rounded-xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label htmlFor="distributable-rent-input" className="text-sm font-bold text-slate-900">
                  Step 3: Building Net Distributable Rent Pool
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Targeted 20%–30% below market auction acquisition equity
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setRentViewMode("monthly")}
                    className={`px-2.5 py-1 rounded-md transition ${
                      rentViewMode === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setRentViewMode("annual")}
                    className={`px-2.5 py-1 rounded-md transition ${
                      rentViewMode === "annual" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Annual
                  </button>
                </div>
                <span className="text-xl font-bold font-mono text-[#0F2749]">
                  ${(rentViewMode === "monthly" ? monthlyBuildingRent : monthlyBuildingRent * 12).toLocaleString()}
                </span>
              </div>
            </div>

            <input
              id="distributable-rent-input"
              type="range"
              min="5000"
              max="100000"
              step="2500"
              value={monthlyBuildingRent}
              onChange={(e) => setMonthlyBuildingRent(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    70% Direct to Family Owners
                  </span>
                  <Building2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-700">
                  ${(rentViewMode === "monthly" ? monthlyFamilyRent : annualFamilyRent).toLocaleString()}
                  <span className="text-xs font-sans text-slate-500 font-normal">
                    /{rentViewMode === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>

              <div className="bg-white border-2 border-[#D4AF37]/50 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    30% to National K–12 Prize Pool
                  </span>
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-3xl font-bold font-mono text-amber-700">
                  ${(rentViewMode === "monthly" ? monthlyPrizePool : annualPrizePool).toLocaleString()}
                  <span className="text-xs font-sans text-slate-500 font-normal">
                    /{rentViewMode === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION: KITCHEN-TABLE OUTREACH STUDIO
            ------------------------------------------------------------- */}
        <section
          id="outreach-studio"
          className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7"
        >
          <div className="border-b border-slate-200 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0F2749] text-xs font-bold uppercase tracking-wider">
                <Wand2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Kitchen-Table Outreach Studio</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Grade 7–8 Target Reading Level
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Instant Outreach Studio: Craft Plain-Truth Messages
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Generate kitchen-table invitations for your neighborhood, school board, or PTA.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {OUTREACH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition cursor-pointer ${
                  preset.id === selectedPresetId
                    ? "bg-[#0F2749] text-white border-[#0F2749] shadow-sm"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {preset.targetAudience}
                </div>
                <div className="text-xs font-bold mt-1 line-clamp-1">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Subject Line</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2749]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Headline</label>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2749]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Body Copy</label>
              <textarea
                rows={4}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2749]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">Readability:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                  Grade {readabilityStats.fleschKincaidGrade.toFixed(1)}
                </span>
                <span className="text-slate-500">{readabilityStats.wordCount} words</span>
              </div>
              <button
                type="button"
                onClick={handleCopyDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? "Copied!" : "Copy Draft"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION: THE NATIONAL K-12 DISCOVERY PRIZE LAB
            ------------------------------------------------------------- */}
        <section
          id="prize-lab"
          className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7"
        >
          <div className="border-b border-slate-200 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>The National K–12 Discovery Prize</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              The National K–12 Discovery Prize Lab
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Anonymous judging based 100% on the prototype. Real recognition for young makers.
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#0A1F3D] to-[#0F2D59] text-white rounded-xl p-5 sm:p-6 space-y-5 border-2 border-[#D4AF37] shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-400/20 text-[#F3C969] border border-amber-400/30">
                  ANONYMOUS ID: TDEX-2026-9041
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Poverty-Alleviating Gravity-Fed Drip Irrigation using Upcycled Plastic Jugs
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300 block">Total Score</span>
                <span className="text-3xl font-bold font-mono text-[#F3C969]">
                  {totalScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-200">
                  <label>1. Inventiveness (40%)</label>
                  <span className="font-mono font-bold text-[#F3C969]">{rubricIngenuity}/40 pts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={rubricIngenuity}
                  onChange={(e) => setRubricIngenuity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F3C969]"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-200">
                  <label>2. Usefulness (40%)</label>
                  <span className="font-mono font-bold text-[#F3C969]">{rubricUsefulness}/40 pts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={rubricUsefulness}
                  onChange={(e) => setRubricUsefulness(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F3C969]"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-200">
                  <label>3. Household Materials (20%)</label>
                  <span className="font-mono font-bold text-[#F3C969]">{rubricMaterials}/20 pts</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={rubricMaterials}
                  onChange={(e) => setRubricMaterials(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F3C969]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs">
              <span className="font-bold text-amber-300 font-mono">
                {totalScore >= 90 ? "★ National Gold Medal Tier" : totalScore >= 75 ? "★ National Silver Tier" : "★ Bronze Honor Tier"}
              </span>
              <button
                type="button"
                onClick={onOpenScienceLab}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e7bc55] rounded-lg transition cursor-pointer"
              >
                <span>Explore Full K–12 Prize Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            SECTION: MOM AND POP GOVERNANCE CENTER
            ------------------------------------------------------------- */}
        <section id="governance-center" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-[#0F2749] tracking-tight">
              Governance Protected by the Tdex Constitution
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2">
              Article 5 locks in: One human owner, one vote. Real everyday parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between space-y-4">
              <div className="w-full h-44 rounded-lg overflow-hidden">
                <img
                  src="/assets/aistudio/Discovery_Exchange_Parents_Alliance_Community_Banner_6a3e2b57.png"
                  alt="Board"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0F2749]">Board Room</h4>
                <p className="text-xs text-slate-600 mt-1">Real everyday moms and pops rotate onto the governing board.</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChambersWithTab ? onOpenChambersWithTab("boardroom") : onOpenChambers()}
                className="w-full py-2.5 text-xs font-bold text-[#0A1F3D] bg-amber-200 hover:bg-amber-300 rounded-lg transition cursor-pointer"
              >
                Enter Board Room &rarr;
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between space-y-4">
              <div className="w-full h-44 rounded-lg overflow-hidden">
                <img
                  src="/assets/aistudio/internalc_1__35ed2e90.jpg"
                  alt="Court"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0F2749]">Courtroom</h4>
                <p className="text-xs text-slate-600 mt-1">Constitutional dispute handling and rule enforcement.</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChambersWithTab ? onOpenChambersWithTab("courtroom") : onOpenChambers()}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#0F2749] hover:bg-[#173866] rounded-lg transition cursor-pointer"
              >
                Enter Courtroom &rarr;
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between space-y-4">
              <div className="w-full h-44 rounded-lg overflow-hidden">
                <img
                  src={dxpaEveryoneTogetherImg}
                  alt="Chat"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0F2749]">Owners Council</h4>
                <p className="text-xs text-slate-600 mt-1">Open forum where families deliberate together.</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChambersWithTab ? onOpenChambersWithTab("council") : onOpenChambers()}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#0F2749] hover:bg-[#173866] rounded-lg transition cursor-pointer"
              >
                Enter Owners Chat &rarr;
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
