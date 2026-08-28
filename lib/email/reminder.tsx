interface ReminderRec {
  product_name: string;
  amazon_url: string;
  budget_range?: string | null;
  reason?: string | null;
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
  const recsHtml = p.recommendations.map((recommendation, index) => `
    <tr><td style="padding:0 0 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #EFEDE8;border-radius:14px;background:#FAFAF9;overflow:hidden;">
        <tr>
          <td width="70" style="padding:14px 0 14px 14px;"><div style="width:58px;height:58px;border-radius:10px;background:#F2EBE3;color:#9B7654;text-align:center;font-size:25px;line-height:58px;">${p.occasion_emoji}</div></td>
          <td style="padding:14px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:.1em;color:#B45309;">PICK ${String(index + 1).padStart(2, "0")}</div>
            <div style="margin-top:4px;font-weight:700;color:#0F172A;font-size:14px;line-height:1.35;">${escapeHtml(recommendation.product_name)}</div>
            ${recommendation.reason ? `<div style="font-size:12px;color:#64748B;font-style:italic;margin-top:4px;line-height:1.45;">${escapeHtml(recommendation.reason)}</div>` : ""}
          </td>
          <td width="82" align="center" style="padding:14px 14px 14px 0;"><a href="${escapeHtml(recommendation.amazon_url)}" style="display:inline-block;background:#0F172A;color:#FFFFFF;text-decoration:none;padding:9px 12px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap;">View →</a></td>
        </tr>
      </table>
    </td></tr>`).join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#EEEAE3;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEEAE3;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E7E5E0;box-shadow:0 12px 32px rgba(15,23,42,.12);">
        <tr><td align="center" style="background:#0F172A;padding:20px 28px;color:#FFFFFF;font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:-.04em;">emptyhanded</td></tr>
        <tr><td style="padding:36px 30px 30px;">
          <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#FEF3C7;color:#B45309;font-size:10px;font-weight:700;letter-spacing:.07em;">7 DAYS UNTIL ${escapeHtml(firstName.toUpperCase())}'S ${escapeHtml(p.occasion_label.toUpperCase())}</div>
          <h1 style="margin:20px 0 10px;font-family:Georgia,serif;font-size:30px;line-height:1.12;letter-spacing:-.03em;color:#0F172A;">Don't show up empty handed.</h1>
          <p style="margin:0 0 26px;font-size:14px;line-height:1.7;color:#64748B;">${escapeHtml(firstName)}'s day is coming up on ${escapeHtml(p.formatted_date)}. Here are a few thoughtful ideas chosen from what you told us.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${recsHtml}</table>
          <div style="text-align:center;margin-top:20px;"><a href="${escapeHtml(`${p.app_url}/events/${encodeURIComponent(p.event_id)}`)}" style="color:#B45309;font-size:13px;font-weight:600;text-underline-offset:4px;">See every pick or swap one out →</a></div>
        </td></tr>
        <tr><td align="center" style="padding:26px 28px;background:#F5F4F1;border-top:1px solid #EFEDE8;">
          <div style="font-family:Georgia,serif;font-size:16px;font-weight:700;letter-spacing:-.04em;color:#0F172A;">emptyhanded</div>
          <p style="margin:12px 0 0;font-size:10px;line-height:1.6;color:#94A3B8;">You're receiving this because you added ${escapeHtml(p.recipient_name)} to your emptyhanded calendar.<br>Links may earn us a small commission—it never changes your price.</p>
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
