"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extracted from PublicInviteClient's RSVPBottomSheet so the RSVP flow is a
// reusable in-page section body. Posts to /api/rsvp with the invite id.

type RSVPChoice = "accepted" | "declined" | "maybe";

const CHOICES: { value: RSVPChoice; label: string }[] = [
  { value: "accepted", label: "Ирнэ" },
  { value: "declined", label: "Ирэхгүй" },
  { value: "maybe", label: "Магадгүй" },
];

interface RsvpFormProps {
  inviteId?: string;          // present only in public mode
  allowGuestCount: boolean;
  allowNote: boolean;
  disabled?: boolean;         // editor/create preview → inert
}

export function RsvpForm({ inviteId, allowGuestCount, allowNote, disabled }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [choice, setChoice] = useState<RSVPChoice>("accepted");
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const inert = disabled || !inviteId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inert) return;
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setApiError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteId,
          name: name.trim(),
          attending: choice,
          guestCount: choice === "accepted" && allowGuestCount ? partySize : 1,
          note: allowNote && note.trim() ? note.trim() : undefined,
        }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) {
        setApiError(json.message ?? "Алдаа гарлаа. Дахин оролдоно уу.");
        return;
      }
      setSubmitted(true);
    } catch {
      setApiError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="flex flex-col items-center justify-center gap-3 py-6 text-center"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--inv-accent) 15%, transparent)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12l4.5 4.5L19 7" stroke="var(--inv-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[15px] font-semibold" style={{ color: "var(--inv-text)" }}>
          {choice === "accepted"
            ? "Баярлалаа! Тантай уулзахыг тэсэн ядан хүлээнэ."
            : choice === "maybe"
              ? "Ойлголоо. Цаг боломж гарвал тавтай морилно уу."
              : "Ойлголоо. Дараагийн удаа уулзана."}
        </p>
      </motion.div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-medium" style={{ color: "var(--inv-text)" }}>
          Таны нэр <span style={{ color: "#C4443A" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Нэрээ оруулна уу"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(false);
          }}
          autoComplete="name"
          className="h-11 w-full rounded-[10px] border px-3 text-[15px] focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--inv-surface)",
            color: "var(--inv-text)",
            borderColor: nameError ? "#C4443A" : "color-mix(in srgb, var(--inv-muted) 40%, transparent)",
          }}
        />
        {nameError && <p className="text-xs" style={{ color: "#C4443A" }}>Нэрээ оруулна уу</p>}
      </div>

      {/* Choice */}
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-[13px] font-medium" style={{ color: "var(--inv-text)" }}>
          Ирэх эсэх
        </legend>
        <div className="flex gap-2">
          {CHOICES.map((c) => {
            const active = choice === c.value;
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => setChoice(c.value)}
                className="flex-1 rounded-[10px] border py-2.5 text-[14px] font-medium transition-colors"
                style={{
                  backgroundColor: active ? "var(--inv-accent)" : "var(--inv-surface)",
                  color: active ? "#fff" : "var(--inv-text)",
                  borderColor: active ? "var(--inv-accent)" : "color-mix(in srgb, var(--inv-muted) 40%, transparent)",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Party size */}
      {allowGuestCount && (
        <AnimatePresence>
          {choice === "accepted" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium" style={{ color: "var(--inv-text)" }}>
                  Хэдэн хүн ирэх?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Хасах"
                    onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border"
                    style={{ backgroundColor: "var(--inv-surface)", color: "var(--inv-text)", borderColor: "color-mix(in srgb, var(--inv-muted) 40%, transparent)" }}
                  >
                    –
                  </button>
                  <span className="w-8 text-center text-[17px] font-semibold" style={{ color: "var(--inv-text)" }}>
                    {partySize}
                  </span>
                  <button
                    type="button"
                    aria-label="Нэмэх"
                    onClick={() => setPartySize((p) => p + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border"
                    style={{ backgroundColor: "var(--inv-surface)", color: "var(--inv-text)", borderColor: "color-mix(in srgb, var(--inv-muted) 40%, transparent)" }}
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Note */}
      {allowNote && (
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-medium" style={{ color: "var(--inv-muted)" }}>
            Тайлбар <span className="font-normal">(заавал биш)</span>
          </label>
          <textarea
            placeholder="Нэмэлт тайлбар..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-[10px] border px-3 py-2 text-[15px] focus:outline-none focus:ring-2"
            style={{ backgroundColor: "var(--inv-surface)", color: "var(--inv-text)", borderColor: "color-mix(in srgb, var(--inv-muted) 40%, transparent)" }}
          />
        </div>
      )}

      {apiError && <p className="text-[13px]" style={{ color: "#C4443A" }}>{apiError}</p>}

      <button
        type="submit"
        disabled={loading || inert}
        className="mt-1 w-full rounded-[10px] py-3 text-[15px] font-medium text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: "var(--inv-accent)" }}
      >
        {loading ? "Илгээж байна…" : "RSVP илгээх"}
      </button>
    </form>
  );
}
