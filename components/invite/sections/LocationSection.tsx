"use client";

import type { SectionProps } from "./types";
import { resolveText, readText, SectionWrap, SectionHeading } from "./shared";

export function LocationSection({ config, content, theme, mode }: SectionProps<"location">) {
  const venueName = resolveText(content, "venueName", "Шангри-Ла зочид буудал", mode);
  const address = resolveText(content, "address", "Улаанбаатар, Сүхбаатар дүүрэг", mode);
  const mapUrl = readText(content, "mapUrl");

  // Directions link — prefer explicit mapUrl, fall back to address query
  const directionsLink =
    mapUrl ||
    (address
      ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
      : "https://maps.google.com/");

  // Embed iframe src — use address or venueName as the map query
  const embedQuery = address || venueName;
  const embedSrc = embedQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(embedQuery)}&output=embed`
    : null;

  // Only show the live iframe when we have a real query to avoid a broken blank map
  const showEmbed = config.showEmbed && embedSrc !== null;

  if (mode === "public" && !venueName && !address) return null;

  return (
    <SectionWrap theme={theme}>
      <SectionHeading theme={theme}>Байршил</SectionHeading>

      {/* Venue name + address */}
      <div className="mb-4 text-center">
        {venueName && (
          <p className="text-[15px] font-semibold" style={{ color: "var(--inv-text)" }}>
            {venueName}
          </p>
        )}
        {address && (
          <p className="mt-1 text-[14px] leading-relaxed" style={{ color: "var(--inv-muted)" }}>
            {address}
          </p>
        )}
      </div>

      {/* Embedded Google Maps iframe */}
      {showEmbed && (
        <div
          className="mb-4 overflow-hidden rounded-xl"
          style={{ border: "1px solid color-mix(in srgb, var(--inv-muted) 18%, transparent)" }}
        >
          <iframe
            src={embedSrc!}
            title="Газрын зураг"
            loading="lazy"
            className="h-48 w-full"
            style={{ display: "block", border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}

      {/* Fallback placeholder when embed is off but showDirections is on */}
      {!showEmbed && config.showDirections && (
        <div
          className="mb-4 flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-8"
          style={{ backgroundColor: "var(--inv-surface)" }}
          aria-hidden="true"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: "var(--inv-accent)" }}
          >
            <path
              d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="text-[13px] font-medium" style={{ color: "var(--inv-muted)" }}>
            Газрын зураг харах
          </span>
        </div>
      )}

      {/* Directions button */}
      {config.showDirections && (
        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--inv-accent)", color: "var(--inv-on-accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 11l9-9 9 9M12 21V11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Чиглэл харах
        </a>
      )}
    </SectionWrap>
  );
}
