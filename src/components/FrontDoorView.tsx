import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { HomeLiveSidebar } from "./HomeLiveSidebar";
import { ChambersTabId } from "../types/campaign";

interface FrontDoorViewProps {
  onOpenMarketplace?: () => void;
  onOpenScienceLab?: () => void;
  onOpenChambers?: () => void;
  onOpenChambersWithTab?: (tab: ChambersTabId) => void;
  onOpenStudio?: () => void;
  onOpenConstitution?: () => void;
  onOpenArchitecture?: () => void;
  isOwnerSignupOpen?: boolean;
  onOpenOwnerSignup?: () => void;
  onCloseOwnerSignup?: () => void;
}

const LIVE_TICKER_ITEMS = [
  {
    icon: "⚡",
    label: "LOCAL EXCHANGE",
    text: "148 families traded their garage items this week without using any cash",
  },
  {
    icon: "💎",
    label: "FAIR SPLIT",
    text: "You get cash, you get property, and the buyer gets a reward. Everyone wins.",
  },
  {
    icon: "🏆",
    label: "K–12 PRIZE",
    text: "Judging kids by what they build, not by their zip code. Real cash for real prototypes.",
  },
  {
    icon: "🏛️",
    label: "PROPERTY DEALS",
    text: "We find properties 20% to 30% below market value to protect your family's savings.",
  },
  {
    icon: "⚖️",
    label: "YOUR VOTE MATTERS",
    text: "One Human, One Vote. No membership fees. Wall Street can't buy us out.",
  },
  {
    icon: "🌿",
    label: "RENT FOR FAMILIES",
    text: "70% of building rent goes back to families. 30% stays for our children's prizes.",
  },
];

interface HeroSlide {
  id: number;
  label: string;
  image: string;
  alt: string;
}

const HERO_WINDOWS: HeroSlide[] = [
  {
    id: 1,
    label: "Real Education & Nobel Prize",
    image: "/assets/aistudio/K-12_Discovery_Prize_Celebration_5995532e.png",
    alt: "Real Education & National Discovery Prize - Cash Awards for Students and Teachers across America",
  },
  {
    id: 2,
    label: "Marketplace Family Showcase",
    image: "/assets/hero/hero_2_marketplace_family.jpg",
    alt: "A Little Discovery + A Little Exchange = BIG Discovery Exchange Parents Alliance!",
  },
  {
    id: 3,
    label: "Discovery Bigcoin Over Earth",
    image: "/assets/hero/hero_3_discovery_bigcoin.jpg",
    alt: "You know Bitcoin. Now meet Discovery Bigcoin. World's hottest cryptocurrency, backed up by real estate.",
  },
  {
    id: 4,
    label: "Family Journey to Horizons",
    image: "/assets/hero/hero_4_family_horizons.jpg",
    alt: "Life is too short, and it goes by too fast. Little Moments, Growing Dreams, Bigger Horizons.",
  },
  {
    id: 5,
    label: "Parents Alliance Community",
    image: "/assets/hero/hero_5_parents_alliance.jpg",
    alt: "Discovery Exchange Parents Alliance - I became a real estate owner with only $1000",
  },
  {
    id: 6,
    label: "Family Savings & Honest Scale",
    image: "/assets/hero/hero_6_inflation_politicians.jpg",
    alt: "Our savings account is 50% gone through inflation - Deficit: $5 trillion? Is that all? - Scale and Document",
  },
  {
    id: 7,
    label: "Rising Gas Prices 2016 vs 2026",
    image: "/assets/hero/hero_7_gas_prices.jpg",
    alt: "Same family, rising gas prices in Las Vegas close to $6 - Real People, Real Solutions",
  },
  {
    id: 8,
    label: "Inspiring Future Scholars",
    image: "/assets/hero/hero_8_inspiring_scholars.jpg",
    alt: "The Discovery Exchange - Inspired by the Nobel Prize for K-12 public school students",
  },
  {
    id: 9,
    label: "Friendly Neighborhood Exchange",
    image: "/assets/hero/hero_9_garage_sale.jpg",
    alt: "Friendly Suburban Garage Sale Exchange",
  },
];

export const FrontDoorView: React.FC<FrontDoorViewProps> = ({
  onOpenMarketplace,
  onOpenScienceLab,
  onOpenChambers,
  onOpenStudio,
  onOpenConstitution,
  onOpenArchitecture,
  onOpenOwnerSignup,
}) => {
  // Top Dispatch Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  // Rotating Hero Windows State (Standardized 2000x800 hero pictures)
  const [activeHeroWindow, setActiveHeroWindow] = useState<number>(1);

  // Auto-cycle top live hero ticker every 5 seconds
  useEffect(() => {
    if (isTickerPaused) return;
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 5000);
    return () => clearInterval(tickerTimer);
  }, [isTickerPaused]);

  const activeTicker = LIVE_TICKER_ITEMS[tickerIndex] || LIVE_TICKER_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 w-full max-w-[100vw] overflow-x-hidden">
      


      {/* =========================================================================
          2. UPPER HERO & CONCIERGE ROW
          - Left: 75% width Hero rotating window (2000x800)
          - Right: 25% width Window 1 (Chula Concierge) + Window 2 (Discovery of the Day)
          ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start">
          
          {/* LEFT 75% HERO WINDOW */}
          <div className="w-full lg:w-[75%] flex flex-col">
            <section
              aria-label="Hero Showcase Window"
              className="relative rounded-2xl overflow-hidden border-[3px] border-[#D9A441] shadow-xl flex flex-col select-none bg-slate-950"
            >
              {/* FULL HERO WINDOW: 100% visible, no crop, no blocking overlays */}
              <div
                onClick={onOpenScienceLab}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenScienceLab?.();
                  }
                }}
                title="Discovery Prize - Click to explore"
                className="w-full relative overflow-hidden bg-slate-900 select-none cursor-pointer"
              >
                {(() => {
                  const currentHero =
                    HERO_WINDOWS.find((h) => h.id === activeHeroWindow) ||
                    HERO_WINDOWS[0];
                  return (
                    <img
                      key={currentHero.id}
                      src={currentHero.image}
                      alt={currentHero.alt}
                      className="w-full h-auto block"
                    />
                  );
                })()}
              </div>
            </section>
          </div>

          {/* RIGHT 25% SIDEBAR: WINDOW 1 (CHULA CONCIERGE) + WINDOW 2 (DISCOVERY OF THE DAY) */}
          <div className="w-full lg:w-[25%] select-none flex flex-col">
            <HomeLiveSidebar
              mode="topWindows"
              className="h-full flex flex-col justify-between"
              onOpenMarketplace={onOpenMarketplace}
              onOpenScienceLab={onOpenScienceLab}
              onOpenChambers={onOpenChambers}
              onOpenOwnerSignup={onOpenOwnerSignup}
              onOpenStudio={onOpenStudio}
              onOpenConstitution={onOpenConstitution}
              onOpenArchitecture={onOpenArchitecture}
            />
          </div>

        </div>
      </div>

      {/* =========================================================================
          3. LIVE DISPATCH TICKER (MOVED RIGHT BELOW HERO PICTURES!)
          As instructed: "moving that dispatch whole window down below the hero pictures"
          ========================================================================= */}
      <section
        aria-label="Live Dispatch Ticker"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
        className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 my-3 select-none"
      >
        <div className="w-full bg-[#081528] text-white border-[2px] border-[#D9A441]/80 rounded-xl shadow-lg px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Ticker Indicator & Current Rotating Item */}
          <div className="flex items-center gap-3.5 overflow-hidden min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-black uppercase tracking-wider text-xs shrink-0 border border-emerald-500/40">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block shrink-0" />
              <span>LIVE DISPATCH</span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-lg shrink-0">{activeTicker.icon}</span>
              <span className="font-bold text-[#F3C969] shrink-0 uppercase tracking-wide text-xs sm:text-sm">
                {activeTicker.label}:
              </span>
              <span className="text-white truncate font-semibold text-xs sm:text-sm">
                {activeTicker.text}
              </span>
            </div>
          </div>

          {/* Quick Metric Badges & Ticker Controls */}
          <div className="flex items-center gap-4 shrink-0 text-slate-200 font-sans text-xs sm:text-sm font-medium">
            <div className="hidden lg:flex items-center gap-4">
              <span>
                <strong className="text-white text-sm sm:text-base font-bold font-mono">1,420</strong> Families
              </span>
              <span className="text-slate-600">·</span>
              <span>
                <strong className="text-emerald-400 text-sm sm:text-base font-bold font-mono">$42.5k/mo</strong> Distributable Rent
              </span>
              <span className="text-slate-600">·</span>
              <span>
                <strong className="text-amber-300 text-sm sm:text-base font-bold font-mono">312</strong> Student Projects
              </span>
              <span className="text-slate-600">·</span>
              <span>
                <strong className="text-sky-300 text-sm sm:text-base font-bold font-mono">Zero</strong> Platform Dues
              </span>
            </div>

            {/* Ticker Step Navigation */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
              <button
                type="button"
                onClick={() =>
                  setTickerIndex(
                    (prev) => (prev - 1 + LIVE_TICKER_ITEMS.length) % LIVE_TICKER_ITEMS.length
                  )
                }
                aria-label="Previous alert"
                title="Previous alert"
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsTickerPaused(!isTickerPaused)}
                aria-label={isTickerPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                title={isTickerPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
              >
                {isTickerPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() =>
                  setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length)
                }
                aria-label="Next alert"
                title="Next alert"
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SERENE BLUE SKY CANVAS (FULL WIDTH AT BOTTOM FOR UPCOMING STUFF)
          As instructed: "The sky picture goes in the bottom where we're going to be adding more stuff"
          ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-1 pb-16">
        <section
          aria-label="Community Sky Canvas"
          style={{
            backgroundImage: "url('/assets/serene_blue_sky.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-full min-h-[500px] rounded-2xl overflow-hidden border-[3px] border-[#D9A441] shadow-xl relative"
        >
          {/* Top Architectural Architrave Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D9A441] via-[#FFE78A] to-[#D9A441] border-b border-[#8C6316] z-20 pointer-events-none" />
          
          {/* Serene canvas ready for future additions */}
        </section>
      </div>

    </div>
  );
};
