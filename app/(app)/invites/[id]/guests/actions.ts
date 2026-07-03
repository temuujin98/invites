"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { generateGuestToken } from "@/lib/tokens";
import {
  guestCreateSchema,
  guestUpdateSchema,
  guestImportSchema,
  type GuestCreateInput,
  type GuestUpdateInput,
} from "@/lib/validation/guest";

type Result<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; code: string; message: string };

// Owner gate: the session user must own the invite. Uses the session client so
// owner RLS enforces it as defence-in-depth; returns the invite id on success.
async function assertOwnsInvite(inviteId: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: invite } = await supabase
    .from("invites")
    .select("id")
    .eq("id", inviteId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!invite) throw new Error("FORBIDDEN");
  return invite.id as string;
}

// Resolve the invite that owns a guest, then assert ownership.
async function assertOwnsGuest(guestId: string): Promise<{ inviteId: string }> {
  const db = getAdminClient();
  const { data: guest } = await db
    .from("guests")
    .select("invite_id")
    .eq("id", guestId)
    .maybeSingle();
  if (!guest) throw new Error("NOT_FOUND");
  await assertOwnsInvite(guest.invite_id as string);
  return { inviteId: guest.invite_id as string };
}

function errResult(err: unknown): Result<never> {
  const code = err instanceof Error ? err.message : "SERVER_ERROR";
  const messages: Record<string, string> = {
    UNAUTHORIZED: "Нэвтрэх шаардлагатай",
    FORBIDDEN: "Энэ урилга танийх биш байна",
    NOT_FOUND: "Зочин олдсонгүй",
    INVALID: "Мэдээлэл буруу байна",
  };
  return { ok: false, code, message: messages[code] ?? "Алдаа гарлаа" };
}

export async function createGuest(
  inviteId: string,
  input: GuestCreateInput,
): Promise<Result<{ id: string; token: string }>> {
  try {
    await assertOwnsInvite(inviteId);
    const parsed = guestCreateSchema.safeParse(input);
    if (!parsed.success) throw new Error("INVALID");

    const db = getAdminClient();
    // Retry once on the (astronomically rare) token unique collision.
    for (let attempt = 0; attempt < 2; attempt++) {
      const token = generateGuestToken();
      const { data, error } = await db
        .from("guests")
        .insert({
          invite_id: inviteId,
          name: parsed.data.name,
          email: parsed.data.email ?? null,
          phone: parsed.data.phone ?? null,
          notes: parsed.data.notes ?? null,
          token,
        })
        .select("id, token")
        .single();
      if (!error && data) {
        revalidatePath(`/invites/${inviteId}/guests`);
        return { ok: true, data: { id: data.id as string, token: data.token as string } };
      }
      // 23505 = unique_violation → retry with a new token
      if (error && error.code !== "23505") throw error;
    }
    throw new Error("SERVER_ERROR");
  } catch (err) {
    return errResult(err);
  }
}

export async function updateGuest(
  guestId: string,
  input: GuestUpdateInput,
): Promise<Result> {
  try {
    const { inviteId } = await assertOwnsGuest(guestId);
    const parsed = guestUpdateSchema.safeParse(input);
    if (!parsed.success) throw new Error("INVALID");

    const patch: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) patch.name = parsed.data.name;
    if ("email" in parsed.data) patch.email = parsed.data.email ?? null;
    if ("phone" in parsed.data) patch.phone = parsed.data.phone ?? null;
    if ("notes" in parsed.data) patch.notes = parsed.data.notes ?? null;

    const db = getAdminClient();
    const { error } = await db.from("guests").update(patch).eq("id", guestId);
    if (error) throw error;
    revalidatePath(`/invites/${inviteId}/guests`);
    return { ok: true };
  } catch (err) {
    return errResult(err);
  }
}

export async function deleteGuest(guestId: string): Promise<Result> {
  try {
    const { inviteId } = await assertOwnsGuest(guestId);
    const db = getAdminClient();
    const { error } = await db.from("guests").delete().eq("id", guestId);
    if (error) throw error;
    revalidatePath(`/invites/${inviteId}/guests`);
    return { ok: true };
  } catch (err) {
    return errResult(err);
  }
}

export async function importGuests(
  inviteId: string,
  rows: GuestCreateInput[],
): Promise<Result<{ inserted: number }>> {
  try {
    await assertOwnsInvite(inviteId);
    const parsed = guestImportSchema.safeParse({ rows });
    if (!parsed.success) throw new Error("INVALID");

    const db = getAdminClient();
    const buildRows = () =>
      parsed.data.rows.map((r) => ({
        invite_id: inviteId,
        name: r.name,
        email: r.email ?? null,
        phone: r.phone ?? null,
        notes: r.notes ?? null,
        token: generateGuestToken(),
      }));

    // Retry the whole batch once with fresh tokens on a unique collision (23505).
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await db.from("guests").insert(buildRows()).select("id");
      if (!error) {
        revalidatePath(`/invites/${inviteId}/guests`);
        return { ok: true, data: { inserted: data?.length ?? 0 } };
      }
      if (error.code !== "23505") throw error;
    }
    throw new Error("SERVER_ERROR");
  } catch (err) {
    return errResult(err);
  }
}
