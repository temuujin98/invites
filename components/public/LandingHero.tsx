"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Starfield } from "@/components/public/Starfield";

interface LandingHeroProps {
  loggedIn?: boolean;
}

export function LandingHero({ loggedIn = false }: LandingHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(175deg, #100E18 0%, #181426 45%, #241F2C 78%, #2A2725 100%)" }}
    >
      {/* Nebula glow — single purposeful light source, centred top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(90% 60% at 50% 0%, rgba(139,92,246,0.20) 0%, transparent 60%)" }}
        aria-hidden="true"
      />
      <Starfield />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-24 text-center md:px-6 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Eyebrow — editorial text, no chip */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/85">
            Монгол дижитал урилга
          </p>

          {/* H1 — solid white, no gradient */}
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight text-white break-keep md:text-[58px]">
            Баярын урилгаа<br />
            минутын дотор
          </h1>

          {/* Sub */}
          <p className="max-w-md text-[15px] leading-relaxed text-white/55 md:text-[16px]">
            Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.
            Дизайнер шаардлагагүй.
          </p>

          {/* CTAs */}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
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

          {/* Social proof — plain text */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
            <p className="text-[13px] text-white/40">2,400+ урилга үүсгэгдсэн</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade to page bg */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-20"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        aria-hidden="true"
      />
    </section>
  );
}
