"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { createClient } from "@/lib/supabase/client";
import type { SectionTemplate } from "@/types/section";
import type { TemplateCategory } from "@/types/template";

interface Props {
  template: SectionTemplate;
  categories: TemplateCategory[];
  onChange: (patch: Partial<Omit<SectionTemplate, "sections" | "theme">>) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
      {children}
    </p>
  );
}

export function TemplateBasicsPanel({ template, categories, onChange }: Props) {
  const categoryOptions = categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }));
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleThumbFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const bucket = "template-thumbnails";
      const path = `${template.id}/thumbnail.${ext}`;
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      const { data: asset, error: assetErr } = await supabase
        .from("assets")
        .upsert(
          { bucket, path, type: "image", size_bytes: file.size },
          { onConflict: "bucket,path", ignoreDuplicates: false },
        )
        .select("id")
        .single();
      if (assetErr) throw assetErr;
      onChange({ thumbnailUrl: urlData.publicUrl, pendingThumbAssetId: asset.id });
    } catch {
      setUploadError("Thumbnail оруулахад алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setThumbUploading(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  }

  return (
    <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16, borderBottom: "1px solid var(--color-border)" }}>
      <div>
        <SectionTitle>Загварын нэр</SectionTitle>
        <Input
          value={template.name}
          placeholder="Жишээ: Сонгодог хурим"
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div>
        <SectionTitle>Slug</SectionTitle>
        <Input
          value={template.slug}
          placeholder="wedding-classic"
          onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
        />
      </div>

      <div>
        <SectionTitle>Ангилал</SectionTitle>
        <FilterSelect
          value={template.categoryId}
          options={categoryOptions}
          onChange={(v) => onChange({ categoryId: v })}
        />
      </div>

      <div>
        <SectionTitle>Thumbnail зураг</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {template.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={template.thumbnailUrl}
              alt=""
              style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1px solid var(--color-border)" }}
            />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--color-surface-soft)", border: "1px solid var(--color-border)" }} />
          )}
          <button
            type="button"
            onClick={() => thumbInputRef.current?.click()}
            disabled={thumbUploading}
            style={{
              height: 30,
              paddingInline: 12,
              borderRadius: "var(--radius-ctrl)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontSize: 11,
              cursor: thumbUploading ? "default" : "pointer",
            }}
          >
            {thumbUploading ? "Оруулж байна..." : "Зураг сонгох"}
          </button>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleThumbFileChange}
          />
        </div>
        {uploadError && <p style={{ fontSize: 11, color: "var(--color-danger)", marginTop: 6 }}>{uploadError}</p>}
      </div>
    </div>
  );
}
