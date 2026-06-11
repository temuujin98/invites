"use client";

import { useEffect, useRef, useState } from "react";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          role="menu"
          className={[
            "absolute top-full mt-1 z-50 min-w-40 py-1 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-lg)",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          {items.map((item, i) => (
            <button
              key={i}
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={[
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors duration-100 cursor-pointer",
                item.danger
                  ? "text-(--color-danger) hover:bg-(--color-danger-soft)"
                  : "text-(--color-text) hover:bg-(--color-surface-soft)",
              ].join(" ")}
            >
              {item.icon && (
                <span className="shrink-0 opacity-70">{item.icon}</span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
