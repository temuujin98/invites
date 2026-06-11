import { forwardRef, useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, options, className = "", id, ...props }, ref) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-(--color-text-secondary)"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-describedby={errorId}
            aria-invalid={!!error}
            className={[
              "h-[34px] w-full px-3 pr-8 text-sm rounded-(--radius-ctrl) border bg-(--color-surface) text-(--color-text) transition-colors duration-150 appearance-none cursor-pointer",
              "hover:border-(--color-text-muted)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:border-(--color-accent)",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-(--color-surface-soft)",
              error ? "border-(--color-danger)" : "border-(--color-border)",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 5l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-(--color-danger)" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
