"use client";

import type { SectionProps } from "./types";
import { resolveText, readText, SectionWrap, SectionHeading } from "./shared";

export function LocationSection({ config, content, theme, mode }: SectionProps<"location">) {
  const venueName = resolveText(content, "venueName", "Шангри-Ла зочид буудал", mode);
  const address = resolveText(content, "address", "Улаанбаатар, Сүхбаатар дүүрэг", mode);
  const mapUrl = readText(content, "mapUrl");

  const mapsLink =
    mapUrl ||
    (address
      ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
      : "https://maps.google.com/");

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
          <p className="mt-1 text-[13px]" style={{ color: "var(--inv-muted)" }}>
            {address}
          </p>
        )}
      </div>

      {/* Map placeholder card — links to Google Maps */}
      {(config.showEmbed || config.showDirections) && (
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-8 transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--inv-surface)" }}
          aria-label="Google Maps дээр харах"
        >
          {/* Map pin icon */}
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
        </a>
      )}

      {/* Directions button */}
      {config.showDirections && (
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--inv-accent)", color: "#fff" }}
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
