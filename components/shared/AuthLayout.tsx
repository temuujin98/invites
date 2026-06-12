import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-bg) px-4 py-12">
      {/* Logo mark */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-(--color-accent)">
          <span className="text-[15px] font-bold text-white">i</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-(--color-text)">
          invites
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-85 rounded-panel border border-(--color-border) bg-(--color-surface) p-7 shadow-sm">
        {children}
      </div>
    </div>
  );
}
