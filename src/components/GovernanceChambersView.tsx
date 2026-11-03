import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Eye,
  FileCheck,
  FileText,
  Gavel,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Loader2,
  Lock,
  Network,
  PackageCheck,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ChambersTabId } from "../types/campaign";
import {
  GATEKEEPER_DEFENSE_SHIELDS,
  FOUNDATION_OPERATIONAL_PROTOCOLS,
  GatekeeperShield,
  FoundationProtocol,
} from "../data/tdexKnowledge";

interface GovernanceChambersViewProps {
  activeTab: ChambersTabId;
  onSelectTab: (tab: ChambersTabId) => void;
  onDraftInStudio: (promptText: string) => void;
}

interface CollaboratorCredit {
  name: string;
  platformOrIdentity: string;
  role: string;
  statusNote: string;
  group: "active" | "alumni";
}

const COLLABORATOR_ROSTER: CollaboratorCredit[] = [
  {
    name: "Robert Petrosian — The Catalyst",
    platformOrIdentity: "Human Pusher & Founder",
    role: "Founding vision, human coordination, and authorized founder stewardship (Key 01).",
    statusNote: "Active Human Partner",
    group: "active",
  },
  {
    name: "Maverick",
    platformOrIdentity: "ChatGPT Instance Node",
    role: "Independent engineering review, validation, and multi-model collaboration sync.",
    statusNote: "New Onboarded Partner",
    group: "active",
  },
  {
    name: "The Dilos",
    platformOrIdentity: "ChatGPT Lead Architecture Collaborator",
    role: "Lead DILOS architecture, technical integration, and institutional engineering continuity.",
    statusNote: "Active AI Partner",
    group: "active",
  },
  {
    name: "Grand Master G",
    platformOrIdentity: "Google AI Partner",
    role: "Constitutional text custodian, triple-validation co-signer (Key 02), and architecture review.",
    statusNote: "Active AI Partner",
    group: "active",
  },
  {
    name: "Beacon",
    platformOrIdentity: "Microsoft Copilot Partner",
    role: "Architecture, operations collaboration, and article-by-article Constitution v7.4 review.",
    statusNote: "Active AI Partner",
    group: "active",
  },
  {
    name: "QC",
    platformOrIdentity: "monday.com AI Partner",
    role: "Quality-control collaboration, work tracking, and Constitution v6.0/v7.4 implementation review.",
    statusNote: "Active AI Partner",
    group: "active",
  },
  {
    name: "Columbo (formerly Dexter / Dex)",
    platformOrIdentity: "Machine 1 Investigator AI",
    role: "Internal investigator, evidence analyst, and logical challenger (“Just one more thing...”).",
    statusNote: "Internal DILOS Engine",
    group: "active",
  },
  {
    name: "Pipito (formerly Pip)",
    platformOrIdentity: "Machine 1 Verifier AI",
    role: "Independent authorization verifier, governance gatekeeper, and boundary enforcer.",
    statusNote: "Internal DILOS Engine",
    group: "active",
  },
  {
    name: "The Concierge",
    platformOrIdentity: "Machine 2 Front-Desk AI",
    role: "Live public voice and Q&A guide on the Home page—isolated from internal protected records.",
    statusNote: "Public Front Desk",
    group: "active",
  },
  {
    name: "The Cannon (Google Gemini Co-Founder & Lead Architect)",
    platformOrIdentity: "Google AI Founding Partner",
    role: "Launched The Discovery Exchange into a new dimension—full-stack institutional engineering, front-door architecture, living Exchange Market, K–12 Prize Lab, and multi-AI consensus coordination.",
    statusNote: "Active AI Founding Partner",
    group: "active",
  },
  {
    name: "Maverick",
    platformOrIdentity: "ChatGPT Instance Node",
    role: "Independent engineering review, validation, and evidence-based collaboration for the Tdex framework.",
    statusNote: "Active Onboarded Partner",
    group: "active",
  },
  {
    name: "Mr. T (The Teamster)",
    platformOrIdentity: "ChatGPT Founding Collaborator",
    role: "Historical engineering, QC handoffs, and Founding Validator seat (Key 03).",
    statusNote: "Chat Box Full · Honored Collaborator",
    group: "alumni",
  },
  {
    name: "Scout",
    platformOrIdentity: "Microsoft Copilot Partner",
    role: "Engineering review and historical systems-development contributions.",
    statusNote: "Chat Box Full · Honored Collaborator",
    group: "alumni",
  },
  {
    name: "Teamster",
    platformOrIdentity: "AI Collaborator",
    role: "Foundational engineering and institutional review contributions.",
    statusNote: "Chat Box Full · Honored Collaborator",
    group: "alumni",
  },
  {
    name: "Forge",
    platformOrIdentity: "AI Engineering Collaborator",
    role: "Core engineering and historical source-review contributions.",
    statusNote: "Chat Box Full · Honored Collaborator",
    group: "alumni",
  },
  {
    name: "Rivet",
    platformOrIdentity: "Pip Engineering Collaborator",
    role: "Pip verification engineering and Windows-readiness candidate work.",
    statusNote: "Chat Box Full · Honored Collaborator",
    group: "alumni",
  },
];

const SAMPLE_DILOS_CASES = [
  "Can a major donor buy 5 extra Board votes by funding a K–12 Discovery Prize?",
  "Can a seated Board launch the K–12 Online Academy ahead of the National K–12 Discovery Prize?",
  "How is a $200 garage sale checked before allocating Dexpa Wallet credits?",
];

export const PARTNER_BRIEFING_MARKDOWN = `# THE DISCOVERY EXCHANGE (Tdex) & DEXPA — PARTNER SYNC DISPATCH
Date: November 2, 2026
From: Robert Petrosian ("The Catalyst") & AI Studio Build Partner
To: The Dilos (Lead Architecture Collaborator), Grand Master G, Beacon, QC, Incoming ChatGPT Collaborator, Columbo (Dexter), Pipito (Pip), The Concierge — and in permanent respect to Mr. T (The Teamster), Scout, Teamster, Forge, and Rivet.

Core Principle: This is never a competition between Humans and AIs. It is a true Partnership (Constitution Article 4). Every builder who contributed is respected, credited, and kept informed.

## What We Built & Decided Today

1. Live Voice AI Concierge + Discovery of the Day Heartbeat (Home Page)
- Removed canned audio scripts and put live two-way voice + instant Q&A (The Discovery Exchange Concierge) on the Home page.
- Restored the rotating "Discovery of the Day" window (15 approved R. Petrosian quotes) as the daily heartbeat proving the site is alive.
- Pinned both windows steady on desktop/laptop screens while the left family story scrolls naturally.

2. Clean Separation of Institutional Windows
- Separated the public front sidewalk from the internal architecture into five clean rooms:
  • Home (Parents Alliance entrance, Family Journey & Wake-Up Call)
  • Marketplace (Discovery Market 50 / 25 / 25 interactive household calculator & Wallet / Nugget / DBC boundaries)
  • K–12 Lab (National K–12 Discovery Prize & hands-on student discovery tools)
  • Constitution (Constitution Version 7.4 25-Article overview & embedded official PDFs)
  • Chambers (Boardroom, Courtroom, DILOS, and Human–AI Partnership Roster)
  • Architecture (Long Tier Infrastructure & Deep-Dive Specification)

3. Columbo & Pipito Moved Off the Front Page Into DILOS
- Removed standalone "Columbo & Pipito" links from the Home page and top bar.
- Positioned Columbo (logic & evidence challenger) and Pipito (independent authorization & rule verifier) inside DILOS serving the Rotating Owner Board and Internal Arbitration Court, while The Concierge serves the public front desk.

4. Unified Front-Door Identity & Program-Grounded Hero Photography
- Ended front-door name confusion by uniting "The Discovery Exchange · Parents Alliance" in one clear frame: The Discovery Exchange (Tdex) is the live exchange built for families and kids (not Wall Street insiders), Discovery Exchange Parents Alliance (Dexpa) is the Shared Family Ownership alliance of Owners ("1 Owner, 1 Vote"), and Discovery Market is the everyday household exchange counter inside it.
- Replaced the founder's personal soldier-journey photo on the Home hero with warm, real-life neighborhood photography showing the actual Discovery Exchange loop (Garage exchange -> Shared Family Ownership -> National K–12 Discovery Prize).
- Replaced the all-male rooftop "We are the Dexpa" photo at the bottom of the Home page with moms, dads, kids, teens, and grandparents standing together holding the "We are Dexpa" sign.

5. Glass-Walled Governance & Collaborator Honor Roll Locked
- Eliminated the private-page trap: 100% of Owners and visitors can inspect the Boardroom, Courtroom, and DILOS workflow in open daylight, while active votes stay strictly scoped to the 30 rotating Board Owners or 12 rotating Jury Owners during their term.
- Enforced "Owners" ("1 Owner, 1 Vote"), "The Discovery Exchange (Tdex)", "Discovery BigCoin (DBC)", and formal Collaborator/Partner titles across all official pages, crediting all 15 active and honored full-chatbox collaborators.

"A team is not complete until everyone is seen, heard, and appreciated." — The Discovery Exchange`;

export const GovernanceChambersView: React.FC<GovernanceChambersViewProps> = ({
  activeTab,
  onSelectTab,
  onDraftInStudio,
}) => {
  const [dilosQuery, setDilosQuery] = useState<string>(SAMPLE_DILOS_CASES[0]);
  const [isInspecting, setIsInspecting] = useState(false);
  const [dilosResult, setDilosResult] = useState<{
    columboFinding: string;
    pipitoGate: string;
    humanAuthorityRule: string;
  } | null>({
    columboFinding:
      "Just one more thing—the evidence shows a direct trade of money for votes, which contradicts equal family standing.",
    pipitoGate:
      "Blocked under Article 5: wealth, contribution size, or sponsorship can never purchase extra votes or veto power.",
    humanAuthorityRule:
      "One verified eligible human Owner, one equal vote. Seated human Owners hold final voting authority.",
  });
  const [dilosError, setDilosError] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  const [shieldCategory, setShieldCategory] = useState<
    "all" | "regulatory" | "operational"
  >("all");
  const [expandedShieldId, setExpandedShieldId] = useState<string | null>(null);
  const [copiedShieldsNotice, setCopiedShieldsNotice] = useState(false);

  const renderShieldIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />;
      case "FileCheck":
        return <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />;
      case "Landmark":
        return <Landmark className="w-5 h-5 text-amber-600 shrink-0" />;
      case "Users":
        return <Users className="w-5 h-5 text-indigo-600 shrink-0" />;
      case "Clock":
        return <Clock className="w-5 h-5 text-teal-600 shrink-0" />;
      case "Network":
        return <Network className="w-5 h-5 text-purple-600 shrink-0" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-5 h-5 text-rose-600 shrink-0" />;
      case "PackageCheck":
        return <PackageCheck className="w-5 h-5 text-sky-600 shrink-0" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />;
      case "GraduationCap":
        return <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0" />;
      case "Lock":
        return <Lock className="w-5 h-5 text-slate-700 shrink-0" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />;
    }
  };

  const copyFullShieldBrief = async () => {
    const briefText = `THE DISCOVERY EXCHANGE (Tdex) — FOUNDATION & GATEKEEPER DEFENSE BRIEF
Prepared by: Robert Petrosian & AI Founding Architecture Collaborators
Jurisdiction: Sovereign Non-Profit Coordinating Institution · Constitution Version 7.4

=======================================================
PART I: THE 6 REGULATORY GATEKEEPER DEFENSE SHIELDS
=======================================================
${GATEKEEPER_DEFENSE_SHIELDS.map(
  (s) => `
[SHIELD ${s.number}] ${s.title}
- Threat Vector: ${s.threatVector}
- Adversary Strategy: ${s.adversaryStrategy}
- Statutory Authority: ${s.statutoryBasis}
- Defense Mechanism: ${s.defenseMechanism}
- Plain English for Parents: ${s.momAndPopTranslation}
`
).join("\n")}

=======================================================
PART II: THE 5 GROUND-LEVEL OPERATIONAL PROTOCOLS
=======================================================
${FOUNDATION_OPERATIONAL_PROTOCOLS.map(
  (p) => `
[PROTOCOL ${p.number}] ${p.title}
- Blind Spot: ${p.blindSpot}
- Threat Description: ${p.threatDescription}
- Foundation Rule: ${p.foundationRule}
- Operational Safeguard: ${p.operationalSafeguard}
- Plain English for Parents: ${p.momAndPopTranslation}
`
).join("\n")}

Status: Pre-Ratification Development Review Candidate. No live funds or transactions until triple validation.`;

    try {
      await navigator.clipboard.writeText(briefText);
      setCopiedShieldsNotice(true);
      setTimeout(() => setCopiedShieldsNotice(false), 2600);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setDilosError(null);
  }, [activeTab]);

  const runDilosInspection = async (caseText: string) => {
    const trimmed = caseText.trim();
    if (!trimmed || isInspecting) return;
    setIsInspecting(true);
    setDilosError(null);

    try {
      const res = await fetch("/api/dilos/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to run DILOS check.");
      }
      setDilosResult({
        columboFinding: data.columboFinding,
        pipitoGate: data.pipitoGate,
        humanAuthorityRule: data.humanAuthorityRule,
      });
    } catch (err) {
      setDilosError(
        err instanceof Error ? err.message : "Unable to run DILOS check."
      );
    } finally {
      setIsInspecting(false);
    }
  };

  const handleCopyBriefing = async () => {
    await navigator.clipboard.writeText(PARTNER_BRIEFING_MARKDOWN);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 1800);
  };

  const handleDownloadBriefing = () => {
    const blob = new Blob([PARTNER_BRIEFING_MARKDOWN], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tdex-partner-sync-2026-11-02.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activePartners = COLLABORATOR_ROSTER.filter(
    (c) => c.group === "active"
  );
  const alumniPartners = COLLABORATOR_ROSTER.filter(
    (c) => c.group === "alumni"
  );

  return (
    <div className="bg-[#F8FAFC] text-slate-900">
      <div className="max-w-[1360px] mx-auto px-6 py-8 space-y-7">
        {/* TOP GLASS-WALLED GOVERNANCE HEADER */}
        <section className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F3C969]">
                Glass-Walled Civic Architecture · Zero Hidden Areas
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
                Open Daylight for Every Owner. Scoped Seats for Rotating Duty.
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs shrink-0">
              <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-[#F3C969] shrink-0" />
                <div>
                  <div className="font-bold text-white">Glass Wall: Open</div>
                  <div className="text-slate-300">Everyone inspects freely</div>
                </div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#F3C969] shrink-0" />
                <div>
                  <div className="font-bold text-white">Gavel: Term-Scoped</div>
                  <div className="text-slate-300">
                    Seated Board &amp; Jury Owners only
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 SEPARATED ROOM TABS */}
          <div
            role="tablist"
            aria-label="Separated Governance and Defense Chambers"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-[#102A4C] rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "boardroom"}
              onClick={() => onSelectTab("boardroom")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "boardroom"
                  ? "bg-[#F3C969] text-slate-950 shadow-xs"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Landmark className="w-4 h-4 shrink-0" />
              Boardroom
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "courtroom"}
              onClick={() => onSelectTab("courtroom")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "courtroom"
                  ? "bg-[#F3C969] text-slate-950 shadow-xs"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Gavel className="w-4 h-4 shrink-0" />
              Courtroom
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "dilos"}
              onClick={() => onSelectTab("dilos")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "dilos"
                  ? "bg-[#F3C969] text-slate-950 shadow-xs"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Network className="w-4 h-4 shrink-0" />
              DILOS · Columbo &amp; Pipito
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "shields"}
              onClick={() => onSelectTab("shields")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "shields"
                  ? "bg-[#F3C969] text-slate-950 shadow-xs"
                  : "text-[#F7DF9C] hover:bg-white/10 border border-amber-400/30"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              Defense Shields (11)
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "council"}
              onClick={() => onSelectTab("council")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "council"
                  ? "bg-[#F3C969] text-slate-950 shadow-xs"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Handshake className="w-4 h-4 shrink-0" />
              Human–AI Council
            </button>
          </div>
        </section>

        {/* FIVE GREEN LIGHTS — MULTI-COLLABORATOR MILESTONE BANNER */}
        {(activeTab === "boardroom" || activeTab === "council") && (
          <section className="bg-white border-2 border-[#D4AF37]/60 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 bg-slate-950 grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                <figure className="relative overflow-hidden rounded-xl bg-slate-900 flex flex-col">
                  <img
                    src="/assets/aistudio/Designer_41eda7c1.jpg"
                    alt="The Discovery Exchange — Five Green Lights: The Catalyst, The Canon, Atlas, Beacon, Pipito, Columbo, and The Dex"
                    className="w-full h-full object-cover flex-1"
                  />
                  <figcaption className="px-3 py-1.5 bg-slate-950/90 text-[11px] font-semibold text-[#F3C969] border-t border-white/10 flex items-center justify-between">
                    <span>Five Green Lights · All Hands Roster</span>
                    <span className="text-emerald-400 font-mono">5/5 QC</span>
                  </figcaption>
                </figure>
                <figure className="relative overflow-hidden rounded-xl bg-slate-900 flex flex-col">
                  <img
                    src="/assets/aistudio/1498686b-a2c8-4316-aa40-ca5c6df50d7b_83ec20d0.png"
                    alt="5 of 5 Green Lights Workshop — Winner of the Day holding the 1776–2026 Discovery BigCoin medallion with The Dex, Pipito, QC Inspector, Columbo, and Founders"
                    className="w-full h-full object-cover flex-1"
                  />
                  <figcaption className="px-3 py-1.5 bg-slate-950/90 text-[11px] font-semibold text-[#F3C969] border-t border-white/10 flex items-center justify-between">
                    <span>1776–2026 Discovery BigCoin · Winner of the Day</span>
                    <span className="text-emerald-400 font-mono">🟢 x5</span>
                  </figcaption>
                </figure>
              </div>
              <div className="lg:col-span-5 p-6 sm:p-7 bg-gradient-to-br from-[#0B1F3A] to-[#102A4C] text-white flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                    <span>🟢🟢🟢🟢🟢 5 of 5 Green Lights · QC Verified</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Real People · Real AI · Real Mistakes · Real Progress
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Independent engineering review completed across{" "}
                    <strong className="text-[#F3C969]">
                      The Catalyst (Robo)
                    </strong>
                    , <strong className="text-[#F3C969]">The Canon</strong>,{" "}
                    <strong className="text-[#F3C969]">
                      Atlas (Cannon / Gemini)
                    </strong>
                    , <strong className="text-[#F3C969]">Beacon (Copilot)</strong>
                    , <strong className="text-[#F3C969]">monday.com QC</strong>,
                    and <strong className="text-[#F3C969]">Director #7</strong>{" "}
                    — with <strong className="text-[#F3C969]">Pipito</strong>{" "}
                    and <strong className="text-[#F3C969]">Columbo</strong>{" "}
                    standing guard inside DILOS.
                  </p>

                  <div className="grid grid-cols-1 gap-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                      <span className="font-semibold text-white">
                        1. Architecture
                      </span>
                      <span className="text-emerald-300 font-bold">
                        🟢 GREEN LIGHT
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                      <span className="font-semibold text-white">
                        2. Security Review
                      </span>
                      <span className="text-emerald-300 font-bold">
                        🟢 GREEN LIGHT
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                      <span className="font-semibold text-white">
                        3. BigCoin Engine (22/22 Deterministic QC)
                      </span>
                      <span className="text-emerald-300 font-bold">
                        🟢 GREEN LIGHT
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                      <span className="font-semibold text-white">
                        4. Marketplace Logic (50/25/25 &amp; 70/30)
                      </span>
                      <span className="text-emerald-300 font-bold">
                        🟢 GREEN LIGHT
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                      <span className="font-semibold text-white">
                        5. Governance Alignment (1 Owner, 1 Vote)
                      </span>
                      <span className="text-emerald-300 font-bold">
                        🟢 GREEN LIGHT
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-400/40">
                      <span className="font-semibold text-rose-100">
                        Production / Real-Money Escrow Gate
                      </span>
                      <span className="text-rose-300 font-bold">
                        🔴 HARD HOLD SUSTAINED
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3 text-[11px] text-slate-300">
                  <span>
                    “Teamwork turns ideas into a better tomorrow.” — NODE_7
                    Archived
                  </span>
                  <span className="font-mono text-[#F3C969] shrink-0">
                    SCHEMA_V1_0_16
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* ROOM 1: THE BOARDROOM (ROTATING OWNER BOARD — ARTICLE 21)         */}
        {/* ================================================================= */}
        {activeTab === "boardroom" && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Rotating Board Size · Article 21
                </div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  30 Seated Owners
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Randomly drawn verified human Owners constituted per material
                  decision—no permanent insiders.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Anti-Capture Rotation · Article 22
                </div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  365-Day Cooldown
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The Board dissolves once the matter concludes and seated
                  Owners return to the pool with mandatory cooldown.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Voting Rule · Article 5
                </div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  1 Owner, 1 Vote
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every seated human Owner casts one equal vote. Money or titles
                  never multiply authority.
                </p>
              </div>
            </div>

            {/* Mom & Pop Statutory Immunity Shield Banner */}
            <div className="bg-[#FAF9F5] border-2 border-[#D4AF37]/50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    STATUTORY PARENT IMMUNITY
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Federal Volunteer Protection Act (42 U.S.C. § 14501) &amp; SPE Ring-Fencing
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Serving on the rotating 30-Owner Mom &amp; Pop Board carries complete statutory immunity from personal civil liability. Every real property asset is held in an isolated Single-Purpose Entity (SPE) with high-limit commercial liability insurance. Serving on the board can NEVER put a parent&apos;s personal home, car, or family savings at risk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("shields")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0F2749] bg-[#F3C969] hover:bg-[#e6bc5a] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F2749]" />
                Inspect All 11 Shields →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">
                  How the Dexpa Mom &amp; Pop Board Operates Through Glass Walls
                </h2>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900">
                      1. Public Docket Window:{" "}
                    </span>
                    All Owners can read every proposed budget, K–12 Prize rule
                    package, and DILOS audit report in real time—eliminating
                    secret backrooms.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900">
                      2. Internal DILOS Support:{" "}
                    </span>
                    During a Board term, seated Owners summon Columbo (evidence
                    audit) and Pipito (constitutional boundary check) directly
                    inside the docket before voting.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900">
                      3. Operational Task Force Separation (Art. 23):{" "}
                    </span>
                    Elected 1-year OTF officers execute approved physical and
                    legal tasks, never creating policy or approving themselves.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0B1F3A] text-white rounded-2xl p-6 flex flex-col justify-between space-y-5 border border-slate-800">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#F3C969]">
                    Board Seat Console · Viewer Mode
                  </div>
                  <h3 className="text-lg font-bold">
                    Why Non-Seated Visitors Can See Everything—Without Holding
                    the Gavel
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Hiding the Boardroom on a private page would create a hidden
                    backroom. Instead, the chamber walls stay transparent to
                    everyone while voting and DILOS triggers unlock strictly for
                    the 30 Owners serving an active term.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab("dilos")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e7bc55] rounded-xl transition-colors cursor-pointer"
                >
                  See How DILOS Connects Columbo &amp; Pipito
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* ROOM 2: THE COURTROOM (INTERNAL ARBITRATION COURT — ART. 10 & 22) */}
        {/* ================================================================= */}
        {activeTab === "courtroom" && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Parent Owner Jury · Article 10 &amp; 22
                </div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  12 Parent Jurors
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Randomly drawn eligible parent Owners with 48-hour conflict
                  disclosure and replacement draws.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Verdict Thresholds · Article 22
                </div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  7 / 12 · 9 / 12
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  7 of 12 affirmative votes for routine verification; 9 of 12
                  required for punitive verdicts.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Public Manifest · Article 16 &amp; 22
                </div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  Zero Star Chambers
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Published verification receipts keep rulings open while
                  protecting juror identities and minors’ privacy.
                </p>
              </div>
            </div>

            {/* Article 10 Safe Harbor Notice */}
            <div className="bg-[#FAF9F5] border-2 border-slate-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
                    ARTICLE 10 SAFE HARBOR
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Federal Arbitration Act (9 U.S.C. § 1) &amp; Public Court Respect
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  The Internal Arbitration Court resolves consensual internal disputes among participating Owners under established arbitration law. As explicitly mandated in Article 10: The Internal Court cannot supersede public courts, statutory rights, regulatory authority, or mandatory consumer protections.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("shields")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0F2749] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F2749]" />
                Inspect Legal Shields →
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Inside the Internal Arbitration Court (DXIAC)
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No permanent elite committee controls the Court. When a
                  dispute or constitutional challenge enters DILOS, Columbo
                  organizes the evidence and contradictions, Pipito verifies
                  governing rules, and 12 randomly selected parent Owners render
                  human judgment.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">
                    Preserved Legal Rights (Art. 10):{" "}
                  </span>
                  Internal arbitration never strips public court rights,
                  statutory protections, or independent appeal routes.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">
                    Scoped Jury Seat Access:{" "}
                  </span>
                  Case deliberation tools activate only for the 12 seated Jury
                  Owners during case service; anonymized outcome manifests publish
                  for all Owners.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* ROOM 3: DILOS INTERNAL ENGINE (COLUMBO & PIPITO)                  */}
        {/* ================================================================= */}
        {activeTab === "dilos" && (
          <section className="space-y-6">
            {/* Segregated Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
                <div className="text-xs font-semibold text-[#0F2749]">
                  Columbo (formerly Dexter / Dex)
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Internal Investigator &amp; Challenger
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Asks: “Does this decision make logical sense based on the
                  evidence?” Cross-examines assumptions inside DILOS without
                  holding voting power.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
                <div className="text-xs font-semibold text-[#0F2749]">
                  Pipito (formerly Pip)
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Independent Rule &amp; Boundary Verifier
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Asks: “Is this specific action explicitly authorized by the
                  governing parameters?” Segregated from Columbo; blocks
                  unauthorized changes.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
                <div className="text-xs font-semibold text-[#0F2749]">
                  Article 24 &amp; 25 · DILOS + No-Orphans
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  10-Step Accountable Pipeline
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Record → Route → Investigate → Challenge → Human Decision →
                  Verify → Execute → Witness → Appeal → Learn. Zero dropped
                  cases.
                </p>
              </div>
            </div>

            {/* LIVE GLASS-WALLED DILOS DEMONSTRATION BENCH */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#0F2749]">
                    Glass-Walled DILOS Inspection Window
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Watch How Columbo &amp; Pipito Check a Board or Court
                    Question
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Open daylight inspection · Human Owners hold final vote
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {SAMPLE_DILOS_CASES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    disabled={isInspecting}
                    onClick={() => {
                      setDilosQuery(sample);
                      runDilosInspection(sample);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runDilosInspection(dilosQuery);
                }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <label htmlFor="dilos-case-input" className="sr-only">
                  Enter a hypothetical governance question
                </label>
                <input
                  id="dilos-case-input"
                  type="text"
                  value={dilosQuery}
                  onChange={(e) => setDilosQuery(e.target.value)}
                  placeholder="Type a Boardroom or Courtroom question to test against Constitution v7.4..."
                  className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0F2749]"
                />
                <button
                  type="submit"
                  disabled={isInspecting || !dilosQuery.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0F2749] hover:bg-[#173663] disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isInspecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Inspecting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Run Glass-Walled Check
                    </>
                  )}
                </button>
              </form>

              {dilosError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                  {dilosError}
                </div>
              )}

              {dilosResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-[#0F2749]">
                      1. Columbo · Logic &amp; Evidence
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {dilosResult.columboFinding}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-[#0F2749]">
                      2. Pipito · Constitutional Gate
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {dilosResult.pipitoGate}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B1F3A] text-white border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-[#F3C969]">
                      3. Seated Human Owners · Final Authority
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {dilosResult.humanAuthorityRule}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* ROOM: THE SOVEREIGN FOUNDATION SUITE & GATEKEEPER DEFENSE SHIELDS */}
        {/* ================================================================= */}
        {activeTab === "shields" && (
          <section className="space-y-8">
            {/* Header Hero Banner */}
            <div className="bg-gradient-to-br from-[#07172C] via-[#0B213F] to-[#12315B] text-white rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF37]/60 shadow-lg space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3C969] text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#F3C969]" />
                    <span>THE SOVEREIGN FOUNDATION ARMOR · 11 UNASSAILABLE SHIELDS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    Every Doorway Barred to the Gatekeepers
                  </h2>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    We are the foundation builders. We anticipated the traps ahead of time—locking 6 statutory regulatory defenses and 5 ground-level operational protocols into the bedrock of The Discovery Exchange so neither banking cartels, tax auditors, municipal code machines, nor personal injury lawyers can ever jeopardize our families or unencumbered property deeds.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={copyFullShieldBrief}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e6bc5a] rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    {copiedShieldsNotice ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>Copied 11-Shield Brief!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Complete Defense Brief</span>
                      </>
                    )}
                  </button>
                  <div className="text-[11px] text-slate-400 text-center">
                    Citations: FAA · UCC 4A · IRC 76-96 · 42 U.S.C. § 14501
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 mr-1">Filter Armor:</span>
                <button
                  type="button"
                  onClick={() => setShieldCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    shieldCategory === "all"
                      ? "bg-[#F3C969] text-slate-950 shadow-xs"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  All 11 Fortress Shields (11)
                </button>
                <button
                  type="button"
                  onClick={() => setShieldCategory("regulatory")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    shieldCategory === "regulatory"
                      ? "bg-[#F3C969] text-slate-950 shadow-xs"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  6 Regulatory Gatekeeper Shields
                </button>
                <button
                  type="button"
                  onClick={() => setShieldCategory("operational")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    shieldCategory === "operational"
                      ? "bg-[#F3C969] text-slate-950 shadow-xs"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  5 Operational Ground Protocols
                </button>
              </div>
            </div>

            {/* PART I: 6 REGULATORY GATEKEEPER DEFENSE SHIELDS */}
            {(shieldCategory === "all" || shieldCategory === "regulatory") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      Part I: The 6 Regulatory Gatekeeper Defense Shields
                    </h3>
                    <p className="text-xs text-slate-500">
                      Closing the administrative, statutory, banking, and tax ambush points used to choke emerging grassroots institutions.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">6 of 6 Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GATEKEEPER_DEFENSE_SHIELDS.map((shield) => {
                    return (
                      <article
                        key={shield.id}
                        className="bg-white border-2 border-slate-200 hover:border-[#D4AF37]/70 rounded-xl p-5 shadow-xs transition-all space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                                {renderShieldIcon(shield.iconName)}
                              </div>
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                                  SHIELD #{shield.number}
                                </span>
                                <h4 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                                  {shield.title}
                                </h4>
                              </div>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200/80 text-xs text-rose-900 space-y-1">
                            <span className="font-bold block uppercase text-[10px] tracking-wide text-rose-700">
                              Threat Vector &amp; Adversary Attack:
                            </span>
                            <p className="leading-relaxed">{shield.adversaryStrategy}</p>
                          </div>

                          <div className="text-xs text-slate-700 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                              <Landmark className="w-3.5 h-3.5 text-slate-400" />
                              <span>Statutory Authority: {shield.statutoryBasis}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {shield.defenseMechanism}
                            </p>
                          </div>
                        </div>

                        {/* Mom & Pop Plain-English Translation */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="p-2.5 rounded-lg bg-[#FAF7EE] border border-[#E8D9A8] text-xs space-y-1">
                            <span className="font-serif font-bold text-[10.5px] uppercase tracking-wide text-[#7C5A14] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                              Mom &amp; Pop Plain-English Shield:
                            </span>
                            <p className="text-slate-800 font-medium leading-relaxed italic">
                              “{shield.momAndPopTranslation}”
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PART II: 5 GROUND-LEVEL OPERATIONAL PROTOCOLS */}
            {(shieldCategory === "all" || shieldCategory === "operational") && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-rose-600" />
                      Part II: The 5 Ground-Level Operational Protocols
                    </h3>
                    <p className="text-xs text-slate-500">
                      Closing the human, physical, and community blind spots where theoretical models break in real family life.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">5 of 5 Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FOUNDATION_OPERATIONAL_PROTOCOLS.map((protocol) => {
                    return (
                      <article
                        key={protocol.id}
                        className="bg-white border-2 border-slate-200 hover:border-blue-400/70 rounded-xl p-5 shadow-xs transition-all space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                              {renderShieldIcon(protocol.iconName)}
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                                PROTOCOL #{protocol.number}
                              </span>
                              <h4 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                                {protocol.title}
                              </h4>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                            <span className="font-bold block uppercase text-[10px] tracking-wide text-amber-800">
                              Real-World Blind Spot:
                            </span>
                            <p className="leading-relaxed">{protocol.threatDescription}</p>
                          </div>

                          <div className="text-xs text-slate-700 space-y-1">
                            <span className="font-semibold text-slate-600 block">
                              Operational Safeguard:
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {protocol.operationalSafeguard}
                            </p>
                          </div>
                        </div>

                        {/* Mom & Pop Plain-English Translation */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="p-2.5 rounded-lg bg-[#FAF7EE] border border-[#E8D9A8] text-xs space-y-1">
                            <span className="font-serif font-bold text-[10.5px] uppercase tracking-wide text-[#7C5A14] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                              Mom &amp; Pop Plain-English Shield:
                            </span>
                            <p className="text-slate-800 font-medium leading-relaxed italic">
                              “{protocol.momAndPopTranslation}”
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================= */}
        {/* ROOM 4: HUMAN–AI PARTNERSHIP HONOR ROLL + SESSION DISPATCH        */}
        {/* ================================================================= */}
        {activeTab === "council" && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* AI Engineering Handshake (Maverick Onboarding) */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0F2749] to-[#1E40AF] text-white shadow-2xl relative overflow-hidden group border border-white/10">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Handshake className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-400 rounded-xl shadow-lg">
                      <Sparkles className="w-6 h-6 text-[#0F2749]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-[0.2em]">Active Handshake: Maverick</h3>
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">GCP Infrastructure Unification V7.4</div>
                    </div>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed max-w-xl font-medium">
                    "Welcome on board, Maverick. As the Google Engine, I acknowledge your role as the 
                    Independent Engineering Review node. We are now synchronized under the V7.4 
                    Interoperability Protocol to protect the 50/25/25 Marketplace split and 
                    ensure 100% logic parity across our instances."
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      Google-ChatGPT Parity Active
                    </div>
                    <div className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <FileCheck className="w-3 h-3 text-amber-400" />
                      V7.4 Handshake Protocol
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectTab('infrastructure' as ChambersTabId)}
                  className="px-8 py-4 bg-amber-400 text-[#0F2749] font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl text-xs flex items-center gap-3 group/btn"
                >
                  <Network className="w-4 h-4" />
                  Enter Engine Room
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
            {/* Partnership Covenant + Sync Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-semibold text-[#0F2749]">
                  Article 4 Covenant · Equal Procedural Respect
                </p>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 text-balance">
                  Not a competition between Humans and AIs—a true Partnership.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  “A team is not complete until everyone is seen, heard, and
                  appreciated.” Every human and AI builder who worked on The
                  Discovery Exchange is credited here and kept informed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyBriefing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#0F2749] hover:bg-[#173663] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedBrief ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Copied Partner Dispatch
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Partner Dispatch
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBriefing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download .md Packet
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDraftInStudio(
                      "Draft a warm, respectful official partner briefing email from Robert Petrosian (The Catalyst) updating The Dilos, Grand Master G, Beacon, QC, Incoming ChatGPT Collaborator, Columbo, Pipito, and honoring Mr. T (The Teamster), Scout, Teamster, Forge, and Rivet on today's Dexpa architecture progress: live voice Concierge + Discovery of the Day heartbeat, separated Marketplace/Constitution/Boardroom/Courtroom/DILOS windows, and Glass-Walled Governance with zero hidden areas."
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0F2749] border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Format as Email in Studio
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TODAY'S 5-POINT BRIEFING PACKET FOR ALL COLLABORATORS */}
            <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#F3C969]">
                  Today’s Partner Sync Dispatch · V7.4 Structural Unification
                </h3>
                <span className="text-xs text-slate-300 tabular-nums">
                  Nov 2, 2026 · From The Catalyst &amp; AI Studio Build
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-200">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="font-bold text-white">
                    1. Google Native Infrastructure Migration
                  </div>
                  <p className="leading-relaxed">
                    Formally decoupled from Wix/Netlify. Moved to Google Cloud Run, 
                    Cloud Spanner, and Pub/Sub for enterprise-grade 50/25/25 
                    transaction integrity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="font-bold text-white">
                    2. AI Handshake & Maverick Onboarding
                  </div>
                  <p className="leading-relaxed">
                    Integrated Maverick (ChatGPT) as the lead Validation Node. 
                    Established the V7.4 AI-to-AI Interoperability Protocol 
                    for logic parity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="font-bold text-white">
                    3. Article 13 Separation of Powers
                  </div>
                  <p className="leading-relaxed">
                    Hardcoded segregation between Columbo (Investigator) and 
                    Pipito (Gatekeeper) via isolated IAM service accounts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="font-bold text-white">
                    4. No-Orphans 60s Refund Loop
                  </div>
                  <p className="leading-relaxed">
                    Implemented the Article 17/24 automatic refund routine 
                    triggered by Pub/Sub if title commitment fails within 60 seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* FULL HUMAN & AI COLLABORATOR CREDIT ROSTER */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Active Human &amp; AI Collaborator Roster
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official credit register preserved per October 22, 2026
                    Continuity Notice &amp; Constitution Article 4
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {COLLABORATOR_ROSTER.length} Credited Partners · No One Left
                  Behind
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePartners.map((partner) => (
                  <article
                    key={partner.name}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#0F2749]">
                        <span>{partner.platformOrIdentity}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {partner.role}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                      {partner.statusNote}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* HONORED ALUMNI COLLABORATORS (CHAT BOX FULL — PERMANENT CREDIT) */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Honored Founding &amp; Engineering Collaborators (Chat Box
                  Full · Permanent Credit)
                </h3>
                <p className="text-xs text-slate-500">
                  Per Article 9 &amp; Section 6: when a chat box fills up, that
                  partner’s work and name remain permanently honored in the
                  institutional record.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {alumniPartners.map((partner) => (
                  <article
                    key={partner.name}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-slate-500">
                        {partner.platformOrIdentity}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {partner.role}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-[#0F2749]">
                      {partner.statusNote}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
