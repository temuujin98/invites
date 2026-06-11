"use client";

import { useCallback, useRef } from "react";
import type { TemplateFieldConfig } from "@/types/template";

interface Props {
  field: TemplateFieldConfig;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onResizeEnd: (id: string, patch: { x: number; y: number; width: number; height: number }) => void;
}

type HandleDir = "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se";

const HANDLE_SIZE = 7;

const handlePositions: Record<HandleDir, { left: string; top: string; transform: string; cursor: string }> = {
  nw: { left: "0",   top: "0",   transform: "translate(-50%,-50%)", cursor: "nwse-resize" },
  n:  { left: "50%", top: "0",   transform: "translate(-50%,-50%)", cursor: "ns-resize" },
  ne: { left: "100%",top: "0",   transform: "translate(-50%,-50%)", cursor: "nesw-resize" },
  w:  { left: "0",   top: "50%", transform: "translate(-50%,-50%)", cursor: "ew-resize" },
  e:  { left: "100%",top: "50%", transform: "translate(-50%,-50%)", cursor: "ew-resize" },
  sw: { left: "0",   top: "100%",transform: "translate(-50%,-50%)", cursor: "nesw-resize" },
  s:  { left: "50%", top: "100%",transform: "translate(-50%,-50%)", cursor: "ns-resize" },
  se: { left: "100%",top: "100%",transform: "translate(-50%,-50%)", cursor: "nwse-resize" },
};

export function FieldOverlay({
  field,
  scale,
  isSelected,
  onSelect,
  onDragEnd,
  onResizeEnd,
}: Props) {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const resizeRef = useRef<{
    dir: HandleDir;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const handlePointerDownField = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isSelected) {
        onSelect();
        return;
      }
      if (field.locked) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: field.x,
        origY: field.y,
      };
    },
    [isSelected, field.locked, field.x, field.y, onSelect],
  );

  const handlePointerMoveField = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const dx = (e.clientX - dragRef.current.startX) / scale;
      const dy = (e.clientY - dragRef.current.startY) / scale;
      onDragEnd(field.id, Math.round(dragRef.current.origX + dx), Math.round(dragRef.current.origY + dy));
    },
    [field.id, scale, onDragEnd],
  );

  const handlePointerUpField = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handlePointerDownHandle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, dir: HandleDir) => {
      if (field.locked) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      resizeRef.current = {
        dir,
        startX: e.clientX,
        startY: e.clientY,
        origX: field.x,
        origY: field.y,
        origW: field.width,
        origH: field.height,
      };
    },
    [field.locked, field.x, field.y, field.width, field.height],
  );

  const handlePointerMoveHandle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!resizeRef.current) return;
      const { dir, startX, startY, origX, origY, origW, origH } = resizeRef.current;
      const dx = (e.clientX - startX) / scale;
      const dy = (e.clientY - startY) / scale;

      let x = origX, y = origY, w = origW, h = origH;

      if (dir.includes("e")) w = Math.max(20, Math.round(origW + dx));
      if (dir.includes("s")) h = Math.max(20, Math.round(origH + dy));
      if (dir.includes("w")) {
        const newW = Math.max(20, Math.round(origW - dx));
        x = Math.round(origX + (origW - newW));
        w = newW;
      }
      if (dir.includes("n")) {
        const newH = Math.max(20, Math.round(origH - dy));
        y = Math.round(origY + (origH - newH));
        h = newH;
      }

      onResizeEnd(field.id, { x, y, width: w, height: h });
    },
    [field.id, scale, onResizeEnd],
  );

  const handlePointerUpHandle = useCallback(() => {
    resizeRef.current = null;
  }, []);

  const left = field.x * scale;
  const top = field.y * scale;
  const width = field.width * scale;
  const height = field.height * scale;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        boxSizing: "border-box",
        border: isSelected
          ? "1.5px solid var(--color-accent)"
          : "1px dashed rgba(139,92,246,0.55)",
        background: isSelected ? "rgba(139,92,246,0.06)" : "transparent",
        pointerEvents: "auto",
        cursor: field.locked ? "default" : isSelected ? "move" : "pointer",
      }}
      onPointerDown={handlePointerDownField}
      onPointerMove={handlePointerMoveField}
      onPointerUp={handlePointerUpField}
    >
      {/* Tag above */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: -24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--color-accent)",
            color: "#fff",
            fontSize: 9,
            fontFamily: "monospace",
            fontWeight: 700,
            padding: "2px 5px",
            borderRadius: 3,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {field.key} · {field.width}×{field.height} · x{field.x} y{field.y}
        </div>
      )}

      {/* Resize handles */}
      {isSelected &&
        (Object.keys(handlePositions) as HandleDir[]).map((dir) => {
          const pos = handlePositions[dir];
          return (
            <div
              key={dir}
              style={{
                position: "absolute",
                left: pos.left,
                top: pos.top,
                transform: pos.transform,
                width: HANDLE_SIZE,
                height: HANDLE_SIZE,
                background: "#fff",
                border: "1.5px solid var(--color-accent)",
                borderRadius: 1.5,
                cursor: pos.cursor,
                zIndex: 1,
              }}
              onPointerDown={(e) => handlePointerDownHandle(e, dir)}
              onPointerMove={handlePointerMoveHandle}
              onPointerUp={handlePointerUpHandle}
            />
          );
        })}
    </div>
  );
}
