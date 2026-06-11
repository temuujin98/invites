"use client";

import { useId } from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}: CheckboxProps) {
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
          "relative flex items-center justify-center w-4 h-4 rounded-[4px] border transition-colors duration-150 shrink-0",
          checked
            ? "bg-(--color-accent) border-(--color-accent)"
            : "bg-(--color-surface) border-(--color-border)",
        ].join(" ")}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && (
        <span className="text-sm text-(--color-text)">{label}</span>
      )}
    </label>
  );
}
