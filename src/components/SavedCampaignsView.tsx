import React, { useMemo, useState } from "react";
import {
  Copy,
  Download,
  FolderOpen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { BrandMode, EmailCampaign } from "../types/campaign";
import { buildResponsiveEmailHtml } from "../utils/emailHtmlBuilder";

interface SavedCampaignsViewProps {
  campaigns: EmailCampaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onDuplicateCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onCreateNew: () => void;
}

export const SavedCampaignsView: React.FC<SavedCampaignsViewProps> = ({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<"all" | BrandMode>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (brandFilter !== "all" && c.brandMode !== brandFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.campaignTitle.toLowerCase().includes(q) ||
        c.heroHeadline.toLowerCase().includes(q) ||
        c.audience.toLowerCase().includes(q) ||
        c.brandName.toLowerCase().includes(q)
      );
    });
  }, [campaigns, brandFilter, searchQuery]);

  const handleExportHtml = (campaign: EmailCampaign) => {
    const html = buildResponsiveEmailHtml(campaign);
    const slug = (campaign.campaignTitle || "campaign")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-7 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campaign Workspace Library
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            All generated email campaigns, subject line sets, and visual assets
            saved locally in your browser workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          New Campaign
        </button>
      </div>

      {/* Search & Segmented Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by title, headline, or audience..."
            className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F2749]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setBrandFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              brandFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setBrandFilter(BrandMode.TDEX)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              brandFilter === BrandMode.TDEX
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            The Discovery Exchange
          </button>
          <button
            type="button"
            onClick={() => setBrandFilter(BrandMode.CUSTOM)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              brandFilter === BrandMode.CUSTOM
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Custom Brands
          </button>
        </div>
      </div>

      {/* High-Density Data Table */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-base font-semibold text-slate-900">
            No matching email campaigns found
          </p>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try clearing your search filter or create a fresh prompt-driven
            email marketing campaign in Studio.
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First Campaign
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Campaign &amp; Selected Subject</th>
                <th className="py-3 px-4">Brand &amp; Audience</th>
                <th className="py-3 px-4 text-right">Visual Spec</th>
                <th className="py-3 px-4 text-right">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredCampaigns.map((camp) => {
                const subj =
                  camp.subjectLines.find(
                    (s) => s.id === camp.selectedSubjectId
                  ) || camp.subjectLines[0];
                const isActive = camp.id === activeCampaignId;
                const dateFormatted = new Date(
                  camp.updatedAt
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={camp.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isActive ? "bg-slate-50/60" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-slate-900 truncate">
                        {camp.campaignTitle}
                        {isActive && (
                          <span className="ml-2 text-xs font-normal text-[#A16207]">
                            · Active in Studio
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        Subject: {subj?.text}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-slate-800">
                        {camp.brandName}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[220px]">
                        {camp.audience}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {camp.imageSize} · {camp.aspectRatio}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                      {dateFormatted}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectCampaign(camp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0F2749] bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateCampaign(camp.id)}
                          title="Duplicate campaign"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportHtml(camp)}
                          title="Download HTML"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {campaigns.length > 1 &&
                          (confirmDeleteId === camp.id ? (
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteCampaign(camp.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(camp.id)}
                              title="Delete campaign"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
