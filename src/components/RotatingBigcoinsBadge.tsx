import React, { useEffect, useState } from "react";
import { ArrowLeftRight, Coins, ExternalLink, Info, Sparkles, X } from "lucide-react";
import { pipAudio } from "../utils/pipSoundEffects";

export interface BigcoinItem {
  id: "washington" | "liberty" | "letter_d";
  name: string;
  subtitle: string;
  symbol: string;
  motto: string;
  description: string;
  iconType: "washington" | "liberty" | "letter_d";
  badgeColor: string;
}

const BIGCOINS: BigcoinItem[] = [
  {
    id: "washington",
    name: "George Washington Discovery Bigcoin",
    subtitle: "Civic Bedrock & Founders Standard",
    symbol: "1776 – 2026",
    motto: "Founding Discovery & Public Trust",
    description:
      "Embossed with George Washington and the founding fathers. Represents constitutional integrity, civic bedrock, and the rule that capital never buys extra voting rights in Dexpa.",
    iconType: "washington",
    badgeColor: "from-amber-400 via-yellow-500 to-amber-600",
  },
  {
    id: "liberty",
    name: "Statue of Liberty Discovery Bigcoin",
    subtitle: "Torch of Freedom & Opportunity",
    symbol: "LIBERTY 2026",
    motto: "Opportunity for Every Public School Family",
    description:
      "Carries Lady Liberty's torch and crown. Backed by shared property participation—freeing everyday families from insider debt and funding the National K–12 Discovery Prize.",
    iconType: "liberty",
    badgeColor: "from-emerald-400 via-teal-500 to-amber-500",
  },
  {
    id: "letter_d",
    name: "Discovery Letter 'D' Bigcoin",
    subtitle: "Compass, Quill & Starry Globe",
    symbol: "TDEX – BIGCOIN",
    motto: "Real Participation. Backed by Real Estate.",
    description:
      "The official flagship crest featuring the golden Letter 'D' with the voyager's compass and golden feather quill. A participation unit backed by tangible neighborhood assets.",
    iconType: "letter_d",
    badgeColor: "from-yellow-400 via-amber-500 to-yellow-600",
  },
];

export const RotatingBigcoinsBadge: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 5 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused || isInfoOpen) return;
    const interval = setInterval(() => {
      rotateToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, isInfoOpen, currentIndex]);

  const rotateToNext = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % BIGCOINS.length);
      setIsSpinning(false);
    }, 450);
  };

  const currentCoin = BIGCOINS[currentIndex];

  const renderCoinArtwork = (coin: BigcoinItem) => {
    switch (coin.iconType) {
      case "washington":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="goldGradWash" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="50%" stopColor="#D4A017" />
                <stop offset="100%" stopColor="#8C5C00" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#goldGradWash)" stroke="#FFE87C" strokeWidth="3" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#FFE87C" strokeWidth="1" strokeDasharray="2,2" />
            {/* Washington Profile Silhouette */}
            <path
              d="M48 24 C55 24 60 28 60 34 C60 37 58 40 56 42 C62 44 64 48 64 54 C64 57 62 60 59 62 C61 66 62 72 63 78 L37 78 C38 72 40 68 43 62 C40 59 38 55 38 50 C38 46 41 42 41 38 C41 32 44 24 48 24 Z"
              fill="#523600"
              opacity="0.85"
            />
            {/* Stars */}
            <text x="50" y="87" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#3D2600" letterSpacing="0.8">
              ★ 1776 – 2026 ★
            </text>
            <text x="50" y="18" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#3D2600" letterSpacing="1">
              GEORGE WASHINGTON
            </text>
          </svg>
        );

      case "liberty":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="goldGradLib" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#E9F7EF" />
                <stop offset="45%" stopColor="#2E865F" />
                <stop offset="100%" stopColor="#143D2B" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#goldGradLib)" stroke="#A3E4D7" strokeWidth="3" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#D4EFDF" strokeWidth="1" strokeDasharray="3,2" />
            {/* Lady Liberty Crown & Torch */}
            <path
              d="M32 44 L37 32 L44 42 L50 28 L56 42 L63 32 L68 44 C68 56 60 66 50 68 C40 66 32 56 32 44 Z"
              fill="#D4EFDF"
              opacity="0.9"
            />
            {/* Torch Flame */}
            <path d="M50 70 L48 78 L52 78 Z" fill="#F9E79F" />
            <text x="50" y="87" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#E8F8F5" letterSpacing="0.8">
              ★ LIBERTY 2026 ★
            </text>
            <text x="50" y="18" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#E8F8F5" letterSpacing="1">
              DISCOVERY BIGCOIN
            </text>
          </svg>
        );

      case "letter_d":
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="goldGradD" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF7CC" />
                <stop offset="45%" stopColor="#D4A017" />
                <stop offset="100%" stopColor="#7A5200" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#goldGradD)" stroke="#FFE87C" strokeWidth="3" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#FFF2A3" strokeWidth="1" strokeDasharray="2,2" />
            {/* Iconic Letter D */}
            <text
              x="44"
              y="63"
              textAnchor="middle"
              fontSize="44"
              fontFamily="serif"
              fontWeight="bold"
              fill="#422B00"
              filter="drop-shadow(1px 2px 2px rgba(255,255,255,0.4))"
            >
              D
            </text>
            {/* Quill Accent */}
            <path
              d="M52 35 C58 42 66 50 68 64 C64 63 60 60 56 55"
              fill="none"
              stroke="#FFF2A3"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="50" y="87" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#3D2600" letterSpacing="0.8">
              ★ BIGCOIN ★
            </text>
            <text x="50" y="18" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#3D2600" letterSpacing="1">
              THE DISCOVERY EXCHANGE
            </text>
          </svg>
        );
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative group inline-flex items-center gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-amber-400/40 shadow-xl select-none"
      >
        {/* Interactive 3D Rotating Coin Disc */}
        <button
          type="button"
          onClick={() => {
            pipAudio.playSpring();
            rotateToNext();
          }}
          title="Click to spin to next Bigcoin!"
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
        >
          <div
            className={`w-full h-full rounded-full transition-transform duration-500 ${
              isSpinning ? "coin-spin-active" : ""
            }`}
          >
            {renderCoinArtwork(currentCoin)}
          </div>
          {/* Subtle spinning sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none opacity-60" />
        </button>

        {/* Coin Label & Quick Selector */}
        <div className="flex flex-col justify-center pr-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Discovery Bigcoin</span>
            <span className="text-white/40">·</span>
            <span className="text-white/70 font-mono">
              {currentIndex + 1}/3
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-[170px] sm:max-w-[210px]">
            {currentCoin.name.replace(" Discovery Bigcoin", "")}
          </p>

          <div className="flex items-center gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => {
                pipAudio.playChirp();
                setIsInfoOpen(true);
              }}
              className="text-[11px] text-amber-200/90 hover:text-white underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              Coin Book
            </button>

            <span className="text-white/30">|</span>

            {/* Quick 1-click Coin Switcher Pills */}
            <div className="flex items-center gap-1">
              {BIGCOINS.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    pipAudio.playPop();
                    setCurrentIndex(idx);
                  }}
                  title={c.name}
                  className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                    currentIndex === idx
                      ? "bg-amber-400 scale-110"
                      : "bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Bigcoin Book Modal */}
      {isInfoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsInfoOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-slate-900 border-2 border-amber-400/60 rounded-2xl p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  The Discovery Exchange Bitcoin &amp; Bigcoin Standard
                </p>
                <h3 className="text-xl font-bold text-white mt-1">
                  The Three Approved Discovery Bigcoins
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BIGCOINS.map((coin, idx) => (
                <div
                  key={coin.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2 ${
                    currentIndex === idx
                      ? "bg-amber-400/15 border-amber-400 shadow-md ring-1 ring-amber-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="w-14 h-14">{renderCoinArtwork(coin)}</div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {coin.name}
                  </h4>
                  <p className="text-[10px] text-amber-300 font-medium">
                    {coin.symbol}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Selected: {currentCoin.name}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCoin.description}
              </p>
              <div className="pt-2 text-[11px] text-amber-200/80 font-medium border-t border-white/10">
                Motto: “{currentCoin.motto}”
              </div>
            </div>

            {/* 100,000,000 Fixed Supply & 20%-30% Auction Value-Carrier Summary */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-emerald-400/30 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-emerald-300">
                <span>100,000,000 Fixed Supply · 7 Constitutional Pools</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20">
                  19/19 Dual-QC PASS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-white/10">
                  <div className="font-mono font-bold text-amber-300">50,000,000</div>
                  <div className="text-[10px] text-slate-300">K–12 Prize (50%)</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-white/10">
                  <div className="font-mono font-bold text-emerald-300">45,000,000</div>
                  <div className="text-[10px] text-slate-300">Proof-of-Service (45%)</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-white/10">
                  <div className="font-mono font-bold text-sky-300">5 × 1,000,000</div>
                  <div className="text-[10px] text-slate-300">5 Reserve Pools (5%)</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Starts up the acquisition pool to buy <strong>foreclosure and auction properties at 20% to 30% below market value</strong>—carrying that Day-1 equity while keeping <strong>1 Human Owner = 1 Vote</strong>.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                3-Shard V2 Atomic Protocol · Zero Inflation
              </span>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors"
              >
                Close Book
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
