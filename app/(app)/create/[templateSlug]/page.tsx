import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME } from "@/types/section";
import type { SectionTemplate, SectionConfig, InviteTheme } from "@/types/section";
import { CreateFlow } from "./_CreateFlow";

interface Props {
  params: Promise<{ templateSlug: string }>;
}

async function fetchSectionTemplate(slug: string): Promise<SectionTemplate | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("templates")
    .select("id, name, slug, category_id, status, sections, theme")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;

  const rawSections = Array.isArray(data.sections) ? data.sections : [];
  const sections: SectionConfig[] = (rawSections as SectionConfig[])
    .slice()
    .sort((a, b) => a.order - b.order);

  const theme: InviteTheme =
    data.theme && typeof data.theme === "object" && !Array.isArray(data.theme)
      ? (data.theme as InviteTheme)
      : DEFAULT_THEME;

  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    categoryId: (data.category_id as string) ?? "",
    status: data.status as "draft" | "published",
    sections,
    theme,
    thumbnailUrl: "",
  };
}

export default async function CreatePage({ params }: Props) {
  const { templateSlug } = await params;
  const template = await fetchSectionTemplate(templateSlug);

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
