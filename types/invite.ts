export type InviteStatus = "draft" | "published" | "archived";
export type RSVPStatus = "attending" | "declined" | "maybe";
export type DeliveryStatus = "not_sent" | "sending" | "sent" | "failed";

export interface Invite {
  id: string;
  templateId: string;
  templateSlug: string;
  userId: string;
  title: string;
  shareSlug: string;
  status: InviteStatus;
  isPublic: boolean;
  eventDate?: string;         // ISO string
  eventTime?: string;         // "HH:MM"
  eventLocation?: string;
  eventLocationUrl?: string;
  rsvpCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPEntry {
  id: string;
  inviteId: string;
  guestId?: string;
  name: string;
  status: RSVPStatus;
  partySize: number;
  note?: string;
  createdAt: string;
}

export interface Guest {
  id: string;
  inviteId: string;
  name: string;
  email?: string;
  phone?: string;
  token: string;
  deliveryStatus: DeliveryStatus;
  rsvpStatus?: RSVPStatus;
  createdAt: string;
}
