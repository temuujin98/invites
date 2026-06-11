"use client";

import { useEffect, useRef, useState } from "react";
import type { InviteTemplate, InviteValues, TemplateFieldConfig } from "@/types/template";

interface InviteRendererProps {
  template: InviteTemplate;
  values: InviteValues;
  mode: "editor" | "preview" | "public";
  selectedFieldId?: string;
  onFieldSelect?: (id: string) => void;
  showSampleData?: boolean;
}

function resolveText(
  field: TemplateFieldConfig,
  values: InviteValues,
  mode: InviteRendererProps["mode"],
): string | null {
  const val = values[field.key]?.text;
  if (val) return val;
  if (mode === "editor" || mode === "preview") {
    return field.placeholder ?? field.label;
  }
  // public mode
  if (field.required) return field.placeholder ?? "";
  return null;
}

interface FieldProps {
  field: TemplateFieldConfig;
  values: InviteValues;
  mode: InviteRendererProps["mode"];
  scale: number;
  isSelected: boolean;
  onSelect?: () => void;
}

function ScaledField({ field, values, mode, scale, isSelected, onSelect }: FieldProps) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: field.x * scale,
    top: field.y * scale,
    width: field.width * scale,
    height: field.height * scale,
    borderRadius: field.borderRadius != null ? field.borderRadius * scale : undefined,
    cursor: mode === "editor" ? "pointer" : undefined,
    outline: isSelected ? `${2}px solid var(--color-accent)` : undefined,
    outlineOffset: isSelected ? 2 : undefined,
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: field.fontFamily,
    fontSize: field.fontSize != null ? field.fontSize * scale : undefined,
    fontWeight: field.fontWeight,
    lineHeight: field.lineHeight,
    color: field.color,
    textAlign: field.align,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent:
      field.align === "center"
        ? "center"
        : field.align === "right"
          ? "flex-end"
          : "flex-start",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    overflow: "hidden",
  };

  function handleClick() {
    if (mode === "editor" && onSelect) onSelect();
  }

  if (field.type === "image") {
    const assetUrl = values[field.key]?.assetUrl;
    if (!assetUrl) {
      return (
        <div
          style={{
            ...style,
            backgroundColor: "rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          role={mode === "editor" ? "button" : undefined}
          tabIndex={mode === "editor" ? 0 : undefined}
          onClick={handleClick}
          aria-label={field.label}
        >
          <span
            style={{
              fontSize: 11 * scale,
              color: "rgba(0,0,0,0.35)",
              fontFamily: "sans-serif",
            }}
          >
            {field.label}
          </span>
        </div>
      );
    }
    return (
      <div
        style={style}
        role={mode === "editor" ? "button" : undefined}
        tabIndex={mode === "editor" ? 0 : undefined}
        onClick={handleClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl}
          alt={field.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: field.objectFit ?? "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (field.type === "qr") {
    return (
      <div
        style={{
          ...style,
          backgroundColor: "rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4 * scale,
        }}
        role={mode === "editor" ? "button" : undefined}
        tabIndex={mode === "editor" ? 0 : undefined}
        onClick={handleClick}
        aria-label="QR код"
      >
        <svg
          width={32 * scale}
          height={32 * scale}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="18" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="2" y="18" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="5" y="5" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="21" y="5" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="5" y="21" width="6" height="6" rx="1" fill="currentColor" />
          <path d="M18 18h4v4h-4zM22 22h4v4h-4zM18 26h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 9 * scale, color: "rgba(0,0,0,0.4)", fontFamily: "sans-serif" }}>
          QR
        </span>
      </div>
    );
  }

  if (field.type === "rsvp") {
    return (
      <div
        style={{
          ...style,
          backgroundColor: "var(--color-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        aria-label="RSVP"
      >
        <span
          style={{
            fontSize: field.fontSize != null ? field.fontSize * scale : 16 * scale,
            fontWeight: field.fontWeight ?? 600,
            color: field.color ?? "#ffffff",
            fontFamily: field.fontFamily ?? "sans-serif",
          }}
        >
          RSVP илгээх
        </span>
      </div>
    );
  }

  // text / date / time / location / custom
  const text = resolveText(field, values, mode);
  if (text === null) return null;

  return (
    <div
      style={style}
      role={mode === "editor" ? "button" : undefined}
      tabIndex={mode === "editor" ? 0 : undefined}
      onClick={handleClick}
      aria-label={field.label}
    >
      <span style={textStyle}>{text}</span>
    </div>
  );
}

export function InviteRenderer({
  template,
  values,
  mode,
  selectedFieldId,
  onFieldSelect,
}: InviteRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const scale = containerWidth > 0 ? containerWidth / template.canvasWidth : 0;
  const paddingBottom = `${(template.canvasHeight / template.canvasWidth) * 100}%`;

  const sortedFields = [...template.fields].sort((a, b) => a.layerOrder - b.layerOrder);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", paddingBottom, overflow: "hidden" }}
    >
      {/* Background image */}
      {template.backgroundUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={template.backgroundUrl}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {/* Fields */}
      {scale > 0 &&
        sortedFields
          .filter((f) => f.visible)
          .map((field) => (
            <ScaledField
              key={field.id}
              field={field}
              values={values}
              mode={mode}
              scale={scale}
              isSelected={mode === "editor" && selectedFieldId === field.id}
              onSelect={() => onFieldSelect?.(field.id)}
            />
          ))}
    </div>
  );
}
