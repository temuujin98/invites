"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SectionProps } from "./types";
import { resolveText, readText } from "./shared";

// Cover / hero — the opening screen. Big title over an optional full image.
export function CoverSection({ config, content, theme, mode }: SectionProps<"cover">) {
  const reduce = useReducedMotion();
  const animate = theme.motion === "subtle" && !reduce;

  const title = resolveText(content, "title", "Гарчиг", mode);
  const subtitle = resolveText(content, "subtitle", "Дэд гарчиг", mode);
  const image = readText(content, "coverImage");

  const fullbleed = config.variant === "fullbleed";

  const heading = (
    <div className="flex flex-col items-center gap-3 text-center">
      {subtitle && (
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: fullbleed ? "rgba(255,255,255,0.85)" : "var(--inv-accent)" }}
        >
          {subtitle}
        </p>
      )}
      <h1
        className="text-[34px] font-bold leading-[1.15] tracking-tight"
        style={{
          fontFamily: "var(--inv-font-heading)",
          color: fullbleed ? "#ffffff" : "var(--inv-text)",
        }}
      >
        {title}
      </h1>
    </div>
  );

  return (
    <section
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: fullbleed && image ? "#000" : "var(--inv-bg)" }}
    >
      {/* Background image (fullbleed) or framed image (centered/split) */}
      {image && fullbleed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}

      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {image && !fullbleed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-44 w-44 rounded-full object-cover shadow-lg"
              style={{ border: "3px solid var(--inv-surface)" }}
            />
          )}
          {heading}
        </motion.div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-6">
          {image && !fullbleed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-44 w-44 rounded-full object-cover shadow-lg"
              style={{ border: "3px solid var(--inv-surface)" }}
            />
          )}
          {heading}
        </div>
      )}

      {/* Scroll hint */}
      {config.showScrollHint && (
        <div
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
          style={{ color: fullbleed ? "rgba(255,255,255,0.8)" : "var(--inv-muted)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </section>
  );
}
