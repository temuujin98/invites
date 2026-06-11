import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-surface-soft) text-(--color-text-muted)">
        {icon ?? (
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="4"
              width="18"
              height="18"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="3 2"
            />
            <path
              d="M9 13h8M13 9v8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-(--color-text)">{title}</p>
      {description && (
        <p className="max-w-xs text-xs text-(--color-text-muted)">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
