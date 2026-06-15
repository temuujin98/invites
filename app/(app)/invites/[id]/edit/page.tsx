import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { fetchPublishedTemplateBySlug } from "@/lib/db/templates";
import type { InviteValues, TemplateFieldConfig } from "@/types/template";
import { EditFlow } from "./_EditFlow";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInvitePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Fetch invite (must belong to this user)
  const { data: inviteRow } = await supabase
    .from("invites")
    .select("id, title, share_slug, is_public, template_id, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!inviteRow) notFound();

  // Fetch saved field values
  const { data: valueRows } = await supabase
    .from("invite_values")
    .select("field_key, value_text, value_asset_url")
    .eq("invite_id", id);

  const initialValues: InviteValues = {};
  for (const row of valueRows ?? []) {
    initialValues[row.field_key as string] = {
      text: (row.value_text as string | null) ?? undefined,
      assetUrl: (row.value_asset_url as string | null) ?? undefined,
    };
  }

  // Fetch the real template by template_id (with fields)
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const { data: tplRow } = await supabase
    .from("templates")
    .select(
      `id, name, slug, category_id, type, canvas_width, canvas_height, status,
       bg_asset: assets!bg_asset_id ( bucket, path ),
       thumb_asset: assets!thumb_asset_id ( bucket, path ),
       fields: template_fields ( id, key, label, placeholder, type, required, x, y, width, height,
         font_family, font_size, font_weight, line_height, max_chars, color, align,
         border_radius, object_fit, visible, locked, layer_order )`,
    )
    .eq("id", inviteRow.template_id as string)
    .single();

  if (!tplRow) notFound();

  function assetToUrl(asset: { bucket: string; path: string } | null): string {
    if (!asset) return "";
    return `${SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.path}`;
  }

  const bgAsset = Array.isArray(tplRow.bg_asset) ? (tplRow.bg_asset[0] ?? null) : tplRow.bg_asset;
  const thumbAsset = Array.isArray(tplRow.thumb_asset) ? (tplRow.thumb_asset[0] ?? null) : tplRow.thumb_asset;
  const rawFields: Record<string, unknown>[] = Array.isArray(tplRow.fields)
    ? (tplRow.fields as Record<string, unknown>[])
    : [];

  const fields: TemplateFieldConfig[] = rawFields
    .map((f) => ({
      id: f.id as string,
      key: f.key as string,
      label: f.label as string,
      placeholder: (f.placeholder as string | null) ?? undefined,
      type: f.type as TemplateFieldConfig["type"],
      required: Boolean(f.required),
      x: Number(f.x), y: Number(f.y),
      width: Number(f.width), height: Number(f.height),
      fontFamily: (f.font_family as string | null) ?? undefined,
      fontSize: f.font_size != null ? Number(f.font_size) : undefined,
      fontWeight: f.font_weight != null ? Number(f.font_weight) : undefined,
      lineHeight: f.line_height != null ? Number(f.line_height) : undefined,
      maxChars: f.max_chars != null ? Number(f.max_chars) : undefined,
      color: (f.color as string | null) ?? undefined,
      align: (f.align as TemplateFieldConfig["align"]) ?? undefined,
      borderRadius: f.border_radius != null ? Number(f.border_radius) : undefined,
      objectFit: (f.object_fit as TemplateFieldConfig["objectFit"]) ?? undefined,
      visible: Boolean(f.visible),
      locked: Boolean(f.locked),
      layerOrder: Number(f.layer_order),
    }))
    .sort((a, b) => a.layerOrder - b.layerOrder);

  const bgUrl = assetToUrl(bgAsset as { bucket: string; path: string } | null) || `/mock-templates/${tplRow.slug}.svg`;

  const template = {
    id: tplRow.id as string,
    name: tplRow.name as string,
    slug: tplRow.slug as string,
    categoryId: (tplRow.category_id as string) ?? "",
    type: tplRow.type as "image" | "video",
    backgroundUrl: bgUrl,
    thumbnailUrl: assetToUrl(thumbAsset as { bucket: string; path: string } | null) || bgUrl,
    canvasWidth: Number(tplRow.canvas_width),
    canvasHeight: Number(tplRow.canvas_height),
    status: tplRow.status as "draft" | "published",
    fields,
  };

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
        </div>
      }
    >
      <EditFlow
        inviteId={id}
        inviteTitle={inviteRow.title as string}
        shareSlug={inviteRow.share_slug as string}
        isPublic={Boolean(inviteRow.is_public)}
        template={template}
        initialValues={initialValues}
      />
    </Suspense>
  );
}
