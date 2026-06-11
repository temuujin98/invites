"use client";

import { useRef, ChangeEvent, useState } from "react";

interface ImageCropUploadProps {
  onImage: (url: string) => void;
  value?: string;
  label?: string;
}

export function ImageCropUpload({
  onImage,
  value,
  label = "Зураг оруулах",
}: ImageCropUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImage(url);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs font-medium text-(--color-text-secondary)">
          {label}
        </span>
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
        className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface-soft) hover:border-(--color-accent) transition-colors"
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Урьдчилан харах"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/30 pb-2">
              <span className="rounded-(--radius-ctrl) bg-black/50 px-2 py-0.5 text-[10px] text-white">
                Тайрах функц Phase 3-д нэмэгдэнэ
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
