import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  Copy,
  Download,
  ExternalLink,
  FolderOpen,
  Link2,
  RefreshCw,
  Send,
  Unlink,
  XCircle,
} from "lucide-react";
import { User } from "../firebase";
import {
  BrandMode,
  CrmConnectionState,
  CrmPlatformId,
  EmailCampaign,
  ScheduledDispatchItem,
} from "../types/campaign";
import {
  buildResponsiveEmailHtml,
  downloadCrmPlatformBundle,
} from "../utils/emailHtmlBuilder";
import {
  cancelScheduledDispatchInFirestore,
  createScheduledDispatchWithCampaign,
  upsertCrmConnectionInFirestore,
} from "../utils/firestoreSync";
import { SavedCampaignsView } from "./SavedCampaignsView";

interface CrmIntegrationsViewProps {
  campaigns: EmailCampaign[];
  activeCampaignId: string;
  currentUser: User | null;
  firestoreConnections: CrmConnectionState[];
  firestoreDispatches: ScheduledDispatchItem[];
  onSignInGoogle: () => Promise<void>;
  onSelectCampaignForStudio: (id: string) => void;
  onDuplicateCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onCreateNewCampaign: () => void;
}

interface ProviderServerStatus {
  oauthConfigured: boolean;
  serverTokenConfigured: boolean;
  connected: boolean;
  accountLabel: string;
}

const PLATFORM_META: Record<
  CrmPlatformId,
  {
    name: string;
    subtitle: string;
    apiCapability: string;
    secretEnvHint: string;
    defaultAudiencePlaceholder: string;
  }
> = {
  mailchimp: {
    name: "Mailchimp",
    subtitle: "Marketing API v3 · Campaigns & UTC Send Scheduler",
    apiCapability:
      "Creates regular campaign, uploads responsive HTML + plain-text MIME, and triggers /actions/schedule",
    secretEnvHint: "MAILCHIMP_CLIENT_ID & MAILCHIMP_CLIENT_SECRET",
    defaultAudiencePlaceholder: "e.g. a1b2c3d4e5 (Mailchimp List ID)",
  },
  hubspot: {
    name: "HubSpot",
    subtitle: "Marketing Hub v3 · Marketing Emails & Publish Dates",
    apiCapability:
      "Creates Marketing Email draft or scheduled publishDate via /marketing/v3/emails",
    secretEnvHint: "HUBSPOT_CLIENT_ID & HUBSPOT_CLIENT_SECRET",
    defaultAudiencePlaceholder: "e.g. Participating Families List",
  },
  salesforce: {
    name: "Salesforce",
    subtitle: "REST API v60 · Campaign Records & Lightning Email Bundles",
    apiCapability:
      "Creates Campaign sObject (In Progress / Planned) and exports Lightning EmailContent JSON",
    secretEnvHint: "SALESFORCE_CLIENT_ID & SALESFORCE_CLIENT_SECRET",
    defaultAudiencePlaceholder: "e.g. K-12 Educators & Donors",
  },
};

const LOCAL_DISPATCH_KEY = "tdex_studio_local_dispatches_v1";

function defaultTomorrowDateTimeLocal(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export const CrmIntegrationsView: React.FC<CrmIntegrationsViewProps> = ({
  campaigns,
  activeCampaignId,
  currentUser,
  firestoreConnections,
  firestoreDispatches,
  onSignInGoogle,
  onSelectCampaignForStudio,
  onDuplicateCampaign,
  onDeleteCampaign,
  onCreateNewCampaign,
}) => {
  const [subTab, setSubTab] = useState<"connect_dispatch" | "library">(
    "connect_dispatch"
  );
  const [serverStatus, setServerStatus] = useState<
    Record<CrmPlatformId, ProviderServerStatus>
  >({
    mailchimp: {
      oauthConfigured: false,
      serverTokenConfigured: false,
      connected: false,
      accountLabel: "",
    },
    hubspot: {
      oauthConfigured: false,
      serverTokenConfigured: false,
      connected: false,
      accountLabel: "",
    },
    salesforce: {
      oauthConfigured: false,
      serverTokenConfigured: false,
      connected: false,
      accountLabel: "",
    },
  });
  const [callbackUrl, setCallbackUrl] = useState<string>(
    `${window.location.origin}/auth/callback`
  );
  const [copiedCallback, setCopiedCallback] = useState(false);

  const [selectedCampaignId, setSelectedCampaignId] =
    useState<string>(activeCampaignId);
  const [selectedPlatform, setSelectedPlatform] =
    useState<CrmPlatformId>("mailchimp");
  const [deliveryMode, setDeliveryMode] = useState<
    "export_draft" | "scheduled"
  >("export_draft");
  const [scheduledFor, setScheduledFor] = useState<string>(
    defaultTomorrowDateTimeLocal
  );
  const [audienceList, setAudienceList] = useState<string>(
    "Participating Families & Subscribers"
  );

  const [audienceDrafts, setAudienceDrafts] = useState<
    Record<CrmPlatformId, string>
  >({
    mailchimp: "",
    hubspot: "Participating Families",
    salesforce: "K-12 Prize Supporters",
  });

  const [localDispatches, setLocalDispatches] = useState<
    ScheduledDispatchItem[]
  >(() => {
    try {
      const raw = localStorage.getItem(LOCAL_DISPATCH_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore storage error
    }
    return [];
  });

  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [connectingProvider, setConnectingProvider] =
    useState<CrmPlatformId | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    type: "info" | "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setSelectedCampaignId(activeCampaignId);
  }, [activeCampaignId]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_DISPATCH_KEY, JSON.stringify(localDispatches));
    } catch {
      // Ignore storage error
    }
  }, [localDispatches]);

  // Hydrate default audience inputs from Firestore CRM connections
  useEffect(() => {
    if (firestoreConnections.length === 0) return;
    setAudienceDrafts((prev) => {
      const next = { ...prev };
      for (const conn of firestoreConnections) {
        if (conn.audienceDefault) {
          next[conn.provider] = conn.audienceDefault;
        }
      }
      return next;
    });
  }, [firestoreConnections]);

  const userKey = currentUser?.uid || "guest";

  const fetchProviderStatus = useCallback(async () => {
    setIsRefreshingStatus(true);
    try {
      const params = new URLSearchParams({
        userId: userKey,
        origin: window.location.origin,
      });
      const res = await fetch(`/api/crm/providers?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.callbackUrl) {
        setCallbackUrl(data.callbackUrl);
      }
      if (data.providers) {
        setServerStatus(data.providers);
      }
    } catch {
      // Non-fatal network check
    } finally {
      setIsRefreshingStatus(false);
    }
  }, [userKey]);

  useEffect(() => {
    fetchProviderStatus();
  }, [fetchProviderStatus]);

  // Listen for Popup OAuth completion message per oauth/SKILL.md
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (
        !origin.endsWith(".run.app") &&
        !origin.includes("localhost") &&
        origin !== window.location.origin
      ) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        const provider = event.data.provider as CrmPlatformId;
        const accountLabel =
          String(event.data.accountLabel || "") ||
          `${PLATFORM_META[provider]?.name || provider} Connected`;

        await fetchProviderStatus();

        if (currentUser) {
          try {
            await upsertCrmConnectionInFirestore(
              currentUser.uid,
              provider,
              accountLabel,
              audienceDrafts[provider] || "Primary Audience",
              "connected"
            );
          } catch (err) {
            console.error("Failed saving CRM connection to Firestore:", err);
          }
        }

        setBanner({
          type: "success",
          text: `Connected ${accountLabel} via OAuth 2.0.`,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [audienceDrafts, currentUser, fetchProviderStatus]);

  const handleConnectOAuth = async (provider: CrmPlatformId) => {
    setConnectingProvider(provider);
    setBanner(null);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const params = new URLSearchParams({
        provider,
        userId: userKey,
        redirectUri,
      });
      const res = await fetch(`/api/crm/oauth/url?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.configured || !data.url) {
        setBanner({
          type: "info",
          text:
            data.error ||
            `Set ${PLATFORM_META[provider].secretEnvHint} in Settings > Secrets and register ${redirectUri} as your OAuth Redirect URI.`,
        });
        return;
      }

      const authWindow = window.open(
        data.url,
        "crm_oauth_popup",
        "width=620,height=720"
      );
      if (!authWindow) {
        setBanner({
          type: "error",
          text: "Browser blocked the OAuth popup window. Allow popups for this site and click Connect OAuth again.",
        });
      }
    } catch (err) {
      setBanner({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not start OAuth connection flow.",
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleSaveAudiencePreference = async (provider: CrmPlatformId) => {
    const fsConn = firestoreConnections.find((c) => c.provider === provider);
    const srv = serverStatus[provider];
    const isConnected = srv.connected || fsConn?.status === "connected";

    if (!currentUser) {
      setBanner({
        type: "info",
        text: "Sign in with Google to save default CRM audience preferences to Cloud Firestore.",
      });
      return;
    }

    try {
      await upsertCrmConnectionInFirestore(
        currentUser.uid,
        provider,
        srv.accountLabel ||
          fsConn?.accountLabel ||
          `${PLATFORM_META[provider].name} Workspace`,
        audienceDrafts[provider] || "Primary Audience",
        isConnected ? "connected" : "disconnected"
      );
      setBanner({
        type: "success",
        text: `Saved default audience preference for ${PLATFORM_META[provider].name}.`,
      });
    } catch (err) {
      setBanner({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not save CRM preference.",
      });
    }
  };

  const handleDisconnectProvider = async (provider: CrmPlatformId) => {
    if (!currentUser) return;
    try {
      await upsertCrmConnectionInFirestore(
        currentUser.uid,
        provider,
        PLATFORM_META[provider].name,
        audienceDrafts[provider] || "",
        "disconnected"
      );
      setBanner({
        type: "info",
        text: `Marked ${PLATFORM_META[provider].name} as disconnected in your profile.`,
      });
    } catch (err) {
      setBanner({
        type: "error",
        text:
          err instanceof Error ? err.message : "Could not update connection.",
      });
    }
  };

  const targetCampaign = useMemo(
    () =>
      campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0],
    [campaigns, selectedCampaignId]
  );

  const handleLiveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCampaign || isDispatching) return;

    setIsDispatching(true);
    setBanner(null);

    const activeSubject =
      targetCampaign.subjectLines.find(
        (s) => s.id === targetCampaign.selectedSubjectId
      ) || targetCampaign.subjectLines[0];

    const htmlContent = buildResponsiveEmailHtml(targetCampaign);

    try {
      const res = await fetch("/api/crm/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userKey,
          platform: selectedPlatform,
          deliveryMode,
          scheduledFor:
            deliveryMode === "scheduled"
              ? new Date(scheduledFor).toISOString()
              : "",
          audienceList:
            audienceList.trim() ||
            audienceDrafts[selectedPlatform] ||
            targetCampaign.audience,
          campaignTitle: targetCampaign.campaignTitle,
          subjectLine: activeSubject?.text || targetCampaign.campaignTitle,
          previewText:
            activeSubject?.previewText || targetCampaign.heroSubheadline,
          fromName: targetCampaign.senderName,
          replyTo: targetCampaign.senderEmail,
          htmlContent,
          plainText: targetCampaign.plainTextVersion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBanner({
          type: data.requiresAuth ? "info" : "error",
          text:
            data.error ||
            "CRM API dispatch could not complete. Connect OAuth or use Export Bundle & Log Schedule.",
        });
        return;
      }

      const statusVal: ScheduledDispatchItem["status"] =
        deliveryMode === "scheduled" ? "scheduled" : "draft_exported";
      const isoSchedule =
        deliveryMode === "scheduled"
          ? new Date(scheduledFor).toISOString()
          : "";

      if (currentUser) {
        await createScheduledDispatchWithCampaign(
          currentUser.uid,
          targetCampaign,
          {
            platform: selectedPlatform,
            audienceList: audienceList.trim() || targetCampaign.audience,
            deliveryMode,
            scheduledFor: isoSchedule,
            status: statusVal,
            externalRef: data.externalRef || `${selectedPlatform}_live`,
          }
        );
      } else {
        setLocalDispatches((prev) => [
          {
            id: `local_${Date.now()}`,
            campaignId: targetCampaign.id,
            campaignTitle: targetCampaign.campaignTitle,
            platform: selectedPlatform,
            audienceList: audienceList.trim() || targetCampaign.audience,
            deliveryMode,
            scheduledFor: isoSchedule,
            status: statusVal,
            externalRef: data.externalRef || `${selectedPlatform}_live`,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setBanner({
        type: "success",
        text: data.message || "Campaign exported to CRM.",
      });
    } catch (err) {
      setBanner({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Network error communicating with CRM endpoint.",
      });
    } finally {
      setIsDispatching(false);
    }
  };

  const handleExportBundleAndLog = async () => {
    if (!targetCampaign) return;
    const isoSchedule =
      deliveryMode === "scheduled"
        ? new Date(scheduledFor).toISOString()
        : "";

    downloadCrmPlatformBundle(
      targetCampaign,
      selectedPlatform,
      audienceList.trim() || targetCampaign.audience,
      isoSchedule
    );

    const statusVal: ScheduledDispatchItem["status"] =
      deliveryMode === "scheduled" ? "scheduled" : "draft_exported";

    try {
      if (currentUser) {
        await createScheduledDispatchWithCampaign(
          currentUser.uid,
          targetCampaign,
          {
            platform: selectedPlatform,
            audienceList: audienceList.trim() || targetCampaign.audience,
            deliveryMode,
            scheduledFor: isoSchedule,
            status: statusVal,
            externalRef: `bundle_${selectedPlatform}_${Date.now()
              .toString()
              .slice(-6)}`,
          }
        );
      } else {
        setLocalDispatches((prev) => [
          {
            id: `local_${Date.now()}`,
            campaignId: targetCampaign.id,
            campaignTitle: targetCampaign.campaignTitle,
            platform: selectedPlatform,
            audienceList: audienceList.trim() || targetCampaign.audience,
            deliveryMode,
            scheduledFor: isoSchedule,
            status: statusVal,
            externalRef: `bundle_${selectedPlatform}`,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setBanner({
        type: "success",
        text: `Downloaded ${PLATFORM_META[selectedPlatform].name} campaign bundle and logged ${
          deliveryMode === "scheduled" ? "scheduled send" : "draft export"
        }.`,
      });
    } catch (err) {
      setBanner({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Downloaded bundle, but could not record dispatch in Firestore.",
      });
    }
  };

  const handleCancelDispatch = async (item: ScheduledDispatchItem) => {
    if (item.status === "sent" || item.status === "cancelled") return;
    setCancellingId(item.id);
    try {
      if (currentUser && !item.id.startsWith("local_")) {
        await cancelScheduledDispatchInFirestore(item.id, item.externalRef);
      } else {
        setLocalDispatches((prev) =>
          prev.map((d) =>
            d.id === item.id
              ? { ...d, status: "cancelled", updatedAt: new Date().toISOString() }
              : d
          )
        );
      }
      setBanner({
        type: "info",
        text: `Cancelled scheduled dispatch for "${item.campaignTitle}".`,
      });
    } catch (err) {
      setBanner({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not cancel scheduled dispatch.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const combinedDispatches = currentUser
    ? firestoreDispatches
    : localDispatches;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CRM Integrations, Scheduling &amp; Library
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Connect Mailchimp, HubSpot, and Salesforce via OAuth 2.0 to push
            campaign drafts, schedule UTC send windows, or export platform-ready
            HTML &amp; Lightning bundles.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab("connect_dispatch")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === "connect_dispatch"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            CRM Connections &amp; Schedule ({combinedDispatches.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("library")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === "library"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Saved Campaigns ({campaigns.length})
          </button>
        </div>
      </div>

      {subTab === "library" ? (
        <SavedCampaignsView
          campaigns={campaigns}
          activeCampaignId={activeCampaignId}
          onSelectCampaign={onSelectCampaignForStudio}
          onDuplicateCampaign={onDuplicateCampaign}
          onDeleteCampaign={onDeleteCampaign}
          onCreateNew={onCreateNewCampaign}
        />
      ) : (
        <div className="space-y-6">
          {banner && (
            <div
              className={`px-4 py-3 rounded-lg border flex items-start justify-between gap-4 text-xs ${
                banner.type === "error"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : banner.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/80 border-amber-200 text-slate-800"
              }`}
            >
              <span className="leading-relaxed">{banner.text}</span>
              <button
                type="button"
                onClick={() => setBanner(null)}
                className="font-semibold underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Cloud Sync & OAuth Callback Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-900">
                OAuth 2.0 Redirect URI (Register in Mailchimp, HubSpot &amp;
                Salesforce Connected Apps)
              </div>
              <div className="flex flex-wrap items-center gap-2 text-slate-600">
                <code className="font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded text-slate-900 select-all">
                  {callbackUrl}
                </code>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(callbackUrl);
                    setCopiedCallback(true);
                    setTimeout(() => setCopiedCallback(false), 1600);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  {copiedCallback ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Copied URI
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy URI
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {!currentUser && (
                <button
                  type="button"
                  onClick={onSignInGoogle}
                  className="px-3.5 py-2 text-xs font-semibold text-[#0F2749] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign in with Google to Sync CRM &amp; Schedules
                </button>
              )}
              <button
                type="button"
                onClick={fetchProviderStatus}
                disabled={isRefreshingStatus}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isRefreshingStatus ? "animate-spin" : ""
                  }`}
                />
                Refresh Connections
              </button>
            </div>
          </div>

          {/* 3-Column CRM Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(["mailchimp", "hubspot", "salesforce"] as CrmPlatformId[]).map(
              (provider) => {
                const meta = PLATFORM_META[provider];
                const srv = serverStatus[provider];
                const fsRecord = firestoreConnections.find(
                  (c) => c.provider === provider
                );
                const isLiveConnected = srv.connected;
                const isSavedConnected = fsRecord?.status === "connected";

                return (
                  <section
                    key={provider}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {meta.name}
                        </h2>
                        <span
                          className={`text-xs font-medium tabular-nums ${
                            isLiveConnected
                              ? "text-emerald-700"
                              : isSavedConnected
                              ? "text-[#A16207]"
                              : "text-slate-500"
                          }`}
                        >
                          {isLiveConnected
                            ? "Live API Connected"
                            : isSavedConnected
                            ? "Saved Profile · Re-auth OAuth"
                            : "Not Connected"}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-600">
                        {meta.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {meta.apiCapability}
                      </p>

                      {(srv.accountLabel || fsRecord?.accountLabel) && (
                        <div className="pt-1 text-xs text-slate-700">
                          <span className="text-slate-500 mr-1.5">
                            Account:
                          </span>
                          <span className="font-semibold">
                            {srv.accountLabel || fsRecord?.accountLabel}
                          </span>
                        </div>
                      )}

                      <div className="pt-2">
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Default Audience / List Identifier
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={audienceDrafts[provider]}
                            onChange={(e) =>
                              setAudienceDrafts((p) => ({
                                ...p,
                                [provider]: e.target.value,
                              }))
                            }
                            placeholder={meta.defaultAudiencePlaceholder}
                            className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F2749]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveAudiencePreference(provider)
                            }
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={connectingProvider === provider}
                        onClick={() => handleConnectOAuth(provider)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors whitespace-nowrap"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        {connectingProvider === provider
                          ? "Opening OAuth..."
                          : isLiveConnected
                          ? "Reconnect OAuth"
                          : "Connect OAuth"}
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlatform(provider);
                            if (audienceDrafts[provider]) {
                              setAudienceList(audienceDrafts[provider]);
                            }
                          }}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            selectedPlatform === provider
                              ? "border-[#0F2749] text-[#0F2749] bg-slate-50"
                              : "border-slate-200 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {selectedPlatform === provider
                            ? "Selected Target"
                            : "Select"}
                        </button>

                        {isSavedConnected && currentUser && (
                          <button
                            type="button"
                            onClick={() => handleDisconnectProvider(provider)}
                            title="Disconnect saved profile"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                );
              }
            )}
          </div>

          {/* Direct Export & Campaign Scheduler + Dispatch Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Composer (5 cols) */}
            <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Direct Export &amp; Campaign Scheduler
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stage review drafts or schedule approved dispatches in
                  Mailchimp, HubSpot, or Salesforce.
                </p>
              </div>

              {targetCampaign?.brandMode === BrandMode.TDEX && (
                <div className="pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-amber-800 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">
                      Pre-Ratification Gate (Constitution v7.4 Articles 2 &amp; 6):
                    </strong>{" "}
                    Because Tdex is still in active development, use{" "}
                    <strong className="font-semibold">Export Draft Now</strong>{" "}
                    to stage internal review drafts rather than live public
                    enrollment blasts.
                  </span>
                </div>
              )}

              <form onSubmit={handleLiveDispatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Campaign to Export
                  </label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-[#0F2749]"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.campaignTitle} ({c.brandName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-medium text-slate-700 mb-1">
                    Destination Platform
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                    {(
                      ["mailchimp", "hubspot", "salesforce"] as CrmPlatformId[]
                    ).map((plat) => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => {
                          setSelectedPlatform(plat);
                          if (audienceDrafts[plat]) {
                            setAudienceList(audienceDrafts[plat]);
                          }
                        }}
                        className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                          selectedPlatform === plat
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {PLATFORM_META[plat].name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Audience / List ID
                  </label>
                  <input
                    type="text"
                    value={audienceList}
                    onChange={(e) => setAudienceList(e.target.value)}
                    placeholder={
                      PLATFORM_META[selectedPlatform].defaultAudiencePlaceholder
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F2749]"
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-slate-700 mb-1">
                    Delivery Mode
                  </span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode("export_draft")}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                        deliveryMode === "export_draft"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Export Draft Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode("scheduled")}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                        deliveryMode === "scheduled"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Schedule Delivery
                    </button>
                  </div>
                </div>

                {deliveryMode === "scheduled" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Scheduled Send Date &amp; Time (Local -&gt; UTC ISO)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F2749]"
                    />
                  </div>
                )}

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isDispatching || !targetCampaign}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors"
                  >
                    {isDispatching ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Pushing to {PLATFORM_META[selectedPlatform].name}...
                      </>
                    ) : deliveryMode === "scheduled" ? (
                      <>
                        <CalendarClock className="w-3.5 h-3.5" />
                        Schedule Live in {PLATFORM_META[selectedPlatform].name}
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Export Live Draft to{" "}
                        {PLATFORM_META[selectedPlatform].name}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportBundleAndLog}
                    disabled={!targetCampaign}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {PLATFORM_META[selectedPlatform].name} Import
                    Bundle &amp; Log
                  </button>
                </div>
              </form>
            </section>

            {/* Dispatch & Schedule Ledger (7 cols) */}
            <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    CRM Export &amp; Schedule Ledger
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentUser
                      ? "Persisted in Cloud Firestore with terminal state locking on sent or cancelled dispatches."
                      : "Stored in local session — sign in with Google to persist schedules across devices."}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {combinedDispatches.length} records
                </span>
              </div>

              {combinedDispatches.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    No CRM exports or scheduled dispatches yet
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Select any generated email campaign on the left to push a
                    draft or schedule delivery to Mailchimp, HubSpot, or
                    Salesforce.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Campaign &amp; Audience</th>
                        <th className="py-3 px-4">Platform</th>
                        <th className="py-3 px-4">Delivery Window</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {combinedDispatches.map((item) => {
                        const isTerminal =
                          item.status === "sent" || item.status === "cancelled";
                        const schedLabel = item.scheduledFor
                          ? new Date(item.scheduledFor).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Immediate Draft";

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/70 transition-colors"
                          >
                            <td className="py-3.5 px-4 max-w-[230px]">
                              <div className="font-semibold text-slate-900 truncate">
                                {item.campaignTitle}
                              </div>
                              <div className="text-slate-500 truncate mt-0.5">
                                {item.audienceList} ·{" "}
                                <span className="font-mono">
                                  {item.externalRef}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                              {PLATFORM_META[item.platform]?.name ||
                                item.platform}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                              {schedLabel}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`font-semibold ${
                                  item.status === "cancelled"
                                    ? "text-slate-400"
                                    : item.status === "scheduled"
                                    ? "text-[#A16207]"
                                    : "text-emerald-700"
                                }`}
                              >
                                {item.status === "draft_exported"
                                  ? "Draft Exported"
                                  : item.status === "scheduled"
                                  ? "Scheduled"
                                  : item.status === "sent"
                                  ? "Sent (Locked)"
                                  : "Cancelled (Locked)"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSelectCampaignForStudio(item.campaignId)
                                  }
                                  title="Open campaign in Studio"
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                  <FolderOpen className="w-3.5 h-3.5" />
                                </button>
                                {!isTerminal && (
                                  <button
                                    type="button"
                                    disabled={cancellingId === item.id}
                                    onClick={() => handleCancelDispatch(item)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    {cancellingId === item.id
                                      ? "Cancelling..."
                                      : "Cancel"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
