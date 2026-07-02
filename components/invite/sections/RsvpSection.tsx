"use client";

import type { SectionProps } from "./types";
import { SectionWrap, SectionHeading, resolveText } from "./shared";
import { RsvpForm } from "./RsvpForm";

// RSVP — a dedicated in-page section (replaces the old canvas RSVP button).
export function RsvpSection({ config, content, theme, mode, inviteId }: SectionProps<"rsvp">) {
  const heading = resolveText(content, "heading", "Ирэхээ мэдэгдэнэ үү", mode);
  const message = resolveText(content, "message", "", mode);

  return (
    <SectionWrap theme={theme}>
      <SectionHeading theme={theme}>{heading}</SectionHeading>
      {message && (
        <p className="mb-5 text-center text-[14px] leading-relaxed" style={{ color: "var(--inv-muted)" }}>
          {message}
        </p>
      )}
      <div
        className="rounded-2xl border p-5"
        style={{
          backgroundColor: "var(--inv-surface)",
          borderColor: "color-mix(in srgb, var(--inv-muted) 25%, transparent)",
        }}
      >
        <RsvpForm
          inviteId={inviteId}
          allowGuestCount={config.allowGuestCount}
          allowNote={config.allowNote}
          disabled={mode !== "public"}
        />
      </div>
    </SectionWrap>
  );
}
