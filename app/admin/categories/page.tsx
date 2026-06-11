"use client";

import { useState } from "react";
import { mockCategories, mockTemplates } from "@/lib/mock-admin-data";
import type { TemplateCategory } from "@/types/template";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// ── Category row with drag handle ─────────────────────────────────────────

interface AdminCategory extends TemplateCategory {
  active: boolean;
  templateCount: number;
}

function buildAdminCategories(cats: TemplateCategory[]): AdminCategory[] {
  return cats.map((c) => ({
    ...c,
    active: true,
    templateCount: mockTemplates.filter((t) => t.categoryId === c.id).length,
  }));
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
            className="h-[34px] w-full rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2 text-center text-base focus:outline-none focus:border-(--color-accent)"
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

// ── Drag-sortable row ─────────────────────────────────────────────────────

function CategoryRow({
  cat,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  cat: AdminCategory;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  return (
    <tr className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-soft) transition-colors">
      {/* Drag handle + order */}
      <td className="w-12 px-2 py-2.5">
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Дээш"
            className="flex h-4 w-4 items-center justify-center text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-25 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 7l3-4 3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[10px] text-(--color-text-muted) leading-none select-none">
            {cat.order}
          </span>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Доош"
            className="flex h-4 w-4 items-center justify-center text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-25 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3l3 4 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </td>
      {/* Icon */}
      <td className="w-10 px-2 py-2.5">
        <span className="text-base" aria-hidden="true">{cat.icon}</span>
      </td>
      {/* Name */}
      <td className="px-3 py-2.5">
        <p className="text-xs font-medium text-(--color-text)">{cat.name}</p>
      </td>
      {/* Slug */}
      <td className="px-3 py-2.5 text-[11px] text-(--color-text-muted) font-mono">{cat.slug}</td>
      {/* Template count */}
      <td className="px-3 py-2.5 text-xs text-(--color-text-secondary)">{cat.templateCount}</td>
      {/* Active toggle */}
      <td className="px-3 py-2.5">
        <Toggle checked={cat.active} onChange={onToggleActive} />
      </td>
      {/* Actions */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-border) px-2 text-[10px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
          >
            Засах
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-6 items-center rounded-(--radius-ctrl) border border-(--color-danger)/30 px-2 text-[10px] text-(--color-danger) hover:bg-(--color-danger-soft) transition-colors"
          >
            Устгах
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(() =>
    buildAdminCategories(mockCategories),
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  function handleSave(data: { name: string; slug: string; icon: string; active: boolean }) {
    if (modalMode === "create") {
      const newCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        active: data.active,
        order: categories.length + 1,
        templateCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    } else if (modalMode === "edit" && editTarget) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editTarget.id ? { ...c, ...data } : c,
        ),
      );
    }
    setModalMode(null);
    setEditTarget(null);
  }

  function handleDelete(cat: AdminCategory) {
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
  }

  function handleToggleActive(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setCategories((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  }

  function moveDown(index: number) {
    setCategories((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
        <PageHeader
          title="Ангилал"
          subtitle={`${categories.length} ангилал`}
          actions={
            <Button variant="accent" size="sm" onClick={() => setModalMode("create")}>
              + Ангилал нэмэх
            </Button>
          }
        />

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
              {categories.map((cat, i) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  index={i}
                  total={categories.length}
                  onMoveUp={() => moveUp(i)}
                  onMoveDown={() => moveDown(i)}
                  onEdit={() => { setEditTarget(cat); setModalMode("edit"); }}
                  onDelete={() => setDeleteTarget(cat)}
                  onToggleActive={() => handleToggleActive(cat.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modalMode !== null}
        onClose={() => { setModalMode(null); setEditTarget(null); }}
        title={modalMode === "create" ? "Ангилал нэмэх" : "Ангилал засварлах"}
        size="sm"
      >
        <CategoryForm
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onCancel={() => { setModalMode(null); setEditTarget(null); }}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        title="Ангилал устгах уу?"
        message={`"${deleteTarget?.name}" ангиллыг устгах уу? ${deleteTarget?.templateCount ? `${deleteTarget.templateCount} загвар хамаарна.` : ""}`}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
