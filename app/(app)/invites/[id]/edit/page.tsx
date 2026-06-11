"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { mockInvites, mockTemplates } from "@/lib/mock-data";
import { RESERVED_SLUGS } from "@/lib/constants";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { GeneratedInviteForm } from "@/components/invite/GeneratedInviteForm";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { ImageCropUpload } from "@/components/shared/ImageCropUpload";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { APP_URL } from "@/lib/constants";
import type { InviteTemplate, InviteValues, TemplateFieldConfig } from "@/types/template";

type StepKey = "info" | "location" | "photo" | "publish";
type SlugState = "idle" | "checking" | "available" | "taken" | "invalid";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "info", label: "Мэдээлэл" },
  { key: "location", label: "Байршил" },
  { key: "photo", label: "Зураг" },
  { key: "publish", label: "Хадгалах" },
];

const STEP_INDEX: Record<StepKey, number> = { info: 0, location: 1, photo: 2, publish: 3 };

const MOCK_TAKEN = new Set(["bat-erdene-solongo-hurim-2026", "anujin-6-nas-2026", "tsengel-graduation-2026"]);

function isValidSlugChar(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s);
}

function sanitizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-");
}

function infoFields(fields: TemplateFieldConfig[]): TemplateFieldConfig[] {
  const INFO_TYPES = new Set(["text", "date", "time", "custom"]);
  return fields.filter((f) => INFO_TYPES.has(f.type) && f.key !== "location");
}

function locationFields(fields: TemplateFieldConfig[]): TemplateFieldConfig[] {
  return fields.filter((f) => f.type === "location");
}

function imageFields(fields: TemplateFieldConfig[]): TemplateFieldConfig[] {
  return fields.filter((f) => f.type === "image");
}

// ── SlugStatusIcon (same as create page) ─────────────────────────────────

function SlugStatusIcon({ state }: { state: SlugState }) {
  if (state === "checking") {
    return (
      <svg className="animate-spin text-(--color-text-muted)" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
      </svg>
    );
  }
  if (state === "available") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-(--color-success)">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === "taken" || state === "invalid") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-(--color-danger)">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}

function slugMessage(state: SlugState, currentSlug: string, originalSlug: string): { text: string; color: string } | null {
  if (state === "checking") return { text: "Шалгаж байна...", color: "text-(--color-text-muted)" };
  if (state === "available" || (state === "taken" && currentSlug === originalSlug))
    return { text: "Ашиглах боломжтой", color: "text-(--color-success)" };
  if (state === "taken") return { text: "Энэ холбоос аль хэдийн ашиглагдаж байна", color: "text-(--color-danger)" };
  if (state === "invalid") return { text: "Зөвхөн a–z, 0–9, зураас (-) ашиглана (3–60 тэмдэгт)", color: "text-(--color-danger)" };
  return null;
}

// ── Edit page inner ────────────────────────────────────────────────────────

function EditPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inviteId = typeof params.id === "string" ? params.id : "";
  const invite = useMemo(() => mockInvites.find((i) => i.id === inviteId) ?? null, [inviteId]);
  const template = useMemo(
    () => (invite ? mockTemplates.find((t) => t.id === invite.templateId) ?? null : null),
    [invite],
  );

  const stepParam = (searchParams.get("step") ?? "info") as StepKey;
  const currentStepKey: StepKey = STEP_INDEX[stepParam] !== undefined ? stepParam : "info";
  const currentStep = STEP_INDEX[currentStepKey];

  const [values, setValues] = useState<InviteValues>(invite?.values ?? {});
  const [shareSlug, setShareSlug] = useState(invite?.shareSlug ?? "");
  const [isPublic, setIsPublic] = useState(invite?.isPublic ?? true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const originalSlug = invite?.shareSlug ?? "";

  const [slugState, setSlugState] = useState<SlugState>("available");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback(
    (slug: string) => {
      if (!slug) { setSlugState("idle"); return; }
      if (!isValidSlugChar(slug) || slug.length < 3 || slug.length > 60) {
        setSlugState("invalid");
        return;
      }
      if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
        setSlugState("taken");
        return;
      }
      if (slug === originalSlug) { setSlugState("available"); return; }
      setSlugState("checking");
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSlugState(MOCK_TAKEN.has(slug) ? "taken" : "available");
      }, 500);
    },
    [originalSlug],
  );

  useEffect(() => {
    checkSlug(shareSlug);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [shareSlug, checkSlug]);

  function goToStep(key: StepKey) {
    const url = new URL(window.location.href);
    url.searchParams.set("step", key);
    router.push(url.pathname + url.search);
  }

  function handleNext() {
    const next = STEPS[currentStep + 1];
    if (next) goToStep(next.key);
  }

  function handleBack() {
    if (currentStep === 0) {
      router.push("/dashboard");
    } else {
      const prev = STEPS[currentStep - 1];
      if (prev) goToStep(prev.key);
    }
  }

  async function handleSave() {
    if (slugState !== "available") return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!invite || !template) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--color-bg) px-4">
        <p className="text-sm text-(--color-text-secondary)">Урилга олдсонгүй.</p>
        <Link href="/dashboard" className="text-sm font-medium text-(--color-accent) hover:underline">
          ← Dashboard руу буцах
        </Link>
      </div>
    );
  }

  const imgFields = imageFields(template.fields);
  const canSave = slugState === "available";

  return (
    <div className="min-h-screen bg-(--color-bg)">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-(--color-border) bg-(--color-surface)/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
            aria-label="Буцах"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-1 flex-col gap-0.5 justify-center">
            <p className="text-xs font-semibold text-(--color-text) truncate">{invite.title}</p>
            <p className="text-[11px] text-(--color-text-muted) hidden sm:block">Засварлах</p>
          </div>

          <div className="flex-1 flex justify-center">
            <Stepper steps={STEPS} current={currentStep} />
          </div>

          <button
            type="button"
            onClick={() => setPreviewOpen((o) => !o)}
            className="flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2.5 text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors md:hidden"
          >
            {previewOpen ? "Хаах" : "Харах"}
          </button>
        </div>
      </header>

      {/* ── Mobile preview ── */}
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
                <PhonePreviewFrame>
                  <InviteRenderer template={template} values={values} mode="preview" />
                </PhonePreviewFrame>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        <div className="flex gap-10">
          {/* Form */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepKey}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: "easeOut" as const }}
              >
                {currentStepKey === "info" && (
                  <StepInfo template={template} values={values} onChange={setValues} />
                )}
                {currentStepKey === "location" && (
                  <StepLocation template={template} values={values} onChange={setValues} />
                )}
                {currentStepKey === "photo" && (
                  <StepPhoto imgFields={imgFields} values={values} onChange={setValues} />
                )}
                {currentStepKey === "publish" && (
                  <StepSave
                    shareSlug={shareSlug}
                    onSlugChange={(v) => setShareSlug(sanitizeSlug(v))}
                    slugState={slugState}
                    originalSlug={originalSlug}
                    isPublic={isPublic}
                    onPublicChange={setIsPublic}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="secondary" size="md" onClick={handleBack}>
                {currentStep === 0 ? "← Dashboard" : "← Буцах"}
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button variant="accent" size="md" onClick={handleNext}>
                  Дараах →
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="md"
                  onClick={handleSave}
                  loading={saving}
                  disabled={!canSave}
                >
                  {saved ? "Хадгалагдлаа ✓" : "Хадгалах"}
                </Button>
              )}
            </div>
          </div>

          {/* Desktop preview */}
          <div className="hidden w-56 shrink-0 md:block">
            <div className="sticky top-24">
              <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wider text-(--color-text-muted)">
                Урьдчилан харах
              </p>
              <PhonePreviewFrame>
                <InviteRenderer template={template} values={values} mode="preview" />
              </PhonePreviewFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step components (same shape as create flow) ────────────────────────────

function StepInfo({ template, values, onChange }: { template: InviteTemplate; values: InviteValues; onChange: (v: InviteValues) => void }) {
  const fields = infoFields(template.fields);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Арга хэмжээний мэдээлэл</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">Үндсэн мэдээллийг засварлана уу</p>
      </div>
      {fields.length > 0 ? (
        <GeneratedInviteForm fields={fields} values={values} onChange={onChange} />
      ) : (
        <p className="text-xs text-(--color-text-muted)">Энэ загварт нэмэлт текст талбар байхгүй.</p>
      )}
    </div>
  );
}

function StepLocation({ template, values, onChange }: { template: InviteTemplate; values: InviteValues; onChange: (v: InviteValues) => void }) {
  const fields = locationFields(template.fields);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Байршил</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">Арга хэмжээ болох газрын мэдээлэл</p>
      </div>
      {fields.length > 0 ? (
        <GeneratedInviteForm fields={fields} values={values} onChange={onChange} />
      ) : (
        <p className="text-xs text-(--color-text-muted)">Энэ загварт байршлын талбар байхгүй.</p>
      )}
    </div>
  );
}

function StepPhoto({ imgFields, values, onChange }: { imgFields: TemplateFieldConfig[]; values: InviteValues; onChange: (v: InviteValues) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Зураг</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">Урилгандаа зургийг шинэчлэнэ үү</p>
      </div>
      {imgFields.length > 0 ? (
        <div className="flex flex-col gap-5">
          {imgFields.map((field) => (
            <ImageCropUpload
              key={field.id}
              label={field.label}
              value={values[field.key]?.assetUrl}
              withCrop
              onImage={(url) => onChange({ ...values, [field.key]: { assetUrl: url } })}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface-soft) py-10 text-center">
          <p className="text-xs text-(--color-text-muted)">Энэ загварт зургийн талбар байхгүй.</p>
        </div>
      )}
    </div>
  );
}

function StepSave({
  shareSlug,
  onSlugChange,
  slugState,
  originalSlug,
  isPublic,
  onPublicChange,
}: {
  shareSlug: string;
  onSlugChange: (v: string) => void;
  slugState: SlugState;
  originalSlug: string;
  isPublic: boolean;
  onPublicChange: (v: boolean) => void;
}) {
  const msg = slugMessage(slugState, shareSlug, originalSlug);
  const BASE_URL = `${APP_URL}/i/`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Тохиргоо</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">Урилгын холбоос болон харагдах байдлыг тохируулна уу</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-(--color-text-secondary)">Урилгын холбоос</label>
        <div className="flex items-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) focus-within:border-(--color-accent) focus-within:ring-2 focus-within:ring-[var(--focus-ring)] transition-colors overflow-hidden">
          <span className="shrink-0 border-r border-(--color-border) bg-(--color-surface-soft) px-2.5 py-[7px] text-xs text-(--color-text-muted) select-none">
            {BASE_URL}
          </span>
          <input
            type="text"
            value={shareSlug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="flex-1 min-w-0 bg-transparent px-2.5 py-[7px] text-sm text-(--color-text) focus:outline-none placeholder:text-(--color-text-muted)"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <div className="pr-2.5">
            <SlugStatusIcon state={slugState === "taken" && shareSlug === originalSlug ? "available" : slugState} />
          </div>
        </div>
        {msg && <p className={`text-xs ${msg.color}`}>{msg.text}</p>}
      </div>

      <div className="flex items-center justify-between rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-4 py-3">
        <div>
          <p className="text-sm font-medium text-(--color-text)">Нийтэд нээлттэй</p>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">
            {isPublic ? "Холбоос мэдэх хэн ч харж болно" : "Зөвхөн та болон танд холбоос илгээсэн хүмүүс харна"}
          </p>
        </div>
        <Toggle checked={isPublic} onChange={onPublicChange} />
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────

export default function EditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
        </div>
      }
    >
      <EditPageInner />
    </Suspense>
  );
}
