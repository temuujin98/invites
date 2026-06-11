"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockTemplates, mockCategories } from "@/lib/mock-data";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

const SORT_OPTIONS = [
  { value: "default", label: "Санал болгох" },
  { value: "name-asc", label: "Нэрээр (А→Я)" },
  { value: "name-desc", label: "Нэрээр (Я→А)" },
];

const PAGE_SIZE = 8;

function TemplateCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full rounded-(--radius-card-lg)" style={{ aspectRatio: "9/16" } as React.CSSProperties} />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

function TemplatesContent() {

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Simulate loading on mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, sort]);

  const filtered = useMemo(() => {
    let list = [...mockTemplates];

    if (activeCategory !== "all") {
      list = list.filter((t) => t.categoryId === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          mockCategories
            .find((c) => c.id === t.categoryId)
            ?.name.toLowerCase()
            .includes(q)
      );
    }
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [search, activeCategory, sort]);

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
      {mockCategories.map((cat) => (
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--color-text) md:text-3xl">Загварууд</h1>
        <p className="mt-1 text-[15px] text-(--color-text-secondary)">
          Арга хэмжээндээ тохирсон загварыг сонго
        </p>
      </div>

      {/* Search + sort row */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <SearchInput
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Загвар хайх..."
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="hidden h-[34px] rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 text-sm text-(--color-text) md:block"
          aria-label="Эрэмбэлэх"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* Mobile filter trigger */}
        <Button
          variant="secondary"
          size="sm"
          className="md:hidden"
          onClick={() => setFilterDrawerOpen(true)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Шүүлтүүр
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar category filter — desktop */}
        <aside className="hidden w-44 shrink-0 md:block">
          {CategoryFilters}
        </aside>

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
                  {mockCategories.find((c) => c.id === activeCategory)?.name}
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
          {!loading && (
            <p className="mb-4 text-xs text-(--color-text-muted)">
              {filtered.length} загвар олдлоо
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <TemplateCardSkeleton key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
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
                  const cat = mockCategories.find((c) => c.id === tpl.categoryId);
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
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
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

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex flex-col gap-2">
            <div className="h-8 w-48 animate-pulse rounded-(--radius-ctrl) bg-(--color-surface-soft)" />
            <div className="h-5 w-72 animate-pulse rounded-(--radius-ctrl) bg-(--color-surface-soft)" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div
                  className="animate-pulse rounded-(--radius-card-lg) bg-(--color-surface-soft)"
                  style={{ aspectRatio: "9/16" }}
                />
                <div className="h-4 w-3/4 animate-pulse rounded bg-(--color-surface-soft)" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
