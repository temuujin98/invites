"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { mockTemplates } from "@/lib/mock-data";
import type { InviteValues } from "@/types/template";

// Pre-fill sample values for the hero demo template (wedding-classic)
const HERO_TEMPLATE = mockTemplates[1]!; // wedding-classic

const HERO_VALUES: InviteValues = {
  couple_names: { text: "Бат-Эрдэнэ & Солонго" },
  event_title: { text: "Хуримын ёслолд урьж байна" },
  host_name: { text: "Зохион байгуулагч: Батын Болормаа" },
  event_date: { text: "2026.08.15" },
  event_time: { text: "16:00" },
  location: { text: "Шангри-Ла зочид буудал, УБ" },
};

// Floating chip data
const CHIPS = [
  { icon: "📩", label: "Холбоос хуулагдлаа", color: "bg-(--color-surface) border-(--color-border)", delay: 0 },
  { icon: "✅", label: "Болоцоотой: 24", color: "bg-(--color-success-soft) border-(--color-success)/30", delay: 0.15 },
  { icon: "💬", label: "RSVP: 48 хариу", color: "bg-(--color-accent-soft) border-(--color-accent)/30", delay: 0.3 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-(--color-bg) py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-16">

          {/* ── Text side ─────────────────────────────────── */}
          <div className="flex flex-col gap-6 md:flex-1 md:max-w-lg">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-(--color-accent-soft) px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" aria-hidden="true" />
              <span className="text-xs font-medium text-(--color-accent)">
                Монголын дижитал урилга
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="text-[32px] font-bold leading-tight text-(--color-text) md:text-[40px] lg:text-[44px]"
            >
              Урилгаа хэдхэн минутад
              <br />
              <span className="text-(--color-accent)">үүсгэж хуваалц</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="text-[15px] leading-relaxed text-(--color-text-secondary) max-w-md"
            >
              Хурим, төрсөн өдөр, төгсөлт болон бусад арга хэмжээний
              гоёмсог дижитал урилгыг монгол хэлээр хялбархан үүсгэ.
              Зочдоо нэг холбоосоор урьж, RSVP-г шууд ав.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/templates"
                className="inline-flex h-11 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-6 text-[15px] font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
              >
                Загвар сонгох
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-6 text-[15px] font-medium text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
              >
                Үнэгүй бүртгэл
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={4}
              className="text-xs text-(--color-text-muted)"
            >
              Бүртгэлгүйгээр ашиглах боломжтой · Хурдан · Монгол хэлтэй
            </motion.p>
          </div>

          {/* ── Phone preview side ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="relative w-full max-w-55 shrink-0 md:max-w-60"
          >
            <PhonePreviewFrame
              canvasWidth={HERO_TEMPLATE.canvasWidth}
              canvasHeight={HERO_TEMPLATE.canvasHeight}
            >
              <InviteRenderer
                template={HERO_TEMPLATE}
                values={HERO_VALUES}
                mode="public"
              />
            </PhonePreviewFrame>

            {/* Floating chips */}
            {CHIPS.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: "easeOut", delay: 0.4 + chip.delay }}
                className={[
                  "absolute flex items-center gap-2 rounded-(--radius-card) border px-3 py-2 shadow-md backdrop-blur-sm",
                  chip.color,
                  i === 0 ? "-right-4 top-12 md:-right-10" : "",
                  i === 1 ? "-left-4 top-1/3 md:-left-10" : "",
                  i === 2 ? "-right-4 bottom-20 md:-right-10" : "",
                ].join(" ")}
              >
                <span className="text-base" aria-hidden="true">{chip.icon}</span>
                <span className="whitespace-nowrap text-xs font-medium text-(--color-text)">
                  {chip.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
