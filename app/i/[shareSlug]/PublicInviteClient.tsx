"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import type { InviteTemplate } from "@/types/template";

// ── Invalid / Archived states ─────────────────────────────────────────────

function InvalidLinkState({ archived }: { archived?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-(--color-bg) px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface-soft)">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="text-(--color-text-muted)">
          <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 9l10 10M19 9L9 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-(--color-text)">
          {archived ? "Урилга хүчингүй болсон" : "Урилга олдсонгүй эсвэл хүчингүй болсон"}
        </p>
        <p className="mt-1.5 text-sm text-(--color-text-secondary) leading-relaxed max-w-xs">
          {archived
            ? "Энэ урилга архивлагдсан тул нийтийн холбоос хаагдсан байна."
            : "Таны хайж буй урилга байхгүй эсвэл холбоос буруу байна."}
        </p>
      </div>
      <a
        href="/"
        className="inline-flex h-9 items-center rounded-(--radius-ctrl) bg-(--color-accent) px-5 text-sm font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
      >
        Нүүр хуудас руу буцах
      </a>
      <p className="text-xs text-(--color-text-muted)">
        Та өөрийн урилга үүсгэхийг хүсвэл{" "}
        <a href="/" className="text-(--color-accent) hover:underline">invites.mn</a>
        -д бүртгэл үүсгэнэ үү.
      </p>
    </div>
  );
}

// ── RSVP Sheet ────────────────────────────────────────────────────────────

type RSVPChoice = "attending" | "declined" | "maybe";

const CHOICES: { value: RSVPChoice; label: string }[] = [
  { value: "attending", label: "Ирнэ" },
  { value: "declined", label: "Ирэхгүй" },
  { value: "maybe", label: "Магадгүй" },
];

function RSVPBottomSheet({ open, onClose, inviteTitle }: { open: boolean; onClose: () => void; inviteTitle?: string }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [choice, setChoice] = useState<RSVPChoice>("attending");
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setNameError(true); return; }
    setNameError(false);
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    setName("");
    setNameError(false);
    setChoice("attending");
    setPartySize(1);
    setNote("");
    onClose();
  }

  return (
    <Drawer open={open} onClose={handleClose} title="Ирэх эсэхээ мэдэгдэх">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center justify-center gap-4 py-8 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-success-soft)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12l4.5 4.5L19 7" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-(--color-text)">
              {choice === "attending"
                ? "Баярлалаа! Тантай уулзахыг тэсэн ядан хүлээнэ."
                : choice === "maybe"
                  ? "Ойлголоо. Цаг боломж гарвал тавтай морилно уу."
                  : "Ойлголоо. Дараагийн удаа уулзана."}
            </p>
            {inviteTitle && (
              <p className="mt-1 text-sm text-(--color-text-secondary)">{inviteTitle}</p>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={handleClose}>Хаах</Button>
        </motion.div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--color-text)">
              Таны нэр <span className="text-(--color-danger)">*</span>
            </label>
            <input
              type="text"
              placeholder="Нэрээ оруулна уу"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(false); }}
              autoComplete="name"
              className={[
                "h-10 w-full rounded-(--radius-ctrl) border bg-(--color-surface) px-3 text-[15px] text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors",
                nameError ? "border-(--color-danger)" : "border-(--color-border) focus:border-(--color-accent)",
              ].join(" ")}
            />
            {nameError && (
              <p className="text-xs text-(--color-danger)">Нэрээ оруулна уу</p>
            )}
          </div>

          {/* RSVP choice */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-(--color-text) mb-1.5">Ирэх эсэх</legend>
            <div className="flex gap-2">
              {CHOICES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={choice === c.value}
                  onClick={() => setChoice(c.value)}
                  className={[
                    "flex-1 rounded-(--radius-ctrl) border py-2.5 text-[15px] font-medium transition-colors duration-150 cursor-pointer",
                    choice === c.value
                      ? "bg-(--color-accent) text-white border-(--color-accent)"
                      : "bg-(--color-surface) text-(--color-text) border-(--color-border) hover:bg-(--color-surface-soft)",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Party size — only when attending */}
          <AnimatePresence>
            {choice === "attending" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-(--color-text)">Хэдэн хүн ирэх?</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      aria-label="Хасах"
                      onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                      className="h-10 w-10 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text) flex items-center justify-center hover:bg-(--color-surface-soft) transition-colors cursor-pointer"
                    >
                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none" aria-hidden="true">
                        <path d="M1 1h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-[17px] font-semibold text-(--color-text)">{partySize}</span>
                    <button
                      type="button"
                      aria-label="Нэмэх"
                      onClick={() => setPartySize((p) => p + 1)}
                      className="h-10 w-10 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text) flex items-center justify-center hover:bg-(--color-surface-soft) transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Note */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--color-text-secondary)">
              Тайлбар <span className="text-(--color-text-muted) font-normal">(заавал биш)</span>
            </label>
            <textarea
              placeholder="Нэмэлт тайлбар..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 py-2 text-[15px] text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent) focus:ring-2 focus:ring-[var(--focus-ring)] resize-none transition-colors"
            />
          </div>

          <Button type="submit" variant="accent" size="lg" className="w-full text-[15px]">
            RSVP илгээх
          </Button>
        </form>
      )}
    </Drawer>
  );
}

// ── Share Sheet ────────────────────────────────────────────────────────────

function ShareSheet({ open, onClose, url, title }: { open: boolean; onClose: () => void; url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(url).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const channels = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <Drawer open={open} onClose={onClose} title="Урилга хуваалцах">
      <div className="flex flex-col gap-5">
        {/* URL copy */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-(--color-text)">Холбоос хуулах</p>
          <div className="flex items-center gap-2 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface-soft) px-3 py-2.5">
            <span className="flex-1 truncate text-sm text-(--color-text-secondary)">{url}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-(--radius-ctrl) bg-(--color-accent) px-3 py-1 text-[13px] font-medium text-white hover:bg-(--color-accent-hover) transition-colors"
            >
              {copied ? "Хуулагдлаа ✓" : "Хуулах"}
            </button>
          </div>
        </div>

        {/* Channels */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-(--color-text)">Хуваалцах</p>
          <div className="flex gap-3">
            {channels.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ch.label}
                className="flex h-11 w-11 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
              >
                {ch.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

// ── Calendar button (inline, used inside card) ─────────────────────────────

// Calendar download link — hits the server ICS route
function CalendarLink({ shareSlug, className }: { shareSlug: string; className: string }) {
  return (
    <a
      href={`/api/ics/${shareSlug}`}
      download
      className={className}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <rect x="2" y="3" width="12" height="11" rx="2"/><line x1="2" y1="6.5" x2="14" y2="6.5"/><line x1="5.5" y1="1.5" x2="5.5" y2="4.5"/><line x1="10.5" y1="1.5" x2="10.5" y2="4.5"/>
      </svg>
      Календарт нэмэх
    </a>
  );
}

// ── Public Invite Page ─────────────────────────────────────────────────────

import type { InviteValues } from "@/types/template";

interface InviteData {
  id: string;
  title: string;
  shareSlug: string;
  status: string;
  isPublic: boolean;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventLocationUrl?: string;
  values: InviteValues;
}

export function PublicInviteClient({ shareSlug }: { shareSlug: string }) {
  const [invite, setInvite] = useState<InviteData | null | "loading">("loading");
  const [template, setTemplate] = useState<InviteTemplate | null>(null);

  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: inv } = await supabase
        .from("invites")
        .select(`
          id, title, share_slug, status, is_public,
          event_date, event_location, event_location_url, values,
          templates ( id, slug, name, canvas_width, canvas_height, thumbnail_url, background_url, field_config )
        `)
        .eq("share_slug", shareSlug)
        .single();

      if (!inv) { setInvite(null); return; }

      const invData: InviteData = {
        id: inv.id,
        title: inv.title,
        shareSlug: inv.share_slug,
        status: inv.status,
        isPublic: inv.is_public,
        eventDate: inv.event_date ?? undefined,
        eventLocation: inv.event_location ?? undefined,
        eventLocationUrl: inv.event_location_url ?? undefined,
        values: (inv.values as InviteValues) ?? {},
      };
      setInvite(invData);

      const tplRaw = inv.templates;
      const tpl = Array.isArray(tplRaw) ? (tplRaw[0] as Record<string, unknown> ?? null) : (tplRaw as Record<string, unknown> | null);
      if (tpl) {
        setTemplate({
          id: tpl.id as string,
          slug: tpl.slug as string,
          name: tpl.name as string,
          categoryId: (tpl.category_id as string) ?? "",
          type: (tpl.type as "image" | "video") ?? "image",
          status: (tpl.status as "draft" | "published") ?? "published",
          canvasWidth: (tpl.canvas_width as number) ?? 1080,
          canvasHeight: (tpl.canvas_height as number) ?? 1920,
          thumbnailUrl: (tpl.thumbnail_url as string) ?? "",
          backgroundUrl: (tpl.background_url as string) ?? "",
          fields: (tpl.field_config as InviteTemplate["fields"]) ?? [],
        });
      }
    })();
  }, [shareSlug]);

  // Loading
  if (invite === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
        <span className="text-sm text-(--color-text-muted)">Ачааллаж байна…</span>
      </div>
    );
  }

  // Not found
  if (!invite || !template) {
    return <InvalidLinkState />;
  }

  // Archived
  if (invite.status === "archived") {
    return <InvalidLinkState archived />;
  }

  // Not public
  if (!invite.isPublic) {
    return <InvalidLinkState />;
  }

  const shareUrl = `${APP_URL}/i/${invite.shareSlug}`;

  const eventDateFormatted = invite.eventDate
    ? (() => {
        const d = new Date(invite.eventDate);
        return `${d.getFullYear()} оны ${d.getMonth() + 1}-р сарын ${d.getDate()}`;
      })()
    : null;

  const detailRows: { icon: React.ReactNode; label: string; value: string; sub?: string }[] = [];
  if (eventDateFormatted) {
    detailRows.push({
      label: "Огноо",
      value: eventDateFormatted,
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="2"/><line x1="2" y1="6.5" x2="14" y2="6.5"/><line x1="5.5" y1="1.5" x2="5.5" y2="4.5"/><line x1="10.5" y1="1.5" x2="10.5" y2="4.5"/>
        </svg>
      ),
    });
  }
  if (invite.eventTime) {
    detailRows.push({
      label: "Цаг",
      value: invite.eventTime,
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2 1.5"/>
        </svg>
      ),
    });
  }
  if (invite.eventLocation) {
    detailRows.push({
      label: "Байршил",
      value: invite.eventLocation,
      sub: invite.eventLocationUrl ? undefined : undefined,
      icon: (
        <svg width="13" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M8 14.5s5-4.2 5-7.8A5 5 0 003 6.7c0 3.6 5 7.8 5 7.8z"/><circle cx="8" cy="6.8" r="1.8"/>
        </svg>
      ),
    });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F1EEE9", fontFamily: "var(--font-family)" }}>
      <div className="flex min-h-screen flex-col items-center justify-start px-3.5 py-5 md:justify-center md:py-12 md:px-0">
        {/* ── Invite card ── */}
        <div className="w-full max-w-md overflow-hidden rounded-(--radius-card-lg) border border-(--color-border) bg-white shadow-lg">

          {/* ── Template artwork via InviteRenderer (D2: must use actual template) ── */}
          <InviteRenderer template={template} values={invite.values} mode="public" />

          {/* Card body — detail rows + actions below the rendered invite */}
          <div className="px-6 pb-6 pt-5 text-center">
            {/* Eyebrow */}
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-(--color-accent)">
              ТАНЫГ УРЬЖ БАЙНА
            </p>

            {/* Title */}
            <h1 className="mb-1.5 text-[26px] font-bold leading-[1.2] tracking-tight text-(--color-text)">
              {invite.title}
            </h1>

            {/* Host */}
            <p className="mb-6 text-[14px] text-(--color-text-secondary)">
              {(invite.values.host_name?.text) ?? ""}
            </p>

            {/* Detail rows */}
            {detailRows.length > 0 && (
              <div className="mb-4 flex flex-col gap-3.5 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-4 text-left">
                {detailRows.map((row, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-(--color-accent-soft) text-(--color-accent)">
                      {row.icon}
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-(--color-text-muted)">
                        {row.label}
                      </p>
                      <p className="text-[14px] font-medium text-(--color-text)">{row.value}</p>
                      {row.sub && <p className="mt-0.5 text-[12px] text-(--color-text-muted)">{row.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message */}
            <p className="mb-5 px-2 text-[14px] leading-relaxed text-(--color-text-secondary)">
              Та бүхнийг хүндэт зочноор урьж байна. Хүрэлцэн ирж, баярын баяр хөөрийг бидэнтэй хуваалцана уу.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {/* RSVP — primary (bg-primary dark) */}
              <button
                type="button"
                onClick={() => setRsvpOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-0 py-3 text-[14px] font-medium text-white transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 4.5h12v8H2z"/><path d="M2 5l6 4 6-4"/>
                </svg>
                Ирэхээ мэдэгдэх
              </button>

              {/* Map + Calendar */}
              <div className="grid grid-cols-2 gap-2">
                {invite.eventLocation && (
                  <a
                    href={invite.eventLocationUrl ?? `https://maps.google.com/?q=${encodeURIComponent(invite.eventLocation)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) py-3 text-[14px] font-medium text-(--color-text) transition-colors hover:bg-(--color-surface-soft)"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 14.5s5-4.2 5-7.8A5 5 0 003 6.7c0 3.6 5 7.8 5 7.8z"/><circle cx="8" cy="6.8" r="1.8"/>
                    </svg>
                    Газрын зураг
                  </a>
                )}
                {eventDateFormatted && (
                  <CalendarLink
                    shareSlug={invite.shareSlug}
                    className="flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) py-3 text-[14px] font-medium text-(--color-text) transition-colors hover:bg-(--color-surface-soft)"
                  />
                )}
              </div>

              {/* Share */}
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) py-3 text-[14px] font-medium text-(--color-text) transition-colors hover:bg-(--color-surface-soft)"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="3.5" r="1.8"/><circle cx="4" cy="8" r="1.8"/><circle cx="12" cy="12.5" r="1.8"/>
                  <line x1="5.6" y1="7.1" x2="10.4" y2="4.4"/><line x1="5.6" y1="8.9" x2="10.4" y2="11.6"/>
                </svg>
                Хуваалцах
              </button>
            </div>

            {/* invites.mn branding */}
            <div className="mt-3 flex items-center justify-center gap-1.5 pt-2 text-[10px] text-(--color-text-muted)">
              <div className="flex h-3 w-3 items-center justify-center rounded-[3px] bg-(--color-accent)">
                <span className="text-[7px] font-bold text-white">i</span>
              </div>
              invites.mn дээр үүсгэв
            </div>
          </div>
        </div>
      </div>

      {/* ── RSVP sheet ── */}
      <RSVPBottomSheet
        open={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        inviteTitle={invite.title}
      />

      {/* ── Share sheet ── */}
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={shareUrl}
        title={invite.title}
      />
    </div>
  );
}
