import React, { useState, useEffect } from "react";
import {
  LogIn,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Building2,
  Scale,
  Users,
  Gavel,
  MessageSquare,
  Volume2,
} from "lucide-react";
import { AnimatedPipConcierge } from "./AnimatedPipConcierge";
import { WorkspaceView } from "../types/campaign";

export interface NewFrontPageViewProps {
  onOpenMarketplace?: () => void;
  onOpenScienceLab?: () => void;
  onOpenChambers?: () => void;
  onOpenConstitution?: () => void;
  onOpenOwnerSignup?: () => void;
}

// 19 curated educational & discovery quotes for Discovery of the Day
const DISCOVERY_QUOTES = [
  {
    quote: "Education is not the learning of facts, but the training of the mind to think.",
    author: "Albert Einstein",
  },
  {
    quote: "The mind that opens to a new idea never returns to its original size.",
    author: "Oliver Wendell Holmes",
  },
  {
    quote: "Tell me and I forget. Teach me and I reOwner. Involve me and I learn.",
    author: "Benjamin Franklin",
  },
  {
    quote: "If you cannot explain something in three sentences or less, most likely you don't understand what you're talking about.",
    author: "Discovery Exchange Master Principle",
  },
  {
    quote: "Start saving by owning. When families own, their children rise.",
    author: "Dexpa Founding Charter",
  },
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  },
  {
    quote: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
  },
  {
    quote: "It is the supreme art of the teacher to awaken joy in creative expression and knowledge.",
    author: "Albert Einstein",
  },
  {
    quote: "What we observe is not nature itself, but nature exposed to our method of questioning.",
    author: "Werner Heisenberg",
  },
  {
    quote: "Equipping children with real knowledge is the highest form of patriotism.",
    author: "TDEX Mission Statement",
  },
  {
    quote: "Do not train a child to learn by force or harshness, but direct them to it by what amuses their minds.",
    author: "Plato",
  },
  {
    quote: "The greatest discovery of all time is that a person can change his future by merely changing his attitude.",
    author: "Oprah Winfrey",
  },
  {
    quote: "Science is a way of thinking much more than it is a body of knowledge.",
    author: "Carl Sagan",
  },
  {
    quote: "The only source of knowledge is experience.",
    author: "Albert Einstein",
  },
  {
    quote: "Protect the money. Protect the families. Protect the educational mission.",
    author: "The Automated Shield Mandate",
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    quote: "The road to success is always under construction.",
    author: "Discovery Exchange Founder Principle",
  },
  {
    quote: "Discovery does not ask where the lesson came from.",
    author: "TDEX Core Tenet",
  },
  {
    quote: "One Owner, One Vote: Capital does not buy political power in Dexpa.",
    author: "Article 5 Constitutional Guarantee",
  },
];

interface HeroSlideData {
  id: string;
  tag: string;
  imageSrc: string;
  altText: string;
  title: string;
  headlinePrefix?: string;
  headlineMain?: string;
  headlineHighlight?: string;
  bodyParagraph1: string;
  bodyParagraph2?: string;
  closingQuote?: string;
  readMoreDetails: string;
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "national-crossroads",
    tag: "01 · National Crossroads",
    imageSrc: "/assets/aistudio/hero_pic_one_clean.jpg",
    altText: "Crisis in K-12 to Nobel-Inspired Discovery Prize",
    title: "The Discovery Exchange - Parents Alliance (Tdex a.k.a Dexpa)",
    headlinePrefix: "We Must Go From This",
    headlineMain: "→",
    headlineHighlight: "To This",
    bodyParagraph1:
      "On our watch, in “the land of the free and the home of the brave,” our K–12 students have fallen to 26th place in mathematics and 10th in science globally.",
    bodyParagraph2:
      "And as if that weren't alarming enough, In Oregon, students no longer have to prove they can read, write, or do math to graduate.",
    closingQuote: "Was the 2006 movie “Idiocracy” a comedy or a prophecy?",
    readMoreDetails:
      "The right solution turns a problem into an opportunity. Instead of putting families under more financial stress by asking for donations, we turned the idea of giving into an opportunity for owning. To make this possible, we created two programs: the 70/30 real estate ownership program and the 50/25/25 Discovery Marketplace. Together, these programs help families build debt-free ownership, protect their savings from inflation, and fund thousands of Discovery Prize cash awards for students and teachers nationwide.",
  },
  {
    id: "garage-exchange",
    tag: "02 · 50/25/25 Marketplace",
    imageSrc: "/assets/aistudio/64a2cf8e-ceaf-40ce-aec4-060a30729ff6_da6db4d0.png",
    altText: "Turn What's Hiding in Your Closet and Garage into Real Estate Equity",
    title: "The 50/25/25 Discovery Marketplace · Invest Without Money",
    headlinePrefix: "Turn Closet & Garage Treasures",
    headlineMain: "→",
    headlineHighlight: "Into Rental Real Estate Equity",
    bodyParagraph1:
      "Stop singing Kumbaya in the closet! Most families don't have thousands in spare cash, but nearly every household has $1,500 to $4,000 worth of quality unused items sitting in garages, closets, and attics.",
    bodyParagraph2:
      "Through our 50/25/25 formula, selling unused household goods gets you 50% instant cash, 25% to your real estate equity wallet, and 25% to the buyer's equity wallet.",
    closingQuote: "“You don't need a dime from your paycheck to start owning cash-flowing rental real estate.”",
    readMoreDetails:
      "Everyday items—guitars, power tools, bicycles, electronics, and lawn equipment—are converted into debt-free rental property shares and D Bigcoins. Both buyer and seller build long-term generational wealth without spending a single dollar of new cash.",
  },
  {
    id: "bank-auctions",
    tag: "03 · Bank Auctions",
    imageSrc: "/assets/aistudio/live_bank_auction_clean.jpg",
    altText: "Live Residential Foreclosure Auction in an American Neighborhood",
    title: "Dexpa Bank-Owned & Real Estate Auction Engine",
    headlinePrefix: "Cooperative Buying Power",
    headlineMain: "→",
    headlineHighlight: "Purchasing 30% Below Market",
    bodyParagraph1:
      "Everyday families pool resources to participate in bank-owned property auctions from $500 up to a strict cap of $250,000 per family.",
    bodyParagraph2:
      "By combining collective cash-buying power, Dexpa acquires residential properties at least 30% below market value. Net rental yields follow our unalterable 70/30 standard.",
    closingQuote: "“Start saving by owning: 70% to families, 30% to the National Discovery Prize.”",
    readMoreDetails:
      "70% of distributable net rental income returns straight to participating families. 30% permanently fuels the National K–12 Discovery Prize. By eliminating speculative greed and securing assets under our Automated Shield, families grow reliable, recurring wealth while powering educational excellence.",
  },
  {
    id: "nobel-prize-vision",
    tag: "04 · Discovery Prize",
    imageSrc: "/assets/aistudio/header_01_national_discovery_prize_f8dc3dfc.webp",
    altText: "National Discovery Prize for K-12 Students and Teachers",
    title: "Inspired by the Nobel Prize · The National Discovery Prize",
    headlinePrefix: "Turning Family Prosperity",
    headlineMain: "→",
    headlineHighlight: "Into Educational Achievement",
    bodyParagraph1:
      "Conceived from the visionary spirit of the Nobel Prize, TDEX created the National Discovery Prize to motivate thousands of American K–12 students and teachers with meaningful cash awards that recognize learning, improvement, creativity, experimentation, and practical problem-solving.",
    bodyParagraph2:
      "Rather than relying solely on donations or government funding, the long-term goal is to establish a recurring economic engine that helps sustain educational opportunities.",
    closingQuote: "“TDEX exists to inspire discovery. Dexpa exists to help fund it. The Discovery Prize rewards it.”",
    readMoreDetails:
      "Rather than relying on government grants or charity drives, our economic engine automatically directs 30% of property net rental distributions into student cash prizes and teacher classroom grants—100% evaluated through blind judging codes without zip-code bias.",
  },
];

export function NewFrontPageView({
  onOpenMarketplace,
  onOpenScienceLab,
  onOpenChambers,
  onOpenConstitution,
  onOpenOwnerSignup,
}: NewFrontPageViewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

  // Discovery of the Day index (index 3 is quote #4)
  const [quoteIndex, setQuoteIndex] = useState(3);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setIsReadMoreOpen(false);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setIsReadMoreOpen(false);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + DISCOVERY_QUOTES.length) % DISCOVERY_QUOTES.length);
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % DISCOVERY_QUOTES.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* =========================================================================
          TOP NAVIGATION BAR (Clean, Classic Black & White)
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-10 sm:h-12 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
              D
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                The Discovery Exchange · Parents Alliance
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                TDEX · Dexpa
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={onOpenMarketplace}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Marketplace
            </button>
            <button
              type="button"
              onClick={onOpenScienceLab}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Challenge Room
            </button>
            <button
              type="button"
              onClick={onOpenConstitution}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Tdex Constitution
            </button>
            <button
              type="button"
              onClick={onOpenChambers}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Owners Board
            </button>
          </nav>

          {/* Right Action: Clean Owners Log In */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenOwnerSignup}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Owners Log In</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER: 2-COLUMN WIREFRAME GRID
          Left Column (Scrollable Main Body)
          Right Column (STABLE / STICKY: Pip Concierge + Discovery of the Day)
          ========================================================================= */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-0 pb-96">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* -------------------------------------------------------------------
              LEFT COLUMN (col-span-8 or 9): Main Stage
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* ===============================================================
                1. HERO SECTION (Picture + Synchronized text directly underneath in clean white card)
                =============================================================== */}
            <section className="bg-white border-b border-slate-200 shadow-sm overflow-hidden">
              
              {/* Header bar of the hero card */}
              <div className="bg-slate-50 px-4 sm:px-6 py-2 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {currentSlide.tag}
                  </span>
                  <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{currentSlide.headlinePrefix}</span>
                    <span className="text-slate-400 font-light">{currentSlide.headlineMain}</span>
                    <span className="text-slate-900 font-bold">{currentSlide.headlineHighlight}</span>
                  </h1>
                </div>

                {/* Rotating Controls (Next / Prev / Auto-play) */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    title={isAutoPlaying ? "Pause auto-rotate" : "Start auto-rotate"}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isAutoPlaying
                        ? "bg-slate-900 text-white font-bold"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hero Picture Frame (Flush) */}
              <div className="w-full h-64 sm:h-80 overflow-hidden bg-white relative group border-b border-slate-200">
                <img
                  src={currentSlide.imageSrc}
                  alt={currentSlide.altText}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              {/* DIRECTLY UNDERNEATH: Clean Black & White Text Card (No Sky, No Extra Colors) */}
              <div className="p-6 sm:p-8 bg-white border-t border-slate-200 text-center">
                <div className="max-w-2xl mx-auto space-y-3">
                  
                  {/* Title / Organization Identifier */}
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {currentSlide.title}
                  </h2>

                  {/* Body Paragraph 1 */}
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                    {currentSlide.bodyParagraph1}
                  </p>

                  {/* Body Paragraph 2 (if present) */}
                  {currentSlide.bodyParagraph2 && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentSlide.bodyParagraph2}
                    </p>
                  )}

                  {/* Closing Punchline / Question */}
                  {currentSlide.closingQuote && (
                    <p className="text-sm sm:text-base font-bold text-slate-900 pt-1 tracking-tight">
                      {currentSlide.closingQuote}
                    </p>
                  )}

                  {/* Clean Read More link & Slide Dots */}
                  <div className="pt-3 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                      className="text-xs font-semibold text-slate-900 underline hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {isReadMoreOpen ? "Show Less ↑" : "Read more →"}
                    </button>

                    {/* Slide indicator dots */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {HERO_SLIDES.map((slide, idx) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => {
                            setCurrentSlideIndex(idx);
                            setIsReadMoreOpen(false);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            currentSlideIndex === idx ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isReadMoreOpen && (
                    <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-left text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                      <p>{currentSlide.readMoreDetails}</p>
                      <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-200 text-xs font-semibold text-slate-900">
                        <span>• 70% to Participating Families</span>
                        <span>• 30% to National Discovery Prize</span>
                        <span>• $500 Minimum to $250,000 Cap</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </section>

            {/* ===============================================================
                2. MIDDLE SECTION: REAL ESTATE AUCTION ENGINE
                =============================================================== */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Real Property Acquisition Engine</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Bank-Owned &amp; Foreclosure Real Estate Auctions
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-900" />
                  <span className="text-xs font-mono font-medium text-slate-600">Live Auction Radar Active</span>
                </div>
              </div>

              {/* The Clean Bank Auction Photograph */}
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                <img
                  src="/assets/aistudio/live_bank_auction_clean.jpg"
                  alt="Dexpa Bank-Owned & Real Estate Auction Engine"
                  className="w-full h-auto object-cover max-h-[440px]"
                />
              </div>

              {/* Cooperative Power & 3 Pillars */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>The Cooperative Advantage: Purchasing at Least 30% Below Market Price</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    By combining the collective purchasing strength of thousands of everyday families, Dexpa enters judicial and bank-owned foreclosure auctions with all-cash acquisition power. This enables the alliance to secure high-quality residential properties at <span className="font-semibold text-slate-900">at least 30% below fair market value</span>, eliminating high-interest predatory mortgages and giving everyday parents immediate built-in equity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      1. Direct Bank Pipeline
                    </h5>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Real-time nationwide radar tracking bank-owned foreclosures, judicial sales, and distressed properties acquired at steep 30%+ discounts.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      2. Family Equity Pooling
                    </h5>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Everyday parents can participate starting from $500 up to a strict maximum cap of $250,000 per family, ensuring working families remain in control.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      3. The 70/30 Standard
                    </h5>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Actual documented expenses are paid first. Remaining net rental income is split: 70% directly to participating families and 30% to the K–12 Discovery Prize.
                    </p>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  INTRODUCING THE D BIGCOIN (Directly under Auction & 70/30 explanation)
                  ------------------------------------------------------------- */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        D
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                          Tangible Cooperative Digital Equity
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          Introducing the D Bigcoin: Backed by Real Property Deeds
                        </h4>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      Symbol: TDEX-BIGCOIN
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    When you participate in our cooperative bank-property purchases, your fractional ownership is minted and tracked through the <strong className="font-semibold text-slate-900">Discovery Letter “D” Bigcoin</strong>. Unlike speculative cryptocurrencies created out of thin air, every D Bigcoin is anchored by physical, debt-free residential properties purchased at 30%+ below market value under the unalterable Automated Shield.
                  </p>

                  {/* 3 Pillars of D Bigcoin */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-slate-900">100% Deed-Backed</div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        Every D Bigcoin represents verifiable, audited equity in actual single-family homes and rental properties. Zero speculation.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-slate-900">70% Rental Income Stream</div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        Holders receive their proportional 70% share of monthly net rental yields automatically deposited into their Dexpa Wallet.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-slate-900">Automatic Award Accrual</div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        Participating families receive D Bigcoins with every property acquired, locking in inflation-proof generational savings.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                    <span>Protected by Constitution V6.3 · Never Pledged, Mortgaged, or Diluted</span>
                    <span className="font-mono text-slate-700">1 D Bigcoin = Documented Property Unit</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ===============================================================
                3. THE 50/25/25 DISCOVERY MARKETPLACE SECTION
                "Invest in Real Estate Without Spending Money"
                =============================================================== */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Zero-Cash Real Estate Pathway</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Now, The Marketplace Gives You an Even Better Option:
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    Invest Into Real Estate Property Rentals Without Using Any Money
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenMarketplace}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Open 50/25/25 Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* The Discovery Marketplace Hero Picture */}
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                <img
                  src="/assets/aistudio/64a2cf8e-ceaf-40ce-aec4-060a30729ff6_da6db4d0.png"
                  alt="Turn What's Hiding in Your Closet and Garage into Real Estate Equity"
                  className="w-full h-auto object-cover max-h-[440px]"
                />
              </div>

              {/* Explanatory text matching user's exact concept */}
              <div className="space-y-3">
                <p className="text-sm text-slate-800 leading-relaxed">
                  Most working families don&apos;t have thousands of dollars in spare cash sitting around to buy into real estate deals. But almost every household has <strong className="font-semibold text-slate-900">$1,500 to $4,000 worth of quality unused items</strong> sitting in their garage, basement, or closet—bicycles, tools, musical instruments, sports gear, lawnmowers, and electronics.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Through the <strong className="font-semibold text-slate-900">50/25/25 Discovery Marketplace</strong>, you don&apos;t need to take a single dollar from your paycheck or touch your emergency savings to start owning cash-flowing rental real estate. Every transaction automatically funds real property shares:
                </p>
              </div>

              {/* The 50 / 25 / 25 Three Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">50%</div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">
                      Direct Cash to Seller
                    </h5>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      The seller takes home 50% in instant cash for goods they were no longer using anyway.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-700">
                    Immediate household cash
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">25%</div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">
                      Seller&apos;s Dexpa Wallet
                    </h5>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      25% is automatically deposited into the seller&apos;s Dexpa Wallet toward real estate rental equity &amp; D Bigcoins.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-700">
                    Builds rental equity with no cash
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">25%</div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">
                      Buyer&apos;s Dexpa Wallet
                    </h5>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      The buyer also receives 25% credited to their own Dexpa Wallet toward property shares just for buying within the cooperative.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-700">
                    Buyers earn real estate automatically
                  </div>
                </div>
              </div>

              {/* Bottom Callout Banner */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">
                    Turn your garage into real estate rental property ownership.
                  </div>
                  <div className="text-slate-600">
                    No initial investment required. Trade everyday items and start receiving 70% rental distributions.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenMarketplace}
                  className="shrink-0 inline-flex items-center gap-1.5 font-semibold text-slate-900 underline hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <span>Browse Available Listings →</span>
                </button>
              </div>
            </section>

            {/* ===============================================================
                3. BOTTOM SECTION: OWNER GOVERNANCE CENTER
                =============================================================== */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-slate-800" />
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Owner Governance Center
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  Constitution Version 6.3 Master
                </span>
              </div>

              {/* Strip Image */}
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src="/assets/aistudio/governance_center_strip.jpg"
                  alt="Owner Governance Center: Rotating Board of Directors, Internal Arbitration Court, Owners Chat Room"
                  className="w-full h-auto object-cover max-h-[300px]"
                />
              </div>

              {/* Chamber buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <button
                  type="button"
                  onClick={onOpenChambers}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all text-center group cursor-pointer"
                >
                  <Users className="w-5 h-5 mx-auto text-slate-700 mb-1" />
                  <span className="text-xs font-bold text-slate-900 block">Board Room</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Official proposals &amp; votes</span>
                  <span className="mt-2 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter Board Room →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onOpenChambers}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all text-center group cursor-pointer"
                >
                  <Gavel className="w-5 h-5 mx-auto text-slate-700 mb-1" />
                  <span className="text-xs font-bold text-slate-900 block">Arbitration Court</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Constitutional dispute review</span>
                  <span className="mt-2 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter Courtroom →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onOpenChambers}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all text-center group cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 mx-auto text-slate-700 mb-1" />
                  <span className="text-xs font-bold text-slate-900 block">Owners Chat Room</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Live owner discussions</span>
                  <span className="mt-2 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter Chat Room →
                  </span>
                </button>
              </div>
            </section>

          </div>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN: STABLE / STICKY SIDEBAR (Clean Black & White)
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-4 xl:col-span-3 sticky top-20 space-y-6">

            {/* BOX 1: CONCIERGE (Clean Neutral Card) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  The Discovery Exchange Concierge
                </span>
                <Volume2 className="w-4 h-4 text-slate-500" />
              </div>

              {/* Pip Mascot */}
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2">
                <AnimatedPipConcierge
                  mode="embedded"
                  activeView={WorkspaceView.FRONT_DOOR}
                  onNavigateView={(view: WorkspaceView) => {
                    if (view === WorkspaceView.CONSTITUTION && onOpenConstitution) onOpenConstitution();
                    if (view === WorkspaceView.MARKETPLACE && onOpenMarketplace) onOpenMarketplace();
                    if (view === WorkspaceView.CHAMBERS && onOpenChambers) onOpenChambers();
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-snug">
                I am your concierge, Ask me anything 24/7 about Dexpa ownership or the Discovery Prize.
              </p>
            </div>

            {/* BOX 2: DISCOVERY OF THE DAY (Clean White Card with < 4 of 19 > Navigation) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              {/* Header */}
              <div className="bg-slate-50 -mx-4 -mt-4 p-3 rounded-t-xl border-b border-slate-200 flex items-center justify-between text-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono">
                    Dexpa • TODAY
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Discovery of the Day
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Oct 31
                </span>
              </div>

              {/* Quote Content Body */}
              <div className="py-3.5 px-2 min-h-[110px] flex flex-col justify-center text-center space-y-2">
                <p className="text-base sm:text-lg font-serif italic text-slate-900 leading-relaxed font-bold">
                  “{DISCOVERY_QUOTES[quoteIndex].quote}”
                </p>
                <p className="text-xs font-sans font-bold text-slate-700 uppercase tracking-wider">
                  — {DISCOVERY_QUOTES[quoteIndex].author}
                </p>
              </div>

              {/* Bottom Pagination Controls: < 4 of 19 > */}
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevQuote}
                  aria-label="Previous quote"
                  className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-semibold text-slate-700 font-mono">
                  {quoteIndex + 1} of {DISCOVERY_QUOTES.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextQuote}
                  aria-label="Next quote"
                  className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
