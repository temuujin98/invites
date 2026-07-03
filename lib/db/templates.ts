import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME } from "@/types/section";
import type {
  SectionTemplate,
  SectionConfig,
  InviteTheme,
  TemplateSummary,
} from "@/types/section";
import type { TemplateCategory } from "@/types/template";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function assetToUrl(asset: { bucket: string; path: string } | null, slug: string): string {
  if (!asset) return `/mock-templates/${slug}.svg`;
  return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.path}`;
}

function firstAsset(raw: unknown): { bucket: string; path: string } | null {
  if (Array.isArray(raw)) return (raw[0] as { bucket: string; path: string } | undefined) ?? null;
  return (raw as { bucket: string; path: string } | null) ?? null;
}

function rowToSummary(row: Record<string, unknown>): TemplateSummary {
  const thumb = firstAsset(row.thumb_asset);
  const slug = row.slug as string;
  return {
    id: row.id as string,
    name: row.name as string,
    slug,
    categoryId: (row.category_id as string) ?? "",
    type: (row.type as "image" | "video") ?? "image",
    status: row.status as "draft" | "published",
    thumbnailUrl: assetToUrl(thumb, slug),
  };
}

function rowToSectionTemplate(row: Record<string, unknown>): SectionTemplate {
  const rawSections = Array.isArray(row.sections) ? row.sections : [];
  const sections: SectionConfig[] = (rawSections as SectionConfig[])
    .slice()
    .sort((a, b) => a.order - b.order);

  const theme: InviteTheme =
    row.theme && typeof row.theme === "object" && !Array.isArray(row.theme)
      ? (row.theme as InviteTheme)
      : DEFAULT_THEME;

  const thumb = firstAsset(row.thumb_asset);
  const slug = row.slug as string;

  return {
    id: row.id as string,
    name: row.name as string,
    slug,
    categoryId: (row.category_id as string) ?? "",
    status: row.status as "draft" | "published",
    sections,
    theme,
    thumbnailUrl: assetToUrl(thumb, slug),
  };
}

// ── Listing: lightweight summaries (no sections/canvas) ──────────────────────
export async function fetchTemplateSummaries(): Promise<TemplateSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, status,
       thumb_asset: assets!thumb_asset_id ( bucket, path )`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => rowToSummary(row as Record<string, unknown>));
}

// ── Detail: full section template by slug ────────────────────────────────────
export async function fetchPublishedSectionTemplateBySlug(
  slug: string,
): Promise<SectionTemplate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, status, sections, theme,
       thumb_asset: assets!thumb_asset_id ( bucket, path )`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;
  return rowToSectionTemplate(data as Record<string, unknown>);
}

// ── Categories (unchanged) ───────────────────────────────────────────────────
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
