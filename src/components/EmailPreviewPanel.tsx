import React, { useMemo, useState } from "react";
import {
  CalendarClock,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Film,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Monitor,
  Send,
  Smartphone,
} from "lucide-react";
import { BrandMode, EmailCampaign } from "../types/campaign";
import { buildResponsiveEmailHtml } from "../utils/emailHtmlBuilder";

type PreviewTab = "desktop" | "mobile" | "html" | "plaintext";

interface EmailPreviewPanelProps {
  campaign: EmailCampaign;
  isGeneratingImage: boolean;
  onOpenAssistantDrawer: () => void;
  onOpenCrmSync: () => void;
  allCampaigns?: EmailCampaign[];
  onSelectCampaign?: (id: string) => void;
}

export const EmailPreviewPanel: React.FC<EmailPreviewPanelProps> = ({
  campaign,
  isGeneratingImage,
  onOpenAssistantDrawer,
  onOpenCrmSync,
  allCampaigns,
  onSelectCampaign,
}) => {
  const [previewTab, setPreviewTab] = useState<PreviewTab>("desktop");
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  React.useEffect(() => {
    setImageLoadFailed(false);
  }, [campaign.imageUrl]);

  const activeSubject = useMemo(
    () =>
      campaign.subjectLines.find((s) => s.id === campaign.selectedSubjectId) ||
      campaign.subjectLines[0],
    [campaign.subjectLines, campaign.selectedSubjectId]
  );

  const generatedHtml = useMemo(
    () => buildResponsiveEmailHtml(campaign),
    [campaign]
  );

  const handleCopyHtml = async () => {
    await navigator.clipboard.writeText(generatedHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 1800);
  };

  const handleCopyPlainText = async () => {
    await navigator.clipboard.writeText(campaign.plainTextVersion);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1800);
  };

  const handleDownloadHtml = () => {
    const slug = (campaign.campaignTitle || "email-campaign")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "campaign"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isTdex = campaign.brandMode === BrandMode.TDEX;
  const isNonprofitCampaign = campaign.id === "camp-nonprofit-sponsor-01";
  const gmailRecipient = isNonprofitCampaign
    ? "projectdev@socialgoodfund.org"
    : campaign.senderEmail || "dxpalliance@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    gmailRecipient
  )}&cc=${encodeURIComponent(
    isNonprofitCampaign ? "socialgood@socialgoodfund.org, dxpalliance@gmail.com" : "dxpalliance@gmail.com"
  )}&su=${encodeURIComponent(activeSubject?.text || campaign.heroHeadline)}&body=${encodeURIComponent(
    campaign.plainTextVersion
  )}`;

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Campaign Switcher Bar (if multiple campaigns available) */}
      {allCampaigns && allCampaigns.length > 1 && onSelectCampaign && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-slate-700 whitespace-nowrap">
              Active Mailing:
            </span>
            <select
              value={campaign.id}
              onChange={(e) => onSelectCampaign(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2749]/20 truncate max-w-[280px] sm:max-w-[420px]"
            >
              {allCampaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.campaignTitle}
                </option>
              ))}
            </select>
          </div>
          {isNonprofitCampaign && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Google for Nonprofits / 501(c)(3)
            </span>
          )}
        </div>
      )}

      {/* Nonprofit Fast-Track Action Banner */}
      {isNonprofitCampaign && (
        <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-700" />
              Nonprofit Sponsor Email Ready to Send
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Recipient: <code className="bg-white/80 px-1 py-0.5 rounded border border-emerald-300 font-semibold">projectdev@socialgoodfund.org</code> · CC: <code className="bg-white/80 px-1 py-0.5 rounded border border-emerald-300 font-semibold">socialgood@socialgoodfund.org</code>
            </p>
          </div>
          <a
            href={gmailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            1-Click Send in Gmail
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      )}

      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setPreviewTab("desktop")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              previewTab === "desktop"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("mobile")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              previewTab === "mobile"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("html")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              previewTab === "html"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            HTML
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("plaintext")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              previewTab === "plaintext"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Plain Text
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Universal 1-Click Gmail Action */}
          <a
            href={gmailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open ready-to-send draft in your Gmail account"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            Open in Gmail
            <ExternalLink className="w-3 h-3 text-emerald-600" />
          </a>

          <button
            type="button"
            onClick={onOpenAssistantDrawer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Review with AI
          </button>
          <button
            type="button"
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedHtml ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied HTML
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy HTML
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            .html
          </button>
          <button
            type="button"
            onClick={onOpenCrmSync}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors whitespace-nowrap shrink-0"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            Export / Schedule CRM
          </button>
        </div>
      </div>

      {/* Inbox Envelope Header */}
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 space-y-1.5 text-xs">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-slate-600">
            <span className="font-medium text-slate-500 mr-2">From:</span>
            <span className="font-semibold text-slate-900">
              {campaign.senderName}
            </span>{" "}
            <span className="text-slate-500">&lt;{campaign.senderEmail}&gt;</span>
          </div>
          <div className="text-slate-500 tabular-nums">
            <span>{campaign.imageSize} visual</span>
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            <span>{campaign.aspectRatio}</span>
            {campaign.usedTextModel && (
              <>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>{campaign.usedTextModel}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-slate-600">
          <span className="font-medium text-slate-500 mr-2">To:</span>
          <span>{campaign.audience}</span>
        </div>
        <div className="pt-0.5">
          <span className="font-medium text-slate-500 mr-2">Subject:</span>
          <span className="font-semibold text-slate-900 text-sm">
            {activeSubject?.text}
          </span>
        </div>
        {activeSubject?.previewText && (
          <div className="text-slate-500 truncate">
            <span className="font-medium text-slate-500 mr-2">Preview:</span>
            <span>{activeSubject.previewText}</span>
          </div>
        )}
      </div>

      {/* Animated Video Teaser Companion (when generated with gemini-omni-1.1-flash) */}
      {campaign.videoUrl && (
        <div className="px-6 py-4 bg-slate-900 text-white border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-300" />
              <span className="font-semibold">
                Animated Campaign Video Teaser ({campaign.videoAspectRatio || "16:9"})
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-slate-300">
                gemini-omni-1.1-flash
              </span>
            </div>
            <a
              href={campaign.videoUrl}
              download="campaign-teaser.mp4"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              <Download className="w-3 h-3" />
              Download MP4
            </a>
          </div>
          <div className="flex justify-center">
            <video
              src={campaign.videoUrl}
              controls
              playsInline
              loop
              className={`rounded-lg border border-slate-700 bg-black ${
                campaign.videoAspectRatio === "9:16"
                  ? "max-h-[380px] w-auto"
                  : "w-full max-w-[560px]"
              }`}
            />
          </div>
        </div>
      )}

      {/* Preview Body */}
      {previewTab === "html" ? (
        <div className="p-5 bg-slate-950 text-slate-100 overflow-x-auto max-h-[780px] overflow-y-auto">
          <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap break-words">
            {generatedHtml}
          </pre>
        </div>
      ) : previewTab === "plaintext" ? (
        <div className="p-6 bg-slate-50 max-h-[780px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-600">
              Multipart MIME Plain-Text Fallback
            </span>
            <button
              type="button"
              onClick={handleCopyPlainText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied Text
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Plain Text
                </>
              )}
            </button>
          </div>
          <pre className="p-5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed font-mono text-slate-800 whitespace-pre-wrap">
            {campaign.plainTextVersion}
          </pre>
        </div>
      ) : (
        <div className="p-6 bg-slate-100/80 flex justify-center overflow-y-auto max-h-[820px]">
          <article
            className={`w-full transition-opacity duration-150 bg-white border border-slate-200 rounded-xl overflow-hidden ${
              previewTab === "mobile" ? "max-w-[375px]" : "max-w-[600px]"
            }`}
          >
            {/* Rendered Email Brand Bar */}
            <div
              className={`px-7 py-4 flex items-center justify-between gap-4 ${
                isTdex ? "bg-[#0F2749]" : "bg-slate-900"
              }`}
            >
              <span className="font-serif text-base font-bold text-white tracking-tight">
                {campaign.brandName}
              </span>
              <span className="text-xs text-slate-300 text-right">
                {isTdex ? "From the Garage to the Future" : campaign.tone}
              </span>
            </div>

            {/* Rendered Email Hero Image */}
            <div className="relative bg-slate-900 overflow-hidden">
              {isGeneratingImage && (
                <div className="absolute inset-0 z-10 bg-slate-900/75 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="w-6 h-6 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm font-medium">
                    Rendering {campaign.imageSize} campaign visual...
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    gemini-nano-banana-2.1 · {campaign.aspectRatio}
                  </p>
                </div>
              )}

              {campaign.imageUrl && !imageLoadFailed ? (
                <img
                  src={campaign.imageUrl}
                  alt={campaign.heroHeadline}
                  referrerPolicy="no-referrer"
                  onError={() => setImageLoadFailed(true)}
                  className="w-full h-auto block object-cover"
                />
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-[#0F2749] to-[#1D4B7A] flex flex-col items-center justify-center p-8 text-center text-white">
                  <ImageIcon className="w-8 h-8 text-amber-300 mb-3" />
                  <p className="font-serif text-lg font-bold max-w-md">
                    {campaign.campaignTitle}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Open the Visuals tab to generate a custom{" "}
                    {campaign.imageSize} campaign image
                  </p>
                </div>
              )}
            </div>

            {/* Hero Headline & Lead */}
            <div
              className={`${
                previewTab === "mobile" ? "px-5 py-6" : "px-8 pt-8 pb-6"
              } border-b border-slate-100`}
            >
              <p
                className={`text-xs font-semibold mb-2 ${
                  isTdex ? "text-[#A16207]" : "text-blue-700"
                }`}
              >
                {campaign.campaignTitle}
              </p>
              <h1
                className={`font-serif font-bold text-slate-900 leading-tight [text-wrap:balance] ${
                  previewTab === "mobile" ? "text-xl" : "text-2xl"
                }`}
              >
                {campaign.heroHeadline}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {campaign.heroSubheadline}
              </p>
            </div>

            {/* Salutation & Body Sections */}
            <div
              className={`${
                previewTab === "mobile" ? "px-5 py-6" : "px-8 py-6"
              } space-y-6`}
            >
              <p className="text-sm font-semibold text-slate-900">
                {campaign.openingSalutation}
              </p>

              {campaign.bodySections.map((sec) => (
                <div key={sec.id} className="space-y-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {sec.heading}
                  </h2>
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {sec.body}
                  </p>
                  {sec.callout && (
                    <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      {sec.callout}
                    </div>
                  )}
                </div>
              ))}

              {/* Primary CTA */}
              <div className="pt-2">
                <a
                  href={campaign.primaryCtaUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-6 py-3 text-sm font-semibold text-white rounded-lg transition-colors ${
                    isTdex
                      ? "bg-[#0F2749] border border-[#D4A13E] hover:bg-[#173866]"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {campaign.primaryCtaLabel}
                </a>
              </div>

              {/* Signoff */}
              <div className="pt-2 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {campaign.closingSignoff}
              </div>
            </div>

            {/* Disclosures & Unsubscribe Footer */}
            <div
              className={`${
                previewTab === "mobile" ? "px-5 py-5" : "px-8 py-6"
              } bg-slate-50 border-t border-slate-200 space-y-2`}
            >
              {campaign.disclosures.map((disc, idx) => (
                <p
                  key={idx}
                  className="text-xs text-slate-500 leading-relaxed"
                >
                  {disc}
                </p>
              ))}
              <p className="pt-2 text-xs text-slate-500">
                Sent by {campaign.senderName} ({campaign.senderEmail}) ·{" "}
                <span className="underline cursor-pointer">
                  Manage Preferences
                </span>{" "}
                · <span className="underline cursor-pointer">Unsubscribe</span>
              </p>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};
