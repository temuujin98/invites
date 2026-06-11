"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRPreviewProps {
  url: string;
  size?: number;
}

export function QRPreview({ url, size = 160 }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    setError(false);
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 1,
      color: { dark: "#1F1D1A", light: "#FFFFFF" },
    }).catch(() => setError(true));
  }, [url, size]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr-invite.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface-soft) text-xs text-(--color-text-muted)"
        style={{ width: size, height: size }}
      >
        QR алдаа
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, borderRadius: 8, display: "block" }}
        aria-label={`QR код: ${url}`}
      />
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-1 text-xs text-(--color-accent) hover:underline"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        PNG татах
      </button>
    </div>
  );
}
