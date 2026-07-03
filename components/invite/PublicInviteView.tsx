"use client";

import { SectionRenderer } from "@/components/invite/SectionRenderer";
import { InvitationShell } from "@/components/invite/InvitationShell";
import type {
  SectionTemplate,
  InviteSectionContent,
  SectionConfig,
  InviteTheme,
} from "@/types/section";
import { DEFAULT_THEME } from "@/types/section";
import { formatDate } from "@/lib/format";

// ── Invite row shape shared by /i (client fetch) and /g (server-resolved) ────
export interface PublicInviteRow {
  id: string;
  title: string;
  share_slug: string;
  status: string;
  is_public: boolean;
  content: Record<string, unknown> | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
  templates: {
    id: string;
    slug: string;
    name: string;
    category_id: string;
    status: string;
    sections: unknown;
    theme: unknown;
  } | null;
}

export interface GuestContext {
  id: string;
  name: string;
  token: string;
}

interface PublicInviteViewProps {
  invite: PublicInviteRow | null | "loading";
  guest?: GuestContext;
}

// ── Invalid / Archived states ─────────────────────────────────────────────
export function InvalidLinkState({ archived }: { archived?: boolean }) {
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

// ── Legacy fallback — templates without sections yet ──────────────────────
function LegacyFallback({
  title,
  eventDate,
  eventTime,
  eventLocation,
}: {
  title: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventLocation?: string | null;
}) {
  const dateFormatted = eventDate ? formatDate(eventDate) : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12" style={{ backgroundColor: DEFAULT_THEME.palette.bg }}>
      <div className="w-full max-w-sm rounded-2xl border border-(--color-border) bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.32em] text-(--color-accent)">
          ТАНЫГ УРЬЖ БАЙНА
        </p>
        <h1 className="mb-6 text-[24px] font-bold leading-tight text-(--color-text)" style={{ wordBreak: "keep-all" }}>
          {title}
        </h1>
        {(dateFormatted || eventTime || eventLocation) && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-left text-[14px]">
            {dateFormatted && (
              <p className="text-(--color-text)"><span className="text-(--color-text-muted)">Огноо: </span>{dateFormatted}</p>
            )}
            {eventTime && (
              <p className="text-(--color-text)"><span className="text-(--color-text-muted)">Цаг: </span>{eventTime}</p>
            )}
            {eventLocation && (
              <p className="text-(--color-text)"><span className="text-(--color-text-muted)">Байршил: </span>{eventLocation}</p>
            )}
          </div>
        )}
        <p className="text-[13px] text-(--color-text-muted) leading-relaxed">
          Энэ урилга шинэчлэгдэж байна
        </p>
      </div>
    </div>
  );
}

// ── The shared render tree (data-agnostic) ─────────────────────────────────
export function PublicInviteView({ invite, guest }: PublicInviteViewProps) {
  if (invite === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
        <span className="text-sm text-(--color-text-muted)">Ачааллаж байна…</span>
      </div>
    );
  }

  if (!invite) return <InvalidLinkState />;
  if (invite.status === "archived") return <InvalidLinkState archived />;
  if (!invite.is_public) return <InvalidLinkState />;

  const tpl = invite.templates;
  const rawSections = tpl?.sections;
  const sectionsArray = Array.isArray(rawSections) ? rawSections : [];
  if (!tpl || sectionsArray.length === 0) {
    return (
      <LegacyFallback
        title={invite.title}
        eventDate={invite.event_date}
        eventTime={invite.event_time}
        eventLocation={invite.event_location}
      />
    );
  }

  const theme: InviteTheme =
    tpl.theme && typeof tpl.theme === "object" && !Array.isArray(tpl.theme)
      ? (tpl.theme as InviteTheme)
      : DEFAULT_THEME;

  const sections = (sectionsArray as SectionConfig[]).slice().sort((a, b) => a.order - b.order);

  const sectionTemplate: SectionTemplate = {
    id: tpl.id,
    name: tpl.name,
    slug: tpl.slug,
    categoryId: tpl.category_id,
    status: tpl.status as "draft" | "published",
    theme,
    sections,
    thumbnailUrl: "",
  };

  const content = (invite.content ?? {}) as InviteSectionContent;

  return (
    <InvitationShell template={sectionTemplate} content={content} showOpening openingTitle={invite.title}>
      <SectionRenderer
        template={sectionTemplate}
        content={content}
        mode="public"
        inviteId={invite.id}
        shareSlug={invite.share_slug}
        inviteTitle={invite.title}
        guestToken={guest?.token}
        guestName={guest?.name}
      />
    </InvitationShell>
  );
}
