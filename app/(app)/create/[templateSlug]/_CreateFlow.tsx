"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RESERVED_SLUGS, APP_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { SectionRenderer } from "@/components/invite/SectionRenderer";
import { SectionContentForm } from "@/components/invite/SectionContentForm";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { QRPreview } from "@/components/invite/QRPreview";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import type { SectionTemplate, InviteSectionContent, SectionContentValue } from "@/types/section";

// ── Draft storage ─────────────────────────────────────────────────────────────

interface DraftData {
  content: InviteSectionContent;
  shareSlug: string;
  isPublic: boolean;
}

function draftKey(templateSlug: string) {
  return `invite_draft_${templateSlug}`;
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

// ── Slug helpers ──────────────────────────────────────────────────────────────

type SlugState = "idle" | "checking" | "available" | "taken" | "invalid";

function isValidSlugChar(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s);
}

function sanitizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-");
}

// ── Step derivation ───────────────────────────────────────────────────────────

interface ContentStep {
  key: string;      // section id
  label: string;
  sectionId: string;
  sectionType: string;
}

interface PublishStep {
  key: "publish";
  label: string;
}

type Step = ContentStep | PublishStep;

function isPublishStep(s: Step): s is PublishStep {
  return s.key === "publish";
}

function deriveSteps(template: SectionTemplate): Step[] {
  const sorted = [...template.sections].sort((a, b) => a.order - b.order);
  const contentSteps: ContentStep[] = sorted
    .filter((s) => {
      if (!s.enabled) return false;
      const entry = SECTION_REGISTRY[s.type];
      return entry.hasContent && entry.contentSchema.length > 0;
    })
    .map((s) => ({
      key: s.id,
      label: SECTION_REGISTRY[s.type].label,
      sectionId: s.id,
      sectionType: s.type,
    }));
  return [...contentSteps, { key: "publish", label: "Нийтлэх" }];
}

// ── Slug status UI ────────────────────────────────────────────────────────────

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

// ── Publish success screen ────────────────────────────────────────────────────

function PublishSuccessScreen({
  templateName,
  shareSlug,
}: {
  templateName: string;
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-bg) px-4 py-12">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" as const }}
        className="w-full max-w-sm"
      >
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
            {templateName} загвараар амжилттай үүслээ
          </p>
        </div>

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

// ── Main component ────────────────────────────────────────────────────────────

export function CreateFlow({ template }: { template: SectionTemplate }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const templateSlug = template.slug;

  // Derive content-bearing steps from template sections
  const steps = useMemo(() => deriveSteps(template), [template]);
  const stepKeys = steps.map((s) => s.key);

  // Resolve step from query param
  const stepParam = searchParams.get("step") ?? stepKeys[0] ?? "publish";
  const currentStepIndex = stepKeys.includes(stepParam) ? stepKeys.indexOf(stepParam) : 0;
  const currentStep = steps[currentStepIndex] as Step;

  // ── Form state ──
  const [content, setContent] = useState<InviteSectionContent>({});
  const [shareSlug, setShareSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // ── Slug availability ──
  const [slugState, setSlugState] = useState<SlugState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Preview collapse (mobile) ──
  const [previewOpen, setPreviewOpen] = useState(false);

  // ── Publish success ──
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // ── Load draft on mount ──
  useEffect(() => {
    if (!templateSlug || draftLoaded) return;
    const draft = loadDraft(templateSlug);
    if (draft) {
      setContent(draft.content);
      setShareSlug(draft.shareSlug);
      setIsPublic(draft.isPublic);
    } else {
      setShareSlug(templateSlug + "-" + Date.now().toString(36));
    }
    setDraftLoaded(true);
  }, [templateSlug, draftLoaded]);

  // ── Persist draft ──
  useEffect(() => {
    if (!draftLoaded || !templateSlug) return;
    saveDraft(templateSlug, { content, shareSlug, isPublic });
  }, [content, shareSlug, isPublic, draftLoaded, templateSlug]);

  // ── Slug check ──
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
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/slug-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        const json = (await res.json()) as { ok: boolean; data?: { available: boolean } };
        setSlugState(json.ok && json.data?.available ? "available" : "taken");
      } catch {
        setSlugState("available");
      }
    }, 500);
  }, []);

  useEffect(() => {
    checkSlug(shareSlug);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [shareSlug, checkSlug]);

  // ── Navigation ──
  function goToStepIndex(i: number) {
    const key = stepKeys[i];
    if (!key) return;
    const url = new URL(window.location.href);
    url.searchParams.set("step", key);
    router.push(url.pathname + url.search);
  }

  function handleNext() {
    setShowErrors(true);
    goToStepIndex(currentStepIndex + 1);
  }

  function handleBack() {
    setShowErrors(false);
    if (currentStepIndex === 0) {
      router.push(`/templates/${templateSlug}`);
    } else {
      goToStepIndex(currentStepIndex - 1);
    }
  }

  // ── Publish ──
  async function handlePublish() {
    if (slugState !== "available") return;
    setPublishing(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) throw new Error("Нэвтрэх шаардлагатай");

      // Derive title from cover section content, fallback to template name
      const coverSection = template.sections.find((s) => s.type === "cover" && s.enabled);
      const title = coverSection
        ? ((content[coverSection.id]?.["title"] as string | undefined) ?? template.name)
        : template.name;

      // Extract event_date / event_time / event_location from details section
      const detailsSection = template.sections.find((s) => s.type === "details" && s.enabled);
      const detailsContent: SectionContentValue = detailsSection ? (content[detailsSection.id] ?? {}) : {};
      const eventDate = (detailsContent["date"] as string | undefined) ?? null;
      const eventTime = (detailsContent["time"] as string | undefined) ?? null;
      const eventLocation = (detailsContent["location"] as string | undefined) ?? null;

      const { error: invErr } = await supabase
        .from("invites")
        .insert({
          user_id: user.id,
          template_id: template.id,
          title,
          share_slug: shareSlug,
          is_public: isPublic,
          status: "published",
          published_at: new Date().toISOString(),
          content,
          event_date: eventDate,
          event_time: eventTime,
          event_location: eventLocation,
        });

      if (invErr) throw new Error(invErr.message ?? "Урилга үүсгэхэд алдаа гарлаа");

      clearDraft(templateSlug);
      setPublishing(false);
      setPublished(true);
    } catch (err) {
      setPublishing(false);
      alert(err instanceof Error ? err.message : "Алдаа гарлаа");
    }
  }

  // ── Stepper steps adapter ──
  const stepperSteps = steps.map((s) => ({ key: s.key, label: s.label }));

  if (published) {
    return <PublishSuccessScreen templateName={template.name} shareSlug={shareSlug} />;
  }

  return (
    <div className="min-h-screen bg-(--color-bg)">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-(--color-border) bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 md:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2 mr-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-(--color-accent)">
              <span className="text-[12px] font-bold text-white">i</span>
            </div>
          </Link>

          <div className="flex flex-1 justify-center overflow-hidden">
            <Stepper steps={stepperSteps} current={currentStepIndex} />
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="hidden md:flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 text-xs text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"

          >
            Хадгалаад гарах
          </button>

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
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.key}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: "easeOut" as const }}
              >
                {isPublishStep(currentStep) ? (
                  <StepPublish
                    shareSlug={shareSlug}
                    onSlugChange={(v) => setShareSlug(sanitizeSlug(v))}
                    slugState={slugState}
                    isPublic={isPublic}
                    onPublicChange={setIsPublic}
                  />
                ) : (
                  <StepContent
                    step={currentStep}
                    content={content[currentStep.sectionId] ?? {}}
                    onChange={(v) =>
                      setContent((prev) => ({ ...prev, [currentStep.sectionId]: v }))
                    }
                    showErrors={showErrors}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Step navigation ── */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="secondary" size="md" onClick={handleBack}>
                {currentStepIndex === 0 ? "← Загвар руу буцах" : "← Буцах"}
              </Button>

              {isPublishStep(currentStep) ? (
                <Button
                  variant="accent"
                  size="md"
                  onClick={handlePublish}
                  loading={publishing}
                  disabled={slugState !== "available"}
                >
                  Нийтлэх
                </Button>
              ) : (
                <Button variant="accent" size="md" onClick={handleNext}>
                  Дараах →
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
              <PhonePreviewFrame canvasWidth={390} canvasHeight={844}>
                <div className="overflow-y-auto h-full">
                  <SectionRenderer template={template} content={content} mode="create" />
                </div>
              </PhonePreviewFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Content step ──────────────────────────────────────────────────────────────

function StepContent({
  step,
  content,
  onChange,
  showErrors,
}: {
  step: ContentStep;
  content: SectionContentValue;
  onChange: (v: SectionContentValue) => void;
  showErrors: boolean;
}) {
  const entry = SECTION_REGISTRY[step.sectionType as keyof typeof SECTION_REGISTRY];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-(--color-text)">{entry.label}</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">{entry.description}</p>
      </div>
      <SectionContentForm
        fields={entry.contentSchema}
        value={content}
        onChange={onChange}
        showErrors={showErrors}
      />
    </div>
  );
}

// ── Publish step ──────────────────────────────────────────────────────────────

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
        <div className="flex items-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) focus-within:border-(--color-accent) focus-within:ring-2 focus-within:ring-(--focus-ring) transition-colors overflow-hidden">
          <span className="shrink-0 border-r border-(--color-border) bg-(--color-surface-soft) px-2.5 py-1.75 text-xs text-(--color-text-muted) select-none">
            {BASE_URL}
          </span>
          <input
            type="text"
            value={shareSlug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="flex-1 min-w-0 bg-transparent px-2.5 py-1.75 text-sm text-(--color-text) focus:outline-none placeholder:text-(--color-text-muted)"
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
      <div className="rounded-(--radius-card) bg-(--color-accent-soft) border border-accent/20 px-4 py-3">
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
