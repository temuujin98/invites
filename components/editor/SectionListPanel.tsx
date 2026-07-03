"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SectionConfig, SectionType } from "@/types/section";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

interface Props {
  sections: SectionConfig[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (type: SectionType) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

// ── Section icon (24×24 path from registry) ──────────────────────────────────

function SectionIcon({ iconPath, size = 13 }: { iconPath: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={iconPath}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Eye toggle icon ───────────────────────────────────────────────────────────

function EyeIcon({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// ── Sortable row wrapper ──────────────────────────────────────────────────────

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggleEnabled,
  onRemove,
}: {
  section: SectionConfig;
  isSelected: boolean;
  onSelect: () => void;
  onToggleEnabled: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const entry = SECTION_REGISTRY[section.type];

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : section.enabled ? 1 : 0.45,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === "Enter" && onSelect()}
        className="section-row-group"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 8px",
          borderRadius: 7,
          cursor: "pointer",
          background: isSelected ? "var(--color-accent-soft)" : "transparent",
          border: isSelected
            ? "1px solid var(--color-accent)"
            : "1px solid transparent",
          color: isSelected ? "var(--color-accent)" : "var(--color-text)",
          fontSize: 11,
          userSelect: "none",
        }}
      >
        {/* Drag handle */}
        <span
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          style={{
            color: "var(--color-text-muted)",
            flexShrink: 0,
            cursor: "grab",
            fontSize: 12,
            touchAction: "none",
          }}
          aria-label="Дараалал өөрчлөх"
        >
          ⠿
        </span>

        {/* Section type icon */}
        <span
          style={{
            flexShrink: 0,
            color: isSelected ? "var(--color-accent)" : "var(--color-text-muted)",
          }}
        >
          <SectionIcon iconPath={entry.iconPath} />
        </span>

        {/* Label */}
        <span
          style={{
            flex: 1,
            fontSize: 11,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: isSelected ? "var(--color-accent)" : "var(--color-text)",
            minWidth: 0,
          }}
        >
          {entry.label}
        </span>

        {/* Delete — hover-only */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          title="Устгах"
          className="section-hover-action"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 3px",
            flexShrink: 0,
            color: "var(--color-danger)",
            borderRadius: 3,
            lineHeight: 1,
            opacity: 0,
            transition: "opacity 100ms",
            fontSize: 13,
          }}
          aria-label="Хэсэг устгах"
        >
          ×
        </button>

        {/* Eye toggle — always visible */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleEnabled(); }}
          title={section.enabled ? "Нуух" : "Харуулах"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 3px",
            flexShrink: 0,
            color: "var(--color-text-muted)",
            opacity: section.enabled ? 0.5 : 0.3,
          }}
          aria-label={section.enabled ? "Нуух" : "Харуулах"}
        >
          <EyeIcon enabled={section.enabled} />
        </button>
      </div>

      <style>{`
        .section-row-group:hover .section-hover-action { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

// ── Add section dropdown ──────────────────────────────────────────────────────

function AddSectionDropdown({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const items = (Object.keys(SECTION_REGISTRY) as SectionType[]).map((type) => ({
    label: SECTION_REGISTRY[type].label,
    onClick: () => onAdd(type),
  }));

  return (
    <DropdownMenu
      align="right"
      trigger={
        <span
          style={{
            fontSize: 11,
            color: "var(--color-accent)",
            cursor: "pointer",
            fontWeight: 500,
            userSelect: "none",
            padding: "2px 4px",
            borderRadius: 4,
          }}
        >
          + Хэсэг нэмэх
        </span>
      }
      items={items}
    />
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function SectionListPanel({
  sections,
  selectedSectionId,
  onSelect,
  onToggleEnabled,
  onRemove,
  onAdd,
  onReorder,
}: Props) {
  // Sort ascending by order (order 1 = top of invitation)
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sorted.findIndex((s) => s.id === active.id);
    const toIndex = sorted.findIndex((s) => s.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;
    // sorted is already low→high (ascending order), indices pass directly
    onReorder(fromIndex, toIndex);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px 6px",
          borderBottom: "1px solid var(--color-border-muted)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Хэсгүүд ({sections.length})
        </span>
        <AddSectionDropdown onAdd={onAdd} />
      </div>

      {/* Sortable section rows */}
      <div style={{ padding: "4px 6px", display: "flex", flexDirection: "column", gap: 1 }}>
        {sorted.length === 0 && (
          <p
            style={{
              padding: "12px 8px",
              fontSize: 11,
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            Хэсэг байхгүй
          </p>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorted.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sorted.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isSelected={section.id === selectedSectionId}
                onSelect={() => onSelect(section.id)}
                onToggleEnabled={() => onToggleEnabled(section.id)}
                onRemove={() => onRemove(section.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
