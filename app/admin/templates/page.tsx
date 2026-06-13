import { createClient } from "@/lib/supabase/server";
import type { InviteTemplate, TemplateFieldConfig } from "@/types/template";
import { AdminTemplatesClient } from "./_AdminTemplatesClient";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const { data: rows } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, canvas_width, canvas_height, status,
       bg_asset: assets!bg_asset_id ( bucket, path ),
       thumb_asset: assets!thumb_asset_id ( bucket, path )`,
    )
    .order("created_at", { ascending: false });

  function assetToUrl(asset: { bucket: string; path: string } | null): string {
    if (!asset) return "";
    return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.path}`;
  }

  const templates: InviteTemplate[] = (rows ?? []).map((row) => {
    const bgAsset = Array.isArray(row.bg_asset) ? (row.bg_asset[0] ?? null) : row.bg_asset;
    const thumbAsset = Array.isArray(row.thumb_asset) ? (row.thumb_asset[0] ?? null) : row.thumb_asset;
    const bgUrl = assetToUrl(bgAsset as { bucket: string; path: string } | null) || `/mock-templates/${row.slug}.svg`;
    const thumbUrl = assetToUrl(thumbAsset as { bucket: string; path: string } | null) || bgUrl;
    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      categoryId: row.category_id as string,
      type: row.type as "image" | "video",
      backgroundUrl: bgUrl,
      thumbnailUrl: thumbUrl,
      canvasWidth: Number(row.canvas_width),
      canvasHeight: Number(row.canvas_height),
      status: row.status as "draft" | "published",
      fields: [] as TemplateFieldConfig[],
    };
  });

  return <AdminTemplatesClient initialTemplates={templates} />;
}
