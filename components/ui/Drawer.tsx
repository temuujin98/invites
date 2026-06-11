"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return mobile;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const panelVariants = isMobile
    ? {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
      }
    : {
        initial: { x: "100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
      };

  return (
    <AnimatePresence>
      {open && (
        <div
          className={[
            "fixed inset-0 z-50",
            isMobile ? "flex flex-col justify-end" : "flex",
          ].join(" ")}
        >
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "drawer-title" : undefined}
            {...panelVariants}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={[
              "relative bg-(--color-surface) shadow-lg flex flex-col",
              isMobile
                ? "w-full max-h-[90vh] rounded-t-panel"
                : "ml-auto h-full w-full max-w-md",
            ].join(" ")}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border) shrink-0">
                <h2
                  id="drawer-title"
                  className="text-base font-semibold text-(--color-text)"
                >
                  {title}
                </h2>
                <button
                  type="button"
                  aria-label="Хаах"
                  onClick={onClose}
                  className="text-(--color-text-muted) hover:text-(--color-text) transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M4 4l10 10M14 4L4 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
