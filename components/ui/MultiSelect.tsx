"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface MultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  countNoun?: string;
  className?: string;
}

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "Бүгд",
  countNoun = "сонгосон",
  className = "",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? (options.find((o) => o.value === values[0])?.label ?? `1 ${countNoun}`)
        : `${values.length} ${countNoun}`;

  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  useEffect(() => {
    if (!open) return;

    function reposition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const panelHeight = panelRef.current?.offsetHeight ?? 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const flipUp = spaceBelow < panelHeight + 8 && rect.top > panelHeight + 8;

      const width = Math.max(rect.width, 180);
      const left = Math.min(
        rect.left + window.scrollX,
        window.innerWidth + window.scrollX - width - 8,
      );
      const top = flipUp
        ? rect.top + window.scrollY - panelHeight - 4
        : rect.bottom + window.scrollY + 4;

      setPos({ top, left, width });
    }

    reposition();

    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
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

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={panelRef}
            role="listbox"
            aria-multiselectable="true"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              minWidth: 180,
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) py-1 shadow-lg"
          >
            {values.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full cursor-pointer border-b border-(--color-border) px-3 py-1.5 text-left text-xs text-(--color-text-muted) transition-colors hover:bg-(--color-surface-soft) hover:text-(--color-text)"
              >
                Цэвэрлэх
              </button>
            )}
            {options.map((opt) => {
              const checked = values.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={[
                    "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors duration-100",
                    checked
                      ? "bg-(--color-accent-soft) font-medium text-(--color-accent)"
                      : "text-(--color-text) hover:bg-(--color-surface-soft)",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                      checked
                        ? "border-(--color-accent) bg-(--color-accent) text-white"
                        : "border-(--color-border) bg-(--color-surface)",
                    ].join(" ")}
                  >
                    {checked && (
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
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
          "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-(--radius-ctrl) border bg-(--color-surface) px-2.5 text-xs transition-colors",
          "hover:border-(--color-text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          values.length > 0
            ? "border-(--color-accent) font-medium text-(--color-accent)"
            : "border-(--color-border) text-(--color-text)",
          open ? "border-(--color-accent)" : "",
          className,
        ].join(" ")}
      >
        <span className="flex-1 truncate text-left">{summary}</span>
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
