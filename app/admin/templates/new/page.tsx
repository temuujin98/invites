import type { InviteTemplate } from "@/types/template";
import { TemplateEditorShell } from "@/components/editor/TemplateEditorShell";
import { fetchCategories } from "@/lib/db/templates";

export default async function NewTemplatePage() {
  const categories = await fetchCategories();

  const blankTemplate: InviteTemplate = {
    id: `new-${Date.now()}`,
    name: "Шинэ загвар",
    slug: `new-template-${Date.now().toString(36)}`,
    categoryId: categories[0]?.id ?? "",
    type: "image",
    backgroundUrl: "",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1920,
    status: "draft",
    fields: [],
  };

  return <TemplateEditorShell initialTemplate={blankTemplate} categories={categories} />;
}
