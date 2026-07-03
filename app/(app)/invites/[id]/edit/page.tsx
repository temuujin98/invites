import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME } from "@/types/section";
import type { SectionTemplate, SectionConfig, InviteTheme, InviteSectionContent } from "@/types/section";
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
    .select("id, title, share_slug, is_public, status, content, template_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!inviteRow) notFound();

  // Fetch template (sections + theme)
  const { data: tplRow } = await supabase
    .from("templates")
    .select("id, name, slug, category_id, status, sections, theme")
    .eq("id", inviteRow.template_id as string)
    .single();

  if (!tplRow) notFound();

  const rawSections = Array.isArray(tplRow.sections) ? tplRow.sections : [];
  const sections: SectionConfig[] = (rawSections as SectionConfig[])
    .slice()
    .sort((a, b) => a.order - b.order);

  const theme: InviteTheme =
    tplRow.theme && typeof tplRow.theme === "object" && !Array.isArray(tplRow.theme)
      ? (tplRow.theme as InviteTheme)
      : DEFAULT_THEME;

  const sectionTemplate: SectionTemplate = {
    id: tplRow.id as string,
    name: tplRow.name as string,
    slug: tplRow.slug as string,
    categoryId: (tplRow.category_id as string) ?? "",
    status: tplRow.status as "draft" | "published",
    sections,
    theme,
    thumbnailUrl: "",
  };

  const initialContent: InviteSectionContent =
    inviteRow.content && typeof inviteRow.content === "object" && !Array.isArray(inviteRow.content)
      ? (inviteRow.content as InviteSectionContent)
      : {};

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
        template={sectionTemplate}
        initialContent={initialContent}
      />
    </Suspense>
  );
}
