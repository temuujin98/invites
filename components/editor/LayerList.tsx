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
import type { TemplateFieldConfig, FieldType } from "@/types/template";
import { LayerItem } from "./LayerItem";

interface Props {
  fields: TemplateFieldConfig[];
  selectedFieldId: string | null;
  onSelect: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (type: FieldType) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const ADD_TYPES: { type: FieldType; label: string }[] = [
  { type: "text",     label: "Текст" },
  { type: "date",     label: "Огноо" },
  { type: "time",     label: "Цаг" },
  { type: "location", label: "Байршил" },
  { type: "image",    label: "Зураг" },
  { type: "qr",       label: "QR код" },
];

// Wrapper that makes a single LayerItem draggable
function SortableLayerItem({
  field,
  isSelected,
  onSelect,
  onToggleLock,
  onToggleVisible,
  onDuplicate,
  onDelete,
}: {
  field: TemplateFieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onToggleLock: () => void;
  onToggleVisible: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <LayerItem
        field={field}
        isSelected={isSelected}
        onSelect={onSelect}
        onToggleLock={onToggleLock}
        onToggleVisible={onToggleVisible}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function LayerList({
  fields,
  selectedFieldId,
  onSelect,
  onToggleLock,
  onToggleVisible,
  onDuplicate,
  onDelete,
  onAdd,
  onReorder,
}: Props) {
  // Top layer first (highest layerOrder first) — matches visual stacking
  const sorted = [...fields].sort((a, b) => b.layerOrder - a.layerOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sorted.findIndex((f) => f.id === active.id);
    const toIndex = sorted.findIndex((f) => f.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;
    // sorted is high→low; reorderFields operates on low→high index order,
    // so mirror the indices: position i in sorted = (n-1-i) in ascending order
    const n = sorted.length;
    onReorder(n - 1 - fromIndex, n - 1 - toIndex);
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
          Давхарга ({fields.length})
        </span>
        <AddFieldDropdown onAdd={onAdd} />
      </div>

      {/* Sortable layer rows */}
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
            Талбар байхгүй
          </p>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorted.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {sorted.map((field) => (
              <SortableLayerItem
                key={field.id}
                field={field}
                isSelected={field.id === selectedFieldId}
                onSelect={() => onSelect(field.id)}
                onToggleLock={() => onToggleLock(field.id)}
                onToggleVisible={() => onToggleVisible(field.id)}
                onDuplicate={() => onDuplicate(field.id)}
                onDelete={() => onDelete(field.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// ── Add field dropdown ─────────────────────────────────────────────────────

function AddFieldDropdown({ onAdd }: { onAdd: (type: FieldType) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <details style={{ listStyle: "none" }}>
        <summary
          style={{
            fontSize: 11,
            color: "var(--color-accent)",
            cursor: "pointer",
            fontWeight: 500,
            listStyle: "none",
            userSelect: "none",
            padding: "2px 4px",
            borderRadius: 4,
          }}
        >
          + Талбар нэмэх
        </summary>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 4px)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
            overflow: "hidden",
            minWidth: 120,
            zIndex: 30,
          }}
        >
          {ADD_TYPES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => onAdd(type)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "7px 12px",
                fontSize: 12,
                color: "var(--color-text)",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--color-border-muted)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--color-surface-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
