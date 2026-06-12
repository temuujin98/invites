import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_SLUGS } from "@/lib/constants";
import { z } from "zod";

const Schema = z.object({
  slug: z.string().min(3).max(60).regex(/^[a-z0-9-]+$/),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "INVALID_PAYLOAD", message: "Invalid slug" }, { status: 400 });
  }

  const { slug } = parsed.data;

  if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
    return NextResponse.json({ ok: true, data: { available: false } });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("invites")
    .select("id")
    .eq("share_slug", slug)
    .maybeSingle();

  return NextResponse.json({ ok: true, data: { available: data === null } });
}
