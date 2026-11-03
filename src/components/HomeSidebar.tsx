import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Camera, CheckCircle2, RefreshCw } from "lucide-react";

const SIDEBAR_IMAGES = [
  {
    src: "/assets/aistudio/DXPA_small_window_hero_pic__1_f041e0a3.png",
    alt: "Garage to Skyscraper Concept",
    caption: "The Vision: From Small Trades to Major Ownership."
  },
  {
    src: "/assets/aistudio/Sunny_Suburban_Garage_Sale_Scene_40932d66.png",
    alt: "The Family Exchange",
    caption: "The Start: Your Garage is the Seed of the Future."
  },
  {
    src: "/assets/aistudio/live_bank_auction_clean.jpg",
    alt: "Bank Auction Execution",
    caption: "The Power: Collective Cash at the Auction Block."
  },
  {
    src: "/assets/aistudio/Same_family__rising_gas_prices_2__36652c0f.png",
    alt: "Family Kitchen Table",
    caption: "The Promise: Protecting Your Kitchen Table."
  }
];

const DISCOVERY_QUOTES = [
  "If you can clean your garage, you can own a skyscraper.",
  "We buy everything 100% debt-free.",
  "70% of rent goes back to your family. 30% rewards our children.",
  "One Human, One Vote. The mission outlasts its builders.",
  "Protect the money. Protect the families. Protect the mission.",
  "If you can handle a garage sale, you can handle commercial property.",
  "We don't need corporate banks. We have each other."
];

export const HomeSidebar: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  // The Heartbeat: Quote rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % DISCOVERY_QUOTES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Image rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % SIDEBAR_IMAGES.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="space-y-8 sticky top-28">
      {/* HEARTBEAT: Discovery of the Day */}
      <section className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Heartbeat</span>
          <span className="text-[10px] font-mono text-stone-400">Live</span>
        </div>
        <div className="min-h-[100px] flex items-center justify-center text-center">
          <p className="text-lg font-serif italic text-[#1c1917] leading-relaxed animate-in fade-in duration-1000">
            &ldquo;{DISCOVERY_QUOTES[quoteIndex]}&rdquo;
          </p>
        </div>
        <div className="flex justify-center gap-1">
          {DISCOVERY_QUOTES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-500 ${idx === quoteIndex ? "w-4 bg-amber-500" : "w-1 bg-stone-200"}`}
            />
          ))}
        </div>
      </section>

      {/* PICTURES: Visual Gallery */}
      <section className="space-y-4">
        <div className="bg-white p-2 rounded-sm border border-stone-200 shadow-xl overflow-hidden group">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
            <img 
              src={SIDEBAR_IMAGES[imageIndex].src} 
              alt={SIDEBAR_IMAGES[imageIndex].alt}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs font-bold leading-tight drop-shadow-md">
                {SIDEBAR_IMAGES[imageIndex].caption}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex gap-2">
            <button 
              onClick={() => setImageIndex((prev) => (prev - 1 + SIDEBAR_IMAGES.length) % SIDEBAR_IMAGES.length)}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-stone-400" />
            </button>
            <button 
              onClick={() => setImageIndex((prev) => (prev + 1) % SIDEBAR_IMAGES.length)}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            {imageIndex + 1} / {SIDEBAR_IMAGES.length}
          </span >
        </div>
      </section>

      {/* GOVERNANCE PROGRESS */}
      <section className="p-6 bg-white border border-stone-200 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Governance</span>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-800 uppercase tracking-widest">Master Trust Setup</p>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Completed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-800 uppercase tracking-widest">Fiscal Sponsorship</p>
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest italic animate-pulse">Submitted (In Review)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 opacity-30">
            <div className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-800 uppercase tracking-widest">Google Grants</p>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Pending Approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS / INFO */}
      <section className="p-6 bg-stone-900 rounded-sm text-white space-y-4 shadow-2xl">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Platform Status</p>
          <p className="text-xl font-serif font-bold">100% Debt-Free</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Ownership Model</p>
          <p className="text-xl font-serif font-bold">1 Human, 1 Vote</p>
        </div>
      </section>
    </aside>
  );
};

