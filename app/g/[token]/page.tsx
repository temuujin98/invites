import type { Metadata } from "next";
import { getAdminClient } from "@/lib/supabase/admin";
import type { PublicInviteRow, GuestContext } from "@/components/invite/PublicInviteView";
import { GuestInviteClient } from "./GuestInviteClient";

interface Props {
  params: Promise<{ token: string }>;
}

// Resolve a guest token → its invite via service-role (guests are owner-only in
// RLS, so anon can't read them). We re-check the public gates in code and expose
// only the same safe fields /i/[shareSlug] does.
async function resolve(token: string): Promise<{ invite: PublicInviteRow; guest: GuestContext } | null> {
  let admin: ReturnType<typeof getAdminClient>;
  try {
    admin = getAdminClient();
  } catch {
    return null;
  }

  const { data: guest } = await admin
    .from("guests")
    .select("id, name, invite_id")
    .eq("token", token)
    .maybeSingle();
  if (!guest) return null;

  const { data: invite } = await admin
    .from("invites")
    .select(`
      id, title, share_slug, status, is_public, content,
      event_date, event_time, event_location,
      templates ( id, slug, name, category_id, status, sections, theme )
    `)
    .eq("id", guest.invite_id as string)
    .maybeSingle();
  if (!invite) return null;

  const tplRaw = invite.templates;
  const tpl = Array.isArray(tplRaw) ? (tplRaw[0] ?? null) : (tplRaw ?? null);

  return {
    invite: { ...invite, templates: tpl } as PublicInviteRow,
    guest: { id: guest.id as string, name: guest.name as string, token },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const resolved = await resolve(token);
  if (!resolved || !resolved.invite.is_public || resolved.invite.status !== "published") {
    return { title: "Урилга олдсонгүй — invites.mn", robots: { index: false } };
  }
  return {
    title: `${resolved.invite.title} — invites.mn`,
    // Per-guest links are personalized — never index them.
    robots: { index: false, follow: false },
  };
}

export default async function GuestInvitePage({ params }: Props) {
  const { token } = await params;
  const resolved = await resolve(token);

  // Re-implement the public gates that RLS would enforce for the anon path.
  // Archived invites get the dedicated "archived" copy; draft/private/not-found
  // fall through to the generic invalid state.
  if (!resolved || !resolved.invite.is_public) {
    return <GuestInviteClient invite={null} />;
  }
  if (resolved.invite.status === "archived") {
    return <GuestInviteClient invite={null} archived />;
  }
  if (resolved.invite.status !== "published") {
    return <GuestInviteClient invite={null} />;
  }

  return <GuestInviteClient invite={resolved.invite} guest={resolved.guest} />;
}
