"use client";

import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { SectionRenderer } from "@/components/invite/SectionRenderer";
import type { SectionTemplate } from "@/types/section";

interface TemplateSectionPreviewProps {
  template: SectionTemplate;
}

// Scrolling section preview of a template on the public detail page. Renders the
// section stack in "create" mode (placeholders where content is empty) inside a
// phone frame so guests see the real layout before creating.
export function TemplateSectionPreview({ template }: TemplateSectionPreviewProps) {
  return (
    <div className="flex justify-center md:justify-start">
      <div className="w-full max-w-[280px]">
        <PhonePreviewFrame canvasWidth={390} canvasHeight={844}>
          <div className="h-full overflow-y-auto">
            <SectionRenderer template={template} content={{}} mode="create" />
          </div>
        </PhonePreviewFrame>
      </div>
    </div>
  );
}
