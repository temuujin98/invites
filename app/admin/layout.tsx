import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/shared/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let authed = false;
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      authed = true;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      isAdmin = profile?.role === "admin";
    }
  } catch (e) {
    console.error("[admin/layout] auth check failed:", e);
    // fail closed — authed/isAdmin stay false
  }

  if (!authed) redirect("/login?next=/admin");
  if (!isAdmin) redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
