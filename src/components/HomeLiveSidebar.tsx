import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mic,
  PhoneOff,
  Send,
  Volume2,
  VolumeX,
  CheckCircle2,
  RefreshCw,
  Home,
  ShoppingBag,
  Sparkles,
  Award,
  BookOpen,
  Users,
  Building2,
  Coins,
  Cpu,
  ShieldCheck,
} from "lucide-react";

import {
  MicCaptureController,
  clearActivePlaybackSources,
  createPlaybackAudioContext,
  enqueuePcm24kPlaybackChunk,
  startNativeMicToPcm16k,
} from "../utils/liveAudio";
import { pipAudio } from "../utils/pipSoundEffects";
import pipMascotImg from "../assets/images/pip_mascot_clean.png";
import sereneBlueSkyImg from "../assets/images/serene_blue_sky.jpg";

export interface HomeLiveSidebarHandle {
  startOrFocusConcierge: () => void;
}

const APPROVED_DISCOVERY_QUOTES: string[] = [
  "The system has failed our kids. You can either sit and complain—or do something about it. We chose to do something about it.",
  "No one person knows it all. What we build together is what counts.",
  "One owner. One vote. No title buys a second voice.",
  "If you cannot explain something in three sentences or less, most likely you don’t understand what you’re talking about.",
  "The road to success is always under construction.",
  "You don’t need cash to enter The Discovery Exchange. You need what you already own.",
  "As an owner, we don’t only ask you to challenge the platform—it is your duty.",
  "Give us a chance to earn your trust.",
  "Life becomes discovery when the trophies stop shining.",
  "What matters is what we become, not what we started as.",
  "Don’t complicate something simple. Simplify something complicated.",
  "Capital does not buy political power in The Discovery Exchange.",
  "No one person has all the answers.",
  "Discovery does not ask where the lesson came from.",
  "The only weapon against reality is reality itself.",
  "Right and wrong both become students of consequence.",
  "If we cannot correct our mistakes, The Discovery Exchange does not have the right to exist.",
  "Sit crooked, talk straight: we are not here to sing Kumbaya—we are here to deliver results and fix what is broken.",
  "When you lie to others, it is only because you have not learned to be honest with your own self.",
  "Theory is wishful thinking. Reality is the wake-up call. — The DEX",
  "A little madness gives us the courage to be free. — Zorba the Greek",
];

export interface HomeLiveSidebarProps {
  mode?: "all" | "topWindows" | "navWindow";
  className?: string;
  onOpenMarketplace?: () => void;
  onOpenScienceLab?: () => void;
  onOpenChambers?: () => void;
  onOpenOwnerSignup?: () => void;
  onOpenStudio?: () => void;
  onOpenConstitution?: () => void;
  onOpenArchitecture?: () => void;
  onOpenHome?: () => void;
  onOpenChat?: () => void;
  currentUser?: any;
  onSignOut?: () => void;
}

const ROLE_BRIEFING_CHIPS = [
  {
    label: "Parent: Garage-to-Rent",
    prompt:
      "Explain in 3 plain sentences how my family trades a garage item for 50% cash, 25% property equity, and 70% monthly building rent.",
  },
  {
    label: "20%–30% Auction & BigCoin",
    prompt:
      "Explain how The Discovery Exchange buys foreclosure and auction properties at 20% to 30% below market value and how Discovery BigCoin carries that value from startup.",
  },
  {
    label: "Student: K–12 Prize",
    prompt:
      "How does a public school student enter the K–12 Discovery Prize and how does the blind TDEX code keep judging 100% fair?",
  },
  {
    label: "No Kumbaya: Fix Mistakes",
    prompt:
      "Why is 'If we cannot correct our mistakes, The Discovery Exchange does not have the right to exist' our core rule for delivering real results?",
  },
];

export const HomeLiveSidebar = forwardRef<
  HomeLiveSidebarHandle,
  HomeLiveSidebarProps
>(function HomeLiveSidebar(
  {
    mode = "all",
    className = "",
    onOpenMarketplace,
    onOpenScienceLab,
    onOpenChambers,
    onOpenOwnerSignup,
    onOpenStudio,
    onOpenConstitution,
    onOpenArchitecture,
    onOpenHome,
    onOpenChat,
    currentUser,
    onSignOut,
  },
  ref
) {
  // 1. Live AI Concierge State (Real Voice + Instant Text Q&A)
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isSpeakingReply, setIsSpeakingReply] = useState(false);
  const [voiceState, setVoiceState] = useState<
    "idle" | "connecting" | "live"
  >("idle");
  const [liveCaption, setLiveCaption] = useState<string>("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

    const askInputRef = useRef<HTMLInputElement | null>(null);
    const conciergeCardRef = useRef<HTMLElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const recognitionRef = useRef<any>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const micCaptureRef = useRef<MicCaptureController | null>(null);
    const playbackCtxRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const isStartingVoiceRef = useRef<boolean>(false);
    const turnCompleteRef = useRef<boolean>(false);

    // Mascot state: Pip interaction, gaze tracking, audio chirp, and winking
    const pipStageRef = useRef<HTMLDivElement | null>(null);
    const [pipAnim, setPipAnim] = useState<"idle" | "bounce" | "waggle">("idle");
    const [isWinking, setIsWinking] = useState(false);
    const [isPipMuted, setIsPipMuted] = useState(false);

    const handlePipClick = () => {
      pipAudio.playSpring();
      setPipAnim("bounce");
      setTimeout(() => setPipAnim("idle"), 700);
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 350);
    };

    const togglePipMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = !isPipMuted;
      setIsPipMuted(next);
      pipAudio.setMuted(next);
      if (!next) pipAudio.playChirp();
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const el = pipStageRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
        const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);
        const maxOffset = 2.2;
        const pupilX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * maxOffset));
        const pupilY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * maxOffset));

        const pupils = el.querySelectorAll<HTMLElement>(".pip-pupil");
        pupils.forEach((p) => {
          p.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // 2. Discovery of the Day Heartbeat State
    const [quoteIndex, setQuoteIndex] = useState<number>(() => {
      const dayOfYear = Math.floor(Date.now() / 86_400_000);
      return dayOfYear % APPROVED_DISCOVERY_QUOTES.length;
    });
    const [isQuotePaused, setIsQuotePaused] = useState(false);

    const flushPlaybackQueue = useCallback(() => {
      clearActivePlaybackSources(nextStartTimeRef, activeSourcesRef);
    }, []);

    const schedulePcm24kChunk = useCallback((base64Pcm: string) => {
      if (!playbackCtxRef.current) {
        playbackCtxRef.current = createPlaybackAudioContext();
      }
      enqueuePcm24kPlaybackChunk(
        playbackCtxRef.current,
        base64Pcm,
        nextStartTimeRef,
        activeSourcesRef
      );
    }, []);

    const stopLiveVoice = useCallback(() => {
      isStartingVoiceRef.current = false;
      turnCompleteRef.current = false;
      flushPlaybackQueue();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort error
        }
        recognitionRef.current = null;
      }

      if (micCaptureRef.current) {
        micCaptureRef.current.stop();
        micCaptureRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (wsRef.current) {
        const socket = wsRef.current;
        wsRef.current = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
        try {
          socket.close();
        } catch {
          // Ignore close errors
        }
      }
      setVoiceState("idle");
    }, [flushPlaybackQueue]);

    useEffect(() => {
      return () => {
        stopLiveVoice();
        if (playbackCtxRef.current) {
          playbackCtxRef.current.close().catch(() => {});
          playbackCtxRef.current = null;
        }
      };
    }, [stopLiveVoice]);

    const submitConciergeQuestion = async (rawQuestion: string, speakAnswer = false) => {
      const trimmed = rawQuestion.trim();
      if (!trimmed || isAsking) return;

      setIsAsking(true);
      setVoiceError(null);
      try {
        const res = await fetch("/api/concierge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed }),
        });
        const data = (await res.json()) as { answer?: string; error?: string };
        if (!res.ok || data.error) {
          throw new Error(data.error || "Unable to reach the AI Concierge.");
        }
        setAiReply(data.answer || null);
        if (speakAnswer && data.answer) {
          toggleSpeakReply(data.answer);
        }
      } catch (err) {
        setAiReply(
          err instanceof Error
            ? err.message
            : "Unable to reach the AI Concierge right now."
        );
      } finally {
        setIsAsking(false);
      }
    };

    const startLiveVoice = async () => {
      if (isStartingVoiceRef.current || voiceState !== "idle") return;
      isStartingVoiceRef.current = true;
      turnCompleteRef.current = false;
      setVoiceError(null);
      setLiveCaption("");
      setVoiceState("connecting");

      // 1. First priority: High-compatibility browser Web Speech Recognition
      const SpeechRecognition =
        typeof window !== "undefined"
          ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
          : null;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = "en-US";
          recognitionRef.current = recognition;

          recognition.onstart = () => {
            isStartingVoiceRef.current = false;
            setVoiceState("live");
            setLiveCaption("🎤 Listening... Speak your question now!");
          };

          recognition.onresult = (evt: any) => {
            let interim = "";
            for (let i = evt.resultIndex; i < evt.results.length; ++i) {
              const transcript = evt.results[i][0].transcript;
              if (evt.results[i].isFinal) {
                setQuestion(transcript);
                setLiveCaption(`Heard: "${transcript}"`);
                setVoiceState("idle");
                submitConciergeQuestion(transcript, true);
              } else {
                interim += transcript;
                setLiveCaption(`Listening: "${interim}"`);
              }
            }
          };

          recognition.onerror = (evt: any) => {
            isStartingVoiceRef.current = false;
            setVoiceState("idle");
            if (evt.error === "not-allowed" || evt.error === "service-not-allowed") {
              setVoiceError(
                "Microphone permission blocked. Click the lock/mic icon in your address bar to Allow."
              );
            } else if (evt.error !== "no-speech") {
              setVoiceError(`Voice mic notice: ${evt.error}. You can also type below.`);
            }
          };

          recognition.onend = () => {
            isStartingVoiceRef.current = false;
            setVoiceState("idle");
          };

          recognition.start();
          return;
        } catch (recErr) {
          console.warn("Native speech recognition failed, falling back to Web Audio stream:", recErr);
        }
      }

      // 2. Fallback: Stream directly via Web Audio & WebSocket
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!isStartingVoiceRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        micStreamRef.current = stream;

        if (!playbackCtxRef.current) {
          playbackCtxRef.current = createPlaybackAudioContext();
        }
        await playbackCtxRef.current.resume().catch(() => {});

        const protocol =
          window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/live?mode=concierge&voice=Zephyr`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data) as {
              status?: string;
              audio?: string;
              interrupted?: boolean;
              turnComplete?: boolean;
              outputTranscript?: string;
              error?: string;
            };

            if (msg.status === "connected") {
              isStartingVoiceRef.current = false;
              setVoiceState("live");
              ws.send(
                JSON.stringify({
                  text: "Give a warm 1-sentence welcome to The Discovery Exchange and Discovery Exchange Parents Alliance, and invite the visitor to ask anything out loud.",
                })
              );

              if (micCaptureRef.current) {
                micCaptureRef.current.stop();
              }
              micCaptureRef.current = startNativeMicToPcm16k(stream, (b64) => {
                if (
                  wsRef.current &&
                  wsRef.current.readyState === WebSocket.OPEN
                ) {
                  wsRef.current.send(JSON.stringify({ audio: b64 }));
                }
              });
            }

            if (msg.interrupted) {
              flushPlaybackQueue();
              turnCompleteRef.current = false;
              setLiveCaption("");
            }

            if (msg.audio) {
              schedulePcm24kChunk(msg.audio);
            }

            if (msg.outputTranscript) {
              const startFresh = turnCompleteRef.current;
              if (startFresh) {
                turnCompleteRef.current = false;
              }
              setLiveCaption((prev) =>
                startFresh
                  ? msg.outputTranscript!.replace(/\s+/g, " ").trim()
                  : `${prev} ${msg.outputTranscript}`.replace(/\s+/g, " ").trim()
              );
            }

            if (msg.turnComplete) {
              turnCompleteRef.current = true;
            }

            if (msg.error) {
              setVoiceError(msg.error);
              stopLiveVoice();
            }
          } catch {
            // Ignore malformed socket frame
          }
        };

        ws.onerror = () => {
          setVoiceError(
            "Live voice connection interrupted. You can type a question below anytime."
          );
          stopLiveVoice();
        };

        ws.onclose = () => {
          stopLiveVoice();
        };
      } catch {
        setVoiceError(
          "Microphone permission wasn’t granted—type or tap a question below instead."
        );
        stopLiveVoice();
      }
    };

    useImperativeHandle(ref, () => ({
      startOrFocusConcierge: () => {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          conciergeCardRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        if (voiceState === "idle" && !isStartingVoiceRef.current) {
          startLiveVoice();
        } else {
          askInputRef.current?.focus();
        }
      },
    }));

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!question.trim()) return;
      const q = question;
      setQuestion("");
      submitConciergeQuestion(q);
    };

    // Discovery of the Day 10-second live heartbeat rotation
    useEffect(() => {
      if (isQuotePaused) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const timer = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % APPROVED_DISCOVERY_QUOTES.length);
      }, 10_000);
      return () => clearInterval(timer);
    }, [isQuotePaused]);

    const moveQuote = (delta: number) => {
      setQuoteIndex(
        (prev) =>
          (prev + delta + APPROVED_DISCOVERY_QUOTES.length) %
          APPROVED_DISCOVERY_QUOTES.length
      );
    };

    const toggleSpeakReply = (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window))
        return;
      window.speechSynthesis.cancel();
      if (isSpeakingReply) {
        setIsSpeakingReply(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.06;
      utterance.onend = () => setIsSpeakingReply(false);
      utterance.onerror = () => setIsSpeakingReply(false);
      setIsSpeakingReply(true);
      window.speechSynthesis.speak(utterance);
    };

    const todayLabel = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const showTop = mode === "all" || mode === "topWindows";
    const showNav = mode === "all" || mode === "navWindow";

    return (
      <aside
        aria-label="Live AI Concierge and Platform Navigation"
        className={`select-none ${className || (mode === "topWindows" ? "flex flex-col h-full gap-3.5" : "space-y-3")}`}
      >
        {showTop && (
          <>
            {/* WINDOW 1: THE DISCOVERY EXCHANGE CONCIERGE — NARROW COLUMNS, 1-LINE TEXT & 1-LINE MIC */}
            <section
          ref={conciergeCardRef}
          aria-label="The Discovery Exchange Concierge"
          style={{ backgroundImage: `url(${sereneBlueSkyImg})` }}
          className="relative rounded-2xl overflow-hidden border-[3px] border-[#D9A441] shadow-xl bg-cover bg-center select-none"
        >
          {/* Top Architectural Architrave connecting the column capitals */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D9A441] via-[#FFE78A] to-[#D9A441] border-b border-[#8C6316] z-20 pointer-events-none" />

          {/* Bottom Architectural Stylobate / Base connecting the column pedestals */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] border-t border-[#FFE78A] z-20 pointer-events-none" />

          {/* Left Classical Column — Narrower (w-4 sm:w-4.5) to give center maximum room */}
          <div
            className="absolute top-0 bottom-0 left-0 w-4 sm:w-4.5 z-10 flex flex-col pointer-events-none select-none shadow-md"
            aria-hidden="true"
          >
            {/* Ionic Capital */}
            <div className="h-6 w-full bg-gradient-to-b from-[#E5A429] via-[#FDF3D0] to-[#C99026] border-b border-[#8C6316] flex flex-col justify-between p-0.5 shadow-xs">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="flex justify-between px-0.5 text-[6px] font-black text-[#8C6316] leading-none">
                <span>◎</span>
                <span>◎</span>
              </div>
              <div className="h-0.5 w-full bg-[#B8860B] rounded-xs" />
            </div>
            {/* Fluted Marble Shaft */}
            <div className="flex-1 w-full bg-gradient-to-r from-[#C99026] via-[#FFFDF5] to-[#B8860B] relative shadow-inner flex justify-evenly px-0.5">
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
              <div className="w-[1px] h-full bg-[#8C6316]/25" />
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
            </div>
            {/* Classical Pedestal Base */}
            <div className="h-6 w-full bg-gradient-to-b from-[#C99026] via-[#FFFDF5] to-[#8C6316] border-t border-[#FFE78A] flex flex-col justify-between p-0.5 shadow-sm">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] rounded-xs" />
              <div className="h-1.5 w-full bg-[#8C6316] rounded-b-xs" />
            </div>
          </div>

          {/* Right Classical Column — Narrower (w-4 sm:w-4.5) to give center maximum room */}
          <div
            className="absolute top-0 bottom-0 right-0 w-4 sm:w-4.5 z-10 flex flex-col pointer-events-none select-none shadow-md"
            aria-hidden="true"
          >
            {/* Ionic Capital */}
            <div className="h-6 w-full bg-gradient-to-b from-[#E5A429] via-[#FDF3D0] to-[#C99026] border-b border-[#8C6316] flex flex-col justify-between p-0.5 shadow-xs">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="flex justify-between px-0.5 text-[6px] font-black text-[#8C6316] leading-none">
                <span>◎</span>
                <span>◎</span>
              </div>
              <div className="h-0.5 w-full bg-[#B8860B] rounded-xs" />
            </div>
            {/* Fluted Marble Shaft */}
            <div className="flex-1 w-full bg-gradient-to-r from-[#C99026] via-[#FFFDF5] to-[#B8860B] relative shadow-inner flex justify-evenly px-0.5">
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
              <div className="w-[1px] h-full bg-[#8C6316]/25" />
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
            </div>
            {/* Classical Pedestal Base */}
            <div className="h-6 w-full bg-gradient-to-b from-[#C99026] via-[#FFFDF5] to-[#8C6316] border-t border-[#FFE78A] flex flex-col justify-between p-0.5 shadow-sm">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] rounded-xs" />
              <div className="h-1.5 w-full bg-[#8C6316] rounded-b-xs" />
            </div>
          </div>

          {/* Interior Content Canvas: Framed with compact vertical spacing */}
          <div className="px-4 sm:px-5 pt-2 pb-2 space-y-1.5 relative z-10">
            {/* Sound Mute/Unmute Toggle in top right */}
            <button
              type="button"
              onClick={togglePipMute}
              aria-label={isPipMuted ? "Unmute Sound" : "Mute Sound"}
              className="absolute top-2 right-4 sm:right-5 z-30 p-1 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white transition-colors cursor-pointer"
              title={isPipMuted ? "Sound is Off" : "Sound is On"}
            >
              {isPipMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3 text-amber-300" />
              )}
            </button>

            {/* 1. Ornate Top Cartouche: The Discovery Exchange Concierge */}
            <div className="mx-auto max-w-[260px] bg-gradient-to-b from-[#0F2D59] via-[#0A1F3D] to-[#061427] border-[1.5px] border-[#F3C04C] rounded-lg px-2 py-0.5 shadow-md text-center relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-[#F3C04C] rounded-full text-[7.5px] font-serif font-black text-[#0A1F3D] uppercase tracking-wider shadow-xs">
                TDEx
              </div>
              <h2 className="font-serif font-bold text-xs sm:text-[12.5px] text-[#FDF0CD] tracking-tight drop-shadow-md whitespace-nowrap">
                The Discovery Exchange Concierge
              </h2>
            </div>

            {/* 2. Interactive Mascot Stage: Chula */}
            <div
              ref={pipStageRef}
              onClick={handlePipClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePipClick();
              }}
              title="Click Chula to interact"
              className="relative flex flex-col items-center justify-center cursor-pointer outline-none pt-0"
            >
              <div
                className={`relative transition-transform duration-300 ${
                  pipAnim === "bounce"
                    ? "animate-pip-bounce scale-105"
                    : pipAnim === "waggle"
                    ? "animate-pip-waggle"
                    : ""
                }`}
              >
                <img
                  src={pipMascotImg}
                  alt="Chula the Puppy Concierge"
                  className="w-20 sm:w-24 h-auto block object-contain pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] rounded-2xl"
                />
              </div>

              {/* Classical Floating Marble Plinth */}
              <div className="relative -mt-1.5 z-10 flex flex-col items-center pointer-events-none select-none">
                <div className="w-20 sm:w-24 h-3 sm:h-3.5 rounded-[8px] bg-gradient-to-b from-[#FFFDF9] via-[#F5EEDB] to-[#E5D7BC] border-[1.5px] border-[#D9A441] shadow-xs flex items-center justify-between px-1 relative overflow-hidden">
                  <div className="w-1.2 h-1.2 rounded-full bg-gradient-to-b from-[#FFE78A] to-[#B8860B] border border-[#8C6316] relative z-10" />
                  <div className="h-0.5 px-1.5 rounded-full bg-gradient-to-r from-[#D9A441] via-[#FFE78A] to-[#D9A441] border border-[#8C6316]/50 relative z-10" />
                  <div className="w-1.2 h-1.2 rounded-full bg-gradient-to-b from-[#FFE78A] to-[#B8860B] border border-[#8C6316] relative z-10" />
                </div>
              </div>
            </div>

            {/* 3. Knockout Concierge Line */}
            <p className="text-center font-serif font-bold text-[11.5px] sm:text-xs text-[#0C2B54] tracking-tight whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
              I am your concierge, Ask me anything
            </p>

            {/* 4. Input Row */}
            <form onSubmit={handleFormSubmit} className="flex items-center gap-1">
              <label htmlFor="home-concierge-input" className="sr-only">
                Ask me anything
              </label>
              <input
                ref={askInputRef}
                id="home-concierge-input"
                type="text"
                placeholder="Ask me anything..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 min-w-0 px-2.5 py-1 text-[11.5px] font-medium text-slate-900 bg-white/95 rounded-md border border-[#1E3A8A] placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="px-2.5 py-1 text-[11.5px] font-serif font-bold text-[#0D233A] bg-gradient-to-b from-[#F7D26E] via-[#F3C04C] to-[#E5A429] hover:from-[#fce085] hover:to-[#efa82f] disabled:opacity-50 rounded-md border border-[#FFE78A] shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center min-w-[50px] whitespace-nowrap"
              >
                {isAsking ? (
                  <Loader2 className="w-3 h-3 animate-spin text-[#0D233A]" />
                ) : (
                  <span>Send</span>
                )}
              </button>
            </form>

            {/* 5. Talk Out Loud Button */}
            <div>
              <button
                type="button"
                disabled={voiceState === "connecting"}
                onClick={voiceState === "live" ? stopLiveVoice : startLiveVoice}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] sm:text-[11.5px] font-bold rounded-md transition-all cursor-pointer shadow-xs active:scale-[0.99] whitespace-nowrap ${
                  voiceState === "live"
                    ? "bg-red-600 hover:bg-red-700 text-white border border-red-800 animate-pulse"
                    : "bg-white/95 hover:bg-white text-[#102A45] border border-[#1E3A8A]"
                }`}
              >
                {voiceState === "connecting" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
                    <span>Connecting Mic...</span>
                  </>
                ) : voiceState === "live" ? (
                  <>
                    <PhoneOff className="w-3 h-3" />
                    <span>End Live Voice</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Talk Out Loud ( Live 2 way Mic )</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Caption Display when voice is streaming */}
            {liveCaption && (
              <div
                role="status"
                className="p-1.5 rounded-md bg-white/95 border border-sky-300 text-[10.5px] text-[#0B4F8A] leading-relaxed flex items-start gap-1 shadow-xs"
              >
                <Volume2 className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{liveCaption}</span>
              </div>
            )}

            {/* Voice Error Display if any */}
            {voiceError && (
              <p
                className="text-[10.5px] text-rose-900 bg-rose-100/90 p-1 rounded font-medium leading-snug border border-rose-300"
                role="alert"
              >
                {voiceError}
              </p>
            )}

            {/* AI Reply Card inside the frame */}
            {aiReply && (
              <div
                role="status"
                className="p-2 rounded-md bg-white/95 text-slate-900 border border-amber-300 text-[10.5px] leading-relaxed shadow-xs space-y-1 max-h-32 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-0.5 border-b border-amber-200 font-semibold text-[9.5px] text-amber-900">
                  <span>Concierge Briefing</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleSpeakReply(aiReply)}
                      className="px-1 py-0.2 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold cursor-pointer text-[9px]"
                    >
                      {isSpeakingReply ? "Stop 🔊" : "Read 🔊"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          typeof window !== "undefined" &&
                          "speechSynthesis" in window
                        ) {
                          window.speechSynthesis.cancel();
                          setIsSpeakingReply(false);
                        }
                        setAiReply(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 text-[10px] cursor-pointer p-0.5"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p>{aiReply}</p>
              </div>
            )}
          </div>
        </section>


        {/* WINDOW 2: DISCOVERY OF THE DAY — ENLARGED TO FILL EMPTY SPOT SEAMLESSLY */}
        <section
          onMouseEnter={() => setIsQuotePaused(true)}
          onMouseLeave={() => setIsQuotePaused(false)}
          aria-label="Discovery of the Day"
          style={{ backgroundImage: `url(${sereneBlueSkyImg})` }}
          className="relative rounded-2xl overflow-hidden border-[3px] border-[#D9A441] shadow-xl bg-cover bg-center select-none flex-1 flex flex-col justify-between min-h-[195px] lg:min-h-[210px]"
        >
          {/* Top Architectural Architrave connecting the column capitals */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D9A441] via-[#FFE78A] to-[#D9A441] border-b border-[#8C6316] z-20 pointer-events-none" />

          {/* Bottom Architectural Stylobate / Base connecting the column pedestals */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] border-t border-[#FFE78A] z-20 pointer-events-none" />

          {/* Left Classical Column */}
          <div
            className="absolute top-0 bottom-0 left-0 w-3.5 sm:w-4.5 z-10 flex flex-col pointer-events-none select-none shadow-md"
            aria-hidden="true"
          >
            {/* Ionic Capital */}
            <div className="h-5 w-full bg-gradient-to-b from-[#E5A429] via-[#FDF3D0] to-[#C99026] border-b border-[#8C6316] flex flex-col justify-between p-0.5 shadow-xs">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="flex justify-between px-0.5 text-[6px] font-black text-[#8C6316] leading-none">
                <span>◎</span>
                <span>◎</span>
              </div>
              <div className="h-0.5 w-full bg-[#B8860B] rounded-xs" />
            </div>
            {/* Fluted Marble Shaft */}
            <div className="flex-1 w-full bg-gradient-to-r from-[#C99026] via-[#FFFDF5] to-[#B8860B] relative shadow-inner flex justify-evenly px-0.5">
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
              <div className="w-[1px] h-full bg-[#8C6316]/25" />
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
            </div>
            {/* Classical Pedestal Base */}
            <div className="h-5 w-full bg-gradient-to-b from-[#C99026] via-[#FFFDF5] to-[#8C6316] border-t border-[#FFE78A] flex flex-col justify-between p-0.5 shadow-sm">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] rounded-xs" />
              <div className="h-1 w-full bg-[#8C6316] rounded-b-xs" />
            </div>
          </div>

          {/* Right Classical Column */}
          <div
            className="absolute top-0 bottom-0 right-0 w-3.5 sm:w-4.5 z-10 flex flex-col pointer-events-none select-none shadow-md"
            aria-hidden="true"
          >
            {/* Ionic Capital */}
            <div className="h-5 w-full bg-gradient-to-b from-[#E5A429] via-[#FDF3D0] to-[#C99026] border-b border-[#8C6316] flex flex-col justify-between p-0.5 shadow-xs">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="flex justify-between px-0.5 text-[6px] font-black text-[#8C6316] leading-none">
                <span>◎</span>
                <span>◎</span>
              </div>
              <div className="h-0.5 w-full bg-[#B8860B] rounded-xs" />
            </div>
            {/* Fluted Marble Shaft */}
            <div className="flex-1 w-full bg-gradient-to-r from-[#C99026] via-[#FFFDF5] to-[#B8860B] relative shadow-inner flex justify-evenly px-0.5">
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
              <div className="w-[1px] h-full bg-[#8C6316]/25" />
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
            </div>
            {/* Classical Pedestal Base */}
            <div className="h-5 w-full bg-gradient-to-b from-[#C99026] via-[#FFFDF5] to-[#8C6316] border-t border-[#FFE78A] flex flex-col justify-between p-0.5 shadow-sm">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] rounded-xs" />
              <div className="h-1 w-full bg-[#8C6316] rounded-b-xs" />
            </div>
          </div>

          {/* Interior Content Canvas: Stretches gracefully to fill the frame */}
          <div className="px-5 sm:px-6 pt-2.5 pb-2.5 relative z-10 flex-1 flex flex-col justify-between">
            {/* Ornate Top Cartouche: Discovery of the Day */}
            <div className="mx-auto w-full max-w-[280px] bg-gradient-to-b from-[#0F2D59] via-[#0A1F3D] to-[#061427] border-[1.5px] border-[#F3C04C] rounded-lg px-3 py-1 shadow-md text-center relative flex items-center justify-between">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 bg-[#F3C04C] rounded-full text-[8px] font-serif font-black text-[#0A1F3D] uppercase tracking-wider shadow-xs whitespace-nowrap">
                TODAY'S DISCOVERY
              </div>
              <h2 className="font-serif font-bold text-[13px] sm:text-[14.5px] text-[#FDF0CD] tracking-tight drop-shadow-md whitespace-nowrap mx-auto">
                Discovery of the Day
              </h2>
              <span className="text-[9.5px] font-mono font-bold text-[#FFE78A] bg-[#0A1F3D]/80 px-1.5 py-0.5 rounded border border-[#F3C04C]/40 tabular-nums shrink-0">
                {todayLabel}
              </span>
            </div>

            {/* Spacious Quote Block with Read Aloud / Listen Button */}
            <div className="my-auto py-3 px-2 flex flex-col items-center justify-center text-center">
              <blockquote className="relative">
                <p className="font-serif font-bold text-[17px] sm:text-[18.5px] md:text-[20px] text-[#051A38] leading-snug sm:leading-relaxed text-center max-w-[340px] mx-auto drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  “{APPROVED_DISCOVERY_QUOTES[quoteIndex]}”
                </p>
              </blockquote>
            </div>

            {/* Navigation & Audio Controls Row */}
            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#D9A441]/35">
              <button
                type="button"
                onClick={() => moveQuote(-1)}
                aria-label="Previous Discovery of the Day quote"
                className="px-3 py-1 text-sm font-serif font-bold text-[#0D233A] bg-gradient-to-b from-[#F7D26E] via-[#F3C04C] to-[#E5A429] hover:from-[#fce085] hover:to-[#efa82f] rounded-md border border-[#FFE78A] shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="text-[13px] sm:text-sm font-serif font-bold text-[#072147] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] tabular-nums">
                  {quoteIndex + 1} of {APPROVED_DISCOVERY_QUOTES.length}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSpeakReply(APPROVED_DISCOVERY_QUOTES[quoteIndex])}
                  title="Listen to this quote"
                  aria-label="Listen to this quote"
                  className="px-2 py-0.5 rounded bg-white/85 hover:bg-white text-xs font-serif font-bold text-[#072147] border border-[#D9A441]/60 cursor-pointer transition shadow-2xs flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Listen</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => moveQuote(1)}
                aria-label="Next Discovery of the Day quote"
                className="px-3 py-1 text-sm font-serif font-bold text-[#0D233A] bg-gradient-to-b from-[#F7D26E] via-[#F3C04C] to-[#E5A429] hover:from-[#fce085] hover:to-[#efa82f] rounded-md border border-[#FFE78A] shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
          </>
        )}

        {showNav && (
          <>
            {/* WINDOW 3: THE LONG NAVIGATION BAR — FOR ALL PLATFORM PAGES */}
            <section
          aria-label="Platform Navigation"
          style={{ backgroundImage: `url(${sereneBlueSkyImg})` }}
          className="relative rounded-2xl overflow-hidden border-[3px] border-[#D9A441] shadow-xl bg-cover bg-center select-none"
        >
          {/* Top Architectural Architrave connecting the column capitals */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D9A441] via-[#FFE78A] to-[#D9A441] border-b border-[#8C6316] z-20 pointer-events-none" />
          {/* Bottom Architectural Stylobate connecting the column pedestals */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C6316] via-[#FFE78A] to-[#8C6316] border-t border-[#FFE78A] z-20 pointer-events-none" />

          {/* Left Classical Column */}
          <div
            className="absolute top-0 bottom-0 left-0 w-3.5 sm:w-4 z-10 flex flex-col pointer-events-none select-none shadow-md"
            aria-hidden="true"
          >
            <div className="h-4 w-full bg-gradient-to-b from-[#E5A429] via-[#FDF3D0] to-[#C99026] border-b border-[#8C6316] flex flex-col justify-between p-0.5 shadow-xs">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="flex justify-between px-0.5 text-[5px] font-black text-[#8C6316] leading-none">
                <span>◎</span>
                <span>◎</span>
              </div>
            </div>
            <div className="flex-1 w-full bg-gradient-to-r from-[#C99026] via-[#FFFDF5] to-[#B8860B] relative shadow-inner flex justify-evenly px-0.5">
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
              <div className="w-[1px] h-full bg-[#8C6316]/25" />
            </div>
            <div className="h-4 w-full bg-gradient-to-b from-[#C99026] via-[#FFFDF5] to-[#8C6316] border-t border-[#FFE78A] flex flex-col justify-between p-0.5 shadow-sm">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="h-1 w-full bg-[#8C6316] rounded-b-xs" />
            </div>
          </div>

          {/* Right Classical Column */}
          <div
            className="absolute top-0 bottom-0 right-0 w-3.5 sm:w-4 z-10 flex flex-col pointer-events-none select-none shadow-md"
            aria-hidden="true"
          >
            <div className="h-4 w-full bg-gradient-to-b from-[#E5A429] via-[#FDF3D0] to-[#C99026] border-b border-[#8C6316] flex flex-col justify-between p-0.5 shadow-xs">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="flex justify-between px-0.5 text-[5px] font-black text-[#8C6316] leading-none">
                <span>◎</span>
                <span>◎</span>
              </div>
            </div>
            <div className="flex-1 w-full bg-gradient-to-r from-[#C99026] via-[#FFFDF5] to-[#B8860B] relative shadow-inner flex justify-evenly px-0.5">
              <div className="w-[1px] h-full bg-[#8C6316]/35" />
              <div className="w-[1px] h-full bg-[#8C6316]/25" />
            </div>
            <div className="h-4 w-full bg-gradient-to-b from-[#C99026] via-[#FFFDF5] to-[#8C6316] border-t border-[#FFE78A] flex flex-col justify-between p-0.5 shadow-sm">
              <div className="h-0.5 w-full bg-[#FFE78A] rounded-xs" />
              <div className="h-1 w-full bg-[#8C6316] rounded-b-xs" />
            </div>
          </div>

          {/* Interior Content Canvas: Long, spacious list of all platform pages */}
          <div className="px-5 pt-3 pb-4 space-y-2.5 relative z-10">
            {/* Ornate Top Cartouche */}
            <div className="mx-auto max-w-[270px] bg-gradient-to-b from-[#0F2D59] via-[#0A1F3D] to-[#061427] border-[1.5px] border-[#F3C04C] rounded-lg px-2.5 py-1 shadow-md text-center relative flex items-center justify-between">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-[#F3C04C] rounded-full text-[7px] font-serif font-black text-[#0A1F3D] uppercase tracking-wider shadow-xs whitespace-nowrap">
                TDEx · DIRECTORY
              </div>
              <h2 className="font-serif font-bold text-xs sm:text-[12.5px] text-[#FDF0CD] tracking-tight drop-shadow-md whitespace-nowrap mx-auto">
                Platform Navigation
              </h2>
            </div>

            <p className="text-center text-[10px] font-serif font-bold text-[#072147] drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
              Choose any room below to explore
            </p>

            {/* Long List of Navigation Pages */}
            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-0.5">
              {/* Page 1: Home Doorway */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenHome) onOpenHome();
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2749] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Home className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-blue-900">
                      Home Doorway
                    </p>
                    <span className="text-[8px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                      Front
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    The front porch for families
                  </p>
                </div>
              </button>

              {/* Page 2: Discovery Marketplace */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenMarketplace) onOpenMarketplace();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-emerald-900">
                      Discovery Marketplace
                    </p>
                    <span className="text-[8px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                      50/25/25
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Trade garage clutter for property
                  </p>
                </div>
              </button>

              {/* Page 3: Discovery Studio */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenStudio) onOpenStudio();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2749] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-blue-900">
                      Discovery Studio
                    </p>
                    <span className="text-[8px] font-mono font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded shrink-0">
                      Outreach
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Mom &amp; Pop outreach letters &amp; flyers
                  </p>
                </div>
              </button>

              {/* Page 4: K-12 Challenge Room */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenScienceLab) onOpenScienceLab();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-3.5 h-3.5 text-amber-100" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-amber-900">
                      K–12 Challenge Room
                    </p>
                    <span className="text-[8px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded shrink-0">
                      Prizes
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Real kid inventions &amp; cash awards
                  </p>
                </div>
              </button>

              {/* Page 5: Tdex Constitution */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenConstitution) onOpenConstitution();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-slate-900">
                      Tdex Constitution
                    </p>
                    <span className="text-[8px] font-mono font-bold text-slate-700 bg-slate-200 px-1.5 py-0.2 rounded shrink-0">
                      Articles 1–17
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Locked democratic family rules
                  </p>
                </div>
              </button>

              {/* Page 6: Owners Board & Chambers */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenChambers) onOpenChambers();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2749] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-blue-900">
                      Owners Board
                    </p>
                    <span className="text-[8px] font-mono font-bold text-cyan-800 bg-cyan-100 px-1.5 py-0.2 rounded shrink-0">
                      1 Human 1 Vote
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Boardroom &amp; democratic ballots
                  </p>
                </div>
              </button>

              {/* Page 7: Bank Auction & Foreclosure Exchange */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenMarketplace) onOpenMarketplace();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-slate-900">
                      Bank Auction Deals
                    </p>
                    <span className="text-[8px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                      -20% to -30%
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Foreclosure &amp; auction properties
                  </p>
                </div>
              </button>

              {/* Page 8: Discovery BigCoin Ledger */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenMarketplace) onOpenMarketplace();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-black">
                  <Coins className="w-3.5 h-3.5 text-amber-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-amber-900">
                      Discovery BigCoin
                    </p>
                    <span className="text-[8px] font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded shrink-0">
                      Property-Backed
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Real estate backing, zero casino games
                  </p>
                </div>
              </button>

              {/* Page 9: System Architecture */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenArchitecture) onOpenArchitecture();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2749] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Cpu className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-purple-900">
                      System Architecture
                    </p>
                    <span className="text-[8px] font-mono font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded shrink-0">
                      Nodes
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    Local nodes &amp; infrastructure
                  </p>
                </div>
              </button>

              {/* Page 10: Human Owner Registration */}
              <button
                type="button"
                onClick={() => {
                  pipAudio.playPop();
                  if (onOpenOwnerSignup) onOpenOwnerSignup();
                }}
                className="w-full text-left p-2 rounded-xl bg-white/95 hover:bg-white border border-[#D9A441]/60 hover:border-[#8C6316] shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2749] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#0F2749] truncate group-hover:text-blue-900">
                      Owner Registration
                    </p>
                    <span className="text-[8px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                      $0 Dues
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 truncate">
                    1 Human, 1 Vote democratic ballot
                  </p>
                </div>
              </button>
            </div>

            <p className="text-center text-[9px] font-serif font-black text-[#0C2B54] uppercase tracking-widest opacity-70 pt-1">
              Dexpa · All Rooms &amp; Pages Connected
            </p>
          </div>
        </section>
          </>
        )}
      </aside>
    );
  }
);
