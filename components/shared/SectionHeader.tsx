import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-3">
      <h2 className="text-[15px] font-semibold text-(--color-text)">{title}</h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
