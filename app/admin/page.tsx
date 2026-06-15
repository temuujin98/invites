import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/shared/StatsCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/invite/StatusBadge";
import { formatDate } from "@/lib/format";

// ── Icons ──────────────────────────────────────────────────────────────────

function IconTemplate() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 5h12M5 5v7" stroke="currentColor" strokeWidth="1.3" />
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
function IconDraft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2h6l4 4v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function IconInvites() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ── Quick action card ──────────────────────────────────────────────────────

function QuickActionCard({ href, icon, label, description }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-4 hover:bg-(--color-surface-soft) hover:border-(--color-accent)/30 transition-colors group"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent-soft) text-(--color-accent) group-hover:bg-(--color-accent) group-hover:text-white transition-colors">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-(--color-text)">{label}</p>
        <p className="mt-0.5 text-[11px] text-(--color-text-muted) leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalTemplates },
    { count: publishedCount },
    { count: draftCount },
    { count: totalInvites },
    { data: recentTemplateRows },
    { data: recentInviteRows },
  ] = await Promise.all([
    supabase.from("templates").select("*", { count: "exact", head: true }),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("invites").select("*", { count: "exact", head: true }),
    supabase
      .from("templates")
      .select(`id, name, slug, status,
        thumb_asset: assets!thumb_asset_id ( bucket, path )`)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("invites")
      .select("id, title, event_date, status")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const recentTemplates = (recentTemplateRows ?? []).map((row) => {
    const thumb = Array.isArray(row.thumb_asset) ? (row.thumb_asset[0] ?? null) : row.thumb_asset;
    const thumbnailUrl = thumb
      ? `${SUPABASE_URL}/storage/v1/object/public/${(thumb as { bucket: string; path: string }).bucket}/${(thumb as { bucket: string; path: string }).path}`
      : "";
    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      status: row.status as "draft" | "published",
      thumbnailUrl,
    };
  });

  const recentInvites = (recentInviteRows ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    eventDate: (row.event_date as string | null) ?? undefined,
    status: row.status as "draft" | "published" | "archived",
  }));

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
        <PageHeader
          title="Хянах самбар"
          subtitle="invites.mn — Админ панел"
        />

        {/* ── Stats ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatsCard label="Нийт загвар" value={totalTemplates ?? 0} icon={<IconTemplate />} />
          <StatsCard label="Идэвхтэй" value={publishedCount ?? 0} icon={<IconPublished />} />
          <StatsCard label="Идэвхгүй" value={draftCount ?? 0} icon={<IconDraft />} />
          <StatsCard label="Хэрэглэгчийн урилга" value={totalInvites ?? 0} icon={<IconInvites />} />
        </div>

        {/* ── Quick actions ── */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">
            Хурдан үйлдэл
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickActionCard
              href="/admin/templates/new"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              }
              label="Загвар үүсгэх"
              description="Шинэ урилгын загвар нэм"
            />
            <QuickActionCard
              href="/admin/assets"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 9V2M4 5l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              label="Фон оруулах"
              description="Зураг/видео арын дэвсгэр нэм"
            />
            <QuickActionCard
              href="/admin/categories"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 3h10M2 7h7M2 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              }
              label="Ангилал удирдах"
              description="Загварын ангиллыг нэм, засвар"
            />
          </div>
        </div>

        {/* ── Two-column lists ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Recent templates */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">
                Сүүлийн загварууд
              </p>
              <Link href="/admin/templates" className="text-[11px] text-(--color-accent) hover:underline">
                Бүгдийг харах →
              </Link>
            </div>
            <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) divide-y divide-(--color-border)">
              {recentTemplates.length === 0 ? (
                <p className="px-3 py-4 text-xs text-(--color-text-muted)">Загвар байхгүй байна</p>
              ) : recentTemplates.map((tpl) => (
                <div key={tpl.id} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="h-10 w-6 shrink-0 overflow-hidden rounded-[4px] bg-(--color-surface-soft)">
                    {tpl.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-(--color-text)">{tpl.name}</p>
                    <p className="text-[11px] text-(--color-text-muted)">{tpl.slug}</p>
                  </div>
                  <span className={[
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    tpl.status === "published"
                      ? "bg-(--color-success-soft) text-(--color-success)"
                      : "bg-(--color-surface-soft) text-(--color-text-secondary)",
                  ].join(" ")}>
                    {tpl.status === "published" ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent invites */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">
                Сүүлийн урилгууд
              </p>
              <Link href="/admin/invites" className="text-[11px] text-(--color-accent) hover:underline">
                Бүгдийг харах →
              </Link>
            </div>
            <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) divide-y divide-(--color-border)">
              {recentInvites.length === 0 ? (
                <p className="px-3 py-4 text-xs text-(--color-text-muted)">Урилга байхгүй байна</p>
              ) : recentInvites.map((inv) => (
                <div key={inv.id} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-(--color-text)">{inv.title}</p>
                    <p className="text-[11px] text-(--color-text-muted)">
                      {inv.eventDate ? formatDate(inv.eventDate) : "—"}
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
