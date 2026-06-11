"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockInvites, mockTemplates } from "@/lib/mock-admin-data";
import type { Invite, InviteStatus } from "@/types/invite";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { StatusBadge } from "@/components/invite/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/format";

type FilterStatus = "all" | InviteStatus;

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState(mockInvites);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<Invite | null>(null);

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

  function handleDelete(inv: Invite) {
    setInvites((prev) => prev.filter((x) => x.id !== inv.id));
  }

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
          subtitle={`${invites.length} урилга`}
        />

        {/* Filters */}
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

        {/* Table */}
        <div className="overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-(--color-border) bg-(--color-surface-soft)">
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Урилга</th>
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Загвар</th>
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Огноо</th>
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Төлөв</th>
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">RSVP</th>
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Харагдалт</th>
                <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState title="Урилга олдсонгүй" description="Хайлт эсвэл шүүлтүүрийг өөрчилнө үү" />
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const tpl = mockTemplates.find((t) => t.id === inv.templateId);
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-soft) transition-colors"
                    >
                      {/* Title + slug */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="h-10 w-6 shrink-0 overflow-hidden rounded-[4px] bg-(--color-surface-soft)">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/mock-templates/${inv.templateSlug}.svg`}
                              alt={inv.title}
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-(--color-text) max-w-[180px]">{inv.title}</p>
                            <p className="text-[11px] text-(--color-text-muted) font-mono">{inv.shareSlug}</p>
                          </div>
                        </div>
                      </td>
                      {/* Template */}
                      <td className="px-3 py-2.5 text-(--color-text-secondary)">{tpl?.name ?? "—"}</td>
                      {/* Date */}
                      <td className="px-3 py-2.5 text-(--color-text-muted)">
                        {inv.eventDate ? formatDate(inv.eventDate) : "—"}
                      </td>
                      {/* Status */}
                      <td className="px-3 py-2.5"><StatusBadge status={inv.status} /></td>
                      {/* RSVP */}
                      <td className="px-3 py-2.5 text-(--color-text-secondary)">{inv.rsvpCount}</td>
                      {/* Views */}
                      <td className="px-3 py-2.5 text-(--color-text-muted)">{inv.viewCount}</td>
                      {/* Actions */}
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
                              navigator.clipboard.writeText(`https://invites.mn/i/${inv.shareSlug}`).catch(() => undefined);
                            }}
                            className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-border) px-2 text-[10px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
                          >
                            Линк
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(inv)}
                            className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-danger)/30 px-2 text-[10px] text-(--color-danger) hover:bg-(--color-danger-soft) transition-colors"
                          >
                            Устгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        title="Урилга устгах уу?"
        message={`"${deleteTarget?.title}" урилгыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
