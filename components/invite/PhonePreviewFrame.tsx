"use client";

interface PhonePreviewFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhonePreviewFrame({ children, className = "" }: PhonePreviewFrameProps) {
  return (
    <div
      className={["relative mx-auto w-full max-w-xs", className].join(" ")}
      style={{ aspectRatio: "9/16" }}
    >
      {/* Bezel overlay — sits on top, pointer-events none so content is clickable */}
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

      {/* Screen — rounds corners, clips content, height follows children */}
      <div
        className="overflow-hidden"
        style={{
          margin: 3,
          borderRadius: "calc(var(--radius-xl-panel) - 3px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
