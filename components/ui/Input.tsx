import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, hint, className = "", id, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

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
        <input
          ref={ref}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={[
            "h-[34px] px-3 text-sm rounded-(--radius-ctrl) border bg-(--color-surface) text-(--color-text) transition-colors duration-150",
            "placeholder:text-(--color-text-muted)",
            "hover:border-(--color-text-muted)",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:border-(--color-accent)",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-(--color-surface-soft)",
            error
              ? "border-(--color-danger)"
              : "border-(--color-border)",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-(--color-text-muted)">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-(--color-danger)" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
