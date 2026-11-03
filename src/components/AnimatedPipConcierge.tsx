import React, { useEffect, useRef, useState } from "react";
import {
  Compass,
  Loader2,
  Maximize2,
  MessageSquare,
  Mic,
  Minimize2,
  RefreshCw,
  Send,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { WorkspaceView } from "../types/campaign";
import { pipAudio } from "../utils/pipSoundEffects";

interface AnimatedPipConciergeProps {
  mode?: "embedded" | "floating";
  activeView?: WorkspaceView;
  onStartVoice?: () => void;
  onAskQuestion?: (prompt: string) => void;
  onNavigateView?: (view: WorkspaceView) => void;
  isVoiceActive?: boolean;
}

interface ConciergeQuoteItem {
  intro: string;
  punchline: string;
  action: string;
  roomTag?: string;
}

const ROOM_CONTEXT_TIPS: Partial<Record<WorkspaceView, ConciergeQuoteItem>> = {
  [WorkspaceView.MARKETPLACE]: {
    roomTag: "📍 Garage & Auction Guide",
    intro: "You're inside the Parent Garage & Exchange Market!",
    punchline:
      "Every garage trade splits 50/25/25, and we buy foreclosure & auction properties at 20% to 30% below market value—with Discovery BigCoin carrying that instant equity value from startup!",
    action: "How do 20%–30% auction properties & BigCoin work?",
  },
  [WorkspaceView.SCIENCE_LAB]: {
    roomTag: "📍 K–12 Prize Lab Guide",
    intro: "Welcome to the National K–12 Discovery Prize Lab!",
    punchline:
      "Every student project gets locked behind an anonymous TDEX-XXXX-XXXX code so judges score 100% blind—no school name, no zip code, no bias!",
    action: "How does blind judging protect public school kids?",
  },
  [WorkspaceView.CONSTITUTION]: {
    roomTag: "📍 Constitution Guide",
    intro: "Inspecting the Discovery Exchange Constitution!",
    punchline:
      "Article 5 is locked in stone: One Human, One Vote. A parent who joined by trading a toaster has the exact same vote as a millionaire!",
    action: "Explain Article 5: One Human, One Vote",
  },
  [WorkspaceView.CHAMBERS]: {
    roomTag: "📍 Board & Court Guide",
    intro: "Inside the Governance Chambers & Human–AI Council!",
    punchline:
      "Article 4 rule: AI engines organize the math and carry the heavy tools, while humans hold 100% of the legal rights and the voting gavel.",
    action: "How do humans and AI share work in Dexpa?",
  },
  [WorkspaceView.STUDIO]: {
    roomTag: "📍 Campaign Studio Guide",
    intro: "Crafting family-friendly outreach in the Studio!",
    punchline:
      "Keep every message at a kitchen-table Grade 7–8 reading level so tired parents and 10th-graders get the point in 10 seconds flat.",
    action: "Write a 3-sentence pitch for parents",
  },
  [WorkspaceView.FISCAL_SPONSOR]: {
    roomTag: "📍 Non-Profit Status Guide",
    intro: "Securing our official 501(c)(3) foundation status!",
    punchline:
      "We've sent our application to Social Good Fund. Once approved, we unlock a $10,000/mo Google Grant to reach every public school family in America!",
    action: "What are the next steps for the Google Grant?",
  },
};

const GOOFY_CLIPPY_QUOTES: ConciergeQuoteItem[] = [
  {
    intro: "It looks like you're inspecting the Discovery Exchange Constitution...",
    punchline:
      "Article 5 is my absolute favorite: 1 Owner, 1 Vote! Even with my golden medal and titanium springs, Wall Street can't buy an extra ballot!",
    action: "Explain 1 Owner, 1 Vote",
  },
  {
    intro: "Why pay retail when we can buy at auction?",
    punchline:
      "We target foreclosure and auction properties at 20% to 30% below market value—and Discovery BigCoin starts up the pool and carries that instant equity cushion!",
    action: "How do 20%–30% auction properties & BigCoin work?",
  },
  {
    intro: "Where's my tequila?!",
    punchline:
      "Just kidding! I only run on 120V household current and public school science enthusiasm.",
    action: "How does the K–12 Discovery Prize work?",
  },
  {
    intro: "It looks like you're reading Article 4 on Human–AI Partnership...",
    punchline:
      "Humans hold the legal gavel and the vote. I just fetch the jokes, paperclips, and constitutional articles!",
    action: "What is the Human-AI Partnership rule?",
  },
  {
    intro: "Notice the 50 / 25 / 25 split in Article 11?",
    punchline:
      "50% cash to Seller, 25% equity to Seller, and 25% equity to Buyer—plus 70% of monthly building rent back to families!",
    action: "Explain the 50/25/25 split and 70% rent",
  },
  {
    intro: "Did you know I have a golden 'P' medal on my chest?",
    punchline:
      "The 'P' stands for Parents, Prize, and Paperclip—and Discovery BigCoin carries the 20%–30% below-market auction spread from startup!",
    action: "What is Discovery Bigcoin?",
  },
];

const GOOFY_JOKES = [
  "Why did the robot puppy cross the road? Because the algorithm predicted a 99.4% chance of discovery on the other side!",
  "What did the garage sale toaster say to the quantum computer? 'I make bagels, you make qubits, and we both earn 25% Dexpa property equity!'",
  "Why are paperclips the best AI assistants? Because we always hold things together when the garage gets messy!",
  "How many Wall Street brokers does it take to buy an extra vote in Dexpa? Trick question—Article 5 says money can never buy a vote! One Human = One Vote!",
  "Why is my ear always tilted? To listen for kids in public schools inventing cold fusion with copper pipes and soup cans!",
];

export const AnimatedPipConcierge: React.FC<AnimatedPipConciergeProps> = ({
  mode = "embedded",
  activeView,
  onStartVoice,
  onAskQuestion,
  onNavigateView,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [animState, setAnimState] = useState<
    "idle" | "bounce" | "waggle" | "jump"
  >("idle");
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [isFloatingMinimized, setIsFloatingMinimized] = useState(false);
  const [customJoke, setCustomJoke] = useState<string | null>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [useRoomTip, setUseRoomTip] = useState(true);

  // Direct in-bubble live AI Q&A state for floating mode
  const [inlineQuestion, setInlineQuestion] = useState("");
  const [inlineAnswer, setInlineAnswer] = useState<string | null>(null);
  const [isAskingInline, setIsAskingInline] = useState(false);
  const [isSpeakingReply, setIsSpeakingReply] = useState(false);
  const bounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const characterRef = useRef<HTMLDivElement | null>(null);

  // Play jump-in spring bounce on mount
  useEffect(() => {
    setAnimState("jump");
    const t = setTimeout(() => setAnimState("idle"), 800);
    return () => clearTimeout(t);
  }, []);

  // Dynamic Cursor Gaze Tracking: Pip's eyes follow the mouse across the screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = characterRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / 45;
      const deltaY = (e.clientY - centerY) / 45;
      const maxDist = 3.5;

      const gazeX = Math.max(-maxDist, Math.min(maxDist, deltaX));
      const gazeY = Math.max(-maxDist, Math.min(maxDist, deltaY));

      el.style.setProperty("--gaze-x", `${gazeX.toFixed(2)}px`);
      el.style.setProperty("--gaze-y", `${gazeY.toFixed(2)}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Reset to room-specific tip whenever the user switches views
  useEffect(() => {
    if (mode === "floating" && activeView) {
      setUseRoomTip(true);
      setCustomJoke(null);
      setInlineAnswer(null);
    }
  }, [activeView, mode]);

  // Periodic goofy blinking & ear waggles
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 250);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  const speakTextOutLoud = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeakingReply) {
      setIsSpeakingReply(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.08;
    utterance.onend = () => setIsSpeakingReply(false);
    utterance.onerror = () => setIsSpeakingReply(false);
    setIsSpeakingReply(true);
    window.speechSynthesis.speak(utterance);
  };

  const askPipDirectly = async (rawPrompt: string) => {
    const trimmed = rawPrompt.trim();
    if (!trimmed || isAskingInline) return;
    pipAudio.playChirp();
    setIsAskingInline(true);
    setCustomJoke(null);
    setIsBubbleOpen(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok || data.error) {
        throw new Error(data.error || "Unable to reach The Concierge.");
      }
      setInlineAnswer(
        data.answer ||
          "Here in the Discovery Exchange: 50% cash goes to the seller, 25% property equity to the seller, 25% property equity to the buyer, 70% of monthly rent goes back to families, and every human gets 1 equal vote!"
      );
      setAnimState("bounce");
      setTimeout(() => setAnimState("idle"), 700);
    } catch {
      setInlineAnswer(
        "Quick Kitchen-Table Rule: Every garage trade splits 50% instant cash, 25% seller equity, and 25% buyer equity. 70% of building rent goes back to families monthly, and 1 Human = 1 Vote!"
      );
    } finally {
      setIsAskingInline(false);
    }
  };

  const handleInlineFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineQuestion.trim()) return;
    const q = inlineQuestion;
    setInlineQuestion("");
    askPipDirectly(q);
  };

  const triggerPoke = () => {
    pipAudio.playSpring();
    setPokeCount((c) => c + 1);
    setAnimState("bounce");
    if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
    bounceTimeoutRef.current = setTimeout(() => {
      setAnimState("idle");
    }, 700);

    // Switch quote playfully on poke
    setCustomJoke(null);
    setInlineAnswer(null);
    setUseRoomTip(false);
    setQuoteIndex((prev) => (prev + 1) % GOOFY_CLIPPY_QUOTES.length);
    setIsBubbleOpen(true);
  };

  const tellRandomJoke = () => {
    pipAudio.playBark();
    const randomJoke =
      GOOFY_JOKES[Math.floor(Math.random() * GOOFY_JOKES.length)];
    setInlineAnswer(null);
    setCustomJoke(randomJoke);
    setAnimState("waggle");
    setTimeout(() => setAnimState("idle"), 1200);
    setIsBubbleOpen(true);
  };

  const handleNextQuote = () => {
    pipAudio.playPop();
    setCustomJoke(null);
    setInlineAnswer(null);
    setUseRoomTip(false);
    setQuoteIndex((prev) => (prev + 1) % GOOFY_CLIPPY_QUOTES.length);
  };

  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    pipAudio.setMuted(next);
    if (!next) {
      pipAudio.playChirp();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingReply(false);
    }
  };

  const activeRoomTip =
    activeView && ROOM_CONTEXT_TIPS[activeView]
      ? ROOM_CONTEXT_TIPS[activeView]
      : null;

  const currentQuote =
    useRoomTip && activeRoomTip
      ? activeRoomTip
      : GOOFY_CLIPPY_QUOTES[quoteIndex];

  // 1. EMBEDDED MODE (For HomeLiveSidebar): Pure, elegant classical sky stage matching user's design
  if (mode === "embedded") {
    return (
      <div
        ref={characterRef}
        onClick={triggerPoke}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") triggerPoke();
        }}
        title="Click The Concierge to interact"
        className="relative w-full overflow-hidden select-none cursor-pointer bg-sky-100"
      >
        {/* Subtle Sound Mute/Unmute in top-right corner of the stage */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          aria-label={isSoundMuted ? "Unmute Sound" : "Mute Sound"}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white transition-colors"
          title={isSoundMuted ? "Sound is Off" : "Sound is On"}
        >
          {isSoundMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
          )}
        </button>

        {/* 1. Classical Roman Pillars, Blue Sky, Ornate Cartouche & Marble Floor — Pristine, Rock-Solid, Immovable Stage */}
        <img
          src="/assets/aistudio/the_discovery_exchange_concierge_sky_stage.png"
          alt="The Discovery Exchange Concierge"
          className="w-full h-auto block pointer-events-none"
        />

        {/* 2. Cybernetic Life Cues (Eyes & Chest Medallion) — With Live Cursor Gaze Tracking */}
        <div
          className={`pip-pupil absolute top-[49%] left-[45.8%] w-2.5 h-2.5 rounded-full bg-cyan-400/80 blur-xs pointer-events-none ${
            isWinking ? "opacity-0 scale-y-10" : "opacity-95 scale-100"
          }`}
        />
        <div
          className={`pip-pupil absolute top-[48.6%] left-[53%] w-2.5 h-2.5 rounded-full bg-cyan-400/80 blur-xs pointer-events-none ${
            isWinking ? "opacity-100" : "opacity-95"
          }`}
        />

        {/* Subtle Glowing 'P' Medallion Pulse on Chest */}
        <div className="absolute top-[65%] left-[49.2%] w-3 h-3 rounded-full bg-amber-400/50 blur-xs animate-ping pointer-events-none" />
      </div>
    );
  }

  // 2. FLOATING COMPANION MODE (Clippy Style — Free-Standing Character, Zero Dark Box Container!)
  return (
    <aside
      aria-label="The Discovery Exchange Concierge Companion"
      className="fixed bottom-6 right-6 z-50 select-none pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end">
        {/* Floating Comic Speech Bubble (When expanded) */}
        {!isFloatingMinimized && isBubbleOpen && (
          <div className="mb-3 w-[320px] sm:w-[360px] bg-[#FFFBEB] text-slate-900 border-2 border-amber-400 rounded-2xl p-3.5 shadow-2xl animate-speech-pop relative">
            {/* Header bar */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-amber-200/80">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-base select-none">🐾</span>
                <span className="text-xs font-bold text-amber-950 truncate">
                  The Concierge
                </span>
                {currentQuote.roomTag && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-200/90 text-amber-950 rounded-md truncate">
                    {currentQuote.roomTag}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={toggleSound}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-amber-100 transition-colors cursor-pointer"
                  title={isSoundMuted ? "Sound is Off" : "Sound is On"}
                >
                  {isSoundMuted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleNextQuote}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-amber-100 rounded cursor-pointer"
                  title="Next tip"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFloatingMinimized(true)}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-amber-100 rounded cursor-pointer"
                  title="Minimize The Concierge"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bubble Content: Either Live AI Answer, Joke, or Room-Aware Tip */}
            <div className="mt-2 space-y-1.5">
              {inlineAnswer ? (
                <div className="p-2.5 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 leading-relaxed space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span>Concierge Answer:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => speakTextOutLoud(inlineAnswer)}
                        className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold cursor-pointer"
                        title="Read answer out loud"
                      >
                        {isSpeakingReply ? "Stop 🔊" : "Read Aloud 🔊"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInlineAnswer(null)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Clear answer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p>{inlineAnswer}</p>
                </div>
              ) : customJoke ? (
                <p className="text-xs font-medium text-slate-800 leading-snug bg-white/80 p-2 rounded-xl border border-amber-200">
                  {customJoke}
                </p>
              ) : (
                <>
                  <p className="text-xs font-bold text-slate-950 leading-tight">
                    {currentQuote.intro}
                  </p>
                  <p className="text-xs text-slate-700 leading-snug">
                    {currentQuote.punchline}
                  </p>
                </>
              )}
            </div>

            {/* Direct In-Bubble Question Input (Ask Pip from any room without leaving!) */}
            <form
              onSubmit={handleInlineFormSubmit}
              className="mt-2.5 flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inlineQuestion}
                onChange={(e) => setInlineQuestion(e.target.value)}
                placeholder="Ask me anything right here..."
                className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-white text-slate-900 rounded-lg border border-amber-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={isAskingInline || !inlineQuestion.trim()}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e7bc55] disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Ask The Concierge"
              >
                {isAskingInline ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>

            {/* Interactive Quick Action Buttons */}
            <div className="mt-2.5 pt-2 border-t border-amber-200 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={tellRandomJoke}
                className="px-2 py-1 text-[11px] font-semibold text-amber-950 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-800" />
                Joke
              </button>

              <button
                type="button"
                disabled={isAskingInline}
                onClick={() => {
                  askPipDirectly(currentQuote.action);
                  if (onAskQuestion && activeView === WorkspaceView.STUDIO) {
                    onAskQuestion(currentQuote.action);
                  }
                }}
                className="px-2 py-1 text-[11px] font-semibold text-[#0F2749] bg-white hover:bg-amber-50 border border-amber-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer truncate max-w-[165px]"
                title={currentQuote.action}
              >
                <MessageSquare className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="truncate">{currentQuote.action}</span>
              </button>

              {onStartVoice && (
                <button
                  type="button"
                  onClick={() => {
                    pipAudio.playChirp();
                    onStartVoice();
                  }}
                  className="px-2 py-1 text-[11px] font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e7bc55] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Jump to Live Voice Stage"
                >
                  <Mic className="w-3 h-3" />
                  Live Voice
                </button>
              )}
            </div>

            {/* 1-Click Room Teleporter Bar */}
            {onNavigateView && (
              <div className="mt-2 pt-1.5 border-t border-amber-200/60 flex items-center justify-between gap-1 text-[10px]">
                <span className="font-bold text-amber-900 flex items-center gap-1 shrink-0">
                  <Compass className="w-3 h-3" />
                  Jump:
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {activeView !== WorkspaceView.FRONT_DOOR && (
                    <button
                      type="button"
                      onClick={() => onNavigateView(WorkspaceView.FRONT_DOOR)}
                      className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold cursor-pointer"
                    >
                      Home
                    </button>
                  )}
                  {activeView !== WorkspaceView.MARKETPLACE && (
                    <button
                      type="button"
                      onClick={() => onNavigateView(WorkspaceView.MARKETPLACE)}
                      className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold cursor-pointer"
                    >
                      Garage Market
                    </button>
                  )}
                  {activeView !== WorkspaceView.SCIENCE_LAB && (
                    <button
                      type="button"
                      onClick={() => onNavigateView(WorkspaceView.SCIENCE_LAB)}
                      className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold cursor-pointer"
                    >
                      K–12 Prize
                    </button>
                  )}
                  {activeView !== WorkspaceView.CONSTITUTION && (
                    <button
                      type="button"
                      onClick={() => onNavigateView(WorkspaceView.CONSTITUTION)}
                      className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold cursor-pointer"
                    >
                      Constitution
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Speech bubble pointer arrow pointing down towards Pip's head */}
            <div className="absolute -bottom-2.5 right-10 w-5 h-5 bg-[#FFFBEB] border-r-2 border-b-2 border-amber-400 rotate-45 transform" />
          </div>
        )}

        {/* Free-Standing Character (Directly on screen, NO dark box!) */}
        <div className="relative flex flex-col items-center group">
          {/* Subtle ground shadow under Pip */}
          <div className="absolute -bottom-1 w-20 h-4 bg-slate-900/15 rounded-full blur-xs pointer-events-none" />

          {/* Interactive Mascot Character */}
          <button
            type="button"
            onClick={triggerPoke}
            title={
              isFloatingMinimized
                ? "Click Pip to wake him up!"
                : "Click to poke Pip or make him bounce!"
            }
            className={`relative cursor-pointer transition-transform duration-300 outline-none ${
              animState === "jump"
                ? "animate-pip-jump"
                : animState === "idle"
                ? "animate-pip-idle"
                : animState === "bounce"
                ? "animate-pip-bounce"
                : animState === "waggle"
                ? "animate-pip-waggle"
                : ""
            }`}
          >
            {/* Free-floating character — Pure standalone transparent mascot, NO box or background! */}
            <div
              ref={characterRef}
              className={`relative mx-auto transition-all duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)] ${
                isFloatingMinimized ? "w-14 sm:w-16" : "w-20 sm:w-24"
              }`}
            >
              <img
                src="/assets/aistudio/pip_mascot_transparent.png"
                alt="The Concierge"
                className="w-full h-auto object-contain pointer-events-none select-none"
              />

              {/* Glowing Interactive Robot Eyes — Follow mouse cursor across the screen */}
              <div
                className={`pip-pupil absolute top-[28.5%] left-[41.4%] w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400/80 blur-xs ${
                  isWinking ? "opacity-0 scale-y-10" : "opacity-95 scale-100"
                }`}
              />
              <div
                className={`pip-pupil absolute top-[27.7%] left-[58.6%] w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400/80 blur-xs ${
                  isWinking ? "opacity-100" : "opacity-95"
                }`}
              />

              {/* Glowing "P" Medallion Pulse */}
              <div className="absolute top-[59%] left-[49.5%] w-2.5 h-2.5 rounded-full bg-amber-400/50 blur-xs animate-ping pointer-events-none" />
            </div>
          </button>

          {/* Under-Mascot Controls: Restore Bubble / Poke Counter */}
          {isFloatingMinimized ? (
            <button
              type="button"
              onClick={() => {
                pipAudio.playSpring();
                setIsFloatingMinimized(false);
                setIsBubbleOpen(true);
              }}
              className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] shadow-md border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>The Concierge</span>
              <Maximize2 className="w-2.5 h-2.5" />
            </button>
          ) : (
            <div className="mt-1 flex items-center gap-1">
              <button
                type="button"
                onClick={triggerPoke}
                className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold text-[10px] shadow-sm border border-slate-200 transition-colors cursor-pointer"
              >
                Bounce 🐾 ({pokeCount})
              </button>
              {!isBubbleOpen && (
                <button
                  type="button"
                  onClick={() => setIsBubbleOpen(true)}
                  className="px-2 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] shadow-sm border border-amber-200 transition-colors cursor-pointer"
                >
                  Ask Pip 💡
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

