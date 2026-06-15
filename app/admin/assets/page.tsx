"use client";

import { useRef, useState, useEffect, DragEvent } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────

type AssetType = "image" | "video";
type UploadState = "idle" | "uploading" | "processing" | "error_size" | "error_generic";

interface AdminAsset {
  id: string;
  name: string;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  url: string;
  usedInTemplates: number;
  createdAt: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp,video/mp4,video/webm";
const STORAGE_BUCKET = "assets";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Upload tile ────────────────────────────────────────────────────────────

function UploadTile({ state, progress, fileName, onFile, onRetry }: {
  state: UploadState; progress: number; fileName: string;
  onFile: (f: File) => void; onRetry: () => void;
}) {
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
          ? "border-danger/50 bg-(--color-danger-soft) cursor-pointer"
          : dragging
            ? "border-(--color-accent) bg-(--color-accent-soft) cursor-copy"
            : isIdle
              ? "border-(--color-border) hover:border-accent hover:bg-(--color-surface-soft) cursor-pointer"
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
            <p className="text-xs font-medium text-(--color-text) truncate max-w-40">{fileName}</p>
            <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-(--color-border)">
              <div className="h-full rounded-full bg-(--color-accent) transition-all duration-300" style={{ width: `${progress}%` }} />
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
          <button type="button" onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="flex items-center gap-1 rounded-(--radius-ctrl) border border-danger/40 px-3 py-1 text-[11px] font-medium text-(--color-danger) hover:bg-white transition-colors">
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
          <button type="button" onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="flex items-center gap-1 rounded-(--radius-ctrl) border border-danger/40 px-3 py-1 text-[11px] font-medium text-(--color-danger) hover:bg-white transition-colors">
            Дахин оролдох
          </button>
        </>
      )}

      <input ref={inputRef} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

// ── Asset card ────────────────────────────────────────────────────────────

function AssetCard({ asset, onDelete }: { asset: AdminAsset; onDelete: (a: AdminAsset) => void }) {
  const isVideo = asset.type === "video";

  return (
    <div className="group flex flex-col rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) overflow-hidden hover:border-accent/30 hover:shadow-md transition-all">
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
          <img src={asset.url} alt={asset.name} className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        {asset.usedInTemplates > 0 && (
          <div className="absolute top-1.5 right-1.5">
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {asset.usedInTemplates} загварт
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-[11px] font-medium text-(--color-text)" title={asset.name}>{asset.name}</p>
        <p className="text-[11px] text-(--color-text-muted)">{formatFileSize(asset.sizeBytes)} · {isVideo ? "Видео" : "Зураг"}</p>
        <button type="button" onClick={() => onDelete(asset)}
          className={[
            "mt-1 flex h-6 w-full items-center justify-center rounded-(--radius-ctrl) border text-[10px] font-medium transition-colors",
            asset.usedInTemplates > 0
              ? "border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface-soft)"
              : "border-danger/30 text-(--color-danger) hover:bg-(--color-danger-soft)",
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
  const supabase = createClient();
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const [assets, setAssets] = useState<AdminAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminAsset | null>(null);

  useEffect(() => {
    void loadAssets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAssets() {
    setLoading(true);
    const { data: assetRows } = await supabase
      .from("assets")
      .select("id, name, mime_type, size_bytes, bucket, path, created_at")
      .order("created_at", { ascending: false });

    // Count how many templates use each asset (as bg or thumb)
    const { data: tplRows } = await supabase
      .from("templates")
      .select("bg_asset_id, thumb_asset_id");

    const usedCounts: Record<string, number> = {};
    for (const t of tplRows ?? []) {
      if (t.bg_asset_id) usedCounts[t.bg_asset_id as string] = (usedCounts[t.bg_asset_id as string] ?? 0) + 1;
      if (t.thumb_asset_id) usedCounts[t.thumb_asset_id as string] = (usedCounts[t.thumb_asset_id as string] ?? 0) + 1;
    }

    setAssets(
      (assetRows ?? []).map((row: Record<string, unknown>) => {
        const mime = row.mime_type as string;
        return {
          id: row.id as string,
          name: row.name as string,
          type: mime.startsWith("video/") ? "video" : "image",
          mimeType: mime,
          sizeBytes: Number(row.size_bytes),
          url: `${SUPABASE_URL}/storage/v1/object/public/${row.bucket as string}/${row.path as string}`,
          usedInTemplates: usedCounts[row.id as string] ?? 0,
          createdAt: row.created_at as string,
        };
      }),
    );
    setLoading(false);
  }

  async function handleUpload(file: File) {
    if (file.size > MAX_SIZE_BYTES) {
      setUploadFileName(file.name);
      setUploadState("error_size");
      return;
    }

    setUploadFileName(file.name);
    setUploadState("uploading");
    setUploadProgress(0);

    const ext = file.name.split(".").pop() ?? "bin";
    const storagePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Simulate progress while the real upload runs in parallel
    let simPct = 0;
    const interval = setInterval(() => {
      simPct = Math.min(simPct + Math.floor(Math.random() * 15) + 5, 90);
      setUploadProgress(simPct);
    }, 200);

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    clearInterval(interval);

    if (uploadError) {
      setUploadState("error_generic");
      return;
    }

    setUploadProgress(100);

    if (file.type.startsWith("video/")) {
      setUploadState("processing");
      // Video processing is async; just insert the DB row immediately
    }

    // Insert asset row in DB
    const { data: assetRow, error: dbError } = await supabase
      .from("assets")
      .insert({ name: file.name, mime_type: file.type, size_bytes: file.size, bucket: STORAGE_BUCKET, path: storagePath })
      .select("id, name, mime_type, size_bytes, bucket, path, created_at")
      .single();

    if (dbError || !assetRow) {
      setUploadState("error_generic");
      return;
    }

    const newAsset: AdminAsset = {
      id: assetRow.id as string,
      name: assetRow.name as string,
      type: file.type.startsWith("video/") ? "video" : "image",
      mimeType: assetRow.mime_type as string,
      sizeBytes: Number(assetRow.size_bytes),
      url: `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`,
      usedInTemplates: 0,
      createdAt: assetRow.created_at as string,
    };

    setAssets((prev) => [newAsset, ...prev]);
    setUploadState("idle");
  }

  async function handleDelete(asset: AdminAsset) {
    // Extract storage path from URL
    const pathInBucket = asset.url.split(`/public/${STORAGE_BUCKET}/`)[1];
    if (pathInBucket) await supabase.storage.from(STORAGE_BUCKET).remove([pathInBucket]);
    await supabase.from("assets").delete().eq("id", asset.id);
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
  }

  const deleteMessage = deleteTarget?.usedInTemplates
    ? `"${deleteTarget.name}" нь ${deleteTarget.usedInTemplates} загварт ашиглагдаж байна. Устгавал тэдгээр загваруудад фон алдагдана. Үргэлжлүүлэх үү?`
    : `"${deleteTarget?.name}" файлыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
        <PageHeader
          title="Хөрөнгийн сан"
          subtitle={loading ? "Уншиж байна..." : `${assets.length} файл`}
          actions={
            <Button variant="secondary" size="sm" onClick={() => void loadAssets()}>
              Шинэчлэх
            </Button>
          }
        />

        <div className="mb-6">
          <UploadTile
            state={uploadState}
            progress={uploadProgress}
            fileName={uploadFileName}
            onFile={(f) => void handleUpload(f)}
            onRetry={() => setUploadState("idle")}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
          </div>
        ) : assets.length === 0 ? (
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
              <AssetCard key={asset.id} asset={asset} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) void handleDelete(deleteTarget); setDeleteTarget(null); }}
        title={deleteTarget?.usedInTemplates ? "Ашиглагдаж буй файл устгах уу?" : "Файл устгах уу?"}
        message={deleteMessage}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}
