"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
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

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, sort]);

  const filtered = useMemo(() => {
    let list = [...templates];

    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.slug === activeCategory || c.id === activeCategory);
      if (cat) list = list.filter((t) => t.categoryId === cat.id);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          categories
            .find((c) => c.id === t.categoryId)
            ?.name.toLowerCase()
            .includes(q)
      );
    }
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, activeCategory, sort, templates, categories]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = search !== "" || activeCategory !== "all";

  function clearFilters() {
    setSearch("");
    setActiveCategory("all");
    setSort("default");
    setPage(1);
  }

  const CategoryFilters = (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
        Ангилал
      </p>
      <button
        onClick={() => setActiveCategory("all")}
        className={[
          "flex w-full items-center gap-2 rounded-(--radius-ctrl) px-3 py-2 text-left text-sm transition-colors",
          activeCategory === "all"
            ? "bg-(--color-accent-soft) text-(--color-accent) font-medium"
            : "text-(--color-text-secondary) hover:bg-(--color-surface-soft)",
        ].join(" ")}
      >
        <span>🗂️</span>
        <span>Бүгд</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={[
            "flex w-full items-center gap-2 rounded-(--radius-ctrl) px-3 py-2 text-left text-sm transition-colors",
            activeCategory === cat.id
              ? "bg-(--color-accent-soft) text-(--color-accent) font-medium"
              : "text-(--color-text-secondary) hover:bg-(--color-surface-soft)",
          ].join(" ")}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
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

      {/* Toolbar: category chips + search + sort */}
      <div className="mb-6 flex flex-col gap-3">
        {/* Desktop: chips left, search+sort right */}
        <div className="hidden md:flex md:items-start md:justify-between md:gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={[
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border",
                activeCategory === "all"
                  ? "bg-(--color-accent) text-white border-transparent"
                  : "border-(--color-border) text-(--color-text-secondary) hover:border-(--color-text-muted) hover:text-(--color-text)",
              ].join(" ")}
            >
              Бүгд
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={[
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border",
                  activeCategory === cat.id
                    ? "bg-(--color-accent) text-white border-transparent"
                    : "border-(--color-border) text-(--color-text-secondary) hover:border-(--color-text-muted) hover:text-(--color-text)",
                ].join(" ")}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="w-52">
              <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Загвар хайх..." />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-8.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 text-xs text-(--color-text)"
              aria-label="Эрэмбэлэх"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile: search + filter button */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex-1">
            <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Загвар хайх..." />
          </div>
          <Button variant="secondary" size="sm" onClick={() => setFilterDrawerOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Шүүлт
          </Button>
        </div>

        {/* Mobile: category chip scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCategory("all")}
            className={[
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
              activeCategory === "all"
                ? "bg-(--color-accent) text-white border-transparent"
                : "border-(--color-border) text-(--color-text-secondary)",
            ].join(" ")}
          >
            Бүгд
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                activeCategory === cat.id
                  ? "bg-(--color-accent) text-white border-transparent"
                  : "border-(--color-border) text-(--color-text-secondary)",
              ].join(" ")}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Active filter chips */}
        {hasFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-surface-soft) border border-(--color-border) px-3 py-1 text-xs text-(--color-text-secondary)">
                «{search}»
                <button onClick={() => setSearch("")} aria-label="Хайлт арилгах" className="text-(--color-text-muted) hover:text-(--color-text)">×</button>
              </span>
            )}
            {activeCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-accent-soft) border border-(--color-accent)/30 px-3 py-1 text-xs text-(--color-accent)">
                {categories.find((c) => c.id === activeCategory)?.name}
                <button onClick={() => setActiveCategory("all")} aria-label="Ангилал арилгах" className="opacity-60 hover:opacity-100">×</button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-(--color-text-muted) hover:text-(--color-text) underline underline-offset-2"
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
              key={`${activeCategory}-${search}-${sort}-${page}`}
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

        {/* Pagination + count */}
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
          {CategoryFilters}
          <div className="flex flex-col gap-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
              Эрэмбэлэх
            </p>
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSort(o.value)}
                className={[
                  "flex w-full items-center rounded-(--radius-ctrl) px-3 py-2 text-left text-sm transition-colors",
                  sort === o.value
                    ? "bg-(--color-accent-soft) text-(--color-accent) font-medium"
                    : "text-(--color-text-secondary) hover:bg-(--color-surface-soft)",
                ].join(" ")}
              >
                {o.label}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setFilterDrawerOpen(false)}
          >
            Хэрэглэх
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
