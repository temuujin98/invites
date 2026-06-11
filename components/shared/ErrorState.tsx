"use client";

import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Алдаа гарлаа",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-danger-soft) text-(--color-danger)">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M11 7v5M11 14.5v.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-(--color-text)">{title}</p>
      {message && (
        <p className="max-w-xs text-center text-xs text-(--color-text-muted)">
          {message}
        </p>
      )}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Дахин оролдох
        </Button>
      )}
    </div>
  );
}
