"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { SectionRenderer } from "@/components/invite/SectionRenderer";
import { SectionContentForm } from "@/components/invite/SectionContentForm";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Input } from "@/components/ui/Input";
import type {
  SectionTemplate,
  InviteSectionContent,
  SectionContentValue,
} from "@/types/section";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContentSection {
  id: string;
  type: string;
  label: string;
  description: string;
  schema: ReturnType<typeof SECTION_REGISTRY[keyof typeof SECTION_REGISTRY]["contentSchema"]["slice"]>;
}

export interface EditFlowProps {
  inviteId: string;
  inviteTitle: string;
  shareSlug: string;
  isPublic: boolean;
  template: SectionTemplate;
  initialContent: InviteSectionContent;
}

// ── Derive editable sections ──────────────────────────────────────────────────

function deriveContentSections(template: SectionTemplate): ContentSection[] {
  return [...template.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => {
      if (!s.enabled) return false;
      const entry = SECTION_REGISTRY[s.type];
      return entry.hasContent && entry.contentSchema.length > 0;
    })
    .map((s) => {
      const entry = SECTION_REGISTRY[s.type];
      return {
        id: s.id,
        type: s.type,
        label: entry.label,
        description: entry.description,
        schema: entry.contentSchema,
      };
    });
}

// ── Main component ────────────────────────────────────────────────────────────

export function EditFlow({
  inviteId,
  inviteTitle,
  shareSlug,
  isPublic: initialIsPublic,
  template,
  initialContent,
}: EditFlowProps) {
  const router = useRouter();

  const [content, setContent] = useState<InviteSectionContent>(initialContent);
  const [title, setTitle] = useState(inviteTitle);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const contentSections = useMemo(() => deriveContentSections(template), [template]);

  function handleSectionChange(sectionId: string, v: SectionContentValue) {
    setContent((prev) => ({ ...prev, [sectionId]: v }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();

      // Extract denormalized fields from the details section
      const detailsSection = template.sections.find(
        (s) => s.type === "details" && s.enabled,
      );
      const detailsContent: SectionContentValue = detailsSection
        ? (content[detailsSection.id] ?? {})
        : {};
      const eventDate = (detailsContent["date"] as string | undefined) ?? null;
      const eventTime = (detailsContent["time"] as string | undefined) ?? null;
      const eventLocation =
        (detailsContent["location"] as string | undefined) ?? null;

      const { error } = await supabase
        .from("invites")
        .update({
          title,
          is_public: isPublic,
          content,
          event_date: eventDate,
          event_time: eventTime,
          event_location: eventLocation,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inviteId);

      if (error) throw new Error(error.message ?? "Хадгалахад алдаа гарлаа");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-(--color-bg)">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-(--color-border) bg-(--color-surface)/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
            aria-label="Буцах"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="text-xs font-semibold text-(--color-text) truncate">{title || inviteTitle}</p>
            <p className="text-[11px] text-(--color-text-muted) hidden sm:block">Засварлах</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/i/${shareSlug}`}
              target="_blank"
              className="hidden sm:flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
            >
              Урилга харах →
            </Link>

            <button
              type="button"
              onClick={() => setPreviewOpen((o) => !o)}
              className="flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2.5 text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors md:hidden"
            >
              {previewOpen ? "Хаах" : "Харах"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile collapsible preview ── */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            key="mobile-preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="overflow-hidden border-b border-(--color-border) bg-(--color-surface) md:hidden"
          >
            <div className="flex justify-center py-4 px-4">
              <div className="w-40">
                <PhonePreviewFrame canvasWidth={390} canvasHeight={844}>
                  <div className="overflow-y-auto h-full">
                    <SectionRenderer template={template} content={content} mode="create" />
                  </div>
                </PhonePreviewFrame>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        <div className="flex gap-10">
          {/* ── Form column ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Invite title */}
            <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-4 py-4">
              <Input
                label="Урилгын гарчиг"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={inviteTitle}
                maxLength={120}
              />
            </div>

            {/* Per-section content blocks */}
            {contentSections.length === 0 ? (
              <p className="text-xs text-(--color-text-muted) px-1">
                Энэ загварт засварлах хэсэг байхгүй.
              </p>
            ) : (
              contentSections.map((sec) => {
                const isOpen = openSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSectionId(isOpen ? null : sec.id)
                      }
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-(--color-surface-soft) transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-(--color-text)">
                          {sec.label}
                        </span>
                        <span className="text-xs text-(--color-text-muted)">
                          {sec.description}
                        </span>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                        className={[
                          "shrink-0 text-(--color-text-muted) transition-transform duration-150",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      >
                        <path
                          d="M3 5l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" as const }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-(--color-border) px-4 py-4">
                            <SectionContentForm
                              fields={sec.schema}
                              value={content[sec.id] ?? {}}
                              onChange={(v) => handleSectionChange(sec.id, v)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}

            {/* Visibility toggle */}
            <div className="flex items-center justify-between rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-4 py-3">
              <div>
                <p className="text-sm font-medium text-(--color-text)">Нийтэд харагдах</p>
                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                  {isPublic
                    ? "Холбоос мэдэх хэн ч харж болно"
                    : "Зөвхөн та болон танд холбоос илгээсэн хүмүүс харна"}
                </p>
              </div>
              <Toggle checked={isPublic} onChange={setIsPublic} />
            </div>

            {saveError && (
              <p className="text-xs text-(--color-danger)" role="alert">
                {saveError}
              </p>
            )}

            {/* Action row */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push("/dashboard")}
              >
                ← Буцах
              </Button>

              <Button
                variant="accent"
                size="md"
                onClick={handleSave}
                loading={saving}
              >
                {saved ? "Хадгалагдлаа ✓" : "Хадгалах"}
              </Button>
            </div>
          </div>

          {/* ── Sticky desktop preview ── */}
          <div className="hidden w-56 shrink-0 md:block">
            <div className="sticky top-24">
              <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wider text-(--color-text-muted)">
                Урьдчилан харах
              </p>
              <PhonePreviewFrame canvasWidth={390} canvasHeight={844}>
                <div className="overflow-y-auto h-full">
                  <SectionRenderer template={template} content={content} mode="create" />
                </div>
              </PhonePreviewFrame>
              <div className="mt-3 flex justify-center">
                <Link
                  href={`/i/${shareSlug}`}
                  target="_blank"
                  className="text-xs text-(--color-text-muted) hover:text-(--color-accent) transition-colors"
                >
                  Урилга харах →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
