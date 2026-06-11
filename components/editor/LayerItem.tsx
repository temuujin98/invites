"use client";

import type { TemplateFieldConfig, FieldType } from "@/types/template";

interface Props {
  field: TemplateFieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onToggleLock: () => void;
  onToggleVisible: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

// Inline SVG icons per field type (16×16 viewBox)
function FieldTypeIcon({ type }: { type: FieldType }) {
  const paths: Record<FieldType, React.ReactNode> = {
    text: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    date: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 2v3M11 2v3M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    time: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    location: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2C5.79 2 4 3.79 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    image: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 9l2-2 2 2 2-3 3 4H2l3-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    qr: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9h3M9 12h2M12 9v3M11 12v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    rsvp: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 9h6M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    custom: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return <>{paths[type]}</>;
}

function LockIcon({ locked }: { locked: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {locked ? (
        <>
          <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 7V5a3 3 0 10-6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (!visible) {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LayerItem({
  field,
  isSelected,
  onSelect,
  onToggleLock,
  onToggleVisible,
  onDuplicate,
  onDelete,
}: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className="group"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 8px",
        borderRadius: 7,
        cursor: "pointer",
        background: isSelected ? "var(--color-accent-soft)" : "transparent",
        border: isSelected
          ? "1px solid var(--color-accent)"
          : "1px solid transparent",
        color: isSelected ? "var(--color-accent)" : "var(--color-text)",
        fontSize: 11,
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Drag handle */}
      <span
        style={{ color: "var(--color-text-muted)", flexShrink: 0, cursor: "grab", fontSize: 12 }}
        aria-hidden="true"
      >
        ⠿
      </span>

      {/* Type icon */}
      <span style={{ flexShrink: 0, color: isSelected ? "var(--color-accent)" : "var(--color-text-muted)" }}>
        <FieldTypeIcon type={field.type} />
      </span>

      {/* Key */}
      <span
        style={{
          flex: 1,
          fontFamily: "monospace",
          fontSize: 11,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: isSelected ? "var(--color-accent)" : "var(--color-text)",
        }}
      >
        {field.key}
      </span>

      {/* Lock icon */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
        title="Байрлал түгжих — canvas дээр зөөх/хэмжээ өөрчлөхийг хаана. Тохиргоог засах боломжтой хэвээр."
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          flexShrink: 0,
          color: field.locked
            ? "var(--color-accent)"
            : "var(--color-text-muted)",
          opacity: field.locked ? 1 : 0.5,
        }}
        aria-label={field.locked ? "Түгжээг тайлах" : "Байрлал түгжих"}
      >
        <LockIcon locked={field.locked} />
      </button>

      {/* Eye icon */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleVisible(); }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          flexShrink: 0,
          color: field.visible ? "var(--color-text-muted)" : "var(--color-text-muted)",
          opacity: field.visible ? 0.5 : 0.3,
        }}
        aria-label={field.visible ? "Нуух" : "Харуулах"}
      >
        <EyeIcon visible={field.visible} />
      </button>

      {/* Hover actions */}
      <span
        className="layer-item-actions"
        style={{
          display: "none",
          alignItems: "center",
          gap: 2,
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: isSelected ? "var(--color-accent-soft)" : "var(--color-surface)",
          borderRadius: 4,
        }}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          title="Хуулах"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: 10,
            color: "var(--color-text-secondary)",
            borderRadius: 3,
          }}
        >
          ⎘
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Устгах"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: 10,
            color: "var(--color-danger)",
            borderRadius: 3,
          }}
        >
          ✕
        </button>
      </span>

      <style>{`
        .group:hover .layer-item-actions { display: flex !important; }
      `}</style>
    </div>
  );
}
