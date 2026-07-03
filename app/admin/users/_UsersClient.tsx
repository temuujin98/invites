"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/format";
import { setUserRole } from "./actions";

export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  role: "user" | "admin";
  inviteCount: number;
  createdAt: string;
}

export function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    : users;

  const admins = users.filter((u) => u.role === "admin").length;

  async function handleToggleRole() {
    if (!target) return;
    setBusy(true);
    setError(null);
    const nextRole = target.role === "admin" ? "user" : "admin";
    const res = await setUserRole(target.id, nextRole);
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, role: nextRole } : u)));
      setTarget(null);
    } else {
      setError(res.message);
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <PageHeader
          title="Хэрэглэгчид"
          subtitle={`Нийт ${users.length} хэрэглэгч · ${admins} админ`}
        />

        <div className="mt-4 max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Нэр эсвэл и-мэйлээр хайх"
          />
        </div>

        <div className="mt-4">
          <DataTable
            data={filtered}
            keyExtractor={(u) => u.id}
            emptyMessage="Хэрэглэгч олдсонгүй"
            columns={[
              {
                key: "displayName",
                label: "Нэр",
                render: (u) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-(--color-text)">{u.displayName || "—"}</span>
                    <span className="text-[11px] text-(--color-text-muted)">{u.email || "—"}</span>
                  </div>
                ),
              },
              {
                key: "role",
                label: "Эрх",
                render: (u) => (
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                      u.role === "admin"
                        ? "bg-(--color-accent-soft) text-(--color-accent)"
                        : "bg-(--color-surface-soft) text-(--color-text-secondary)",
                    ].join(" ")}
                  >
                    {u.role === "admin" ? "Админ" : "Хэрэглэгч"}
                  </span>
                ),
              },
              {
                key: "inviteCount",
                label: "Урилга",
                render: (u) => <span className="text-(--color-text-secondary)">{u.inviteCount}</span>,
              },
              {
                key: "createdAt",
                label: "Бүртгүүлсэн",
                render: (u) => <span className="text-(--color-text-muted)">{formatDate(u.createdAt)}</span>,
              },
              {
                key: "actions",
                label: "",
                render: (u) => (
                  <Button variant="secondary" size="sm" onClick={() => setTarget(u)}>
                    {u.role === "admin" ? "Эрх хасах" : "Админ болгох"}
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </div>

      <ConfirmDialog
        open={target !== null}
        onClose={() => { setTarget(null); setError(null); }}
        onConfirm={handleToggleRole}
        title={target?.role === "admin" ? "Админ эрх хасах уу?" : "Админ болгох уу?"}
        message={
          target
            ? `"${target.displayName || target.email}" хэрэглэгчийн эрхийг ${
                target.role === "admin" ? "хэрэглэгч болгож бууруулах" : "админ болгох"
              } уу?${error ? `\n\n${error}` : ""}`
            : ""
        }
        confirmLabel={busy ? "Түр хүлээнэ үү…" : "Тийм"}
        danger={target?.role === "admin"}
      />
    </div>
  );
}
