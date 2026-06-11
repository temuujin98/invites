"use client";

import { ReactNode } from "react";

interface TopbarProps {
  title?: string;
  actions?: ReactNode;
  onMenuClick?: () => void;
}

export function Topbar({ title, actions, onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-(--color-border) bg-(--color-surface) px-4">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            aria-label="Цэс нээх"
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded-(--radius-ctrl) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3 5h12M3 9h12M3 13h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        {title && (
          <h1 className="text-sm font-semibold text-(--color-text)">{title}</h1>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
