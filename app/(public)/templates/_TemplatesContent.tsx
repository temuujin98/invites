"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import type { InviteTemplate, TemplateCategory } from "@/types/template";

const SORT_OPTIONS = [
  { value: "default", label: "Шинэ эхэндээ" },
  { value: "popular", label: "Их ашиглагдсан" },
  { value: "name-asc", label: "Нэрээр" },
];

const PAGE_SIZE = 8;

interface Props {
  templates: InviteTemplate[];
  categories: TemplateCategory[];
}

export function TemplatesContent({ templates, categories }: Props) {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category");

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!initialCategory || initialCategory === "all") return [];
    const cat = categories.find((c) => c.slug === initialCategory || c.id === initialCategory);
    return cat ? [cat.id] : [];
  });
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Wrappers that reset page — avoids setState-in-effect lint issue
  function changeSearch(v: string) { setSearch(v); setPage(1); }
  function changeSort(v: string) { setSort(v); setPage(1); }
  function changeCategories(next: string[]) { setSelectedCategories(next); setPage(1); }

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name, icon: c.icon })),
    [categories],
  );

  const filtered = useMemo(() => {
    let list = [...templates];

    if (selectedCategories.length > 0) {
      list = list.filter((t) => selectedCategories.includes(t.categoryId));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          categories.find((c) => c.id === t.categoryId)?.name.toLowerCase().includes(q),
      );
    }
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, selectedCategories, sort, templates, categories]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = search !== "" || selectedCategories.length > 0;

  function clearFilters() {
    setSearch("");
    setSelectedCategories([]);
    setSort("default");
    setPage(1);
  }

  const DrawerCategoryFilters = (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
        Ангилал
      </p>
      <button
        onClick={() => changeCategories([])}
        className={[
          "flex w-full items-center gap-2 rounded-(--radius-ctrl) px-3 py-2 text-left text-sm transition-colors",
          selectedCategories.length === 0
            ? "bg-(--color-accent-soft) font-medium text-(--color-accent)"
            : "text-(--color-text-secondary) hover:bg-(--color-surface-soft)",
        ].join(" ")}
      >
        <span>🗂️</span>
        <span>Бүгд</span>
      </button>
      {categories.map((cat) => {
        const checked = selectedCategories.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() =>
              changeCategories(
                checked
                  ? selectedCategories.filter((x) => x !== cat.id)
                  : [...selectedCategories, cat.id],
              )
            }
            className={[
              "flex w-full items-center gap-2 rounded-(--radius-ctrl) px-3 py-2 text-left text-sm transition-colors",
              checked
                ? "bg-(--color-accent-soft) font-medium text-(--color-accent)"
                : "text-(--color-text-secondary) hover:bg-(--color-surface-soft)",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                checked
                  ? "border-(--color-accent) bg-(--color-accent) text-white"
                  : "border-(--color-border) bg-(--color-surface)",
              ].join(" ")}
            >
              {checked && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-(--color-text)">Загварууд</h1>
        <p className="mt-1.5 text-[13px] text-(--color-text-secondary)">
          {templates.length} загвараас баярт тань тохирохыг олоорой
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3">
        {/* Desktop: MultiSelect left, search + sort right */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
          <MultiSelect
            values={selectedCategories}
            onChange={changeCategories}
            options={categoryOptions}
            placeholder="Бүх ангилал"
            countNoun="ангилал"
          />
          <div className="flex shrink-0 items-center gap-2">
            <div className="w-52">
              <SearchInput value={search} onChange={changeSearch} placeholder="Загвар хайх..." />
            </div>
            <FilterSelect value={sort} onChange={changeSort} options={SORT_OPTIONS} />
          </div>
        </div>

        {/* Mobile: search + filter button */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex-1">
            <SearchInput value={search} onChange={changeSearch} placeholder="Загвар хайх..." />
          </div>
          <Button variant="secondary" size="sm" onClick={() => setFilterDrawerOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Шүүлт
            {selectedCategories.length > 0 && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-accent) text-[10px] text-white">
                {selectedCategories.length}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile: MultiSelect dropdown below search */}
        <div className="md:hidden">
          <MultiSelect
            values={selectedCategories}
            onChange={changeCategories}
            options={categoryOptions}
            placeholder="Бүх ангилал"
            countNoun="ангилал"
            className="w-full"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Active filter chips */}
        {hasFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-soft) px-3 py-1 text-xs text-(--color-text-secondary)">
                «{search}»
                <button onClick={() => changeSearch("")} aria-label="Хайлт арилгах" className="text-(--color-text-muted) hover:text-(--color-text)">×</button>
              </span>
            )}
            {selectedCategories.map((id) => (
              <span key={id} className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-(--color-accent-soft) px-3 py-1 text-xs text-(--color-accent)">
                {categories.find((c) => c.id === id)?.name}
                <button
                  onClick={() => changeCategories(selectedCategories.filter((x) => x !== id))}
                  aria-label="Ангилал арилгах"
                  className="opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-(--color-text-muted) underline underline-offset-2 hover:text-(--color-text)"
            >
              Бүгдийг арилгах
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="mb-4 text-xs text-(--color-text-muted)">
          {filtered.length} загвар олдлоо
        </p>

        {/* Grid */}
        {paginated.length === 0 ? (
          <EmptyState
            title="Загвар олдсонгүй"
            description="Хайлт эсвэл шүүлтүүрийн нөхцөлд тохирох загвар байхгүй байна."
            action={
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Шүүлтүүр арилгах
              </Button>
            }
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategories.join(",")}-${search}-${sort}-${page}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
            >
              {paginated.map((tpl) => {
                const cat = categories.find((c) => c.id === tpl.categoryId);
                return (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    category={cat}
                    href={`/templates/${tpl.slug}`}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <span className="text-[11px] text-(--color-text-muted)">
              {filtered.length}-аас {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}-г харуулж байна
            </span>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Шүүлтүүр"
      >
        <div className="flex flex-col gap-6 p-4">
          {DrawerCategoryFilters}
          <div className="flex flex-col gap-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
              Эрэмбэлэх
            </p>
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => changeSort(o.value)}
                className={[
                  "flex w-full items-center rounded-(--radius-ctrl) px-3 py-2 text-left text-sm transition-colors",
                  sort === o.value
                    ? "bg-(--color-accent-soft) font-medium text-(--color-accent)"
                    : "text-(--color-text-secondary) hover:bg-(--color-surface-soft)",
                ].join(" ")}
              >
                {o.label}
              </button>
            ))}
          </div>
          <Button variant="primary" className="w-full" onClick={() => setFilterDrawerOpen(false)}>
            Хэрэглэх
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
