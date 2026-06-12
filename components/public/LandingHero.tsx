"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { mockTemplates } from "@/lib/mock-data";
import type { InviteValues } from "@/types/template";

const HERO_TEMPLATE = mockTemplates[1]!;

const HERO_VALUES: InviteValues = {
  couple_names: { text: "Бат-Эрдэнэ & Солонго" },
  event_title: { text: "Хуримын ёслолд урьж байна" },
  host_name: { text: "Зохион байгуулагч: Батын Болормаа" },
  event_date: { text: "2026.08.15" },
  event_time: { text: "16:00" },
  location: { text: "Шангри-Ла зочид буудал, УБ" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.22, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

interface LandingHeroProps {
  loggedIn?: boolean;
}

export function LandingHero({ loggedIn = false }: LandingHeroProps) {
  return (
    <section className="bg-(--color-bg) px-4 pb-18 pt-16 md:px-6 md:pt-16 md:pb-18">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">

          {/* ── Text side ───────────────────────────────────── */}
          <div className="flex flex-col gap-5 text-center md:flex-1 md:max-w-lg md:text-left">
            {/* Badge */}
            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={0}
              className="inline-flex items-center justify-center gap-1.5 self-center rounded-full bg-(--color-accent-soft) px-3 py-1 md:justify-start md:self-start"
            >
              <span className="text-[11px] font-medium text-(--color-accent)">
                Монголын анхны дижитал урилгын платформ
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial="hidden" animate="show" variants={fadeUp} custom={1}
              className="text-[30px] font-bold leading-[1.12] tracking-tight text-(--color-text) md:text-[44px]"
            >
              Баярын урилгаа<br />
              <span className="text-(--color-accent)">минутын дотор</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial="hidden" animate="show" variants={fadeUp} custom={2}
              className="text-[15px] leading-relaxed text-(--color-text-secondary)"
            >
              Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.
              Дизайнер шаардлагагүй — ердөө гурван алхам.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={3}
              className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center md:justify-start"
            >
              <Link
                href={loggedIn ? "/templates" : "/register"}
                className="inline-flex h-11 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-6 text-[14px] font-medium text-white transition-colors hover:bg-(--color-accent-hover)"
              >
                Урилга үүсгэх
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-11 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-6 text-[14px] font-medium text-(--color-text) transition-colors hover:bg-(--color-surface-soft)"
              >
                Загварууд үзэх
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={4}
              className="flex items-center justify-center gap-2 md:justify-start"
            >
              {/* Avatar stack */}
              <div className="flex">
                {["Н", "Б", "С", "Д"].map((l, i) => (
                  <div
                    key={l}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-(--color-bg) text-[9px] font-semibold text-(--color-accent)"
                    style={{
                      marginLeft: i ? -7 : 0,
                      backgroundColor: ["#E8E1F8", "#F3EEFE", "#DED2F5", "#EFE9FB"][i],
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-(--color-text-muted)">
                2,400+ урилга үүсгэгдсэн
              </span>
            </motion.div>
          </div>

          {/* ── Phone preview side ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="relative shrink-0"
            style={{ width: 220 }}
          >
            <PhonePreviewFrame
              canvasWidth={HERO_TEMPLATE.canvasWidth}
              canvasHeight={HERO_TEMPLATE.canvasHeight}
            >
              <InviteRenderer template={HERO_TEMPLATE} values={HERO_VALUES} mode="public" />
            </PhonePreviewFrame>

            {/* Chip: template name — top-left */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: "easeOut", delay: 0.45 }}
              className="absolute -left-9 top-12 flex items-center gap-2 rounded-[10px] border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-md"
            >
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md border border-(--color-border) bg-(--color-bg)">
                <span className="text-[9px] font-medium text-(--color-text-muted)">img</span>
              </div>
              <div>
                <p className="text-[10px] text-(--color-text-muted)">Загвар</p>
                <p className="text-[11px] font-medium text-(--color-text)">Цэцэгс №12</p>
              </div>
            </motion.div>

            {/* Chip: share link — right */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: "easeOut", delay: 0.6 }}
              className="absolute -right-10 top-36 rounded-[10px] border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-md"
            >
              <p className="text-[10px] text-(--color-text-muted)">Хуваалцах линк</p>
              <p className="text-[11px] font-medium text-(--color-accent)">invites.mn/i/anujin</p>
            </motion.div>

            {/* Chip: RSVP — bottom-left */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: "easeOut", delay: 0.75 }}
              className="absolute -left-7 bottom-20 flex items-center gap-1.5 rounded-[10px] border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-success)" />
              <span className="whitespace-nowrap text-[11px] font-medium text-(--color-text)">
                24 зочин ирэхээ мэдэгдсэн
              </span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
