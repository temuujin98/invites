"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function buildPages(page: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (page < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <nav
      aria-label="Хуудас шилжих"
      className={`flex items-center gap-1 ${className}`}
    >
      <PageButton
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Өмнөх"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M8.5 3L5 7l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </PageButton>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-[34px] h-[34px] flex items-center justify-center text-sm text-(--color-text-muted)"
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            onClick={() => onChange(p)}
            active={p === page}
            aria-label={`${p}-р хуудас`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PageButton>
        )
      )}

      <PageButton
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Дараах"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5.5 3L9 7l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </PageButton>
    </nav>
  );
}

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function PageButton({ active, children, className = "", ...props }: PageButtonProps) {
  return (
    <button
      type="button"
      className={[
        "w-[34px] h-[34px] flex items-center justify-center text-sm rounded-(--radius-ctrl) transition-colors duration-150 cursor-pointer",
        active
          ? "bg-(--color-primary) text-white font-medium"
          : "text-(--color-text) hover:bg-(--color-surface-soft)",
        props.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
