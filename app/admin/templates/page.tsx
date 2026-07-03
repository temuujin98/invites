import { createClient } from "@/lib/supabase/server";
import type { TemplateSummary } from "@/types/section";
import { AdminTemplatesClient } from "./_AdminTemplatesClient";
import { fetchCategories } from "@/lib/db/templates";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const categories = await fetchCategories();

  // Admin lists ALL statuses (not just published), so query inline here.
  const { data: rows } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, status,
       thumb_asset: assets!thumb_asset_id ( bucket, path )`,
    )
    .order("created_at", { ascending: false });

  function thumbUrl(asset: { bucket: string; path: string } | null, slug: string): string {
    if (!asset) return `/mock-templates/${slug}.svg`;
    return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.path}`;
  }

  const templates: TemplateSummary[] = (rows ?? []).map((row) => {
    const thumbAsset = Array.isArray(row.thumb_asset) ? (row.thumb_asset[0] ?? null) : row.thumb_asset;
    const slug = row.slug as string;
    return {
      id: row.id as string,
      name: row.name as string,
      slug,
      categoryId: row.category_id as string,
      type: row.type as "image" | "video",
      status: row.status as "draft" | "published",
      thumbnailUrl: thumbUrl(thumbAsset as { bucket: string; path: string } | null, slug),
    };
  });

  return <AdminTemplatesClient initialTemplates={templates} categories={categories} />;
}
