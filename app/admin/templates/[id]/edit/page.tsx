import { redirect } from "next/navigation";
import { mockTemplates } from "@/lib/mock-data";
import { TemplateEditorShell } from "@/components/editor/TemplateEditorShell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: Props) {
  const { id } = await params;
  const template = mockTemplates.find((t) => t.id === id);

  if (!template) {
    redirect("/admin/templates");
  }

  return <TemplateEditorShell initialTemplate={template} />;
}
