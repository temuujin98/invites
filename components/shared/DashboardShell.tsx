import { ReactNode } from "react";
import { AppShell } from "./AppShell";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return <AppShell>{children}</AppShell>;
}
