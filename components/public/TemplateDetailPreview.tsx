"use client";

import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import type { InviteTemplate } from "@/types/template";

interface TemplateDetailPreviewProps {
  template: InviteTemplate;
}

export function TemplateDetailPreview({ template }: TemplateDetailPreviewProps) {
  return (
    <div className="flex justify-center md:justify-start">
      <div className="w-full max-w-[260px]">
        <PhonePreviewFrame>
          <InviteRenderer
            template={template}
            values={{}}
            mode="preview"
            showSampleData
          />
        </PhonePreviewFrame>
      </div>
    </div>
  );
}
