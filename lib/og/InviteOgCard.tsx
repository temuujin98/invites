import "server-only";
import type { ReactElement } from "react";
import type { InviteTheme } from "@/types/section";

// ── OG / share card template (satori-safe) ───────────────────────────────────
// This is NOT the live invite. satori (next/og) runs a flexbox-only layout
// engine with no var(), grid, object-fit, or media queries — so this is a
// purpose-built summary card: a curated poster of the invite's essentials
// (title · date · venue) over the cover image, styled from resolved theme
// tokens passed as plain values. Every style is inline; every color is a hex.

export type OgSize = "landscape" | "story";

export interface OgCardData {
  title: string;
  dateLabel: string | null;   // preformatted "2026.08.15" (+ optional weekday)
  venue: string | null;
  coverImage: string | null;  // absolute URL or data: URI (satori fetches it)
  theme: InviteTheme;
}

const DIMENSIONS: Record<OgSize, { width: number; height: number }> = {
  landscape: { width: 1200, height: 630 }, // link unfurl (FB/Messenger/Twitter)
  story: { width: 1080, height: 1350 },    // portrait post / IG feed
};

export function ogDimensions(size: OgSize) {
  return DIMENSIONS[size];
}

// Build the satori element tree. Returned to ImageResponse in the route handler.
export function InviteOgCard({
  data,
  size,
}: {
  data: OgCardData;
  size: OgSize;
}): ReactElement {
  const { width, height } = DIMENSIONS[size];
  const { palette } = data.theme;
  const isStory = size === "story";

  // When we have a cover photo the card goes dark-over-photo (white text on a
  // scrim); without one it's a clean themed card (dark text on paper).
  const hasCover = Boolean(data.coverImage);
  const textColor = hasCover ? "#FFFFFF" : palette.text;
  const subColor = hasCover ? "rgba(255,255,255,0.82)" : palette.muted;
  const accentColor = hasCover ? "#FFFFFF" : palette.accent;

  const titleSize = isStory ? 88 : 76;
  const metaSize = isStory ? 34 : 30;
  const eyebrowSize = isStory ? 24 : 22;

  return (
    <div
      style={{
        display: "flex",
        width,
        height,
        position: "relative",
        backgroundColor: hasCover ? "#000000" : palette.bg,
        fontFamily: "Roboto",
      }}
    >
      {/* Cover photo (satori supports <img> with explicit box; object-fit cover
          is emulated by sizing the img to the frame). */}
      {data.coverImage && (
        <img
          src={data.coverImage}
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            objectFit: "cover",
          }}
        />
      )}

      {/* Scrim for legibility over the photo */}
      {hasCover && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      )}

      {/* Content column */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
          padding: isStory ? "96px 80px" : "64px 96px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: eyebrowSize,
            fontWeight: 500,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: accentColor,
          }}
        >
          ТАНЫГ УРЬЖ БАЙНА
        </div>

        {/* Hairline divider */}
        <div
          style={{
            width: 64,
            height: 2,
            marginTop: 28,
            marginBottom: 28,
            backgroundColor: accentColor,
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.1,
            color: textColor,
            // Heading always renders in Roboto — the only Cyrillic-safe face we
            // load into satori. The template's display font (theme.fonts.heading)
            // isn't fetched here; a display Latin face wouldn't cover Cyrillic.
            fontFamily: "Roboto",
            maxWidth: width - (isStory ? 160 : 220),
          }}
        >
          {data.title}
        </div>

        {/* Meta: date · venue */}
        {(data.dateLabel || data.venue) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 40,
              gap: 12,
            }}
          >
            {data.dateLabel && (
              <div style={{ display: "flex", fontSize: metaSize, fontWeight: 500, color: textColor }}>
                {data.dateLabel}
              </div>
            )}
            {data.venue && (
              <div style={{ display: "flex", fontSize: metaSize - 4, color: subColor }}>
                {data.venue}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Brand footer */}
      <div
        style={{
          position: "absolute",
          bottom: isStory ? 48 : 36,
          left: 0,
          width,
          display: "flex",
          justifyContent: "center",
          fontSize: isStory ? 24 : 22,
          letterSpacing: 2,
          color: hasCover ? "rgba(255,255,255,0.7)" : palette.muted,
        }}
      >
        invites.mn
      </div>
    </div>
  );
}
