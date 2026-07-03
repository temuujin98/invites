"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { SectionTemplate, InviteSectionContent } from "@/types/section";
import { fontStack } from "./SectionRenderer";

interface InvitationShellProps {
  template: SectionTemplate;
  content: InviteSectionContent;
  children: ReactNode;
  // Shell chrome is only wanted on the real guest page; editor/create preview
  // can pass showOpening={false} to skip the intro overlay.
  showOpening?: boolean;
  openingTitle?: string;
}

// Finds the music section's audio url from content, if any.
function findMusicUrl(template: SectionTemplate, content: InviteSectionContent): {
  url: string | null;
  autoplay: boolean;
  loop: boolean;
} {
  const music = template.sections.find((s) => s.type === "music" && s.enabled);
  if (!music || music.type !== "music") return { url: null, autoplay: false, loop: false };
  const c = content[music.id] ?? {};
  const url = typeof c.audio === "string" ? c.audio : null;
  return { url, autoplay: music.autoplay, loop: music.loop };
}

export function InvitationShell({
  template,
  content,
  children,
  showOpening = true,
  openingTitle,
}: InvitationShellProps) {
  const reduce = useReducedMotion();
  const { url: musicUrl, autoplay, loop } = findMusicUrl(template, content);

  // Opening overlay: shown once until dismissed (also serves as the user gesture
  // that unlocks audio autoplay).
  const [opened, setOpened] = useState(!showOpening);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleOpen() {
    setOpened(true);
    if (musicUrl && autoplay && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  function toggleMusic() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  // Reduced motion: skip the overlay entirely.
  useEffect(() => {
    if (reduce && !opened) setOpened(true);
  }, [reduce, opened]);

  // When the overlay is skipped (showOpening=false) but autoplay is requested,
  // attempt playback after mount. Browsers may still block it without a prior
  // gesture; the floating toggle remains the reliable fallback.
  useEffect(() => {
    if (!showOpening && musicUrl && autoplay && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    // Run once on mount for the no-overlay path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative" style={{ backgroundColor: template.theme.palette.bg }}>
      {children}

      {/* Background music element + floating toggle */}
      {musicUrl && (
        <>
          <audio ref={audioRef} src={musicUrl} loop={loop} preload="none" />
          {opened && (
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={playing ? "Хөгжим унтраах" : "Хөгжим тоглуулах"}
              className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
              style={{ backgroundColor: template.theme.palette.accent, color: "#fff" }}
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="16" cy="16" r="2.4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              )}
            </button>
          )}
        </>
      )}

      {/* Opening overlay */}
      <AnimatePresence>
        {!opened && (
          <motion.button
            type="button"
            onClick={handleOpen}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 text-center"
            style={{ backgroundColor: template.theme.palette.bg }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-5 px-8"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ border: `1.5px solid ${template.theme.palette.accent}`, color: template.theme.palette.accent }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {openingTitle && (
                <p
                  className="text-[24px] font-bold leading-tight"
                  style={{ fontFamily: fontStack(template.theme.fonts.heading, "serif"), color: template.theme.palette.text }}
                >
                  {openingTitle}
                </p>
              )}
              <span
                className="rounded-full px-5 py-2 text-[13px] font-medium"
                style={{ backgroundColor: template.theme.palette.accent, color: "#fff" }}
              >
                Урилга нээх
              </span>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
