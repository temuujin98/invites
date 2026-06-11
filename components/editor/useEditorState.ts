"use client";

import { useCallback, useReducer } from "react";
import type { InviteTemplate, TemplateFieldConfig, FieldType } from "@/types/template";

// ── Types ──────────────────────────────────────────────────────────────────

interface EditorState {
  template: InviteTemplate;
  selectedFieldId: string | null;
  zoom: number;
  showSafeArea: boolean;
  showSampleData: boolean;
  isDirty: boolean;
}

type Action =
  | { type: "SET_SELECTED"; id: string | null }
  | { type: "UPDATE_TEMPLATE_META"; patch: Partial<Omit<InviteTemplate, "fields">> }
  | { type: "UPDATE_FIELD"; id: string; patch: Partial<TemplateFieldConfig> }
  | { type: "ADD_FIELD"; field: TemplateFieldConfig }
  | { type: "REMOVE_FIELD"; id: string }
  | { type: "DUPLICATE_FIELD"; id: string }
  | { type: "REORDER_FIELDS"; fromIndex: number; toIndex: number }
  | { type: "TOGGLE_LOCK"; id: string }
  | { type: "TOGGLE_VISIBLE"; id: string }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "TOGGLE_SAFE_AREA" }
  | { type: "TOGGLE_SAMPLE_DATA" }
  | { type: "MARK_SAVED" }
  | { type: "SET_STATUS"; status: "draft" | "published" };

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "SET_SELECTED":
      return { ...state, selectedFieldId: action.id };

    case "UPDATE_TEMPLATE_META":
      return {
        ...state,
        template: { ...state.template, ...action.patch },
        isDirty: true,
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        template: {
          ...state.template,
          fields: state.template.fields.map((f) =>
            f.id === action.id ? { ...f, ...action.patch } : f,
          ),
        },
        isDirty: true,
      };

    case "ADD_FIELD":
      return {
        ...state,
        template: {
          ...state.template,
          fields: [...state.template.fields, action.field],
        },
        selectedFieldId: action.field.id,
        isDirty: true,
      };

    case "REMOVE_FIELD": {
      const newFields = state.template.fields.filter((f) => f.id !== action.id);
      return {
        ...state,
        template: { ...state.template, fields: newFields },
        selectedFieldId:
          state.selectedFieldId === action.id ? null : state.selectedFieldId,
        isDirty: true,
      };
    }

    case "DUPLICATE_FIELD": {
      const orig = state.template.fields.find((f) => f.id === action.id);
      if (!orig) return state;
      const maxOrder = Math.max(...state.template.fields.map((f) => f.layerOrder), 0);
      const copy: TemplateFieldConfig = {
        ...orig,
        id: crypto.randomUUID(),
        key: `${orig.key}_copy`,
        x: orig.x + 20,
        y: orig.y + 20,
        layerOrder: maxOrder + 1,
      };
      return {
        ...state,
        template: { ...state.template, fields: [...state.template.fields, copy] },
        selectedFieldId: copy.id,
        isDirty: true,
      };
    }

    case "REORDER_FIELDS": {
      const fields = [...state.template.fields].sort((a, b) => a.layerOrder - b.layerOrder);
      const [moved] = fields.splice(action.fromIndex, 1);
      fields.splice(action.toIndex, 0, moved);
      const reordered = fields.map((f, i) => ({ ...f, layerOrder: i + 1 }));
      return {
        ...state,
        template: { ...state.template, fields: reordered },
        isDirty: true,
      };
    }

    case "TOGGLE_LOCK":
      return {
        ...state,
        template: {
          ...state.template,
          fields: state.template.fields.map((f) =>
            f.id === action.id ? { ...f, locked: !f.locked } : f,
          ),
        },
        isDirty: true,
      };

    case "TOGGLE_VISIBLE":
      return {
        ...state,
        template: {
          ...state.template,
          fields: state.template.fields.map((f) =>
            f.id === action.id ? { ...f, visible: !f.visible } : f,
          ),
        },
        isDirty: true,
      };

    case "SET_ZOOM":
      return { ...state, zoom: Math.min(150, Math.max(20, action.zoom)) };

    case "TOGGLE_SAFE_AREA":
      return { ...state, showSafeArea: !state.showSafeArea };

    case "TOGGLE_SAMPLE_DATA":
      return { ...state, showSampleData: !state.showSampleData };

    case "MARK_SAVED":
      return { ...state, isDirty: false };

    case "SET_STATUS":
      return {
        ...state,
        template: { ...state.template, status: action.status },
        isDirty: true,
      };

    default:
      return state;
  }
}

// ── Field defaults ─────────────────────────────────────────────────────────

function buildNewField(
  type: FieldType,
  canvasWidth: number,
  canvasHeight: number,
  maxLayerOrder: number,
): TemplateFieldConfig {
  const cx = Math.round(canvasWidth / 2);
  const cy = Math.round(canvasHeight / 2);

  const defaults: Record<FieldType, Partial<TemplateFieldConfig>> = {
    text:     { width: 400, height: 80,  x: cx - 200, y: cy - 40,  fontSize: 48, fontWeight: 400, color: "#1F1D1A", align: "center" },
    date:     { width: 300, height: 60,  x: cx - 150, y: cy - 30,  fontSize: 36, fontWeight: 400, color: "#1F1D1A", align: "center" },
    time:     { width: 200, height: 60,  x: cx - 100, y: cy - 30,  fontSize: 36, fontWeight: 400, color: "#1F1D1A", align: "center" },
    location: { width: 500, height: 60,  x: cx - 250, y: cy - 30,  fontSize: 32, fontWeight: 400, color: "#1F1D1A", align: "center" },
    image:    { width: 300, height: 300, x: cx - 150, y: cy - 150, borderRadius: 8, objectFit: "cover" },
    qr:       { width: 200, height: 200, x: cx - 100, y: cy - 100 },
    rsvp:     { width: 300, height: 60,  x: cx - 150, y: cy - 30 },
    custom:   { width: 300, height: 60,  x: cx - 150, y: cy - 30 },
  };

  const typeLabels: Record<FieldType, string> = {
    text: "Текст",
    date: "Огноо",
    time: "Цаг",
    location: "Байршил",
    image: "Зураг",
    qr: "QR код",
    rsvp: "RSVP",
    custom: "Захиалгат",
  };

  const keyPrefix: Record<FieldType, string> = {
    text: "text_field",
    date: "event_date",
    time: "event_time",
    location: "location",
    image: "image_field",
    qr: "qr_code",
    rsvp: "rsvp_button",
    custom: "custom_field",
  };

  return {
    id: crypto.randomUUID(),
    key: `${keyPrefix[type]}_${Date.now().toString(36)}`,
    label: typeLabels[type],
    placeholder: "",
    type,
    required: false,
    x: 0,
    y: 0,
    width: 200,
    height: 60,
    visible: true,
    locked: false,
    layerOrder: maxLayerOrder + 1,
    ...defaults[type],
  };
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useEditorState(initialTemplate: InviteTemplate) {
  const [state, dispatch] = useReducer(reducer, {
    template: initialTemplate,
    selectedFieldId: null,
    zoom: 40,
    showSafeArea: false,
    showSampleData: true,
    isDirty: false,
  });

  const setSelectedFieldId = useCallback(
    (id: string | null) => dispatch({ type: "SET_SELECTED", id }),
    [],
  );

  const updateTemplateMeta = useCallback(
    (patch: Partial<Omit<InviteTemplate, "fields">>) =>
      dispatch({ type: "UPDATE_TEMPLATE_META", patch }),
    [],
  );

  const updateField = useCallback(
    (id: string, patch: Partial<TemplateFieldConfig>) =>
      dispatch({ type: "UPDATE_FIELD", id, patch }),
    [],
  );

  const addField = useCallback(
    (type: FieldType) => {
      const maxOrder = Math.max(
        ...state.template.fields.map((f) => f.layerOrder),
        0,
      );
      const field = buildNewField(
        type,
        state.template.canvasWidth,
        state.template.canvasHeight,
        maxOrder,
      );
      dispatch({ type: "ADD_FIELD", field });
    },
    [state.template.fields, state.template.canvasWidth, state.template.canvasHeight],
  );

  const removeField = useCallback(
    (id: string) => dispatch({ type: "REMOVE_FIELD", id }),
    [],
  );

  const duplicateField = useCallback(
    (id: string) => dispatch({ type: "DUPLICATE_FIELD", id }),
    [],
  );

  const reorderFields = useCallback(
    (fromIndex: number, toIndex: number) =>
      dispatch({ type: "REORDER_FIELDS", fromIndex, toIndex }),
    [],
  );

  const toggleLock = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_LOCK", id }),
    [],
  );

  const toggleVisible = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_VISIBLE", id }),
    [],
  );

  const setZoom = useCallback(
    (zoom: number) => dispatch({ type: "SET_ZOOM", zoom }),
    [],
  );

  const zoomIn = useCallback(
    () => dispatch({ type: "SET_ZOOM", zoom: state.zoom + 10 }),
    [state.zoom],
  );

  const zoomOut = useCallback(
    () => dispatch({ type: "SET_ZOOM", zoom: state.zoom - 10 }),
    [state.zoom],
  );

  const toggleSafeArea = useCallback(
    () => dispatch({ type: "TOGGLE_SAFE_AREA" }),
    [],
  );

  const toggleSampleData = useCallback(
    () => dispatch({ type: "TOGGLE_SAMPLE_DATA" }),
    [],
  );

  const markSaved = useCallback(
    () => dispatch({ type: "MARK_SAVED" }),
    [],
  );

  const setStatus = useCallback(
    (status: "draft" | "published") => dispatch({ type: "SET_STATUS", status }),
    [],
  );

  return {
    template: state.template,
    selectedFieldId: state.selectedFieldId,
    setSelectedFieldId,
    updateTemplateMeta,
    updateField,
    addField,
    removeField,
    duplicateField,
    reorderFields,
    toggleLock,
    toggleVisible,
    zoom: state.zoom,
    setZoom,
    zoomIn,
    zoomOut,
    showSafeArea: state.showSafeArea,
    toggleSafeArea,
    showSampleData: state.showSampleData,
    toggleSampleData,
    isDirty: state.isDirty,
    markSaved,
    setStatus,
  };
}

export type EditorStateReturn = ReturnType<typeof useEditorState>;
