"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockCategories } from "@/lib/mock-admin-data";
import type { InviteTemplate } from "@/types/template";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { EmptyState } from "@/components/shared/EmptyState";

// ── Icons ──────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="2.5" cy="7" r="1.2" fill="currentColor" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
      <circle cx="11.5" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────

function TplStatusBadge({ status }: { status: "published" | "draft" }) {
  return (
    <span className={[
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
      status === "published"
        ? "bg-(--color-success-soft) text-(--color-success)"
        : "bg-(--color-surface-soft) text-(--color-text-secondary)",
    ].join(" ")}>
      {status === "published" ? "Идэвхтэй" : "Идэвхгүй"}
    </span>
  );
}

// ── Type badge ─────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: "image" | "video" }) {
  return (
    <span className={[
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
      type === "video"
        ? "bg-(--color-accent-soft) text-(--color-accent)"
        : "bg-(--color-surface-soft) text-(--color-text-secondary)",
    ].join(" ")}>
      {type === "image" ? "Зураг" : "Видео"}
    </span>
  );
}

// ── Grid card ──────────────────────────────────────────────────────────────

interface TemplateCardActionsProps {
  template: InviteTemplate;
  onDuplicate: (t: InviteTemplate) => void;
  onTogglePublish: (t: InviteTemplate) => void;
  onDelete: (t: InviteTemplate) => void;
}

function TemplateGridCard({ template, onDuplicate, onTogglePublish, onDelete }: TemplateCardActionsProps) {
  const categoryName = mockCategories.find((c) => c.id === template.categoryId)?.name ?? "—";

  return (
    <div className="group flex flex-col rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) overflow-hidden hover:border-(--color-accent)/40 hover:shadow-(--shadow-md) transition-all">
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-(--color-surface-soft)" style={{ aspectRatio: "9/16" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Hover actions */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/templates/${template.slug}`}
            target="_blank"
            className="flex-1 flex items-center justify-center rounded-(--radius-ctrl) bg-white/90 py-1 text-[11px] font-medium text-(--color-text) hover:bg-white transition-colors"
          >
            Харах
          </Link>
          <Link
            href={`/admin/templates/${template.id}/edit`}
            className="flex-1 flex items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) py-1 text-[11px] font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
          >
            Засах
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3">
        <p className="truncate text-xs font-semibold text-(--color-text)">{template.name}</p>
        <p className="truncate text-[11px] text-(--color-text-muted)">{categoryName}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <TplStatusBadge status={template.status} />
          <TypeBadge type={template.type} />
        </div>
        <div className="mt-1 flex justify-end">
          <DropdownMenu
            align="right"
            trigger={
              <button
                type="button"
                aria-label="Үйлдлүүд"
                className="flex h-6 w-6 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface-soft) transition-colors"
              >
                <IconDots />
              </button>
            }
            items={[
              { label: "Засах",   onClick: () => { window.location.href = `/admin/templates/${template.id}/edit`; } },
              { label: "Харах",   onClick: () => window.open(`/templates/${template.slug}`, "_blank") },
              { label: "Хуулах",  onClick: () => onDuplicate(template) },
              { label: template.status === "published" ? "Идэвхгүй болгох" : "Идэвхтэй болгох", onClick: () => onTogglePublish(template) },
              { label: "Устгах",  danger: true, onClick: () => onDelete(template) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ── Table row ──────────────────────────────────────────────────────────────

function TemplateTableRow({ template, onDuplicate, onTogglePublish, onDelete }: TemplateCardActionsProps) {
  const categoryName = mockCategories.find((c) => c.id === template.categoryId)?.name ?? "—";

  return (
    <tr className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-soft) transition-colors">
      {/* Thumbnail + name */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-6 shrink-0 overflow-hidden rounded-[4px] bg-(--color-surface-soft)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.thumbnailUrl}
              alt={template.name}
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-(--color-text)">{template.name}</p>
            <p className="text-[11px] text-(--color-text-muted) font-mono">{template.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-xs text-(--color-text-secondary)">{categoryName}</td>
      <td className="px-3 py-2.5"><TypeBadge type={template.type} /></td>
      <td className="px-3 py-2.5"><TplStatusBadge status={template.status} /></td>
      <td className="px-3 py-2.5 text-[11px] text-(--color-text-muted)">2026.06.10</td>
      <td className="px-3 py-2.5">
        <DropdownMenu
          align="right"
          trigger={
            <button
              type="button"
              aria-label="Үйлдлүүд"
              className="flex h-7 w-7 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface-soft) transition-colors"
            >
              <IconDots />
            </button>
          }
          items={[
            { label: "Засах",   onClick: () => { window.location.href = `/admin/templates/${template.id}/edit`; } },
            { label: "Харах",   onClick: () => window.open(`/templates/${template.slug}`, "_blank") },
            { label: "Хуулах",  onClick: () => onDuplicate(template) },
            { label: template.status === "published" ? "Идэвхгүй болгох" : "Идэвхтэй болгох", onClick: () => onTogglePublish(template) },
            { label: "Устгах",  danger: true, onClick: () => onDelete(template) },
          ]}
        />
      </td>
    </tr>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-(--color-border)">
          {Array.from({ length: 6 }).map((_, j) => (
            <td key={j} className="px-3 py-2.5">
              <div className="h-3.5 rounded bg-(--color-surface-soft) animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function GridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) overflow-hidden">
          <div className="bg-(--color-surface-soft) animate-pulse" style={{ aspectRatio: "9/16" }} />
          <div className="p-3 flex flex-col gap-2">
            <div className="h-3 w-3/4 rounded bg-(--color-surface-soft) animate-pulse" />
            <div className="h-2.5 w-1/2 rounded bg-(--color-surface-soft) animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

type FilterStatus = "all" | "published" | "draft";
type FilterType = "all" | "image" | "video";

export function AdminTemplatesClient({ initialTemplates }: { initialTemplates: InviteTemplate[] }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [loading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InviteTemplate | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.slug.includes(search.toLowerCase())) return false;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCategory !== "all" && t.categoryId !== filterCategory) return false;
      return true;
    });
  }, [templates, search, filterStatus, filterType, filterCategory]);

  function handleDuplicate(t: InviteTemplate) {
    const copy: InviteTemplate = {
      ...t,
      id: `${t.id}-copy-${Date.now()}`,
      name: `${t.name} (хуулбар)`,
      slug: `${t.slug}-copy-${Date.now().toString(36)}`,
      status: "draft",
    };
    setTemplates((prev) => [copy, ...prev]);
  }

  function handleTogglePublish(t: InviteTemplate) {
    setTemplates((prev) =>
      prev.map((x) =>
        x.id === t.id
          ? { ...x, status: x.status === "published" ? "draft" : "published" }
          : x,
      ),
    );
  }

  function handleDelete(t: InviteTemplate) {
    setTemplates((prev) => prev.filter((x) => x.id !== t.id));
  }

  const statusTabs = [
    { id: "all", label: "Бүгд", count: templates.length },
    { id: "published", label: "Идэвхтэй", count: templates.filter((t) => t.status === "published").length },
    { id: "draft", label: "Идэвхгүй", count: templates.filter((t) => t.status === "draft").length },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <PageHeader
          title="Загварууд"
          subtitle={`${templates.length} загвар`}
          actions={
            <Link href="/admin/templates/new">
              <Button variant="accent" size="sm">
                + Нэмэх
              </Button>
            </Link>
          }
        />

        {/* ── Filters row ── */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Нэр, slug хайх..."
            className="w-52"
          />
          <FilterTabs
            tabs={statusTabs}
            activeId={filterStatus}
            onChange={(id) => setFilterStatus(id as FilterStatus)}
          />
          <FilterSelect
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { value: "all", label: "Бүх ангилал" },
              ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <FilterSelect
            value={filterType}
            onChange={(v) => setFilterType(v as FilterType)}
            options={[
              { value: "all", label: "Бүх төрөл" },
              { value: "image", label: "Зураг" },
              { value: "video", label: "Видео" },
            ]}
          />

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-label="Хүснэгт харагдац"
              className={[
                "flex h-6 w-6 items-center justify-center rounded-[5px] transition-colors",
                viewMode === "table"
                  ? "bg-(--color-accent-soft) text-(--color-accent)"
                  : "text-(--color-text-muted) hover:text-(--color-text)",
              ].join(" ")}
            >
              <IconList />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Хавтан харагдац"
              className={[
                "flex h-6 w-6 items-center justify-center rounded-[5px] transition-colors",
                viewMode === "grid"
                  ? "bg-(--color-accent-soft) text-(--color-accent)"
                  : "text-(--color-text-muted) hover:text-(--color-text)",
              ].join(" ")}
            >
              <IconGrid />
            </button>
          </div>
        </div>

        {/* ── Table view ── */}
        {viewMode === "table" && (
          <div className="overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-soft)">
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Загвар</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Ангилал</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Төрөл</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Төлөв</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Шинэчилсэн</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState title="Загвар олдсонгүй" description="Хайлт эсвэл шүүлтүүрийг өөрчилнө үү" />
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <TemplateTableRow
                      key={t.id}
                      template={t}
                      onDuplicate={handleDuplicate}
                      onTogglePublish={handleTogglePublish}
                      onDelete={setDeleteTarget}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Grid view ── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading ? (
              <GridSkeleton />
            ) : filtered.length === 0 ? (
              <div className="col-span-full">
                <EmptyState title="Загвар олдсонгүй" description="Хайлт эсвэл шүүлтүүрийг өөрчилнө үү" />
              </div>
            ) : (
              filtered.map((t) => (
                <TemplateGridCard
                  key={t.id}
                  template={t}
                  onDuplicate={handleDuplicate}
                  onTogglePublish={handleTogglePublish}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        title="Загвар устгах уу?"
        message={`"${deleteTarget?.name}" загварыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
