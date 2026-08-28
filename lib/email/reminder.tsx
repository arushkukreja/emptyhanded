interface ReminderRec {
  product_name: string;
  amazon_url: string;
  budget_range?: string | null;
  reason?: string | null;
  image_url?: string | null;
}

interface ReminderProps {
  recipient_name: string;
  occasion_label: string;
  occasion_emoji: string;
  formatted_date: string;
  recommendations: ReminderRec[];
  app_url: string;
  event_id: string;
}

export function renderReminderEmail(p: ReminderProps): { subject: string; html: string } {
  const subject = `${p.recipient_name}'s ${p.occasion_label.toLowerCase()} is in 7 days 🎁`;
  const firstName = p.recipient_name.split(" ")[0];
  const appUrl = p.app_url.replace(/\/$/, "");
  const recsHtml = p.recommendations.map((recommendation, index) => `
    <tr><td style="padding:0 0 12px;">
      <table class="pick-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FAFAF9" style="width:100%;border:1px solid #EFEDE8;border-radius:14px;background-color:#FAFAF9;overflow:hidden;">
        <tr>
          <td class="pick-image-cell" width="84" style="width:84px;padding:12px 0 12px 12px;">
            <div class="pick-image-box" style="width:72px;height:72px;border-radius:12px;background-color:#F5F0E8;color:#9B7654;text-align:center;font-size:25px;line-height:72px;overflow:hidden;">
              ${recommendation.image_url ? `<img class="pick-image" src="${escapeHtml(recommendation.image_url)}" width="72" height="72" alt="" style="display:block;width:72px;height:72px;object-fit:contain;padding:8px;box-sizing:border-box;mix-blend-mode:multiply;" />` : p.occasion_emoji}
            </div>
          </td>
          <td class="pick-copy" style="padding:14px 10px 14px 14px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:.1em;color:#B45309;">PICK ${String(index + 1).padStart(2, "0")}</div>
            <div class="pick-title" style="margin-top:4px;font-weight:700;color:#0F172A;font-size:15px;line-height:1.35;">${escapeHtml(recommendation.product_name)}</div>
            ${recommendation.reason ? `<div class="pick-reason" style="font-size:13px;color:#475569;font-style:italic;margin-top:4px;line-height:1.5;">${escapeHtml(recommendation.reason)}</div>` : ""}
          </td>
          <td class="pick-action" width="70" align="center" style="width:70px;padding:14px 12px 14px 0;"><a class="pick-button" href="${escapeHtml(recommendation.amazon_url)}" aria-label="View ${escapeHtml(recommendation.product_name)}" style="display:inline-block;background:#0F172A;color:#FFFFFF;text-decoration:none;padding:9px 11px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap;"><span class="view-label">View </span>→</a></td>
        </tr>
      </table>
    </td></tr>`).join("");

  const html = `<!doctype html>
<html><head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root { color-scheme:light dark; supported-color-schemes:light dark; }
    @media only screen and (max-width:600px) {
      .email-shell { padding:12px 0 !important; }
      .email-card { border-radius:0 !important; border-left:0 !important; border-right:0 !important; }
      .email-header { padding:20px 18px !important; }
      .email-body { padding:28px 18px 26px !important; }
      .email-heading { font-size:28px !important; }
      .email-intro { font-size:15px !important; line-height:1.65 !important; }
      .pick-image-cell { width:72px !important; padding:10px 0 10px 10px !important; }
      .pick-image-box, .pick-image { width:62px !important; height:62px !important; }
      .pick-image-box { line-height:62px !important; }
      .pick-copy { padding:12px 8px 12px 10px !important; }
      .pick-action { width:42px !important; padding:10px 10px 10px 0 !important; }
      .pick-button { min-width:18px !important; padding:9px !important; text-align:center !important; }
      .view-label { display:none !important; }
      .email-footer { padding:24px 18px !important; }
    }
    @media (prefers-color-scheme:dark) {
      body, .email-shell { background-color:#070D19 !important; }
      .email-card, .email-body { background-color:#0F172A !important; border-color:#334155 !important; }
      .email-heading, .pick-title { color:#F8FAFC !important; }
      .email-intro, .pick-reason { color:#CBD5E1 !important; }
      .pick-card { background-color:#1E293B !important; border-color:#3E4C63 !important; }
      .pick-image-box { background-color:#F5F0E8 !important; color:#9B7654 !important; }
      .pick-button { background-color:#F59E0B !important; color:#0F172A !important; }
      .email-cta { color:#FBBF24 !important; }
      .email-footer { background-color:#172033 !important; border-top-color:#334155 !important; }
      .email-footer-brand { color:#F8FAFC !important; }
      .email-footer-copy { color:#CBD5E1 !important; }
    }
    [data-ogsc] .email-shell { background-color:#070D19 !important; }
    [data-ogsc] .email-card, [data-ogsc] .email-body { background-color:#0F172A !important; border-color:#334155 !important; }
    [data-ogsc] .email-heading, [data-ogsc] .pick-title, [data-ogsc] .email-footer-brand { color:#F8FAFC !important; }
    [data-ogsc] .email-intro, [data-ogsc] .pick-reason, [data-ogsc] .email-footer-copy { color:#CBD5E1 !important; }
    [data-ogsc] .pick-card { background-color:#1E293B !important; border-color:#3E4C63 !important; }
    [data-ogsc] .pick-button { background-color:#F59E0B !important; color:#0F172A !important; }
    [data-ogsc] .email-cta { color:#FBBF24 !important; }
    [data-ogsc] .email-footer { background-color:#172033 !important; border-top-color:#334155 !important; }
  </style>
</head><body class="email-page" style="margin:0;padding:0;background-color:#EEEAE3;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#0F172A;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table class="email-shell" role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#EEEAE3" style="width:100%;background-color:#EEEAE3;padding:32px 12px;">
    <tr><td align="center">
      <table class="email-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="max-width:560px;width:100%;background-color:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E7E5E0;box-shadow:0 12px 32px rgba(15,23,42,.12);">
        <tr><td class="email-header" align="center" bgcolor="#0F172A" style="background-color:#0F172A;padding:22px 28px;color:#FFFFFF;">
          <div style="font-family:Georgia,serif;font-size:25px;font-weight:700;letter-spacing:-.05em;line-height:1;color:#FFFFFF;">emptyhanded<span style="color:#F59E0B;">.</span></div>
        </td></tr>
        <tr><td class="email-body" bgcolor="#FFFFFF" style="padding:36px 30px 30px;background-color:#FFFFFF;">
          <div style="text-align:center;"><div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#FEF3C7;color:#B45309;font-size:10px;font-weight:700;letter-spacing:.07em;text-align:center;">7 DAYS UNTIL ${escapeHtml(firstName.toUpperCase())}'S ${escapeHtml(p.occasion_label.toUpperCase())}</div></div>
          <h1 class="email-heading" style="margin:20px 0 10px;font-family:Georgia,serif;font-size:30px;line-height:1.12;letter-spacing:-.03em;color:#0F172A;">Don't show up empty handed.</h1>
          <p class="email-intro" style="margin:0 0 26px;font-size:14px;line-height:1.7;color:#475569;">${escapeHtml(firstName)}'s day is coming up on ${escapeHtml(p.formatted_date)}. Here are a few thoughtful ideas chosen from what you told us.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${recsHtml}</table>
          <div style="text-align:center;margin-top:20px;"><a class="email-cta" href="${escapeHtml(`${appUrl}/events/${encodeURIComponent(p.event_id)}`)}" style="color:#B45309;font-size:13px;font-weight:600;text-underline-offset:4px;">See every pick or swap one out →</a></div>
        </td></tr>
        <tr><td class="email-footer" align="center" bgcolor="#F5F4F1" style="padding:26px 28px;background-color:#F5F4F1;border-top:1px solid #EFEDE8;">
          <div class="email-footer-brand" style="font-family:Georgia,serif;font-size:19px;font-weight:700;letter-spacing:-.04em;color:#0F172A;">emptyhanded<span style="color:#F59E0B;">.</span></div>
          <p class="email-footer-copy" style="margin:12px 0 0;font-size:10px;line-height:1.6;color:#64748B;">You're receiving this because you added ${escapeHtml(p.recipient_name)} to your emptyhanded calendar.<br>Links may earn us a small commission—it never changes your price.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}
