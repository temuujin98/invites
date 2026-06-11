"use client";

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitZoom: () => void;
  showSafeArea: boolean;
  toggleSafeArea: () => void;
  showSampleData: boolean;
  toggleSampleData: () => void;
  canvasWidth: number;
  canvasHeight: number;
  canvasPresetLabel: string;
}

function ZoomBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 24,
        minWidth: 24,
        paddingInline: 6,
        borderRadius: 6,
        border: "none",
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function MiniToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        cursor: "pointer",
        fontSize: 11,
        color: "rgba(255,255,255,0.7)",
        userSelect: "none",
      }}
    >
      <span
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onChange()}
        style={{
          display: "inline-flex",
          width: 24,
          height: 14,
          borderRadius: 7,
          background: checked ? "var(--color-accent)" : "rgba(255,255,255,0.18)",
          position: "relative",
          transition: "background 0.18s",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 12 : 2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.18s",
          }}
        />
      </span>
      {label}
    </label>
  );
}

function ToolbarDivider() {
  return (
    <span
      style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", flexShrink: 0 }}
    />
  );
}

export function CanvasToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitZoom,
  showSafeArea,
  toggleSafeArea,
  showSampleData,
  toggleSampleData,
  canvasWidth,
  canvasHeight,
  canvasPresetLabel,
}: Props) {
  return (
    <div
      style={{
        height: 40,
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingInline: 12,
        flexShrink: 0,
      }}
    >
      {/* Zoom controls */}
      <ZoomBtn onClick={onZoomOut}>−</ZoomBtn>
      <span
        style={{
          height: 24,
          minWidth: 44,
          borderRadius: 6,
          background: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.8)",
          fontSize: 11,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        {zoom}%
      </span>
      <ZoomBtn onClick={onZoomIn}>+</ZoomBtn>
      <button
        type="button"
        onClick={onFitZoom}
        style={{
          height: 24,
          paddingInline: 8,
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.55)",
          fontSize: 11,
          cursor: "pointer",
          textDecoration: "underline",
          textDecorationColor: "rgba(255,255,255,0.25)",
        }}
      >
        Багтаах
      </button>

      <ToolbarDivider />

      {/* Toggles */}
      <MiniToggle checked={showSafeArea} onChange={toggleSafeArea} label="Safe area" />
      <MiniToggle checked={showSampleData} onChange={toggleSampleData} label="Жишээ дата" />

      {/* Dims label — pushed to right */}
      <span
        style={{
          marginLeft: "auto",
          fontSize: 10,
          fontFamily: "monospace",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.02em",
        }}
      >
        {canvasWidth}×{canvasHeight} · {canvasPresetLabel}
      </span>
    </div>
  );
}
