import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateSectionEditorShell } from "@/components/editor/TemplateSectionEditorShell";
import { fetchCategories } from "@/lib/db/templates";
import type { SectionTemplate, SectionConfig, InviteTheme } from "@/types/section";
import { DEFAULT_THEME } from "@/types/section";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const categories = await fetchCategories();

  const { data: row } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, status, sections, theme,
       thumb_asset: assets!thumb_asset_id ( id, bucket, path )`,
    )
    .eq("id", id)
    .single();

  if (!row) redirect("/admin/templates");

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const thumbAssetRaw = Array.isArray(row.thumb_asset) ? (row.thumb_asset[0] ?? null) : row.thumb_asset;
  const thumbAsset = thumbAssetRaw as { bucket: string; path: string } | null;
  const thumbnailUrl = thumbAsset
    ? `${SUPABASE_URL}/storage/v1/object/public/${thumbAsset.bucket}/${thumbAsset.path}`
    : `/mock-templates/${row.slug}.svg`;

  const sections = (Array.isArray(row.sections) ? row.sections : []) as SectionConfig[];
  const theme = row.theme && typeof row.theme === "object" && Object.keys(row.theme).length > 0
    ? (row.theme as unknown as InviteTheme)
    : DEFAULT_THEME;

  const template: SectionTemplate = {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    categoryId: row.category_id as string,
    status: row.status as "draft" | "published",
    theme,
    sections: sections.sort((a, b) => a.order - b.order),
    thumbnailUrl,
  };

  return <TemplateSectionEditorShell initialTemplate={template} categories={categories} />;
}
