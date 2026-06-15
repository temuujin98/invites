"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import type { InviteTemplate, InviteValues } from "@/types/template";

const HERO_VALUES: InviteValues = {
  couple_names: { text: "Бат-Эрдэнэ & Солонго" },
  event_title: { text: "Хуримын ёслолд урьж байна" },
  host_name: { text: "Зохион байгуулагч: Батын Болормаа" },
  event_date: { text: "2026.08.15" },
  event_time: { text: "16:00" },
  location: { text: "Шангри-Ла зочид буудал, УБ" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.09 },
  }),
};

const AVATARS = [
  { letter: "Н", bg: "#E8E1F8" },
  { letter: "Б", bg: "#F3EEFE" },
  { letter: "С", bg: "#DED2F5" },
  { letter: "Д", bg: "#EFE9FB" },
];

interface LandingHeroProps {
  loggedIn?: boolean;
  heroTemplate: InviteTemplate;
}

export function LandingHero({ loggedIn = false, heroTemplate }: LandingHeroProps) {
  return (
    <section className="overflow-x-hidden bg-(--color-bg) px-4 pb-16 pt-12 md:overflow-visible md:px-6 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-5xl md:overflow-visible">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">

          {/* ── Text side ───────────────────────────────────────────── */}
          <div className="flex w-full flex-col gap-5 text-center md:flex-1 md:max-w-lg md:text-left">

            {/* Badge */}
            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={0}
              className="inline-flex items-center justify-center gap-1.5 self-center rounded-full border border-accent/20 bg-(--color-accent-soft) px-3.5 py-1.5 md:justify-start md:self-start"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
              <span className="text-[12px] font-medium text-(--color-accent)">
                Монголын анхны дижитал урилга
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial="hidden" animate="show" variants={fadeUp} custom={1}
              className="text-[34px] font-bold leading-[1.1] tracking-tight text-(--color-text) break-keep md:text-[52px]"
            >
              Баярын урилгаа<br className="hidden sm:block" /> минутын дотор
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial="hidden" animate="show" variants={fadeUp} custom={2}
              className="mx-auto max-w-xs text-[15px] leading-[1.65] text-(--color-text-secondary) md:mx-0 md:max-w-none"
            >
              Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.
              Дизайнер шаардлагагүй — гурван алхам хангалттай.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={3}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start"
            >
              <Link
                href={loggedIn ? "/templates" : "/register"}
                className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-7 text-[15px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-(--color-accent-hover) hover:shadow-lg active:scale-[0.98]"
                style={{ boxShadow: "0 4px 16px rgba(139,92,246,0.30)" }}
              >
                Урилга үүсгэх
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-7 text-[15px] font-medium text-(--color-text) transition-all duration-300 hover:bg-(--color-surface-soft) hover:border-accent/30 active:scale-[0.98]"
              >
                Загварууд үзэх
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={4}
              className="flex items-center justify-center gap-2.5 md:justify-start"
            >
              <div className="flex">
                {AVATARS.map((a, i) => (
                  <div
                    key={a.letter}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--color-bg) text-[10px] font-semibold text-(--color-accent)"
                    style={{ marginLeft: i ? -8 : 0, backgroundColor: a.bg }}
                  >
                    {a.letter}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-[12px] font-medium text-(--color-text)">2,400+ урилга</p>
                <p className="text-[11px] text-(--color-text-muted)">Монголчуудаас хийгдсэн</p>
              </div>
            </motion.div>
          </div>

          {/* ── Phone preview — desktop ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="relative hidden shrink-0 md:flex md:justify-center"
            style={{ width: 380 }}
          >
            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[40px] blur-3xl"
              style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
              aria-hidden="true"
            />

            <PhonePreviewFrame
              canvasWidth={heroTemplate.canvasWidth}
              canvasHeight={heroTemplate.canvasHeight}
            >
              <InviteRenderer template={heroTemplate} values={HERO_VALUES} mode="public" />
            </PhonePreviewFrame>

            {/* Chip: template name */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="absolute top-12 flex items-center gap-2 rounded-[10px] border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-md"
              style={{ left: -44 }}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-(--color-accent-soft)">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="10" height="10" rx="2" stroke="var(--color-accent)" strokeWidth="1.2"/>
                  <path d="M1 5h10M4.5 5v5" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-(--color-text-muted)">Загвар</p>
                <p className="text-[11px] font-semibold text-(--color-text)">Цэцэгс №12</p>
              </div>
            </motion.div>

            {/* Chip: share link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              className="absolute rounded-[10px] border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-md"
              style={{ top: 156, right: -52 }}
            >
              <p className="text-[10px] text-(--color-text-muted)">Хуваалцах линк</p>
              <p className="text-[11px] font-semibold text-(--color-accent)">invites.mn/i/anujin</p>
            </motion.div>

            {/* Chip: RSVP */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="absolute flex items-center gap-1.5 rounded-[10px] border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-md"
              style={{ bottom: 70, left: -32 }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-success)" />
              <span className="whitespace-nowrap text-[11px] font-medium text-(--color-text)">
                24 зочин ирэхээ мэдэгдсэн
              </span>
            </motion.div>
          </motion.div>

          {/* ── Phone preview — mobile ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="flex w-full flex-col items-center gap-4 md:hidden"
          >
            {/* Ambient glow mobile */}
            <div className="relative w-full max-w-52.5">
              <div
                className="pointer-events-none absolute inset-0 -m-6 rounded-[60px] blur-2xl"
                style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.14) 0%, transparent 70%)" }}
                aria-hidden="true"
              />
              <PhonePreviewFrame
                canvasWidth={heroTemplate.canvasWidth}
                canvasHeight={heroTemplate.canvasHeight}
              >
                <InviteRenderer template={heroTemplate} values={HERO_VALUES} mode="public" />
              </PhonePreviewFrame>
            </div>

            {/* Mobile social proof below phone */}
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-success)" />
              <span className="text-[12px] text-(--color-text-muted)">24 зочин ирэхээ мэдэгдсэн</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
