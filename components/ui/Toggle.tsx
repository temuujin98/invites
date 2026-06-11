"use client";

import { useId } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: ToggleProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex items-center gap-2 cursor-pointer select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-(--color-accent)" : "bg-(--color-border)",
        ].join(" ")}
      >
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-(--shadow-sm) transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </span>
      {label && (
        <span className="text-sm text-(--color-text)">{label}</span>
      )}
    </label>
  );
}
