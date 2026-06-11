"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { InviteTemplate } from "@/types/template";
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

// ── Inner shell (needs toast context) ────────────────────────────────────────

function EditorShellInner({ initialTemplate }: { initialTemplate: InviteTemplate }) {
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
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [showPublishErrors, setShowPublishErrors] = useState(false);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);

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

  function handleSave() {
    markSaved();
    toast.show("Хадгалагдлаа", "success");
  }

  function validatePublish(): string[] {
    const errors: string[] = [];
    if (!template.backgroundUrl) errors.push("Фон зураг байхгүй байна");
    if (!template.thumbnailUrl) errors.push("Thumbnail байхгүй байна");
    if (template.fields.length === 0) errors.push("Нэг ч талбар байхгүй байна");
    return errors;
  }

  function handlePublishClick() {
    if (template.status === "published") {
      // Draft toggle — confirm directly
      setShowPublishConfirm(true);
      return;
    }
    const errs = validatePublish();
    if (errs.length > 0) {
      setPublishErrors(errs);
      setShowPublishErrors(true);
      return;
    }
    setShowPublishConfirm(true);
  }

  function handlePublishConfirm() {
    const newStatus = template.status === "published" ? "draft" : "published";
    setStatus(newStatus);
    markSaved();
    toast.show(
      newStatus === "published" ? "Нийтлэгдлээ" : "Ноорог болгосон",
      "success",
    );
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

        {/* Template name + status */}
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
          {template.status === "published" ? "Нийтэлсэн" : "Ноорог"}
        </Badge>

        {/* Right side */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {isDirty ? (
            <button
              type="button"
              onClick={handleSave}
              style={{
                height: 28,
                paddingInline: 12,
                borderRadius: "var(--radius-ctrl)",
                border: "1px solid var(--color-accent)",
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Хадгалах
            </button>
          ) : (
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              Хадгалагдсан · сая
            </span>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            Урьдчилан үзэх
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={handlePublishClick}
          >
            {template.status === "published" ? "Ноорог болгох" : "Нийтлэх"}
          </Button>
        </div>
      </div>

      {/* ── 3-panel body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <TemplateSettingsPanel
          template={template}
          onChange={updateTemplateMeta}
          onPublishToggle={handlePublishClick}
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

      {/* ── Publish confirm ── */}
      <ConfirmDialog
        open={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        onConfirm={handlePublishConfirm}
        title={template.status === "published" ? "Ноорог болгох уу?" : "Нийтлэх үү?"}
        message={
          template.status === "published"
            ? "Загварыг ноорог болгох уу? Хэрэглэгчид харахгүй болно."
            : "Загварыг нийтлэх үү? Хэрэглэгчид харагдах болно."
        }
        confirmLabel={template.status === "published" ? "Ноорог болгох" : "Нийтлэх"}
      />

      {/* ── Publish validation errors modal ── */}
      <Modal
        open={showPublishErrors}
        onClose={() => setShowPublishErrors(false)}
        title="Нийтлэх боломжгүй"
        size="sm"
      >
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>
          Нийтлэхийн өмнө дараах зүйлсийг бөглөнө үү:
        </p>
        <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {publishErrors.map((err, i) => (
            <li key={i} style={{ fontSize: 12, color: "var(--color-danger)" }}>
              {err}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" size="sm" onClick={() => setShowPublishErrors(false)}>
            Хаах
          </Button>
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

export function TemplateEditorShell({ initialTemplate }: { initialTemplate: InviteTemplate }) {
  return (
    <ToastProvider>
      <EditorShellInner initialTemplate={initialTemplate} />
    </ToastProvider>
  );
}
