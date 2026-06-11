"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { mockInvites } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import type { Invite, InviteStatus } from "@/types/invite";
import { StatsCard } from "@/components/shared/StatsCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { StatusBadge } from "@/components/invite/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// ── Icons ──────────────────────────────────────────────────────────────────

function IconInvites() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconDraft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2h7l3 3v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPublished() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRSVP() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="9.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 11.5a4.5 4.5 0 0 1 8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9.5 9a3.5 3.5 0 0 1 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M8.5 1.5l2 2L3 11H1v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <ellipse cx="6" cy="6" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8V2h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArchive() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="10" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 4.5V10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 7h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 3h8M5 3V2h2v1M10 3l-.8 7.5A1 1 0 0 1 8.2 11H3.8a1 1 0 0 1-1-.5L2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Filter tabs ────────────────────────────────────────────────────────────

type FilterId = "all" | "draft" | "published" | "archived";

const FILTER_IDS: FilterId[] = ["all", "draft", "published", "archived"];
const FILTER_LABELS: Record<FilterId, string> = {
  all: "Бүгд",
  draft: "Ноорог",
  published: "Нийтэлсэн",
  archived: "Архив",
};

// ── Dashboard page ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<Invite[]>(mockInvites);
  const [filter, setFilter] = useState<FilterId>("all");
  const [deleteTarget, setDeleteTarget] = useState<Invite | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Invite | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ── Stats ──
  const total = invites.length;
  const drafts = invites.filter((i) => i.status === "draft").length;
  const published = invites.filter((i) => i.status === "published").length;
  const totalRSVP = invites.reduce((s, i) => s + i.rsvpCount, 0);

  // ── Filtered list (archived hidden from "all" per D10) ──
  const visible = invites.filter((i) => {
    if (filter === "all") return i.status !== "archived";
    return i.status === filter;
  });

  // ── Tab counts ──
  const tabCounts: Record<FilterId, number> = {
    all: invites.filter((i) => i.status !== "archived").length,
    draft: drafts,
    published,
    archived: invites.filter((i) => i.status === "archived").length,
  };

  // ── Actions ──
  function handleCopyLink(invite: Invite) {
    const url = `https://invites.mn/i/${invite.shareSlug}`;
    navigator.clipboard.writeText(url).catch(() => undefined);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleArchive(invite: Invite) {
    setInvites((prev) =>
      prev.map((i) =>
        i.id === invite.id ? { ...i, status: "archived" as InviteStatus } : i,
      ),
    );
  }

  function handleDelete(invite: Invite) {
    setInvites((prev) => prev.filter((i) => i.id !== invite.id));
  }

  const tabs = FILTER_IDS.map((id) => ({
    id,
    label: FILTER_LABELS[id],
    count: tabCounts[id],
  }));

  return (
    <div className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-(--color-text) md:text-2xl">
            Миний урилгууд
          </h1>
          <Link
            href="/templates"
            className="inline-flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) bg-(--color-accent) px-3 text-xs font-semibold text-white hover:bg-(--color-accent-hover) transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Шинэ урилга
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatsCard label="Нийт урилга" value={total} icon={<IconInvites />} />
          <StatsCard label="Ноорог" value={drafts} icon={<IconDraft />} />
          <StatsCard label="Нийтэлсэн" value={published} icon={<IconPublished />} />
          <StatsCard label="Нийт RSVP" value={totalRSVP} icon={<IconRSVP />} />
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-4">
          <FilterTabs
            tabs={tabs}
            activeId={filter}
            onChange={(id) => setFilter(id as FilterId)}
          />
        </div>

        {/* ── Invite list ── */}
        {visible.length === 0 ? (
          <EmptyState
            title={filter === "all" ? "Урилга байхгүй байна" : `${FILTER_LABELS[filter]} урилга байхгүй`}
            description={filter === "all" ? "Шинэ урилга үүсгэж эхлэцгээе." : undefined}
            action={
              filter === "all" ? (
                <Link
                  href="/templates"
                  className="inline-flex h-8 items-center gap-1.5 rounded-(--radius-ctrl) bg-(--color-accent) px-4 text-xs font-semibold text-white hover:bg-(--color-accent-hover) transition-colors"
                >
                  Урилга үүсгэх
                </Link>
              ) : undefined
            }
          />
        ) : (
          <motion.ul
            className="flex flex-col gap-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.03 } } }}
          >
            {visible.map((invite) => (
              <motion.li
                key={invite.id}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.15 } },
                }}
              >
                <InviteRow
                  invite={invite}
                  copiedId={copiedId}
                  onEdit={() => router.push(`/invites/${invite.id}/edit`)}
                  onPreview={() => window.open(`/i/${invite.shareSlug}`, "_blank")}
                  onCopy={() => handleCopyLink(invite)}
                  onArchive={() => setArchiveTarget(invite)}
                  onDelete={() => setDeleteTarget(invite)}
                />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* ── Archive confirm ── */}
      <ConfirmDialog
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (archiveTarget) handleArchive(archiveTarget);
        }}
        title="Урилга архивлах уу?"
        message={`"${archiveTarget?.title}" урилгыг архивлах уу? Архивласны дараа нийтийн холбоос хүчингүй болно.`}
        confirmLabel="Архивлах"
      />

      {/* ── Delete confirm ── */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
        }}
        title="Урилга устгах уу?"
        message={`"${deleteTarget?.title}" урилгыг бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmLabel="Устгах"
        danger
      />
    </div>
  );
}

// ── InviteRow ──────────────────────────────────────────────────────────────

interface InviteRowProps {
  invite: Invite;
  copiedId: string | null;
  onEdit: () => void;
  onPreview: () => void;
  onCopy: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

function InviteRow({ invite, copiedId, onEdit, onPreview, onCopy, onArchive, onDelete }: InviteRowProps) {
  const isCopied = copiedId === invite.id;

  return (
    <article className="flex items-center gap-3 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-3 shadow-(--shadow-sm) transition-shadow hover:shadow-(--shadow-md)">
      {/* Thumbnail */}
      <div
        className="shrink-0 overflow-hidden rounded-[6px] bg-(--color-surface-soft)"
        style={{ width: 44, height: 78 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/mock-templates/${invite.templateSlug}.svg`}
          alt={invite.title}
          className="h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-semibold text-(--color-text)">{invite.title}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={invite.status} />
          {invite.eventDate && (
            <span className="text-[11px] text-(--color-text-muted)">{formatDate(invite.eventDate)}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-(--color-text-secondary)">
            <IconRSVP />
            {invite.rsvpCount} RSVP
          </span>
          <span className="flex items-center gap-1 text-[11px] text-(--color-text-muted)">
            <IconEye />
            {invite.viewCount}
          </span>
        </div>
      </div>

      {/* Quick actions (desktop) */}
      <div className="hidden shrink-0 items-center gap-1 sm:flex">
        <button
          type="button"
          onClick={onEdit}
          title="Засах"
          className="flex h-7 items-center gap-1 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2 text-[11px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
        >
          <IconEdit />
          Засах
        </button>
        <button
          type="button"
          onClick={onPreview}
          title="Урьдчилан харах"
          className="flex h-7 items-center gap-1 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2 text-[11px] text-(--color-text-secondary) hover:bg-(--color-surface-soft) transition-colors"
        >
          <IconEye />
          Харах
        </button>
        <button
          type="button"
          onClick={onCopy}
          title="Линк хуулах"
          className="flex h-7 items-center gap-1 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-2 text-[11px] transition-colors"
          style={isCopied ? { color: "var(--color-success)" } : { color: "var(--color-text-secondary)" }}
        >
          <IconCopy />
          {isCopied ? "Хуулагдлаа" : "Линк"}
        </button>
      </div>

      {/* Overflow menu */}
      <div className="shrink-0">
        <ActionMenu
          items={[
            { label: "Засах", icon: <IconEdit />, onClick: onEdit },
            { label: "Урьдчилан харах", icon: <IconEye />, onClick: onPreview },
            { label: "Линк хуулах", icon: <IconCopy />, onClick: onCopy },
            { label: "Архивлах", icon: <IconArchive />, onClick: onArchive },
            { label: "Устгах", icon: <IconTrash />, onClick: onDelete, danger: true },
          ]}
        />
      </div>
    </article>
  );
}
