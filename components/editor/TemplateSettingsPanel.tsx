"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { createClient } from "@/lib/supabase/client";
import type { InviteTemplate, TemplateCategory } from "@/types/template";

interface Props {
  template: InviteTemplate;
  categories: TemplateCategory[];
  onChange: (patch: Partial<Omit<InviteTemplate, "fields">>) => void;
  onStatusToggle: () => void;
  togglingStatus?: boolean;
}

const CANVAS_PRESETS = [
  { label: "Story", width: 1080, height: 1920 },
  { label: "Square", width: 1080, height: 1080 },
  { label: "Landscape", width: 1920, height: 1080 },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--color-border-muted)", margin: "4px 0" }} />;
}

export function TemplateSettingsPanel({ template, categories, onChange, onStatusToggle, togglingStatus }: Props) {
  const categoryOptions = categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }));
  const bgInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [bgUploading, setBgUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleBgFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const bucket = "template-backgrounds";
      const path = `${template.id}/background.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

      // Upsert asset row so handleSave can link bg_asset_id
      const assetType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      const { data: asset, error: assetErr } = await supabase
        .from("assets")
        .upsert(
          { bucket, path, type: assetType, size_bytes: file.size },
          { onConflict: "bucket,path", ignoreDuplicates: false },
        )
        .select("id")
        .single();
      if (assetErr) throw assetErr;

      onChange({ backgroundUrl: urlData.publicUrl, pendingBgAssetId: asset.id });
    } catch {
      setUploadError("Фон оруулахад алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setBgUploading(false);
      if (bgInputRef.current) bgInputRef.current.value = "";
    }
  }

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
      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

      const assetType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      const { data: asset, error: assetErr } = await supabase
        .from("assets")
        .upsert(
          { bucket, path, type: assetType, size_bytes: file.size },
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

  const isCustomPreset = !CANVAS_PRESETS.some(
    (p) => p.width === template.canvasWidth && p.height === template.canvasHeight,
  );

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        fontSize: 12,
      }}
    >
      {/* Settings sections */}
      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Section: Загварын тохиргоо */}
        <div>
          <SectionTitle>Загварын тохиргоо</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Input
              label="Нэр"
              value={template.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Загварын нэр"
            />
            <Input
              label="Slug"
              value={template.slug}
              onChange={(e) => onChange({ slug: e.target.value })}
              placeholder="zagvar-ner"
            />
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                Ангилал
              </p>
              <FilterSelect
                value={template.categoryId}
                onChange={(v) => onChange({ categoryId: v })}
                options={categoryOptions}
                className="w-full"
              />
            </div>
            {/* Type segment */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                Төрөл
              </p>
              <div style={{ display: "flex", gap: 4 }}>
                {(["image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onChange({ type: t })}
                    style={{
                      flex: 1,
                      height: 28,
                      borderRadius: "var(--radius-ctrl)",
                      border: `1px solid ${template.type === t ? "var(--color-accent)" : "var(--color-border)"}`,
                      background: template.type === t ? "var(--color-accent-soft)" : "var(--color-surface)",
                      color: template.type === t ? "var(--color-accent)" : "var(--color-text-secondary)",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {t === "image" ? "Зураг" : "Видео"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Section: Фон файл */}
        <div>
          <SectionTitle>Фон файл</SectionTitle>
          {template.backgroundUrl ? (
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-ctrl)",
                padding: "8px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.backgroundUrl}
                alt=""
                style={{ width: 32, height: 48, objectFit: "cover", borderRadius: 3, flexShrink: 0 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 11, color: "var(--color-text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  background.svg
                </p>
                <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                  {template.canvasWidth}×{template.canvasHeight}
                </p>
              </div>
            </div>
          ) : null}
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={handleBgFileChange}
          />
          <button
            type="button"
            disabled={bgUploading}
            onClick={() => { setUploadError(null); bgInputRef.current?.click(); }}
            style={{
              width: "100%",
              height: 28,
              borderRadius: "var(--radius-ctrl)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: bgUploading ? "var(--color-text-muted)" : "var(--color-text-secondary)",
              fontSize: 11,
              cursor: bgUploading ? "default" : "pointer",
              marginBottom: 8,
            }}
          >
            {bgUploading ? "Байршуулж байна..." : template.backgroundUrl ? "Фон солих" : "Фон оруулах"}
          </button>

          {/* Thumbnail upload */}
          <SectionTitle>Thumbnail</SectionTitle>
          {template.thumbnailUrl ? (
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-ctrl)",
                padding: "8px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.thumbnailUrl}
                alt=""
                style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 3, flexShrink: 0 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <p style={{ fontSize: 11, color: "var(--color-text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                thumbnail
              </p>
            </div>
          ) : null}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleThumbFileChange}
          />
          <button
            type="button"
            disabled={thumbUploading}
            onClick={() => { setUploadError(null); thumbInputRef.current?.click(); }}
            style={{
              width: "100%",
              height: 28,
              borderRadius: "var(--radius-ctrl)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: thumbUploading ? "var(--color-text-muted)" : "var(--color-text-secondary)",
              fontSize: 11,
              cursor: thumbUploading ? "default" : "pointer",
              marginBottom: uploadError ? 4 : 0,
            }}
          >
            {thumbUploading ? "Байршуулж байна..." : template.thumbnailUrl ? "Thumbnail солих" : "Thumbnail оруулах"}
          </button>
          {uploadError && (
            <p style={{ fontSize: 10, color: "var(--color-danger)", marginTop: 4 }}>{uploadError}</p>
          )}
        </div>

        <Divider />

        {/* Section: Canvas хэмжээ */}
        <div>
          <SectionTitle>Canvas хэмжээ</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {CANVAS_PRESETS.map((p) => {
              const isActive = template.canvasWidth === p.width && template.canvasHeight === p.height;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onChange({ canvasWidth: p.width, canvasHeight: p.height })}
                  style={{
                    padding: "6px 4px",
                    borderRadius: "var(--radius-ctrl)",
                    border: `1.5px solid ${isActive ? "var(--color-accent)" : "var(--color-border)"}`,
                    background: isActive ? "var(--color-accent-soft)" : "var(--color-surface)",
                    color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                    fontSize: 10,
                    cursor: "pointer",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{p.label}</div>
                  <div style={{ opacity: 0.7 }}>{p.width}×{p.height}</div>
                </button>
              );
            })}
            <button
              type="button"
              style={{
                padding: "6px 4px",
                borderRadius: "var(--radius-ctrl)",
                border: `1.5px solid ${isCustomPreset ? "var(--color-accent)" : "var(--color-border)"}`,
                background: isCustomPreset ? "var(--color-accent-soft)" : "var(--color-surface)",
                color: isCustomPreset ? "var(--color-accent)" : "var(--color-text-secondary)",
                fontSize: 10,
                cursor: "pointer",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 600 }}>Custom</div>
              <div style={{ opacity: 0.7 }}>...</div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Status toggle (independent of Save) */}
      <div style={{ marginTop: "auto", padding: "12px 14px", borderTop: "1px solid var(--color-border)" }}>
        <button
          type="button"
          disabled={togglingStatus}
          onClick={onStatusToggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "var(--radius-ctrl)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            cursor: togglingStatus ? "default" : "pointer",
            opacity: togglingStatus ? 0.6 : 1,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {togglingStatus ? "Өөрчилж байна..." : (template.status === "published" ? "Идэвхгүй болгох" : "Идэвхтэй болгох")}
          </span>
          {/* Toggle pill */}
          <span
            style={{
              display: "inline-flex",
              width: 28,
              height: 16,
              borderRadius: 8,
              background: template.status === "published" ? "var(--color-success)" : "var(--color-border)",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.18s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 2,
                left: template.status === "published" ? 14 : 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.18s",
              }}
            />
          </span>
        </button>
        <p style={{ marginTop: 6, fontSize: 10, color: "var(--color-text-muted)", lineHeight: 1.4 }}>
          {template.status === "published"
            ? "Идэвхтэй — хэрэглэгчид харагдаж байна"
            : "Идэвхгүй — зөвхөн та харна"}
        </p>
      </div>
    </div>
  );
}
