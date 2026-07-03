import "server-only";
import { Resend } from "resend";

// Lazy factory — evaluated at call time so a missing/placeholder RESEND_API_KEY
// surfaces as a catchable runtime error, not a module-init crash.
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.length < 10 || key.includes("your_") || key.includes("placeholder")) {
    throw new Error("RESEND_API_KEY missing or placeholder");
  }
  return new Resend(key);
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendGuestInvite({ to, subject, html }: SendArgs): Promise<{ id: string }> {
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO;
  if (!from) throw new Error("EMAIL_FROM not configured");

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
  if (error || !data) {
    throw new Error(error?.message ?? "Resend send failed");
  }
  return { id: data.id };
}
