"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { mockTemplates } from "@/lib/mock-data";
import { RESERVED_SLUGS } from "@/lib/constants";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { GeneratedInviteForm } from "@/components/invite/GeneratedInviteForm";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { ImageCropUpload } from "@/components/shared/ImageCropUpload";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import type { InviteTemplate, InviteValues, TemplateFieldConfig } from "@/types/template";
import { APP_URL } from "@/lib/constants";
import { QRPreview } from "@/components/invite/QRPreview";

// ── Constants ──────────────────────────────────────────────────────────────

type StepKey = "info" | "location" | "photo" | "publish";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "info",     label: "Мэдээлэл" },
  { key: "location", label: "Байршил" },
  { key: "photo",    label: "Зураг" },
  { key: "publish",  label: "Нийтлэх" },
];

const STEP_INDEX: Record<StepKey, number> = {
  info: 0, location: 1, photo: 2, publish: 3,
};

// ── Slug helpers ──────────────────────────────────────────────────────────

type SlugState = "idle" | "checking" | "available" | "taken" | "invalid";

function isValidSlugChar(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s);
}

function sanitizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-");
}

// Mock taken slugs (besides reserved ones)
const MOCK_TAKEN = new Set(["bat-erdene-solongo-hurim-2026", "anujin-6-nas-2026", "tsengel-graduation-2026"]);

// ── localStorage helpers ──────────────────────────────────────────────────

function draftKey(slug: string) {
  return `invite_draft_${slug}`;
}

interface DraftData {
  values: InviteValues;
  shareSlug: string;
  isPublic: boolean;
}

function loadDraft(templateSlug: string): DraftData | null {
  try {
    const raw = localStorage.getItem(draftKey(templateSlug));
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

function saveDraft(templateSlug: string, data: DraftData) {
  try {
    localStorage.setItem(draftKey(templateSlug), JSON.stringify(data));
  } catch {
    // storage full — silently ignore
  }
}

function clearDraft(templateSlug: string) {
  try {
    localStorage.removeItem(draftKey(templateSlug));
  } catch {
    // ignore
  }
}

// ── Field splitters ───────────────────────────────────────────────────────

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

// ── Page inner (needs searchParams) ──────────────────────────────────────

function CreatePageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const templateSlug = typeof params.templateSlug === "string" ? params.templateSlug : "";
  const template = useMemo(
    () => mockTemplates.find((t) => t.slug === templateSlug) ?? null,
    [templateSlug],
  );

  // Resolve step from query param
  const stepParam = (searchParams.get("step") ?? "info") as StepKey;
  const currentStepKey: StepKey = STEP_INDEX[stepParam] !== undefined ? stepParam : "info";
  const currentStep = STEP_INDEX[currentStepKey];

  // ── Form state ──
  const [values, setValues] = useState<InviteValues>({});
  const [shareSlug, setShareSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // ── Slug availability ──
  const [slugState, setSlugState] = useState<SlugState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Preview collapse (mobile) ──
  const [previewOpen, setPreviewOpen] = useState(false);

  // ── Publish success ──
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // ── Load localStorage draft on mount ──
  useEffect(() => {
    if (!templateSlug || draftLoaded) return;
    const draft = loadDraft(templateSlug);
    if (draft) {
      setValues(draft.values);
      setShareSlug(draft.shareSlug);
      setIsPublic(draft.isPublic);
    } else {
      // Default share slug from template slug
      setShareSlug(templateSlug + "-" + Date.now().toString(36));
    }
    setDraftLoaded(true);
  }, [templateSlug, draftLoaded]);

  // ── Persist draft whenever values/slug/public changes ──
  useEffect(() => {
    if (!draftLoaded || !templateSlug) return;
    saveDraft(templateSlug, { values, shareSlug, isPublic });
  }, [values, shareSlug, isPublic, draftLoaded, templateSlug]);

  // ── Slug availability check ──
  const checkSlug = useCallback((slug: string) => {
    if (!slug) { setSlugState("idle"); return; }
    if (!isValidSlugChar(slug) || slug.length < 3 || slug.length > 60) {
      setSlugState("invalid");
      return;
    }
    if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
      setSlugState("taken");
      return;
    }
    setSlugState("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Mock check
      setSlugState(MOCK_TAKEN.has(slug) ? "taken" : "available");
    }, 500);
  }, []);

  useEffect(() => {
    checkSlug(shareSlug);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [shareSlug, checkSlug]);

  // ── Navigation helpers ──
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
      router.push(`/templates/${templateSlug}`);
    } else {
      const prev = STEPS[currentStep - 1];
      if (prev) goToStep(prev.key);
    }
  }

  // ── Publish ──
  async function handlePublish() {
    if (slugState !== "available") return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 900));
    setPublishing(false);
    clearDraft(templateSlug);
    setPublished(true);
  }

  // ── Not found ──
  if (!template) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--color-bg) px-4">
        <p className="text-sm text-(--color-text-secondary)">Загвар олдсонгүй.</p>
        <Link href="/templates" className="text-sm font-medium text-(--color-accent) hover:underline">
          ← Загварууд руу буцах
        </Link>
      </div>
    );
  }

  // ── Publish success screen ──
  if (published) {
    return <PublishSuccessScreen template={template} shareSlug={shareSlug} />;
  }

  const imgFields = imageFields(template.fields);

  return (
    <div className="min-h-screen bg-(--color-bg)">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-(--color-border) bg-(--color-surface)/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 md:px-6">
          {/* Logo mark */}
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2 mr-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-(--color-accent)">
              <span className="text-[12px] font-bold text-white">i</span>
            </div>
          </Link>

          <div className="flex flex-1 justify-center">
            <Stepper steps={STEPS} current={currentStep} />
          </div>

          {/* Save & exit — desktop */}
          <button
            type="button"
            onClick={handleBack}
            className="hidden md:flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
          >
            Хадгалаад гарах
          </button>

          {/* Mobile: back icon + preview toggle */}
          <div className="flex items-center gap-2 md:hidden">
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
            <button
              type="button"
              onClick={() => setPreviewOpen((o) => !o)}
              className="flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2.5 text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M4 4h4M4 6h4M4 8h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
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
                <PhonePreviewFrame
                  canvasWidth={template.canvasWidth}
                  canvasHeight={template.canvasHeight}
                >
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
          {/* ── Form column ── */}
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
                  <StepInfo
                    template={template}
                    values={values}
                    onChange={setValues}
                  />
                )}
                {currentStepKey === "location" && (
                  <StepLocation
                    template={template}
                    values={values}
                    onChange={setValues}
                  />
                )}
                {currentStepKey === "photo" && (
                  <StepPhoto
                    imgFields={imgFields}
                    values={values}
                    onChange={setValues}
                  />
                )}
                {currentStepKey === "publish" && (
                  <StepPublish
                    shareSlug={shareSlug}
                    onSlugChange={(v) => setShareSlug(sanitizeSlug(v))}
                    slugState={slugState}
                    isPublic={isPublic}
                    onPublicChange={setIsPublic}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Step navigation ── */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="secondary" size="md" onClick={handleBack}>
                {currentStep === 0 ? "← Загвар руу буцах" : "← Буцах"}
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button variant="accent" size="md" onClick={handleNext}>
                  Дараах →
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="md"
                  onClick={handlePublish}
                  loading={publishing}
                  disabled={slugState !== "available"}
                >
                  Нийтлэх
                </Button>
              )}
            </div>
          </div>

          {/* ── Sticky desktop preview ── */}
          <div className="hidden w-56 shrink-0 md:block">
            <div className="sticky top-24">
              <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wider text-(--color-text-muted)">
                Урьдчилан харах
              </p>
              <PhonePreviewFrame
                canvasWidth={template.canvasWidth}
                canvasHeight={template.canvasHeight}
              >
                <InviteRenderer template={template} values={values} mode="preview" />
              </PhonePreviewFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Мэдээлэл ─────────────────────────────────────────────────────

function StepInfo({
  template,
  values,
  onChange,
}: {
  template: InviteTemplate;
  values: InviteValues;
  onChange: (v: InviteValues) => void;
}) {
  const fields = infoFields(template.fields);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Арга хэмжээний мэдээлэл</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">
          Үндсэн мэдээллийг бөглөнө үү
        </p>
      </div>
      {fields.length > 0 ? (
        <GeneratedInviteForm fields={fields} values={values} onChange={onChange} />
      ) : (
        <p className="text-xs text-(--color-text-muted)">
          Энэ загварт нэмэлт текст талбар байхгүй.
        </p>
      )}
    </div>
  );
}

// ── Step 2: Байршил ───────────────────────────────────────────────────────

function StepLocation({
  template,
  values,
  onChange,
}: {
  template: InviteTemplate;
  values: InviteValues;
  onChange: (v: InviteValues) => void;
}) {
  const fields = locationFields(template.fields);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Байршил</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">
          Арга хэмжээ болох газрын мэдээлэл
        </p>
      </div>
      {fields.length > 0 ? (
        <GeneratedInviteForm fields={fields} values={values} onChange={onChange} />
      ) : (
        <p className="text-xs text-(--color-text-muted)">
          Энэ загварт байршлын талбар байхгүй.
        </p>
      )}
    </div>
  );
}

// ── Step 3: Зураг ────────────────────────────────────────────────────────

function StepPhoto({
  imgFields,
  values,
  onChange,
}: {
  imgFields: TemplateFieldConfig[];
  values: InviteValues;
  onChange: (v: InviteValues) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Зураг</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">
          Урилгандаа зураг нэмнэ үү
        </p>
      </div>
      {imgFields.length > 0 ? (
        <div className="flex flex-col gap-5">
          {imgFields.map((field) => (
            <ImageCropUpload
              key={field.id}
              label={field.label}
              value={values[field.key]?.assetUrl}
              withCrop
              onImage={(url) =>
                onChange({ ...values, [field.key]: { assetUrl: url } })
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface-soft) py-10 text-center">
          <p className="text-xs text-(--color-text-muted)">
            Энэ загварт зургийн талбар байхгүй.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Step 4: Нийтлэх ──────────────────────────────────────────────────────

function SlugStatusIcon({ state }: { state: SlugState }) {
  if (state === "checking") {
    return (
      <svg
        className="animate-spin text-(--color-text-muted)"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
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

function slugMessage(state: SlugState): { text: string; color: string } | null {
  if (state === "checking")  return { text: "Шалгаж байна...", color: "text-(--color-text-muted)" };
  if (state === "available") return { text: "Ашиглах боломжтой", color: "text-(--color-success)" };
  if (state === "taken")     return { text: "Энэ холбоос аль хэдийн ашиглагдаж байна", color: "text-(--color-danger)" };
  if (state === "invalid")   return { text: "Зөвхөн a–z, 0–9, зураас (-) ашиглана (3–60 тэмдэгт)", color: "text-(--color-danger)" };
  return null;
}

function StepPublish({
  shareSlug,
  onSlugChange,
  slugState,
  isPublic,
  onPublicChange,
}: {
  shareSlug: string;
  onSlugChange: (v: string) => void;
  slugState: SlugState;
  isPublic: boolean;
  onPublicChange: (v: boolean) => void;
}) {
  const msg = slugMessage(slugState);
  const BASE_URL = `${APP_URL}/i/`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">Нийтлэх</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">
          Урилгын холбоосыг тохируулж нийтлэнэ үү
        </p>
      </div>

      {/* Slug field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-(--color-text-secondary)">
          Урилгын холбоос
        </label>
        <div className="flex items-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) focus-within:border-(--color-accent) focus-within:ring-2 focus-within:ring-[var(--focus-ring)] transition-colors overflow-hidden">
          <span className="shrink-0 border-r border-(--color-border) bg-(--color-surface-soft) px-2.5 py-[7px] text-xs text-(--color-text-muted) select-none">
            {BASE_URL}
          </span>
          <input
            type="text"
            value={shareSlug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="flex-1 min-w-0 bg-transparent px-2.5 py-[7px] text-sm text-(--color-text) focus:outline-none placeholder:text-(--color-text-muted)"
            placeholder="minii-urlagin-ner"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <div className="pr-2.5">
            <SlugStatusIcon state={slugState} />
          </div>
        </div>
        {msg && (
          <p className={`text-xs ${msg.color}`}>{msg.text}</p>
        )}
      </div>

      {/* Public toggle */}
      <div className="flex items-center justify-between rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-4 py-3">
        <div>
          <p className="text-sm font-medium text-(--color-text)">Нийтэд нээлттэй</p>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">
            {isPublic
              ? "Холбоос мэдэх хэн ч харж болно"
              : "Зөвхөн та болон танд холбоос илгээсэн хүмүүс харна"}
          </p>
        </div>
        <Toggle checked={isPublic} onChange={onPublicChange} />
      </div>

      {/* Info card */}
      <div className="rounded-(--radius-card) bg-(--color-accent-soft) border border-(--color-accent)/20 px-4 py-3">
        <p className="text-xs font-medium text-(--color-accent)">Нийтэлсний дараа</p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {[
            "Холбоосыг хуулж зочдод илгээнэ",
            "QR код татаж болно",
            "RSVP хариуг Dashboard-аас харна",
          ].map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[11px] text-(--color-accent)">
              <span aria-hidden="true">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Publish success screen ────────────────────────────────────────────────

function PublishSuccessScreen({
  template,
  shareSlug,
}: {
  template: InviteTemplate;
  shareSlug: string;
}) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${APP_URL}/i/${shareSlug}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-0 bg-(--color-bg) px-4 py-12">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" as const }}
        className="w-full max-w-sm"
      >
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-success-soft)">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <circle cx="13" cy="13" r="11" stroke="var(--color-success)" strokeWidth="1.8" />
              <path d="M8 13l3.5 3.5L18 9" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-(--color-text)">Урилга нийтлэгдлээ!</h1>
          <p className="mt-1 text-xs text-(--color-text-secondary)">
            {template.name} загвараар амжилттай үүслээ
          </p>
        </div>

        {/* Link box */}
        <div className="mb-6 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-4 flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-(--color-text-secondary)">Урилгын холбоос</p>
            <div className="flex items-center gap-2 rounded-(--radius-ctrl) bg-(--color-surface-soft) px-3 py-2">
              <span className="flex-1 truncate text-xs text-(--color-text)">{fullUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-(--radius-ctrl) bg-(--color-accent) px-2.5 py-1 text-[11px] font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
              >
                {copied ? "Хуулагдлаа ✓" : "Хуулах"}
              </button>
            </div>
          </div>
          <div className="flex justify-center pt-1">
            <QRPreview url={fullUrl} size={140} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/i/${shareSlug}`}
            className="flex h-10 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-sm font-medium text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
          >
            Урилга харах →
          </Link>
          <Link
            href="/dashboard"
            className="flex h-10 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) text-sm font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
          >
            Dashboard руу очих
          </Link>
          <Link
            href="/templates"
            className="text-center text-xs text-(--color-text-muted) hover:text-(--color-text) transition-colors"
          >
            Шинэ урилга үүсгэх
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Export with Suspense ──────────────────────────────────────────────────

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
        </div>
      }
    >
      <CreatePageInner />
    </Suspense>
  );
}
