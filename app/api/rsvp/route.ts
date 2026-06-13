import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";

// Simple in-memory IP rate limit: max 5 submissions per IP per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_PER_WINDOW) return true;
  entry.count += 1;
  return false;
}

const RsvpSchema = z.object({
  inviteId: z.string().uuid(),
  name: z.string().min(1).max(100).trim(),
  attending: z.enum(["accepted", "declined", "maybe"]),
  guestCount: z.number().int().min(1).max(20).optional().default(1),
  note: z.string().max(500).optional(),
});

function ip(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Rate limit
  const clientIp = ip(req);
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED", message: "Хэт олон хүсэлт илгээлээ. Түр хүлээнэ үү." },
      { status: 429 },
    );
  }

  // Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_JSON", message: "Буруу өгөгдлийн формат." },
      { status: 400 },
    );
  }

  const parsed = RsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "INVALID_PAYLOAD", message: parsed.error.issues[0]?.message ?? "Буруу өгөгдөл." },
      { status: 400 },
    );
  }

  const { inviteId, name, attending, guestCount, note } = parsed.data;

  // Instantiate admin client — throws if env vars are missing or not a real JWT
  let admin: ReturnType<typeof getAdminClient>;
  try {
    admin = getAdminClient();
  } catch (err) {
    console.error("[rsvp] admin client init failed:", err);
    return NextResponse.json(
      { ok: false, code: "SERVER_CONFIG_ERROR", message: "Серверийн тохиргооны алдаа." },
      { status: 500 },
    );
  }

  // Verify invite exists, is published, and is public
  const { data: invite, error: inviteErr } = await admin
    .from("invites")
    .select("id, status, is_public")
    .eq("id", inviteId)
    .single();

  if (inviteErr) {
    const isAuthError =
      inviteErr.message?.includes("JWT") ||
      inviteErr.message?.includes("Invalid API") ||
      inviteErr.code === "PGRST301";
    console.error("[rsvp] invite lookup error:", inviteErr.message, inviteErr.code);
    if (isAuthError) {
      return NextResponse.json(
        { ok: false, code: "SERVER_CONFIG_ERROR", message: "Серверийн тохиргооны алдаа." },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { ok: false, code: "NOT_FOUND", message: "Урилга олдсонгүй." },
      { status: 404 },
    );
  }

  if (!invite) {
    return NextResponse.json(
      { ok: false, code: "NOT_FOUND", message: "Урилга олдсонгүй." },
      { status: 404 },
    );
  }

  if (invite.status !== "published" || !invite.is_public) {
    return NextResponse.json(
      { ok: false, code: "NOT_PUBLISHED", message: "Урилга нийтлэгдээгүй байна." },
      { status: 403 },
    );
  }

  // Insert via service-role (no RLS INSERT policy on rsvps by design)
  const { data: rsvp, error: insertErr } = await admin
    .from("rsvps")
    .insert({
      invite_id: inviteId,
      name,
      attending,
      guest_count: attending === "accepted" ? guestCount : 1,
      note: note ?? null,
    })
    .select("id")
    .single();

  if (insertErr || !rsvp) {
    console.error("[rsvp] insert error:", insertErr);
    return NextResponse.json(
      { ok: false, code: "INSERT_FAILED", message: "RSVP хадгалахад алдаа гарлаа." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: { id: rsvp.id } }, { status: 201 });
}
