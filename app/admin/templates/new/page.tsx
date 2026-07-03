import type { SectionTemplate } from "@/types/section";
import { DEFAULT_THEME } from "@/types/section";
import { buildSection } from "@/lib/sections/registry";
import { TemplateSectionEditorShell } from "@/components/editor/TemplateSectionEditorShell";
import { fetchCategories } from "@/lib/db/templates";

export default async function NewTemplatePage() {
  const categories = await fetchCategories();

  // Start with a sensible default section stack so the editor isn't empty.
  const starters = ["cover", "countdown", "details", "rsvp", "closing"] as const;
  const sections = starters.map((type, i) => buildSection(type, i));

  const blankTemplate: SectionTemplate = {
    id: `new-${Date.now()}`,
    name: "Шинэ загвар",
    slug: `new-template-${Date.now().toString(36)}`,
    categoryId: categories[0]?.id ?? "",
    status: "draft",
    theme: DEFAULT_THEME,
    sections,
    thumbnailUrl: "",
  };

  return <TemplateSectionEditorShell initialTemplate={blankTemplate} categories={categories} />;
}
