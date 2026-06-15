import Image from "next/image";
import Link from "next/link";
import { UserAvatarMenu } from "@/components/shared/UserAvatarMenu";

interface PublicHeaderProps {
  user: { displayName: string; email: string } | null;
}

export function PublicHeader({ user }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-(--color-border) bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">

        {/* Logo — larger, crisp */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="invites.mn"
            height={32}
            width={160}
            style={{ width: "auto", height: 32 }}
            priority
          />
        </Link>


        {/* Right: CTA for guests / avatar for logged-in users */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              {/* Desktop login (secondary) */}
              <Link
                href="/login"
                className="hidden md:inline-flex h-9 items-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-bg) px-5 text-[14px] font-medium text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
              >
                Нэвтрэх
              </Link>

              {/* Desktop register CTA */}
              <Link
                href="/register"
                className="hidden md:inline-flex h-9 items-center rounded-(--radius-ctrl) bg-(--color-accent) px-5 text-[14px] font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
              >
                Урилга үүсгэх
              </Link>

              {/* Mobile hamburger — guests only */}
              <details className="group relative md:hidden">
                <summary
                  className="flex h-8 w-8 list-none cursor-pointer items-center justify-center rounded-(--radius-ctrl) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
                  aria-label="Цэс"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </summary>
                <nav
                  className="absolute right-0 top-10 z-50 flex min-w-40 flex-col rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-md py-1"
                  aria-label="Мобайл цэс"
                >
                  <Link href="/login" className="px-4 py-2.5 text-xs text-(--color-text) hover:bg-(--color-surface-soft) transition-colors">
                    Нэвтрэх
                  </Link>
                  <div className="my-1 border-t border-(--color-border)" />
                  <Link href="/register" className="px-4 py-2.5 text-xs font-medium text-(--color-accent) hover:bg-(--color-surface-soft) transition-colors">
                    Урилга үүсгэх
                  </Link>
                </nav>
              </details>
            </>
          ) : (
            /* Logged-in: single avatar button (desktop + mobile) */
            <UserAvatarMenu displayName={user.displayName} email={user.email} />
          )}
        </div>

      </div>
    </header>
  );
}
