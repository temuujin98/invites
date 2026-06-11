import type { InviteStatus } from "@/types/invite";

interface StatusBadgeProps {
  status: InviteStatus;
}

const CONFIG: Record<
  InviteStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Ноорог",
    className: "bg-(--color-surface-soft) text-(--color-text-secondary) border-(--color-border)",
  },
  published: {
    label: "Нийтлэгдсэн",
    className: "bg-(--color-success-soft) text-(--color-success) border-transparent",
  },
  archived: {
    label: "Архивлагдсан",
    className: "bg-(--color-surface-soft) text-(--color-text-muted) border-transparent",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={[
        "inline-flex items-center rounded-(--radius-ctrl) border px-2 py-0.5 text-xs font-medium",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
