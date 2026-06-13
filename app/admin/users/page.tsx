import { PageHeader } from "@/components/shared/PageHeader";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <PageHeader
          title="Хэрэглэгчид"
          subtitle="Бүртгэлтэй хэрэглэгчдийн жагсаалт"
        />
        <div className="mt-8 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-8 text-center">
          <p className="text-sm text-(--color-text-muted)">Энэ хэсэг хожим нэмэгдэнэ (Phase 7).</p>
        </div>
      </div>
    </div>
  );
}
