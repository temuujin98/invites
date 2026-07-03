import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { loadOgFonts } from "@/lib/og/fonts";
import { InviteOgCard, ogDimensions, type OgSize, type OgCardData } from "@/lib/og/InviteOgCard";
import { DEFAULT_THEME, type InviteTheme, type SectionConfig } from "@/types/section";
import { formatDate, formatWeekdayLong } from "@/lib/format";

// Node runtime: we upload to Supabase Storage with the service-role client
// (server-only) and pre-fetch the cover image — neither fits the edge runtime.
export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ shareSlug: string }>;
}

function parseSize(raw: string | null): OgSize {
  return raw === "story" ? "story" : "landscape";
}

// Locate the cover section's image from the invite content. Sections carry the
// admin config (incl. the cover section's id); content is keyed by that id.
function findCoverImage(
  sections: unknown,
  content: Record<string, unknown> | null,
): string | null {
  if (!content || !Array.isArray(sections)) return null;
  const cover = (sections as SectionConfig[]).find((s) => s?.type === "cover");
  if (!cover) return null;
  const sectionContent = content[cover.id];
  if (!sectionContent || typeof sectionContent !== "object") return null;
  const img = (sectionContent as Record<string, unknown>).coverImage;
  return typeof img === "string" && img ? img : null;
}

// Pre-fetch the cover into a data URI. satori fetches <img src> itself, but a
// remote fetch inside the render is a CORS/timeout risk; inlining is reliable.
async function toDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: Request, { params }: Ctx) {
  const { shareSlug } = await params;
  const url = new URL(req.url);
  const size = parseSize(url.searchParams.get("size"));
  const download = url.searchParams.get("download") === "1";

  // ── Fetch invite (public read: published/archived + is_public via RLS) ──────
  const supabase = await createClient();
  const { data: invite } = await supabase
    .from("invites")
    .select(`
      id, title, status, is_public, event_date, event_location,
      templates ( sections, theme )
    `)
    .eq("share_slug", shareSlug)
    .single();

  if (!invite || !invite.is_public || invite.status !== "published") {
    return new Response("Not found", { status: 404 });
  }

  // ── Resolve theme + cover ───────────────────────────────────────────────────
  const tplRaw = invite.templates;
  const tpl = Array.isArray(tplRaw) ? tplRaw[0] : tplRaw;
  const theme: InviteTheme =
    tpl?.theme && typeof tpl.theme === "object" && !Array.isArray(tpl.theme)
      ? (tpl.theme as InviteTheme)
      : DEFAULT_THEME;

  const coverUrl = findCoverImage(
    tpl?.sections,
    (invite as { content?: Record<string, unknown> | null }).content ?? null,
  );
  const coverImage = coverUrl ? await toDataUri(coverUrl) : null;

  const dateLabel = invite.event_date
    ? `${formatWeekdayLong(invite.event_date)} · ${formatDate(invite.event_date)}`
    : null;

  const data: OgCardData = {
    title: invite.title,
    dateLabel,
    venue: invite.event_location ?? null,
    coverImage,
    theme,
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const [{ width, height }, fonts] = [ogDimensions(size), await loadOgFonts()];

  const image = new ImageResponse(<InviteOgCard data={data} size={size} />, {
    width,
    height,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    })),
  });

  const png = Buffer.from(await image.arrayBuffer());

  // ── Cache to storage (best-effort; never block the response on it) ──────────
  // Path is size-scoped so landscape/story don't clobber each other. We store
  // the landscape variant's URL on the invite row for OG meta reuse.
  const objectPath = `${invite.id}/${size}.png`;
  try {
    const admin = getAdminClient();
    await admin.storage.from("rendered-invites").upload(objectPath, png, {
      contentType: "image/png",
      upsert: true,
    });
    if (size === "landscape") {
      const { data: pub } = admin.storage.from("rendered-invites").getPublicUrl(objectPath);
      if (pub?.publicUrl) {
        await admin.from("invites").update({ rendered_image_url: pub.publicUrl }).eq("id", invite.id);
      }
    }
  } catch {
    // Storage/env failure must not break social unfurls — serve the PNG anyway.
  }

  const headers = new Headers();
  headers.set("Content-Type", "image/png");
  headers.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=86400");
  if (download) {
    headers.set("Content-Disposition", `attachment; filename="${shareSlug}-${size}.png"`);
  }
  return new Response(png, { status: 200, headers });
}
