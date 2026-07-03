"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setTemplateStatus } from "@/app/admin/templates/actions";
import type { SectionTemplate } from "@/types/section";
import type { TemplateCategory } from "@/types/template";
import { RESERVED_SLUGS } from "@/lib/constants";
import { useSectionEditorState } from "./useSectionEditorState";
import { SectionListPanel } from "./SectionListPanel";
import { SectionSettingsPanel } from "./SectionSettingsPanel";
import { ThemePanel } from "./ThemePanel";
import { TemplateBasicsPanel } from "./TemplateBasicsPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { SectionRenderer } from "@/components/invite/SectionRenderer";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";

function tplStatusLabel(status: "draft" | "published") {
  return status === "published" ? "Идэвхтэй" : "Идэвхгүй";
}

type RightTab = "section" | "theme";

function EditorShellInner({
  initialTemplate,
  categories,
}: {
  initialTemplate: SectionTemplate;
  categories: TemplateCategory[];
}) {
  const router = useRouter();
  const toast = useToast();

  const {
    template,
    selectedSectionId,
    isDirty,
    setSelectedSectionId,
    updateTemplateMeta,
    updateTheme,
    addSection,
    removeSection,
    updateSectionConfig,
    toggleEnabled,
    reorderSections,
    markSaved,
    setStatus,
  } = useSectionEditorState(initialTemplate);

  const [rightTab, setRightTab] = useState<RightTab>("section");
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Tracks the last-committed slug so the uniqueness check stays correct across
  // multiple saves in one session, even before router.replace re-mounts (H1).
  const committedSlugRef = useRef(initialTemplate.slug);

  const selectedSection = template.sections.find((s) => s.id === selectedSectionId) ?? null;

  // Switch right tab to section settings when a section is selected.
  useEffect(() => {
    if (selectedSectionId) setRightTab("section");
  }, [selectedSectionId]);

  // beforeunload guard
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  async function doSave(): Promise<boolean> {
    if (saving) return false;

    const slug = template.slug.trim();
    if (!slug || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3 || slug.length > 60) {
      toast.show("Slug нь 3–60 тэмдэгт, зөвхөн a-z, 0-9, - агуулна", "error");
      return false;
    }
    if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
      toast.show(`"${slug}" нь хориглогдсон slug`, "error");
      return false;
    }
    if (!template.categoryId) {
      toast.show("Ангилал сонгоно уу", "error");
      return false;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const isNew = template.id.startsWith("new-");

      // Slug uniqueness
      if (isNew) {
        const { data: existing } = await supabase
          .from("templates")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (existing) {
          toast.show(`Slug "${slug}" аль хэдийн ашиглагдаж байна`, "error");
          return false;
        }
      } else if (slug !== committedSlugRef.current) {
        const { data: existing } = await supabase
          .from("templates")
          .select("id")
          .eq("slug", slug)
          .neq("id", template.id)
          .maybeSingle();
        if (existing) {
          toast.show(`Slug "${slug}" аль хэдийн ашиглагдаж байна`, "error");
          return false;
        }
      }

      const tplPatch: Record<string, unknown> = {
        name: template.name,
        slug,
        category_id: template.categoryId,
        sections: template.sections,
        theme: template.theme,
        updated_at: new Date().toISOString(),
      };
      if (template.pendingThumbAssetId !== undefined) {
        tplPatch.thumb_asset_id = template.pendingThumbAssetId;
      }

      let savedId = template.id;

      if (isNew) {
        const { data: created, error: insErr } = await supabase
          .from("templates")
          // section templates are image-type shells; keep type for schema compat
          .insert({ ...tplPatch, type: "image", status: "draft" })
          .select("id")
          .single();
        if (insErr) throw insErr;
        savedId = created.id as string;
      } else {
        const { error: tplErr } = await supabase
          .from("templates")
          .update(tplPatch)
          .eq("id", template.id);
        if (tplErr) throw tplErr;
      }

      committedSlugRef.current = slug;
      markSaved();
      if (isNew) router.replace(`/admin/templates/${savedId}/edit`);
      return true;
    } catch (err) {
      const msg = (err as { message?: string } | null)?.message ?? "Хадгалахад алдаа гарлаа";
      toast.show(msg, "error");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    const ok = await doSave();
    if (ok) toast.show("Хадгалагдлаа", "success");
  }

  async function handleStatusToggle() {
    if (togglingStatus) return;
    // Publish validation: at least one enabled section.
    if (template.status !== "published" && !template.sections.some((s) => s.enabled)) {
      toast.show("Дор хаяж нэг идэвхтэй хэсэг шаардлагатай", "error");
      return;
    }
    setTogglingStatus(true);
    try {
      if (isDirty) {
        const saved = await doSave();
        if (!saved) return;
      }
      const newStatus = template.status === "published" ? "draft" : "published";
      const result = await setTemplateStatus(template.id, newStatus);
      if (!result.ok) throw new Error(result.message);
      setStatus(newStatus);
      toast.show(newStatus === "published" ? "Идэвхтэй болгосон" : "Идэвхгүй болгосон", "success");
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Алдаа гарлаа", "error");
    } finally {
      setTogglingStatus(false);
    }
  }

  const handleBackClick = useCallback(() => {
    if (isDirty) {
      setPendingNavHref("/admin/templates");
      setShowUnsavedConfirm(true);
    } else {
      router.push("/admin/templates");
    }
  }, [isDirty, router]);

  function handleUnsavedConfirm() {
    // Only discard + navigate when there's a real destination — avoids clearing
    // dirty state without navigating on a dialog race (H4).
    if (pendingNavHref) {
      markSaved();
      router.push(pendingNavHref);
    }
  }

  // Sample content so the preview isn't empty (uses section registry placeholders).
  const previewContent = {};

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
        fontFamily: "var(--font-family)",
        fontSize: 12,
        overflow: "hidden",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          height: 52,
          flexShrink: 0,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingInline: 16,
        }}
      >
        <button
          type="button"
          onClick={handleBackClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            fontSize: 12,
            padding: "4px 6px",
            borderRadius: "var(--radius-ctrl)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Загварууд
        </button>

        <span style={{ width: 1, height: 20, background: "var(--color-border)", flexShrink: 0 }} />

        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {template.name || "Нэргүй загвар"}
        </span>
        <Badge variant={template.status === "published" ? "success" : "warning"} size="sm">
          {tplStatusLabel(template.status)}
        </Badge>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {isDirty || saving ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                height: 28,
                paddingInline: 12,
                borderRadius: "var(--radius-ctrl)",
                border: "1px solid var(--color-accent)",
                background: saving ? "var(--color-surface-soft)" : "var(--color-accent-soft)",
                color: saving ? "var(--color-text-muted)" : "var(--color-accent)",
                fontSize: 11,
                fontWeight: 500,
                cursor: saving ? "default" : "pointer",
              }}
            >
              {saving ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          ) : (
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Хадгалагдсан</span>
          )}

          <Button variant="secondary" size="sm" onClick={handleStatusToggle} loading={togglingStatus}>
            {template.status === "published" ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
          </Button>
        </div>
      </div>

      {/* 3-panel body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: template basics + section list */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            borderRight: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            overflowY: "auto",
          }}
        >
          <TemplateBasicsPanel template={template} categories={categories} onChange={updateTemplateMeta} />
          <SectionListPanel
            sections={template.sections}
            selectedSectionId={selectedSectionId}
            onSelect={setSelectedSectionId}
            onToggleEnabled={toggleEnabled}
            onRemove={removeSection}
            onAdd={addSection}
            onReorder={reorderSections}
          />
        </div>

        {/* Center: live scrolling preview */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "24px 16px",
            overflowY: "auto",
            background: "var(--color-bg)",
          }}
        >
          <div style={{ width: 390, flexShrink: 0 }}>
            <PhonePreviewFrame canvasWidth={390} canvasHeight={844}>
              <div style={{ height: "100%", overflowY: "auto" }}>
                <SectionRenderer
                  template={template}
                  content={previewContent}
                  mode="editor"
                  selectedSectionId={selectedSectionId ?? undefined}
                  onSectionSelect={setSelectedSectionId}
                />
              </div>
            </PhonePreviewFrame>
          </div>
        </div>

        {/* Right: section settings / theme (tabbed) */}
        <div
          style={{
            width: 300,
            flexShrink: 0,
            borderLeft: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)" }}>
            {(["section", "theme"] as RightTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRightTab(tab)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  borderBottom: rightTab === tab ? "2px solid var(--color-accent)" : "2px solid transparent",
                  color: rightTab === tab ? "var(--color-accent)" : "var(--color-text-secondary)",
                  cursor: "pointer",
                }}
              >
                {tab === "section" ? "Хэсэг" : "Загвар"}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {rightTab === "section" ? (
              selectedSection ? (
                <SectionSettingsPanel
                  section={selectedSection}
                  onChange={(patch) => updateSectionConfig(selectedSection.id, patch)}
                />
              ) : (
                <p style={{ padding: 16, fontSize: 11, color: "var(--color-text-muted)", textAlign: "center" }}>
                  Хэсэг сонгоно уу
                </p>
              )
            ) : (
              <ThemePanel theme={template.theme} onChange={updateTheme} />
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showUnsavedConfirm}
        onClose={() => {
          setShowUnsavedConfirm(false);
          setPendingNavHref(null);
        }}
        onConfirm={handleUnsavedConfirm}
        title="Хадгалагдаагүй өөрчлөлт байна"
        message="Өөрчлөлтүүд хадгалагдаагүй байна. Гарах уу?"
        confirmLabel="Гарах"
        danger
      />
    </div>
  );
}

export function TemplateSectionEditorShell({
  initialTemplate,
  categories,
}: {
  initialTemplate: SectionTemplate;
  categories: TemplateCategory[];
}) {
  return (
    <ToastProvider>
      <EditorShellInner initialTemplate={initialTemplate} categories={categories} />
    </ToastProvider>
  );
}
