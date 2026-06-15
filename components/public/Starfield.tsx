"use client";

import { useMemo } from "react";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  top: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

function buildStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    top: rand() * 100,
    left: rand() * 100,
    size: rand() < 0.82 ? 1 : 2,
    opacity: 0.2 + rand() * 0.55,
    duration: 2.4 + rand() * 3.4,
    delay: rand() * 5,
  }));
}

const SHOOTING = [
  { top: 6,  left: 58, delay: 0.6, duration: 7.5 },
  { top: 20, left: 82, delay: 3.4, duration: 8.5 },
  { top: 2,  left: 38, delay: 6.0, duration: 9.5 },
];

export function Starfield({
  count = 64,
  seed = 20260815,
  className = "",
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const stars = useMemo(() => buildStars(count, seed), [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="inv-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {SHOOTING.map((s, i) => (
        <span
          key={`shoot-${i}`}
          className="inv-shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <style>{`
        .inv-star {
          position: absolute;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.55);
          animation-name: inv-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: opacity;
        }
        @keyframes inv-twinkle {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 0.9; }
        }
        .inv-shooting-star {
          position: absolute;
          width: 90px;
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%);
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.45));
          opacity: 0;
          animation-name: inv-shoot;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in;
          will-change: transform, opacity;
        }
        @keyframes inv-shoot {
          0%   { transform: rotate(135deg) translateX(-40px); opacity: 0; }
          3%   { opacity: 1; }
          14%  { transform: rotate(135deg) translateX(440px); opacity: 0; }
          100% { transform: rotate(135deg) translateX(440px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .inv-star { animation: none; }
          .inv-shooting-star { display: none; }
        }
      `}</style>
    </div>
  );
}
