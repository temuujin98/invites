"use client";

import type {
  SectionConfig,
  CoverConfig,
  CountdownConfig,
  DetailsConfig,
  StoryConfig,
  GalleryConfig,
  LocationConfig,
  RsvpConfig,
  GiftConfig,
  MusicConfig,
  ClosingConfig,
} from "@/types/section";
import { SECTION_REGISTRY } from "@/lib/sections/registry";

interface Props {
  section: SectionConfig;
  onChange: (patch: Partial<SectionConfig>) => void;
}

// ── Shared micro-components (match FieldSettingsPanel idiom) ─────────────────

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

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 0",
      }}
    >
      <span style={{ fontSize: 11, color: "var(--color-text)" }}>{label}</span>
      {children}
    </div>
  );
}

function MiniToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        display: "inline-flex",
        width: 28,
        height: 16,
        borderRadius: 8,
        background: checked ? "var(--color-accent)" : "var(--color-border)",
        position: "relative",
        flexShrink: 0,
        cursor: "pointer",
        transition: "background 0.18s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 14 : 2,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "var(--color-surface)",
          transition: "left 0.18s",
        }}
      />
    </span>
  );
}

function MiniSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <SettingLabel>{label}</SettingLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            height: 26,
            width: "100%",
            padding: "0 22px 0 6px",
            borderRadius: "var(--radius-ctrl)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            fontSize: 11,
            outline: "none",
            appearance: "none",
            cursor: "pointer",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          style={{
            pointerEvents: "none",
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-muted)",
          }}
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function MiniNumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <SettingLabel>{label}</SettingLabel>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Math.min(max, Math.max(min, Number(e.target.value)));
          onChange(n);
        }}
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
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-accent)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      />
    </div>
  );
}

function MiniTextInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "date";
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <SettingLabel>{label}</SettingLabel>
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
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-accent)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      />
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "var(--color-border-muted)",
        margin: "2px 0",
      }}
    />
  );
}

function EmptyState() {
  return (
    <p
      style={{
        fontSize: 11,
        color: "var(--color-text-muted)",
        fontStyle: "italic",
        textAlign: "center",
        padding: "8px 0",
      }}
    >
      Энэ хэсэгт тохиргоо байхгүй
    </p>
  );
}

// ── Per-type config controls ──────────────────────────────────────────────────

function CoverControls({
  section,
  onChange,
}: {
  section: CoverConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <MiniSelect
        label="Загвар"
        value={section.variant}
        options={[
          { value: "centered", label: "Төвд" },
          { value: "split", label: "Хуваагдсан" },
          { value: "fullbleed", label: "Дүүрэн" },
        ]}
        onChange={(v) =>
          onChange({ variant: v as CoverConfig["variant"] } as Partial<SectionConfig>)
        }
      />
      <ControlRow label="Гүйлгэх сум харуулах">
        <MiniToggle
          checked={section.showScrollHint}
          onChange={(v) => onChange({ showScrollHint: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
    </>
  );
}

function CountdownControls({
  section,
  onChange,
}: {
  section: CountdownConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <MiniSelect
        label="Огноо эх үүсвэр"
        value={section.targetSource}
        options={[
          { value: "event_date", label: "Арга хэмжээний огноо" },
          { value: "custom", label: "Дурын огноо" },
        ]}
        onChange={(v) =>
          onChange({ targetSource: v as CountdownConfig["targetSource"] } as Partial<SectionConfig>)
        }
      />
      <MiniSelect
        label="Харагдах хэлбэр"
        value={section.style}
        options={[
          { value: "digits", label: "Тоон" },
          { value: "flip", label: "Эргэлтэт" },
        ]}
        onChange={(v) =>
          onChange({ style: v as CountdownConfig["style"] } as Partial<SectionConfig>)
        }
      />
    </>
  );
}

function DetailsControls({
  section,
  onChange,
}: {
  section: DetailsConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <MiniSelect
        label="Байрлал"
        value={section.layout}
        options={[
          { value: "list", label: "Жагсаалт" },
          { value: "cards", label: "Карт" },
        ]}
        onChange={(v) =>
          onChange({ layout: v as DetailsConfig["layout"] } as Partial<SectionConfig>)
        }
      />
      <ControlRow label="Календар товч">
        <MiniToggle
          checked={section.showCalendarButton}
          onChange={(v) => onChange({ showCalendarButton: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
    </>
  );
}

function StoryControls({
  section,
  onChange,
}: {
  section: StoryConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <MiniSelect
        label="Байрлал"
        value={section.layout}
        options={[
          { value: "timeline", label: "Он цагийн хэлхээ" },
          { value: "alternating", label: "Ээлжлэн" },
        ]}
        onChange={(v) =>
          onChange({ layout: v as StoryConfig["layout"] } as Partial<SectionConfig>)
        }
      />
      <MiniNumberInput
        label="Хамгийн их тоо"
        value={section.maxItems}
        min={1}
        max={12}
        onChange={(v) => onChange({ maxItems: v } as Partial<SectionConfig>)}
      />
    </>
  );
}

function GalleryControls({
  section,
  onChange,
}: {
  section: GalleryConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <MiniSelect
        label="Баганын тоо"
        value={String(section.columns)}
        options={[
          { value: "2", label: "2 багана" },
          { value: "3", label: "3 багана" },
        ]}
        onChange={(v) =>
          onChange({ columns: Number(v) as GalleryConfig["columns"] } as Partial<SectionConfig>)
        }
      />
      <MiniSelect
        label="Харьцаа"
        value={section.aspect}
        options={[
          { value: "square", label: "Квадрат" },
          { value: "portrait", label: "Босоо" },
          { value: "auto", label: "Авто" },
        ]}
        onChange={(v) =>
          onChange({ aspect: v as GalleryConfig["aspect"] } as Partial<SectionConfig>)
        }
      />
      <MiniNumberInput
        label="Хамгийн их зураг"
        value={section.maxImages}
        min={1}
        max={12}
        onChange={(v) => onChange({ maxImages: v } as Partial<SectionConfig>)}
      />
    </>
  );
}

function LocationControls({
  section,
  onChange,
}: {
  section: LocationConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <ControlRow label="Газрын зураг оруулах">
        <MiniToggle
          checked={section.showEmbed}
          onChange={(v) => onChange({ showEmbed: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
      <ControlRow label="Чиглэл харуулах">
        <MiniToggle
          checked={section.showDirections}
          onChange={(v) => onChange({ showDirections: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
    </>
  );
}

function RsvpControls({
  section,
  onChange,
}: {
  section: RsvpConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <ControlRow label="Хүний тоо асуух">
        <MiniToggle
          checked={section.allowGuestCount}
          onChange={(v) => onChange({ allowGuestCount: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
      <ControlRow label="Тайлбар талбар">
        <MiniToggle
          checked={section.allowNote}
          onChange={(v) => onChange({ allowNote: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
      <MiniTextInput
        label="Хариу өгөх эцсийн огноо"
        value={section.deadline ?? ""}
        placeholder="2026-08-10"
        type="date"
        onChange={(v) =>
          onChange({ deadline: v || undefined } as Partial<SectionConfig>)
        }
      />
    </>
  );
}

function GiftControls({
  section,
  onChange,
}: {
  section: GiftConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <ControlRow label="Дансны мэдээлэл">
        <MiniToggle
          checked={section.showBank}
          onChange={(v) => onChange({ showBank: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
      <ControlRow label="QR харуулах">
        <MiniToggle
          checked={section.showQr}
          onChange={(v) => onChange({ showQr: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
    </>
  );
}

function MusicControls({
  section,
  onChange,
}: {
  section: MusicConfig;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <ControlRow label="Автомат тоглуулах">
        <MiniToggle
          checked={section.autoplay}
          onChange={(v) => onChange({ autoplay: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
      <ControlRow label="Давтах">
        <MiniToggle
          checked={section.loop}
          onChange={(v) => onChange({ loop: v } as Partial<SectionConfig>)}
        />
      </ControlRow>
    </>
  );
}

function ClosingControls({
  section,
  onChange,
}: {
  section: ClosingConfig;
  onChange: Props["onChange"];
}) {
  return (
    <MiniSelect
      label="Загвар"
      value={section.variant}
      options={[
        { value: "signature", label: "Гарын үсэгтэй" },
        { value: "simple", label: "Энгийн" },
      ]}
      onChange={(v) =>
        onChange({ variant: v as ClosingConfig["variant"] } as Partial<SectionConfig>)
      }
    />
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function SectionSettingsPanel({ section, onChange }: Props) {
  const entry = SECTION_REGISTRY[section.type];
  const title = `${entry.label} тохиргоо`;

  function renderControls() {
    switch (section.type) {
      case "cover":
        return <CoverControls section={section} onChange={onChange} />;
      case "countdown":
        return <CountdownControls section={section} onChange={onChange} />;
      case "details":
        return <DetailsControls section={section} onChange={onChange} />;
      case "story":
        return <StoryControls section={section} onChange={onChange} />;
      case "gallery":
        return <GalleryControls section={section} onChange={onChange} />;
      case "location":
        return <LocationControls section={section} onChange={onChange} />;
      case "rsvp":
        return <RsvpControls section={section} onChange={onChange} />;
      case "gift":
        return <GiftControls section={section} onChange={onChange} />;
      case "music":
        return <MusicControls section={section} onChange={onChange} />;
      case "closing":
        return <ClosingControls section={section} onChange={onChange} />;
      default:
        return <EmptyState />;
    }
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
      {/* Panel title */}
      <div style={{ marginBottom: 2 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {title}
        </span>
      </div>

      {/* Type badge */}
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
        <span style={{ fontSize: 10, color: "var(--color-text-muted)", fontWeight: 500 }}>
          Хэсгийн төрөл
        </span>
        <span style={{ fontSize: 11, color: "var(--color-text)", fontWeight: 600 }}>
          {entry.label}
        </span>
      </div>

      <Divider />

      {/* Type-specific controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {renderControls()}
      </div>
    </div>
  );
}
