import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  MessageSquare,
  Mic,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { CHAT_PERSONAS } from "../data/tdexKnowledge";
import { User } from "../firebase";
import {
  ChatMessage,
  ChatRoleId,
  EmailCampaign,
  GeminiTextModel,
} from "../types/campaign";
import { appendChatMessageToFirestore } from "../utils/firestoreSync";
import { LiveVoicePanel } from "./LiveVoicePanel";

interface ChatWorkspaceProps {
  activeCampaign: EmailCampaign;
  currentUser: User | null;
  firestoreThreads?: Partial<Record<ChatRoleId, ChatMessage[]>>;
  onApplyPromptToStudio: (promptText: string) => void;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

const STORAGE_KEY = "tdex_studio_chat_threads_v2";

const INITIAL_GREETINGS: Record<ChatRoleId, string> = {
  [ChatRoleId.STRATEGIST]:
    "Ready to plan your email preview sequence inside Campaign Studio. Ask me for subject line hooks, family-friendly angles, or ways to sharpen your active draft.",
  [ChatRoleId.COLUMBO]:
    "Simulated Workshop Copy Challenger ready (distinct from the institutional Columbo / Dexter DILOS system). I look over your email drafts to make sure every claim holds together logically for families and educators. Just one more thing—share a paragraph or ask me to examine your open draft.",
  [ChatRoleId.PIPITO]:
    "Simulated Workshop Checklist Reviewer ready (distinct from the institutional Pipito / Pip DILOS gatekeeper). Ask me to check your active email draft against Rule #0 (active development status), banned terms, 50/25/25 & 70/30 disclosures, and on-hold program boundaries.",
  [ChatRoleId.RAPID_COPY]:
    "Fast copy mode ready on gemini-3.1-flash-lite. Paste any subject line, headline, or paragraph for an instant plain-English trim or punch-up.",
};

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  activeCampaign,
  currentUser,
  firestoreThreads,
  onApplyPromptToStudio,
  isDrawer = false,
  onCloseDrawer,
}) => {
  const [interactionMode, setInteractionMode] = useState<"text" | "voice">(
    "text"
  );
  const [selectedRole, setSelectedRole] = useState<ChatRoleId>(
    ChatRoleId.STRATEGIST
  );
  const [selectedModel, setSelectedModel] = useState<GeminiTextModel>(
    GeminiTextModel.GENERAL
  );
  const [includeCampaignContext, setIncludeCampaignContext] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [threads, setThreads] = useState<Record<ChatRoleId, ChatMessage[]>>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // Ignore storage error
      }
      const now = new Date().toISOString();
      return {
        [ChatRoleId.STRATEGIST]: [
          {
            id: "init-strat",
            role: "model",
            text: INITIAL_GREETINGS[ChatRoleId.STRATEGIST],
            timestamp: now,
            modelUsed: GeminiTextModel.GENERAL,
          },
        ],
        [ChatRoleId.COLUMBO]: [
          {
            id: "init-columbo",
            role: "model",
            text: INITIAL_GREETINGS[ChatRoleId.COLUMBO],
            timestamp: now,
            modelUsed: GeminiTextModel.COMPLEX,
          },
        ],
        [ChatRoleId.PIPITO]: [
          {
            id: "init-pipito",
            role: "model",
            text: INITIAL_GREETINGS[ChatRoleId.PIPITO],
            timestamp: now,
            modelUsed: GeminiTextModel.COMPLEX,
          },
        ],
        [ChatRoleId.RAPID_COPY]: [
          {
            id: "init-rapid",
            role: "model",
            text: INITIAL_GREETINGS[ChatRoleId.RAPID_COPY],
            timestamp: now,
            modelUsed: GeminiTextModel.FAST,
          },
        ],
      };
    }
  );

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Merge Firestore chat history when signed in
  useEffect(() => {
    if (!currentUser || !firestoreThreads) return;
    setThreads((prev) => {
      const next = { ...prev };
      for (const roleKey of Object.values(ChatRoleId)) {
        const remote = firestoreThreads[roleKey];
        if (remote && remote.length > 0) {
          next[roleKey] = [
            {
              id: `init-${roleKey}`,
              role: "model",
              text: INITIAL_GREETINGS[roleKey],
              timestamp: remote[0].timestamp,
              modelUsed: GeminiTextModel.GENERAL,
            },
            ...remote,
          ];
        }
      }
      return next;
    });
  }, [currentUser, firestoreThreads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch {
      // Ignore quota errors
    }
  }, [threads]);

  useEffect(() => {
    if (interactionMode === "text") {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [threads, selectedRole, isSending, interactionMode]);

  const handleSelectPersona = (roleId: ChatRoleId) => {
    setSelectedRole(roleId);
    const persona = CHAT_PERSONAS.find((p) => p.id === roleId);
    if (persona) {
      setSelectedModel(persona.defaultModel);
    }
    setErrorMsg(null);
  };

  const currentPersona =
    CHAT_PERSONAS.find((p) => p.id === selectedRole) || CHAT_PERSONAS[0];
  const currentMessages = threads[selectedRole] || [];

  const handleClearThread = () => {
    setThreads((prev) => ({
      ...prev,
      [selectedRole]: [
        {
          id: `reset-${Date.now()}`,
          role: "model",
          text: INITIAL_GREETINGS[selectedRole],
          timestamp: new Date().toISOString(),
          modelUsed: selectedModel,
        },
      ],
    }));
    setErrorMsg(null);
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    const userOrder = Date.now();
    const userMsg: ChatMessage = {
      id: `user-${userOrder}`,
      role: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...currentMessages, userMsg];
    setThreads((prev) => ({
      ...prev,
      [selectedRole]: updatedHistory,
    }));
    setInput("");
    setErrorMsg(null);
    setIsSending(true);

    if (currentUser) {
      appendChatMessageToFirestore({
        ownerId: currentUser.uid,
        personaId: selectedRole,
        role: "user",
        text: trimmed,
        modelUsed: selectedModel,
        clientOrder: userOrder,
      }).catch(() => {});
    }

    try {
      const activeSubj =
        activeCampaign.subjectLines.find(
          (s) => s.id === activeCampaign.selectedSubjectId
        ) || activeCampaign.subjectLines[0];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: selectedRole,
          modelId: selectedModel,
          messages: updatedHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          activeCampaignContext: includeCampaignContext
            ? {
                campaignTitle: activeCampaign.campaignTitle,
                brandName: activeCampaign.brandName,
                audience: activeCampaign.audience,
                selectedSubject: activeSubj?.text || "",
                heroHeadline: activeCampaign.heroHeadline,
                heroSubheadline: activeCampaign.heroSubheadline,
                bodySections: activeCampaign.bodySections,
                primaryCtaLabel: activeCampaign.primaryCtaLabel,
                primaryCtaUrl: activeCampaign.primaryCtaUrl,
                disclosures: activeCampaign.disclosures,
              }
            : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from Gemini.");
      }

      const modelOrder = Date.now();
      const replyText = data.reply || "No response text returned.";
      const usedModel = data.modelUsed || selectedModel;

      const modelMsg: ChatMessage = {
        id: `model-${modelOrder}`,
        role: "model",
        text: replyText,
        timestamp: new Date().toISOString(),
        modelUsed: usedModel,
        fallbackNotice: data.fallbackNotice,
      };

      setThreads((prev) => ({
        ...prev,
        [selectedRole]: [...updatedHistory, modelMsg],
      }));

      if (currentUser) {
        appendChatMessageToFirestore({
          ownerId: currentUser.uid,
          personaId: selectedRole,
          role: "model",
          text: replyText,
          modelUsed: usedModel,
          clientOrder: modelOrder,
        }).catch(() => {});
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Could not complete chat request."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyMessage = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div
      className={`flex flex-col bg-white ${
        isDrawer
          ? "h-full"
          : "border border-slate-200 rounded-xl overflow-hidden h-[calc(100vh-132px)] min-h-[620px]"
      }`}
    >
      {/* Top Header & Text vs Live Voice Mode Switcher */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Campaign &amp; Governance Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {interactionMode === "voice" ? (
              <span>
                Real-Time Voice Conversation · gemini-3.8-live WebSocket
              </span>
            ) : (
              <>
                <span>{currentPersona.name}</span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>{currentPersona.subtitle}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Mode Toggle: Multi-Turn Text vs Live Voice */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setInteractionMode("text")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                interactionMode === "text"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Text Chat
            </button>
            <button
              type="button"
              onClick={() => setInteractionMode("voice")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                interactionMode === "voice"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Live Voice
            </button>
          </div>

          {interactionMode === "text" && (
            <>
              <div
                className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
                role="group"
                aria-label="Select Gemini model tier"
              >
                <button
                  type="button"
                  onClick={() => setSelectedModel(GeminiTextModel.FAST)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedModel === GeminiTextModel.FAST
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="gemini-3.1-flash-lite — Fast low-latency tasks"
                >
                  3.1 Lite
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel(GeminiTextModel.GENERAL)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedModel === GeminiTextModel.GENERAL
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="gemini-3.8-flash — General campaign strategy"
                >
                  3.8 Flash
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel(GeminiTextModel.COMPLEX)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedModel === GeminiTextModel.COMPLEX
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="gemini-4-argon — Complex reasoning & governance audits"
                >
                  4 Argon
                </button>
              </div>

              <button
                type="button"
                onClick={handleClearThread}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </>
          )}

          {isDrawer && onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              aria-label="Close assistant drawer"
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {interactionMode === "voice" ? (
        <LiveVoicePanel onApplyTranscriptToStudio={onApplyPromptToStudio} />
      ) : (
        <>
          {/* Specialist Role Selector Bar */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {CHAT_PERSONAS.map((persona) => {
                const active = persona.id === selectedRole;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-[#0F2749] text-white"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {persona.name}
                  </button>
                );
              })}
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer whitespace-nowrap shrink-0">
              <input
                type="checkbox"
                checked={includeCampaignContext}
                onChange={(e) => setIncludeCampaignContext(e.target.checked)}
                className="rounded border-slate-300 text-[#0F2749] focus:ring-[#0F2749]"
              />
              Share active campaign draft
            </label>
          </div>

          {/* Scrollable Conversation Thread */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-slate-50/40">
            {currentMessages.map((msg) => {
              const isUser = msg.role === "user";
              const timeLabel = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 tabular-nums">
                    <span className="font-medium text-slate-700">
                      {isUser ? "You" : currentPersona.name}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{timeLabel}</span>
                    {!isUser && msg.modelUsed && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{msg.modelUsed}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#0F2749] text-white"
                        : "bg-white border border-slate-200 text-slate-800"
                    }`}
                  >
                    {msg.text}

                    {msg.fallbackNotice && (
                      <p className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                        {msg.fallbackNotice}
                      </p>
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors whitespace-nowrap"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => onApplyPromptToStudio(msg.text)}
                        className="inline-flex items-center gap-1 hover:text-[#0F2749] font-medium transition-colors whitespace-nowrap"
                      >
                        Use in Campaign Brief
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex flex-col items-start">
                <div className="text-[11px] text-slate-500 mb-1">
                  {currentPersona.name} · Thinking ({selectedModel})...
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Composing response...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                {errorMsg}
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Starter Prompts */}
          <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            {currentPersona.starterPrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSending}
                onClick={() => sendMessage(sp)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors truncate max-w-[320px] shrink-0"
                title={sp}
              >
                {sp}
              </button>
            ))}
          </div>

          {/* Message Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-end gap-2.5"
          >
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={`Message ${currentPersona.name} (${selectedModel})...`}
              className="flex-1 resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F2749]/20 focus:border-[#0F2749]"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 h-[42px]"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};
