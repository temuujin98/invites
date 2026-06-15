"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { InviteStatus } from "@/types/invite";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { StatusBadge } from "@/components/invite/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { APP_URL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────

interface AdminInvite {
  id: string;
  title: string;
  shareSlug: string;
  templateName: string;
  templateSlug: string;
  eventDate: string | null;
  status: InviteStatus;
}

type FilterStatus = "all" | InviteStatus;

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminInvitesPage() {
  const supabase = createClient();
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminInvite | null>(null);

  useEffect(() => {
    void loadInvites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInvites() {
    setLoading(true);
    const { data } = await supabase
      .from("invites")
      .select(`id, title, share_slug, event_date, status,
        template:templates!template_id ( name, slug )`)
      .order("updated_at", { ascending: false });

    setInvites(
      (data ?? []).map((row: Record<string, unknown>) => {
        const tpl = Array.isArray(row.template) ? ((row.template as unknown[])[0] ?? null) : row.template;
        return {
          id: row.id as string,
          title: row.title as string,
          shareSlug: row.share_slug as string,
          templateName: (tpl as { name: string } | null)?.name ?? "—",
          templateSlug: (tpl as { slug: string } | null)?.slug ?? "",
          eventDate: (row.event_date as string | null) ?? null,
          status: row.status as InviteStatus,
        };
      }),
    );
    setLoading(false);
  }

  async function handleDelete(inv: AdminInvite) {
    await supabase.from("invites").delete().eq("id", inv.id);
    setInvites((prev) => prev.filter((x) => x.id !== inv.id));
  }

  const filtered = useMemo(() => {
    return invites.filter((inv) => {
      if (search) {
        const q = search.toLowerCase();
        if (!inv.title.toLowerCase().includes(q) && !inv.shareSlug.includes(q)) return false;
      }
      if (filterStatus !== "all" && inv.status !== filterStatus) return false;
      return true;
    });
  }, [invites, search, filterStatus]);

  const statusTabs = [
    { id: "all", label: "Бүгд", count: invites.length },
    { id: "published", label: "Нийтэлсэн", count: invites.filter((i) => i.status === "published").length },
    { id: "draft", label: "Ноорог", count: invites.filter((i) => i.status === "draft").length },
    { id: "archived", label: "Архив", count: invites.filter((i) => i.status === "archived").length },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
        <PageHeader
          title="Урилгууд"
          subtitle={loading ? "Уншиж байна..." : `${invites.length} урилга`}
        />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Гарчиг, slug хайх..."
            className="w-52"
          />
          <FilterTabs
            tabs={statusTabs}
            activeId={filterStatus}
            onChange={(id) => setFilterStatus(id as FilterStatus)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-soft)">
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Урилга</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Загвар</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Огноо</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Төлөв</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState title="Урилга олдсонгүй" description="Хайлт эсвэл шүүлтүүрийг өөрчилнө үү" />
                    </td>
                  </tr>
                ) : filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-soft) transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-6 shrink-0 overflow-hidden rounded-sm bg-(--color-surface-soft)">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/mock-templates/${inv.templateSlug}.svg`}
                            alt={inv.title}
                            className="h-full w-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-(--color-text) max-w-45">{inv.title}</p>
                          <p className="text-[11px] text-(--color-text-muted) font-mono">{inv.shareSlug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-(--color-text-secondary)">{inv.templateName}</td>
                    <td className="px-3 py-2.5 text-(--color-text-muted)">
                      {inv.eventDate ? formatDate(inv.eventDate) : "—"}
                    </td>
                    <td className="px-3 py-2.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/i/${inv.shareSlug}`}
                          target="_blank"
                          className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-border) px-2 text-[10px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
                        >
                          Харах
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${APP_URL}/i/${inv.shareSlug}`).catch(() => undefined);
                          }}
                          className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-border) px-2 text-[10px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
                        >
                          Линк
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(inv)}
                          className="flex h-6 items-center rounded-(--radius-ctrl) border border-danger/30 px-2 text-[10px] text-(--color-danger) hover:bg-(--color-danger-soft) transition-colors"
                        >
                          Устгах
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) void handleDelete(deleteTarget); setDeleteTarget(null); }}
        title="Урилга устгах уу?"
        message={`"${deleteTarget?.title}" урилгыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
