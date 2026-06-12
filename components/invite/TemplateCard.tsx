"use client";

import Link from "next/link";
import type { InviteTemplate, TemplateCategory } from "@/types/template";

interface TemplateCardProps {
  template: InviteTemplate;
  category?: TemplateCategory;
  href?: string;
}

export function TemplateCard({ template, category, href }: TemplateCardProps) {
  const card = (
    <article className="group flex flex-col gap-2 cursor-pointer">
      {/* Thumbnail */}
      <div
        className="relative w-full overflow-hidden rounded-(--radius-card) bg-(--color-surface-soft) shadow-sm transition-shadow duration-200 group-hover:shadow-md"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />

        {/* Type badge — top-left */}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm" style={{ backgroundColor: "rgba(31,29,26,0.65)" }}>
          {template.type === "video" ? (
            <>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
                <rect x="1" y="2.5" width="7" height="7" rx="1.5"/><path d="M8 5.5L11 3.5v5L8 6.5"/>
              </svg>
              Видео
            </>
          ) : (
            <>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
                <rect x="1.5" y="1.5" width="9" height="9" rx="2"/><circle cx="4.5" cy="4.5" r="1"/><path d="M10.5 8L8 5.5 3 10.5"/>
              </svg>
              Зураг
            </>
          )}
        </span>

        {/* PRO badge — top-right */}
        {template.status === "published" && (
          <span className="absolute right-2 top-2 rounded-sm bg-(--color-accent) px-1.5 py-0.5 text-[10px] font-bold text-white">
            PRO
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-primary/0 pb-4 opacity-0 transition-all duration-200 group-hover:bg-primary/25 group-hover:opacity-100">
          <span className="rounded-(--radius-ctrl) bg-(--color-surface) px-4 py-2 text-[12px] font-medium text-(--color-text) shadow-md">
            Урилга үүсгэх
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-[13px] font-medium leading-snug text-(--color-text)">
          {template.name}
        </p>
        {category && (
          <p className="text-[11px] text-(--color-text-muted)">
            {category.icon} {category.name}
          </p>
        )}
      </div>
    </article>
  );

  if (href) return <Link href={href}>{card}</Link>;
  return card;
}
