import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch invite — public RLS allows published + archived + is_public.
  // event_time / event_location are denormalized columns (section model).
  const { data: invite, error } = await supabase
    .from("invites")
    .select("id, title, status, event_date, event_time, event_location, share_slug, is_public")
    .eq("share_slug", slug)
    .single();

  if (error || !invite) {
    return new NextResponse("Урилга олдсонгүй", { status: 404 });
  }
  if (!invite.is_public || invite.status === "archived") {
    return new NextResponse("Урилга хүчингүй болсон", { status: 410 });
  }
  if (invite.status !== "published") {
    return new NextResponse("Урилга олдсонгүй", { status: 404 });
  }

  const eventTime: string = invite.event_time ?? "00:00";
  const location: string = invite.event_location ?? "";

  // Build DTSTART / DTEND
  let dtStart = "DTSTART;VALUE=DATE:" + formatICSDate(invite.event_date);
  let dtEnd   = "DTEND;VALUE=DATE:"   + formatICSDate(invite.event_date);

  if (invite.event_date && eventTime) {
    const [hStr, mStr] = eventTime.split(":");
    const h = parseInt(hStr ?? "0", 10);
    const m = parseInt(mStr ?? "0", 10);
    const [y, mo, d] = (invite.event_date as string).split("-").map(Number);
    const start = new Date(Date.UTC(y, mo - 1, d, h, m));
    const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    dtStart = "DTSTART:" + toICSDateTime(start);
    dtEnd   = "DTEND:"   + toICSDateTime(end);
  }

  const shareUrl = `${APP_URL}/i/${invite.share_slug}`;
  const uid = `${invite.id}@invites.mn`;
  const now = toICSDateTime(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//invites.mn//ICS//MN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeICS(invite.title)}`,
    ...(location ? [`LOCATION:${escapeICS(location)}`] : []),
    `URL:${shareUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(lines, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="invite-${slug}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}

function toICSDateTime(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
}

function formatICSDate(dateStr: string | null): string {
  if (!dateStr) return "00000101";
  return dateStr.replace(/-/g, "");
}

function escapeICS(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
