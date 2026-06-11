"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCategories } from "@/lib/mock-data";
import type { InviteTemplate } from "@/types/template";

interface Props {
  template: InviteTemplate;
  onChange: (patch: Partial<Omit<InviteTemplate, "fields">>) => void;
  onPublishToggle: () => void;
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

export function TemplateSettingsPanel({ template, onChange, onPublishToggle }: Props) {
  const categoryOptions = [
    ...mockCategories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })),
  ];

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
            <Select
              label="Ангилал"
              value={template.categoryId}
              onChange={(e) => onChange({ categoryId: e.target.value })}
              options={categoryOptions}
            />
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
          <button
            type="button"
            style={{
              width: "100%",
              height: 28,
              borderRadius: "var(--radius-ctrl)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              fontSize: 11,
              cursor: "pointer",
              marginBottom: 8,
            }}
          >
            {template.backgroundUrl ? "Солих" : "Фон оруулах"}
          </button>

          {/* Thumbnail upload */}
          <div
            style={{
              border: "1px dashed var(--color-border)",
              borderRadius: "var(--radius-ctrl)",
              padding: "10px 8px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <p style={{ fontSize: 10, color: "var(--color-text-muted)", lineHeight: 1.4 }}>
              Зураг оруулах / хоосон бол автоматаар үүснэ
            </p>
          </div>
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

      {/* Bottom: Status + Publish */}
      <div style={{ marginTop: "auto", padding: "12px 14px", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Төлөв</span>
          <Badge variant={template.status === "published" ? "success" : "warning"} size="sm">
            {template.status === "published" ? "Нийтэлсэн" : "Ноорог"}
          </Badge>
        </div>
        <Button
          variant={template.status === "published" ? "secondary" : "accent"}
          size="sm"
          onClick={onPublishToggle}
          style={{ width: "100%" }}
        >
          {template.status === "published" ? "Ноорог болгох" : "Нийтлэх"}
        </Button>
      </div>
    </div>
  );
}
