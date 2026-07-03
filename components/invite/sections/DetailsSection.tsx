"use client";

import type { SectionProps } from "./types";
import { resolveText, readText, SectionWrap, SectionHeading } from "./shared";

function formatDate(raw: string): string {
  if (!raw) return raw;
  // Accept ISO "YYYY-MM-DD" → convert to "YYYY.MM.DD"
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return raw;
}

// Inline SVG icons (24×24, currentColor)
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  text: string;
  cards: boolean;
}

function DetailRow({ icon, text, cards }: DetailRowProps) {
  if (cards) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ backgroundColor: "var(--inv-surface)", color: "var(--inv-text)" }}
      >
        <span style={{ color: "var(--inv-accent)" }}>{icon}</span>
        <span className="text-[14px] leading-snug" style={{ wordBreak: "keep-all" }}>
          {text}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 py-2" style={{ color: "var(--inv-text)" }}>
      <span style={{ color: "var(--inv-accent)" }}>{icon}</span>
      <span className="text-[14px] leading-snug" style={{ wordBreak: "keep-all" }}>
        {text}
      </span>
    </div>
  );
}

export function DetailsSection({ config, content, theme, mode }: SectionProps<"details">) {
  const date = resolveText(content, "date", "2026.08.15", mode);
  const time = resolveText(content, "time", "12:00", mode);
  const location = resolveText(content, "location", "Шангри-Ла зочид буудал", mode);
  const note = readText(content, "note");

  const cards = config.layout === "cards";

  const rows = [
    { icon: <CalendarIcon />, text: formatDate(date) },
    { icon: <ClockIcon />, text: time },
    { icon: <MapPinIcon />, text: location },
  ].filter((r) => r.text);

  return (
    <section style={{ backgroundColor: "var(--inv-bg)" }}>
      <SectionWrap theme={theme}>
        <SectionHeading theme={theme}>Мэдээлэл</SectionHeading>

        <div className={cards ? "flex flex-col gap-3" : "flex flex-col divide-y"} style={cards ? {} : { borderColor: "var(--inv-surface)" }}>
          {rows.map((r, i) => (
            <DetailRow key={i} icon={r.icon} text={r.text} cards={cards} />
          ))}
        </div>

        {note && (
          <p
            className="mt-4 text-center text-[13px] leading-relaxed"
            style={{ color: "var(--inv-muted)", wordBreak: "keep-all" }}
          >
            {note}
          </p>
        )}

        {config.showCalendarButton && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="rounded-full px-6 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--inv-accent)",
                color: "#fff",
              }}
              onClick={() => {
                /* calendar action handled by public shell */
              }}
              aria-label="Календарт нэмэх"
            >
              Календарт нэмэх
            </button>
          </div>
        )}
      </SectionWrap>
    </section>
  );
}
