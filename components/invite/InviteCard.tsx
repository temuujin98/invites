"use client";

import type { Invite } from "@/types/invite";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/format";

interface InviteCardProps {
  invite: Invite;
  actions?: React.ReactNode;
}

export function InviteCard({ invite, actions }: InviteCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-sm)">
      {/* Thumbnail */}
      <div
        className="shrink-0 overflow-hidden rounded-(--radius-card) bg-(--color-surface-soft)"
        style={{ width: 52, height: 92 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/mock-templates/${invite.templateSlug}.svg`}
          alt={invite.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold text-(--color-text) truncate break-keep-all">
          {invite.title}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={invite.status} />
          {invite.eventDate && (
            <span className="text-xs text-(--color-text-muted)">
              {formatDate(invite.eventDate)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-0.5">
          <span
            className="flex items-center gap-1 text-xs text-(--color-text-secondary)"
            title="RSVP тоо"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="4.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 10a4 4 0 0 1 7 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M8 8.5a3 3 0 0 1 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {invite.rsvpCount} RSVP
          </span>
          <span
            className="flex items-center gap-1 text-xs text-(--color-text-muted)"
            title="Харсан тоо"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <ellipse cx="6" cy="6" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="6" cy="6" r="1.5" fill="currentColor" />
            </svg>
            {invite.viewCount}
          </span>
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="shrink-0 flex items-center gap-1">{actions}</div>
      )}
    </article>
  );
}
