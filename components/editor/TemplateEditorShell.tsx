"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { InviteTemplate, TemplateCategory } from "@/types/template";
import { RESERVED_SLUGS } from "@/lib/constants";
import { useEditorState } from "./useEditorState";
import { TemplateSettingsPanel } from "./TemplateSettingsPanel";
import { TemplateCanvas } from "./TemplateCanvas";
import { FieldsPanel } from "./FieldsPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";

// ── Shared label helper (DB values unchanged, only display differs) ──────────
function tplStatusLabel(status: "draft" | "published") {
  return status === "published" ? "Идэвхтэй" : "Идэвхгүй";
}

// ── Inner shell (needs toast context) ────────────────────────────────────────

function EditorShellInner({ initialTemplate, categories }: { initialTemplate: InviteTemplate; categories: TemplateCategory[] }) {
  const router = useRouter();
  const toast = useToast();

  const {
    template,
    selectedFieldId,
    setSelectedFieldId,
    updateTemplateMeta,
    updateField,
    addField,
    removeField,
    duplicateField,
    reorderFields,
    toggleLock,
    toggleVisible,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    showSafeArea,
    toggleSafeArea,
    showSampleData,
    toggleSampleData,
    isDirty,
    markSaved,
    setStatus,
  } = useEditorState(initialTemplate);

  const [showPreview, setShowPreview] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // beforeunload guard
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  async function doSave(): Promise<boolean> {
    if (saving) return false;

    const slug = template.slug.trim();
    if (!slug || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3 || slug.length > 60) {
      toast.show("Slug нь 3–60 тэмдэгт, зөвхөн a-z, 0-9, - тэмдэгт агуулна", "error");
      return false;
    }
    if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
      toast.show(`"${slug}" нь хориглогдсон slug`, "error");
      return false;
    }

    setSaving(true);
    try {
      const supabase = createClient();

      if (slug !== initialTemplate.slug) {
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

      // Save persists content/meta only — never touches status column.
      // Status is changed exclusively via handleStatusToggle below.
      const tplPatch: Record<string, unknown> = {
        name: template.name,
        slug,
        category_id: template.categoryId,
        type: template.type,
        canvas_width: template.canvasWidth,
        canvas_height: template.canvasHeight,
        updated_at: new Date().toISOString(),
      };
      if (template.pendingBgAssetId !== undefined) {
        tplPatch.bg_asset_id = template.pendingBgAssetId;
      }
      if (template.pendingThumbAssetId !== undefined) {
        tplPatch.thumb_asset_id = template.pendingThumbAssetId;
      }

      const { error: tplErr } = await supabase
        .from("templates")
        .update(tplPatch)
        .eq("id", template.id);
      if (tplErr) throw tplErr;

      if (template.fields.length > 0) {
        const fieldRows = template.fields.map((f) => ({
          id: f.id,
          template_id: template.id,
          key: f.key,
          label: f.label,
          placeholder: f.placeholder ?? null,
          type: f.type,
          required: f.required,
          x: f.x,
          y: f.y,
          width: f.width,
          height: f.height,
          font_family: f.fontFamily ?? null,
          font_size: f.fontSize ?? null,
          font_weight: f.fontWeight ?? null,
          line_height: f.lineHeight ?? null,
          max_chars: f.maxChars ?? null,
          color: f.color ?? null,
          align: f.align ?? null,
          border_radius: f.borderRadius ?? null,
          object_fit: f.objectFit ?? null,
          visible: f.visible,
          locked: f.locked,
          layer_order: f.layerOrder,
        }));
        const { error: fieldsErr } = await supabase
          .from("template_fields")
          .upsert(fieldRows, { onConflict: "id" });
        if (fieldsErr) throw fieldsErr;
      }

      markSaved();
      return true;
    } catch {
      toast.show("Хадгалахад алдаа гарлаа", "error");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    const ok = await doSave();
    if (ok) toast.show("Хадгалагдлаа", "success");
  }

  // Status toggle: auto-saves pending edits first so no content is lost,
  // then flips status in a separate DB update. Save never touches status.
  async function handleStatusToggle() {
    if (togglingStatus) return;
    setTogglingStatus(true);
    try {
      if (isDirty) {
        const saved = await doSave();
        if (!saved) return;
      }
      const newStatus = template.status === "published" ? "draft" : "published";
      const supabase = createClient();
      const { error } = await supabase
        .from("templates")
        .update({ status: newStatus })
        .eq("id", template.id);
      if (error) throw error;
      setStatus(newStatus);
      toast.show(
        newStatus === "published" ? "Идэвхтэй болгосон" : "Идэвхгүй болгосон",
        "success",
      );
    } catch {
      toast.show("Алдаа гарлаа", "error");
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
    markSaved(); // discard
    if (pendingNavHref) router.push(pendingNavHref);
  }

  // Sample values for preview
  const previewValues = Object.fromEntries(
    template.fields.map((f) => [f.key, { text: f.placeholder ?? f.label }]),
  );

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
      {/* ── Topbar ── */}
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
        {/* Back button */}
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
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--color-surface-soft)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Загварууд
        </button>

        {/* Divider */}
        <span style={{ width: 1, height: 20, background: "var(--color-border)", flexShrink: 0 }} />

        {/* Template name + status badge */}
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

        {/* Right side */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {/* Хадгалах — content/meta only, never changes status */}
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
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              Хадгалагдсан
            </span>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            Урьдчилан үзэх
          </Button>
        </div>
      </div>

      {/* ── 3-panel body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <TemplateSettingsPanel
          template={template}
          categories={categories}
          onChange={updateTemplateMeta}
          onStatusToggle={handleStatusToggle}
          togglingStatus={togglingStatus}
        />

        <TemplateCanvas
          template={template}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
          zoom={zoom}
          setZoom={setZoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          showSafeArea={showSafeArea}
          toggleSafeArea={toggleSafeArea}
          showSampleData={showSampleData}
          toggleSampleData={toggleSampleData}
          updateField={updateField}
          addField={addField}
        />

        <FieldsPanel
          fields={template.fields}
          selectedFieldId={selectedFieldId}
          onSelect={setSelectedFieldId}
          onToggleLock={toggleLock}
          onToggleVisible={toggleVisible}
          onDuplicate={duplicateField}
          onDelete={removeField}
          onAdd={addField}
          onReorder={reorderFields}
          onUpdateField={updateField}
        />
      </div>

      {/* ── Mobile Preview Modal ── */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Урьдчилан үзэх"
        size="sm"
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <PhonePreviewFrame
            canvasWidth={template.canvasWidth}
            canvasHeight={template.canvasHeight}
          >
            <InviteRenderer
              template={template}
              values={previewValues}
              mode="preview"
            />
          </PhonePreviewFrame>
        </div>
      </Modal>

      {/* ── Unsaved changes confirm ── */}
      <ConfirmDialog
        open={showUnsavedConfirm}
        onClose={() => { setShowUnsavedConfirm(false); setPendingNavHref(null); }}
        onConfirm={handleUnsavedConfirm}
        title="Хадгалагдаагүй өөрчлөлт байна"
        message="Өөрчлөлтүүд хадгалагдаагүй байна. Гарах уу?"
        confirmLabel="Гарах"
        danger
      />
    </div>
  );
}

// ── Public export (wraps with ToastProvider) ──────────────────────────────

export function TemplateEditorShell({ initialTemplate, categories }: { initialTemplate: InviteTemplate; categories: TemplateCategory[] }) {
  return (
    <ToastProvider>
      <EditorShellInner initialTemplate={initialTemplate} categories={categories} />
    </ToastProvider>
  );
}
