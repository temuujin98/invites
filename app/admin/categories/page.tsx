"use client";

import { useState, useEffect } from "react";
import type { TemplateCategory } from "@/types/template";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────

interface AdminCategory extends TemplateCategory {
  active: boolean;
  templateCount: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  birthday: "🎂", wedding: "💍", graduation: "🎓",
  corporate: "🏢", kids: "🎈", other: "🎉",
};

function rowToAdminCategory(row: Record<string, unknown>, templateCounts: Record<string, number>): AdminCategory {
  const slug = row.slug as string;
  return {
    id: row.id as string,
    name: row.name_mn as string,
    slug,
    icon: (row.icon as string | null) ?? CATEGORY_ICONS[slug] ?? "🎉",
    order: Number(row.sort_order),
    active: Boolean(row.is_active),
    templateCount: templateCounts[row.id as string] ?? 0,
  };
}

// ── Category form ─────────────────────────────────────────────────────────

interface CategoryFormProps {
  initial?: Partial<AdminCategory>;
  onSave: (data: { name: string; slug: string; icon: string; active: boolean }) => void;
  onCancel: () => void;
}

function CategoryForm({ initial, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "🎉");
  const [active, setActive] = useState(initial?.active ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    onSave({ name: name.trim(), slug: slug.trim(), icon, active });
  }

  function autoSlug(v: string) {
    setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Монгол нэр"
            placeholder="Жишээ: Хурим"
            value={name}
            onChange={(e) => { setName(e.target.value); if (!initial?.slug) autoSlug(e.target.value); }}
            required
          />
        </div>
        <div className="w-20">
          <label className="text-xs font-medium text-(--color-text-secondary) mb-1 block">Дүрс</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            maxLength={2}
            className="h-8.5 w-full rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2 text-center text-base focus:outline-none focus:border-(--color-accent)"
          />
        </div>
      </div>
      <Input
        label="Slug (URL)"
        placeholder="wedding"
        value={slug}
        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
        required
      />
      <div className="flex items-center justify-between rounded-(--radius-card) border border-(--color-border) px-3 py-2.5">
        <span className="text-xs font-medium text-(--color-text)">Идэвхтэй</span>
        <Toggle checked={active} onChange={setActive} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>Цуцлах</Button>
        <Button type="submit" variant="accent" size="md">Хадгалах</Button>
      </div>
    </form>
  );
}

// ── Category row ──────────────────────────────────────────────────────────

function CategoryRow({
  cat, index, total, onMoveUp, onMoveDown, onEdit, onDelete, onToggleActive,
}: {
  cat: AdminCategory; index: number; total: number;
  onMoveUp: () => void; onMoveDown: () => void;
  onEdit: () => void; onDelete: () => void; onToggleActive: () => void;
}) {
  return (
    <tr className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-soft) transition-colors">
      <td className="w-12 px-2 py-2.5">
        <div className="flex flex-col items-center gap-0.5">
          <button type="button" onClick={onMoveUp} disabled={index === 0} aria-label="Дээш"
            className="flex h-4 w-4 items-center justify-center text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-25 transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 7l3-4 3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[10px] text-(--color-text-muted) leading-none select-none">{cat.order}</span>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label="Доош"
            className="flex h-4 w-4 items-center justify-center text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-25 transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3l3 4 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </td>
      <td className="w-10 px-2 py-2.5"><span className="text-base" aria-hidden="true">{cat.icon}</span></td>
      <td className="px-3 py-2.5"><p className="text-xs font-medium text-(--color-text)">{cat.name}</p></td>
      <td className="px-3 py-2.5 text-[11px] text-(--color-text-muted) font-mono">{cat.slug}</td>
      <td className="px-3 py-2.5 text-xs text-(--color-text-secondary)">{cat.templateCount}</td>
      <td className="px-3 py-2.5"><Toggle checked={cat.active} onChange={onToggleActive} /></td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <button type="button" onClick={onEdit}
            className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-border) px-2 text-[10px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors">
            Засах
          </button>
          <button type="button" onClick={onDelete}
            className="flex h-6 items-center rounded-(--radius-ctrl) border border-danger/30 px-2 text-[10px] text-(--color-danger) hover:bg-(--color-danger-soft) transition-colors">
            Устгах
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  useEffect(() => {
    void loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCategories() {
    setLoading(true);
    const [{ data: catRows }, { data: tplRows }] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name_mn, slug, icon, sort_order, is_active")
        .order("sort_order", { ascending: true }),
      supabase.from("templates").select("category_id"),
    ]);

    const counts: Record<string, number> = {};
    for (const t of tplRows ?? []) {
      if (t.category_id) counts[t.category_id as string] = (counts[t.category_id as string] ?? 0) + 1;
    }

    setCategories((catRows ?? []).map((r: Record<string, unknown>) => rowToAdminCategory(r, counts)));
    setLoading(false);
  }

  async function handleSave(data: { name: string; slug: string; icon: string; active: boolean }) {
    if (modalMode === "create") {
      const nextOrder = Math.max(0, ...categories.map((c) => c.order)) + 1;
      const { data: row, error } = await supabase
        .from("categories")
        .insert({ name_mn: data.name, slug: data.slug, icon: data.icon, is_active: data.active, sort_order: nextOrder })
        .select("id, name_mn, slug, icon, sort_order, is_active")
        .single();
      if (!error && row) {
        const newCat = rowToAdminCategory(row as Record<string, unknown>, {});
        setCategories((prev) => [...prev, newCat]);
      }
    } else if (modalMode === "edit" && editTarget) {
      const { error } = await supabase
        .from("categories")
        .update({ name_mn: data.name, slug: data.slug, icon: data.icon, is_active: data.active })
        .eq("id", editTarget.id);
      if (!error) {
        setCategories((prev) =>
          prev.map((c) => c.id === editTarget.id ? { ...c, ...data, name: data.name, active: data.active } : c),
        );
      }
    }
    setModalMode(null);
    setEditTarget(null);
  }

  async function handleDelete(cat: AdminCategory) {
    await supabase.from("categories").delete().eq("id", cat.id);
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
  }

  async function handleToggleActive(id: string) {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newActive = !cat.active;
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: newActive } : c));
    await supabase.from("categories").update({ is_active: newActive }).eq("id", id);
  }

  async function moveUp(index: number) {
    if (index === 0) return;
    const next = [...categories];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const reordered = next.map((c, i) => ({ ...c, order: i + 1 }));
    setCategories(reordered);
    for (const c of reordered) {
      await supabase.from("categories").update({ sort_order: c.order }).eq("id", c.id);
    }
  }

  async function moveDown(index: number) {
    if (index >= categories.length - 1) return;
    const next = [...categories];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const reordered = next.map((c, i) => ({ ...c, order: i + 1 }));
    setCategories(reordered);
    for (const c of reordered) {
      await supabase.from("categories").update({ sort_order: c.order }).eq("id", c.id);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
        <PageHeader
          title="Ангилал"
          subtitle={loading ? "Уншиж байна..." : `${categories.length} ангилал`}
          actions={
            <Button variant="accent" size="sm" onClick={() => setModalMode("create")}>
              + Ангилал нэмэх
            </Button>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-soft)">
                  <th className="px-2 py-2.5 text-left font-medium text-(--color-text-secondary) w-12">Дараалал</th>
                  <th className="px-2 py-2.5 text-left font-medium text-(--color-text-secondary) w-10"></th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Нэр</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Slug</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Загвар</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Идэвхтэй</th>
                  <th className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-xs text-(--color-text-muted)">
                      Ангилал байхгүй байна
                    </td>
                  </tr>
                ) : categories.map((cat, i) => (
                  <CategoryRow
                    key={cat.id}
                    cat={cat}
                    index={i}
                    total={categories.length}
                    onMoveUp={() => void moveUp(i)}
                    onMoveDown={() => void moveDown(i)}
                    onEdit={() => { setEditTarget(cat); setModalMode("edit"); }}
                    onDelete={() => setDeleteTarget(cat)}
                    onToggleActive={() => void handleToggleActive(cat.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalMode !== null}
        onClose={() => { setModalMode(null); setEditTarget(null); }}
        title={modalMode === "create" ? "Ангилал нэмэх" : "Ангилал засварлах"}
        size="sm"
      >
        <CategoryForm
          initial={editTarget ?? undefined}
          onSave={(d) => void handleSave(d)}
          onCancel={() => { setModalMode(null); setEditTarget(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) void handleDelete(deleteTarget); }}
        title="Ангилал устгах уу?"
        message={`"${deleteTarget?.name}" ангиллыг устгах уу? ${deleteTarget?.templateCount ? `${deleteTarget.templateCount} загвар хамаарна.` : ""}`}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
