"use client";

import { useState } from "react";
import type { SectionProps } from "./types";
import { resolveText, readImageList, SectionWrap, SectionHeading } from "./shared";

export function GallerySection({ config, content, theme, mode }: SectionProps<"gallery">) {
  const heading = resolveText(content, "heading", "Дурсамжууд", mode);
  const photos = readImageList(content, "photos");

  const cap = Math.min(config.maxImages > 0 ? config.maxImages : 9, 9);
  const displayPhotos = photos.slice(0, cap);

  // Placeholder count when no photos available (editor/create only)
  const placeholderCount = mode !== "public" && displayPhotos.length === 0 ? Math.min(cap, 6) : 0;

  const aspectClass =
    config.aspect === "square"
      ? "aspect-square"
      : config.aspect === "portrait"
        ? "aspect-[3/4]"
        : "";

  const gridClass = config.columns === 2 ? "grid-cols-2" : "grid-cols-3";

  const radiusClass = "rounded-lg";

  const [lightbox, setLightbox] = useState<number | null>(null);

  function closeLightbox() {
    setLightbox(null);
  }

  function goPrev() {
    setLightbox((i) => (i !== null && i > 0 ? i - 1 : i));
  }

  function goNext() {
    setLightbox((i) => (i !== null && i < displayPhotos.length - 1 ? i + 1 : i));
  }

  if (mode === "public" && displayPhotos.length === 0) return null;

  return (
    <>
      <SectionWrap theme={theme}>
        {heading && <SectionHeading theme={theme}>{heading}</SectionHeading>}

        <div className={`grid ${gridClass} gap-2`}>
          {displayPhotos.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`w-full cursor-zoom-in overflow-hidden p-0 ${radiusClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`}
              style={{ color: "var(--inv-accent)" }}
              onClick={() => setLightbox(i)}
              aria-label={`${heading || "Зураг"} ${i + 1} томруулан харах`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${heading || "Зураг"} ${i + 1}`}
                className={`w-full object-cover ${aspectClass} ${radiusClass}`}
                style={{ backgroundColor: "var(--inv-surface)" }}
              />
            </button>
          ))}

          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className={`flex items-center justify-center ${aspectClass || "aspect-square"} ${radiusClass}`}
              style={{ backgroundColor: "var(--inv-surface)" }}
              aria-hidden="true"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "var(--inv-muted)" }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              </svg>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* Lightbox overlay */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.90)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Зургийн дэлгэц"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            onClick={closeLightbox}
            aria-label="Хаах"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Prev arrow */}
          {lightbox > 0 && (
            <button
              type="button"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Өмнөх зураг"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {lightbox < displayPhotos.length - 1 && (
            <button
              type="button"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Дараагийн зураг"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Full image — stop click from bubbling to the backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayPhotos[lightbox]}
            alt={`${heading || "Зураг"} ${lightbox + 1}`}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
