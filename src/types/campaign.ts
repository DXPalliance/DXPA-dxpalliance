export enum WorkspaceView {
  FRONT_DOOR = "FRONT_DOOR",
  MARKETPLACE = "MARKETPLACE",
  SCIENCE_LAB = "SCIENCE_LAB",
  CONSTITUTION = "CONSTITUTION",
  CHAMBERS = "CHAMBERS",
  STUDIO = "STUDIO",
  CRM_SYNC = "CRM_SYNC",
  BRAND_DOCS = "BRAND_DOCS",
  CHAT = "CHAT",
  FISCAL_SPONSOR = "FISCAL_SPONSOR",
}

export type ChambersTabId =
  | "boardroom"
  | "courtroom"
  | "dilos"
  | "council"
  | "shields";

export enum BrandMode {
  TDEX = "tdex",
  CUSTOM = "custom",
}

export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K",
}

export enum AspectRatioOption {
  WIDE = "16:9",
  STANDARD = "4:3",
  SQUARE = "1:1",
  PORTRAIT = "3:4",
}

export enum VideoAspectRatio {
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
}

export enum GeminiTextModel {
  FAST = "gemini-3.1-flash-lite",
  GENERAL = "gemini-3.8-flash",
  COMPLEX = "gemini-4-argon",
}

export enum ChatRoleId {
  STRATEGIST = "strategist",
  COLUMBO = "columbo",
  PIPITO = "pipito",
  RAPID_COPY = "rapid_copy",
}

export type CrmPlatformId = "mailchimp" | "hubspot" | "salesforce";

export interface SubjectLineOption {
  id: string;
  angle: string;
  text: string;
  previewText: string;
}

export interface EmailBodySection {
  id: string;
  heading: string;
  body: string;
  callout?: string;
}

export interface ComplianceCheckItem {
  rule: string;
  passed: boolean;
  detail: string;
}

export interface CustomBrandProfile {
  brandName: string;
  senderEmail: string;
  tagline: string;
  guidelines: string;
}

export interface EmailCampaign {
  id: string;
  createdAt: string;
  updatedAt: string;
  brandMode: BrandMode;
  brandName: string;
  prompt: string;
  audience: string;
  tone: string;
  campaignTitle: string;
  strategySummary: string;
  senderName: string;
  senderEmail: string;
  subjectLines: SubjectLineOption[];
  selectedSubjectId: string;
  heroHeadline: string;
  heroSubheadline: string;
  openingSalutation: string;
  bodySections: EmailBodySection[];
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  closingSignoff: string;
  disclosures: string[];
  plainTextVersion: string;
  visualPrompt: string;
  imageUrl: string;
  videoUrl?: string;
  videoAspectRatio?: VideoAspectRatio;
  imageSize: ImageResolution;
  aspectRatio: AspectRatioOption;
  imageSourceNote?: string;
  usedTextModel?: string;
  complianceChecks: ComplianceCheckItem[];
  persistedInFirestore?: boolean;
}

export interface CrmConnectionState {
  id: string;
  provider: CrmPlatformId;
  accountLabel: string;
  audienceDefault: string;
  status: "connected" | "disconnected";
  oauthConfigured?: boolean;
  serverTokenConfigured?: boolean;
  updatedAt: string;
}

export interface ScheduledDispatchItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  platform: CrmPlatformId;
  audienceList: string;
  deliveryMode: "export_draft" | "scheduled";
  scheduledFor: string;
  status: "draft_exported" | "scheduled" | "sent" | "cancelled";
  externalRef: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  modelUsed?: string;
  fallbackNotice?: string;
}

export interface ChatPersonaConfig {
  id: ChatRoleId;
  name: string;
  subtitle: string;
  defaultModel: GeminiTextModel;
  description: string;
  starterPrompts: string[];
}

export interface AttachedReferenceDoc {
  id: string;
  title: string;
  category: string;
  path: string;
  fileType: "pdf" | "html";
  pageCountLabel: string;
  summary: string;
  keyRules: string[];
}
