import { AdminShell } from "@/components/shared/AdminShell";

// TODO Phase 7: add server-side role guard here (check profiles.role === "admin")
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
