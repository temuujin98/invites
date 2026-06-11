import { ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backHref?: string;
}

export function PageHeader({ title, subtitle, actions, backHref }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4">
      <div className="flex items-start gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-(--radius-ctrl) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
            aria-label="Буцах"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 13L5 8l5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-semibold text-(--color-text)">{title}</h1>
          {subtitle && (
            <p className="text-xs text-(--color-text-muted)">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
