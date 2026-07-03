"use client";

import { useCallback, useReducer } from "react";
import type {
  SectionTemplate,
  SectionConfig,
  SectionType,
  InviteTheme,
} from "@/types/section";
import { buildSection } from "@/lib/sections/registry";

// ── Types ──────────────────────────────────────────────────────────────────

interface EditorState {
  template: SectionTemplate;
  selectedSectionId: string | null;
  showThemePanel: boolean;
  isDirty: boolean;
}

type Action =
  | { type: "SET_SELECTED"; id: string | null }
  | { type: "UPDATE_TEMPLATE_META"; patch: Partial<Omit<SectionTemplate, "sections" | "theme">> }
  | { type: "UPDATE_THEME"; patch: Partial<InviteTheme> }
  | { type: "ADD_SECTION"; section: SectionConfig }
  | { type: "REMOVE_SECTION"; id: string }
  | { type: "UPDATE_SECTION_CONFIG"; id: string; patch: Partial<SectionConfig> }
  | { type: "TOGGLE_ENABLED"; id: string }
  | { type: "REORDER_SECTIONS"; fromIndex: number; toIndex: number }
  | { type: "SET_THEME_PANEL"; open: boolean }
  | { type: "MARK_SAVED" }
  | { type: "SET_STATUS"; status: "draft" | "published" };

function reindex(sections: SectionConfig[]): SectionConfig[] {
  return [...sections]
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i + 1 }));
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "SET_SELECTED":
      return { ...state, selectedSectionId: action.id };

    case "UPDATE_TEMPLATE_META":
      return {
        ...state,
        template: { ...state.template, ...action.patch },
        isDirty: true,
      };

    case "UPDATE_THEME":
      return {
        ...state,
        template: {
          ...state.template,
          theme: {
            ...state.template.theme,
            ...action.patch,
            palette: { ...state.template.theme.palette, ...action.patch.palette },
            fonts: { ...state.template.theme.fonts, ...action.patch.fonts },
          },
        },
        isDirty: true,
      };

    case "ADD_SECTION": {
      // Assign order atomically from the authoritative state so two rapid adds
      // can't collide on the same order value (H3).
      const maxOrder = Math.max(0, ...state.template.sections.map((s) => s.order));
      const section = { ...action.section, order: maxOrder + 1 };
      return {
        ...state,
        template: {
          ...state.template,
          sections: [...state.template.sections, section],
        },
        selectedSectionId: section.id,
        isDirty: true,
      };
    }

    case "REMOVE_SECTION": {
      const next = reindex(state.template.sections.filter((s) => s.id !== action.id));
      return {
        ...state,
        template: { ...state.template, sections: next },
        selectedSectionId:
          state.selectedSectionId === action.id ? null : state.selectedSectionId,
        isDirty: true,
      };
    }

    case "UPDATE_SECTION_CONFIG": {
      // Guard the discriminant + identity: a panel patch may only change
      // type-specific config, never id/type/order (Q1 defensive guard).
      const { id: _id, type: _type, order: _order, ...safePatch } =
        action.patch as Record<string, unknown>;
      void _id; void _type; void _order;
      return {
        ...state,
        template: {
          ...state.template,
          sections: state.template.sections.map((s) =>
            s.id === action.id ? ({ ...s, ...safePatch } as SectionConfig) : s,
          ),
        },
        isDirty: true,
      };
    }

    case "TOGGLE_ENABLED":
      return {
        ...state,
        template: {
          ...state.template,
          sections: state.template.sections.map((s) =>
            s.id === action.id ? { ...s, enabled: !s.enabled } : s,
          ),
        },
        isDirty: true,
      };

    case "REORDER_SECTIONS": {
      const sorted = [...state.template.sections].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(action.fromIndex, 1);
      sorted.splice(action.toIndex, 0, moved);
      const reordered = sorted.map((s, i) => ({ ...s, order: i + 1 }));
      return {
        ...state,
        template: { ...state.template, sections: reordered },
        isDirty: true,
      };
    }

    case "SET_THEME_PANEL":
      return { ...state, showThemePanel: action.open, selectedSectionId: action.open ? null : state.selectedSectionId };

    case "MARK_SAVED":
      // Clear the pending thumbnail id so subsequent saves don't re-write (or
      // null out) thumb_asset_id (H2).
      return {
        ...state,
        template: { ...state.template, pendingThumbAssetId: undefined },
        isDirty: false,
      };

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

// ── Hook ───────────────────────────────────────────────────────────────────

export function useSectionEditorState(initialTemplate: SectionTemplate) {
  const [state, dispatch] = useReducer(reducer, {
    template: initialTemplate,
    selectedSectionId: null,
    showThemePanel: false,
    isDirty: false,
  });

  const setSelectedSectionId = useCallback(
    (id: string | null) => dispatch({ type: "SET_SELECTED", id }),
    [],
  );

  const updateTemplateMeta = useCallback(
    (patch: Partial<Omit<SectionTemplate, "sections" | "theme">>) =>
      dispatch({ type: "UPDATE_TEMPLATE_META", patch }),
    [],
  );

  const updateTheme = useCallback(
    (patch: Partial<InviteTheme>) => dispatch({ type: "UPDATE_THEME", patch }),
    [],
  );

  const addSection = useCallback(
    // order is assigned atomically in the reducer; pass 0 as a placeholder.
    (type: SectionType) => dispatch({ type: "ADD_SECTION", section: buildSection(type, 0) }),
    [],
  );

  const removeSection = useCallback(
    (id: string) => dispatch({ type: "REMOVE_SECTION", id }),
    [],
  );

  const updateSectionConfig = useCallback(
    (id: string, patch: Partial<SectionConfig>) =>
      dispatch({ type: "UPDATE_SECTION_CONFIG", id, patch }),
    [],
  );

  const toggleEnabled = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_ENABLED", id }),
    [],
  );

  const reorderSections = useCallback(
    (fromIndex: number, toIndex: number) =>
      dispatch({ type: "REORDER_SECTIONS", fromIndex, toIndex }),
    [],
  );

  const setThemePanel = useCallback(
    (open: boolean) => dispatch({ type: "SET_THEME_PANEL", open }),
    [],
  );

  const markSaved = useCallback(() => dispatch({ type: "MARK_SAVED" }), []);

  const setStatus = useCallback(
    (status: "draft" | "published") => dispatch({ type: "SET_STATUS", status }),
    [],
  );

  return {
    template: state.template,
    selectedSectionId: state.selectedSectionId,
    showThemePanel: state.showThemePanel,
    isDirty: state.isDirty,
    setSelectedSectionId,
    updateTemplateMeta,
    updateTheme,
    addSection,
    removeSection,
    updateSectionConfig,
    toggleEnabled,
    reorderSections,
    setThemePanel,
    markSaved,
    setStatus,
  };
}

export type SectionEditorReturn = ReturnType<typeof useSectionEditorState>;
