import type { RSVPStatus } from "@/types/invite";

interface RSVPBadgeProps {
  status: RSVPStatus;
}

const CONFIG: Record<RSVPStatus, { label: string; className: string }> = {
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
  const { label, className } = CONFIG[status];
  return (
    <span
      className={[
        "inline-flex items-center rounded-(--radius-ctrl) px-2 py-0.5 text-xs font-medium",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
