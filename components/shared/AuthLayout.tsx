import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-bg) px-4 py-12">
      {/* Logo + tagline */}
      <div className="mb-6 flex flex-col items-center gap-1.5">
        <span className="text-xl font-bold text-(--color-text) tracking-tight">
          invites
        </span>
        <span className="text-xs text-(--color-text-muted)">
          Монгол дижитал урилга үүсгэх платформ
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[400px] rounded-(--radius-panel) bg-(--color-surface) shadow-(--shadow-md) p-8"
      >
        {children}
      </div>
    </div>
  );
}
