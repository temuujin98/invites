"use client";

import { useState, useEffect } from "react";
import type { SectionProps } from "./types";
import { resolveText, SectionWrap } from "./shared";

export function ClosingSection({
  config,
  content,
  theme,
  mode,
  shareSlug,
  inviteTitle,
}: SectionProps<"closing">) {
  const message = resolveText(
    content,
    "message",
    "Таныг хүрэлцэн ирэхийг тэсэн ядан хүлээж байна",
    mode,
  );
  const signature = resolveText(content, "signature", "Хайрт эцэг эх нь", mode);

  // Build the public URL client-side to avoid SSR window access
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shareSlug) {
      setShareUrl(`${window.location.origin}/i/${shareSlug}`);
    }
  }, [shareSlug]);

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isPublic = Boolean(shareSlug);
  const encodedUrl = shareUrl ? encodeURIComponent(shareUrl) : "";
  const encodedTitle = inviteTitle ? encodeURIComponent(inviteTitle) : "";

  return (
    <section style={{ backgroundColor: "var(--inv-bg)" }}>
      <SectionWrap theme={theme}>
        {/* Decorative top rule */}
        <div className="mb-8 flex items-center justify-center">
          <div
            className="h-px w-16"
            style={{ backgroundColor: "var(--inv-accent)", opacity: 0.5 }}
          />
          <div
            className="mx-3 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--inv-accent)" }}
          />
          <div
            className="h-px w-16"
            style={{ backgroundColor: "var(--inv-accent)", opacity: 0.5 }}
          />
        </div>

        {/* Message */}
        {message && (
          <p
            className="mb-6 text-center text-[16px] leading-relaxed break-keep-all"
            style={{
              fontFamily: "var(--inv-font-body)",
              color: "var(--inv-text)",
            }}
          >
            {message}
          </p>
        )}

        {/* Signature — only for "signature" variant */}
        {config.variant === "signature" && signature && (
          <p
            className="mb-8 text-center text-[20px] italic leading-snug"
            style={{
              fontFamily: "var(--inv-font-heading)",
              color: "var(--inv-text)",
            }}
          >
            {signature}
          </p>
        )}

        {/* Share row */}
        <div className="flex flex-col items-center gap-3">
          {/* Copy link button */}
          <button
            type="button"
            onClick={isPublic ? handleCopy : undefined}
            disabled={!isPublic}
            aria-label="Холбоос хуулах"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors"
            style={{
              backgroundColor: isPublic ? "var(--inv-accent)" : "var(--inv-muted)",
              color: "#ffffff",
              opacity: isPublic ? 1 : 0.5,
              cursor: isPublic ? "pointer" : "default",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "Хуулагдлаа" : "Холбоос хуулах"}
          </button>

          {/* Social icon buttons */}
          <div className="flex gap-3">
            {/* Facebook */}
            {isPublic ? (
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook-т хуваалцах"
                className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
                style={{
                  borderColor: "var(--inv-muted)",
                  backgroundColor: "var(--inv-surface)",
                  color: "var(--inv-text)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            ) : (
              <div
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border"
                style={{
                  borderColor: "var(--inv-muted)",
                  backgroundColor: "var(--inv-surface)",
                  color: "var(--inv-muted)",
                  opacity: 0.4,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
            )}

            {/* WhatsApp */}
            {isPublic ? (
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp-аар хуваалцах"
                className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
                style={{
                  borderColor: "var(--inv-muted)",
                  backgroundColor: "var(--inv-surface)",
                  color: "var(--inv-text)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <div
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border"
                style={{
                  borderColor: "var(--inv-muted)",
                  backgroundColor: "var(--inv-surface)",
                  color: "var(--inv-muted)",
                  opacity: 0.4,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Footer branding */}
        <p
          className="mt-8 text-center text-[11px]"
          style={{ color: "var(--inv-muted)" }}
        >
          invites.mn дээр үүсгэв
        </p>
      </SectionWrap>
    </section>
  );
}
