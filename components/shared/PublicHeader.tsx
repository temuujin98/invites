import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-(--color-border) bg-(--color-surface)/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[52px] max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-bold text-(--color-text) tracking-tight"
        >
          invites
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex" aria-label="Нийтийн цэс">
          <Link
            href="/templates"
            className="text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
          >
            Загварууд
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
          >
            Нэвтрэх
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/register"
            className="inline-flex h-8 items-center rounded-(--radius-ctrl) bg-(--color-accent) px-4 text-xs font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
          >
            Урилга үүсгэх
          </Link>
        </div>

        {/* Mobile hamburger */}
        <details className="group relative md:hidden">
          <summary
            className="flex h-8 w-8 list-none cursor-pointer items-center justify-center rounded-(--radius-ctrl) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
            aria-label="Цэс"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3 5h12M3 9h12M3 13h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-10 z-50 flex min-w-[160px] flex-col rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-md) py-1"
            aria-label="Мобайл цэс"
          >
            <Link
              href="/templates"
              className="px-4 py-2.5 text-xs text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
            >
              Загварууд
            </Link>
            <Link
              href="/login"
              className="px-4 py-2.5 text-xs text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
            >
              Нэвтрэх
            </Link>
            <div className="my-1 border-t border-(--color-border)" />
            <Link
              href="/register"
              className="px-4 py-2.5 text-xs font-medium text-(--color-accent) hover:bg-(--color-surface-soft) transition-colors"
            >
              Урилга үүсгэх
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
