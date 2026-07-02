"use client";

import type { InviteTheme, ThemeMotion, ThemeRadius } from "@/types/section";

interface Props {
  theme: InviteTheme;
  onChange: (patch: Partial<InviteTheme>) => void;
}

const GOOGLE_FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Roboto",
  "Montserrat",
  "Nunito",
  "Lora",
  "Merriweather",
] as const;

const PALETTE_FIELDS: { key: keyof InviteTheme["palette"]; label: string }[] = [
  { key: "bg",      label: "Дэвсгэр" },
  { key: "surface", label: "Гадаргуу" },
  { key: "text",    label: "Текст" },
  { key: "accent",  label: "Онцлох" },
  { key: "muted",   label: "Бүдэг" },
];

// ── Shared small components ───────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: "var(--color-border-muted)", margin: "4px 0" }} />
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        marginBottom: 4,
      }}
    >
      {children}
    </p>
  );
}

// ── Segmented control ─────────────────────────────────────────────────────────

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              height: 28,
              borderRadius: "var(--radius-ctrl)",
              border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
              background: active ? "var(--color-accent-soft)" : "var(--color-surface)",
              color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function ThemePanel({ theme, onChange }: Props) {
  function patchPalette(key: keyof InviteTheme["palette"], value: string) {
    onChange({ palette: { ...theme.palette, [key]: value } });
  }

  function patchFont(key: keyof InviteTheme["fonts"], value: string) {
    onChange({ fonts: { ...theme.fonts, [key]: value } });
  }

  return (
    <div
      style={{
        width: "100%",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
        fontSize: 12,
      }}
    >
      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Panel title */}
        <SectionTitle>Загварын өнгө &amp; хэв маяг</SectionTitle>

        {/* Palette */}
        <div>
          <SectionTitle>Өнгөний тохиргоо</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PALETTE_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Native color picker */}
                  <label style={{ flexShrink: 0, cursor: "pointer", position: "relative" }}>
                    <span
                      style={{
                        display: "block",
                        width: 28,
                        height: 28,
                        borderRadius: "var(--radius-ctrl)",
                        border: "1px solid var(--color-border)",
                        background: theme.palette[key],
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="color"
                      value={theme.palette[key]}
                      onChange={(e) => patchPalette(key, e.target.value)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        padding: 0,
                        border: "none",
                      }}
                      aria-label={`${label} өнгө`}
                    />
                  </label>
                  {/* Hex text field */}
                  <input
                    type="text"
                    value={theme.palette[key]}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) patchPalette(key, v);
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (!/^#[0-9a-fA-F]{6}$/.test(v)) patchPalette(key, theme.palette[key]);
                    }}
                    maxLength={7}
                    style={{
                      flex: 1,
                      height: 28,
                      borderRadius: "var(--radius-ctrl)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                      color: "var(--color-text)",
                      fontSize: 11,
                      fontFamily: "monospace",
                      padding: "0 8px",
                      outline: "none",
                    }}
                    aria-label={`${label} hex утга`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Fonts */}
        <div>
          <SectionTitle>Фонт</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <FieldLabel>Гарчгийн фонт</FieldLabel>
              <select
                value={theme.fonts.heading}
                onChange={(e) => patchFont("heading", e.target.value)}
                style={{
                  width: "100%",
                  height: 28,
                  borderRadius: "var(--radius-ctrl)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                  fontSize: 11,
                  padding: "0 6px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {GOOGLE_FONTS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Биеийн фонт</FieldLabel>
              <select
                value={theme.fonts.body}
                onChange={(e) => patchFont("body", e.target.value)}
                style={{
                  width: "100%",
                  height: 28,
                  borderRadius: "var(--radius-ctrl)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                  fontSize: 11,
                  padding: "0 6px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {GOOGLE_FONTS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Divider />

        {/* Motion */}
        <div>
          <SectionTitle>Хөдөлгөөн</SectionTitle>
          <SegmentedControl<ThemeMotion>
            value={theme.motion}
            options={[
              { value: "subtle", label: "Зөөлөн" },
              { value: "none",   label: "Байхгүй" },
            ]}
            onChange={(v) => onChange({ motion: v })}
          />
        </div>

        <Divider />

        {/* Radius */}
        <div>
          <SectionTitle>Булангийн радиус</SectionTitle>
          <SegmentedControl<ThemeRadius>
            value={theme.radius}
            options={[
              { value: "sm", label: "Бага" },
              { value: "md", label: "Дунд" },
              { value: "lg", label: "Их" },
            ]}
            onChange={(v) => onChange({ radius: v })}
          />
        </div>

      </div>
    </div>
  );
}
