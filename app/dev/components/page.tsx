"use client";

import { useState } from "react";

// UI components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/SearchInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Drawer } from "@/components/ui/Drawer";
import { DateInput } from "@/components/ui/DateInput";
import { TimeInput } from "@/components/ui/TimeInput";

// Shared components
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable } from "@/components/shared/DataTable";
import { ActionMenu } from "@/components/shared/ActionMenu";

// Invite components
import { InviteRenderer } from "@/components/invite/InviteRenderer";
import { GeneratedInviteForm } from "@/components/invite/GeneratedInviteForm";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { EventTypeCard } from "@/components/invite/EventTypeCard";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import { StatusBadge } from "@/components/invite/StatusBadge";
import { RSVPBadge } from "@/components/invite/RSVPBadge";
import { DeliveryStatusBadge } from "@/components/invite/DeliveryStatusBadge";
import { RSVPSheet } from "@/components/invite/RSVPSheet";
import { ShareLinkCard } from "@/components/invite/ShareLinkCard";
import { InviteCard } from "@/components/invite/InviteCard";

import { mockTemplates, mockCategories, mockInvites } from "@/lib/mock-data";
import { APP_URL } from "@/lib/constants";
import type { InviteValues } from "@/types/template";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex flex-col gap-6 pb-16 border-b border-(--color-border) last:border-0"
    >
      <h2 className="text-[18px] font-semibold text-(--color-text)">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock table data
// ---------------------------------------------------------------------------

type TableRow = { id: string; name: string; status: string };

const TABLE_DATA: TableRow[] = [
  { id: "1", name: "Анужин 6 нас", status: "Нийтлэгдсэн" },
  { id: "2", name: "Бат & Солонго хурим", status: "Ноорог" },
  { id: "3", name: "Төгсөлтийн ёслол 2026", status: "Архивлагдсан" },
];

const TABLE_COLUMNS = [
  { key: "id" as const, label: "ID", width: "60px" },
  { key: "name" as const, label: "Нэр" },
  { key: "status" as const, label: "Төлөв" },
];

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "buttons", label: "Товчлуурууд" },
  { id: "inputs", label: "Оруулах талбар" },
  { id: "badges", label: "Гарчиг / Мэдэгдэл" },
  { id: "modals", label: "Модал / Drawer" },
  { id: "tables", label: "Хүснэгт / Хоосон" },
  { id: "invite-components", label: "Урилга компонент" },
  { id: "invite-renderer", label: "InviteRenderer демо" },
];

// ---------------------------------------------------------------------------
// Initial InviteValues from template[0] placeholders
// ---------------------------------------------------------------------------

function buildInitialValues(template: (typeof mockTemplates)[0]): InviteValues {
  const values: InviteValues = {};
  for (const field of template.fields) {
    if (field.type === "image" || field.type === "qr" || field.type === "rsvp") continue;
    values[field.key] = { text: field.placeholder ?? "" };
  }
  return values;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ComponentsShowcasePage() {
  // --- Input section state ---
  const [inputVal, setInputVal] = useState("");
  const [textareaVal, setTextareaVal] = useState("");
  const [selectVal, setSelectVal] = useState("mn");
  const [searchVal, setSearchVal] = useState("");
  const [checkboxA, setCheckboxA] = useState(true);
  const [checkboxB, setCheckboxB] = useState(false);
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [dateVal, setDateVal] = useState("2026.07.20");
  const [timeVal, setTimeVal] = useState("14:00");

  // --- Modal/Drawer state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rsvpSheetOpen, setRsvpSheetOpen] = useState(false);

  // --- InviteRenderer demo state ---
  const template = mockTemplates[0];
  const [values, setValues] = useState<InviteValues>(() =>
    buildInitialValues(template),
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(
    undefined,
  );
  const [rendererMode, setRendererMode] = useState<
    "editor" | "preview" | "public"
  >("editor");

  return (
    <div className="min-h-screen bg-(--color-bg)">
      {/* Header */}
      <header className="bg-(--color-surface) border-b border-(--color-border) px-6 py-4 sticky top-0 z-40">
        <p className="text-base font-semibold text-(--color-text)">
          Компонент showcase
        </p>
        <p className="text-xs text-(--color-text-muted) mt-0.5">
          Phase 1 — Бүх компонент, бүх төлөв
        </p>
      </header>

      {/* Body */}
      <div className="flex gap-8 px-6 py-8 max-w-6xl mx-auto">
        {/* Sticky sidebar nav */}
        <nav className="w-48 shrink-0 hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-soft) rounded-(--radius-ctrl) px-3 py-1.5 transition-colors duration-150"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-16 min-w-0">
          {/* ================================================================
              BUTTONS
          ================================================================ */}
          <Section id="buttons" title="Товчлуурууд">
            <Row label="Primary">
              <Button variant="primary" size="sm">Үүсгэх</Button>
              <Button variant="primary" size="md">Үүсгэх</Button>
              <Button variant="primary" size="lg">Үүсгэх</Button>
              <Button variant="primary" size="md" loading>Хадгалж байна</Button>
            </Row>
            <Row label="Accent">
              <Button variant="accent" size="sm">Нийтлэх</Button>
              <Button variant="accent" size="md">Нийтлэх</Button>
              <Button variant="accent" size="lg">Нийтлэх</Button>
              <Button variant="accent" size="md" loading>Нийтэлж байна</Button>
            </Row>
            <Row label="Secondary">
              <Button variant="secondary" size="sm">Хадгалах</Button>
              <Button variant="secondary" size="md">Хадгалах</Button>
              <Button variant="secondary" size="lg">Хадгалах</Button>
              <Button variant="secondary" size="md" loading>Уншиж байна</Button>
            </Row>
            <Row label="Ghost">
              <Button variant="ghost" size="sm">Цуцлах</Button>
              <Button variant="ghost" size="md">Цуцлах</Button>
              <Button variant="ghost" size="lg">Цуцлах</Button>
            </Row>
            <Row label="Danger">
              <Button variant="danger" size="sm">Устгах</Button>
              <Button variant="danger" size="md">Устгах</Button>
              <Button variant="danger" size="lg">Устгах</Button>
              <Button variant="danger" size="md" loading>Устгаж байна</Button>
            </Row>
            <Row label="Icon">
              <Button variant="icon" size="sm" aria-label="Засах">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button variant="icon" size="md" aria-label="Засах">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button variant="icon" size="lg" aria-label="Засах">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </Button>
            </Row>
            <Row label="Disabled">
              <Button variant="primary" size="md" disabled>Идэвхгүй</Button>
              <Button variant="accent" size="md" disabled>Идэвхгүй</Button>
              <Button variant="danger" size="md" disabled>Идэвхгүй</Button>
            </Row>
          </Section>

          {/* ================================================================
              INPUTS
          ================================================================ */}
          <Section id="inputs" title="Оруулах талбар">
            <Row label="Input — default / error / disabled">
              <div className="w-56">
                <Input
                  label="Арга хэмжээний нэр"
                  placeholder="Жишээ: Анужин 6 нас"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
              </div>
              <div className="w-56">
                <Input
                  label="Имэйл хаяг"
                  placeholder="user@example.com"
                  value=""
                  onChange={() => {}}
                  error="Имэйл хаяг буруу байна"
                />
              </div>
              <div className="w-56">
                <Input
                  label="Идэвхгүй талбар"
                  placeholder="Өөрчлөх боломжгүй"
                  value="Утга"
                  onChange={() => {}}
                  disabled
                />
              </div>
            </Row>

            <Row label="Textarea">
              <div className="w-72">
                <Textarea
                  label="Нэмэлт тайлбар"
                  placeholder="Дэлгэрэнгүй мэдээлэл..."
                  value={textareaVal}
                  onChange={(e) => setTextareaVal(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="w-72">
                <Textarea
                  label="Алдаатай textarea"
                  value=""
                  onChange={() => {}}
                  error="Заавал бөглөнө"
                  rows={3}
                />
              </div>
            </Row>

            <Row label="Select">
              <div className="w-56">
                <Select
                  label="Аймаг / Хот"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { value: "mn", label: "Улаанбаатар" },
                    { value: "darkhan", label: "Дархан-Уул" },
                    { value: "erdenet", label: "Орхон" },
                    { value: "choibalsan", label: "Дорнод" },
                  ]}
                />
              </div>
              <div className="w-56">
                <Select
                  label="Алдаатай select"
                  value=""
                  onChange={() => {}}
                  options={[{ value: "", label: "Сонгоно уу" }]}
                  error="Сонгох шаардлагатай"
                />
              </div>
            </Row>

            <Row label="SearchInput">
              <div className="w-64">
                <SearchInput
                  value={searchVal}
                  onChange={setSearchVal}
                  placeholder="Урилга хайх..."
                />
              </div>
            </Row>

            <Row label="Checkbox">
              <Checkbox
                label="Нийтэд харагдах"
                checked={checkboxA}
                onChange={setCheckboxA}
              />
              <Checkbox
                label="Чек хийгдэгүй"
                checked={checkboxB}
                onChange={setCheckboxB}
              />
              <Checkbox
                label="Идэвхгүй (чек)"
                checked={true}
                onChange={() => {}}
                disabled
              />
              <Checkbox
                label="Идэвхгүй (хоосон)"
                checked={false}
                onChange={() => {}}
                disabled
              />
            </Row>

            <Row label="Toggle">
              <Toggle
                label="Мэдэгдэл идэвхтэй"
                checked={toggleA}
                onChange={setToggleA}
              />
              <Toggle
                label="Унтарсан"
                checked={toggleB}
                onChange={setToggleB}
              />
              <Toggle
                label="Идэвхгүй (асаалттай)"
                checked={true}
                onChange={() => {}}
                disabled
              />
            </Row>

            <Row label="DateInput / TimeInput">
              <div className="w-48">
                <DateInput
                  label="Огноо"
                  value={dateVal}
                  onChange={setDateVal}
                />
              </div>
              <div className="w-36">
                <TimeInput
                  label="Цаг"
                  value={timeVal}
                  onChange={setTimeVal}
                />
              </div>
              <div className="w-48">
                <DateInput
                  label="Алдаатай огноо"
                  value=""
                  onChange={() => {}}
                  error="Огноо оруулна уу"
                />
              </div>
            </Row>
          </Section>

          {/* ================================================================
              BADGES / STATUS
          ================================================================ */}
          <Section id="badges" title="Гарчиг / Мэдэгдэл">
            <Row label="Badge — variants">
              <Badge variant="default">Ердийн</Badge>
              <Badge variant="success">Амжилттай</Badge>
              <Badge variant="warning">Анхааруулга</Badge>
              <Badge variant="danger">Алдаа</Badge>
              <Badge variant="accent">Онцлох</Badge>
              <Badge variant="muted">Бүдгэрсэн</Badge>
            </Row>

            <Row label="Badge — sizes">
              <Badge variant="accent" size="sm">Жижиг</Badge>
              <Badge variant="accent" size="md">Дунд</Badge>
            </Row>

            <Row label="StatusBadge">
              <StatusBadge status="draft" />
              <StatusBadge status="published" />
              <StatusBadge status="archived" />
            </Row>

            <Row label="RSVPBadge">
              <RSVPBadge status="attending" />
              <RSVPBadge status="declined" />
              <RSVPBadge status="maybe" />
            </Row>

            <Row label="DeliveryStatusBadge">
              <DeliveryStatusBadge status="not_sent" />
              <DeliveryStatusBadge status="sending" />
              <DeliveryStatusBadge status="sent" />
              <DeliveryStatusBadge status="failed" />
            </Row>
          </Section>

          {/* ================================================================
              MODAL / DRAWER
          ================================================================ */}
          <Section id="modals" title="Модал / Drawer">
            <Row label="Нээх товчлуурууд">
              <Button variant="secondary" size="md" onClick={() => setModalOpen(true)}>
                Modal нээх
              </Button>
              <Button variant="danger" size="md" onClick={() => setConfirmOpen(true)}>
                ConfirmDialog (danger)
              </Button>
              <Button variant="secondary" size="md" onClick={() => setDrawerOpen(true)}>
                Drawer нээх
              </Button>
              <Button variant="accent" size="md" onClick={() => setRsvpSheetOpen(true)}>
                RSVPSheet нээх
              </Button>
            </Row>

            {/* Modal */}
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Жишээ модал"
            >
              <p className="text-sm text-(--color-text-secondary) mb-6">
                Энэ бол Modal компонентын жишээ. Гарах товч дарах эсвэл дэвсгэр дээр
                дарж хааж болно.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Цуцлах
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Хадгалах
                </Button>
              </div>
            </Modal>

            {/* ConfirmDialog */}
            <ConfirmDialog
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={() => {}}
              title="Устгах уу?"
              message="Энэ урилгыг устгавал буцаан сэргээх боломжгүй. Та итгэлтэй байна уу?"
              confirmLabel="Устгах"
              danger
            />

            {/* Drawer */}
            <Drawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Жишээ drawer"
            >
              <div className="flex flex-col gap-4">
                <p className="text-sm text-(--color-text-secondary)">
                  Энэ бол Drawer компонентын агуулга. Мобайл дээр доороос, десктоп
                  дээр баруунаас гарч ирнэ.
                </p>
                <Input
                  label="Хайлт"
                  placeholder="Хайх утга..."
                  value=""
                  onChange={() => {}}
                />
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setDrawerOpen(false)}
                >
                  Хаах
                </Button>
              </div>
            </Drawer>

            {/* RSVPSheet */}
            <RSVPSheet
              open={rsvpSheetOpen}
              onClose={() => setRsvpSheetOpen(false)}
              inviteTitle="Анужин 6 насны баяр — 2026 оны 7-р сарын 20"
            />
          </Section>

          {/* ================================================================
              TABLE / EMPTY
          ================================================================ */}
          <Section id="tables" title="Хүснэгт / Хоосон">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                DataTable — өгөгдөлтэй
              </p>
              <DataTable<TableRow>
                columns={TABLE_COLUMNS}
                data={TABLE_DATA}
                keyExtractor={(row) => row.id}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                DataTable — loading
              </p>
              <DataTable<TableRow>
                columns={TABLE_COLUMNS}
                data={[]}
                loading
                keyExtractor={(row) => row.id}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                DataTable — хоосон
              </p>
              <DataTable<TableRow>
                columns={TABLE_COLUMNS}
                data={[]}
                emptyMessage="Урилга олдсонгүй"
                keyExtractor={(row) => row.id}
              />
            </div>

            <Row label="EmptyState">
              <div className="w-full border border-(--color-border) rounded-(--radius-card)">
                <EmptyState
                  title="Урилга байхгүй байна"
                  description="Шинэ урилга үүсгэж эхэлнэ үү."
                  action={
                    <Button variant="primary" size="sm">
                      Урилга үүсгэх
                    </Button>
                  }
                />
              </div>
            </Row>

            <Row label="LoadingState">
              <div className="w-full border border-(--color-border) rounded-(--radius-card)">
                <LoadingState message="Урилгуудыг татаж байна..." />
              </div>
            </Row>

            <Row label="ErrorState">
              <div className="w-full border border-(--color-border) rounded-(--radius-card)">
                <ErrorState
                  title="Алдаа гарлаа"
                  message="Өгөгдлийг татахад алдаа гарлаа. Дахин оролдоно уу."
                  onRetry={() => {}}
                />
              </div>
            </Row>
          </Section>

          {/* ================================================================
              INVITE COMPONENTS
          ================================================================ */}
          <Section id="invite-components" title="Урилга компонент">
            {/* TemplateCards */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                TemplateCard — 3 загвар
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-sm">
                {mockTemplates.slice(0, 3).map((tpl) => {
                  const category = mockCategories.find(
                    (c) => c.id === tpl.categoryId,
                  );
                  return (
                    <TemplateCard
                      key={tpl.id}
                      template={tpl}
                      category={category}
                    />
                  );
                })}
              </div>
            </div>

            {/* EventTypeCards */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                EventTypeCard — бүх ангилал
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {mockCategories.map((cat, i) => (
                  <EventTypeCard
                    key={cat.id}
                    category={cat}
                    active={i === 0}
                  />
                ))}
              </div>
            </div>

            {/* InviteCard with ActionMenu */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                InviteCard + ActionMenu
              </p>
              <div className="max-w-md">
                <InviteCard
                  invite={mockInvites[0]}
                  actions={
                    <ActionMenu
                      items={[
                        {
                          label: "Засах",
                          onClick: () => {},
                        },
                        {
                          label: "Устгах",
                          onClick: () => {},
                          danger: true,
                        },
                      ]}
                    />
                  }
                />
              </div>
            </div>

            {/* ShareLinkCard */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                ShareLinkCard
              </p>
              <div className="max-w-md">
                <ShareLinkCard
                  shareUrl={`${APP_URL}/i/anujin-6-nas-2026`}
                  slug="anujin-6-nas-2026"
                />
              </div>
            </div>

            {/* PhonePreviewFrame */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                PhonePreviewFrame
              </p>
              <div className="w-36">
                <PhonePreviewFrame
                  canvasWidth={template.canvasWidth}
                  canvasHeight={template.canvasHeight}
                >
                  <InviteRenderer
                    template={template}
                    values={values}
                    mode="preview"
                  />
                </PhonePreviewFrame>
              </div>
            </div>
          </Section>

          {/* ================================================================
              INVITE RENDERER DEMO
          ================================================================ */}
          <Section id="invite-renderer" title="InviteRenderer демо">
            <p className="text-sm text-(--color-text-secondary) -mt-2">
              Формд бичих бүрд урилга шууд шинэчлэгдэнэ.
            </p>

            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider mr-1">
                Горим:
              </span>
              {(["editor", "preview", "public"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={rendererMode === mode ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => setRendererMode(mode)}
                >
                  {mode === "editor"
                    ? "Editor"
                    : mode === "preview"
                      ? "Preview"
                      : "Public"}
                </Button>
              ))}
            </div>

            {/* Two-column layout: form + phone preview */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: form */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider mb-3">
                  GeneratedInviteForm
                </p>
                <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5">
                  <GeneratedInviteForm
                    fields={template.fields}
                    values={values}
                    onChange={setValues}
                  />
                </div>
              </div>

              {/* Right: phone preview */}
              <div className="lg:w-64 shrink-0">
                <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider mb-3">
                  {rendererMode === "editor"
                    ? "Editor горим — талбар сонгох боломжтой"
                    : rendererMode === "preview"
                      ? "Preview горим — хэрхэн харагдахыг үзнэ"
                      : "Public горим — зочны харагдац"}
                </p>
                <PhonePreviewFrame
                  canvasWidth={template.canvasWidth}
                  canvasHeight={template.canvasHeight}
                >
                  <InviteRenderer
                    template={template}
                    values={values}
                    mode={rendererMode}
                    selectedFieldId={
                      rendererMode === "editor" ? selectedFieldId : undefined
                    }
                    onFieldSelect={
                      rendererMode === "editor"
                        ? setSelectedFieldId
                        : undefined
                    }
                  />
                </PhonePreviewFrame>
                {rendererMode === "editor" && selectedFieldId && (
                  <p className="mt-2 text-xs text-(--color-text-muted) text-center">
                    Сонгогдсон:{" "}
                    <span className="font-medium text-(--color-accent)">
                      {template.fields.find((f) => f.id === selectedFieldId)
                        ?.label ?? selectedFieldId}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Three-mode side-by-side on wide screens */}
            <div className="mt-4">
              <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider mb-3">
                Бүх 3 горим — харьцуулсан харагдац
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {(["editor", "preview", "public"] as const).map((mode) => (
                  <div key={mode} className="flex flex-col gap-2">
                    <p className="text-xs text-center text-(--color-text-secondary) font-medium">
                      {mode === "editor"
                        ? "Editor"
                        : mode === "preview"
                          ? "Preview"
                          : "Public"}
                    </p>
                    <PhonePreviewFrame
                      canvasWidth={template.canvasWidth}
                      canvasHeight={template.canvasHeight}
                    >
                      <InviteRenderer
                        template={template}
                        values={values}
                        mode={mode}
                        selectedFieldId={
                          mode === "editor" ? selectedFieldId : undefined
                        }
                        onFieldSelect={
                          mode === "editor" ? setSelectedFieldId : undefined
                        }
                      />
                    </PhonePreviewFrame>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
