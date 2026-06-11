"use client";

import { useRef, useState, DragEvent } from "react";
import { mockAssets, formatFileSize } from "@/lib/mock-admin-data";
import type { AdminAsset, AssetUploadState } from "@/lib/mock-admin-data";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";

// ── Constants ──────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp,video/mp4,video/webm";

// ── Upload tile ────────────────────────────────────────────────────────────

interface UploadTileProps {
  state: AssetUploadState;
  progress: number;
  fileName: string;
  onFile: (f: File) => void;
  onRetry: () => void;
}

function UploadTile({ state, progress, fileName, onFile, onRetry }: UploadTileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  const isIdle = state === "idle";
  const isError = state === "error_size" || state === "error_generic";

  return (
    <div
      role={isIdle || isError ? "button" : undefined}
      tabIndex={isIdle || isError ? 0 : undefined}
      aria-label="Файл оруулах"
      onClick={() => { if (isIdle || isError) inputRef.current?.click(); }}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && (isIdle || isError)) inputRef.current?.click(); }}
      onDragOver={(e) => { e.preventDefault(); if (isIdle) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={[
        "relative flex flex-col items-center justify-center gap-3 rounded-(--radius-card) border-2 border-dashed px-4 py-8 text-center transition-colors",
        isError
          ? "border-(--color-danger)/50 bg-(--color-danger-soft) cursor-pointer"
          : dragging
            ? "border-(--color-accent) bg-(--color-accent-soft) cursor-copy"
            : isIdle
              ? "border-(--color-border) hover:border-(--color-accent) hover:bg-(--color-surface-soft) cursor-pointer"
              : "border-(--color-border) bg-(--color-surface-soft) cursor-default",
      ].join(" ")}
    >
      {state === "idle" && (
        <>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="text-(--color-text-muted)">
            <path d="M14 18V10M14 10l-4 4M14 10l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="3" width="22" height="22" rx="5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <div>
            <p className="text-xs font-medium text-(--color-text)">Файл чирж оруулах эсвэл сонгох</p>
            <p className="mt-0.5 text-[11px] text-(--color-text-muted)">PNG · JPEG · SVG · WebP · MP4 · WebM · 10 MB хүртэл</p>
          </div>
        </>
      )}

      {state === "uploading" && (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-accent-soft)">
            <svg className="animate-spin text-(--color-accent)" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="25 13" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-(--color-text) truncate max-w-[160px]">{fileName}</p>
            <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-(--color-border)">
              <div
                className="h-full rounded-full bg-(--color-accent) transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-(--color-text-muted)">{progress}% байршуулж байна...</p>
          </div>
        </>
      )}

      {state === "processing" && (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-warning-soft)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-(--color-warning)">
              <path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-(--color-text)">Видео боловсруулж байна...</p>
            <p className="mt-0.5 text-[11px] text-(--color-text-muted)">{fileName}</p>
          </div>
        </>
      )}

      {state === "error_size" && (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-danger-soft)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-(--color-danger)">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-(--color-danger)">Файл хэт том</p>
            <p className="mt-0.5 text-[11px] text-(--color-text-secondary)">10 MB-аас бага файл оруулна уу</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="flex items-center gap-1 rounded-(--radius-ctrl) border border-(--color-danger)/40 px-3 py-1 text-[11px] font-medium text-(--color-danger) hover:bg-white transition-colors"
          >
            Дахин оролдох
          </button>
        </>
      )}

      {state === "error_generic" && (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-danger-soft)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-(--color-danger)">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
              <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-(--color-danger)">Байршуулж чадсангүй</p>
            <p className="mt-0.5 text-[11px] text-(--color-text-secondary)">{fileName}</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="flex items-center gap-1 rounded-(--radius-ctrl) border border-(--color-danger)/40 px-3 py-1 text-[11px] font-medium text-(--color-danger) hover:bg-white transition-colors"
          >
            Дахин оролдох
          </button>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── Asset card ────────────────────────────────────────────────────────────

function AssetCard({
  asset,
  onDelete,
}: {
  asset: AdminAsset;
  onDelete: (a: AdminAsset) => void;
}) {
  const isVideo = asset.type === "video";

  return (
    <div className="group flex flex-col rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) overflow-hidden hover:border-(--color-accent)/30 hover:shadow-(--shadow-md) transition-all">
      {/* Preview */}
      <div className="relative overflow-hidden bg-(--color-surface-soft)" style={{ aspectRatio: "4/3" }}>
        {isVideo ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="text-(--color-text-muted)">
              <rect x="2" y="5" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M22 11l4-3v12l-4-3V11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M10 11l6 3-6 3V11z" fill="currentColor" />
            </svg>
            <span className="text-[11px] text-(--color-text-muted)">MP4</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={asset.name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        {/* In-use badge */}
        {asset.usedInTemplates > 0 && (
          <div className="absolute top-1.5 right-1.5">
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {asset.usedInTemplates} загварт
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-[11px] font-medium text-(--color-text)" title={asset.name}>
          {asset.name}
        </p>
        <p className="text-[11px] text-(--color-text-muted)">
          {formatFileSize(asset.sizeBytes)} · {asset.type === "video" ? "Видео" : "Зураг"}
        </p>
        <button
          type="button"
          onClick={() => onDelete(asset)}
          className={[
            "mt-1 flex h-6 w-full items-center justify-center rounded-(--radius-ctrl) border text-[10px] font-medium transition-colors",
            asset.usedInTemplates > 0
              ? "border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface-soft)"
              : "border-(--color-danger)/30 text-(--color-danger) hover:bg-(--color-danger-soft)",
          ].join(" ")}
        >
          Устгах
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState(mockAssets);
  const [uploadState, setUploadState] = useState<AssetUploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminAsset | null>(null);

  function simulateUpload(file: File) {
    if (file.size > MAX_SIZE_BYTES) {
      setUploadFileName(file.name);
      setUploadState("error_size");
      return;
    }

    setUploadFileName(file.name);
    setUploadState("uploading");
    setUploadProgress(0);

    const isVideo = file.type.startsWith("video/");

    // Fake progress
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 18) + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setUploadProgress(100);
        if (isVideo) {
          setUploadState("processing");
          setTimeout(() => {
            addAsset(file);
            setUploadState("idle");
          }, 2000);
        } else {
          setTimeout(() => {
            addAsset(file);
            setUploadState("idle");
          }, 400);
        }
      } else {
        setUploadProgress(pct);
      }
    }, 150);
  }

  function addAsset(file: File) {
    const newAsset: AdminAsset = {
      id: `ast-new-${Date.now()}`,
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      mimeType: file.type,
      sizeBytes: file.size,
      url: URL.createObjectURL(file),
      usedInTemplates: 0,
      createdAt: new Date().toISOString(),
    };
    setAssets((prev) => [newAsset, ...prev]);
  }

  function handleDelete(asset: AdminAsset) {
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
  }

  function handleDeleteRequest(asset: AdminAsset) {
    setDeleteTarget(asset);
  }

  const deleteMessage = deleteTarget?.usedInTemplates
    ? `"${deleteTarget.name}" нь ${deleteTarget.usedInTemplates} загварт ашиглагдаж байна. Устгавал тэдгээр загваруудад фон алдагдана. Үргэлжлүүлэх үү?`
    : `"${deleteTarget?.name}" файлыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
        <PageHeader
          title="Хөрөнгийн сан"
          subtitle={`${assets.length} файл`}
        />

        {/* Upload */}
        <div className="mb-6">
          <UploadTile
            state={uploadState}
            progress={uploadProgress}
            fileName={uploadFileName}
            onFile={simulateUpload}
            onRetry={() => setUploadState("idle")}
          />
        </div>

        {/* Asset grid */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-(--color-text-muted)">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 3" />
              <path d="M12 24l5-6 4 5 3-3 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs">Хөрөнгийн сан хоосон байна</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onDelete={handleDeleteRequest} />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm — extra warning if in-use */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        title={deleteTarget?.usedInTemplates ? "Ашиглагдаж буй файл устгах уу?" : "Файл устгах уу?"}
        message={deleteMessage}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
