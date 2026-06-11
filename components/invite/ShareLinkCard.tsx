"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { QRPreview } from "@/components/invite/QRPreview";

interface ShareLinkCardProps {
  shareUrl: string;
  slug: string;
}

export function ShareLinkCard({ shareUrl, slug }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text visually — unsupported env
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-sm)">
      {/* URL row */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-(--color-text-secondary)">Хуваалцах холбоос</p>
        <div className="flex items-center gap-2">
          <span
            className="flex-1 truncate rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface-soft) px-3 py-1.5 text-xs text-(--color-text-muted) font-mono select-all"
            title={shareUrl}
          >
            {shareUrl}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            aria-label="Холбоос хуулах"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Хуулагдлаа!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 4V2.5A1.5 1.5 0 0 0 6.5 1H2.5A1.5 1.5 0 0 0 1 2.5v4A1.5 1.5 0 0 0 2.5 8H4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Хуулах
              </>
            )}
          </Button>
        </div>
      </div>

      {/* QR code */}
      <div className="flex flex-col items-center gap-1 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface-soft) py-4">
        <QRPreview url={shareUrl} size={140} />
      </div>

      {/* Open link */}
      <Link
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-(--color-accent) hover:underline"
      >
        Холбоосоор очих
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8 1h3v3M11 1 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
