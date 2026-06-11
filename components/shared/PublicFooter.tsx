import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-(--color-text) tracking-tight">
              invites
            </span>
            <span className="text-xs text-(--color-text-muted)">
              Монгол дижитал урилга үүсгэх платформ
            </span>
          </div>

          {/* Links */}
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Хөл тавцангийн холбоосууд"
          >
            <Link
              href="/templates"
              className="text-xs text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
            >
              Загварууд
            </Link>
            <Link
              href="/help"
              className="text-xs text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
            >
              Тусламж
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
            >
              Нууцлал
            </Link>
            <Link
              href="/terms"
              className="text-xs text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
            >
              Нөхцөл
            </Link>
          </nav>
        </div>

        <p className="mt-6 text-xs text-(--color-text-muted)">
          &copy; 2026 invites.mn
        </p>
      </div>
    </footer>
  );
}
