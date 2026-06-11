"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { APP_URL } from "@/lib/constants";
import { mockInvites, mockTemplates } from "@/lib/mock-data";
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

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

// ── Action bar ─────────────────────────────────────────────────────────────

interface ActionBarProps {
  locationUrl?: string;
  eventDate?: string;
  eventTime?: string;
  eventTitle: string;
  shareUrl: string;
  onRSVP: () => void;
  onShare: () => void;
}

function ActionBar({ locationUrl, eventDate, eventTime, eventTitle, shareUrl, onRSVP, onShare }: ActionBarProps) {
  function handleCalendar() {
    if (!eventDate) return;
    const [year, month, day] = eventDate.split("T")[0].split("-").map(Number);
    const [hour = 0, minute = 0] = (eventTime ?? "00:00").split(":").map(Number);
    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    function toICSDate(d: Date) {
      return d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    }

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `URL:${shareUrl}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invite.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-(--color-border) bg-(--color-surface)/95 backdrop-blur-sm px-4 py-3">
      <div className="mx-auto flex max-w-sm items-center gap-2">
        {/* RSVP — primary */}
        <Button variant="accent" size="lg" className="flex-1 text-[15px]" onClick={onRSVP}>
          RSVP илгээх
        </Button>

        {/* Map */}
        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Газрын зураг"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 1C6.24 1 4 3.24 4 6c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="9" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
        )}

        {/* Calendar */}
        {eventDate && (
          <button
            type="button"
            aria-label="Календарт нэмэх"
            onClick={handleCalendar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M5.5 11h2v2h-2z" fill="currentColor" />
            </svg>
          </button>
        )}

        {/* Share */}
        <button
          type="button"
          aria-label="Хуваалцах"
          onClick={onShare}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="14" cy="4" r="2" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="4" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6 8l6-3M6 10l6 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Public Invite Page ─────────────────────────────────────────────────────

export default function PublicInvitePage() {
  const params = useParams();
  const shareSlug = typeof params.shareSlug === "string" ? params.shareSlug : "";

  const invite = useMemo(
    () => mockInvites.find((i) => i.shareSlug === shareSlug) ?? null,
    [shareSlug],
  );

  const template = useMemo(
    () => (invite ? mockTemplates.find((t) => t.id === invite.templateId) ?? null : null),
    [invite],
  );

  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      {/* ── Invite renderer — full width, zero chrome ── */}
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-sm mx-auto px-0">
          <InviteRenderer template={template} values={invite.values} mode="public" />
        </div>

        {/* ── Event meta below the card ── */}
        <div className="mx-auto w-full max-w-sm px-4 py-5 flex flex-col gap-3">
          {invite.eventLocation && (
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-(--color-text-muted) shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1C5.79 1 4 2.79 4 5c0 3.25 4 10 4 10s4-6.75 4-10c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  <circle cx="8" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
              <span className="text-[15px] leading-relaxed text-(--color-text-secondary)">
                {invite.eventLocation}
              </span>
            </div>
          )}
          {invite.eventDate && (
            <div className="flex items-center gap-2.5">
              <span className="text-(--color-text-muted) shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2" y="2.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M2 6.5h12M5.5 1v3M10.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[15px] text-(--color-text-secondary)">
                {new Date(invite.eventDate).getFullYear()}.{String(new Date(invite.eventDate).getMonth() + 1).padStart(2, "0")}.{String(new Date(invite.eventDate).getDate()).padStart(2, "0")}
                {invite.eventTime && ` · ${invite.eventTime}`}
              </span>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-(--color-border) py-4 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-(--color-text-muted) hover:text-(--color-text) transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 5l6 3.5L13 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          invites.mn дээр үүсгэв
        </a>
      </footer>

      {/* ── Sticky action bar ── */}
      <ActionBar
        locationUrl={invite.eventLocationUrl}
        eventDate={invite.eventDate}
        eventTime={invite.eventTime}
        eventTitle={invite.title}
        shareUrl={shareUrl}
        onRSVP={() => setRsvpOpen(true)}
        onShare={() => setShareOpen(true)}
      />

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
