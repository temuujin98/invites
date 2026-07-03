"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Нэвтрээгүй байна");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Эрх хүрэхгүй байна");
  return user.id;
}

export async function setUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const adminId = await assertAdmin();
    // Don't let an admin demote themselves (avoid locking out the last admin).
    if (userId === adminId && role !== "admin") {
      return { ok: false, message: "Өөрийн эрхийг бууруулах боломжгүй" };
    }
    const db = getAdminClient();
    const { error } = await db.from("profiles").update({ role }).eq("id", userId);
    if (error) throw error;
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Алдаа гарлаа" };
  }
}
