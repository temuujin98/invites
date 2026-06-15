"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  className?: string;
}

export function FilterSelect({ value, onChange, options, className = "" }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function reposition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    reposition();

    function handleOutside(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  const panel = open && typeof document !== "undefined"
    ? createPortal(
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            minWidth: pos.width,
            zIndex: 9999,
          }}
          className="py-1 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-lg"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={[
                "w-full px-3 py-1.5 text-left text-xs transition-colors duration-100 cursor-pointer",
                opt.value === value
                  ? "text-(--color-accent) bg-(--color-accent-soft) font-medium"
                  : "text-(--color-text) hover:bg-(--color-surface-soft)",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex items-center gap-1.5 h-7 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2.5 text-xs text-(--color-text) transition-colors cursor-pointer",
          "hover:border-(--color-text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          open ? "border-(--color-accent)" : "",
          className,
        ].join(" ")}
      >
        <span>{selected.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-(--color-text-muted) transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {panel}
    </>
  );
}
