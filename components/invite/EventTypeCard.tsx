import Link from "next/link";
import type { TemplateCategory } from "@/types/template";

interface EventTypeCardProps {
  category: TemplateCategory;
  href?: string;
  active?: boolean;
}

export function EventTypeCard({ category, href, active = false }: EventTypeCardProps) {
  const card = (
    <article
      aria-current={active ? "true" : undefined}
      className={[
        "flex flex-col items-center justify-center gap-2 rounded-(--radius-card) p-4 border transition-colors duration-150 select-none",
        active
          ? "bg-(--color-accent-soft) border-(--color-accent)"
          : "bg-(--color-surface) border-(--color-border) hover:bg-(--color-surface-soft)",
      ].join(" ")}
    >
      <span style={{ fontSize: 48, lineHeight: 1 }} aria-hidden="true">
        {category.icon}
      </span>
      <p
        className={[
          "text-xs font-medium text-center break-keep-all",
          active ? "text-(--color-accent)" : "text-(--color-text)",
        ].join(" ")}
      >
        {category.name}
      </p>
    </article>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
