"use client";

import type { SectionProps } from "./types";
import { readText } from "./shared";

// Music is a config/content-only section — actual playback lives in InvitationShell.
// In public mode it renders nothing (the floating toggle handles it).
// In editor/create it shows a small marker so the admin/user knows music is set.
export function MusicSection({ content, mode }: SectionProps<"music">) {
  if (mode === "public") return null;

  const track = readText(content, "trackName");
  const hasAudio = Boolean(readText(content, "audio"));

  return (
    <div className="mx-auto w-full max-w-md px-6 py-4">
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{
          backgroundColor: "var(--inv-surface)",
          borderColor: "color-mix(in srgb, var(--inv-muted) 25%, transparent)",
        }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--inv-accent) 15%, transparent)", color: "var(--inv-accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="16" cy="16" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium" style={{ color: "var(--inv-text)" }}>
            Дэвсгэр хөгжим
          </p>
          <p className="truncate text-[12px]" style={{ color: "var(--inv-muted)" }}>
            {hasAudio ? track || "Аудио файл нэмэгдсэн" : "Аудио файл нэмээгүй"}
          </p>
        </div>
      </div>
    </div>
  );
}
