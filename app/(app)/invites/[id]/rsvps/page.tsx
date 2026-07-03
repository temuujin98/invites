import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { RsvpAttending } from "@/types/guest";
import { RsvpsClient, type RsvpResponse } from "./_RsvpsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RsvpsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  // Owner-only: the invite must belong to this user.
  const { data: invite } = await supabase
    .from("invites")
    .select("id, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!invite) notFound();

  // Owner RLS allows reading rsvps for owned invites.
  const { data: rows } = await supabase
    .from("rsvps")
    .select("id, name, attending, guest_count, note, guest_id, created_at")
    .eq("invite_id", id)
    .order("created_at", { ascending: false });

  const responses: RsvpResponse[] = (rows ?? []).map((r) => ({
    id: r.id as string,
    name: r.name as string,
    attending: r.attending as RsvpAttending,
    guestCount: Number(r.guest_count ?? 1),
    note: (r.note as string | null) ?? undefined,
    isGuest: Boolean(r.guest_id),
    createdAt: r.created_at as string,
  }));

  return (
    <RsvpsClient
      inviteId={invite.id as string}
      inviteTitle={invite.title as string}
      responses={responses}
    />
  );
}
