import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";
import { PublicInviteClient } from "./PublicInviteClient";

interface Props {
  params: Promise<{ shareSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareSlug } = await params;
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("invites")
    .select(`
      id,
      title,
      status,
      is_public,
      event_date,
      templates ( thumbnail_url )
    `)
    .eq("share_slug", shareSlug)
    .single();

  if (!invite || !invite.is_public || invite.status === "archived") {
    return { title: "Урилга олдсонгүй — invites.mn" };
  }

  const title = `${invite.title} — invites.mn`;
  const description = invite.event_date
    ? `${(invite.event_date as string).replace(/-/g, ".")} · invites.mn дээр үүсгэсэн урилга`
    : "invites.mn дээр үүсгэсэн урилга";

  // D12: use template thumbnail as og:image (full rendered export is Phase 9)
  const thumbnail =
    (invite.templates as { thumbnail_url?: string } | null)?.thumbnail_url ?? null;
  const ogImage = thumbnail
    ? thumbnail.startsWith("http")
      ? thumbnail
      : `${APP_URL}${thumbnail}`
    : `${APP_URL}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/i/${shareSlug}`,
      siteName: "invites.mn",
      images: [{ url: ogImage, width: 1080, height: 1920, alt: invite.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublicInvitePage({ params }: Props) {
  const { shareSlug } = await params;
  return <PublicInviteClient shareSlug={shareSlug} />;
}
