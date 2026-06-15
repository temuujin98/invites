"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

const AVATARS = [
  { letter: "Н", bg: "#6D3ADE" },
  { letter: "Б", bg: "#8B5CF6" },
  { letter: "С", bg: "#7C3AED" },
  { letter: "Д", bg: "#A78BFA" },
];

interface LandingHeroProps {
  loggedIn?: boolean;
  heroTemplate: InviteTemplate;
}

export function LandingHero({ loggedIn = false, heroTemplate }: LandingHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1F1B2E 0%, #2A2725 60%, #1A1816 100%)" }}
    >
      {/* Ambient violet glow — top left */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "rgba(139,92,246,0.22)" }}
        aria-hidden="true"
      />
      {/* Ambient warm glow — bottom right */}
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(139,92,246,0.12)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">

          {/* ── LEFT: copy ───────────────────────────────────────── */}
          <div className="flex flex-col gap-6 text-center md:flex-1 md:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/15 bg-white/8 px-4 py-1.5 md:self-start"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
              <span className="text-[12px] font-medium text-white/75 tracking-wide">
                Монголын анхны дижитал урилга
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
              className="text-[36px] font-bold leading-[1.08] tracking-tight text-white break-keep md:text-[54px]"
            >
              Баярын урилгаа<br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #C4B5FD 0%, #A78BFA 50%, #8B5CF6 100%)" }}
              >
                минутын дотор
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
              className="mx-auto max-w-xs text-[15px] leading-[1.65] text-white/60 md:mx-0 md:max-w-sm"
            >
              Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.
              Дизайнер шаардлагагүй — гурван алхам хангалттай.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start"
            >
              <Link
                href={loggedIn ? "/templates" : "/register"}
                className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-(--color-accent-hover) active:scale-[0.98]"
                style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.45)" }}
              >
                Үнэгүй урилга үүсгэх
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) border border-white/20 px-8 text-[15px] font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:text-white active:scale-[0.98]"
              >
                Загварууд үзэх →
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center gap-3 md:justify-start"
            >
              <div className="flex">
                {AVATARS.map((a, i) => (
                  <div
                    key={a.letter}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--color-primary) text-[10px] font-bold text-white"
                    style={{ marginLeft: i ? -8 : 0, backgroundColor: a.bg }}
                  >
                    {a.letter}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-white/50">
                <span className="font-semibold text-white/80">2,400+</span> урилга үүсгэгдсэн
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT: invite card — desktop ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative hidden w-full shrink-0 md:block"
            style={{ maxWidth: 300 }}
          >
            {/* Glow behind card */}
            <div
              className="pointer-events-none absolute inset-0 -m-8 rounded-[60px] blur-3xl"
              style={{ background: "rgba(139,92,246,0.30)" }}
              aria-hidden="true"
            />

            {/* The invite card itself — no phone chrome */}
            <div
              className="relative overflow-hidden shadow-lg"
              style={{
                borderRadius: 20,
                aspectRatio: `${heroTemplate.canvasWidth} / ${heroTemplate.canvasHeight}`,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <InviteRenderer template={heroTemplate} values={HERO_VALUES} mode="public" />
            </div>

            {/* Floating chip: share link */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="absolute -right-10 top-10 rounded-xl border border-white/15 bg-white/10 px-3 py-2 shadow-lg backdrop-blur-md"
            >
              <p className="text-[10px] text-white/50">Хуваалцах линк</p>
              <p className="text-[11px] font-semibold text-(--color-accent)">invites.mn/i/anujin</p>
            </motion.div>

            {/* Floating chip: RSVP */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="absolute -left-10 bottom-14 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 shadow-lg backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-(--color-success)" />
              <span className="whitespace-nowrap text-[11px] font-medium text-white/85">24 зочин ирэхээ мэдэгдсэн</span>
            </motion.div>
          </motion.div>

          {/* ── MOBILE: two angled invite cards ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative flex w-full justify-center md:hidden"
            style={{ height: 260 }}
          >
            {/* Glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[60px] blur-3xl"
              style={{ background: "rgba(139,92,246,0.25)" }}
              aria-hidden="true"
            />

            {/* Card 1 — back, rotated left */}
            <div
              className="absolute overflow-hidden shadow-lg"
              style={{
                width: 150,
                borderRadius: 16,
                top: 24,
                left: "50%",
                transform: "translateX(-90%) rotate(-8deg)",
                aspectRatio: `${heroTemplate.canvasWidth} / ${heroTemplate.canvasHeight}`,
                border: "1px solid rgba(255,255,255,0.10)",
                opacity: 0.65,
              }}
            >
              <InviteRenderer template={heroTemplate} values={HERO_VALUES} mode="public" />
            </div>

            {/* Card 2 — front, center */}
            <div
              className="absolute overflow-hidden shadow-xl"
              style={{
                width: 170,
                borderRadius: 16,
                top: 8,
                left: "50%",
                transform: "translateX(-50%) rotate(2deg)",
                aspectRatio: `${heroTemplate.canvasWidth} / ${heroTemplate.canvasHeight}`,
                border: "1px solid rgba(255,255,255,0.15)",
                zIndex: 2,
              }}
            >
              <InviteRenderer template={heroTemplate} values={HERO_VALUES} mode="public" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade to page bg */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        aria-hidden="true"
      />
    </section>
  );
}
