import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Volume2,
} from "lucide-react";

interface LiveVoicePanelProps {
  onApplyTranscriptToStudio: (text: string) => void;
}

interface VoiceTurn {
  id: string;
  speaker: "you" | "director";
  text: string;
  time: string;
}

import {
  MicCaptureController,
  clearActivePlaybackSources,
  createPlaybackAudioContext,
  enqueuePcm24kPlaybackChunk,
  startNativeMicToPcm16k,
} from "../utils/liveAudio";

const VOICES = ["Zephyr", "Kore", "Puck", "Charon", "Fenrir"] as const;

export const LiveVoicePanel: React.FC<LiveVoicePanelProps> = ({
  onApplyTranscriptToStudio,
}) => {
  const [selectedVoice, setSelectedVoice] =
    useState<(typeof VOICES)[number]>("Zephyr");
  const [connectionState, setConnectionState] = useState<
    "idle" | "connecting" | "live"
  >("idle");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [textNudge, setTextNudge] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micCaptureRef = useRef<MicCaptureController | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);
  const splitNextDirectorTurnRef = useRef<boolean>(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

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

  const stopLiveSession = useCallback(() => {
    isStartingRef.current = false;
    splitNextDirectorTurnRef.current = false;
    flushPlaybackQueue();

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
    setConnectionState("idle");
  }, [flushPlaybackQueue]);

  useEffect(() => {
    return () => {
      stopLiveSession();
      if (playbackCtxRef.current) {
        playbackCtxRef.current.close().catch(() => {});
        playbackCtxRef.current = null;
      }
    };
  }, [stopLiveSession]);

  const appendTranscriptPiece = useCallback(
    (speaker: "you" | "director", piece: string, forceNewTurn = false) => {
      const cleaned = piece.trim();
      if (!cleaned) return;
      setTurns((prev) => {
        const last = prev[prev.length - 1];
        if (!forceNewTurn && last && last.speaker === speaker) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            text: `${last.text} ${cleaned}`.replace(/\s+/g, " ").trim(),
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: `turn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            speaker,
            text: cleaned,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });
    },
    []
  );

  const startLiveSession = async () => {
    if (isStartingRef.current || connectionState !== "idle") return;
    isStartingRef.current = true;
    splitNextDirectorTurnRef.current = false;
    setErrorMsg(null);
    setConnectionState("connecting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (!isStartingRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      micStreamRef.current = stream;

      if (!playbackCtxRef.current) {
        playbackCtxRef.current = createPlaybackAudioContext();
      }
      await playbackCtxRef.current.resume().catch(() => {});

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${
        window.location.host
      }/live?voice=${encodeURIComponent(selectedVoice)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data) as {
            status?: string;
            audio?: string;
            interrupted?: boolean;
            turnComplete?: boolean;
            inputTranscript?: string;
            outputTranscript?: string;
            error?: string;
          };

          if (msg.status === "connected") {
            isStartingRef.current = false;
            setConnectionState("live");
            if (micCaptureRef.current) {
              micCaptureRef.current.stop();
            }
            micCaptureRef.current = startNativeMicToPcm16k(stream, (b64) => {
              if (
                isMutedRef.current ||
                !wsRef.current ||
                wsRef.current.readyState !== WebSocket.OPEN
              ) {
                return;
              }
              wsRef.current.send(JSON.stringify({ audio: b64 }));
            });
          }

          if (msg.interrupted) {
            flushPlaybackQueue();
            splitNextDirectorTurnRef.current = true;
          }

          if (msg.audio) {
            schedulePcm24kChunk(msg.audio);
          }

          if (msg.inputTranscript) {
            appendTranscriptPiece("you", msg.inputTranscript);
          }

          if (msg.outputTranscript) {
            const forceSplit = splitNextDirectorTurnRef.current;
            if (forceSplit) {
              splitNextDirectorTurnRef.current = false;
            }
            appendTranscriptPiece(
              "director",
              msg.outputTranscript,
              forceSplit
            );
          }

          if (msg.turnComplete) {
            splitNextDirectorTurnRef.current = true;
          }

          if (msg.error) {
            setErrorMsg(msg.error);
            stopLiveSession();
          }
        } catch {
          // Ignore malformed WS frame
        }
      };

      ws.onerror = () => {
        setErrorMsg("Live voice WebSocket connection encountered an error.");
        stopLiveSession();
      };

      ws.onclose = () => {
        stopLiveSession();
      };
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Microphone permission is required for Live Voice conversations."
      );
      stopLiveSession();
    }
  };

  const handleSendTextToLive = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = textNudge.trim();
    if (
      !trimmed ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }
    wsRef.current.send(JSON.stringify({ text: trimmed }));
    appendTranscriptPiece("you", trimmed);
    setTextNudge("");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50/40">
      {/* Voice Session Control Bar */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <Volume2 className="w-4 h-4 text-[#0F2749]" />
          <div>
            <span className="font-semibold text-slate-900">
              Real-Time Voice Director
            </span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span className="font-mono text-slate-600">gemini-3.8-live</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span
              className={
                connectionState === "live"
                  ? "font-semibold text-emerald-700"
                  : "text-slate-500"
              }
            >
              {connectionState === "live"
                ? "Connected (16kHz PCM In / 24kHz Out)"
                : connectionState === "connecting"
                ? "Connecting..."
                : "Ready"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-600 flex items-center gap-1.5">
            <span>Voice:</span>
            <select
              value={selectedVoice}
              disabled={connectionState !== "idle"}
              onChange={(e) =>
                setSelectedVoice(e.target.value as (typeof VOICES)[number])
              }
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 rounded-lg text-slate-900 focus:outline-none"
            >
              {VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          {connectionState === "idle" ? (
            <button
              type="button"
              onClick={startLiveSession}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors"
            >
              <Mic className="w-3.5 h-3.5" />
              Start Live Voice
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsMicMuted((m) => !m)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  isMicMuted
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isMicMuted ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    Unmute Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-emerald-600" />
                    Mic Active
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={stopLiveSession}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                End Call
              </button>
            </>
          )}
        </div>
      </div>

      {/* Live Transcript Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {turns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center max-w-lg mx-auto my-6 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              Speak naturally with your Campaign Creative Director
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click <strong>Start Live Voice</strong> to brainstorm email
              subject lines, National K–12 Discovery Prize announcements, or
              Mailchimp/HubSpot rollout plans in real time. Interrupt anytime—audio
              playback clears immediately when you speak.
            </p>
          </div>
        ) : (
          turns.map((t) => (
            <div
              key={t.id}
              className={`flex flex-col ${
                t.speaker === "you" ? "items-end" : "items-start"
              }`}
            >
              <div className="text-[11px] text-slate-500 mb-1 tabular-nums">
                <span className="font-medium text-slate-700">
                  {t.speaker === "you"
                    ? "You (Voice)"
                    : `Live Director (${selectedVoice})`}
                </span>{" "}
                · {t.time}
              </div>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  t.speaker === "you"
                    ? "bg-[#0F2749] text-white"
                    : "bg-white border border-slate-200 text-slate-800"
                }`}
              >
                {t.text}
              </div>
              {t.speaker === "director" && (
                <button
                  type="button"
                  onClick={() => onApplyTranscriptToStudio(t.text)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#0F2749] transition-colors"
                >
                  Use in Campaign Brief
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {errorMsg}
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Optional Text Prompt into Active Live Session */}
      <form
        onSubmit={handleSendTextToLive}
        className="p-4 bg-white border-t border-slate-200 flex items-center gap-2.5"
      >
        <input
          type="text"
          value={textNudge}
          onChange={(e) => setTextNudge(e.target.value)}
          disabled={connectionState !== "live"}
          placeholder={
            connectionState === "live"
              ? "Or type a note into the live voice session..."
              : "Start Live Voice above to speak or send live notes..."
          }
          className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 focus:outline-none focus:border-[#0F2749]"
        />
        <button
          type="submit"
          disabled={connectionState !== "live" || !textNudge.trim()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
      </form>
    </div>
  );
};
