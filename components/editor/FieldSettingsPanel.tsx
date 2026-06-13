"use client";

import type { TemplateFieldConfig, FieldType } from "@/types/template";

interface Props {
  field: TemplateFieldConfig;
  onUpdate: (patch: Partial<TemplateFieldConfig>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const TYPE_LABELS: Record<FieldType, string> = {
  text: "Текст",
  date: "Огноо",
  time: "Цаг",
  location: "Байршил",
  image: "Зураг",
  qr: "QR код",
  rsvp: "RSVP",
  custom: "Захиалгат",
};

function SettingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 10,
        color: "var(--color-text-muted)",
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  );
}

function MiniInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number" | "color";
  placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {label && <SettingLabel>{label}</SettingLabel>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 26,
          width: "100%",
          padding: "0 6px",
          borderRadius: "var(--radius-ctrl)",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          color: "var(--color-text)",
          fontSize: 11,
          fontFamily: type === "text" ? "inherit" : undefined,
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = "var(--color-accent)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = "var(--color-border)";
        }}
      />
    </div>
  );
}

function Row({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {label && <SettingLabel>{label}</SettingLabel>}
      <div style={{ display: "flex", gap: 4 }}>{children}</div>
    </div>
  );
}

function SectionTitle({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {children}
      </span>
      {actions}
    </div>
  );
}

function AlignBtn({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        height: 26,
        border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
        background: active ? "var(--color-accent-soft)" : "var(--color-surface)",
        color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
        borderRadius: "var(--radius-ctrl)",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );
}

export function FieldSettingsPanel({ field, onUpdate, onDuplicate, onDelete }: Props) {
  const isTextLike = ["text", "date", "time", "location", "custom", "rsvp"].includes(field.type);

  function numVal(v: number | undefined, fallback: number): number {
    return v ?? fallback;
  }

  return (
    <div
      style={{
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontSize: 12,
      }}
    >
      <SectionTitle
        actions={
          <div style={{ display: "flex", gap: 4 }}>
            <button
              type="button"
              title="Хуулах"
              onClick={onDuplicate}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 5px",
                fontSize: 11,
                color: "var(--color-text-secondary)",
                borderRadius: 4,
              }}
            >
              ⎘
            </button>
            <button
              type="button"
              title="Устгах"
              onClick={onDelete}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 5px",
                fontSize: 11,
                color: "var(--color-danger)",
                borderRadius: 4,
              }}
            >
              ✕
            </button>
          </div>
        }
      >
        Талбарын тохиргоо
      </SectionTitle>

      {/* Type + Key badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 8px",
          background: "var(--color-bg)",
          borderRadius: "var(--radius-ctrl)",
          border: "1px solid var(--color-border-muted)",
        }}
      >
        <span
          data-field-key={field.key}
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "var(--color-text)",
            fontWeight: 600,
          }}
        >
          {field.key}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--color-text-muted)",
            fontWeight: 500,
          }}
        >
          {TYPE_LABELS[field.type]}
        </span>
      </div>

      {/* Label + Placeholder */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <MiniInput
          label="Шошго"
          value={field.label}
          onChange={(v) => onUpdate({ label: v })}
        />
        <MiniInput
          label="Placeholder"
          value={field.placeholder ?? ""}
          onChange={(v) => onUpdate({ placeholder: v })}
        />
      </div>

      {/* Required toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "3px 0",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--color-text)" }}>Заавал</span>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            style={{ accentColor: "var(--color-accent)" }}
          />
        </label>
      </div>

      {/* X / Y / W / H */}
      <div>
        <SettingLabel>Байрлал ба хэмжээ</SettingLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginTop: 4 }}>
          <MiniInput
            label="X"
            value={field.x}
            type="number"
            onChange={(v) => onUpdate({ x: Math.round(Number(v)) })}
          />
          <MiniInput
            label="Y"
            value={field.y}
            type="number"
            onChange={(v) => onUpdate({ y: Math.round(Number(v)) })}
          />
          <MiniInput
            label="W"
            value={field.width}
            type="number"
            onChange={(v) => onUpdate({ width: Math.round(Number(v)) })}
          />
          <MiniInput
            label="H"
            value={field.height}
            type="number"
            onChange={(v) => onUpdate({ height: Math.round(Number(v)) })}
          />
        </div>
      </div>

      {/* Text settings */}
      {isTextLike && (
        <>
          {/* Font family + weight */}
          <Row label="Фонт">
            <div style={{ flex: 2 }}>
              <input
                type="text"
                value={field.fontFamily ?? ""}
                placeholder="Фонтын нэр"
                onChange={(e) => onUpdate({ fontFamily: e.target.value || undefined })}
                style={{
                  height: 26,
                  width: "100%",
                  padding: "0 6px",
                  borderRadius: "var(--radius-ctrl)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  fontSize: 11,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <select
                value={numVal(field.fontWeight, 400)}
                onChange={(e) => onUpdate({ fontWeight: Number(e.target.value) })}
                style={{
                  height: 26,
                  width: "100%",
                  padding: "0 4px",
                  borderRadius: "var(--radius-ctrl)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  fontSize: 11,
                  outline: "none",
                }}
              >
                {[300, 400, 500, 600, 700, 800].map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </Row>

          {/* Size / Line height / Max chars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            <MiniInput
              label="Хэмжээ"
              value={numVal(field.fontSize, 32)}
              type="number"
              onChange={(v) => onUpdate({ fontSize: Number(v) })}
            />
            <MiniInput
              label="Мөр өндөр"
              value={numVal(field.lineHeight, 1.3)}
              type="number"
              onChange={(v) => onUpdate({ lineHeight: Number(v) })}
            />
            <MiniInput
              label="Max тэмдэгт"
              value={numVal(field.maxChars, 0)}
              type="number"
              onChange={(v) => onUpdate({ maxChars: Number(v) || undefined })}
            />
          </div>

          {/* Color + alignment */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <SettingLabel>Өнгө</SettingLabel>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="color"
                value={field.color ?? "#1F1D1A"}
                onChange={(e) => onUpdate({ color: e.target.value })}
                style={{
                  width: 26,
                  height: 26,
                  border: "1px solid var(--color-border)",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: 2,
                  background: "none",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                value={field.color ?? "#1F1D1A"}
                onChange={(e) => onUpdate({ color: e.target.value })}
                style={{
                  flex: 1,
                  height: 26,
                  padding: "0 6px",
                  borderRadius: "var(--radius-ctrl)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  fontSize: 11,
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Alignment */}
          <div>
            <SettingLabel>Тэгшлэх</SettingLabel>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              <AlignBtn
                active={field.align === "left"}
                label="Зүүн"
                onClick={() => onUpdate({ align: "left" })}
              />
              <AlignBtn
                active={(field.align ?? "center") === "center"}
                label="Төв"
                onClick={() => onUpdate({ align: "center" })}
              />
              <AlignBtn
                active={field.align === "right"}
                label="Баруун"
                onClick={() => onUpdate({ align: "right" })}
              />
            </div>
          </div>
        </>
      )}

      {/* Border radius for image */}
      {field.type === "image" && (
        <MiniInput
          label="Булангийн радиус"
          value={numVal(field.borderRadius, 0)}
          type="number"
          onChange={(v) => onUpdate({ borderRadius: Number(v) })}
        />
      )}
    </div>
  );
}
