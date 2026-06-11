"use client";

import { useId } from "react";

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}

function formatDateString(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

export function DateInput({
  label,
  error,
  hint,
  value,
  onChange,
  className = "",
  id,
  ...props
}: DateInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(formatDateString(e.target.value));
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-(--color-text-secondary)"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          placeholder="ЖЖЖЖ.СС.ӨӨ"
          value={value}
          onChange={handleChange}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={[
            "h-[34px] w-full pl-3 pr-9 text-sm rounded-(--radius-ctrl) border bg-(--color-surface) text-(--color-text) transition-colors duration-150",
            "placeholder:text-(--color-text-muted)",
            "hover:border-(--color-text-muted)",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:border-(--color-accent)",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-(--color-surface-soft)",
            error ? "border-(--color-danger)" : "border-(--color-border)",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <rect x="1" y="2.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-(--color-text-muted)">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-(--color-danger)" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
