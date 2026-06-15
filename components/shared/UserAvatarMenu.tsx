"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/shared/LogoutButton";

interface UserAvatarMenuProps {
  displayName: string;
  email: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function UserAvatarMenu({ displayName, email }: UserAvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const initials = getInitials(displayName);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Хэрэглэгчийн цэс"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-accent) text-[13px] font-bold text-white ring-2 ring-transparent transition-all duration-150 hover:ring-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 min-w-52 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-lg"
          role="menu"
        >
          {/* Identity */}
          <div className="border-b border-(--color-border) px-4 py-3">
            <p className="text-[13px] font-semibold text-(--color-text) leading-tight truncate">
              {displayName}
            </p>
            <p className="mt-0.5 text-[12px] text-(--color-text-muted) truncate">{email}</p>
          </div>

          {/* Nav links */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Хяналтын самбар
            </Link>
            <Link
              href="/templates"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="6" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="9" y="1" width="5" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="9" y="7" width="5" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="1" y="11" width="6" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Загварууд
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-(--color-border) py-1">
            <LogoutButton
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-(--color-danger) hover:bg-(--color-surface-soft) transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M5.5 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M10 10l3-2.5L10 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="13" y1="7.5" x2="6" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Гарах
            </LogoutButton>
          </div>
        </div>
      )}
    </div>
  );
}
