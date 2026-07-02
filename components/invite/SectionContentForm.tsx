"use client";

import { useState, useCallback } from "react";
import { Input, Textarea, DateInput, TimeInput } from "@/components/ui";
import { ImageCropUpload } from "@/components/shared/ImageCropUpload";
import { createClient } from "@/lib/supabase/client";
import type { ContentField, ContentFieldKind, SectionContentValue, KeyValueEntry } from "@/types/section";

// ── Validation ────────────────────────────────────────────────────────────────

function validate(fields: ContentField[], value: SectionContentValue): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!field.required) continue;
    const v = value[field.key];
    if (field.kind === "text" || field.kind === "longtext" || field.kind === "location" || field.kind === "date" || field.kind === "time") {
      if (!v || (typeof v === "string" && v.trim() === "")) {
        errors[field.key] = "Заавал бөглөнө";
      }
    }
  }
  return errors;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  fields: ContentField[];
  value: SectionContentValue;
  onChange: (next: SectionContentValue) => void;
  /** When true, shows validation errors for required fields (called on next-step). */
  showErrors?: boolean;
}

// ── ImageList control ─────────────────────────────────────────────────────────

function ImageListField({
  label,
  images,
  maxItems,
  onChange,
}: {
  label: string;
  images: string[];
  maxItems?: number;
  onChange: (urls: string[]) => void;
}) {
  const cap = maxItems ?? 12;

  function remove(i: number) {
    const next = images.filter((_, idx) => idx !== i);
    onChange(next);
  }

  function addImage(url: string) {
    onChange([...images, url]);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-(--radius-card)">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Зураг устгах"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length < cap && (
        <ImageCropUpload
          label="Зураг нэмэх"
          onImage={addImage}
        />
      )}
      {maxItems && (
        <p className="text-[11px] text-(--color-text-muted)">{images.length}/{cap} зураг</p>
      )}
    </div>
  );
}

// ── Audio upload field ────────────────────────────────────────────────────────

function AudioField({
  label,
  currentUrl,
  onChange,
}: {
  label: string;
  currentUrl: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop() ?? "mp3";
    const path = `${crypto.randomUUID()}.${ext}`;

    setUploading(true);
    setUploadError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("user-uploads")
        .upload(path, file, { upsert: false });

      if (error) throw new Error(error.message);

      const { data: { publicUrl } } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(path);

      setFileName(file.name);
      onChange(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Байршуулахад алдаа гарлаа");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function remove() {
    setFileName("");
    onChange("");
  }

  const displayName = fileName || (currentUrl ? currentUrl.split("/").pop() ?? "Аудио файл" : "");

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
      {currentUrl ? (
        <div className="flex items-center gap-2 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 py-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-(--color-accent)">
            <path d="M7 2v10M4 4v6M10 4v6M1 6v2M13 6v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="flex-1 truncate text-xs text-(--color-text)">{displayName}</span>
          <button
            type="button"
            onClick={remove}
            aria-label="Аудио устгах"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-(--color-surface-soft) text-(--color-text-muted) transition-colors"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-2 rounded-(--radius-ctrl) border border-dashed border-(--color-border) bg-(--color-surface-soft) px-3 py-3 hover:border-(--color-accent) transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-(--color-text-muted)">
            <path d="M8 3v8M5 6l3-3 3 3M2 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs text-(--color-text-muted)">
            {uploading ? "Байршуулж байна..." : "Аудио файл сонгох"}
          </span>
          <input
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={handleFile}
            disabled={uploading}
            aria-hidden="true"
          />
        </label>
      )}
      {uploadError && (
        <p className="text-xs text-(--color-danger)" role="alert">{uploadError}</p>
      )}
    </div>
  );
}

// ── KeyValueList field ────────────────────────────────────────────────────────

function KeyValueListField({
  label,
  entries,
  maxItems,
  onChange,
}: {
  label: string;
  entries: KeyValueEntry[];
  maxItems?: number;
  onChange: (rows: KeyValueEntry[]) => void;
}) {
  const cap = maxItems ?? 10;

  function updateRow(i: number, patch: Partial<KeyValueEntry>) {
    const next = entries.map((row, idx) => (idx === i ? { ...row, ...patch } : row));
    onChange(next);
  }

  function removeRow(i: number) {
    onChange(entries.filter((_, idx) => idx !== i));
  }

  function addRow() {
    onChange([...entries, { key: "", value: "" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Нэр"
                value={row.key}
                onChange={(e) => updateRow(i, { key: e.target.value })}
                className="flex-1"
                aria-label={`${label} нэр ${i + 1}`}
              />
              <Input
                placeholder="Утга"
                value={row.value}
                onChange={(e) => updateRow(i, { value: e.target.value })}
                className="flex-1"
                aria-label={`${label} утга ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label="Мөр устгах"
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-muted) hover:bg-(--color-surface-soft) transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {entries.length < cap && (
        <button
          type="button"
          onClick={addRow}
          className="flex h-9 items-center justify-center gap-1.5 rounded-(--radius-ctrl) border border-dashed border-(--color-border) bg-(--color-surface-soft) text-xs text-(--color-text-muted) hover:border-(--color-accent) hover:text-(--color-accent) transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Мөр нэмэх
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SectionContentForm({ fields, value, onChange, showErrors = false }: Props) {
  const errors = showErrors ? validate(fields, value) : {};

  const set = useCallback(
    (key: string, v: SectionContentValue[string]) => {
      onChange({ ...value, [key]: v });
    },
    [value, onChange],
  );

  if (fields.length === 0) {
    return (
      <p className="text-xs text-(--color-text-muted)">
        Энэ хэсэгт бөглөх талбар байхгүй.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => {
        const kind: ContentFieldKind = field.kind;

        if (kind === "text") {
          return (
            <Input
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={(value[field.key] as string | undefined) ?? ""}
              maxLength={field.maxChars}
              onChange={(e) => set(field.key, e.target.value)}
              error={errors[field.key]}
            />
          );
        }

        if (kind === "longtext") {
          return (
            <Textarea
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={(value[field.key] as string | undefined) ?? ""}
              maxLength={field.maxChars}
              rows={3}
              onChange={(e) => set(field.key, e.target.value)}
              error={errors[field.key]}
            />
          );
        }

        if (kind === "date") {
          return (
            <DateInput
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={(value[field.key] as string | undefined) ?? ""}
              onChange={(v) => set(field.key, v)}
              error={errors[field.key]}
            />
          );
        }

        if (kind === "time") {
          return (
            <TimeInput
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={(value[field.key] as string | undefined) ?? ""}
              onChange={(v) => set(field.key, v)}
              error={errors[field.key]}
            />
          );
        }

        if (kind === "location") {
          return (
            <div key={field.key} className="flex flex-col gap-1">
              <Input
                label={field.label}
                placeholder={field.placeholder}
                value={(value[field.key] as string | undefined) ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                error={errors[field.key]}
              />
              <p className="flex items-center gap-1 text-xs text-(--color-text-muted)">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="6" cy="4.5" r="1" fill="currentColor" />
                </svg>
                Байршлын нэр оруулна уу
              </p>
            </div>
          );
        }

        if (kind === "image") {
          return (
            <ImageCropUpload
              key={field.key}
              label={field.label}
              value={(value[field.key] as string | undefined) ?? undefined}
              withCrop={false}
              onImage={(url) => set(field.key, url)}
            />
          );
        }

        if (kind === "imageList") {
          const imgs = (value[field.key] as string[] | undefined) ?? [];
          return (
            <ImageListField
              key={field.key}
              label={field.label}
              images={imgs}
              maxItems={field.maxItems}
              onChange={(urls) => set(field.key, urls)}
            />
          );
        }

        if (kind === "audio") {
          return (
            <AudioField
              key={field.key}
              label={field.label}
              currentUrl={(value[field.key] as string | undefined) ?? ""}
              onChange={(url) => set(field.key, url)}
            />
          );
        }

        if (kind === "keyValueList") {
          const entries = (value[field.key] as KeyValueEntry[] | undefined) ?? [];
          return (
            <KeyValueListField
              key={field.key}
              label={field.label}
              entries={entries}
              maxItems={field.maxItems}
              onChange={(rows) => set(field.key, rows)}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
