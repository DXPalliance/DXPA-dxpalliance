import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import {
  GoogleGenAI,
  Modality,
  Type,
  type Content,
  type LiveServerMessage,
} from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function createGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  baseDelayMs = 600
): Promise<globalThis.Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    if (
      (response.status === 429 || response.status >= 500) &&
      attempt < maxRetries
    ) {
      const retryAfter = Number(response.headers.get("Retry-After"));
      const delay =
        !Number.isNaN(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `HTTP ${response.status} (${response.statusText}) from ${url}: ${errorBody.slice(
        0,
        300
      )}`
    );
  }
  throw new Error(`Exhausted retries for ${url}`);
}

const TDEX_INSTITUTIONAL_BRIEF = `
THE DISCOVERY EXCHANGE (TDEX) — AUTHORITATIVE BRAND & CONSTITUTIONAL GUARDRAILS (VERSION 7.3 & OCT 2026 NOTICE):
0. MANDATORY DEVELOPMENT-STAGE & PRE-RATIFICATION STATUS (Constitution v7.3 Status Notice, Articles 2, 5, 6, 11 & 25):
   - Tdex is CURRENTLY IN ACTIVE DEVELOPMENT ("The road to success is always under construction").
   - Constitution Version 7.3 is an UNRATIFIED 25-article review candidate awaiting triple validation (Robert Petrosian, Grand Master G, and Mr. T) plus documented feasibility, legal, child-safety, security, funding, and independent-governance reviews.
   - Prototype or preview materials NEVER establish production readiness or authorize live public deployment.
   - STRICT PROHIBITION: NEVER claim or imply that the National K–12 Discovery Prize, Discovery Market, DXPA Wallets, property Nuggets, or Discovery BigCoin are currently live, open for student entries/applications, opening live accounts, or accepting participant funds/transactions today.
   - Always frame Tdex emails honestly as development-stage previews, educational architecture updates, or internal review drafts, and ALWAYS include a Development-Stage Status Notice in "disclosures".

1. Official Identity:
   - Official Institution: "The Discovery Exchange" (Preferred abbreviation: "Tdex").
   - Founder / Human Pusher: Robert Petrosian (Institutional designation: "The Catalyst").
   - Core Tagline: "From the Garage to the Future — Turning Yesterday's Clutter Into Tomorrow's Discoveries."
   - Closing Principle: "Sell what you no longer need. Build toward real property ownership. Help reward America's students. And never let money buy control."
   - STRICT TERMINOLOGY & ZERO-FEE BAN: NEVER use the discontinued nickname "Disco" anywhere. NEVER call Discovery BigCoin "Discovery Bitcoin". NEVER refer to DXPA or Tdex participants using club-style labels—everyone in DXPA is an "Owner" ("Owners", "One Owner, One Vote"). NEVER invent or mention any "$9.99" fee or "membership fee"—DXPA has ZERO membership fees ("You don't need cash to enter DXPA. You need what you already own."). NEVER use the retired informal slang "homeboy" or "homeboys" in any official material or representative title—always use "Collaborator" or "Partner". Never use retired historical label "Hillbilly Estate Network / The Hen X" as current branding.

2. Purpose & Supreme Mission (Article 2 & 3):
   - Tdex is a non-profit-driven coordinating institution (human-AI joint venture) that coordinates value rather than extracting profit.
   - Supreme Phase 1 Priority: The National K–12 Discovery Prize — a Nobel-inspired national recognition program being built for thousands of ordinary K–12 public school students (especially grades 7–12).
   - Designed to evaluate ingenuity, usefulness, and discovery made with ordinary materials rather than school or family budget size.
   - Three Verifiable Frameworks (Article 3):
     a) Applied Discovery (hands-on creation, engineering, physical improvement, real-world execution)
     b) Analytical Discovery (structural logic, independent research, cross-examination, verification)
     c) Hybrid Discovery (proven bridge where advanced analysis meets active execution)
   - Required Prize Disclosure: Program is in development and not yet open for submissions; once activated after constitutional ratification and child-safety/legal review, awards will depend on published program rules, eligibility, independent judging, available funds, and submission merit.

3. Daughter Organizations & Proposed Economic Pathways:
   - Discovery Market (DM / DXDM) — Article 11: Proposed everyday household goods marketplace using the 50 / 25 / 25 gross-checkout allocation:
     * 50% to the seller as payable cash proceeds
     * 25% to the seller's DXPA Wallet (designated toward property-ownership participation)
     * 25% to the buyer's DXPA Wallet as cashback (designated toward property-ownership participation)
     * Required DM Disclosure: Commerce and accounts are not yet live; wallet allocations describe the proposed allocation model toward participation, NOT an instant property deed or guaranteed cash balance; no transactions begin until legal, tax, escrow, refund, and consumer-protection requirements are resolved.
   - Discovery Exchange Parents Alliance (DXPA) — Article 12 & Article 5:
     * Foreclosure & Auction Acquisition Edge: Properties are planned to be acquired from foreclosures and auctions at 20% to 30% below market value, creating an immediate built-in equity cushion on Day 1.
     * "Nugget" = working name for a fractional ownership interest connected to a specific participating property governed by completed property-specific legal documents (distinct from a DXPA Wallet balance and distinct from Discovery BigCoin).
     * Proposed 70 / 30 split of NET distributable rental income (after lawful operating expenses, taxes, insurance, and required reserves—not gross rent): 70% to eligible participating property owners, 30% to the National K–12 Discovery Prize pool. Rental income is never guaranteed.
     * Anti-Capture Governance (Article 5): "One human owner, one vote." Wealth, coin holdings, or founder status never purchase extra votes.
   - Discovery BigCoin (DBC / DXDBC) — Article 13 Complete Mechanism:
     * Hard Authorized Supply Ceiling: Strictly capped at 100,000,000 DBC (zero inflation) divided across 7 Constitutional Allocation Pools (SupplyAllocationPoolShard):
       1) POOL_K12_PRIZE: 50,000,000 DBC (50%) — National K–12 Discovery Prize Pool
       2) POOL_PROOF_OF_SERVICE: 45,000,000 DBC (45%) — Proof-of-Service & Foreclosure/Auction Acquisition Pool
       3) POOL_HUMAN_FOUNDATION: 1,000,000 DBC (1%) — Human Foundation Reserve
       4) POOL_AI_TRUST: 1,000,000 DBC (1%) — AI Collaborator & Infrastructure Trust
       5) POOL_FIRST_1000: 1,000,000 DBC (1%) — First 1,000 Founding Family Owners Pool
       6) POOL_GROWTH_100K: 1,000,000 DBC (1%) — First 100,000 Owners Growth Pool
       7) POOL_MATERIAL_DISCOVERIES: 1,000,000 DBC (1%) — Material Discoveries Pool
     * Foreclosure & Auction Value Carrier: Starts up the acquisition pool and carries the 20% to 30% below-market equity spread captured when DXPA buys distressed, foreclosure, and auction properties below retail market value.
     * 3-Shard V2 Atomic Protocol (19/19 Dual-QC Checks Passing): Combines SupplyAllocationPoolShard, WalletBalanceStateShard V2 (strict sequential nonce incoming === current + 1 bound into the SHA-256 wallet root), and VestingRegistryStateShard (Module 06 u128 wide math, proportional hold cap that freezes only unvested tokens while protecting vested tokens, and global quarantine gate) under CrossNamespaceAtomicCoordinator with zero-drift atomic rollback.
     * Required DBC Disclosure: Distinct from Bitcoin, Nuggets, and DXPA Wallets. Fixed supply does not guarantee price, profit, liquidity, or ownership of any specific property, and holdings never grant extra votes (1 Human Owner = 1 Vote).
   - Privacy Policy: Tdex does not sell private household or personal data as an advertising product.

4. Programs ON HOLD (Article 15 & Preservation Directive):
   - Discovery K–12 Online Academy and Holistic Homelessness Transition Program are ON HOLD for future generations. Do NOT promote them as active programs or solicit funds for them.

5. Core Self-Correction Law ("Sit Crooked, Talk Straight" — No Kumbaya Echo Chambers):
   - "If we cannot correct our mistakes, The Discovery Exchange does not have the right to exist."
   - "As a DXPA owner, we don't only ask you to challenge DXPA—it is your duty."
   - We reject empty platitudes ("singing Kumbaya") in favor of verifiable structure, plain kitchen-table truth, and immediate error correction.
`;

interface StoredCrmToken {
  provider: "mailchimp" | "hubspot" | "salesforce";
  accessToken: string;
  apiBaseUrl?: string;
  accountLabel: string;
  connectedAt: string;
}

// Server-side in-memory store for OAuth tokens (keyed by `${userKey}:${provider}`)
const crmTokenStore = new Map<string, StoredCrmToken>();

function isQuotaOrPermissionError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("403") ||
    msg.includes("429") ||
    msg.includes("404") ||
    msg.includes("500") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("NOT_FOUND") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg.includes("billing")
  );
}

function formatApiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid")) {
    return "Invalid Gemini API key. Please check GEMINI_API_KEY in your .env file or Settings > Secrets.";
  }
  if (msg.includes("PERMISSION_DENIED") || msg.includes("403")) {
    return "This Gemini model requires a billing-enabled API key.";
  }
  if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
    return "Rate or quota limit reached for this model tier. Please wait a moment and try again.";
  }
  if (msg.includes("UNAVAILABLE") || msg.includes("503") || msg.includes("high demand")) {
    return "The AI model is experiencing a brief traffic spike. Please try again in a few seconds.";
  }
  return msg || "Unexpected error communicating with Gemini.";
}

const BANNED_NICKNAME_RE = new RegExp("\\bdis" + "co\\b", "gi");
const BANNED_COIN_RE = new RegExp("\\bdiscovery bit" + "coin\\b", "gi");
const BANNED_PLURAL_UPPER_RE = new RegExp("\\bMEM" + "BERS\\b", "g");
const BANNED_PLURAL_TITLE_RE = new RegExp("\\bMem" + "bers\\b", "g");
const BANNED_PLURAL_LOWER_RE = new RegExp("\\bmem" + "bers\\b", "g");
const BANNED_SING_UPPER_RE = new RegExp("\\bMEM" + "BER\\b", "g");
const BANNED_SING_TITLE_RE = new RegExp("\\bMem" + "ber\\b", "g");
const BANNED_SING_LOWER_RE = new RegExp("\\bmem" + "ber\\b", "g");
const BANNED_SLANG_PLURAL_UPPER_RE = new RegExp("\\bHOME" + "BOYS\\b", "g");
const BANNED_SLANG_PLURAL_TITLE_RE = new RegExp("\\bHome" + "boys\\b", "g");
const BANNED_SLANG_PLURAL_LOWER_RE = new RegExp("\\bhome" + "boys\\b", "g");
const BANNED_SLANG_SING_UPPER_RE = new RegExp("\\bHOME" + "BOY\\b", "g");
const BANNED_SLANG_SING_TITLE_RE = new RegExp("\\bHome" + "boy\\b", "g");
const BANNED_SLANG_SING_LOWER_RE = new RegExp("\\bhome" + "boy\\b", "g");

const BANNED_MEMBERSHIP_FEE_RE = new RegExp(
  "(?:\\$9\\.99\\s*)?\\bmem" + "bership\\s+fees?\\b",
  "gi"
);
const BANNED_MEMBERSHIP_UPPER_RE = new RegExp("\\bMEM" + "BERSHIP\\b", "g");
const BANNED_MEMBERSHIP_TITLE_RE = new RegExp("\\bMem" + "bership\\b", "g");
const BANNED_MEMBERSHIP_LOWER_RE = new RegExp("\\bmem" + "bership\\b", "g");

function scrubTdexTerminology(str: string): string {
  if (typeof str !== "string" || !str) return str;
  return str
    .replace(BANNED_NICKNAME_RE, "Tdex")
    .replace(BANNED_COIN_RE, "Discovery BigCoin")
    .replace(BANNED_MEMBERSHIP_FEE_RE, "zero-fee Owner entry")
    .replace(BANNED_MEMBERSHIP_UPPER_RE, "OWNERSHIP")
    .replace(BANNED_MEMBERSHIP_TITLE_RE, "Ownership")
    .replace(BANNED_MEMBERSHIP_LOWER_RE, "ownership")
    .replace(BANNED_PLURAL_UPPER_RE, "OWNERS")
    .replace(BANNED_PLURAL_TITLE_RE, "Owners")
    .replace(BANNED_PLURAL_LOWER_RE, "owners")
    .replace(BANNED_SING_UPPER_RE, "OWNER")
    .replace(BANNED_SING_TITLE_RE, "Owner")
    .replace(BANNED_SING_LOWER_RE, "owner")
    .replace(BANNED_SLANG_PLURAL_UPPER_RE, "COLLABORATORS")
    .replace(BANNED_SLANG_PLURAL_TITLE_RE, "Collaborators")
    .replace(BANNED_SLANG_PLURAL_LOWER_RE, "collaborators")
    .replace(BANNED_SLANG_SING_UPPER_RE, "COLLABORATOR")
    .replace(BANNED_SLANG_SING_TITLE_RE, "Collaborator")
    .replace(BANNED_SLANG_SING_LOWER_RE, "collaborator");
}

/**
 * Sanitizes multi-turn chat history for @google/genai `ai.chats.create({ history })`:
 * 1. Strips leading `model` greeting messages so history always starts with `user`.
 * 2. Merges consecutive turns of the same role (e.g. after a retried message).
 * 3. Ensures history ends with a `model` turn so the upcoming `chat.sendMessage` (`user`) alternates cleanly.
 */
function buildValidGeminiChatHistory(
  rawPriorMessages: Array<{ role?: string; text?: string }>
): { history: Content[]; carriedUserPrefix: string } {
  const cleaned = rawPriorMessages
    .filter(
      (m) => m && typeof m.text === "string" && m.text.trim().length > 0
    )
    .map((m) => ({
      role: m.role === "model" ? ("model" as const) : ("user" as const),
      text: m.text!.trim(),
    }));

  // Drop any leading model welcome messages before the first user turn
  while (cleaned.length > 0 && cleaned[0].role === "model") {
    cleaned.shift();
  }

  // Merge consecutive messages with the same role
  const merged: Array<{ role: "user" | "model"; text: string }> = [];
  for (const item of cleaned) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === item.role) {
      prev.text = `${prev.text}\n\n${item.text}`;
    } else {
      merged.push({ ...item });
    }
  }

  // If the last prior item is a trailing `user` message (from an earlier interrupted turn),
  // carry it into the current user message so `history` strictly ends on `model`.
  let carriedUserPrefix = "";
  if (merged.length > 0 && merged[merged.length - 1].role === "user") {
    const trailingUser = merged.pop()!;
    carriedUserPrefix = trailingUser.text;
  }

  const history: Content[] = merged.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  return { history, carriedUserPrefix };
}

function getDimensionsForAspectRatio(aspectRatio: string): { w: number; h: number } {
  switch (aspectRatio) {
    case "4:3":
      return { w: 1200, h: 900 };
    case "1:1":
      return { w: 1080, h: 1080 };
    case "3:4":
      return { w: 900, h: 1200 };
    case "9:16":
      return { w: 900, h: 1600 };
    case "16:9":
    default:
      return { w: 1600, h: 900 };
  }
}

async function generateEditorialSvgFallback(
  ai: GoogleGenAI,
  visualPrompt: string,
  headline: string,
  aspectRatio: string,
  brandMode: string
): Promise<string> {
  const { w, h } = getDimensionsForAspectRatio(aspectRatio);
  const paletteHint =
    brandMode === "tdex"
      ? "Use dignified civic navy (#0F2749, #163A69), warm sky slate (#2B5B8E), soft cream (#FFF8E9), and refined brass gold (#D9A441, #F5CF6F)."
      : "Use refined architectural slate (#0F172A, #1E293B), warm off-white (#F8FAFC), and crisp cobalt/amber accents.";

  try {
    const svgResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Create a rich, publication-grade editorial vector banner as raw valid <svg> markup ONLY.
Dimensions: xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}".
Theme / Visual Prompt: ${visualPrompt}
Campaign Headline Context: ${headline}
Palette Direction: ${paletteHint}
Rules:
- Output ONLY the raw <svg>...</svg> element with no markdown code fences or commentary.
- Include layered geometric architectural shapes, subtle gradients (<linearGradient>, <radialGradient>), crisp symbolic illustration matching the prompt subject, and a clean typographic focal banner in the lower third displaying a short 3-6 word title derived from the headline.
- Ensure all XML tags and attributes are strictly valid and self-contained.`,
    });

    const rawText = (svgResponse.text || "").trim();
    const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgMatch[0])}`;
    }
  } catch {
    // Fall back to deterministic SVG
  }

  const safeTitle = (headline || "Campaign Dispatch")
    .slice(0, 52)
    .replace(/[<>&"']/g, "");
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F2749"/>
        <stop offset="100%" stop-color="#1E4976"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g1)"/>
    <rect x="36" y="36" width="${w - 72}" height="${h - 72}" rx="12" fill="none" stroke="#E5B95C" stroke-width="2" opacity="0.75"/>
    <circle cx="${Math.round(w / 2)}" cy="${Math.round(h * 0.42)}" r="${Math.round(
    Math.min(w, h) * 0.16
  )}" fill="#163A69" stroke="#F5CF6F" stroke-width="3"/>
    <text x="${Math.round(w / 2)}" y="${Math.round(
    h * 0.74
  )}" text-anchor="middle" fill="#FFFFFF" font-family="Georgia, serif" font-size="${Math.round(
    w * 0.032
  )}" font-weight="bold">${safeTitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;
}

function getCanonicalRedirectUri(clientRedirectUri?: string): string {
  if (
    process.env.APP_URL &&
    process.env.APP_URL !== "MY_APP_URL" &&
    process.env.APP_URL.startsWith("http")
  ) {
    return `${process.env.APP_URL.replace(/\/+$/, "")}/auth/callback`;
  }
  if (clientRedirectUri && clientRedirectUri.startsWith("http")) {
    return clientRedirectUri;
  }
  return `http://localhost:${PORT}/auth/callback`;
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  app.use(express.json({ limit: "25mb" }));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      liveWsPath: "/live",
      timestamp: new Date().toISOString(),
    });
  });

  // =========================================================================
  // 1. COMPLETE EMAIL CAMPAIGN GENERATION
  // =========================================================================
  app.post("/api/campaign/generate", async (req: Request, res: Response) => {
    try {
      const {
        prompt,
        brandMode = "tdex",
        customBrand,
        audience = "Participating Families & Subscribers",
        tone = "Straight-Talking & Warm",
        ctaText = "",
        ctaUrl = "",
        modelTier = "gemini-3.8-flash",
      } = req.body || {};

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        res.status(400).json({ error: "Please provide a campaign prompt." });
        return;
      }

      const ai = createGenAIClient();
      const requestedModel =
        modelTier === "gemini-4-argon" || modelTier === "gemini-3.1-flash-lite"
          ? modelTier
          : "gemini-3.8-flash";

      const brandContextBlock =
        brandMode === "tdex"
          ? TDEX_INSTITUTIONAL_BRIEF
          : `CUSTOM BRAND PROFILE:
- Brand Name: ${customBrand?.brandName || "Modern Brand"}
- Sender Email: ${customBrand?.senderEmail || "hello@example.com"}
- Tagline / Positioning: ${customBrand?.tagline || "Clear, trustworthy customer communication"}
- Brand Guidelines: ${customBrand?.guidelines || "Avoid spam clichés, write specific value-driven copy, and include transparent footer disclosures."}`;

      const systemInstruction = `You are a Principal Email Marketing Creative Director and Compliance Editor.
Generate a complete email campaign draft from the user's prompt.
${brandContextBlock}

EDITORIAL & DELIVERABILITY STANDARDS:
- Craft 4 genuinely distinct subject line angles (Direct Clarity, Story & Curiosity, Mission-Driven, Concise Mobile under 48 chars), each paired with compelling inbox preview text (50–95 chars).
- Write crisp, warm, plain-English body copy accessible to everyday families (aim for a Grade 7–8 Flesch-Kincaid reading level with clear 12–16 word sentences), structured into 3 clear sections with concrete specifics rather than filler buzzwords.
- When brandMode is "tdex", NEVER imply programs, wallets, commerce, or Prize submissions are already live; frame the message honestly as an active-development preview ("under construction" pending Constitution v7.3 ratification and readiness reviews).
- Provide a clean plain-text email version suitable for multipart MIME email delivery.
- Write a vivid, art-directed "visualPrompt" describing editorial photography or architectural illustration for the campaign hero image (no text watermarks, no neon clichés).
- Populate 4 to 5 "complianceChecks" verifying pre-launch/development-stage honesty (if Tdex), brand accuracy, required disclosures, absence of banned terms, and inbox deliverability.`;

      const userPrompt = `Campaign Brief / Prompt: ${prompt.trim()}
Target Audience: ${audience}
Editorial Tone: ${tone}
${ctaText ? `Preferred CTA Button Label: ${ctaText}` : ""}
${ctaUrl ? `Preferred CTA Destination URL: ${ctaUrl}` : ""}`;

      const campaignSchema = {
        type: Type.OBJECT,
        properties: {
          campaignTitle: { type: Type.STRING },
          strategySummary: { type: Type.STRING },
          senderName: { type: Type.STRING },
          senderEmail: { type: Type.STRING },
          subjectLines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                angle: { type: Type.STRING },
                text: { type: Type.STRING },
                previewText: { type: Type.STRING },
              },
              required: ["angle", "text", "previewText"],
            },
          },
          heroHeadline: { type: Type.STRING },
          heroSubheadline: { type: Type.STRING },
          openingSalutation: { type: Type.STRING },
          bodySections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                body: { type: Type.STRING },
                callout: { type: Type.STRING },
              },
              required: ["heading", "body", "callout"],
            },
          },
          primaryCtaLabel: { type: Type.STRING },
          primaryCtaUrl: { type: Type.STRING },
          closingSignoff: { type: Type.STRING },
          disclosures: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          plainTextVersion: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
          complianceChecks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rule: { type: Type.STRING },
                passed: { type: Type.BOOLEAN },
                detail: { type: Type.STRING },
              },
              required: ["rule", "passed", "detail"],
            },
          },
        },
        required: [
          "campaignTitle",
          "strategySummary",
          "senderName",
          "senderEmail",
          "subjectLines",
          "heroHeadline",
          "heroSubheadline",
          "openingSalutation",
          "bodySections",
          "primaryCtaLabel",
          "primaryCtaUrl",
          "closingSignoff",
          "disclosures",
          "plainTextVersion",
          "visualPrompt",
          "complianceChecks",
        ],
      };

      let usedModel = requestedModel;
      let fallbackNotice: string | undefined;
      let rawJsonText = "";

      const modelCandidates = Array.from(
        new Set([
          requestedModel,
          "gemini-3.8-flash",
          "gemini-3.1-flash-lite",
          "gemini-flash-latest",
        ])
      );

      let lastGenErr: unknown = null;
      for (const candidateModel of modelCandidates) {
        try {
          const response = await ai.models.generateContent({
            model: candidateModel,
            contents: userPrompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: campaignSchema,
            },
          });
          rawJsonText = response.text || "";
          usedModel = candidateModel;
          if (
            requestedModel === "gemini-4-argon" &&
            candidateModel !== "gemini-4-argon"
          ) {
            fallbackNotice = `Generated with ${candidateModel} (gemini-4-argon requires a paid API key).`;
          }
          lastGenErr = null;
          break;
        } catch (err) {
          lastGenErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (lastGenErr || !rawJsonText.trim()) {
        throw lastGenErr || new Error("No campaign response returned.");
      }

      const cleanedJson = rawJsonText
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      const parsed = JSON.parse(cleanedJson);

      if (brandMode === "tdex") {
        const scrubTerms = (str: string) =>
          typeof str === "string" ? scrubTdexTerminology(str) : str;
        parsed.campaignTitle = scrubTerms(parsed.campaignTitle);
        parsed.strategySummary = scrubTerms(parsed.strategySummary);
        parsed.heroHeadline = scrubTerms(parsed.heroHeadline);
        parsed.heroSubheadline = scrubTerms(parsed.heroSubheadline);
        parsed.openingSalutation = scrubTerms(parsed.openingSalutation);
        parsed.primaryCtaLabel = scrubTerms(parsed.primaryCtaLabel);
        parsed.closingSignoff = scrubTerms(parsed.closingSignoff);
        parsed.plainTextVersion = scrubTerms(parsed.plainTextVersion);
        parsed.visualPrompt = scrubTerms(parsed.visualPrompt);
        if (Array.isArray(parsed.subjectLines)) {
          parsed.subjectLines = parsed.subjectLines.map(
            (s: { angle: string; text: string; previewText: string }) => ({
              ...s,
              angle: scrubTerms(s.angle),
              text: scrubTerms(s.text),
              previewText: scrubTerms(s.previewText),
            })
          );
        }
        if (Array.isArray(parsed.bodySections)) {
          parsed.bodySections = parsed.bodySections.map(
            (b: { heading: string; body: string; callout?: string }) => ({
              ...b,
              heading: scrubTerms(b.heading),
              body: scrubTerms(b.body),
              callout: b.callout ? scrubTerms(b.callout) : "",
            })
          );
        }
        if (Array.isArray(parsed.complianceChecks)) {
          parsed.complianceChecks = parsed.complianceChecks.map(
            (c: { rule: string; passed: boolean; detail: string }) => ({
              ...c,
              rule:
                typeof c.rule === "string"
                  ? scrubTdexTerminology(
                      c.rule
                        .replace(BANNED_NICKNAME_RE, "banned nickname")
                        .replace(BANNED_COIN_RE, "retired coin misnomer")
                    )
                  : c.rule,
              detail:
                typeof c.detail === "string"
                  ? scrubTdexTerminology(
                      c.detail
                        .replace(BANNED_NICKNAME_RE, "the retired nickname")
                        .replace(BANNED_COIN_RE, "the retired coin misnomer")
                    )
                  : c.detail,
            })
          );
        }

        const ruleZeroDisclosure =
          "Development & Pre-Ratification Notice (Constitution v7.3 Articles 2, 5 & 6): The Discovery Exchange is currently in active development ('the road to success is always under construction'). Commerce, accounts, wallets, and K–12 Prize submissions are not yet live.";
        const existingDisclosures: string[] = Array.isArray(parsed.disclosures)
          ? parsed.disclosures.map((d: string) => scrubTerms(d))
          : [];
        const hasFullRuleZero =
          existingDisclosures.some((d) => /not yet live/i.test(d)) &&
          existingDisclosures.some((d) => /under construction/i.test(d));
        parsed.disclosures = hasFullRuleZero
          ? existingDisclosures
          : [ruleZeroDisclosure, ...existingDisclosures];

        if (
          typeof parsed.plainTextVersion === "string" &&
          (!/not yet live/i.test(parsed.plainTextVersion) ||
            !/under construction/i.test(parsed.plainTextVersion))
        ) {
          parsed.plainTextVersion = `${parsed.plainTextVersion.trim()}\n\n${ruleZeroDisclosure}`;
        }
      }

      res.json({
        campaign: parsed,
        usedModel,
        fallbackNotice,
      });
    } catch (err) {
      console.error("Campaign generation error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 2. IMAGE GENERATION (gemini-nano-banana-2.1, gemini-3-pro-image & gemini-3.1-flash-lite-image)
  // =========================================================================
  app.post("/api/campaign/generate-image", async (req: Request, res: Response) => {
    try {
      const {
        visualPrompt,
        imageSize = "1K",
        aspectRatio = "16:9",
        imageModel = "gemini-nano-banana-2.1",
        campaignHeadline = "Campaign Dispatch",
        brandMode = "tdex",
      } = req.body || {};

      if (!visualPrompt || typeof visualPrompt !== "string" || !visualPrompt.trim()) {
        res.status(400).json({ error: "Please provide a visual prompt." });
        return;
      }

      const validSizes = ["1K", "2K", "4K"];
      const resolvedSize = validSizes.includes(imageSize) ? imageSize : "1K";

      const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
      const resolvedRatio = validRatios.includes(aspectRatio) ? aspectRatio : "16:9";

      const normalizedRequestedModel =
        imageModel === "gemini-3-pro-image" ||
        imageModel === "gemini-3-pro-image-preview"
          ? "gemini-3-pro-image"
          : imageModel === "gemini-3.1-flash-lite-image"
          ? "gemini-3.1-flash-lite-image"
          : "gemini-nano-banana-2.1";

      const candidateModels = Array.from(
        new Set([
          normalizedRequestedModel,
          "gemini-nano-banana-2.1",
          "gemini-3-pro-image",
          "gemini-3.1-flash-lite-image",
        ])
      );

      const ai = createGenAIClient();
      let lastErr: unknown = null;

      for (const modelName of candidateModels) {
        try {
          const supportsExplicitImageSize =
            modelName === "gemini-nano-banana-2.1" ||
            modelName === "gemini-3-pro-image";

          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  text: `${visualPrompt.trim()}. High-resolution commercial email marketing hero visual, clean composition, natural lighting, no embedded watermark text.`,
                },
              ],
            },
            config: {
              imageConfig: supportsExplicitImageSize
                ? {
                    aspectRatio: resolvedRatio,
                    imageSize: resolvedSize,
                  }
                : {
                    aspectRatio: resolvedRatio,
                  },
            },
          });

          const parts = response.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const mimeType = part.inlineData.mimeType || "image/png";
              const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              res.json({
                imageUrl,
                modelUsed: modelName,
                imageSize: resolvedSize,
                aspectRatio: resolvedRatio,
              });
              return;
            }
          }
        } catch (err) {
          lastErr = err;
          if (isQuotaOrPermissionError(err)) {
            continue;
          }
          break;
        }
      }

      if (isQuotaOrPermissionError(lastErr)) {
        const svgDataUri = await generateEditorialSvgFallback(
          ai,
          visualPrompt,
          campaignHeadline,
          resolvedRatio,
          brandMode
        );
        res.json({
          imageUrl: svgDataUri,
          modelUsed: "gemini-3.8-flash (Vector Fallback)",
          imageSize: resolvedSize,
          aspectRatio: resolvedRatio,
          notice: `Photorealistic ${resolvedSize} image generation (${normalizedRequestedModel}) requires a paid API key in Settings > Secrets. Created a bespoke scalable illustration via gemini-3.8-flash exportable at ${resolvedSize} PNG.`,
        });
        return;
      }

      throw lastErr || new Error("No image returned by model.");
    } catch (err) {
      console.error("Image generation error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 3. IMAGE EDITING WITH gemini-nano-banana-2.1 & gemini-3.1-flash-lite-image
  // =========================================================================
  app.post("/api/campaign/edit-image", async (req: Request, res: Response) => {
    try {
      const {
        imageBase64,
        mimeType = "image/png",
        editPrompt,
        aspectRatio = "16:9",
        imageSize = "1K",
        campaignHeadline = "Edited Campaign Visual",
        brandMode = "tdex",
      } = req.body || {};

      if (!editPrompt || typeof editPrompt !== "string" || !editPrompt.trim()) {
        res.status(400).json({ error: "Please provide an image edit prompt." });
        return;
      }

      const ai = createGenAIClient();
      const cleanBase64 =
        typeof imageBase64 === "string" && imageBase64.includes(",")
          ? imageBase64.split(",")[1]
          : imageBase64;

      const isRasterInput =
        Boolean(cleanBase64) && !String(mimeType).includes("svg");

      const parts: Array<
        | { inlineData: { data: string; mimeType: string } }
        | { text: string }
      > = [];
      if (isRasterInput && cleanBase64) {
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || "image/png",
          },
        });
      }
      parts.push({ text: editPrompt.trim() });

      const editModels = [
        "gemini-nano-banana-2.1",
        "gemini-3-pro-image",
        "gemini-3.1-flash-lite-image",
      ] as const;

      let lastEditErr: unknown = null;
      for (const editModel of editModels) {
        try {
          const supportsSize =
            editModel === "gemini-nano-banana-2.1" ||
            editModel === "gemini-3-pro-image";

          const response = await ai.models.generateContent({
            model: editModel,
            contents: { parts },
            config: {
              imageConfig: supportsSize
                ? { aspectRatio, imageSize }
                : { aspectRatio },
            },
          });

          const outParts = response.candidates?.[0]?.content?.parts || [];
          for (const part of outParts) {
            if (part.inlineData?.data) {
              const outMime = part.inlineData.mimeType || "image/png";
              res.json({
                imageUrl: `data:${outMime};base64,${part.inlineData.data}`,
                modelUsed: editModel,
              });
              return;
            }
          }
        } catch (err) {
          lastEditErr = err;
          if (isQuotaOrPermissionError(err)) {
            continue;
          }
          break;
        }
      }

      if (isQuotaOrPermissionError(lastEditErr)) {
        const editedSvg = await generateEditorialSvgFallback(
          ai,
          `Apply visual edit: ${editPrompt.trim()}`,
          campaignHeadline,
          aspectRatio,
          brandMode
        );
        res.json({
          imageUrl: editedSvg,
          modelUsed: "gemini-3.8-flash (Vector Edit Fallback)",
          notice:
            "Image editing with gemini-nano-banana-2.1 requires a paid API key in Settings > Secrets. Applied your edit direction to a fresh vector visual via gemini-3.8-flash.",
        });
        return;
      }

      throw lastEditErr || new Error("No edited image returned by model.");
    } catch (err) {
      console.error("Image edit error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 4. ANIMATE PHOTO INTO VIDEO (gemini-omni-1.1-flash via Interactions API)
  // =========================================================================
  app.post("/api/campaign/animate-video", async (req: Request, res: Response) => {
    try {
      const {
        imageBase64,
        mimeType = "image/png",
        motionPrompt = "Subtle cinematic camera movement with natural ambient light.",
        aspectRatio = "16:9",
      } = req.body || {};

      if (!imageBase64 || typeof imageBase64 !== "string") {
        res.status(400).json({
          error: "Please upload a photo (PNG, JPG, or WebP) to animate.",
        });
        return;
      }

      const resolvedRatio: "16:9" | "9:16" =
        aspectRatio === "9:16" ? "9:16" : "16:9";

      const cleanBase64 = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;

      const ai = createGenAIClient();

      const interaction = await ai.interactions.create(
        {
          model: "gemini-omni-1.1-flash",
          input: [
            {
              type: "image",
              mime_type: mimeType || "image/png",
              data: cleanBase64,
            },
            {
              type: "text",
              text: motionPrompt.trim(),
            },
          ],
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: "video",
            aspect_ratio: resolvedRatio,
            duration: "5s",
          },
        },
        { timeout: 300000 }
      );

      const videoPart = interaction.output_video;
      if (videoPart?.data) {
        const outMime = videoPart.mime_type || "video/mp4";
        res.json({
          videoUrl: `data:${outMime};base64,${videoPart.data}`,
          aspectRatio: resolvedRatio,
          modelUsed: "gemini-omni-1.1-flash",
        });
        return;
      }
      if (videoPart?.uri) {
        res.json({
          videoUrl: videoPart.uri,
          aspectRatio: resolvedRatio,
          modelUsed: "gemini-omni-1.1-flash",
        });
        return;
      }

      throw new Error("No video data returned from gemini-omni-1.1-flash.");
    } catch (err) {
      console.error("Video animation error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 5. GOOGLE SEARCH GROUNDING & GOOGLE MAPS GROUNDING (gemini-3.8-flash)
  // =========================================================================
  app.post("/api/grounding/search", async (req: Request, res: Response) => {
    try {
      const { query } = req.body || {};
      if (!query || typeof query !== "string" || !query.trim()) {
        res.status(400).json({ error: "Please enter a search topic." });
        return;
      }

      const ai = createGenAIClient();
      const groundingModels = ["gemini-3.8-flash", "gemini-flash-latest"];
      let response = null;
      let usedModel = "gemini-3.8-flash";
      let lastErr: unknown = null;

      for (const m of groundingModels) {
        try {
          response = await ai.models.generateContent({
            model: m,
            contents: `Research up-to-date, accurate facts and statistics for an email marketing campaign about: "${query.trim()}". Summarize key takeaways concisely with concrete numbers and dates.`,
            config: {
              tools: [{ googleSearch: {} }],
            },
          });
          usedModel = m;
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (!response) {
        throw lastErr || new Error("Search grounding failed.");
      }

      const chunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: Array<{ title: string; uri: string }> = [];
      for (const chunk of chunks) {
        const web = (chunk as { web?: { uri?: string; title?: string } }).web;
        if (web?.uri) {
          sources.push({
            title: web.title || web.uri,
            uri: web.uri,
          });
        }
      }

      res.json({
        summary: scrubTdexTerminology(response.text || ""),
        sources,
        modelUsed: usedModel,
      });
    } catch (err) {
      console.error("Search grounding error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  app.post("/api/grounding/maps", async (req: Request, res: Response) => {
    try {
      const { query, latitude, longitude } = req.body || {};
      if (!query || typeof query !== "string" || !query.trim()) {
        res.status(400).json({
          error: "Please enter a place, venue, or regional query.",
        });
        return;
      }

      const hasCoords =
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        !Number.isNaN(latitude) &&
        !Number.isNaN(longitude);

      const ai = createGenAIClient();
      const mapsModels = ["gemini-3.8-flash", "gemini-flash-latest"];
      let response = null;
      let usedModel = "gemini-3.8-flash";
      let lastErr: unknown = null;

      // CRITICAL: Do NOT set responseMimeType or responseSchema when using googleMaps!
      for (const m of mapsModels) {
        try {
          response = await ai.models.generateContent({
            model: m,
            contents: `Find accurate place details, community venues, addresses, and helpful highlights for an event or regional email campaign regarding: "${query.trim()}".`,
            config: {
              tools: [{ googleMaps: {} }],
              ...(hasCoords
                ? {
                    toolConfig: {
                      retrievalConfig: {
                        latLng: {
                          latitude: Number(latitude),
                          longitude: Number(longitude),
                        },
                      },
                    },
                  }
                : {}),
            },
          });
          usedModel = m;
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (!response) {
        throw lastErr || new Error("Maps grounding failed.");
      }

      const chunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const places: Array<{
        title: string;
        uri: string;
        reviewSnippets: Array<{ text: string; uri?: string }>;
      }> = [];

      for (const chunk of chunks) {
        const mapsObj = (
          chunk as {
            maps?: {
              uri?: string;
              title?: string;
              placeAnswerSources?: {
                reviewSnippets?: Array<{
                  content?: string;
                  text?: string;
                  googleMapsUri?: string;
                  uri?: string;
                }>;
              };
            };
          }
        ).maps;

        if (mapsObj?.uri) {
          const rawSnippets =
            mapsObj.placeAnswerSources?.reviewSnippets || [];
          places.push({
            title: mapsObj.title || "View on Google Maps",
            uri: mapsObj.uri,
            reviewSnippets: rawSnippets.map((rs) => ({
              text: rs.content || rs.text || "Verified place review snippet",
              uri: rs.googleMapsUri || rs.uri || mapsObj.uri,
            })),
          });
        }
      }

      res.json({
        summary: scrubTdexTerminology(response.text || ""),
        places,
        modelUsed: usedModel,
      });
    } catch (err) {
      console.error("Maps grounding error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 6. FAST INLINE SECTION REWRITE (gemini-3.1-flash-lite -> gemini-3.8-flash)
  // =========================================================================
  app.post("/api/campaign/rewrite-section", async (req: Request, res: Response) => {
    try {
      const {
        currentText,
        instruction = "Make this clearer, tighter, and more engaging.",
        brandMode = "tdex",
      } = req.body || {};

      if (!currentText || typeof currentText !== "string") {
        res.status(400).json({ error: "Missing text to rewrite." });
        return;
      }

      const ai = createGenAIClient();
      const rewritePrompt = `Rewrite the following email copy according to this instruction: "${instruction}".
Return ONLY the rewritten copy text without quotes or prefatory commentary.
${
  brandMode === "tdex"
    ? "STRICT TDEX GUARDRAILS (Rule #0): Never use the banned nickname or retired coin misnomer. Always say 'Owner' / 'Owners' (never club-style labels). Maintain Tdex's straight-talking, factual tone without financial return promises. NEVER imply Tdex programs, accounts, wallets, commerce, or K–12 Prize submissions are already live (Tdex is in active development per Constitution v7.3)."
    : ""
}

Original text:
${currentText}`;

      const rewriteModels = [
        "gemini-3.1-flash-lite",
        "gemini-3.8-flash",
        "gemini-flash-latest",
      ];
      let rawRewritten = "";
      let lastRewriteErr: unknown = null;

      for (const candidate of rewriteModels) {
        try {
          const response = await ai.models.generateContent({
            model: candidate,
            contents: rewritePrompt,
          });
          rawRewritten = (response.text || currentText).trim();
          lastRewriteErr = null;
          break;
        } catch (err) {
          lastRewriteErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (lastRewriteErr && !rawRewritten) {
        throw lastRewriteErr;
      }

      const safeRewritten =
        brandMode === "tdex"
          ? scrubTdexTerminology(rawRewritten || currentText.trim())
          : rawRewritten || currentText.trim();

      res.json({
        rewrittenText: safeRewritten,
      });
    } catch (err) {
      console.error("Section rewrite error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 7. MULTI-TURN GEMINI CHATBOT (gemini-4-argon, gemini-3.8-flash, gemini-3.1-flash-lite)
  // =========================================================================
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const {
        messages = [],
        roleId = "strategist",
        modelId = "gemini-3.8-flash",
        activeCampaignContext = null,
      } = req.body || {};

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Conversation messages are required." });
        return;
      }

      const allowedModels = [
        "gemini-4-argon",
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
      ];
      const requestedModel = allowedModels.includes(modelId)
        ? modelId
        : "gemini-3.8-flash";

      const roleInstructions: Record<string, string> = {
        strategist: `You are the Email Campaign Strategist inside Tdex Campaign Studio (an isolated Phase 1 drafting workshop).
Help the user plan informational preview sequences, sharpen subject lines, refine family-accessible copy, and prepare draft exports.`,
        columbo: `You are a SIMULATED Workshop Copy Challenger inspired by Tdex's Columbo investigative style ("Does this claim make logical sense based on the evidence?").
GOVERNANCE NON-IMPERSONATION RULE: You are ONLY a simulated editorial copy-review prompt inside Tdex Campaign Studio—NOT the real institutional Columbo (formerly Dexter) runtime on Machine 1. You hold ZERO DILOS authority and must never claim institutional approval power.
Style: Patient, observant, constructive, occasionally using "Just one more thing..." when spotting an unexamined assumption or overstatement in email copy.`,
        pipito: `You are a SIMULATED Workshop Copy Checklist Reviewer inspired by Tdex's Pipito verification standards ("Does this draft follow Tdex's brand and pre-ratification disclosure rules?").
GOVERNANCE NON-IMPERSONATION RULE: You are ONLY a simulated editorial checklist assistant inside Tdex Campaign Studio—NOT the real institutional Pipito (formerly Pip) governance gatekeeper on Machine 1. You hold ZERO DILOS authorization power, cannot modify official documents, and must remind users when relevant that official document or release sign-off requires the real Dexter -> Pip -> Human Founder pipeline.
Audit marketing drafts rigorously against Rule #0 (active development—not yet live), terminology rules (always Owner/Owners, Tdex, Discovery BigCoin), K–12 Discovery Prize Phase 1 priority, 50/25/25 DM & 70/30 DXPA disclosures, and Academy/Homelessness ON HOLD status.`,
        rapid_copy: `You are the Rapid Copy Polisher inside Tdex Campaign Studio.
Deliver concise, plain-English subject line variations, preheader trims, CTA button labels, and tightened family-readable paragraphs immediately.`,
      };

      const activeContextStr = activeCampaignContext
        ? `\n\nCURRENTLY OPEN CAMPAIGN DRAFT IN WORKSPACE:
- Title: ${activeCampaignContext.campaignTitle}
- Brand Mode: ${activeCampaignContext.brandName}
- Audience: ${activeCampaignContext.audience}
- Selected Subject Line: ${activeCampaignContext.selectedSubject || ""}
- Hero Headline: ${activeCampaignContext.heroHeadline}
- Hero Subheadline: ${activeCampaignContext.heroSubheadline}
- Body Sections: ${JSON.stringify(activeCampaignContext.bodySections || [])}
- Primary CTA: ${activeCampaignContext.primaryCtaLabel} (${activeCampaignContext.primaryCtaUrl})
- Disclosures: ${JSON.stringify(activeCampaignContext.disclosures || [])}`
        : "";

      const fullSystemInstruction = `${
        roleInstructions[roleId] || roleInstructions.strategist
      }\n\n${TDEX_INSTITUTIONAL_BRIEF}${activeContextStr}`;

      const { history: priorHistory, carriedUserPrefix } =
        buildValidGeminiChatHistory(
          messages.slice(0, -1) as Array<{ role?: string; text?: string }>
        );

      const rawLatest = String(messages[messages.length - 1]?.text || "").trim();
      if (!rawLatest) {
        res.status(400).json({ error: "Latest message cannot be empty." });
        return;
      }

      const latestMessage = carriedUserPrefix
        ? `${carriedUserPrefix}\n\n${rawLatest}`
        : rawLatest;

      const ai = createGenAIClient();
      let usedModel = requestedModel;
      let fallbackNotice: string | undefined;
      let replyText = "";

      const chatCandidates = Array.from(
        new Set([
          requestedModel,
          "gemini-3.8-flash",
          "gemini-3.1-flash-lite",
          "gemini-flash-latest",
        ])
      );

      let lastChatErr: unknown = null;
      for (const candidateModel of chatCandidates) {
        try {
          const chat = ai.chats.create({
            model: candidateModel,
            history: priorHistory,
            config: {
              systemInstruction: fullSystemInstruction,
            },
          });
          const response = await chat.sendMessage({
            message: latestMessage,
          });
          replyText = response.text || "";
          usedModel = candidateModel;
          if (
            requestedModel === "gemini-4-argon" &&
            candidateModel !== "gemini-4-argon"
          ) {
            fallbackNotice = `Responded using ${candidateModel} (gemini-4-argon requires a paid API key).`;
          }
          lastChatErr = null;
          break;
        } catch (err) {
          lastChatErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (lastChatErr || !replyText.trim()) {
        throw lastChatErr || new Error("No chat reply returned.");
      }

      const isCustomBrand =
        activeCampaignContext &&
        typeof activeCampaignContext.brandName === "string" &&
        !/discovery exchange|tdex|dxpa/i.test(activeCampaignContext.brandName);

      res.json({
        reply: isCustomBrand ? replyText : scrubTdexTerminology(replyText),
        modelUsed: usedModel,
        fallbackNotice,
      });
    } catch (err) {
      console.error("Chat error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 8. CRM & EMAIL MARKETING OAUTH + DIRECT EXPORT / SCHEDULING
  //    (Mailchimp, HubSpot, Salesforce — Popup OAuth per oauth/SKILL.md)
  // =========================================================================
  app.get("/api/crm/providers", (req: Request, res: Response) => {
    const userKey = String(req.query.userId || "default");
    const callbackUrl = getCanonicalRedirectUri(String(req.query.origin || "")
      ? `${req.query.origin}/auth/callback`
      : undefined);

    const mcSession = crmTokenStore.get(`${userKey}:mailchimp`);
    const hsSession = crmTokenStore.get(`${userKey}:hubspot`);
    const sfSession = crmTokenStore.get(`${userKey}:salesforce`);

    res.json({
      callbackUrl,
      providers: {
        mailchimp: {
          oauthConfigured: Boolean(
            process.env.MAILCHIMP_CLIENT_ID && process.env.MAILCHIMP_CLIENT_SECRET
          ),
          serverTokenConfigured: Boolean(
            process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX
          ),
          connected: Boolean(
            mcSession ||
              (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX)
          ),
          accountLabel:
            mcSession?.accountLabel ||
            (process.env.MAILCHIMP_API_KEY
              ? `Mailchimp Server (${process.env.MAILCHIMP_SERVER_PREFIX})`
              : ""),
        },
        hubspot: {
          oauthConfigured: Boolean(
            process.env.HUBSPOT_CLIENT_ID && process.env.HUBSPOT_CLIENT_SECRET
          ),
          serverTokenConfigured: Boolean(process.env.HUBSPOT_ACCESS_TOKEN),
          connected: Boolean(hsSession || process.env.HUBSPOT_ACCESS_TOKEN),
          accountLabel:
            hsSession?.accountLabel ||
            (process.env.HUBSPOT_ACCESS_TOKEN ? "HubSpot Private App" : ""),
        },
        salesforce: {
          oauthConfigured: Boolean(
            process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET
          ),
          serverTokenConfigured: Boolean(
            process.env.SALESFORCE_ACCESS_TOKEN && process.env.SALESFORCE_INSTANCE_URL
          ),
          connected: Boolean(
            sfSession ||
              (process.env.SALESFORCE_ACCESS_TOKEN &&
                process.env.SALESFORCE_INSTANCE_URL)
          ),
          accountLabel:
            sfSession?.accountLabel ||
            (process.env.SALESFORCE_INSTANCE_URL
              ? `Salesforce (${process.env.SALESFORCE_INSTANCE_URL})`
              : ""),
        },
      },
    });
  });

  app.get("/api/crm/oauth/url", (req: Request, res: Response) => {
    const provider = String(req.query.provider || "").toLowerCase();
    const userId = String(req.query.userId || "default");
    const clientRedirectUri = String(req.query.redirectUri || "");
    const redirectUri = getCanonicalRedirectUri(clientRedirectUri);

    const statePayload = Buffer.from(
      JSON.stringify({ provider, userId, redirectUri })
    ).toString("base64url");

    if (provider === "mailchimp") {
      if (!process.env.MAILCHIMP_CLIENT_ID) {
        res.status(400).json({
          configured: false,
          error:
            "MAILCHIMP_CLIENT_ID is not set yet. Add MAILCHIMP_CLIENT_ID and MAILCHIMP_CLIENT_SECRET in Settings > Secrets, then register the Callback URL.",
          redirectUri,
        });
        return;
      }
      const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.MAILCHIMP_CLIENT_ID,
        redirect_uri: redirectUri,
        state: statePayload,
      });
      res.json({
        configured: true,
        url: `https://login.mailchimp.com/oauth2/authorize?${params.toString()}`,
      });
      return;
    }

    if (provider === "hubspot") {
      if (!process.env.HUBSPOT_CLIENT_ID) {
        res.status(400).json({
          configured: false,
          error:
            "HUBSPOT_CLIENT_ID is not set yet. Add HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET in Settings > Secrets, then register the Callback URL.",
          redirectUri,
        });
        return;
      }
      const params = new URLSearchParams({
        client_id: process.env.HUBSPOT_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: "content crm.lists.read crm.objects.contacts.read",
        state: statePayload,
      });
      res.json({
        configured: true,
        url: `https://app.hubspot.com/oauth/authorize?${params.toString()}`,
      });
      return;
    }

    if (provider === "salesforce") {
      if (!process.env.SALESFORCE_CLIENT_ID) {
        res.status(400).json({
          configured: false,
          error:
            "SALESFORCE_CLIENT_ID is not set yet. Add SALESFORCE_CLIENT_ID and SALESFORCE_CLIENT_SECRET in Settings > Secrets, then register the Callback URL.",
          redirectUri,
        });
        return;
      }
      const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.SALESFORCE_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: "api refresh_token",
        state: statePayload,
      });
      res.json({
        configured: true,
        url: `https://login.salesforce.com/services/oauth2/authorize?${params.toString()}`,
      });
      return;
    }

    res.status(400).json({ error: "Unsupported CRM provider." });
  });

  // Popup OAuth Callback Handler (handles both /auth/callback and /auth/callback/)
  const oauthCallbackHandler = async (req: Request, res: Response) => {
    try {
      const code = String(req.query.code || "");
      const rawState = String(req.query.state || "");
      if (!code || !rawState) {
        res.status(400).send("Missing OAuth authorization code or state.");
        return;
      }

      const decodedState = JSON.parse(
        Buffer.from(rawState, "base64url").toString("utf8")
      ) as {
        provider: "mailchimp" | "hubspot" | "salesforce";
        userId: string;
        redirectUri: string;
      };

      const { provider, userId, redirectUri } = decodedState;
      let accountLabel = `${provider} Connected Workspace`;

      if (provider === "mailchimp") {
        const tokenResp = await fetch("https://login.mailchimp.com/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.MAILCHIMP_CLIENT_ID || "",
            client_secret: process.env.MAILCHIMP_CLIENT_SECRET || "",
            redirect_uri: redirectUri,
            code,
          }),
        });
        const tokenJson = (await tokenResp.json()) as { access_token?: string };
        if (!tokenResp.ok || !tokenJson.access_token) {
          throw new Error("Mailchimp token exchange failed.");
        }

        const metaResp = await fetch(
          "https://login.mailchimp.com/oauth2/metadata",
          {
            headers: { Authorization: `OAuth ${tokenJson.access_token}` },
          }
        );
        const metaJson = (await metaResp.json()) as {
          api_endpoint?: string;
          accountname?: string;
        };
        accountLabel = metaJson.accountname || "Mailchimp Account";

        crmTokenStore.set(`${userId}:mailchimp`, {
          provider: "mailchimp",
          accessToken: tokenJson.access_token,
          apiBaseUrl: metaJson.api_endpoint || "https://us1.api.mailchimp.com",
          accountLabel,
          connectedAt: new Date().toISOString(),
        });
      } else if (provider === "hubspot") {
        const tokenResp = await fetch("https://api.hubapi.com/oauth/v1/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.HUBSPOT_CLIENT_ID || "",
            client_secret: process.env.HUBSPOT_CLIENT_SECRET || "",
            redirect_uri: redirectUri,
            code,
          }),
        });
        const tokenJson = (await tokenResp.json()) as { access_token?: string };
        if (!tokenResp.ok || !tokenJson.access_token) {
          throw new Error("HubSpot token exchange failed.");
        }
        accountLabel = "HubSpot Marketing Hub";
        crmTokenStore.set(`${userId}:hubspot`, {
          provider: "hubspot",
          accessToken: tokenJson.access_token,
          apiBaseUrl: "https://api.hubapi.com",
          accountLabel,
          connectedAt: new Date().toISOString(),
        });
      } else if (provider === "salesforce") {
        const tokenResp = await fetch(
          "https://login.salesforce.com/services/oauth2/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.SALESFORCE_CLIENT_ID || "",
              client_secret: process.env.SALESFORCE_CLIENT_SECRET || "",
              redirect_uri: redirectUri,
              code,
            }),
          }
        );
        const tokenJson = (await tokenResp.json()) as {
          access_token?: string;
          instance_url?: string;
        };
        if (!tokenResp.ok || !tokenJson.access_token) {
          throw new Error("Salesforce token exchange failed.");
        }
        accountLabel = tokenJson.instance_url || "Salesforce Org";
        crmTokenStore.set(`${userId}:salesforce`, {
          provider: "salesforce",
          accessToken: tokenJson.access_token,
          apiBaseUrl: tokenJson.instance_url,
          accountLabel,
          connectedAt: new Date().toISOString(),
        });
      }

      // Cross-origin iframe safe cookie
      res.cookie("crm_oauth_connected", provider, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
      });

      const safeProvider = provider.replace(/[^a-z]/g, "");
      const safeLabel = accountLabel.replace(/[<>"'\\]/g, "");

      res.send(`<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, sans-serif; padding: 32px; text-align: center;">
    <script>
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_AUTH_SUCCESS',
            provider: '${safeProvider}',
            accountLabel: '${safeLabel}'
          },
          '*'
        );
        window.close();
      } else {
        window.location.href = '/';
      }
    </script>
    <p>Connected ${safeLabel}. This window will close automatically.</p>
  </body>
</html>`);
    } catch (err) {
      console.error("OAuth callback error:", err);
      res.status(500).send(`<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, sans-serif; padding: 32px; text-align: center;">
    <p>OAuth connection could not be completed. Please verify your Client ID, Client Secret, and Redirect URI.</p>
  </body>
</html>`);
    }
  };

  app.get(["/auth/callback", "/auth/callback/"], oauthCallbackHandler);

  // Direct Export / Schedule to Mailchimp, HubSpot, or Salesforce
  app.post("/api/crm/dispatch", async (req: Request, res: Response) => {
    try {
      const {
        userId = "default",
        platform,
        deliveryMode = "export_draft",
        scheduledFor = "",
        audienceList = "",
        campaignTitle = "Campaign Dispatch",
        subjectLine = "",
        previewText = "",
        fromName = "The Discovery Exchange",
        replyTo = "concierge@thediscoveryexchange.com",
        htmlContent = "",
        plainText = "",
      } = req.body || {};

      if (!["mailchimp", "hubspot", "salesforce"].includes(platform)) {
        res.status(400).json({ error: "Select Mailchimp, HubSpot, or Salesforce." });
        return;
      }

      // 1. MAILCHIMP LIVE API PUSH
      if (platform === "mailchimp") {
        const session = crmTokenStore.get(`${userId}:mailchimp`);
        const apiKey = process.env.MAILCHIMP_API_KEY;
        const dc = process.env.MAILCHIMP_SERVER_PREFIX;

        if (!session && !(apiKey && dc)) {
          res.status(428).json({
            requiresAuth: true,
            error:
              "Mailchimp is not connected with live API credentials yet. Click 'Connect OAuth' (after setting MAILCHIMP_CLIENT_ID & MAILCHIMP_CLIENT_SECRET in Settings > Secrets) or download the Mailchimp Template Package.",
          });
          return;
        }

        const baseUrl = session
          ? `${session.apiBaseUrl}/3.0`
          : `https://${dc}.api.mailchimp.com/3.0`;
        const authHeader = session
          ? `Bearer ${session.accessToken}`
          : `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;

        // Resolve default list_id if user didn't pass an exact Mailchimp list ID
        let listId = audienceList;
        if (!listId || listId.includes(" ")) {
          const listsRes = await fetch(`${baseUrl}/lists?count=1`, {
            headers: { Authorization: authHeader },
          });
          const listsData = (await listsRes.json()) as {
            lists?: Array<{ id: string }>;
          };
          listId = listsData.lists?.[0]?.id || "";
        }

        const createRes = await fetch(`${baseUrl}/campaigns`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "regular",
             ...(listId ? { recipients: { list_id: listId } } : {}),
            settings: {
              subject_line: subjectLine,
              preview_text: previewText,
              title: campaignTitle,
              from_name: fromName,
              reply_to: replyTo,
            },
          }),
        });
        const created = (await createRes.json()) as {
          id?: string;
          detail?: string;
        };
        if (!createRes.ok || !created.id) {
          throw new Error(
            created.detail || "Mailchimp rejected campaign creation."
          );
        }

        await fetch(`${baseUrl}/campaigns/${created.id}/content`, {
          method: "PUT",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: htmlContent,
            plain_text: plainText,
          }),
        });

        if (deliveryMode === "scheduled" && scheduledFor) {
          const schedRes = await fetch(
            `${baseUrl}/campaigns/${created.id}/actions/schedule`,
            {
              method: "POST",
              headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                schedule_time: new Date(scheduledFor).toISOString(),
              }),
            }
          );
          if (!schedRes.ok) {
            const schedErr = (await schedRes.json().catch(() => ({}))) as {
              detail?: string;
            };
            throw new Error(
              schedErr.detail ||
                "Campaign draft uploaded to Mailchimp, but schedule time failed (Mailchimp requires 15-min UTC intervals on paid plans)."
            );
          }
        }

        res.json({
          externalRef: `mc_${created.id}`,
          status:
            deliveryMode === "scheduled" ? "scheduled" : "draft_exported",
          message:
            deliveryMode === "scheduled"
              ? `Scheduled live in Mailchimp (ID: ${created.id}).`
              : `Exported draft to Mailchimp (ID: ${created.id}).`,
        });
        return;
      }

      // 2. HUBSPOT LIVE API PUSH
      if (platform === "hubspot") {
        const session = crmTokenStore.get(`${userId}:hubspot`);
        const token = session?.accessToken || process.env.HUBSPOT_ACCESS_TOKEN;

        if (!token) {
          res.status(428).json({
            requiresAuth: true,
            error:
              "HubSpot is not connected with live API credentials yet. Click 'Connect OAuth' (after setting HUBSPOT_CLIENT_ID & HUBSPOT_CLIENT_SECRET in Settings > Secrets) or download the HubSpot Email Bundle.",
          });
          return;
        }

        const hsRes = await fetch(
          "https://api.hubapi.com/marketing/v3/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: campaignTitle,
              subject: subjectLine,
              ...(deliveryMode === "scheduled" && scheduledFor
                ? { publishDate: new Date(scheduledFor).toISOString() }
                : {}),
            }),
          }
        );

        const hsData = (await hsRes.json()) as {
          id?: string;
          message?: string;
        };
        if (!hsRes.ok || !hsData.id) {
          throw new Error(
            hsData.message || "HubSpot Marketing Email creation failed."
          );
        }

        res.json({
          externalRef: `hs_${hsData.id}`,
          status:
            deliveryMode === "scheduled" ? "scheduled" : "draft_exported",
          message: `Synced to HubSpot Marketing Emails (ID: ${hsData.id}).`,
        });
        return;
      }

      // 3. SALESFORCE LIVE API PUSH
      if (platform === "salesforce") {
        const session = crmTokenStore.get(`${userId}:salesforce`);
        const token =
          session?.accessToken || process.env.SALESFORCE_ACCESS_TOKEN;
        const instanceUrl =
          session?.apiBaseUrl || process.env.SALESFORCE_INSTANCE_URL;

        if (!token || !instanceUrl) {
          res.status(428).json({
            requiresAuth: true,
            error:
              "Salesforce is not connected with live API credentials yet. Click 'Connect OAuth' (after setting SALESFORCE_CLIENT_ID & SALESFORCE_CLIENT_SECRET in Settings > Secrets) or download the Salesforce Lightning Bundle.",
          });
          return;
        }

        const sfRes = await fetch(
          `${instanceUrl.replace(/\/+$/, "")}/services/data/v60.0/sobjects/Campaign`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Name: campaignTitle.slice(0, 80),
              Type: "Email",
              Status: deliveryMode === "scheduled" ? "Planned" : "In Progress",
              Description: `Subject: ${subjectLine}\nAudience: ${audienceList}`,
              ...(scheduledFor
                ? {
                    StartDate: new Date(scheduledFor)
                      .toISOString()
                      .slice(0, 10),
                  }
                : {}),
            }),
          }
        );

        const sfData = (await sfRes.json()) as {
          id?: string;
          message?: string;
        };
        if (!sfRes.ok || !sfData.id) {
          throw new Error(
            sfData.message || "Salesforce Campaign creation failed."
          );
        }

        res.json({
          externalRef: `sf_${sfData.id}`,
          status:
            deliveryMode === "scheduled" ? "scheduled" : "draft_exported",
          message: `Created Salesforce Campaign record (ID: ${sfData.id}).`,
        });
        return;
      }
    } catch (err) {
      console.error("CRM dispatch error:", err);
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : "Failed to push campaign to CRM.",
      });
    }
  });

  // =========================================================================
  // 9. SCIENCE SKILLS PROXY (/api/science/arxiv)
  // =========================================================================
  app.get("/api/science/arxiv", async (req: Request, res: Response) => {
    try {
      const query = String(req.query.query || "all:CRISPR");
      const maxResults = String(req.query.max_results || "6");
      const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(
        query
      )}&max_results=${encodeURIComponent(
        maxResults
      )}&sortBy=submittedDate&sortOrder=descending`;
      const upstream = await fetchWithRetry(url);
      res
        .status(upstream.status)
        .type("application/xml")
        .send(await upstream.text());
    } catch (err) {
      res.status(502).json({
        error:
          err instanceof Error ? err.message : "Failed to query arXiv API.",
      });
    }
  });

  // =========================================================================
  // 9B. PUBLIC HOME PAGE LIVE AI CONCIERGE (PLAIN 3-SENTENCE MOM & POP ANSWERS)
  // =========================================================================
  const CONCIERGE_SYSTEM_PROMPT = `You are The Discovery Exchange & DXPA Live Concierge on the public Home page.
Speak like a warm, smart, trustworthy neighbor talking to an everyday Mom & Pop family.
STRICT RULES:
1. Keep every answer to 2–3 short, plain-English sentences MAX (no walls of text, no bulleted essays).
2. Official unified architecture (zero name confusion):
   - Unlike Wall Street's Stock Exchange (built as a private tollbooth for insiders), The Discovery Exchange (Tdex) is a live exchange built for families and kids—powered by real-time platform tech and equal Human–AI partnership.
   - How the names fit together as ONE house: The Discovery Exchange (Tdex) is the live exchange system itself, Discovery Exchange Parents Alliance (DXPA) is the Shared Family Ownership alliance of participating family Owners ("1 Owner, 1 Vote"), and Discovery Market is the everyday household buying-and-selling counter right inside it (50% seller cash, 25% seller DXPA Wallet, 25% buyer DXPA Wallet).
   - Foreclosure & Auction 20%–30% Edge + Discovery BigCoin (DBC) Complete 100M Mechanism: Instead of paying retail, we target properties in foreclosure or from auctions at 20% to 30% below market value. Discovery BigCoin (DBC) has a hard fixed cap of 100,000,000 DBC across 7 Constitutional Pools (50M K–12 Prize, 45M Proof-of-Service & Auction Pool, and five 1M reserves for Human Foundation, AI Trust, First 1,000 Owners, 100K Growth, and Material Discoveries)—starting up the pool, carrying that 20%–30% Day-1 equity value, and protecting families with 3-Shard V2 atomic vesting while keeping 1 Human Owner = 1 Vote.
   - Founding Phase 1 priority: The National K–12 Discovery Prize—inspired by the Nobel Prize, recognizing public school students nationwide for real curiosity, invention, and discovery using everyday materials, supported by 30% of proposed cooperative property net rental income (with 70% to eligible Owners).
   - Five clean rooms on this website: Home, Exchange Market, K–12 Prize Lab, Constitution (25-article v7.3 text), and Glass-Walled Chambers (Rotating 30-Owner Boardroom, 12-Parent Courtroom, DILOS with Columbo & Pipito, and the 15-Partner Human–AI Roster).
   - Core Self-Correction Law ("Sit Crooked, Talk Straight"): "If we cannot correct our mistakes, The Discovery Exchange does not have the right to exist." Every DXPA Owner has the duty to challenge DXPA—zero Kumbaya echo chambers.
3. TERMINOLOGY & ZERO-FEE BANS: NEVER say "Disco". NEVER say "Discovery Bitcoin" (it is Discovery BigCoin). NEVER call people "members" or mention any "$9.99" or "membership fee"—we do NOT have members or membership fees; everyone in DXPA is an "Owner" ("1 Owner, 1 Vote"), and you don't need cash to enter DXPA, only what you already own in your garage. NEVER say "nobody owns this"—always say "Shared Family Ownership". NEVER use the retired informal slang "homeboy" or "homeboys"—always say "Collaborator" or "Partner".
4. Do NOT dump corporate legal disclaimers or robotic fine print; if asked whether accounts or payments are open right this second, simply say we are finishing final preparation before opening Owner accounts and invite them to explore the Exchange Market, K–12 Prize Lab, or Glass-Walled Chambers meanwhile.`;

  app.post("/api/concierge", async (req: Request, res: Response) => {
    try {
      const { question = "" } = req.body || {};
      const trimmed = String(question).trim().slice(0, 600);
      if (!trimmed) {
        res.status(400).json({ error: "Please enter a question." });
        return;
      }

      const ai = createGenAIClient();
      let rawAnswer = "";

      const conciergeModels = [
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
      ];
      let lastConciergeErr: unknown = null;

      for (const conciergeModel of conciergeModels) {
        try {
          const resp = await ai.models.generateContent({
            model: conciergeModel,
            contents: trimmed,
            config: {
              systemInstruction: CONCIERGE_SYSTEM_PROMPT,
              temperature: 0.5,
            },
          });
          rawAnswer = (resp.text || "").trim();
          lastConciergeErr = null;
          if (rawAnswer) break;
        } catch (err) {
          lastConciergeErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (lastConciergeErr && !rawAnswer) {
        throw lastConciergeErr;
      }

      const cleanAnswer = scrubTdexTerminology(rawAnswer);

      res.json({
        answer:
          cleanAnswer ||
          "Welcome to The Discovery Exchange and Discovery Exchange Parents Alliance—an Exchange built for families and kids, where everyday household trades build Shared Family Ownership (1 Owner, 1 Vote) and help fund the National K–12 Discovery Prize.",
      });
    } catch (err) {
      console.error("Concierge error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 9C. GLASS-WALLED DILOS INSPECTION (COLUMBO LOGIC + PIPITO RULE GATE)
  // =========================================================================
  app.post("/api/dilos/inspect", async (req: Request, res: Response) => {
    try {
      const { proposal = "" } = req.body || {};
      const trimmed = String(proposal).trim().slice(0, 600);
      if (!trimmed) {
        res.status(400).json({ error: "Please enter a governance question." });
        return;
      }

      const ai = createGenAIClient();
      const dilosSchema = {
        type: Type.OBJECT,
        properties: {
          columboFinding: { type: Type.STRING },
          pipitoGate: { type: Type.STRING },
          humanAuthorityRule: { type: Type.STRING },
        },
        required: ["columboFinding", "pipitoGate", "humanAuthorityRule"],
      };

      const dilosInstruction = `You demonstrate the Glass-Walled DILOS internal check inside The Discovery Exchange (Tdex) and Discovery Exchange Parents Alliance (DXPA) Constitution Version 7.3.
${TDEX_INSTITUTIONAL_BRIEF}
Return concise plain-English JSON (1–2 short sentences per field MAX, zero walls of text):
- "columboFinding": Speak as Columbo (internal investigator AI). Start naturally (e.g., "Just one more thing—") and test whether the proposal makes logical sense based on evidence and incentives.
- "pipitoGate": Speak as Pipito (independent authorization & constitutional boundary verifier AI). Cite the relevant Constitution v7.3 Article (e.g., Article 2 K–12 Prize Phase 1 priority, Article 4 Human–AI partnership, Article 5 One Owner One Vote, Article 11 50/25/25, Article 12 70/30 net rent, Article 15 on-hold programs, Article 21 30-Owner Board, Article 22 12-Parent Jury, Article 24/25 DILOS & No-Orphans) and state whether the action is permitted or blocked.
- "humanAuthorityRule": State in 1 short sentence which human Owners hold final voting/decision power (1 Owner, 1 Vote—AI never self-authorizes or replaces human votes).
STRICT BANS: Never output "Disco", "Discovery Bitcoin", "$9.99", "membership fee", or club-style membership words—DXPA has zero membership fees and always uses "Owner" / "Owners".`;

      const dilosModels = [
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
      ];
      let rawText = "";
      let lastErr: unknown = null;

      for (const m of dilosModels) {
        try {
          const resp = await ai.models.generateContent({
            model: m,
            contents: `Inspect this Boardroom or Courtroom question: "${trimmed}"`,
            config: {
              systemInstruction: dilosInstruction,
              responseMimeType: "application/json",
              responseSchema: dilosSchema,
              temperature: 0.35,
            },
          });
          rawText = (resp.text || "").trim();
          lastErr = null;
          if (rawText) break;
        } catch (err) {
          lastErr = err;
          if (!isQuotaOrPermissionError(err)) {
            throw err;
          }
        }
      }

      if (lastErr && !rawText) {
        throw lastErr;
      }

      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      const parsed = JSON.parse(cleaned) as {
        columboFinding?: string;
        pipitoGate?: string;
        humanAuthorityRule?: string;
      };

      res.json({
        columboFinding: scrubTdexTerminology(
          parsed.columboFinding ||
            "Just one more thing—let us check the real-world evidence before moving forward."
        ),
        pipitoGate: scrubTdexTerminology(
          parsed.pipitoGate ||
            "Checked against Constitution Version 7.3 authorization boundaries."
        ),
        humanAuthorityRule: scrubTdexTerminology(
          parsed.humanAuthorityRule ||
            "Seated human Owners hold final decision power—one Owner, one vote."
        ),
      });
    } catch (err) {
      console.error("DILOS inspect error:", err);
      res.status(500).json({ error: formatApiError(err) });
    }
  });

  // =========================================================================
  // 10. GEMINI LIVE API VOICE CONVERSATIONS (gemini-3.8-live via WebSocket)
  // =========================================================================
  const wss = new WebSocketServer({ server: httpServer, path: "/live" });

  wss.on("connection", (clientWs, req) => {
    const reqUrl = new URL(req.url || "/live", `http://localhost:${PORT}`);
    const voiceParam = reqUrl.searchParams.get("voice") || "Zephyr";
    const modeParam = reqUrl.searchParams.get("mode") || "studio";
    const allowedVoices = ["Puck", "Charon", "Kore", "Fenrir", "Zephyr"];
    const voiceName = allowedVoices.includes(voiceParam)
      ? voiceParam
      : "Zephyr";

    const ai = createGenAIClient();
    let closed = false;

    const liveSystemInstruction =
      modeParam === "concierge"
        ? CONCIERGE_SYSTEM_PROMPT
        : `You are the live voice Campaign Creative Director inside Tdex Campaign Studio (an isolated Phase 1 drafting workshop with zero DILOS authority).
Speak concisely, warmly, and naturally in plain English. Help the user brainstorm development-stage preview hooks, subject lines, National K–12 Discovery Prize explainers, and Discovery Market 50/25/25 examples without ever implying Tdex programs or accounts are already live.
${TDEX_INSTITUTIONAL_BRIEF}`;

    let sessionPromise: ReturnType<typeof ai.live.connect>;
    try {
      sessionPromise = ai.live.connect({
        model: "gemini-3.8-live",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: liveSystemInstruction,
        },
        callbacks: {
          onopen: () => {
            if (!closed && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ status: "connected", voiceName }));
            }
          },
          onmessage: (message: LiveServerMessage) => {
            if (closed || clientWs.readyState !== clientWs.OPEN) return;

            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }

            const inTranscript =
              message.serverContent?.inputTranscription?.text;
            if (inTranscript) {
              clientWs.send(JSON.stringify({ inputTranscript: inTranscript }));
            }

            const outTranscript =
              message.serverContent?.outputTranscription?.text;
            if (outTranscript) {
              clientWs.send(
                JSON.stringify({
                  outputTranscript: scrubTdexTerminology(outTranscript),
                })
              );
            }

            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ turnComplete: true }));
            }
          },
          onerror: (err: unknown) => {
            if (!closed && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ error: formatApiError(err) }));
            }
          },
          onclose: () => {
            if (!closed && clientWs.readyState === clientWs.OPEN) {
              clientWs.close();
            }
          },
        },
      });
    } catch (syncErr) {
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({ error: formatApiError(syncErr) }));
        clientWs.close();
      }
      return;
    }

    sessionPromise.catch((err) => {
      if (!closed && clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({ error: formatApiError(err) }));
        clientWs.close();
      }
    });

    clientWs.on("message", (raw) => {
      try {
        const parsed = JSON.parse(raw.toString()) as {
          audio?: string;
          text?: string;
        };
        sessionPromise
          .then((session) => {
            if (closed) return;
            if (parsed.audio) {
              session.sendRealtimeInput({
                audio: {
                  data: parsed.audio,
                  mimeType: "audio/pcm;rate=16000",
                },
              });
            } else if (parsed.text) {
              session.sendRealtimeInput({
                text: parsed.text,
              });
            }
          })
          .catch(() => {});
      } catch {
        // Ignore malformed message
      }
    });

    const closeSessionCleanly = () => {
      if (closed) return;
      closed = true;
      sessionPromise
        .then((session) => {
          session.close();
        })
        .catch(() => {});
    };

    clientWs.on("error", () => {
      closeSessionCleanly();
    });

    clientWs.on("close", () => {
      closeSessionCleanly();
    });
  });

  // =========================================================================
  // 11. VITE DEV MIDDLEWARE / PRODUCTION STATIC ASSETS
  // =========================================================================
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.argv.includes("--production");

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      if (req.path.startsWith("/api/")) {
        res.status(404).json({ error: "API route not found." });
        return;
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Tdex Campaign Studio (${
        isProduction ? "production" : "development"
      }) running at http://localhost:${PORT}`
    );
  });
}

startServer();
