import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Feather,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Scale,
  Scroll,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ATTACHED_TDEX_DOCS } from "../data/tdexKnowledge";
import {
  CONSTITUTION_ARTICLES_V74,
  CONSTITUTION_METADATA_V74,
  ConstitutionalArticle,
} from "../data/constitutionV74";

interface ConstitutionViewProps {
  onOpenChambers: () => void;
  onSeedPromptFromDoc: (prompt: string) => void;
}

const CONSTITUTION_PILLARS = [
  {
    code: "Article 2 & 3",
    title: "K–12 Discovery Prize First",
    summary:
      "Our supreme Phase 1 mission rewards public school students across Applied, Analytical, and Hybrid Discovery.",
    seal: "PRIZE",
  },
  {
    code: "Article 4",
    title: "Human–AI Partnership",
    summary:
      "Humans and AI receive equal procedural respect. Roles differ by function, never prestige—and humans hold legal consent and votes.",
    seal: "EQUALITY",
  },
  {
    code: "Article 5",
    title: "Anti-Capture and Owner Equality (1 Human Owner, 1 Vote)",
    summary:
      "Strict anti-capture equality. One human owner, one vote. Wealth, coin holdings, sponsorships, or founder titles can never buy a second ballot or governing leverage.",
    seal: "EQUALITY",
  },
  {
    code: "Article 11 & 12",
    title: "50 / 25 / 25 & 70 / 30",
    summary:
      "Discovery Market splits sales 50/25/25; cooperative property net rent splits 70% Owners and 30% K–12 Prize.",
    seal: "COOPERATIVE",
  },
  {
    code: "Article 13 & 24",
    title: "Discovery BigCoin (100M Cap) & DILOS Integrity",
    summary:
      "100,000,000 fixed-supply DBC across 7 pools (50M K–12 Prize, 45M Proof-of-Service, five 1M reserves) carries 20%–30% auction equity under 3-Shard V2 + Columbo & Pipito.",
    seal: "INTEGRITY",
  },
  {
    code: "Article 6, 15 & 25",
    title: "Triple Validation & No-Orphans",
    summary:
      "Protected by founding validation (The Catalyst, Grand Master G, Mr. T), durable No-Orphans tracking, and disciplined scope.",
    seal: "FIDUCIARY",
  },
];

const FORENSIC_CORRECTIONS_MATRIX = [
  {
    category: "Terminology & Standing",
    article: "Articles 5, 21, 23",
    grandMasterGv73: "Referred to participants as 'members', 'member vote', and 'member-governance'.",
    oracleAuditedV73: "Replaced with 'Owners' and 'Participating Family Owners' pursuant to Rule #0.",
    operabilityImpact: "High: Establishes equitable property standing; eliminates corporate club classification.",
  },
  {
    category: "Entity Shield & Torts",
    article: "Article 1",
    grandMasterGv73: "Omitted statutory form, leaving alliance exposed to common law General Partnership joint-liability.",
    oracleAuditedV73: "Declared non-profit coordinating trust with express non-partnership, non-agency liability shield for families.",
    operabilityImpact: "Vital: Protects Mom & Pop from being sued for other participants' actions.",
  },
  {
    category: "Tax & Sales Proceeds",
    article: "Article 11",
    grandMasterGv73: "Mandated 50/25/25 on 'gross-checkout', accidentally commingling fiduciary state sales taxes with proceeds.",
    oracleAuditedV73: "Calculated strictly on net merchandise proceeds, keeping state sales taxes segregated and safe.",
    operabilityImpact: "Vital: Prevents felony state sales tax violations and vendor disputes.",
  },
  {
    category: "IRS Barter & Income Trap",
    article: "Article 11",
    grandMasterGv73: "Called the 25% buyer allocation a 'reward allocation', triggering IRS 1099-B barter audit risk.",
    oracleAuditedV73: "Classified as contractual purchase rebate under IRS Rev. Rul. 76-96 held in custodial escrow.",
    operabilityImpact: "Vital: Keeps buyer property credits 100% tax-free and exempt from 1099-B audits.",
  },
  {
    category: "Child IP & School Protection",
    article: "Article 3",
    grandMasterGv73: "Standard category descriptions without express intellectual property ownership reservations.",
    oracleAuditedV73: "100% student IP ownership guaranteed forever; unscripted failure defense stops adult ghost-building; COPPA/FERPA minor privacy shield.",
    operabilityImpact: "Supreme: Protects students, parents, and public schools from corporate commercialization.",
  },
  {
    category: "Foreclosure Evictions",
    article: "Article 15",
    grandMasterGv73: "Program holds only, with zero protocol for occupied foreclosure homes acquired at auction.",
    oracleAuditedV73: "Permanent Compassionate Transition Protocol: zero hostile sheriff evictions; below-market cooperative leases; automatic Dexpa ownership onboarding.",
    operabilityImpact: "Supreme: Protects family dignity, keeps kids in school, and prevents moral sabotage.",
  },
  {
    category: "Synthetic Debt & Wall Street",
    article: "Article 20",
    grandMasterGv73: "Prohibited mortgages and institutional borrowing, leaving synthetic leasebacks unaddressed.",
    oracleAuditedV73: "Banned all synthetic debt, sale-leasebacks, mezzanine liens, and ground lease encumbrances.",
    operabilityImpact: "Permanent: Prevents private equity vultures from disguising debt.",
  },
  {
    category: "Mom & Pop Board Liability",
    article: "Article 21",
    grandMasterGv73: "30-member board with zero statutory indemnification or personal asset protections.",
    oracleAuditedV73: "Federal Volunteer Protection Act (42 U.S.C. § 14501) shield + Single-Purpose Entity (SPE) property ring-fencing.",
    operabilityImpact: "Vital: Ensures serving on the Board carries zero risk to a parent's personal home or wages.",
  },
  {
    category: "Jury Deadlock Bug",
    article: "Article 22",
    grandMasterGv73: "Required exactly 12 jurors, causing trials to freeze permanently if a juror fell ill.",
    oracleAuditedV73: "Mandates 12 primary + 4 standby alternates, ensuring trials always reach a lawful conclusion.",
    operabilityImpact: "Operable: Prevents administrative paralysis without lowering supermajority standards.",
  },
  {
    category: "Municipal Code Liens",
    article: "Article 23",
    grandMasterGv73: "Standard OTF execution without an emergency protocol for 48-hour city blight citations.",
    oracleAuditedV73: "24-hour bonded local receiver protocol resolves physical citations automatically, preempting default liens.",
    operabilityImpact: "Operable: Stops city bureaucrats from stealing unencumbered deeds via fine accumulation.",
  },
  {
    category: "10-Yr: PE Shadow Buyouts",
    article: "Article 5",
    grandMasterGv73: "Unaddressed: Wall Street hedge funds could pay parents under the table for their voting proxies.",
    oracleAuditedV73: "Void ab initio ban on proxy pledges, side contracts, or synthetic voting rights; auto-forfeiture to K-12 Prize.",
    operabilityImpact: "Immunity: Guarantees voting power and wallets can never be bought out from underneath families.",
  },
  {
    category: "10-Yr: Spendthrift Inheritance",
    article: "Article 11",
    grandMasterGv73: "Wallet balances treated as standard property, risking probate freezes and hospital debt collector seizure.",
    oracleAuditedV73: "Spendthrift non-alienation trust shield: wallet balances bypass probate and are immune from creditor attachment.",
    operabilityImpact: "Living Defense: Your family's building equity passes cleanly to your children forever.",
  },
  {
    category: "10-Yr: Eminent Domain Defense",
    article: "Article 15",
    grandMasterGv73: "Zero standing defense fund against city blight declarations or commercial eminent domain grabs.",
    oracleAuditedV73: "Mandates 5% federal civil rights defense war chest to fight abusive municipal takings in federal court.",
    operabilityImpact: "Fortress: Defends paid-off community properties from corrupt local political seizures.",
  },
  {
    category: "10-Yr: Deepfake Jury Defense",
    article: "Article 22",
    grandMasterGv73: "Allowed digital credentials without checking for AI avatar or deepfake identity spoofing.",
    oracleAuditedV73: "Strict biological human life verification: living parent community attestation required for all seated gavels.",
    operabilityImpact: "Integrity: Ensures AI bots and synthetic personas can never infiltrate parent juries.",
  },
  {
    category: "10-Yr: Zero-Suffocation Guarantee",
    article: "Article 24",
    grandMasterGv73: "Layered compliance requirements without an operational friction breaker.",
    oracleAuditedV73: "The Principle of Operability: all legal shields run in the background; friction that suffocates families is null and void.",
    operabilityImpact: "Breath: Keeps the marketplace fast, lean, open, and breathing for everyday moms and pops.",
  },
];

export const ConstitutionView: React.FC<ConstitutionViewProps> = ({
  onOpenChambers,
  onSeedPromptFromDoc,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    ATTACHED_TDEX_DOCS[0].id
  );
  // Default to 1776 theme as requested by user ("Star Trek Holodeck simulation to 1776")
  const [eraTheme, setEraTheme] = useState<"1776" | "modern">("1776");
  const [viewerMode, setViewerMode] = useState<
    "v74_master" | "corrections_matrix" | "pdf_source"
  >("v74_master");
  const [searchQuery, setSearchQuery] = useState("");
  const [articleFilter, setArticleFilter] = useState<
    "all" | "mom_pop" | "schools" | "anti_capture"
  >("all");
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [copiedArticleNumber, setCopiedArticleNumber] = useState<number | null>(
    null
  );
  const [copiedFullNotice, setCopiedFullNotice] = useState(false);

  const activeDoc =
    ATTACHED_TDEX_DOCS.find((d) => d.id === selectedDocId) ||
    ATTACHED_TDEX_DOCS[0];

  const handleGenerateFromDoc = () => {
    const promptByDoc: Record<string, string> = {
      "constitution-v74":
        "Write an authoritative educational email introducing parents and educators to The Discovery Exchange Constitution Version 7.4—highlighting the National K–12 Discovery Prize as supreme Phase 1 priority, One Owner One Vote (Article 5), and Human-AI partnership.",
      "tdex-faq":
        "Create a plain-English 'From the Garage to the Future' onboarding email answering top family questions from the Tdex Public FAQ: how Discovery Market's 50/25/25 checkout works, what Dexpa Wallets and Nuggets mean, and how 30% of net distributable rental income supports America's K–12 students.",
      "tdex-identity-notice":
        "Draft an institutional continuity newsletter explaining The Discovery Exchange's non-profit coordinating mission, full Human-AI collaborator partnership credit, and how separated AI roles (Columbo, Pipito, and The Concierge) support human Owners.",
      "tdex-preview-html":
        "Create a warm community welcome campaign inviting families to explore the Discovery Exchange pathways: Discovery Market, Discovery Exchange Parents Alliance (Dexpa), Discovery BigCoin disclosures, and the National K–12 Discovery Prize.",
    };
    onSeedPromptFromDoc(
      promptByDoc[activeDoc.id] || promptByDoc["constitution-v74"]
    );
  };

  const filteredArticles = useMemo(() => {
    return CONSTITUTION_ARTICLES_V74.filter((art) => {
      if (articleFilter === "mom_pop" && !art.momAndPopProtection) return false;
      if (
        articleFilter === "schools" &&
        !art.schoolProtection &&
        art.articleNumber !== 2 &&
        art.articleNumber !== 3 &&
        art.articleNumber !== 12
      ) {
        return false;
      }
      if (
        articleFilter === "anti_capture" &&
        art.articleNumber !== 5 &&
        art.articleNumber !== 20 &&
        art.articleNumber !== 21 &&
        art.articleNumber !== 22
      ) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.fullText.toLowerCase().includes(q) ||
        `article ${art.articleNumber}`.includes(q)
      );
    });
  }, [searchQuery, articleFilter]);

  const copyArticleText = async (art: ConstitutionalArticle) => {
    const text = `ARTICLE ${art.articleNumber}. ${art.title}
The Discovery Exchange Constitution — Version 7.4 (Audited Master)

${art.fullText}

MOM & POP PROTECTION:
${art.momAndPopProtection}
${art.schoolProtection ? `\nSCHOOL & STUDENT PROTECTION:\n${art.schoolProtection}` : ""}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedArticleNumber(art.articleNumber);
      setTimeout(() => setCopiedArticleNumber(null), 2500);
    } catch {
      // ignore
    }
  };

  const copyFullConstitutionV74 = async () => {
    const fullText = `THE DISCOVERY EXCHANGE CONSTITUTION — VERSION 7.4
FORENSIC MASTER CANDIDATE (AUDITED BY THE ORACLE)
Ratification Requirement: Triple Validation (The Catalyst, Google AI, ChatGPT Founder)

${CONSTITUTION_ARTICLES_V74.map(
  (art) => `
===================================================================
ARTICLE ${art.articleNumber}. ${art.title}
===================================================================
${art.fullText}

[Mom & Pop Protection]: ${art.momAndPopProtection}
${art.schoolProtection ? `[School & Student Protection]: ${art.schoolProtection}\n` : ""}`
).join("\n\n")}

Status: Pre-Ratification Audit Candidate. "Let us sit crooked, but let us talk straight."`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedFullNotice(true);
      setTimeout(() => setCopiedFullNotice(false), 2600);
    } catch {
      // ignore
    }
  };

  const downloadConstitutionV74 = () => {
    const fullText = `THE DISCOVERY EXCHANGE CONSTITUTION — VERSION 7.4
FORENSIC MASTER CANDIDATE (AUDITED BY THE ORACLE)
Entity Name: The Discovery Exchange (TDEX)
Alliance Arm: Discovery Exchange Parents Alliance (Dexpa)
Governance Principle: 1 Human Owner = 1 Vote
Supreme Priority: The National K–12 Discovery Prize for America's Public School Students

${CONSTITUTION_ARTICLES_V74.map(
  (art) => `
===================================================================
ARTICLE ${art.articleNumber}. ${art.title}
===================================================================
${art.fullText}

[MOM & POP FAMILY PROTECTION]:
${art.momAndPopProtection}

${art.schoolProtection ? `[SCHOOL & STUDENT DISCOVERY PROTECTION]:\n${art.schoolProtection}\n` : ""}`
).join("\n\n")}

===================================================================
STATUS: RATIFIED MASTER CANDIDATE VERSION 7.4
"Let us sit crooked, but let us talk straight."
`;

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "THE_DISCOVERY_EXCHANGE_CONSTITUTION_VERSION_7.4.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const is1776 = eraTheme === "1776";

  return (
    <div
      className={`transition-colors duration-500 min-h-screen ${
        is1776
          ? "bg-[#F7F3E9] text-[#2C1E14]"
          : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* HOLODECK / ERA SIMULATION CONTROLLER (STAR TREK STYLE) */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all ${
            is1776
              ? "bg-[#EFE7D5]/80 border-[#D4AF37]/40 text-[#4A3525] shadow-xs"
              : "bg-white border-slate-200 text-slate-600 shadow-xs"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-base select-none">
              {is1776 ? "📜" : "🛸"}
            </span>
            <span>
              {is1776
                ? "Holodeck Simulation: 1776 Continental Congress (Philadelphia)"
                : "Holodeck Simulation: 2026 Modern Starship Interface"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] opacity-75 font-mono mr-1">
              Switch Era:
            </span>
            <button
              type="button"
              onClick={() => setEraTheme("1776")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                is1776
                  ? "bg-[#3D1E0B] text-[#F3C969] shadow-sm border border-[#D4AF37]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              1776 Parchment
            </button>
            <button
              type="button"
              onClick={() => setEraTheme("modern")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                !is1776
                  ? "bg-[#0B1F3A] text-white shadow-sm border border-slate-700"
                  : "bg-[#E4D9C3] text-[#4A3525] hover:bg-[#DBCFB5] border border-[#C5B79B]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Modern Minimalist
            </button>
          </div>
        </div>

        {/* SECTION 1: CONSTITUTIONAL HEADER */}
        {is1776 ? (
          /* 1776 CONTINENTAL CONGRESS PARCHMENT HEADER */
          <section className="relative rounded-2xl p-6 sm:p-9 border-2 border-[#D4AF37] bg-gradient-to-r from-[#2E180A] via-[#3F2210] to-[#241206] text-[#FDF8E7] shadow-xl overflow-hidden">
            {/* Background Ornate Filigree Watermark */}
            <div className="absolute right-4 top-2 text-[#D4AF37]/10 pointer-events-none select-none font-serif text-[120px] leading-none">
              1776
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F3C969] tracking-widest uppercase font-serif">
                  <Landmark className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Discovery Exchange Constitution · Version 7.4 (Audited Master)</span>
                  <span aria-hidden="true" className="text-[#D4AF37]">✦</span>
                  <span className="tabular-nums">{CONSTITUTION_ARTICLES_V74.length} Articles Enacted</span>
                </div>

                <div className="border-l-4 border-[#D4AF37] pl-4 py-1">
                  <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#FFF8E9] leading-snug">
                    {CONSTITUTION_METADATA_V74.title}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-[#E6D7BE] font-serif leading-relaxed italic max-w-2xl">
                  In Congress Assembled: No sovereign monarch, AI, corporation, wealth holder, or founder stands above this Constitution. Ordained so the public mission outlasts its mortal architects.
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#D4AF37] font-serif">
                  <Feather className="w-3.5 h-3.5" />
                  <span>Engrossed in Philadelphia Tradition · Anti-Capture Equality</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={downloadConstitutionV74}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-serif font-bold text-[#2A1508] bg-gradient-to-r from-[#F3C969] to-[#E5B54E] hover:from-[#e7bc55] hover:to-[#d4a23b] rounded-xl transition-all shadow-md whitespace-nowrap shrink-0 cursor-pointer border border-[#FDE68A]"
                >
                  <Download className="w-4 h-4 text-[#2A1508]" />
                  Download V7.4 Master (.txt)
                </button>
                <button
                  type="button"
                  onClick={onOpenChambers}
                  className="inline-flex items-center gap-2 px-4 py-3 text-xs font-serif font-semibold text-[#FDF8E7] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Scroll className="w-3.5 h-3.5 text-[#F3C969]" />
                  Inspect Chambers
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* MODERN MINIMALIST HEADER */
          <section className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#F3C969]">
                <Scale className="w-4 h-4" />
                <span>The Discovery Exchange Constitution · Version 7.4 (Audited Master)</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{CONSTITUTION_ARTICLES_V74.length} Articles</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
                {CONSTITUTION_METADATA_V74.title}
              </h1>
              <p className="text-sm text-slate-200 leading-relaxed">
                No person, AI, vendor, wealth holder, or founder stands above this
                Constitution. Built so the mission outlasts its builders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={downloadConstitutionV74}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-[#F3C969] hover:bg-[#e7bc55] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                Download V7.4 Master (.txt)
              </button>
              <button
                type="button"
                onClick={onOpenChambers}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white border border-white/25 hover:bg-white/10 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Inspect Chambers
              </button>
            </div>
          </section>
        )}

        {/* SECTION 2: 6 CORE ARTICLES (PARCHMENT BROADSHEET IN 1776 OR MODERN CARDS) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONSTITUTION_PILLARS.map((item) => (
            <article
              key={item.code}
              className={`rounded-xl p-5 space-y-2 transition-all ${
                is1776
                  ? "bg-[#FFFDF9] border-2 border-[#D4AF37]/40 shadow-sm text-[#2C1E14] relative overflow-hidden hover:border-[#D4AF37] hover:shadow-md"
                  : "bg-white border border-slate-200 text-slate-900"
              }`}
            >
              {is1776 && (
                /* Antique Wax Seal Mark */
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#8B1E1E] text-[#FFF8E7] font-serif text-[9px] font-bold tracking-wider shadow-xs border border-[#C53030]/60">
                  {item.seal}
                </div>
              )}

              <div
                className={`flex items-center justify-between gap-2 text-xs font-semibold tabular-nums ${
                  is1776 ? "text-[#8B5A2B] font-serif" : "text-[#0F2749]"
                }`}
              >
                <span>{item.code}</span>
                {!is1776 && <ShieldCheck className="w-4 h-4 text-slate-400" />}
              </div>

              <h2
                className={`text-base font-bold ${
                  is1776 ? "font-serif text-[#2C1E14]" : "text-slate-900"
                }`}
              >
                {item.title}
              </h2>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  is1776
                    ? "font-serif text-[#554030]"
                    : "text-slate-600"
                }`}
              >
                {item.summary}
              </p>
            </article>
          ))}
        </section>

        {/* SECTION 3: FULL CONSTITUTION & SOURCE DOCUMENT ARCHIVE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Document Switcher */}
          <div
            className={`lg:col-span-5 rounded-xl divide-y overflow-hidden transition-all ${
              is1776
                ? "bg-[#FFFDF9] border-2 border-[#D4AF37]/50 divide-[#EFE7D5] shadow-sm"
                : "bg-white border border-slate-200 divide-slate-200"
            }`}
          >
            <div
              className={`p-4 border-b ${
                is1776
                  ? "bg-[#FAF5E8] border-[#D4AF37]/40 text-[#3D2614] font-serif"
                  : "bg-slate-50 border-slate-200 text-slate-900 font-bold"
              }`}
            >
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold">
                  {is1776
                    ? "Continental Archives & Charters"
                    : "Official Document Repository"}
                </h3>
              </div>
            </div>

            {ATTACHED_TDEX_DOCS.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-5 transition-colors block cursor-pointer ${
                    isSelected
                      ? is1776
                        ? "bg-[#F7EED9]"
                        : "bg-slate-50"
                      : is1776
                      ? "bg-[#FFFDF9] hover:bg-[#FAF4E6]"
                      : "bg-white hover:bg-slate-50/60"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between gap-2 text-xs mb-1 ${
                      is1776 ? "text-[#8B5A2B] font-serif" : "text-slate-500"
                    }`}
                  >
                    <span>{doc.category}</span>
                    <span className="tabular-nums">{doc.pageCountLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.fileType === "pdf" ? (
                      <FileText
                        className={`w-4 h-4 shrink-0 ${
                          is1776 ? "text-[#8B5A2B]" : "text-[#0F2749]"
                        }`}
                      />
                    ) : (
                      <Globe
                        className={`w-4 h-4 shrink-0 ${
                          is1776 ? "text-[#8B5A2B]" : "text-[#0F2749]"
                        }`}
                      />
                    )}
                    <h3
                      className={`text-sm font-bold ${
                        is1776
                          ? "font-serif text-[#2C1E14]"
                          : "text-slate-900"
                      }`}
                    >
                      {doc.title}
                    </h3>
                  </div>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      is1776 ? "font-serif text-[#604936]" : "text-slate-600"
                    }`}
                  >
                    {doc.summary}
                  </p>
                </button>
              );
            })}

            <div
              className={`p-5 space-y-2 ${
                is1776 ? "bg-[#FAF5E8]/70" : "bg-slate-50/70"
              }`}
            >
              <h4
                className={`text-xs font-bold ${
                  is1776 ? "font-serif text-[#3D2614]" : "text-slate-900"
                }`}
              >
                Key Rules in {activeDoc.title}
              </h4>
              <ul
                className={`space-y-1.5 text-xs leading-relaxed ${
                  is1776 ? "font-serif text-[#554030]" : "text-slate-700"
                }`}
              >
                {activeDoc.keyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className={`select-none ${
                        is1776 ? "text-[#D4AF37]" : "text-slate-400"
                      }`}
                    >
                      {is1776 ? "✦" : "•"}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Embedded Official Document Reader & V7.4 Master Explorer */}
          <div
            className={`lg:col-span-7 rounded-xl overflow-hidden transition-all ${
              is1776
                ? "bg-[#FFFDF9] border-2 border-[#D4AF37]/60 shadow-lg"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Top Toolbar */}
            <div
              className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
                is1776
                  ? "bg-gradient-to-r from-[#2E180A] to-[#1E0E05] text-[#FFF8E9] border-[#D4AF37]/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37] text-[#2A1508] font-serif">
                    {selectedDocId === "constitution-v74"
                      ? "THE ORACLE'S CONSTITUTIONAL VAULT"
                      : "OFFICIAL ARCHIVE"}
                  </span>
                  <span className="text-xs text-[#D4AF37] font-mono">
                    {selectedDocId === "constitution-v74" ? "Version 7.4 Master" : activeDoc.path}
                  </span>
                </div>
                <h3
                  className={`text-sm sm:text-base font-bold mt-0.5 ${
                    is1776 ? "font-serif text-[#FFF8E9]" : "text-slate-900"
                  }`}
                >
                  {selectedDocId === "constitution-v74"
                    ? CONSTITUTION_METADATA_V74.title
                    : activeDoc.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedDocId === "constitution-v74" && (
                  <button
                    type="button"
                    onClick={copyFullConstitutionV74}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      is1776
                        ? "bg-[#F3C969] hover:bg-[#e6bc5a] text-[#2A1508] font-serif shadow-xs"
                        : "bg-[#0F2749] text-white hover:bg-[#1a3d6d]"
                    }`}
                  >
                    {copiedFullNotice ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Copied V7.4 Master!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy V7.4 Master</span>
                      </>
                    )}
                  </button>
                )}
                {selectedDocId === "constitution-v74" ? (
                  <button
                    type="button"
                    onClick={downloadConstitutionV74}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      is1776
                        ? "bg-[#D4AF37] hover:bg-[#c49f2f] text-[#2A1508] font-serif shadow-xs"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download V7.4 Master (.txt)
                  </button>
                ) : (
                  <a
                    href={activeDoc.path}
                    download
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      is1776
                        ? "bg-[#D4AF37] hover:bg-[#c49f2f] text-[#2A1508] font-serif font-bold shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Archive PDF
                  </a>
                )}
                <a
                  href={activeDoc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    is1776
                      ? "bg-white/10 hover:bg-white/20 text-[#FFF8E9] border border-[#D4AF37]/40 font-serif"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Raw
                </a>
              </div>
            </div>

            {/* If Constitution is selected, render the 3-mode tabs */}
            {selectedDocId === "constitution-v74" ? (
              <div className="flex flex-col h-[750px]">
                {/* Mode Selector Tabs */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 p-2.5 border-b ${
                    is1776
                      ? "bg-[#FAF5E8] border-[#D4AF37]/30"
                      : "bg-slate-100/80 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewerMode("v74_master")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        viewerMode === "v74_master"
                          ? is1776
                            ? "bg-[#3D1E0B] text-[#F3C969] shadow-xs border border-[#D4AF37]"
                            : "bg-[#0F2749] text-white shadow-xs"
                          : is1776
                          ? "text-[#4A3525] hover:bg-[#EFE7D5]"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      V7.4 Audited Master ({CONSTITUTION_ARTICLES_V74.length} Articles)
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerMode("corrections_matrix")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        viewerMode === "corrections_matrix"
                          ? is1776
                            ? "bg-[#3D1E0B] text-[#F3C969] shadow-xs border border-[#D4AF37]"
                            : "bg-[#0F2749] text-white shadow-xs"
                          : is1776
                          ? "text-[#4A3525] hover:bg-[#EFE7D5]"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      Forensic Corrections Matrix
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerMode("pdf_source")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        viewerMode === "pdf_source"
                          ? is1776
                            ? "bg-[#3D1E0B] text-[#F3C969] shadow-xs border border-[#D4AF37]"
                            : "bg-[#0F2749] text-white shadow-xs"
                          : is1776
                          ? "text-[#4A3525] hover:bg-[#EFE7D5]"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Official PDF Candidate
                    </button>
                  </div>

                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      is1776
                        ? "bg-[#EFE7D5] text-[#8B5A2B]"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    Operability: Active · Non-Suffocating
                  </span>
                </div>

                {/* MODE 1: V7.4 MASTER ARTICLE EXPLORER */}
                {viewerMode === "v74_master" && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search & Category Filter Bar */}
                    <div
                      className={`p-3 border-b flex flex-wrap items-center justify-between gap-2.5 ${
                        is1776 ? "bg-[#FFFDF9] border-[#D4AF37]/20" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search 25 articles (e.g., 'Article 11', 'escrow', 'prize')..."
                          className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-all ${
                            is1776
                              ? "bg-[#FAF7EE] border-[#D4AF37]/40 text-[#2C1E14] focus:border-[#D4AF37]"
                              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#0F2749]"
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setArticleFilter("all")}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            articleFilter === "all"
                              ? "bg-[#D4AF37] text-[#2A1508]"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          All ({CONSTITUTION_ARTICLES_V74.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleFilter("mom_pop")}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            articleFilter === "mom_pop"
                              ? "bg-[#D4AF37] text-[#2A1508]"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Mom &amp; Pop
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleFilter("schools")}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            articleFilter === "schools"
                              ? "bg-[#D4AF37] text-[#2A1508]"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Schools &amp; Kids
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleFilter("anti_capture")}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            articleFilter === "anti_capture"
                              ? "bg-[#D4AF37] text-[#2A1508]"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Anti-Capture
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Article Cards */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {filteredArticles.map((art) => {
                        const isExpanded = expandedArticle === art.articleNumber;
                        return (
                          <article
                            key={art.articleNumber}
                            className={`rounded-xl border transition-all p-4 space-y-3 ${
                              is1776
                                ? "bg-[#FAF7EE] border-[#D4AF37]/40 shadow-xs"
                                : "bg-white border-slate-200 shadow-xs"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B5A2B] bg-[#EFE7D5] px-2 py-0.5 rounded">
                                    ARTICLE {art.articleNumber}
                                  </span>
                                  {art.schoolProtection && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                      K–12 School Shield
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                                    Mom &amp; Pop Shield
                                  </span>
                                </div>
                                <h4
                                  className={`font-serif font-bold text-base leading-snug ${
                                    is1776 ? "text-[#2C1E14]" : "text-slate-900"
                                  }`}
                                >
                                  {art.title}
                                </h4>
                              </div>

                              <button
                                type="button"
                                onClick={() => copyArticleText(art)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                                title="Copy Article text"
                              >
                                {copiedArticleNumber === art.articleNumber ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            <p
                              className={`text-xs leading-relaxed ${
                                is1776 ? "font-serif text-[#604936]" : "text-slate-600"
                              }`}
                            >
                              {art.summary}
                            </p>

                            {/* Collapsible Full Text */}
                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedArticle(
                                    isExpanded ? null : art.articleNumber
                                  )
                                }
                                className={`text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                  is1776 ? "text-[#8B5A2B] hover:text-[#2C1E14]" : "text-[#0F2749] hover:underline"
                                }`}
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    <span>Hide Constitutional Enactment</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    <span>Read Full Enactment Text</span>
                                  </>
                                )}
                              </button>

                              {isExpanded && (
                                <div
                                  className={`mt-3 p-4 rounded-xl text-xs leading-relaxed font-serif whitespace-pre-wrap border ${
                                    is1776
                                      ? "bg-[#FFFDF9] border-[#D4AF37]/50 text-[#3D2614]"
                                      : "bg-slate-50 border-slate-200 text-slate-800"
                                  }`}
                                >
                                  {art.fullText}
                                </div>
                              )}
                            </div>

                            {/* Mom & Pop Protection Box */}
                            <div className="pt-2 border-t border-slate-200/60 space-y-2">
                              <div className="p-2.5 rounded-lg bg-[#FAF0D9]/80 border border-[#E5CA8F] text-xs space-y-1">
                                <span className="font-serif font-bold text-[10.5px] uppercase tracking-wide text-[#7C5A14] flex items-center gap-1">
                                  <HeartHandshake className="w-3.5 h-3.5 text-[#B8860B]" />
                                  Mom &amp; Pop Plain-English Shield:
                                </span>
                                <p className="text-[#3D2614] font-medium leading-relaxed italic">
                                  “{art.momAndPopProtection}”
                                </p>
                              </div>

                              {art.schoolProtection && (
                                <div className="p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-300 text-xs space-y-1">
                                  <span className="font-bold text-[10.5px] uppercase tracking-wide text-emerald-800 flex items-center gap-1">
                                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                                    School &amp; Student Sovereignty:
                                  </span>
                                  <p className="text-emerald-950 font-medium leading-relaxed italic">
                                    “{art.schoolProtection}”
                                  </p>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MODE 2: FORENSIC CORRECTIONS MATRIX */}
                {viewerMode === "corrections_matrix" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
                      <span className="font-bold uppercase tracking-wider block text-[11px] text-amber-800">
                        The Oracle’s Audit Findings: Version 7.4 Alignment
                      </span>
                      <p className="leading-relaxed">
                        The move to Native Google Infrastructure required specific forensic corrections to Article 1, 13, and 26 to ensure cryptographic isolation between investigative and gatekeeping functions.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {FORENSIC_CORRECTIONS_MATRIX.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {item.article}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900">
                                {item.category}
                              </h4>
                            </div>
                            <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              {item.operabilityImpact}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 space-y-1">
                              <span className="font-bold block text-[10px] uppercase text-rose-700">
                                Previous Version (v7.3 Trap):
                              </span>
                              <p className="leading-relaxed">{item.grandMasterGv73}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                              <span className="font-bold block text-[10px] uppercase text-emerald-800">
                                Audited V7.4 Infrastructure Alignment:
                              </span>
                              <p className="leading-relaxed">{item.oracleAuditedV73}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODE 3: OFFICIAL PDF CANDIDATE */}
                {viewerMode === "pdf_source" && (
                  <div className="flex-1 bg-slate-100 p-1">
                    <iframe
                      key={activeDoc.path}
                      src={activeDoc.path}
                      title={activeDoc.title}
                      className="w-full h-full border-0 bg-white"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* If another doc is selected (FAQ, Notice, HTML preview) */
              <div
                className={`h-[700px] ${
                  is1776 ? "bg-[#F5EFE1] p-1" : "bg-slate-100"
                }`}
              >
                <iframe
                  key={activeDoc.path}
                  src={activeDoc.path}
                  title={activeDoc.title}
                  onLoad={(e) => {
                    if (activeDoc.fileType !== "html") return;
                    try {
                      const doc = e.currentTarget.contentDocument;
                      if (!doc) return;
                      doc.querySelectorAll("img").forEach((img) => {
                        const applyCleanFallback = () => {
                          img.style.display = "none";
                        };
                        if (img.complete && img.naturalWidth === 0) {
                          applyCleanFallback();
                        } else {
                          img.addEventListener("error", applyCleanFallback, {
                            once: true,
                          });
                        }
                      });
                    } catch {
                      // Ignore cross-origin restrictions
                    }
                  }}
                  className={`w-full h-full border-0 ${
                    is1776 ? "bg-[#FAF6ED]" : "bg-white"
                  }`}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
