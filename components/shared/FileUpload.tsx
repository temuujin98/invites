"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface FileUploadProps {
  onFile: (f: File) => void;
  accept?: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFile,
  accept,
  label = "Файл сонгох эсвэл чирж оруулна уу",
  hint,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          "flex flex-col items-center justify-center gap-2 rounded-(--radius-card) border-2 border-dashed px-6 py-8 text-center transition-colors duration-150",
          disabled
            ? "cursor-not-allowed opacity-50 border-(--color-border)"
            : isDragging
            ? "border-(--color-accent) bg-(--color-accent-soft) cursor-copy"
            : "border-(--color-border) hover:border-(--color-accent) hover:bg-(--color-surface-soft) cursor-pointer",
        ].join(" ")}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
          className="text-(--color-text-muted)"
        >
          <path
            d="M14 18V10M14 10l-3 3M14 10l3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="4"
            y="4"
            width="20"
            height="20"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        {fileName ? (
          <span className="text-xs font-medium text-(--color-text)">{fileName}</span>
        ) : (
          <span className="text-xs text-(--color-text-muted)">{label}</span>
        )}
        {hint && (
          <span className="text-[11px] text-(--color-text-muted)">{hint}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onChange}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
