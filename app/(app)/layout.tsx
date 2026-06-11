import type { ReactNode } from "react";

// No auth guard until Phase 7 — AppShell/DashboardShell added then.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
