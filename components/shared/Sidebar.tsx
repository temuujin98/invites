"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Дашбоард",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: "/invites",
    label: "Миний урилгууд",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/templates",
    label: "Загварууд",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 6h12M6 6v8" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Профайл",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.5 13c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 52 : 220 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="hidden md:flex flex-col shrink-0 h-full bg-(--color-surface) border-r border-(--color-border) overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-[52px] shrink-0 items-center border-b border-(--color-border) px-3">
        <AnimatePresence initial={false} mode="wait">
          {collapsed ? (
            <motion.span
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex h-8 w-8 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) text-white font-bold text-sm"
            >
              i
            </motion.span>
          ) : (
            <motion.span
              key="wordmark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="text-sm font-bold text-(--color-text) tracking-tight"
            >
              invites
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1" aria-label="Үндсэн цэс">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              className={[
                "flex items-center gap-2.5 rounded-(--radius-ctrl) px-2.5 py-2 text-xs font-medium transition-colors duration-150",
                isActive
                  ? "bg-(--color-accent-soft) text-(--color-accent)"
                  : "text-(--color-text-secondary) hover:bg-(--color-surface-soft) hover:text-(--color-text)",
              ].join(" ")}
            >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Toggle */}
      {onToggle && (
        <div className="border-t border-(--color-border) p-2">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Дэлгэх" : "Хураах"}
            className="flex h-8 w-full items-center justify-center rounded-(--radius-ctrl) text-(--color-text-muted) hover:bg-(--color-surface-soft) transition-colors"
          >
            <motion.svg
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.22 }}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>
        </div>
      )}
    </motion.aside>
  );
}
