import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchPublishedTemplateBySlug } from "@/lib/db/templates";
import { CreateFlow } from "./_CreateFlow";

interface Props {
  params: Promise<{ templateSlug: string }>;
}

export default async function CreatePage({ params }: Props) {
  const { templateSlug } = await params;
  const template = await fetchPublishedTemplateBySlug(templateSlug);

  if (!template) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
        </div>
      }
    >
      <CreateFlow template={template} />
    </Suspense>
  );
}
