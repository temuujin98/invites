"use client";

import { useRef, useEffect, useState, useCallback, ChangeEvent } from "react";

interface ImageCropUploadProps {
  onImage: (url: string) => void;
  value?: string;
  label?: string;
  /** When true, shows circular crop UI with zoom slider (Phase 3) */
  withCrop?: boolean;
}

// ── Crop canvas helper ──────────────────────────────────────────────────────

interface CropState {
  zoom: number;  // 1–3
  offsetX: number; // px relative to canvas center
  offsetY: number;
}

const CANVAS_SIZE = 320; // output square px

function drawCroppedCircle(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  crop: CropState,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = CANVAS_SIZE;
  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);

  // Clip to circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();

  // Compute scaled dimensions
  const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight) * crop.zoom;
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  const dx = size / 2 - sw / 2 + crop.offsetX;
  const dy = size / 2 - sh / 2 + crop.offsetY;

  ctx.drawImage(img, dx, dy, sw, sh);
}

// ── Sub-component: crop UI ──────────────────────────────────────────────────

interface CropEditorProps {
  src: string;
  onDone: (dataUrl: string) => void;
  onCancel: () => void;
}

function CropEditor({ src, onDone, onCancel }: CropEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);

  const redraw = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    drawCroppedCircle(canvas, img, { zoom, offsetX: offset.x, offsetY: offset.y });
  }, [zoom, offset]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      redraw();
    };
    img.src = src;
  }, [src, redraw]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  }

  function handleMouseUp() {
    setDragging(false);
    dragStart.current = null;
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    if (!t) return;
    setDragging(true);
    dragStart.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!dragging || !dragStart.current) return;
    const t = e.touches[0];
    if (!t) return;
    const dx = t.clientX - dragStart.current.mx;
    const dy = t.clientY - dragStart.current.my;
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  }

  function handleConfirm() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onDone(canvas.toDataURL("image/jpeg", 0.92));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas */}
      <div className="relative overflow-hidden rounded-full shadow-md" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, maxWidth: "100%" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block cursor-grab active:cursor-grabbing"
          style={{ maxWidth: "100%", touchAction: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex w-full max-w-xs items-center gap-3">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-(--color-text-muted)">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="range"
          min="1"
          max="3"
          step="0.05"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-(--color-border) accent-(--color-accent)"
          aria-label="Зурагны томруулалт"
        />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 text-(--color-text-muted)">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>

      <p className="text-[11px] text-(--color-text-muted)">Зургийг чирж байрлуулна, томруулж багасгана</p>

      {/* Actions */}
      <div className="flex w-full max-w-xs gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-9 rounded-(--radius-ctrl) border border-(--color-border) text-sm text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
        >
          Буцах
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 h-9 rounded-(--radius-ctrl) bg-(--color-accent) text-sm font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
        >
          Зураг хэрэглэх
        </button>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function ImageCropUpload({
  onImage,
  value,
  label = "Зураг оруулах",
  withCrop = false,
}: ImageCropUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [rawSrc, setRawSrc] = useState<string | null>(null); // staging before crop

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (withCrop) {
      setRawSrc(url);
    } else {
      setPreview(url);
      onImage(url);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  function handleCropDone(dataUrl: string) {
    setPreview(dataUrl);
    setRawSrc(null);
    onImage(dataUrl);
  }

  function handleCropCancel() {
    setRawSrc(null);
  }

  // If crop UI is open, render it full-width
  if (withCrop && rawSrc) {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
        )}
        <div className="rounded-(--radius-card-lg) border border-(--color-border) bg-(--color-surface) p-4">
          <CropEditor src={rawSrc} onDone={handleCropDone} onCancel={handleCropCancel} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
      )}
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface-soft) hover:border-(--color-accent) transition-colors"
        style={{ height: withCrop ? 160 : 144 }}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Урьдчилан харах"
              className={withCrop ? "h-full w-full object-cover" : "h-full w-full object-cover"}
            />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 pb-3">
              <span className="rounded-(--radius-ctrl) bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white">
                Зураг солих
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-(--color-text-muted)">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="22" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9.5" cy="11.5" r="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 20l6-5 4 4 3-3 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">{label}</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onChange}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
