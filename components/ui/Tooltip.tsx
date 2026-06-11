"use client";

import { useRef, useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className = "" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    timeoutRef.current = setTimeout(() => setVisible(true), 200);
  }

  function hide() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={[
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
            "px-2 py-1 text-xs rounded-(--radius-ctrl) whitespace-nowrap pointer-events-none",
            "bg-(--color-primary) text-white shadow-(--shadow-md)",
          ].join(" ")}
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-(--color-primary)" />
        </span>
      )}
    </span>
  );
}
