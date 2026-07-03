import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Guest } from "@/types/guest";
import type { GuestRsvpStatus } from "@/types/guest";
import type { DeliveryStatus } from "@/types/invite";
import { GuestsClient } from "./_GuestsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  // Owner-only: the invite must belong to this user (owner RLS + explicit check).
  const { data: invite } = await supabase
    .from("invites")
    .select("id, title, share_slug, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!invite) notFound();

  const { data: guestRows } = await supabase
    .from("guests")
    .select("id, invite_id, name, email, phone, token, rsvp_status, delivery_status, notes, created_at")
    .eq("invite_id", id)
    .order("created_at", { ascending: true });

  const guests: Guest[] = (guestRows ?? []).map((g) => ({
    id: g.id as string,
    inviteId: g.invite_id as string,
    name: g.name as string,
    email: (g.email as string | null) ?? undefined,
    phone: (g.phone as string | null) ?? undefined,
    token: g.token as string,
    rsvpStatus: g.rsvp_status as GuestRsvpStatus,
    deliveryStatus: g.delivery_status as DeliveryStatus,
    notes: (g.notes as string | null) ?? undefined,
    createdAt: g.created_at as string,
  }));

  return (
    <GuestsClient
      inviteId={invite.id as string}
      inviteTitle={invite.title as string}
      shareSlug={(invite.share_slug as string | null) ?? ""}
      invitePublished={invite.status === "published"}
      initialGuests={guests}
    />
  );
}
