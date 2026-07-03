import { getAdminClient } from "@/lib/supabase/admin";
import { UsersClient, type AdminUser } from "./_UsersClient";
import { ErrorState } from "@/components/shared/ErrorState";

const PAGE = 1000;

export default async function AdminUsersPage() {
  let db: ReturnType<typeof getAdminClient>;
  try {
    db = getAdminClient();
  } catch {
    return <ErrorState message="Серверийн тохиргооны алдаа." />;
  }

  const { data: profiles, error: profilesErr } = await db
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: false });

  if (profilesErr) {
    return <ErrorState message="Хэрэглэгчдийг уншихад алдаа гарлаа." />;
  }

  // Invite counts per user — paginate through the whole table so counts stay
  // correct past the 1000-row PostgREST default.
  const inviteCounts = new Map<string, number>();
  for (let from = 0; ; from += PAGE) {
    const { data: rows } = await db
      .from("invites")
      .select("user_id")
      .range(from, from + PAGE - 1);
    for (const r of rows ?? []) {
      const uid = r.user_id as string;
      inviteCounts.set(uid, (inviteCounts.get(uid) ?? 0) + 1);
    }
    if (!rows || rows.length < PAGE) break;
  }

  // Emails live in auth.users — page through the admin auth API.
  const emailById = new Map<string, string>();
  try {
    for (let page = 1; ; page++) {
      const { data: authList } = await db.auth.admin.listUsers({ page, perPage: PAGE });
      const list = authList?.users ?? [];
      for (const u of list) if (u.email) emailById.set(u.id, u.email);
      if (list.length < PAGE) break;
    }
  } catch {
    // Emails just stay blank if the auth admin call fails.
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
