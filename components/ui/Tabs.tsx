"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeId, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`flex items-end border-b border-(--color-border) gap-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              "px-3 pb-2 pt-1 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px cursor-pointer",
              isActive
                ? "border-(--color-accent) text-(--color-text)"
                : "border-transparent text-(--color-text-muted) hover:text-(--color-text-secondary)",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
