"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SectionProps } from "./types";
import { readText, SectionWrap } from "./shared";

function parseTargetDate(dateStr: string, timeStr: string): Date | null {
  if (!dateStr) return null;
  // Accept "YYYY.MM.DD" or ISO "YYYY-MM-DD"
  const normalized = dateStr.replace(/\./g, "-");
  const combined = timeStr ? `${normalized}T${timeStr}` : `${normalized}T00:00:00`;
  const d = new Date(combined);
  return isNaN(d.getTime()) ? null : d;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface StatCellProps {
  value: string;
  label: string;
}

function StatCell({ value, label }: StatCellProps) {
  return (
    <div
      className="flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-4"
      style={{ backgroundColor: "var(--inv-surface)" }}
    >
      <span
        className="text-[32px] font-bold leading-none tabular-nums"
        style={{ color: "var(--inv-accent)", fontFamily: "var(--inv-font-heading)" }}
      >
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--inv-muted)" }}>
        {label}
      </span>
    </div>
  );
}

export function CountdownSection({ config, content, theme, mode }: SectionProps<"countdown">) {
  const reduce = useReducedMotion();
  const animate = theme.motion === "subtle" && !reduce;

  const rawDate = readText(content, "targetDate");
  const rawTime = readText(content, "targetTime");
  const dateStr = rawDate;

  // Stabilize the parsed target by its string inputs so the effect deps don't
  // change every render (a fresh Date object would never be reference-equal).
  const target = useMemo(() => parseTargetDate(rawDate, rawTime), [rawDate, rawTime]);

  // Start null on both server and client — the real value is computed after
  // mount in the effect below, avoiding a hydration mismatch from Date.now().
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const left = calcTimeLeft(target);
      if (left) {
        setTimeLeft(left);
        setPast(false);
      } else {
        setTimeLeft(null);
        setPast(true);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const isEditorPlaceholder = !rawDate && mode !== "public";

  const cells: { value: string; label: string }[] = isEditorPlaceholder
    ? [
        { value: "00", label: "Өдөр" },
        { value: "00", label: "Цаг" },
        { value: "00", label: "Минут" },
        { value: "00", label: "Секунд" },
      ]
    : timeLeft
    ? [
        { value: pad(timeLeft.days), label: "Өдөр" },
        { value: pad(timeLeft.hours), label: "Цаг" },
        { value: pad(timeLeft.minutes), label: "Минут" },
        { value: pad(timeLeft.seconds), label: "Секунд" },
      ]
    : [];

  const Wrap = animate ? motion.div : "div";
  const wrapProps = animate
    ? {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" as const },
        transition: { duration: 0.2, ease: "easeOut" as const },
      }
    : {};

  return (
    <section style={{ backgroundColor: "var(--inv-bg)" }}>
      <SectionWrap theme={theme}>
        <p
          className="mb-5 text-center text-[13px] font-medium uppercase tracking-[0.25em]"
          style={{ color: "var(--inv-muted)" }}
        >
          Тоолол эхэллээ
        </p>

        {past ? (
          <p
            className="text-center text-[18px] font-semibold"
            style={{ color: "var(--inv-text)", fontFamily: "var(--inv-font-heading)" }}
          >
            Тэмдэглэлт өдөр боллоо
          </p>
        ) : (
          <Wrap {...wrapProps} className="flex gap-2">
            {cells.map((c) => (
              <StatCell key={c.label} value={c.value} label={c.label} />
            ))}
          </Wrap>
        )}

        {dateStr && !past && (
          <p
            className="mt-4 text-center text-[13px]"
            style={{ color: "var(--inv-muted)" }}
          >
            {dateStr}
            {rawTime ? ` · ${rawTime}` : ""}
          </p>
        )}
      </SectionWrap>
    </section>
  );
}
