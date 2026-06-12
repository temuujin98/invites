import Link from "next/link";
import { LogoutButton } from "@/components/shared/LogoutButton";

interface PublicHeaderProps {
  user: { displayName: string } | null;
}

export function PublicHeader({ user }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-(--color-border) bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-13 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="text-sm font-bold text-(--color-text) tracking-tight">
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
          {!user && (
            <Link
              href="/login"
              className="text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
            >
              Нэвтрэх
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
            >
              Хяналтын самбар
            </Link>
          )}
        </nav>

        {/* Right CTA / user menu */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <Link
              href="/register"
              className="inline-flex h-8 items-center rounded-(--radius-ctrl) bg-(--color-accent) px-4 text-xs font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
            >
              Урилга үүсгэх
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-(--color-text-secondary) truncate max-w-30">
                {user.displayName}
              </span>
              <LogoutButton className="inline-flex h-8 items-center rounded-(--radius-ctrl) border border-(--color-border) px-3 text-xs font-medium text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors">
                Гарах
              </LogoutButton>
            </div>
          )}
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
            className="absolute right-0 top-10 z-50 flex min-w-40 flex-col rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-md py-1"
            aria-label="Мобайл цэс"
          >
            <Link
              href="/templates"
              className="px-4 py-2.5 text-xs text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
            >
              Загварууд
            </Link>
            {!user && (
              <>
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
              </>
            )}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 text-xs font-medium text-(--color-accent) hover:bg-(--color-surface-soft) transition-colors"
                >
                  Хяналтын самбар
                </Link>
                <div className="my-1 border-t border-(--color-border)" />
                <LogoutButton className="px-4 py-2.5 text-left text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors">
                  Гарах
                </LogoutButton>
              </>
            )}
          </nav>
        </details>

      </div>
    </header>
  );
}
