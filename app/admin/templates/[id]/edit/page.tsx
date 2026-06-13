import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateEditorShell } from "@/components/editor/TemplateEditorShell";
import type { InviteTemplate, TemplateFieldConfig } from "@/types/template";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, canvas_width, canvas_height, status,
       bg_asset: assets!bg_asset_id ( id, bucket, path ),
       thumb_asset: assets!thumb_asset_id ( id, bucket, path ),
       template_fields (
         id, key, label, placeholder, type, required,
         x, y, width, height,
         font_family, font_size, font_weight, line_height,
         max_chars, color, align, border_radius, object_fit,
         visible, locked, layer_order
       )`,
    )
    .eq("id", id)
    .single();

  if (!row) {
    redirect("/admin/templates");
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  function assetToUrl(asset: { bucket: string; path: string } | null): string {
    if (!asset) return "";
    return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.path}`;
  }

  const bgAssetRaw = Array.isArray(row.bg_asset) ? (row.bg_asset[0] ?? null) : row.bg_asset;
  const thumbAssetRaw = Array.isArray(row.thumb_asset) ? (row.thumb_asset[0] ?? null) : row.thumb_asset;

  const rawFields: Record<string, unknown>[] = Array.isArray(row.template_fields)
    ? (row.template_fields as Record<string, unknown>[])
    : [];

  const fields: TemplateFieldConfig[] = rawFields.map((f) => ({
    id: f.id as string,
    key: f.key as string,
    label: f.label as string,
    placeholder: (f.placeholder as string | null) ?? undefined,
    type: f.type as TemplateFieldConfig["type"],
    required: Boolean(f.required),
    x: Number(f.x),
    y: Number(f.y),
    width: Number(f.width),
    height: Number(f.height),
    fontFamily: (f.font_family as string | null) ?? undefined,
    fontSize: (f.font_size as number | null) ?? undefined,
    fontWeight: (f.font_weight as number | null) ?? undefined,
    lineHeight: (f.line_height as number | null) ?? undefined,
    maxChars: (f.max_chars as number | null) ?? undefined,
    color: (f.color as string | null) ?? undefined,
    align: (f.align as TemplateFieldConfig["align"]) ?? undefined,
    borderRadius: (f.border_radius as number | null) ?? undefined,
    objectFit: (f.object_fit as TemplateFieldConfig["objectFit"]) ?? undefined,
    visible: Boolean(f.visible),
    locked: Boolean(f.locked),
    layerOrder: Number(f.layer_order),
  }));

  const template: InviteTemplate = {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    categoryId: row.category_id as string,
    type: row.type as "image" | "video",
    backgroundUrl: assetToUrl(bgAssetRaw as { bucket: string; path: string } | null) || `/mock-templates/${row.slug}.svg`,
    thumbnailUrl: assetToUrl(thumbAssetRaw as { bucket: string; path: string } | null) || `/mock-templates/${row.slug}.svg`,
    canvasWidth: Number(row.canvas_width),
    canvasHeight: Number(row.canvas_height),
    status: row.status as "draft" | "published",
    fields: fields.sort((a, b) => a.layerOrder - b.layerOrder),
  };

  return <TemplateEditorShell initialTemplate={template} />;
}
