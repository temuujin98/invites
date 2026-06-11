"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const adminNavItems = [
  {
    href: "/admin",
    label: "Хянах самбар",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/admin/templates",
    label: "Загварууд",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 6h12M6 6v8" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: "/admin/categories",
    label: "Ангилал",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/invites",
    label: "Урилгууд",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Хэрэглэгчид",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1 13c0-2.485 2.462-4.5 5.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9.5 13c0-1.38.896-2.5 2.5-2.5s2.5 1.12 2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/assets",
    label: "Хөрөнгө",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/delivery-logs",
    label: "Хүргэлтийн лог",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg)">
      {/* Admin Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 52 : 220 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="flex flex-col shrink-0 h-full bg-(--color-surface) border-r border-(--color-border) overflow-hidden"
      >
        {/* Logo + badge */}
        <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-(--color-border) px-3">
          <AnimatePresence initial={false} mode="wait">
            {collapsed ? (
              <motion.span
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex h-8 w-8 items-center justify-center rounded-(--radius-ctrl) bg-(--color-primary) text-white font-bold text-sm"
              >
                A
              </motion.span>
            ) : (
              <motion.div
                key="wordmark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm font-bold text-(--color-text) tracking-tight">
                  invites
                </span>
                <span className="rounded-(--radius-ctrl) bg-(--color-primary) px-1.5 py-0.5 text-[10px] font-semibold text-white leading-none">
                  Admin
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto" aria-label="Админ цэс">
          {adminNavItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
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
        <div className="border-t border-(--color-border) p-2">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
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
      </motion.aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
