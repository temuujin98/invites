import { forwardRef, useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, hint, className = "", id, rows = 3, ...props },
    ref
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const describedBy =
      [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-(--color-text-secondary)"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={[
            "px-3 py-2 text-sm rounded-(--radius-ctrl) border bg-(--color-surface) text-(--color-text) transition-colors duration-150 resize-y",
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
