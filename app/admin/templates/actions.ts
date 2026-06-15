"use server";

import { getAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Нэвтрээгүй байна");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Эрх хүрэхгүй байна");
}

export async function setTemplateStatus(
  id: string,
  status: "published" | "draft",
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await assertAdmin();
    const db = getAdminClient();
    const { error } = await db
      .from("templates")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/templates");
    revalidatePath("/templates");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Алдаа гарлаа" };
  }
}

export async function deleteTemplate(
  id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await assertAdmin();
    const db = getAdminClient();
    const { error } = await db.from("templates").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/templates");
    revalidatePath("/templates");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Алдаа гарлаа" };
  }
}
