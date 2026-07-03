import { notFound } from "next/navigation";
import Link from "next/link";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { TemplateSectionPreview } from "@/components/public/TemplateSectionPreview";
import {
  fetchPublishedSectionTemplateBySlug,
  fetchTemplateSummaries,
  fetchCategories,
} from "@/lib/db/templates";
import { SECTION_REGISTRY } from "@/lib/sections/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;

  const [template, categories] = await Promise.all([
    fetchPublishedSectionTemplateBySlug(slug),
    fetchCategories(),
  ]);

  if (!template) {
    notFound();
  }

  const category = categories.find((c) => c.id === template.categoryId);

  // Similar templates: same category, excluding current, up to 3
  const allTemplates = await fetchTemplateSummaries();
  const similar = allTemplates
    .filter((t) => t.id !== template.id && t.categoryId === template.categoryId)
    .slice(0, 3);

  // Enabled sections in this template → Mongolian labels from the registry.
  const enabledSections = template.sections.filter((s) => s.enabled);
  const sectionLabels = [
    ...new Set(enabledSections.map((s) => SECTION_REGISTRY[s.type].label)),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-(--color-text-muted)" aria-label="Breadcrumb">
        <Link href="/templates" className="hover:text-(--color-text) transition-colors">
          Загварууд
        </Link>
        <span aria-hidden="true">›</span>
        {category && (
          <>
            <Link
              href={`/templates?category=${category.slug}`}
              className="hover:text-(--color-text) transition-colors"
            >
              {category.name}
            </Link>
            <span aria-hidden="true">›</span>
          </>
        )}
        <span className="text-(--color-text-secondary)">{template.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">

        {/* ── Left: preview ─────────────────────────────── */}
        <div>
          <TemplateSectionPreview template={template} />
        </div>

        {/* ── Right: info + CTA ──────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Category + type badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className="inline-flex items-center gap-1 rounded-md bg-(--color-accent-soft) px-2.5 py-1 text-xs font-medium text-(--color-accent)">
                {category.icon} {category.name}
              </span>
            )}
            <span className="inline-flex items-center rounded-md bg-(--color-surface-soft) border border-(--color-border) px-2.5 py-1 text-xs text-(--color-text-secondary)">
              Гүйлгэдэг урилга
            </span>
          </div>

          {/* Template name */}
          <h1 className="text-2xl font-bold text-(--color-text) md:text-3xl leading-tight">
            {template.name}
          </h1>

          {/* Included sections */}
          <div>
            <p className="mb-3 text-xs font-medium text-(--color-text-secondary)">
              Багтсан хэсгүүд
            </p>
            <div className="flex flex-wrap gap-2">
              {sectionLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-soft) px-2.5 py-1 text-[11px] text-(--color-text-secondary)"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--color-success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,5 4.5,7.5 8,3"/>
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Section count */}
          <p className="text-xs text-(--color-text-muted)">
            {enabledSections.length} хэсэгтэй гүйлгэдэг урилга
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
            <Link
              href={`/create/${template.slug}`}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-6 text-[14px] font-medium text-white transition-colors hover:bg-(--color-accent-hover)"
            >
              Энэ загвараар урилга үүсгэх
            </Link>
          </div>
          <Link
            href="/templates"
            className="text-xs text-(--color-text-muted) hover:text-(--color-text) transition-colors"
          >
            ← Загварууд руу буцах
          </Link>
        </div>
      </div>

      {/* Similar templates */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-(--color-text)">Төстэй загварууд</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {similar.map((tpl) => {
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
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-(--color-border) bg-(--color-surface)/95 backdrop-blur-sm p-4 md:hidden">
        <Link
          href={`/create/${template.slug}`}
          className="flex h-11 w-full items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) text-[15px] font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
        >
          Энэ загвараар урилга үүсгэх
        </Link>
      </div>
      {/* Bottom padding so sticky CTA doesn't overlap content on mobile */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}
