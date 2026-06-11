"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Хайх",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <svg
        className="pointer-events-none absolute left-3 text-(--color-text-muted)"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="6"
          cy="6"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9.5 9.5L12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "h-[34px] w-full pl-8 pr-8 text-sm rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text) transition-colors duration-150",
          "placeholder:text-(--color-text-muted)",
          "hover:border-(--color-text-muted)",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:border-(--color-accent)",
          "[&::-webkit-search-cancel-button]:hidden",
        ].join(" ")}
      />
      {value && (
        <button
          type="button"
          aria-label="Хайлт цэвэрлэх"
          onClick={() => onChange("")}
          className="absolute right-2.5 flex items-center justify-center text-(--color-text-muted) hover:text-(--color-text) transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3.5 3.5l7 7M10.5 3.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
