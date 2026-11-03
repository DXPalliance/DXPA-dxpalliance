import {
  OperationType,
  Timestamp,
  clampStr,
  db,
  deleteDoc,
  doc,
  getDoc,
  handleFirestoreError,
  sanitizeDocId,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "../firebase";
import { STARTER_HERO_PRIZE_SVG } from "../data/tdexKnowledge";
import {
  AspectRatioOption,
  BrandMode,
  ChatRoleId,
  CrmConnectionState,
  CrmPlatformId,
  EmailBodySection,
  EmailCampaign,
  ImageResolution,
  ScheduledDispatchItem,
  SubjectLineOption,
} from "../types/campaign";

function tsToIso(val: unknown): string {
  if (val && typeof (val as Timestamp).toDate === "function") {
    return (val as Timestamp).toDate().toISOString();
  }
  if (typeof val === "string" && val) return val;
  return new Date().toISOString();
}

export function buildFirestoreCampaignFields(
  campaign: EmailCampaign,
  ownerId: string
) {
  const s = campaign.subjectLines || [];
  const selectedIdx = Math.max(
    0,
    Math.min(
      3,
      s.findIndex((item) => item.id === campaign.selectedSubjectId)
    )
  );
  const b = campaign.bodySections || [];

  const validBrandMode = campaign.brandMode === BrandMode.CUSTOM ? "custom" : "tdex";
  const validSizes = ["1K", "2K", "4K"];
  const imageSize = validSizes.includes(campaign.imageSize)
    ? campaign.imageSize
    : "2K";
  const validRatios = ["16:9", "4:3", "1:1", "3:4"];
  const aspectRatio = validRatios.includes(campaign.aspectRatio)
    ? campaign.aspectRatio
    : "16:9";

  return {
    ownerId,
    brandMode: validBrandMode,
    brandName: clampStr(campaign.brandName || "The Discovery Exchange (Tdex)", 120),
    prompt: clampStr(campaign.prompt || campaign.campaignTitle, 4000),
    audience: clampStr(campaign.audience || "Subscribers", 200),
    tone: clampStr(campaign.tone || "Straight-Talking & Warm", 120),
    campaignTitle: clampStr(campaign.campaignTitle || "Untitled Campaign", 200),
    strategySummary: clampStr(campaign.strategySummary || "", 1000),
    senderName: clampStr(campaign.senderName || "The Discovery Exchange", 120),
    senderEmail: clampStr(
      campaign.senderEmail || "concierge@thediscoveryexchange.com",
      254
    ),
    selectedSubjectIndex: selectedIdx,
    subject1Angle: clampStr(s[0]?.angle || "Option 1", 80),
    subject1Text: clampStr(s[0]?.text || campaign.campaignTitle, 300),
    subject1Preview: clampStr(s[0]?.previewText || "", 400),
    subject2Angle: clampStr(s[1]?.angle || "Option 2", 80),
    subject2Text: clampStr(s[1]?.text || "", 300),
    subject2Preview: clampStr(s[1]?.previewText || "", 400),
    subject3Angle: clampStr(s[2]?.angle || "Option 3", 80),
    subject3Text: clampStr(s[2]?.text || "", 300),
    subject3Preview: clampStr(s[2]?.previewText || "", 400),
    subject4Angle: clampStr(s[3]?.angle || "Option 4", 80),
    subject4Text: clampStr(s[3]?.text || "", 300),
    subject4Preview: clampStr(s[3]?.previewText || "", 400),
    heroHeadline: clampStr(campaign.heroHeadline || "", 300),
    heroSubheadline: clampStr(campaign.heroSubheadline || "", 600),
    openingSalutation: clampStr(campaign.openingSalutation || "Hello,", 200),
    sec1Heading: clampStr(b[0]?.heading || "", 200),
    sec1Body: clampStr(b[0]?.body || "", 4000),
    sec1Callout: clampStr(b[0]?.callout || "", 600),
    sec2Heading: clampStr(b[1]?.heading || "", 200),
    sec2Body: clampStr(b[1]?.body || "", 4000),
    sec2Callout: clampStr(b[1]?.callout || "", 600),
    sec3Heading: clampStr(b[2]?.heading || "", 200),
    sec3Body: clampStr(b[2]?.body || "", 4000),
    sec3Callout: clampStr(b[2]?.callout || "", 600),
    primaryCtaLabel: clampStr(campaign.primaryCtaLabel || "Learn More", 120),
    primaryCtaUrl: clampStr(campaign.primaryCtaUrl || "https://thediscoveryexchange.com", 500),
    closingSignoff: clampStr(campaign.closingSignoff || "Warm regards,", 400),
    disclosuresText: clampStr((campaign.disclosures || []).join("\n"), 3000),
    plainTextVersion: clampStr(campaign.plainTextVersion || "", 15000),
    visualPrompt: clampStr(campaign.visualPrompt || "", 2000),
    imageSize,
    aspectRatio,
  };
}

export function firestoreDocToEmailCampaign(
  docId: string,
  data: Record<string, unknown>,
  existingLocal?: EmailCampaign
): EmailCampaign {
  const subjects: SubjectLineOption[] = [
    {
      id: `${docId}-subj-0`,
      angle: String(data.subject1Angle || "Direct Clarity"),
      text: String(data.subject1Text || ""),
      previewText: String(data.subject1Preview || ""),
    },
    {
      id: `${docId}-subj-1`,
      angle: String(data.subject2Angle || "Story & Curiosity"),
      text: String(data.subject2Text || ""),
      previewText: String(data.subject2Preview || ""),
    },
    {
      id: `${docId}-subj-2`,
      angle: String(data.subject3Angle || "Mission-Driven"),
      text: String(data.subject3Text || ""),
      previewText: String(data.subject3Preview || ""),
    },
    {
      id: `${docId}-subj-3`,
      angle: String(data.subject4Angle || "Concise Mobile"),
      text: String(data.subject4Text || ""),
      previewText: String(data.subject4Preview || ""),
    },
  ].filter((item, idx) => idx === 0 || item.text.trim().length > 0);

  const selIdx =
    typeof data.selectedSubjectIndex === "number" &&
    data.selectedSubjectIndex >= 0 &&
    data.selectedSubjectIndex < subjects.length
      ? data.selectedSubjectIndex
      : 0;

  const rawSections: EmailBodySection[] = [
    {
      id: `${docId}-sec-0`,
      heading: String(data.sec1Heading || ""),
      body: String(data.sec1Body || ""),
      callout: String(data.sec1Callout || ""),
    },
    {
      id: `${docId}-sec-1`,
      heading: String(data.sec2Heading || ""),
      body: String(data.sec2Body || ""),
      callout: String(data.sec2Callout || ""),
    },
    {
      id: `${docId}-sec-2`,
      heading: String(data.sec3Heading || ""),
      body: String(data.sec3Body || ""),
      callout: String(data.sec3Callout || ""),
    },
  ].filter((sec, idx) => idx === 0 || sec.heading.trim() || sec.body.trim());

  const disclosuresRaw = String(data.disclosuresText || "");
  const disclosures = disclosuresRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id: docId,
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
    brandMode:
      data.brandMode === "custom" ? BrandMode.CUSTOM : BrandMode.TDEX,
    brandName: String(data.brandName || "The Discovery Exchange (Tdex)"),
    prompt: String(data.prompt || ""),
    audience: String(data.audience || ""),
    tone: String(data.tone || ""),
    campaignTitle: String(data.campaignTitle || "Untitled Campaign"),
    strategySummary: String(data.strategySummary || ""),
    senderName: String(data.senderName || ""),
    senderEmail: String(data.senderEmail || ""),
    subjectLines: subjects,
    selectedSubjectId: subjects[selIdx]?.id || subjects[0].id,
    heroHeadline: String(data.heroHeadline || ""),
    heroSubheadline: String(data.heroSubheadline || ""),
    openingSalutation: String(data.openingSalutation || "Hello,"),
    bodySections: rawSections,
    primaryCtaLabel: String(data.primaryCtaLabel || "Learn More"),
    primaryCtaUrl: String(data.primaryCtaUrl || "https://thediscoveryexchange.com"),
    closingSignoff: String(data.closingSignoff || ""),
    disclosures,
    plainTextVersion: String(data.plainTextVersion || ""),
    visualPrompt: String(data.visualPrompt || ""),
    imageUrl: existingLocal?.imageUrl || STARTER_HERO_PRIZE_SVG,
    videoUrl: existingLocal?.videoUrl,
    videoAspectRatio: existingLocal?.videoAspectRatio,
    imageSize: (data.imageSize as ImageResolution) || ImageResolution.RES_2K,
    aspectRatio:
      (data.aspectRatio as AspectRatioOption) || AspectRatioOption.WIDE,
    imageSourceNote: existingLocal?.imageSourceNote,
    usedTextModel: existingLocal?.usedTextModel,
    complianceChecks: existingLocal?.complianceChecks || [
      {
        rule: "Cloud Firestore Synced",
        passed: true,
        detail: "Campaign copy, subject lines, and disclosures are persisted in your authenticated workspace.",
      },
    ],
    persistedInFirestore: true,
  };
}

export async function saveCampaignToFirestore(
  campaign: EmailCampaign,
  ownerId: string
): Promise<string> {
  const safeId = sanitizeDocId(campaign.id);
  const ref = doc(db, "campaigns", safeId);
  const fields = buildFirestoreCampaignFields(campaign, ownerId);

  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const { ownerId: _omitOwner, ...mutableFields } = fields;
      await updateDoc(ref, {
        ...mutableFields,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ...fields,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return safeId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `campaigns/${safeId}`);
  }
}

export async function deleteCampaignFromFirestore(campaignId: string): Promise<void> {
  const safeId = sanitizeDocId(campaignId);
  const ref = doc(db, "campaigns", safeId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `campaigns/${safeId}`);
  }
}

export async function upsertCrmConnectionInFirestore(
  ownerId: string,
  provider: CrmPlatformId,
  accountLabel: string,
  audienceDefault: string,
  status: "connected" | "disconnected"
): Promise<void> {
  const docId = sanitizeDocId(`${ownerId}_${provider}`);
  const ref = doc(db, "crmConnections", docId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        accountLabel: clampStr(accountLabel, 200),
        audienceDefault: clampStr(audienceDefault, 200),
        status,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ownerId,
        provider,
        accountLabel: clampStr(accountLabel, 200),
        audienceDefault: clampStr(audienceDefault, 200),
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `crmConnections/${docId}`
    );
  }
}

export function firestoreDocToCrmConnection(
  docId: string,
  data: Record<string, unknown>
): CrmConnectionState {
  return {
    id: docId,
    provider: (data.provider as CrmPlatformId) || "mailchimp",
    accountLabel: String(data.accountLabel || ""),
    audienceDefault: String(data.audienceDefault || ""),
    status: data.status === "connected" ? "connected" : "disconnected",
    updatedAt: tsToIso(data.updatedAt),
  };
}

export async function createScheduledDispatchWithCampaign(
  ownerId: string,
  campaign: EmailCampaign,
  params: {
    platform: CrmPlatformId;
    audienceList: string;
    deliveryMode: "export_draft" | "scheduled";
    scheduledFor: string;
    status: "draft_exported" | "scheduled" | "sent" | "cancelled";
    externalRef: string;
  }
): Promise<string> {
  const safeCampaignId = sanitizeDocId(campaign.id);
  const dispatchId = sanitizeDocId(`disp_${Date.now()}_${params.platform}`);
  const campaignRef = doc(db, "campaigns", safeCampaignId);
  const dispatchRef = doc(db, "scheduledDispatches", dispatchId);

  try {
    const campaignSnap = await getDoc(campaignRef);
    const batch = writeBatch(db);

    if (!campaignSnap.exists()) {
      const fields = buildFirestoreCampaignFields(campaign, ownerId);
      batch.set(campaignRef, {
        ...fields,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    batch.set(dispatchRef, {
      ownerId,
      campaignId: safeCampaignId,
      campaignTitle: clampStr(campaign.campaignTitle || "Campaign Dispatch", 200),
      platform: params.platform,
      audienceList: clampStr(params.audienceList || "Primary Subscribers", 200),
      deliveryMode: params.deliveryMode,
      scheduledFor: clampStr(params.scheduledFor || "", 64),
      status: params.status,
      externalRef: clampStr(params.externalRef || "", 200),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    return dispatchId;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `scheduledDispatches/${dispatchId}`
    );
  }
}

export async function cancelScheduledDispatchInFirestore(
  dispatchId: string,
  currentExternalRef: string
): Promise<void> {
  const safeId = sanitizeDocId(dispatchId);
  const ref = doc(db, "scheduledDispatches", safeId);
  try {
    await updateDoc(ref, {
      status: "cancelled",
      externalRef: clampStr(currentExternalRef, 200),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `scheduledDispatches/${safeId}`
    );
  }
}

export function firestoreDocToDispatch(
  docId: string,
  data: Record<string, unknown>
): ScheduledDispatchItem {
  return {
    id: docId,
    campaignId: String(data.campaignId || ""),
    campaignTitle: String(data.campaignTitle || ""),
    platform: (data.platform as CrmPlatformId) || "mailchimp",
    audienceList: String(data.audienceList || ""),
    deliveryMode:
      data.deliveryMode === "scheduled" ? "scheduled" : "export_draft",
    scheduledFor: String(data.scheduledFor || ""),
    status: (data.status as ScheduledDispatchItem["status"]) || "draft_exported",
    externalRef: String(data.externalRef || ""),
    updatedAt: tsToIso(data.updatedAt),
  };
}

export async function appendChatMessageToFirestore(params: {
  ownerId: string;
  personaId: ChatRoleId;
  role: "user" | "model";
  text: string;
  modelUsed: string;
  clientOrder: number;
}): Promise<void> {
  if (!params.text.trim()) return;
  const msgId = sanitizeDocId(
    `msg_${params.personaId}_${params.clientOrder}_${params.role}`
  );
  const ref = doc(db, "chatMessages", msgId);
  try {
    await setDoc(ref, {
      ownerId: params.ownerId,
      personaId: params.personaId,
      role: params.role,
      text: clampStr(params.text, 12000),
      modelUsed: clampStr(params.modelUsed || "gemini-3.8-flash", 80),
      clientOrder: Math.max(0, Math.floor(params.clientOrder)),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `chatMessages/${msgId}`);
  }
}
