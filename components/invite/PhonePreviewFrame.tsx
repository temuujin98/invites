"use client";

interface PhonePreviewFrameProps {
  children: React.ReactNode;
  /** Canvas aspect ratio — pass canvasWidth/canvasHeight from template. Defaults to 9/16. */
  canvasWidth?: number;
  canvasHeight?: number;
  className?: string;
}

export function PhonePreviewFrame({
  children,
  canvasWidth = 9,
  canvasHeight = 16,
  className = "",
}: PhonePreviewFrameProps) {
  const BEZEL = 3; // px — border width on all sides
  const screenAspect = canvasWidth / canvasHeight;

  return (
    <div className={["relative mx-auto w-full max-w-xs", className].join(" ")}>
      {/* Bezel border overlay — drawn on top, pointer-events:none */}
      <div
        className="absolute inset-0 rounded-(--radius-xl-panel) border-[3px] border-(--color-text) shadow-(--shadow-md) pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 3 }}
      />

      {/* Notch */}
      <div
        className="absolute top-[6px] left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-(--color-text)"
        aria-hidden="true"
        style={{ zIndex: 4 }}
      />

      {/* Screen: aspect ratio lives here so the invite fills it edge-to-edge.
          bg-surface-soft prevents sub-pixel gaps showing as a white line. */}
      <div
        className="bg-(--color-surface-soft)"
        style={{
          overflow: "hidden",
          margin: BEZEL,
          borderRadius: `calc(var(--radius-xl-panel) - ${BEZEL}px)`,
          aspectRatio: `${screenAspect}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
