import { createClient } from "@/lib/supabase/server";
import type { InviteTemplate, TemplateCategory, TemplateFieldConfig } from "@/types/template";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function assetToUrl(asset: { bucket: string; path: string } | null): string {
  if (!asset) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.path}`;
}

function rowToTemplate(row: Record<string, unknown>): InviteTemplate {
  const bgAsset = Array.isArray(row.bg_asset) ? (row.bg_asset[0] ?? null) : (row.bg_asset as { bucket: string; path: string } | null);
  const thumbAsset = Array.isArray(row.thumb_asset) ? (row.thumb_asset[0] ?? null) : (row.thumb_asset as { bucket: string; path: string } | null);
  const bgUrl = assetToUrl(bgAsset as { bucket: string; path: string } | null) || `/mock-templates/${row.slug}.svg`;
  const thumbUrl = assetToUrl(thumbAsset as { bucket: string; path: string } | null) || bgUrl;

  const fields: TemplateFieldConfig[] = Array.isArray(row.fields)
    ? (row.fields as Record<string, unknown>[]).map((f) => ({
        id: f.id as string,
        key: f.key as string,
        label: f.label as string,
        placeholder: (f.placeholder as string | undefined) ?? undefined,
        type: f.type as TemplateFieldConfig["type"],
        required: Boolean(f.required),
        x: Number(f.x),
        y: Number(f.y),
        width: Number(f.width),
        height: Number(f.height),
        fontFamily: (f.font_family as string | undefined) ?? undefined,
        fontSize: f.font_size != null ? Number(f.font_size) : undefined,
        fontWeight: f.font_weight != null ? Number(f.font_weight) : undefined,
        lineHeight: f.line_height != null ? Number(f.line_height) : undefined,
        maxChars: f.max_chars != null ? Number(f.max_chars) : undefined,
        color: (f.color as string | undefined) ?? undefined,
        align: (f.align as TemplateFieldConfig["align"]) ?? undefined,
        borderRadius: f.border_radius != null ? Number(f.border_radius) : undefined,
        objectFit: (f.object_fit as TemplateFieldConfig["objectFit"]) ?? undefined,
        visible: Boolean(f.visible),
        locked: Boolean(f.locked),
        layerOrder: Number(f.layer_order),
      }))
    : [];

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    categoryId: (row.category_id as string) ?? "",
    type: row.type as "image" | "video",
    backgroundUrl: bgUrl,
    thumbnailUrl: thumbUrl,
    canvasWidth: Number(row.canvas_width),
    canvasHeight: Number(row.canvas_height),
    status: row.status as "draft" | "published",
    fields,
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  birthday: "🎂",
  wedding: "💍",
  graduation: "🎓",
  corporate: "🏢",
  kids: "🎈",
  other: "🎉",
  baby_shower: "🍼",
  opening: "🎊",
};

export async function fetchPublishedTemplates(): Promise<InviteTemplate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, canvas_width, canvas_height, status,
       bg_asset: assets!bg_asset_id ( bucket, path ),
       thumb_asset: assets!thumb_asset_id ( bucket, path )`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => rowToTemplate(row as Record<string, unknown>));
}

export async function fetchPublishedTemplateBySlug(slug: string): Promise<InviteTemplate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, canvas_width, canvas_height, status,
       bg_asset: assets!bg_asset_id ( bucket, path ),
       thumb_asset: assets!thumb_asset_id ( bucket, path ),
       fields: template_fields ( id, key, label, placeholder, type, required, x, y, width, height,
         font_family, font_size, font_weight, line_height, max_chars, color, align,
         border_radius, object_fit, visible, locked, layer_order )`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;
  return rowToTemplate(data as Record<string, unknown>);
}

export async function fetchCategories(): Promise<TemplateCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name_mn, slug, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name_mn as string,
    slug: row.slug as string,
    icon: CATEGORY_ICONS[row.slug as string] ?? "🎉",
    order: Number(row.sort_order),
  }));
}
