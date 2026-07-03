import type { DeliveryStatus } from "@/types/invite";

// DB-accurate guest / rsvp / delivery types (mirror supabase migration 0005).

// guests.rsvp_status — includes the default "pending" (no response yet).
export type GuestRsvpStatus = "pending" | "accepted" | "declined" | "maybe";

// rsvps.attending — a guest who responded chose one of these.
export type RsvpAttending = "accepted" | "declined" | "maybe";

export interface Guest {
  id: string;
  inviteId: string;
  name: string;
  email?: string;
  phone?: string;
  token: string;
  rsvpStatus: GuestRsvpStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  createdAt: string;
}

export interface RsvpRow {
  id: string;
  inviteId: string;
  guestId?: string;            // null = anonymous public RSVP
  name: string;
  attending: RsvpAttending;
  guestCount: number;
  note?: string;
  createdAt: string;
}

export interface DeliveryLog {
  id: string;
  guestId: string;
  inviteId: string;
  provider: string;
  status: "sending" | "sent" | "failed";
  providerMessageId?: string;
  errorMessage?: string;
  sentAt: string;
}
