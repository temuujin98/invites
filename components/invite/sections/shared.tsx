"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { SectionContentValue, KeyValueEntry, InviteTheme } from "@/types/section";
import type { SectionMode } from "./types";

// ── Content accessors (safe reads over the loose SectionContentValue) ────────
export function readText(content: SectionContentValue, key: string): string {
  const v = content[key];
  return typeof v === "string" ? v : "";
}

export function readImageList(content: SectionContentValue, key: string): string[] {
  const v = content[key];
  return Array.isArray(v) ? (v.filter((x) => typeof x === "string") as string[]) : [];
}

export function readKeyValueList(content: SectionContentValue, key: string): KeyValueEntry[] {
  const v = content[key];
  if (!Array.isArray(v)) return [];
  return v.filter(
    (x): x is KeyValueEntry =>
      typeof x === "object" && x !== null && "key" in x && "value" in x,
  );
}

// Resolve a text value with a placeholder fallback appropriate to the mode.
// public → empty string when unset (caller decides whether to render);
// editor/create → the placeholder so the section never looks broken.
export function resolveText(
  content: SectionContentValue,
  key: string,
  placeholder: string,
  mode: SectionMode,
): string {
  const v = readText(content, key);
  if (v) return v;
  return mode === "public" ? "" : placeholder;
}

// ── Section wrapper: consistent vertical rhythm + whileInView reveal ─────────
export function SectionWrap({
  children,
  theme,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  theme: InviteTheme;
  className?: string;
  padded?: boolean;
}) {
  const reduce = useReducedMotion();
  const animate = theme.motion === "subtle" && !reduce;

  const wrapClass = `mx-auto w-full max-w-md ${padded ? "px-6 py-10" : ""} ${className}`;

  if (!animate) return <div className={wrapClass}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={wrapClass}
    >
      {children}
    </motion.div>
  );
}

// Section heading used across content sections (uses theme heading font).
export function SectionHeading({ children, theme }: { children: ReactNode; theme: InviteTheme }) {
  return (
    <h2
      className="mb-5 text-center text-[22px] font-bold leading-tight"
      style={{ fontFamily: `var(--inv-font-heading)`, color: `var(--inv-text)` }}
    >
      {children}
    </h2>
  );
}
