"use client";

import { PublicInviteView, type PublicInviteRow, type GuestContext } from "@/components/invite/PublicInviteView";

// Thin client wrapper: the server component resolved the token and passes data
// as props (no client fetch). Only needed because PublicInviteView / the section
// renderer are client components.
export function GuestInviteClient({
  invite,
  guest,
  archived,
}: {
  invite: PublicInviteRow | null;
  guest?: GuestContext;
  archived?: boolean;
}) {
  return <PublicInviteView invite={invite} guest={guest} archived={archived} />;
}
