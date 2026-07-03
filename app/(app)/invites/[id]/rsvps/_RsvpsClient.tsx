"use client";

import Link from "next/link";
import type { RsvpAttending } from "@/types/guest";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { RSVPBadge } from "@/components/invite/RSVPBadge";
import { formatDateTime } from "@/lib/format";

export interface RsvpResponse {
  id: string;
  name: string;
  attending: RsvpAttending;
  guestCount: number;
  note?: string;
  isGuest: boolean;
  createdAt: string;
}

interface Props {
  inviteId: string;
  inviteTitle: string;
  responses: RsvpResponse[];
}

export function RsvpsClient({ inviteId, inviteTitle, responses }: Props) {
  const accepted = responses.filter((r) => r.attending === "accepted");
  const declined = responses.filter((r) => r.attending === "declined").length;
  const maybe = responses.filter((r) => r.attending === "maybe").length;
  // Total headcount from accepted responses (each may bring guestCount people).
  const headcount = accepted.reduce((s, r) => s + r.guestCount, 0);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="mb-4 flex items-center gap-3 text-xs text-(--color-text-muted)">
          <Link href="/dashboard" className="hover:text-(--color-text) transition-colors">
            ← Хяналтын самбар
          </Link>
          <span aria-hidden>·</span>
          <Link href={`/invites/${inviteId}/guests`} className="hover:text-(--color-text) transition-colors">
            Зочид
          </Link>
        </div>

        <PageHeader title="RSVP хариултууд" subtitle={inviteTitle} />

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatsCard label="Нийт хариулт" value={responses.length} />
          <StatsCard label="Ирнэ" value={accepted.length} />
          <StatsCard label="Ирэхгүй" value={declined} />
          <StatsCard label="Магадгүй" value={maybe} />
        </div>
        {headcount > 0 && (
          <p className="mt-3 text-sm text-(--color-text-secondary)">
            Ирэхээр хариулсан нийт хүний тоо: <span className="font-semibold text-(--color-text)">{headcount}</span>
          </p>
        )}

        {/* Responses table */}
        <div className="mt-6">
          <DataTable
            data={responses}
            keyExtractor={(r) => r.id}
            emptyMessage="Хариулт хараахан алга"
            columns={[
              {
                key: "name",
                label: "Нэр",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-(--color-text)">{r.name}</span>
                    {r.isGuest && (
                      <span className="rounded-full bg-(--color-accent-soft) px-1.5 py-0.5 text-[10px] text-(--color-accent)">
                        Зочин
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "attending",
                label: "Хариу",
                render: (r) => <RSVPBadge status={r.attending} />,
              },
              {
                key: "guestCount",
                label: "Хүн",
                render: (r) => (r.attending === "accepted" ? String(r.guestCount) : "—"),
              },
              {
                key: "note",
                label: "Тэмдэглэл",
                render: (r) => (
                  <span className="text-(--color-text-secondary)">{r.note || "—"}</span>
                ),
              },
              {
                key: "createdAt",
                label: "Огноо",
                render: (r) => (
                  <span className="text-(--color-text-muted)">{formatDateTime(r.createdAt)}</span>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
