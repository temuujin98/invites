import { getAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeliveryStatusBadge } from "@/components/invite/DeliveryStatusBadge";
import type { DeliveryStatus } from "@/types/invite";
import { formatDateTime } from "@/lib/format";

// ── Types ─────────────────────────────────────────────────────────────────────

interface LogRow {
  id: string;
  status: string;
  provider: string;
  provider_message_id: string | null;
  error_message: string | null;
  sent_at: string;
  guests: { name: string; email: string | null } | { name: string; email: string | null }[] | null;
  invites: { title: string } | { title: string }[] | null;
}

function normalizeGuest(v: LogRow["guests"]): { name: string; email: string | null } | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

function normalizeInvite(v: LogRow["invites"]): { title: string } | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDeliveryLogsPage() {
  let rows: LogRow[] = [];
  let fetchError = false;

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("delivery_logs")
      .select("id, status, provider, provider_message_id, error_message, sent_at, guests(name,email), invites(title)")
      .order("sent_at", { ascending: false })
      .limit(100);
    if (error) fetchError = true;
    else rows = (data ?? []) as LogRow[];
  } catch {
    fetchError = true;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <PageHeader
          title="Имэйл илгээлтийн түүх"
          subtitle="Сүүлийн 100 илгээлт"
        />

        {fetchError ? (
          <div className="mt-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-8 text-center">
            <p className="text-sm text-(--color-danger)">Өгөгдөл уншихад алдаа гарлаа</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Илгээлт хараахан алга"
              description="Зочдод имэйл илгээсний дараа энд харагдана"
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--color-border)">
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">Урилга</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">Зочин</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">Төлөв</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted) hidden md:table-cell">Message ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted) hidden lg:table-cell">Алдаа</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--color-text-muted)">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const guest = normalizeGuest(row.guests);
                  const invite = normalizeInvite(row.invites);
                  const isLast = i === rows.length - 1;
                  // delivery_logs.status is "sending"|"sent"|"failed"; map to DeliveryStatus
                  const badgeStatus = (row.status === "sent" || row.status === "failed" || row.status === "sending")
                    ? (row.status as DeliveryStatus)
                    : "not_sent" as DeliveryStatus;

                  return (
                    <tr
                      key={row.id}
                      className={[
                        "border-b border-(--color-border) transition-colors hover:bg-(--color-surface-soft)",
                        isLast ? "border-b-0" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 text-(--color-text) max-w-[140px]">
                        <span className="block truncate text-xs font-medium">
                          {invite?.title ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-(--color-text) whitespace-nowrap">{guest?.name ?? "—"}</p>
                        {guest?.email && (
                          <p className="text-xs text-(--color-text-muted) truncate max-w-[160px]">{guest.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <DeliveryStatusBadge status={badgeStatus} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {row.provider_message_id ? (
                          <span className="font-mono text-[11px] text-(--color-text-secondary) truncate block max-w-[140px]">
                            {row.provider_message_id.length > 20
                              ? `${row.provider_message_id.slice(0, 20)}…`
                              : row.provider_message_id}
                          </span>
                        ) : (
                          <span className="text-xs text-(--color-text-muted)">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {row.error_message ? (
                          <span className="block max-w-[200px] truncate text-xs text-(--color-danger)" title={row.error_message}>
                            {row.error_message}
                          </span>
                        ) : (
                          <span className="text-xs text-(--color-text-muted)">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-(--color-text-secondary) whitespace-nowrap">
                        {row.sent_at ? formatDateTime(row.sent_at) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
