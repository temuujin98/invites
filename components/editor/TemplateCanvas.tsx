"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { CanvasToolbar } from "./CanvasToolbar";
import { FieldOverlay } from "./FieldOverlay";
import type { InviteTemplate, InviteValues, FieldType, TemplateFieldConfig } from "@/types/template";

interface Props {
  template: InviteTemplate;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  zoom: number;
  setZoom: (z: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  showSafeArea: boolean;
  toggleSafeArea: () => void;
  showSampleData: boolean;
  toggleSampleData: () => void;
  updateField: (id: string, patch: Partial<TemplateFieldConfig>) => void;
  addField: (type: FieldType) => void;
}

const ADD_FIELD_TYPES: { type: FieldType; label: string }[] = [
  { type: "text",     label: "Текст" },
  { type: "date",     label: "Огноо" },
  { type: "time",     label: "Цаг" },
  { type: "location", label: "Байршил" },
  { type: "image",    label: "Зураг" },
  { type: "qr",       label: "QR код" },
  { type: "rsvp",     label: "RSVP" },
  { type: "custom",   label: "Дурын" },
];

function getPresetLabel(w: number, h: number): string {
  if (w === 1080 && h === 1920) return "story";
  if (w === 1080 && h === 1080) return "square";
  if (w === 1920 && h === 1080) return "landscape";
  return "custom";
}

export function TemplateCanvas({
  template,
  selectedFieldId,
  setSelectedFieldId,
  zoom,
  setZoom,
  zoomIn,
  zoomOut,
  showSafeArea,
  toggleSafeArea,
  showSampleData,
  toggleSampleData,
  updateField,
  addField,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const addMenuPanelRef = useRef<HTMLDivElement>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [fabPos, setFabPos] = useState({ bottom: 0, right: 0 });

  const scale = zoom / 100;
  const screenW = Math.round(template.canvasWidth * scale);
  const screenH = Math.round(template.canvasHeight * scale);

  // Fit zoom: fit canvas height to container height
  const fitZoom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerH = container.clientHeight - 48; // padding
    const newZoom = Math.floor((containerH / template.canvasHeight) * 100);
    setZoom(Math.min(150, Math.max(20, newZoom)));
  }, [template.canvasHeight, setZoom]);

  // Initial fit zoom on mount
  useEffect(() => {
    fitZoom();
  }, [fitZoom]);

  // FAB add-menu: portal position + outside-click dismiss
  useEffect(() => {
    if (!showAddMenu) return;
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect();
      setFabPos({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      });
    }
    function handleOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (!fabRef.current?.contains(t) && !addMenuPanelRef.current?.contains(t)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showAddMenu]);

  // Build sample values from fields
  const sampleValues: InviteValues = showSampleData
    ? Object.fromEntries(
        template.fields.map((f) => [f.key, { text: f.placeholder ?? f.label }]),
      )
    : {};

  function handleDragEnd(id: string, x: number, y: number) {
    updateField(id, { x, y });
  }

  function handleResizeEnd(
    id: string,
    patch: { x: number; y: number; width: number; height: number },
  ) {
    updateField(id, patch);
  }

  const sortedFields = [...template.fields].sort((a, b) => a.layerOrder - b.layerOrder);

  return (
    <div
      style={{
        flex: 1,
        background: "#211F1C",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CanvasToolbar
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitZoom={fitZoom}
        showSafeArea={showSafeArea}
        toggleSafeArea={toggleSafeArea}
        showSampleData={showSampleData}
        toggleSampleData={toggleSampleData}
        canvasWidth={template.canvasWidth}
        canvasHeight={template.canvasHeight}
        canvasPresetLabel={getPresetLabel(template.canvasWidth, template.canvasHeight)}
      />

      {/* Canvas area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 24,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedFieldId(null);
        }}
      >
        <div
          style={{
            position: "relative",
            width: screenW,
            height: screenH,
            flexShrink: 0,
            borderRadius: 6,
            boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
            overflow: "hidden",
          }}
        >
          {/* InviteRenderer fills the space */}
          <div style={{ position: "absolute", inset: 0 }}>
            <InviteRenderer
              template={template}
              values={sampleValues}
              mode="editor"
              selectedFieldId={selectedFieldId ?? undefined}
              onFieldSelect={setSelectedFieldId}
              showSampleData={showSampleData}
            />
          </div>

          {/* Field overlays */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {sortedFields
              .filter((f) => f.visible)
              .map((f) => (
                <FieldOverlay
                  key={f.id}
                  field={f}
                  scale={scale}
                  isSelected={f.id === selectedFieldId}
                  onSelect={() => setSelectedFieldId(f.id)}
                  onDragEnd={handleDragEnd}
                  onResizeEnd={handleResizeEnd}
                />
              ))}
          </div>

          {/* Safe area guide */}
          {showSafeArea && (
            <div
              style={{
                position: "absolute",
                inset: "5%",
                border: "1px dashed rgba(139,92,246,0.4)",
                borderRadius: 4,
                pointerEvents: "none",
                zIndex: 10,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Add field FAB */}
      <button
        ref={fabRef}
        type="button"
        aria-label="Талбар нэмэх"
        onClick={() => setShowAddMenu((v) => !v)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 20,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          background: "var(--color-accent)",
          color: "#fff",
          fontSize: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          lineHeight: 1,
        }}
      >
        {showAddMenu ? "×" : "+"}
      </button>

      {/* Add field menu — portaled to body so it floats above all editor panels */}
      {showAddMenu && typeof document !== "undefined" && createPortal(
        <div
          ref={addMenuPanelRef}
          style={{
            position: "fixed",
            bottom: fabPos.bottom,
            right: fabPos.right,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            overflow: "hidden",
            minWidth: 130,
            zIndex: 9999,
          }}
        >
          {ADD_FIELD_TYPES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                addField(type);
                setShowAddMenu(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "7px 12px",
                fontSize: 12,
                color: "var(--color-text)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom: "1px solid var(--color-border-muted)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--color-surface-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
