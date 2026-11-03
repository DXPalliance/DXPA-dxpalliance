import { BrandMode, EmailCampaign, ImageResolution } from "../types/campaign";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildResponsiveEmailHtml(campaign: EmailCampaign): string {
  const activeSubject =
    campaign.subjectLines.find((s) => s.id === campaign.selectedSubjectId) ||
    campaign.subjectLines[0];

  const isTdex = campaign.brandMode === BrandMode.TDEX;
  const headerBg = isTdex ? "#0F2749" : "#0F172A";
  const accentColor = isTdex ? "#B47B18" : "#1D4ED8";
  const buttonBg = isTdex ? "#0F2749" : "#0F172A";
  const buttonBorder = isTdex ? "#D4A13E" : "#0F172A";

  const sectionsHtml = campaign.bodySections
    .map(
      (sec) => `
        <tr>
          <td style="padding: 0 36px 24px 36px;">
            <h2 style="margin: 0 0 10px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 19px; line-height: 1.35; font-weight: 700; color: #0F172A;">
              ${escapeHtml(sec.heading)}
            </h2>
            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.68; color: #334155;">
              ${escapeHtml(sec.body).replace(/\n/g, "<br />")}
            </p>
            ${
              sec.callout
                ? `<div style="margin-top: 14px; padding: 14px 16px; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 13px; line-height: 1.55; color: #1E293B;">
                    ${escapeHtml(sec.callout)}
                   </div>`
                : ""
            }
          </td>
        </tr>`
    )
    .join("\n");

  const disclosuresHtml = campaign.disclosures
    .map(
      (d) =>
        `<p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 1.55; color: #64748B;">${escapeHtml(
          d
        )}</p>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(activeSubject?.text || campaign.campaignTitle)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; -webkit-font-smoothing: antialiased;">
  <!-- Inbox Preview Text -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
    ${escapeHtml(activeSubject?.previewText || campaign.heroSubheadline)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F1F5F9; padding: 28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;">
          <!-- Brand Header -->
          <tr>
            <td style="background-color: ${headerBg}; padding: 20px 36px; text-align: left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.01em;">
                    ${escapeHtml(campaign.brandName)}
                  </td>
                  <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #CBD5E1;">
                    ${isTdex ? "From the Garage to the Future" : escapeHtml(campaign.audience)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Visual -->
          ${
            campaign.imageUrl
              ? `<tr>
                  <td style="padding: 0; background-color: #0F172A;">
                    <img src="${campaign.imageUrl}" alt="${escapeHtml(
                      campaign.heroHeadline
                    )}" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0;" />
                  </td>
                </tr>`
              : ""
          }

          <!-- Hero Copy -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 1px solid #F1F5F9;">
              <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 600; color: ${accentColor};">
                ${escapeHtml(campaign.campaignTitle)}
              </p>
              <h1 style="margin: 0 0 12px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; line-height: 1.26; font-weight: 700; color: #0F172A;">
                ${escapeHtml(campaign.heroHeadline)}
              </h1>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.55; color: #475569;">
                ${escapeHtml(campaign.heroSubheadline)}
              </p>
            </td>
          </tr>

          <!-- Salutation -->
          <tr>
            <td style="padding: 24px 36px 16px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0F172A;">
              ${escapeHtml(campaign.openingSalutation)}
            </td>
          </tr>

          <!-- Body Sections -->
          ${sectionsHtml}

          <!-- Primary CTA -->
          <tr>
            <td style="padding: 8px 36px 32px 36px;" align="left">
              <a href="${escapeHtml(
                campaign.primaryCtaUrl || "#"
              )}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: ${buttonBg}; color: #FFFFFF; border: 1px solid ${buttonBorder}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; padding: 13px 24px; border-radius: 8px;">
                ${escapeHtml(campaign.primaryCtaLabel)}
              </a>
            </td>
          </tr>

          <!-- Sign-Off -->
          <tr>
            <td style="padding: 0 36px 28px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
              ${escapeHtml(campaign.closingSignoff).replace(/\n/g, "<br />")}
            </td>
          </tr>

          <!-- Disclosures & Unsubscribe Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 24px 36px;">
              ${
                isTdex
                  ? `<p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 600; line-height: 1.5; color: #0F2749;">DISCOVERY EXCHANGE PARENTS ALLIANCE (Dexpa) · First Human–AI Joint Venture for Families · Supporting the National K–12 Discovery Prize.</p>`
                  : ""
              }
              ${disclosuresHtml}
              <p style="margin: 12px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #64748B;">
                Sent by ${escapeHtml(campaign.senderName)} (${escapeHtml(
                  campaign.senderEmail
                )}) · <a href="#unsubscribe" style="color: #475569; text-decoration: underline;">Manage Preferences</a> · <a href="#unsubscribe" style="color: #475569; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function downloadVisualAtResolution(
  imageUrl: string,
  resolution: ImageResolution,
  filenameSlug: string
): Promise<void> {
  const targetLongEdge =
    resolution === ImageResolution.RES_4K
      ? 3840
      : resolution === ImageResolution.RES_2K
      ? 2048
      : 1024;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const naturalW = img.naturalWidth || 1600;
      const naturalH = img.naturalHeight || 900;
      const ratio = naturalW / naturalH;
      let width = targetLongEdge;
      let height = Math.round(targetLongEdge / ratio);
      if (ratio < 1) {
        height = targetLongEdge;
        width = Math.round(targetLongEdge * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to encode PNG"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filenameSlug}-${resolution.toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Could not load visual for export"));
    img.src = imageUrl;
  });
}

export function downloadCrmPlatformBundle(
  campaign: EmailCampaign,
  platform: "mailchimp" | "hubspot" | "salesforce",
  audienceList: string,
  scheduledFor?: string
): void {
  const baseHtml = buildResponsiveEmailHtml(campaign);
  const activeSubject =
    campaign.subjectLines.find((s) => s.id === campaign.selectedSubjectId) ||
    campaign.subjectLines[0];

  const slug = (campaign.campaignTitle || "campaign")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let content = "";
  let mime = "text/html;charset=utf-8";
  let filename = `${slug}-${platform}.html`;

  if (platform === "mailchimp") {
    content = baseHtml
      .replace(/href="#unsubscribe"/g, 'href="*|UNSUB|*"')
      .replace(
        "Manage Preferences",
        '<span mc:edit="prefs">Manage Preferences (*|UPDATE_PROFILE|*)</span>'
      );
    filename = `${slug}-mailchimp-template.html`;
  } else if (platform === "hubspot") {
    content = baseHtml.replace(
      /href="#unsubscribe"/g,
      'href="{{ unsubscribe_link }}"'
    );
    filename = `${slug}-hubspot-email.html`;
  } else {
    mime = "application/json;charset=utf-8";
    filename = `${slug}-salesforce-email-bundle.json`;
    content = JSON.stringify(
      {
        sObject: "EmailContent",
        Name: campaign.campaignTitle,
        Subject: activeSubject?.text || campaign.campaignTitle,
        Preheader: activeSubject?.previewText || campaign.heroSubheadline,
        TargetAudienceList: audienceList || campaign.audience,
        ScheduledSendTime: scheduledFor || null,
        SenderName: campaign.senderName,
        SenderEmail: campaign.senderEmail,
        HtmlBody: baseHtml,
        TextBody: campaign.plainTextVersion,
      },
      null,
      2
    );
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

