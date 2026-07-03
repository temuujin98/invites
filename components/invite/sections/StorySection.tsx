"use client";

import type { SectionProps } from "./types";
import { resolveText, readKeyValueList, SectionWrap, SectionHeading } from "./shared";
import type { KeyValueEntry } from "@/types/section";

const PLACEHOLDER_ITEMS: KeyValueEntry[] = [
  { key: "2020", value: "Танилцсан" },
  { key: "2026", value: "Гэрлэлт" },
];

// ── Timeline layout (vertical line, dots on left) ────────────────────────────

interface TimelineItemProps {
  entry: KeyValueEntry;
  last: boolean;
}

function TimelineItem({ entry, last }: TimelineItemProps) {
  return (
    <div className="relative flex gap-4">
      {/* Left: line + dot */}
      <div className="flex flex-col items-center">
        <div
          className="mt-1 h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: "var(--inv-accent)" }}
          aria-hidden="true"
        />
        {!last && (
          <div
            className="mt-1 w-px flex-1"
            style={{ backgroundColor: "var(--inv-surface)", minHeight: "24px" }}
            aria-hidden="true"
          />
        )}
      </div>
      {/* Right: content */}
      <div className="pb-6">
        <p
          className="text-[13px] font-bold leading-snug"
          style={{ color: "var(--inv-accent)" }}
        >
          {entry.key}
        </p>
        <p
          className="mt-0.5 text-[14px] leading-relaxed"
          style={{ color: "var(--inv-text)", wordBreak: "keep-all" }}
        >
          {entry.value}
        </p>
      </div>
    </div>
  );
}

// ── Alternating layout (left/right of center; collapses to left on mobile) ───

interface AlternatingItemProps {
  entry: KeyValueEntry;
  index: number;
}

function AlternatingItem({ entry, index }: AlternatingItemProps) {
  // Even index → left card; odd → right card.
  // On mobile (<sm) both are left-aligned (flex-col).
  const isRight = index % 2 === 1;

  return (
    <div className="relative flex items-start gap-0 sm:gap-4">
      {/* Center dot */}
      <div className="absolute left-1/2 top-2 hidden -translate-x-1/2 sm:block">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: "var(--inv-accent)" }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile: always left; desktop: alternate */}
      <div
        className={`w-full rounded-xl px-4 py-3 sm:w-[45%] ${
          isRight ? "sm:ml-auto" : ""
        }`}
        style={{ backgroundColor: "var(--inv-surface)" }}
      >
        <p
          className="text-[13px] font-bold leading-snug"
          style={{ color: "var(--inv-accent)" }}
        >
          {entry.key}
        </p>
        <p
          className="mt-0.5 text-[14px] leading-relaxed"
          style={{ color: "var(--inv-text)", wordBreak: "keep-all" }}
        >
          {entry.value}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function StorySection({ config, content, theme, mode }: SectionProps<"story">) {
  const heading = resolveText(content, "heading", "Бидний түүх", mode);

  const rawItems = readKeyValueList(content, "items");
  const hasItems = rawItems.length > 0;
  const sourceItems = hasItems ? rawItems : mode !== "public" ? PLACEHOLDER_ITEMS : [];

  const maxItems = typeof config.maxItems === "number" && config.maxItems > 0 ? config.maxItems : 5;
  const items = sourceItems.slice(0, maxItems);

  const isTimeline = config.layout !== "alternating";

  return (
    <section style={{ backgroundColor: "var(--inv-bg)" }}>
      <SectionWrap theme={theme}>
        {heading && <SectionHeading theme={theme}>{heading}</SectionHeading>}

        {isTimeline ? (
          <div className="pl-1 pt-2">
            {items.map((item, i) => (
              <TimelineItem key={i} entry={item} last={i === items.length - 1} />
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col gap-4 pt-2">
            {/* Center vertical line (desktop only) */}
            <div
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 sm:block"
              style={{ backgroundColor: "var(--inv-surface)" }}
              aria-hidden="true"
            />
            {items.map((item, i) => (
              <AlternatingItem key={i} entry={item} index={i} />
            ))}
          </div>
        )}
      </SectionWrap>
    </section>
  );
}
