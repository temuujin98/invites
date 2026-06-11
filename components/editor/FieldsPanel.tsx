"use client";

import type { TemplateFieldConfig, FieldType } from "@/types/template";
import { LayerList } from "./LayerList";
import { FieldSettingsPanel } from "./FieldSettingsPanel";

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
  onUpdateField: (id: string, patch: Partial<TemplateFieldConfig>) => void;
}

export function FieldsPanel({
  fields,
  selectedFieldId,
  onSelect,
  onToggleLock,
  onToggleVisible,
  onDuplicate,
  onDelete,
  onAdd,
  onReorder,
  onUpdateField,
}: Props) {
  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  return (
    <div
      id="editor-fields-panel"
      style={{
        width: 268,
        flexShrink: 0,
        background: "var(--color-surface)",
        borderLeft: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Layer list */}
      <div
        style={{
          flexShrink: 0,
          borderBottom: "1px solid var(--color-border)",
          maxHeight: 280,
          overflowY: "auto",
        }}
      >
        <LayerList
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelect={onSelect}
          onToggleLock={onToggleLock}
          onToggleVisible={onToggleVisible}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onAdd={onAdd}
          onReorder={onReorder}
        />
      </div>

      {/* Field settings */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {selectedField ? (
          <FieldSettingsPanel
            field={selectedField}
            onUpdate={(patch) => onUpdateField(selectedField.id, patch)}
          />
        ) : (
          <div
            style={{
              padding: 16,
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: 11,
              marginTop: 24,
            }}
          >
            Талбар сонгоно уу
          </div>
        )}
      </div>
    </div>
  );
}
