# 06 — Roadmap & Phases

Phase бүр тусдаа Claude Code session/prompt. Phase бүрийн төгсгөлд: changed files summary + env/db changes + risks + next step.

## Phase 1 — Foundation + FieldConfig renderer ✅ эхлэх phase

**Scope:**
- Next.js App Router + TS strict + Tailwind project scaffold
- Design tokens (`03-design-system.md`-ийн дагуу globals.css + tailwind.config)
- Roboto setup (latin + cyrillic)
- `components/ui` primitives бүгд (states-тэй)
- `components/shared` layout components
- `components/invite`: TemplateCard, EventTypeCard, PhonePreviewFrame, **InviteRenderer**, **GeneratedInviteForm**, RSVPSheet (static), StatusBadge, RSVPBadge, DeliveryStatusBadge
- `types/template.ts`, `types/invite.ts` + mock data (6 category, 6+ realistic template, sample invites — prototype-ийн sample data ашиглана: "Анужин 6 нас", "Бат-Эрдэнэ Солонго нар", Shangri-La г.м.)
- `/dev/components` showcase page — бүх component + states + InviteRenderer demo (editor/preview/public 3 mode)
- Supabase / backend ХИЙХГҮЙ

**Acceptance:**
- `/dev/components` дээр бүх component харагдана, mobile 375px дээр эвдрэхгүй
- InviteRenderer mock template + values-ийг 3 mode-д зөв render хийнэ, resize хийхэд scale зөв
- GeneratedInviteForm mock fields-ээс form үүсгэж, бичихэд renderer live update хийнэ
- Hardcoded hex/px duplication байхгүй, бүгд tokens

## Phase 2 — Public pages

Landing, /templates (search/category/sort/pagination/skeleton/empty), /templates/[slug], auth pages (UI). Mock data хэвээр.

**Acceptance:** Landing нь invitation product шиг (SaaS template биш); listing filter ажиллана; detail → create CTA navigation бүрэн.

## Phase 3 — Create invite flow

4-step flow (D4), query-param step state, live preview, step validation, photo crop (zoom slider), slug edit + fake availability (D6 UI states), publish success screen (link/QR/download UI). Local/mock persistence.

**Acceptance:** Бүх step mobile/desktop дээр ажиллана; required validation; refresh хийхэд step хадгалагдана.

## Phase 4 — Dashboard + public invite page

/dashboard (stats compute, invite rows, edit/preview/copy/delete + confirm, empty state), /i/[slug] public page (renderer + action bar + RSVP sheet UI + invalid-link state), /invites/[id]/edit.

**Acceptance:** Public page mobile дээр гоё, RSVP sheet D7 fields-тэй; invalid slug цэвэрхэн error state.

## Phase 5 — Admin base pages

AdminShell, /admin dashboard, templates list (table/grid, filters), categories (sortable, modal CRUD), invites list, assets library (upload states UI). Mock data.

## Phase 6 — Template editor engine

3-panel editor: canvas drag/resize, selection sync, layer list, field settings panel, add-field menu, sample data / safe area / mobile preview / zoom toggles, dirty-state + unsaved modal + publish validation. Бүгд InviteRenderer дээр суурилна.

**Acceptance:** Prototype.html-ийн editor behavior бүрэн давтагдана; lock = position lock only (D5).

## Phase 7 — Supabase integration

Migrations (`05-data-model.md`), RLS, Auth (login/register/forgot), storage buckets, бүх mock data-г real query-гээр солих, slug-check API real болгох, RSVP API (rate limited), generated DB types.

**Acceptance:** RLS test: өөр user-ийн invite уншигдахгүй; service role client-д ороогүй; auth flows бүрэн.

## Phase 8 — Publish / share / export

Public slug routing real, QR generation, .ics route, OG metadata, copy-link UX, archive flow (D10).

## Phase G — Guest list + Email delivery (Resend)

/invites/[id]/guests (GuestTable/GuestCard, add/edit/delete, CSV import optional), token generation, /g/[token] page, send/resend API (`04-architecture.md`-ийн check chain), delivery_logs + admin /admin/delivery-logs, email template (Resend, монгол copy).

**Acceptance:** Send API бүх permission check-тэй, structured error codes; delivery статус UI real-time шинэчлэгдэнэ (refetch hangalttai, websocket шаардлагагүй).

## Phase 9 — Video templates + rendered export

Video background support (poster, autoplay muted), rendered image/video export pipeline шийдэл (satori vs server canvas — энэ phase дээр судалж шийднэ).

---

### Phase хоорондын дүрэм

- Дараагийн phase эхлэхдээ өмнөх phase-ийн component-уудыг өөрчлөхгүйгээр ашиглахыг эрмэлзэнэ; өөрчлөх бол шалтгааныг summary-д бичнэ.
- Unrelated файл rewrite хийхгүй.
- Phase бүр commit-ready, жижиг logical commit-уудаар.
