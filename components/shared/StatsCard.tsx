import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
}

export function StatsCard({ label, value, delta, icon }: StatsCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-(--radius-card) bg-(--color-surface) border border-(--color-border) shadow-(--shadow-sm) p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-(--color-text-muted)">{label}</span>
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-(--radius-ctrl) bg-(--color-surface-soft) text-(--color-text-secondary)">
            {icon}
          </span>
        )}
      </div>
      <span className="text-[22px] font-bold leading-none text-(--color-text)">
        {value}
      </span>
      {delta && (
        <span className="text-xs text-(--color-text-muted)">{delta}</span>
      )}
    </div>
  );
}
