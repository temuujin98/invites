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
      <div
        className="relative w-full overflow-hidden rounded-(--radius-card-lg) bg-(--color-surface-soft) shadow-(--shadow-sm) transition-shadow duration-200 group-hover:shadow-(--shadow-md)"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {template.status === "published" && (
          <span className="absolute top-2 right-2 rounded-(--radius-ctrl) bg-(--color-success-soft) px-2 py-0.5 text-[10px] font-medium text-(--color-success)">
            Нийтлэгдсэн
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-sm font-medium text-(--color-text) leading-snug break-keep-all">
          {template.name}
        </p>
        {category && (
          <p className="text-xs text-(--color-text-muted)">
            {category.icon} {category.name}
          </p>
        )}
      </div>
    </article>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
