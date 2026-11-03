import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Wand2,
} from "lucide-react";
import { CampaignReadabilityReport } from "../utils/readabilityAnalyzer";

interface ReadabilityScoreBannerProps {
  report: CampaignReadabilityReport;
  isSimplifying: boolean;
  onSimplifyAllForFamilies: () => void;
}

export const ReadabilityScoreBanner: React.FC<ReadabilityScoreBannerProps> = ({
  report,
  isSimplifying,
  onSimplifyAllForFamilies,
}) => {
  const { overall, hardestSection } = report;

  const isAccessible = overall.accessibilityTier === "accessible";
  const isModerate = overall.accessibilityTier === "moderate";

  const statusTextColorClass = isAccessible
    ? "text-emerald-700"
    : isModerate
    ? "text-amber-700"
    : "text-red-700";

  const barWidthPercent = Math.max(
    4,
    Math.min(100, Math.round(overall.fleschReadingEase))
  );

  return (
    <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 space-y-3.5">
      {/* Top Status & Action Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {isAccessible ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : isModerate ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-bold text-slate-900">
              Family Readability Check
            </span>
            <span className="text-slate-400" aria-hidden="true">
              ·
            </span>
            <span className={`font-semibold ${statusTextColorClass}`}>
              {overall.accessibilityLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pl-5">
            {overall.audienceBand}
          </p>
        </div>

        <button
          type="button"
          disabled={isSimplifying || overall.wordCount === 0}
          onClick={onSimplifyAllForFamilies}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2749] bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
        >
          {isSimplifying ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Simplifying Copy...
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              Simplify for Families
            </>
          )}
        </button>
      </div>

      {/* Linear Flesch Reading Ease Scale (0–100) */}
      <div className="space-y-1">
        <svg
          viewBox="0 0 100 3"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Flesch Reading Ease score ${overall.fleschReadingEase} out of 100`}
          className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 block"
        >
          <rect
            x={0}
            y={0}
            width={barWidthPercent}
            height={3}
            className={
              isAccessible
                ? "fill-emerald-600"
                : isModerate
                ? "fill-amber-500"
                : "fill-red-600"
            }
          />
        </svg>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 tabular-nums">
          <span>0 · Dense</span>
          <span>60+ · Family Accessible Target</span>
          <span>100 · Effortless</span>
        </div>
      </div>

      {/* 4-Column Tabular Diagnostic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2.5 border-t border-slate-200/80 tabular-nums">
        <div>
          <div className="text-[11px] text-slate-500">Reading Ease</div>
          <div className="font-mono text-sm font-bold text-slate-900">
            {overall.fleschReadingEase}
            <span className="text-xs font-normal text-slate-500"> / 100</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500">Flesch-Kincaid</div>
          <div className="font-mono text-sm font-bold text-slate-900">
            Grade {overall.fleschKincaidGrade}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500">Avg. Sentence</div>
          <div className="font-mono text-sm font-bold text-slate-900">
            {overall.avgWordsPerSentence}
            <span className="text-xs font-normal text-slate-500"> words</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500">Length &amp; Scan</div>
          <div className="font-mono text-sm font-bold text-slate-900">
            {overall.wordCount}w
            <span className="text-xs font-normal text-slate-500">
              {" "}
              · ~{overall.estimatedReadMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* Guidance & Hardest Section Pointer */}
      <div className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
        <span>{overall.guidanceNote}</span>
        {hardestSection && hardestSection.grade > 9.5 && (
          <span className="text-slate-700 font-medium">
            {" "}
            Densest section: &ldquo;{hardestSection.heading}&rdquo; (Grade{" "}
            {hardestSection.grade}).
          </span>
        )}
      </div>
    </div>
  );
};
