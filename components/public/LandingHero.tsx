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

/* QR code for https://invites.mn — static SVG path (25×25 module grid, 5px each) */
function QrCode() {
  // Minimal QR-like SVG for https://invites.mn — purely decorative representation
  const dark = "#FFFFFF";
  const modules = [
    "111111101001011011101111111",
    "100000101100010000101000001",
    "101110100011101111001011101",
    "101110101011000010101011101",
    "101110100001100101001011101",
    "100000101001011010101000001",
    "111111101010101010101111111",
    "000000001101010110100000000",
    "110111110110101011011011110",
    "010100000001100100010011001",
    "001011101101011010111001010",
    "100110001010100101001100100",
    "101101110110010110111001011",
    "010010001001100011010001010",
    "001101111010011101110110100",
    "100000001001010110000000001",
    "110101110100101011011110101",
    "000000001010010100100000010",
    "111111101011101011101111111",
    "100000101001010010101000001",
    "101110101100101101001011101",
    "101110100101010010101011101",
    "101110101010100101001011101",
    "100000100101001010101000001",
    "111111101010100101101111111",
  ];
  const size = 4;
  return (
    <svg
      width={modules[0].length * size}
      height={modules.length * size}
      viewBox={`0 0 ${modules[0].length * size} ${modules.length * size}`}
      aria-label="QR code — invites.mn"
    >
      {modules.map((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect
              key={`${x}-${y}`}
              x={x * size}
              y={y * size}
              width={size}
              height={size}
              fill={dark}
              opacity={0.9}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* Invite card visual — thumbnail fallback so it never shows black */
function InviteCardVisual({
  template,
  width,
  borderRadius = 20,
  border = "1px solid rgba(255,255,255,0.13)",
  shadow = "0 20px 60px rgba(0,0,0,0.45)",
}: {
  template: InviteTemplate;
  width: number;
  borderRadius?: number;
  border?: string;
  shadow?: string;
}) {
  const ratio = template.canvasHeight / template.canvasWidth;
  const height = Math.round(width * ratio);
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        border,
        boxShadow: shadow,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Thumbnail shown immediately — renderer overlays on top when ready */}
      {template.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={template.thumbnailUrl}
          alt="Урилгын загвар"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      <div style={{ position: "absolute", inset: 0 }}>
        <InviteRenderer template={template} values={HERO_VALUES} mode="public" />
      </div>
    </div>
  );
}

interface LandingHeroProps {
  loggedIn?: boolean;
  heroTemplate: InviteTemplate;
}

export function LandingHero({ loggedIn = false, heroTemplate }: LandingHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #1A1624 0%, #231F2E 40%, #2A2725 100%)" }}
    >
      <div className="relative mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">

          {/* ── LEFT: copy ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 text-center md:flex-1 md:pt-4 md:text-left"
          >
            {/* H1 — solid white, no gradient */}
            <h1 className="text-[38px] font-bold leading-[1.06] tracking-tight text-white break-keep md:text-[52px]">
              Баярын урилгаа<br />
              минутын дотор
            </h1>

            {/* Sub */}
            <p className="mx-auto max-w-75 text-[15px] leading-relaxed text-white/55 md:mx-0 md:max-w-85">
              Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.
              Дизайнер шаардлагагүй.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start">
              <Link
                href={loggedIn ? "/templates" : "/register"}
                className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-8 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-(--color-accent-hover) active:scale-[0.97]"
                style={{ boxShadow: "0 2px 16px rgba(139,92,246,0.40)" }}
              >
                Урилга үүсгэх
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) border border-white/18 px-8 text-[15px] font-medium text-white/75 transition-all duration-200 hover:border-white/35 hover:text-white active:scale-[0.97]"
              >
                Загварууд үзэх
              </Link>
            </div>

            {/* Social proof — plain text, no avatar chips */}
            <p className="text-[13px] text-white/38 md:text-left text-center">
              2,400+ урилга үүсгэгдсэн
            </p>

            {/* QR block — desktop only, below social proof */}
            <div className="hidden md:flex items-center gap-4 pt-2">
              <div
                className="rounded-lg p-2"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <QrCode />
              </div>
              <div>
                <p className="text-[12px] font-medium text-white/55">Утасдаа нэвтрэх</p>
                <p className="text-[11px] text-white/30 mt-0.5">invites.mn</p>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: invite card — desktop ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="relative hidden shrink-0 md:block"
          >
            {/* Tight violet glow behind card only — purposeful, not decorative filler */}
            <div
              className="pointer-events-none absolute inset-0 rounded-4xl blur-2xl"
              style={{ background: "rgba(139,92,246,0.22)", margin: "-12px" }}
              aria-hidden="true"
            />
            <InviteCardVisual template={heroTemplate} width={290} />
          </motion.div>

          {/* ── MOBILE: single card, centred, slight tilt ────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="flex w-full justify-center md:hidden"
          >
            <div style={{ transform: "rotate(1.5deg)" }}>
              <InviteCardVisual
                template={heroTemplate}
                width={230}
                borderRadius={16}
                shadow="0 16px 48px rgba(0,0,0,0.5)"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade to page bg */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        aria-hidden="true"
      />
    </section>
  );
}
