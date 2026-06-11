"use client";

import { useState } from "react";
import { Drawer, Input, Textarea, Button } from "@/components/ui";

interface RSVPSheetProps {
  open: boolean;
  onClose: () => void;
  inviteTitle?: string;
  guestName?: string;
}

type RSVPChoice = "attending" | "declined" | "maybe";

const CHOICES: { value: RSVPChoice; label: string }[] = [
  { value: "attending", label: "Ирнэ" },
  { value: "declined", label: "Ирэхгүй" },
  { value: "maybe", label: "Магадгүй" },
];

export function RSVPSheet({ open, onClose, inviteTitle, guestName }: RSVPSheetProps) {
  const [name, setName] = useState(guestName ?? "");
  const [choice, setChoice] = useState<RSVPChoice>("attending");
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Phase 1: local state only
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    onClose();
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="RSVP - Ирэх эсэхээ мэдэгдэх"
    >
      {submitted ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <span className="text-4xl" aria-hidden="true">
            {choice === "attending" ? "🎉" : choice === "maybe" ? "🤔" : "😔"}
          </span>
          <p className="text-base font-semibold text-(--color-text)">
            {choice === "attending"
              ? "Баярлалаа! Тантай уулзахыг тэсэн ядан хүлээнэ."
              : choice === "maybe"
                ? "Ойлголоо. Цаг боломж гарвал тавтай морилно уу."
                : "Ойлголоо. Дараагийн удаа уулзана."}
          </p>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Хаах
          </Button>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {inviteTitle && (
            <p className="text-sm text-(--color-text-secondary) leading-snug break-keep-all">
              {inviteTitle}
            </p>
          )}

          <Input
            label="Таны нэр"
            placeholder="Нэрээ оруулна уу"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-xs font-medium text-(--color-text-secondary) mb-1">
              Ирэх эсэх
            </legend>
            <div className="flex gap-2">
              {CHOICES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={choice === c.value}
                  onClick={() => setChoice(c.value)}
                  className={[
                    "flex-1 rounded-(--radius-ctrl) border py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
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

          {choice === "attending" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-(--color-text-secondary)">
                Хэдэн хүн ирэх?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Хасах"
                  onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                  className="h-[34px] w-[34px] rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text) flex items-center justify-center hover:bg-(--color-surface-soft) transition-colors cursor-pointer"
                >
                  <svg width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden="true">
                    <path d="M1 1h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <span className="text-sm font-semibold text-(--color-text) min-w-[2ch] text-center">
                  {partySize}
                </span>
                <button
                  type="button"
                  aria-label="Нэмэх"
                  onClick={() => setPartySize((p) => p + 1)}
                  className="h-[34px] w-[34px] rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) text-(--color-text) flex items-center justify-center hover:bg-(--color-surface-soft) transition-colors cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Textarea
            label="Тайлбар (заавал биш)"
            placeholder="Нэмэлт тайлбар..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            disabled={!name.trim()}
          >
            RSVP илгээх
          </Button>
        </form>
      )}
    </Drawer>
  );
}
