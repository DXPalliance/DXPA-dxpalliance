import React, { useState } from "react";
import { ArrowUpRight, Download, ExternalLink, FileText, Globe } from "lucide-react";
import { ATTACHED_TDEX_DOCS } from "../data/tdexKnowledge";

interface BrandDocsViewProps {
  onSeedPromptFromDoc: (prompt: string) => void;
}

export const BrandDocsView: React.FC<BrandDocsViewProps> = ({
  onSeedPromptFromDoc,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    ATTACHED_TDEX_DOCS[0].id
  );

  const activeDoc =
    ATTACHED_TDEX_DOCS.find((d) => d.id === selectedDocId) ||
    ATTACHED_TDEX_DOCS[0];

  const handleGenerateFromDoc = () => {
    const promptByDoc: Record<string, string> = {
      "constitution-v73":
        "Write an authoritative educational email introducing parents and educators to The Discovery Exchange Constitution Version 7.3—highlighting the National K–12 Discovery Prize as supreme Phase 1 priority, One Human Owner One Vote (Article 5), and independent verification safeguards.",
      "tdex-faq":
        "Create a plain-English 'From the Garage to the Future' onboarding email answering top family questions from the Tdex Public FAQ: how Discovery Market's 50/25/25 checkout works, what Dexpa Wallets and Nuggets mean, and how 30% of net distributable rental income supports America's K–12 students.",
      "tdex-identity-notice":
        "Draft an institutional continuity newsletter explaining The Discovery Exchange's non-profit coordinating mission, how daughter organizations sustain the National K–12 Discovery Prize, and how separated AI roles (Columbo, Pipito, and The Concierge) support human governance.",
      "tdex-preview-html":
        "Create a warm community welcome campaign inviting families to explore the 2026 Discovery Exchange pathways: Discovery Market, Discovery Exchange Parents Alliance (Dexpa), Discovery BigCoin disclosures, and the National K–12 Discovery Prize.",
    };
    onSeedPromptFromDoc(
      promptByDoc[activeDoc.id] || promptByDoc["constitution-v73"]
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-7 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            The Discovery Exchange Brand &amp; Constitutional Source Files
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Every Tdex email campaign generated in Studio is grounded in these
            attached institutional documents—enforcing official naming, Phase 1
            K–12 Prize priority, accurate 50/25/25 &amp; 70/30 allocation
            disclosures, and on-hold program boundaries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateFromDoc}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors whitespace-nowrap shrink-0"
        >
          Draft Campaign from Selected Document
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of 4 Attached Documents + Guardrails */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
          {ATTACHED_TDEX_DOCS.map((doc) => {
            const isSelected = doc.id === activeDoc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-5 transition-colors block ${
                  isSelected ? "bg-slate-50" : "bg-white hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                  <span>{doc.category}</span>
                  <span className="tabular-nums">{doc.pageCountLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  {doc.fileType === "pdf" ? (
                    <FileText className="w-4 h-4 text-[#0F2749] shrink-0" />
                  ) : (
                    <Globe className="w-4 h-4 text-[#0F2749] shrink-0" />
                  )}
                  <h2 className="text-sm font-bold text-slate-900">
                    {doc.title}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {doc.summary}
                </p>
              </button>
            );
          })}

          {/* Key Campaign Rules for Selected Document */}
          <div className="p-5 bg-slate-50/70 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900">
              Active Marketing Guardrails from {activeDoc.title}
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              {activeDoc.keyRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400 select-none">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Embedded Document Viewer */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {activeDoc.title}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {activeDoc.path}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeDoc.path}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <a
                href={activeDoc.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Raw File
              </a>
            </div>
          </div>

          <div className="bg-slate-100 h-[720px]">
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
                  // Ignore cross-origin or sandbox access restrictions
                }
              }}
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
