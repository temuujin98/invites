"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--color-bg) px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-danger-soft) text-(--color-danger)">
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 6.5v4M10 13.5h.01M10 2l8 14H2l8-14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-(--color-text)">Алдаа гарлаа</p>
        <p className="mt-1 text-xs text-(--color-text-muted)">
          Хуудсыг ачаалахад алдаа гарлаа. Дахин оролдоно уу.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-(--radius-ctrl) bg-(--color-accent) px-5 text-xs font-medium text-white transition-colors hover:bg-(--color-accent-hover)"
        >
          Дахин ачаалах
        </button>
        <Link
          href="/"
          className="inline-flex h-9 items-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-5 text-xs font-medium text-(--color-text) transition-colors hover:bg-(--color-surface-soft)"
        >
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
