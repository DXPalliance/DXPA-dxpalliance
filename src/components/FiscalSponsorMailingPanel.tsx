import React, { useState } from "react";
import {
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileText,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface FiscalSponsorMailingPanelProps {
  onBackToStudio?: () => void;
}

export const FiscalSponsorMailingPanel: React.FC<FiscalSponsorMailingPanelProps> = ({
  onBackToStudio,
}) => {
  const [activeTab, setActiveTab] = useState<"sponsor" | "1023ez" | "google">("sponsor");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Status state (hardcoded for now as per user instruction "We already did that")
  const applicationStatus = "submitted"; 

  const recipientEmail = "projectdev@socialgoodfund.org";
  const ccEmail = "socialgood@socialgoodfund.org, dxpalliance@gmail.com";
  const subjectLine =
    "Fiscal Sponsorship Inquiry — The Discovery Exchange & National K-12 Discovery Prize";
  const emailBody = `Dear Sponsorship Committee,

My name is Robert Petrossian, founder of The Discovery Exchange (TDEX) and the Discovery Exchange Parents Alliance (Dexpa).

We are building the National K–12 Discovery Prize—an initiative inspired by the Nobel Prize, dedicated to evaluating and celebrating authentic hands-on science and engineering discoveries created by ordinary public school students (grades 7–12) using everyday materials. All judging is conducted 100% blind through anonymous identification numbers to eliminate school or zip code bias.

We are seeking comprehensive 501(c)(3) fiscal sponsorship to steward tax-deductible educational donations, activate Google for Nonprofits technology grants, and empower our living parent board under democratic governance (1 Human Owner = 1 Vote).

We look forward to submitting our full application and partnership details.

Respectfully,
Robert Petrossian, Founder & Catalyst
The Discovery Exchange (TDEX)
Email: dxpalliance@gmail.com`;

  const purposeClause = `Said corporation is organized exclusively for educational, charitable, and scientific purposes within the meaning of section 501(c)(3) of the Internal Revenue Code, or corresponding section of any future federal tax code. Specifically, the corporation is founded to administer the National K–12 Discovery Prize—recognizing, evaluating, and rewarding hands-on applied ingenuity and scientific curiosity among America's K–12 public school students regardless of family or school district budget size—and to support living parents and community families through shared education and civic empowerment.`;

  const form1023EzLines = [
    { part: "Part I, Line 1", field: "Organization Name", value: "The Discovery Exchange (TDEX)" },
    { part: "Part I, Line 2", field: "Mailing Address", value: "Founder Principal Address" },
    { part: "Part I, Line 4", field: "Primary Contact", value: "Robert Petrossian, Founder & President (dxpalliance@gmail.com)" },
    { part: "Part I, Line 9", field: "Organization Type", value: "Corporation / Non-Profit Association" },
    { part: "Part II, Line 1", field: "Specific Purpose", value: "Youth STEM Education & The National K–12 Discovery Prize" },
    { part: "Part II, Line 2", field: "NTEE Code", value: "B20 (Elementary & Secondary Education) or B28 (Specialized STEM Education)" },
    { part: "Part III, Line 1", field: "Organizational Test", value: "Article 24 Constitution v7.4: Assets transfer solely to another 501(c)(3) education trust upon dissolution." },
    { part: "Part IV, Line 1", field: "Foundation Code", value: "170(b)(1)(A)(vi) — Publicly supported charity (1 Human Owner = 1 Vote)." },
  ];

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipientEmail
  )}&cc=${encodeURIComponent(ccEmail)}&su=${encodeURIComponent(
    subjectLine
  )}&body=${encodeURIComponent(emailBody)}`;

  const mailtoUrl = `mailto:${recipientEmail}?cc=${encodeURIComponent(
    ccEmail
  )}&subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(
    emailBody
  )}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#0F2749] to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" />
                  501(c)(3) Filing Desk
                </div>
                {applicationStatus === "submitted" && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-500/30 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    Application Submitted
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-serif font-black tracking-tight">
                The Discovery Exchange (TDEX)
              </h1>
              <p className="text-slate-300 text-sm max-w-xl font-serif italic">
                Securing official non-profit status to unlock Google for Nonprofits technology grants and $10k/mo advertising support.
              </p>
            </div>
            {onBackToStudio && (
              <button
                onClick={onBackToStudio}
                className="px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-sm transition-all cursor-pointer"
              >
                Return to Studio
              </button>
            )}
          </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab("sponsor")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sponsor"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Track A: Fiscal Sponsor Mailer
          </button>
          <button
            onClick={() => setActiveTab("1023ez")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "1023ez"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Track B: IRS Form 1023-EZ Answers
          </button>
          <button
            onClick={() => setActiveTab("google")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "google"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Google Grants Activation
          </button>
        </div>
      </div>

      {/* Tab A: Fiscal Sponsor Mailer / Status */}
      {activeTab === "sponsor" && (
        <div className="bg-white rounded-sm border border-stone-200 shadow-sm p-8 space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-stone-100 pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-black text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-600" />
                Social Good Fund Partnership
              </h2>
              <p className="text-xs text-stone-500 font-serif italic">
                Status: {applicationStatus === "submitted" ? "Initial Inquiry Submitted - Awaiting Official Application Link" : "Inquiry Pending"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Current Stage</span>
                <span className="text-xs font-bold text-amber-600">Reviewing FAQ & Application</span>
              </div>
            </div>
          </div>

          {/* Status Alert for Submitted State */}
          {applicationStatus === "submitted" && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <RefreshCw className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-serif font-bold text-amber-900">Inquiry Logged Successfully</h3>
                  <p className="text-xs text-amber-800 leading-relaxed font-serif italic">
                    "We've contacted Social Good Fund regarding the Discovery Exchange and National K-12 Discovery Prize. They've acknowledged the inquiry. Next step: Completing the full partnership application via their portal."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Primary Action Buttons (Reduced prominence since already sent) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75 grayscale-0">
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer border border-stone-200"
            >
              <Send className="w-4 h-4" />
              View Sent Inquiry in Gmail
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>

            <div
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-sm bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/10 transition-all opacity-100"
            >
              <CheckCircle2 className="w-4 h-4" />
              Application Sent to Social Good Fund
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-stone-50 p-6 rounded-sm border border-stone-200 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Primary Contact</span>
                <p className="text-xs font-bold text-stone-800">Andrea Sanchez & Oliver Hack</p>
                <p className="text-[10px] text-stone-500">Project Development & Onboarding</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Direct Office</span>
                <p className="text-xs font-bold text-stone-800">(510) 621-7223</p>
                <p className="text-[10px] text-stone-500">Social Good Fund Main Line</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Application Subject Record</span>
                <button
                  onClick={() => handleCopy(subjectLine, "subject")}
                  className="text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline cursor-pointer"
                >
                  {copiedField === "subject" ? "Copied!" : "Copy Subject"}
                </button>
              </div>
              <p className="text-xs font-serif italic text-stone-600 bg-white p-3 border border-stone-100 rounded-sm">
                {subjectLine}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: IRS Form 1023-EZ Answers */}
      {activeTab === "1023ez" && (
        <div className="bg-white rounded-2xl border-2 border-blue-500/30 shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Track B: IRS Form 1023-EZ Line-by-Line Filing Answers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact entries for filing on Pay.gov ($275 fee) for direct 501(c)(3) determination.
              </p>
            </div>
            <a
              href="https://www.pay.gov/public/form/start/81977774"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
            >
              Open Pay.gov Form
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Purpose Clause Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                IRS Required Corporate Purpose Clause (Part II)
              </span>
              <button
                onClick={() => handleCopy(purposeClause, "purpose")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                {copiedField === "purpose" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Clause
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-700 font-sans leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
              "{purposeClause}"
            </p>
          </div>

          {/* Line-by-Line Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">1023-EZ Line</th>
                  <th className="px-4 py-3">Field Name</th>
                  <th className="px-4 py-3">Your Entry</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {form1023EzLines.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                      {row.part}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">
                      {row.field}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-900">
                      {row.value}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleCopy(row.value, `line-${i}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      >
                        {copiedField === `line-${i}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab C: Google Grants Activation */}
      {activeTab === "google" && (
        <div className="bg-white rounded-2xl border-2 border-amber-500/30 shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Google for Nonprofits Activation Checklist
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Once Fiscal Sponsor or Form 1023-EZ approval arrives, unlock these benefits immediately.
              </p>
            </div>
            <a
              href="https://www.google.com/nonprofits/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer"
            >
              Google for Nonprofits
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {[
              {
                step: "1. Obtain EIN & Determination Letter",
                desc: "Supplied directly by Social Good Fund (Track A) or the IRS (Track B).",
              },
              {
                step: "2. Register at TechSoup.org",
                desc: "Validate non-profit credentials to generate your TechSoup Validation Token.",
              },
              {
                step: "3. Submit Token to Google for Nonprofits",
                desc: "Sign in at google.com/nonprofits with your Google account and enter the token.",
              },
              {
                step: "4. Activate Google Ad Grants ($10,000/Month)",
                desc: "Drive free search traffic to America's public school students and the Discovery Prize.",
              },
              {
                step: "5. Activate Google Workspace for Nonprofits",
                desc: "Free custom emails (@thediscoveryexchange.com) and cloud drives for all officers.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.step}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Step Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="font-bold text-sm text-slate-900">Send Sponsor Email</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hit <strong>1-Click Send</strong> to apply to Social Good Fund for 501(c)(3) coverage.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0F2749] flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="font-bold text-sm text-slate-900">Get IRS Letter</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Social Good Fund gives us their official 501(c)(3) determination letter and EIN.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="font-bold text-sm text-slate-900">Unlock Google Grants</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Submit the letter to TechSoup & Google for $10,000/mo in free ads and tools.
          </p>
        </div>
      </div>
    </div>
  );
};
