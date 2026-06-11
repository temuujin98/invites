import type { DeliveryStatus } from "@/types/invite";

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
}

const CONFIG: Record<
  DeliveryStatus,
  { label: string; badgeClass: string; dotClass?: string }
> = {
  not_sent: {
    label: "Илгээгдээгүй",
    badgeClass: "bg-(--color-surface-soft) text-(--color-text-muted)",
  },
  sending: {
    label: "Илгээж байна",
    badgeClass: "bg-(--color-accent-soft) text-(--color-accent)",
    dotClass: "bg-(--color-accent) animate-pulse",
  },
  sent: {
    label: "Илгээсэн",
    badgeClass: "bg-(--color-success-soft) text-(--color-success)",
  },
  failed: {
    label: "Амжилтгүй",
    badgeClass: "bg-(--color-danger-soft) text-(--color-danger)",
  },
};

export function DeliveryStatusBadge({ status }: DeliveryStatusBadgeProps) {
  const { label, badgeClass, dotClass } = CONFIG[status];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-(--radius-ctrl) px-2 py-0.5 text-xs font-medium",
        badgeClass,
      ].join(" ")}
    >
      {dotClass && (
        <span
          className={["h-1.5 w-1.5 rounded-full shrink-0", dotClass].join(" ")}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
