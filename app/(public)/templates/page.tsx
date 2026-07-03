import { Suspense } from "react";
import { fetchTemplateSummaries, fetchCategories } from "@/lib/db/templates";
import { TemplatesContent } from "./_TemplatesContent";

async function TemplatesLoader() {
  const [templates, categories] = await Promise.all([
    fetchTemplateSummaries(),
    fetchCategories(),
  ]);
  return <TemplatesContent templates={templates} categories={categories} />;
}

function TemplatesSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6 flex flex-col gap-2">
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
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<TemplatesSkeleton />}>
      <TemplatesLoader />
    </Suspense>
  );
}
