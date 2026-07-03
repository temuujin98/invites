import "server-only";

interface GuestInviteEmailArgs {
  guestName: string;
  inviteTitle: string;
  eventDate?: string | null; // "2026.08.15" preferred
  guestUrl: string;          // ${APP_URL}/g/${token}
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Inline-styled, table-based HTML for broad email-client compatibility.
export function buildGuestInviteEmail({
  guestName,
  inviteTitle,
  eventDate,
  guestUrl,
}: GuestInviteEmailArgs): { subject: string; html: string } {
  const title = escapeHtml(inviteTitle);
  const name = escapeHtml(guestName);
  const dateLine = eventDate
    ? `<p style="margin:0 0 4px;font-size:14px;color:#6D6762;">Огноо: ${escapeHtml(eventDate)}</p>`
    : "";

  const subject = `${inviteTitle} — урилга`;

  const html = `<!doctype html>
<html lang="mn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1EEE9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EEE9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5E1DB;">
        <tr><td style="padding:32px 28px;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;color:#8B5CF6;text-transform:uppercase;">Таныг урьж байна</p>
          <h1 style="margin:0 0 6px;font-size:24px;line-height:1.25;color:#1F1D1A;">${title}</h1>
          <p style="margin:0 0 20px;font-size:15px;color:#6D6762;">Эрхэм ${name} танд</p>
          ${dateLine}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 8px;">
            <tr><td style="border-radius:10px;background:#8B5CF6;">
              <a href="${guestUrl}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:10px;">Урилга харах</a>
            </td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#9E9891;">Хэрэв товч ажиллахгүй бол доорх холбоосыг хуулна уу:</p>
          <p style="margin:4px 0 0;font-size:12px;color:#8B5CF6;word-break:break-all;">${escapeHtml(guestUrl)}</p>
        </td></tr>
        <tr><td style="padding:16px;text-align:center;border-top:1px solid #EEEAE5;">
          <p style="margin:0;font-size:11px;color:#9E9891;">invites.mn дээр үүсгэв</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html };
}
