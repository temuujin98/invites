"use client";

import { useState } from "react";
import type { Guest } from "@/types/guest";
import type { GuestCreateInput } from "@/lib/validation/guest";
import { guestCreateSchema } from "@/lib/validation/guest";
import { createGuest, updateGuest, deleteGuest, importGuests } from "./actions";
import { APP_URL } from "@/lib/constants";

import { ToastProvider, useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Textarea } from "@/components/ui/Textarea";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { EmptyState } from "@/components/shared/EmptyState";

import { GuestTable } from "@/components/invite/GuestTable";
import { GuestCard } from "@/components/invite/GuestCard";
import { GuestFormDrawer } from "@/components/invite/GuestFormDrawer";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 13c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 7.5a2.5 2.5 0 0 0 0-5M14.5 13a4.5 4.5 0 0 0-3-4.24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 9V2M4 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ── CSV Import Drawer ─────────────────────────────────────────────────────────

interface CsvImportDrawerProps {
  open: boolean;
  onClose: () => void;
  onImport: (rows: GuestCreateInput[]) => Promise<void>;
  importing: boolean;
}

function CsvImportDrawer({ open, onClose, onImport, importing }: CsvImportDrawerProps) {
  const [raw, setRaw] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  function parseCsv(text: string): GuestCreateInput[] | null {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return null;

    const rows: GuestCreateInput[] = [];
    for (const line of lines) {
      const [name, email, phone] = line.split(",").map((c) => c.trim());
      const result = guestCreateSchema.safeParse({ name, email: email || undefined, phone: phone || undefined });
      if (!result.success) {
        setParseError(`Мөр буруу: "${line}" — ${result.error.issues[0]?.message ?? "Алдаа"}`);
        return null;
      }
      rows.push(result.data);
    }
    return rows;
  }

  async function handleImport() {
    setParseError(null);
    const rows = parseCsv(raw);
    if (!rows) return;
    await onImport(rows);
    setRaw("");
  }

  const lineCount = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean).length;

  return (
    <Drawer open={open} onClose={onClose} title="CSV импорт">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-(--color-text-muted)">
          Нэг мөрт нэг зочин. Формат: <code className="bg-(--color-surface-soft) px-1 rounded">нэр, и-мэйл, утас</code>
        </p>
        <Textarea
          label="Зочдын жагсаалт"
          placeholder={"Батбаяр Дорж, bat@mail.com, 99001122\nОюунтуяа Ганбаатар, oyun@mail.com"}
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setParseError(null); }}
          rows={8}
        />
        {parseError && (
          <p className="text-xs text-(--color-danger)" role="alert">{parseError}</p>
        )}
        {lineCount > 0 && !parseError && (
          <p className="text-xs text-(--color-text-muted)">{lineCount} зочин илрүүлэгдлээ</p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onClose} disabled={importing}>
            Цуцлах
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleImport}
            loading={importing}
            disabled={lineCount === 0}
          >
            Импортлох ({lineCount})
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

// ── Inner component (uses useToast) ──────────────────────────────────────────

interface GuestsInnerProps {
  inviteId: string;
  inviteTitle: string;
  initialGuests: Guest[];
}

function GuestsInner({ inviteId, inviteTitle, initialGuests }: GuestsInnerProps) {
  const { show } = useToast();

  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [search, setSearch] = useState("");

  // Form drawer state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Guest | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Guest | null>(null);
  const [deleting, setDeleting] = useState(false);

  // CSV import state
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const total = guests.length;
  const accepted = guests.filter((g) => g.rsvpStatus === "accepted").length;
  const declined = guests.filter((g) => g.rsvpStatus === "declined").length;
  const pending = guests.filter((g) => g.rsvpStatus === "pending").length;

  // ── Search filter ───────────────────────────────────────────────────────────
  const filtered = search.trim()
    ? guests.filter((g) => {
        const q = search.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          (g.email?.toLowerCase().includes(q) ?? false)
        );
      })
    : guests;

  // ── Handlers ────────────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEdit(g: Guest) {
    setEditTarget(g);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: { name: string; email?: string; phone?: string; notes?: string }) {
    setSubmitting(true);
    try {
      if (editTarget) {
        const res = await updateGuest(editTarget.id, values);
        if (!res.ok) { show(res.message, "error"); return; }
        setGuests((prev) =>
          prev.map((g) =>
            g.id === editTarget.id ? { ...g, ...values } : g
          )
        );
        show("Зочин шинэчлэгдлээ", "success");
      } else {
        const res = await createGuest(inviteId, values);
        if (!res.ok) { show(res.message, "error"); return; }
        if (!res.data) { show("Алдаа гарлаа", "error"); return; }
        const newGuest: Guest = {
          id: res.data.id,
          inviteId,
          name: values.name,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
          token: res.data.token,
          rsvpStatus: "pending",
          deliveryStatus: "not_sent",
          createdAt: new Date().toISOString(),
        };
        setGuests((prev) => [...prev, newGuest]);
        show("Зочин нэмэгдлээ", "success");
      }
      setFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  function openDelete(g: Guest) {
    setDeleteTarget(g);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteGuest(deleteTarget.id);
      if (!res.ok) { show(res.message, "error"); return; }
      setGuests((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      show("Зочин устгагдлаа", "success");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleCopyLink(g: Guest) {
    const url = `${APP_URL}/g/${g.token}`;
    try {
      await navigator.clipboard.writeText(url);
      show("Хуулагдлаа", "success");
    } catch {
      show("Хуулж чадсангүй", "error");
    }
  }

  function handleSend(g: Guest) {
    void g;
    show("Имэйл илгээх удахгүй нэмэгдэнэ", "info");
  }

  async function handleImport(rows: GuestCreateInput[]) {
    setImporting(true);
    try {
      const res = await importGuests(inviteId, rows);
      if (!res.ok) { show(res.message, "error"); return; }
      // Re-fetch isn't available here; the server will revalidate.
      // Optimistic: show count and instruct a refresh via toast.
      show(`${res.data?.inserted ?? rows.length} зочин нэмэгдлээ`, "success");
      setImportOpen(false);
      // Optimistic rows with placeholder data (server revalidates soon)
      const optimistic: Guest[] = rows.map((r, i) => ({
        id: `import-${Date.now()}-${i}`,
        inviteId,
        name: r.name,
        email: r.email,
        phone: r.phone,
        notes: r.notes,
        token: "",
        rsvpStatus: "pending",
        deliveryStatus: "not_sent",
        createdAt: new Date().toISOString(),
      }));
      setGuests((prev) => [...prev, ...optimistic]);
    } finally {
      setImporting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <PageHeader
          title="Зочид"
          subtitle={inviteTitle}
          backHref="/dashboard"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setImportOpen(true)}
                className="gap-1.5"
              >
                <IconUpload />
                <span className="hidden sm:inline">CSV импорт</span>
              </Button>
              <Button variant="primary" size="sm" onClick={openAdd}>
                + Зочин нэмэх
              </Button>
            </div>
          }
        />

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard label="Нийт зочид" value={total} icon={<IconUsers />} />
          <StatsCard label="Ирнэ" value={accepted} />
          <StatsCard label="Ирэхгүй" value={declined} />
          <StatsCard label="Хүлээгдэж буй" value={pending} />
        </div>

        {/* Search */}
        {guests.length > 0 && (
          <div className="mt-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Нэр, и-мэйлээр хайх"
            />
          </div>
        )}

        {/* List */}
        <div className="mt-4">
          {guests.length === 0 ? (
            <EmptyState
              title="Зочин байхгүй байна"
              description="Зочин нэмж эхэлнэ үү"
              action={
                <Button variant="primary" size="sm" onClick={openAdd}>
                  + Зочин нэмэх
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Хайлтын үр дүн олдсонгүй"
              description={`"${search}" хайлтад тохирох зочин байхгүй`}
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <GuestTable
                  guests={filtered}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onCopyLink={handleCopyLink}
                  onSend={handleSend}
                />
              </div>

              {/* Mobile card list */}
              <div className="flex flex-col gap-2 md:hidden">
                {filtered.map((g) => (
                  <GuestCard
                    key={g.id}
                    guest={g}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    onCopyLink={handleCopyLink}
                    onSend={handleSend}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add / Edit drawer */}
      <GuestFormDrawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editTarget}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Зочныг устгах уу?"
        message={`"${deleteTarget?.name ?? ""}" зочныг жагсаалтаас устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
        confirmLabel={deleting ? "Устгаж байна..." : "Устгах"}
        danger
      />

      {/* CSV import drawer */}
      <CsvImportDrawer
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        importing={importing}
      />
    </div>
  );
}

// ── Public export wrapped in ToastProvider ────────────────────────────────────

interface GuestsClientProps {
  inviteId: string;
  inviteTitle: string;
  shareSlug: string;
  invitePublished: boolean;
  initialGuests: Guest[];
}

export function GuestsClient({ inviteId, inviteTitle, initialGuests }: GuestsClientProps) {
  return (
    <ToastProvider>
      <GuestsInner inviteId={inviteId} inviteTitle={inviteTitle} initialGuests={initialGuests} />
    </ToastProvider>
  );
}
