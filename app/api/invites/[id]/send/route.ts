import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { sendGuestInvite } from "@/lib/email/resend";
import { buildGuestInviteEmail } from "@/lib/email/templates/guest-invite";
import { sendSchema } from "@/lib/validation/guest";
import { APP_URL } from "@/lib/constants";
import { formatDate } from "@/lib/format";

const BATCH_CAP = 100;
const SEND_DELAY_MS = 200;

// Per-(user, invite) cooldown so an owner can't spam sends / run up Resend cost.
const COOLDOWN_MS = 30 * 1000;
const lastSend = new Map<string, number>();

function onCooldown(key: string): boolean {
  const now = Date.now();
  const last = lastSend.get(key);
  if (last && now - last < COOLDOWN_MS) return true;
  lastSend.set(key, now);
  return false;
}

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface GuestRow {
  id: string;
  name: string;
  email: string | null;
  token: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: inviteId } = await params;

  // 1. Auth (session)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ ok: false, code: "UNAUTHORIZED", message: "Нэвтрэх шаардлагатай" }, 401);

  // Rate limit: one send batch per (user, invite) per cooldown window.
  if (onCooldown(`${user.id}:${inviteId}`)) {
    return json(
      { ok: false, code: "RATE_LIMITED", message: "Түр хүлээгээд дахин илгээнэ үү." },
      429,
    );
  }

  // 2. Owner + published (owner RLS via session client)
  const { data: invite } = await supabase
    .from("invites")
    .select("id, title, status, event_date, user_id")
    .eq("id", inviteId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!invite) return json({ ok: false, code: "FORBIDDEN", message: "Энэ урилга танийх биш байна" }, 403);
  if (invite.status !== "published")
    return json({ ok: false, code: "NOT_PUBLISHED", message: "Урилга нийтлэгдээгүй байна" }, 403);

  // Parse body (optional guestId = single resend; absent = batch)
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    /* empty body = batch */
  }
  const parsed = sendSchema.safeParse(body ?? {});
  if (!parsed.success)
    return json({ ok: false, code: "INVALID_PAYLOAD", message: "Буруу өгөгдөл" }, 400);
  const { guestId } = parsed.data;

  let admin: ReturnType<typeof getAdminClient>;
  try {
    admin = getAdminClient();
  } catch {
    return json({ ok: false, code: "SERVER_CONFIG_ERROR", message: "Серверийн тохиргооны алдаа" }, 500);
  }

  // 3. Resolve target guests (service-role)
  let targets: GuestRow[] = [];
  if (guestId) {
    const { data: g } = await admin
      .from("guests")
      .select("id, name, email, token, invite_id")
      .eq("id", guestId)
      .maybeSingle();
    if (!g || g.invite_id !== inviteId)
      return json({ ok: false, code: "FORBIDDEN", message: "Зочин олдсонгүй" }, 403);
    if (!g.email) return json({ ok: false, code: "NO_EMAIL", message: "Зочинд и-мэйл алга" }, 422);
    targets = [{ id: g.id as string, name: g.name as string, email: g.email as string, token: g.token as string }];
  } else {
    const { data: gs } = await admin
      .from("guests")
      .select("id, name, email, token")
      .eq("invite_id", inviteId)
      .in("delivery_status", ["not_sent", "failed"])
      .not("email", "is", null)
      .limit(BATCH_CAP + 1);
    targets = (gs ?? []).map((g) => ({
      id: g.id as string,
      name: g.name as string,
      email: g.email as string,
      token: g.token as string,
    }));
  }

  const hasMore = targets.length > BATCH_CAP;
  if (hasMore) targets = targets.slice(0, BATCH_CAP);

  if (targets.length === 0)
    return json({ ok: true, data: { sent: 0, failed: 0, hasMore: false } }, 200);

  const eventDate = invite.event_date ? formatDate(invite.event_date as string) : null;
  let sent = 0;
  let failed = 0;
  const results: { guestId: string; status: "sent" | "failed" }[] = [];

  for (const g of targets) {
    // Mark sending first so a crash leaves a diagnosable state.
    await admin.from("guests").update({ delivery_status: "sending" }).eq("id", g.id);
    const guestUrl = `${APP_URL}/g/${g.token}`;
    const { subject, html } = buildGuestInviteEmail({
      guestName: g.name,
      inviteTitle: invite.title as string,
      eventDate,
      guestUrl,
    });

    try {
      const { id: messageId } = await sendGuestInvite({ to: g.email!, subject, html });
      await admin.from("guests").update({ delivery_status: "sent" }).eq("id", g.id);
      await admin.from("delivery_logs").insert({
        guest_id: g.id,
        invite_id: inviteId,
        provider: "resend",
        status: "sent",
        provider_message_id: messageId,
      });
      sent++;
      results.push({ guestId: g.id, status: "sent" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "send failed";
      await admin.from("guests").update({ delivery_status: "failed" }).eq("id", g.id);
      await admin.from("delivery_logs").insert({
        guest_id: g.id,
        invite_id: inviteId,
        provider: "resend",
        status: "failed",
        error_message: message.slice(0, 500),
      });
      failed++;
      results.push({ guestId: g.id, status: "failed" });
    }

    if (targets.length > 1) await sleep(SEND_DELAY_MS);
  }

  return json({ ok: true, data: { sent, failed, hasMore, results } }, 200);
}
