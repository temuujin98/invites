"use client";

import { useState } from "react";

// ── Download the invite's rendered share image ────────────────────────────────
// Fetches the dynamically rendered story-size PNG from the OG render route
// (?download=1) and saves it. Rendering can take a moment on a cold cache, so we
// surface a loading state and a retryable error. Mirrors QRPreview's download UX.
export function ShareImageButton({ shareSlug }: { shareSlug: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleDownload() {
    setState("loading");
    try {
      const res = await fetch(`/api/og/${shareSlug}?size=story&download=1`);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${shareSlug}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state === "loading"}
      aria-label="Зураг татах"
      className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[14px] font-medium transition-colors disabled:opacity-60"
      style={{
        borderColor: "var(--inv-muted)",
        backgroundColor: "var(--inv-surface)",
        color: "var(--inv-text)",
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
        <path d="M12 3v12M8 11l4 4 4-4M4 19h16" />
      </svg>
      {state === "loading" ? "Бэлдэж байна…" : state === "error" ? "Дахин оролдох" : "Зураг татах"}
    </button>
  );
}
