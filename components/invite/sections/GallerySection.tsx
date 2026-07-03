"use client";

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

  if (mode === "public" && displayPhotos.length === 0) return null;

  return (
    <SectionWrap theme={theme}>
      {heading && <SectionHeading theme={theme}>{heading}</SectionHeading>}

      <div className={`grid ${gridClass} gap-2`}>
        {displayPhotos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className={`w-full object-cover ${aspectClass} ${radiusClass}`}
            style={{ backgroundColor: "var(--inv-surface)" }}
          />
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
  );
}
