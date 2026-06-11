type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent" | "muted";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-(--color-surface-soft) text-(--color-text)",
  success:
    "bg-(--color-success-soft) text-(--color-success)",
  warning:
    "bg-(--color-warning-soft) text-(--color-warning)",
  danger:
    "bg-(--color-danger-soft) text-(--color-danger)",
  accent:
    "bg-(--color-accent-soft) text-(--color-accent)",
  muted:
    "bg-(--color-surface-soft) text-(--color-text-muted)",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
};

export function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
