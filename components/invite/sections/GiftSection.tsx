"use client";

import { useState } from "react";
import type { KeyValueEntry } from "@/types/section";
import type { SectionProps } from "./types";
import { resolveText, readText, readKeyValueList, SectionWrap, SectionHeading } from "./shared";

// Placeholder rows shown in editor/create when no bankInfo is set
const PLACEHOLDER_ROWS: KeyValueEntry[] = [
  { key: "Банк", value: "Хаан банк" },
  { key: "Данс", value: "5000123456" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available — silently skip
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 inline-flex shrink-0 items-center justify-center rounded-md border px-3 text-[12px] font-medium transition-colors"
      style={{
        minHeight: "32px",
        backgroundColor: copied ? "var(--inv-accent)" : "transparent",
        color: copied ? "var(--inv-on-accent)" : "var(--inv-accent)",
        borderColor: copied ? "var(--inv-accent)" : "var(--inv-accent)",
      }}
      aria-label={`${value} хуулах`}
    >
      {copied ? "Хуулагдлаа" : "Хуулах"}
    </button>
  );
}

export function GiftSection({ config, content, theme, mode }: SectionProps<"gift">) {
  const heading = resolveText(content, "heading", "Бэлэг", mode);
  const rawBankInfo = readKeyValueList(content, "bankInfo");
  const qrImage = readText(content, "qrImage");

  // In editor/create fall back to placeholder rows when empty
  const bankRows =
    rawBankInfo.length > 0
      ? rawBankInfo
      : mode !== "public"
        ? PLACEHOLDER_ROWS
        : [];

  const showBank = config.showBank && bankRows.length > 0;
  const showQr = config.showQr && !!qrImage;

  if (mode === "public" && !showBank && !showQr) return null;

  return (
    <SectionWrap theme={theme}>
      {heading && <SectionHeading theme={theme}>{heading}</SectionHeading>}

      {/* Bank info card */}
      {showBank && (
        <div
          className="mb-4 overflow-hidden rounded-xl"
          style={{ backgroundColor: "var(--inv-surface)" }}
        >
          {bankRows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom:
                  i < bankRows.length - 1 ? "1px solid color-mix(in srgb, var(--inv-muted) 20%, transparent)" : undefined,
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: "var(--inv-muted)" }}>
                  {row.key}
                </span>
                <span className="text-[14px] font-semibold" style={{ color: "var(--inv-text)" }}>
                  {row.value}
                </span>
              </div>
              <CopyButton value={row.value} />
            </div>
          ))}
        </div>
      )}

      {/* QR image card */}
      {showQr && (
        <div
          className="flex flex-col items-center gap-3 rounded-xl px-6 py-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImage}
            alt="QR код"
            className="h-40 w-40 rounded-lg object-contain"
          />
          <p className="text-[12px]" style={{ color: "var(--inv-muted)" }}>
            Уншуулж бэлэг илгээх
          </p>
        </div>
      )}

      {/* Editor placeholder when QR enabled but no image */}
      {config.showQr && !qrImage && mode !== "public" && (
        <div
          className="flex flex-col items-center gap-3 rounded-xl px-6 py-6"
          style={{ backgroundColor: "var(--inv-surface)" }}
          aria-hidden="true"
        >
          <div
            className="flex h-40 w-40 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--inv-bg)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ color: "var(--inv-muted)" }}>
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 14h1v1h-1z M17 14h1v1h-1z M14 17h1v1h-1z M17 17h3v3h-3z" fill="currentColor" />
            </svg>
          </div>
          <p className="text-[12px]" style={{ color: "var(--inv-muted)" }}>
            Уншуулж бэлэг илгээх
          </p>
        </div>
      )}
    </SectionWrap>
  );
}
