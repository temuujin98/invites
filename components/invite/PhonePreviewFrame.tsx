"use client";

interface PhonePreviewFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhonePreviewFrame({ children, className = "" }: PhonePreviewFrameProps) {
  return (
    <div
      className={["relative mx-auto w-full max-w-xs", className].join(" ")}
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {/* Bezel */}
      <div
        className="absolute inset-0 rounded-(--radius-xl-panel) border-[3px] border-(--color-text) bg-(--color-text) shadow-(--shadow-md)"
        aria-hidden="true"
      />

      {/* Notch */}
      <div
        className="absolute top-[6px] left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-(--color-surface)"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      />

      {/* Screen area */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          inset: 3,
          borderRadius: "calc(var(--radius-xl-panel) - 3px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
