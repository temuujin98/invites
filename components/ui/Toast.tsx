"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useReducer,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type Action =
  | { type: "add"; toast: ToastItem }
  | { type: "remove"; id: string };

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  if (action.type === "add") return [...state, action.toast];
  if (action.type === "remove") return state.filter((t) => t.id !== action.id);
  return state;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-(--color-success-soft) text-(--color-success) border-(--color-success)",
  error: "bg-(--color-danger-soft) text-(--color-danger) border-(--color-danger)",
  warning: "bg-(--color-warning-soft) text-(--color-warning) border-(--color-warning)",
  info: "bg-(--color-accent-soft) text-(--color-accent) border-(--color-accent)",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

let globalCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const show = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = `toast-${++globalCounter}`;
    dispatch({ type: "add", toast: { id, variant, message } });

    const timer = setTimeout(() => {
      dispatch({ type: "remove", id });
      timers.current.delete(id);
    }, 4000);
    timers.current.set(id, timer);
  }, []);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    dispatch({ type: "remove", id });
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={[
                "pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-(--radius-card) border shadow-(--shadow-md) min-w-60 max-w-sm",
                variantStyles[toast.variant],
              ].join(" ")}
              role="status"
            >
              <span className="shrink-0">{variantIcons[toast.variant]}</span>
              <p className="text-sm flex-1">{toast.message}</p>
              <button
                type="button"
                aria-label="Хаах"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
