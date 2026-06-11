"use client";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function FilterTabs({ tabs, activeId, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              "inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer select-none",
              isActive
                ? "bg-(--color-accent-soft) text-(--color-accent)"
                : "bg-(--color-surface-soft) text-(--color-text-secondary) hover:bg-(--color-border) hover:text-(--color-text)",
            ].join(" ")}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={[
                  "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                  isActive
                    ? "bg-(--color-accent) text-white"
                    : "bg-(--color-border) text-(--color-text-muted)",
                ].join(" ")}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
