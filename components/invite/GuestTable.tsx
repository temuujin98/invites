"use client";

import type { Guest } from "@/types/guest";
import { RSVPBadge } from "@/components/invite/RSVPBadge";
import { DeliveryStatusBadge } from "@/components/invite/DeliveryStatusBadge";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="3" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="13" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface GuestTableProps {
  guests: Guest[];
  onEdit: (g: Guest) => void;
  onDelete: (g: Guest) => void;
  onCopyLink: (g: Guest) => void;
  onSend: (g: Guest) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GuestTable({ guests, onEdit, onDelete, onCopyLink, onSend }: GuestTableProps) {
  return (
    <div className="overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--color-border)">
            <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">
              Нэр
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">
              И-мэйл / Утас
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">
              RSVP
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">
              Хүргэлт
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-(--color-text-muted)">
              Үйлдэл
            </th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, i) => {
            const menuItems = [
              {
                label: "Засах",
                onClick: () => onEdit(guest),
              },
              {
                label: "Холбоос хуулах",
                onClick: () => onCopyLink(guest),
              },
              ...(guest.email
                ? [{ label: "Илгээх", onClick: () => onSend(guest) }]
                : []),
              {
                label: "Устгах",
                danger: true,
                onClick: () => onDelete(guest),
              },
            ];

            return (
              <tr
                key={guest.id}
                className={[
                  "border-b border-(--color-border) transition-colors hover:bg-(--color-surface-soft)",
                  i === guests.length - 1 ? "border-b-0" : "",
                ].join(" ")}
              >
                <td className="px-4 py-3 font-medium text-(--color-text) whitespace-nowrap">
                  {guest.name}
                </td>
                <td className="px-4 py-3 text-(--color-text-secondary) text-xs">
                  {guest.email && (
                    <span className="block truncate max-w-[160px]">{guest.email}</span>
                  )}
                  {guest.phone && (
                    <span className="block text-(--color-text-muted)">{guest.phone}</span>
                  )}
                  {!guest.email && !guest.phone && (
                    <span className="text-(--color-text-muted)">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <RSVPBadge status={guest.rsvpStatus} />
                </td>
                <td className="px-4 py-3">
                  <DeliveryStatusBadge status={guest.deliveryStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        aria-label="Үйлдэл"
                        className="flex h-8 w-8 items-center justify-center rounded-(--radius-ctrl) text-(--color-text-muted) hover:bg-(--color-surface-soft) hover:text-(--color-text) transition-colors"
                      >
                        <IconDots />
                      </button>
                    }
                    items={menuItems}
                    align="right"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
