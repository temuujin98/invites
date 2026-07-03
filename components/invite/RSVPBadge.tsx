import type { RSVPStatus } from "@/types/invite";
import type { GuestRsvpStatus } from "@/types/guest";

// Accepts both the guest status enum (pending/accepted/declined/maybe) and the
// legacy RSVPStatus (attending = accepted).
type BadgeStatus = GuestRsvpStatus | RSVPStatus;

interface RSVPBadgeProps {
  status: BadgeStatus;
}

const CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Хүлээгдэж буй",
    className: "bg-(--color-surface-soft) text-(--color-text-secondary)",
  },
  accepted: {
    label: "Ирнэ",
    className: "bg-(--color-success-soft) text-(--color-success)",
  },
  attending: {
    label: "Ирнэ",
    className: "bg-(--color-success-soft) text-(--color-success)",
  },
  declined: {
    label: "Ирэхгүй",
    className: "bg-(--color-danger-soft) text-(--color-danger)",
  },
  maybe: {
    label: "Магадгүй",
    className: "bg-(--color-accent-soft) text-(--color-accent)",
  },
};

export function RSVPBadge({ status }: RSVPBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.pending;
  return (
    <span
      className={[
        "inline-flex items-center rounded-(--radius-ctrl) px-2 py-0.5 text-xs font-medium",
        cfg.className,
      ].join(" ")}
    >
      {cfg.label}
    </span>
  );
}
