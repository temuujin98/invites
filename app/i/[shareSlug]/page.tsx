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

  // Only real columns from invites table (docs/05); thumbnail resolved via assets in Phase 9
  const { data: invite } = await supabase
    .from("invites")
    .select("id, title, status, is_public, event_date")
    .eq("share_slug", shareSlug)
    .single();

  if (!invite || !invite.is_public || invite.status === "archived") {
    return { title: "Урилга олдсонгүй — invites.mn" };
  }

  const title = `${invite.title} — invites.mn`;
  const description = invite.event_date
    ? `${(invite.event_date as string).replace(/-/g, ".")} · invites.mn дээр үүсгэсэн урилга`
    : "invites.mn дээр үүсгэсэн урилга";

  const ogImage = `${APP_URL}/og-default.png`;

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
