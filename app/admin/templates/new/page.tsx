import type { InviteTemplate } from "@/types/template";
import { TemplateEditorShell } from "@/components/editor/TemplateEditorShell";

export default function NewTemplatePage() {
  const blankTemplate: InviteTemplate = {
    id: `new-${Date.now()}`,
    name: "Шинэ загвар",
    slug: `new-template-${Date.now().toString(36)}`,
    categoryId: "birthday",
    type: "image",
    backgroundUrl: "",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1920,
    status: "draft",
    fields: [],
  };

  return <TemplateEditorShell initialTemplate={blankTemplate} />;
}
