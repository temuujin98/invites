import { getAdminClient } from "@/lib/supabase/admin";
import { UsersClient, type AdminUser } from "./_UsersClient";

export default async function AdminUsersPage() {
  const db = getAdminClient();

  // Profiles (all — admin RLS allows it, but service-role is simplest for the joins).
  const { data: profiles } = await db
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: false });

  // Invite counts per user.
  const { data: inviteRows } = await db.from("invites").select("user_id");
  const inviteCounts = new Map<string, number>();
  for (const r of inviteRows ?? []) {
    const uid = r.user_id as string;
    inviteCounts.set(uid, (inviteCounts.get(uid) ?? 0) + 1);
  }

  // Emails live in auth.users — resolve via the admin auth API.
  const emailById = new Map<string, string>();
  try {
    const { data: authList } = await db.auth.admin.listUsers({ perPage: 1000 });
    for (const u of authList?.users ?? []) {
      if (u.email) emailById.set(u.id, u.email);
    }
  } catch {
    // If the auth admin call fails, emails just stay blank.
  }

  const users: AdminUser[] = (profiles ?? []).map((p) => ({
    id: p.id as string,
    displayName: (p.display_name as string | null) ?? "",
    email: emailById.get(p.id as string) ?? "",
    role: p.role as "user" | "admin",
    inviteCount: inviteCounts.get(p.id as string) ?? 0,
    createdAt: p.created_at as string,
  }));

  return <UsersClient initialUsers={users} />;
}
