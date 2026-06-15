"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { APP_URL } from "@/lib/constants";

export function ShareQrVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    setError(false);
    QRCode.toCanvas(canvasRef.current, APP_URL, {
      width: 132,
      margin: 1,
      color: { dark: "#1F1D1A", light: "#FFFFFF" },
    }).catch(() => setError(true));
  }, []);

  return (
    <div className="flex h-full items-center justify-center rounded-(--radius-card) bg-(--color-surface) p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-md border border-(--color-border) bg-white p-3 shadow-sm">
          {error ? (
            <div
              className="flex items-center justify-center text-[11px] text-(--color-text-muted)"
              style={{ width: 132, height: 132 }}
            >
              QR код
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={132}
              height={132}
              style={{ width: 132, height: 132, display: "block", borderRadius: 4 }}
              aria-label="QR код — invites.mn"
            />
          )}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-(--color-border) bg-white px-4 py-2 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
          <p className="text-[12px] font-semibold text-(--color-accent)">invites.mn/i/нэр</p>
        </div>
      </div>
    </div>
  );
}
