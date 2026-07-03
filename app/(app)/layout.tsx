import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Auth guard: (app) routes (dashboard, create, invite editing) require a logged-in user.
// Session cookie refresh is handled by middleware.ts at the repo root.
export default async function AppLayout({ children }: { children: ReactNode }) {
  let authed = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authed = Boolean(user);
  } catch (e) {
    console.error("[app/layout] auth check failed:", e);
    // fail closed — authed stays false
  }

  if (!authed) redirect("/login?next=/dashboard");

  return <>{children}</>;
}
