"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";
import { Sidebar } from "./Sidebar";

// ── Mobile drawer context (for Topbar hamburger wiring) ───────────────────

interface MobileDrawerContextValue {
  open: boolean;
  onOpen: () => void;
}

export const MobileDrawerContext = createContext<MobileDrawerContextValue>({
  open: false,
  onOpen: () => undefined,
});

export function useMobileDrawer(): MobileDrawerContextValue {
  return useContext(MobileDrawerContext);
}

// ── Mobile drawer overlay ─────────────────────────────────────────────────

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="drawer"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 w-[220px] md:hidden"
          >
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── AppShell ──────────────────────────────────────────────────────────────

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <MobileDrawerContext.Provider value={{ open: mobileOpen, onOpen: () => setMobileOpen(true) }}>
        <div className="flex h-screen overflow-hidden bg-(--color-bg)">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            {children}
          </div>
        </div>
      </MobileDrawerContext.Provider>
    </ToastProvider>
  );
}
