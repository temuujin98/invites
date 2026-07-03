"use client";

import type { Guest } from "@/types/guest";
import { RSVPBadge } from "@/components/invite/RSVPBadge";
import { DeliveryStatusBadge } from "@/components/invite/DeliveryStatusBadge";
import { Button } from "@/components/ui/Button";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.5 7.5a3 3 0 0 0 4.24 0l1.5-1.5a3 3 0 0 0-4.24-4.24L6 2.77" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8.5 6.5a3 3 0 0 0-4.24 0l-1.5 1.5a3 3 0 0 0 4.24 4.24L8 11.23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12 2L2 6.5l4 1.5 1.5 4L12 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M11 4l-.8 7.2a1 1 0 0 1-1 .8H4.8a1 1 0 0 1-1-.8L3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface GuestCardProps {
  guest: Guest;
  onEdit: (g: Guest) => void;
  onDelete: (g: Guest) => void;
  onCopyLink: (g: Guest) => void;
  onSend: (g: Guest) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GuestCard({ guest, onEdit, onDelete, onCopyLink, onSend }: GuestCardProps) {
  return (
    <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-4 py-3 flex flex-col gap-3">
      {/* Name + contact */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-(--color-text)">{guest.name}</p>
        {guest.email && (
          <p className="text-xs text-(--color-text-muted) truncate">{guest.email}</p>
        )}
        {guest.phone && (
          <p className="text-xs text-(--color-text-muted)">{guest.phone}</p>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <RSVPBadge status={guest.rsvpStatus} />
        <DeliveryStatusBadge status={guest.deliveryStatus} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-t border-(--color-border) pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(guest)}
          aria-label="Засах"
          className="gap-1.5"
        >
          <IconEdit />
          Засах
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopyLink(guest)}
          aria-label="Холбоос хуулах"
          className="gap-1.5"
        >
          <IconLink />
          Холбоос
        </Button>
        {guest.email && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSend(guest)}
            aria-label="Имэйл илгээх"
            className="gap-1.5"
          >
            <IconSend />
            Илгээх
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(guest)}
          aria-label="Устгах"
          className="ml-auto text-(--color-danger) hover:bg-(--color-danger-soft)"
        >
          <IconTrash />
        </Button>
      </div>
    </div>
  );
}
