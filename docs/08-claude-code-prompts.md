# 08 — Claude Code Prompts

Phase бүрд paste-ready prompt. Эхлээд repo root-д доорх `CLAUDE.md`-г үүсгэ.

---

## CLAUDE.md (repo root — эхний commit-д оруул)

```markdown
# Invite — Claude Code Instructions

Mongolian-first digital invitation platform. Full spec lives in `docs/` — read the
relevant docs before any task:

- docs/02-decisions.md — approved decisions (never deviate)
- docs/03-design-system.md — tokens/typography/component rules
- docs/04-architecture.md — routes, components, InviteRenderer contract
- docs/05-data-model.md — database schema (do not invent fields)
- docs/06-roadmap-phases.md — current phase scope

## Hard rules
- TypeScript strict, no `any`. Tailwind with design tokens only — no hardcoded hex/px duplicates.
- Roboto (latin+cyrillic). App UI base text 12px; public invite/landing use the guest scale.
- Reuse components from components/ui, components/shared, components/invite. Never duplicate UI patterns.
- Server components by default; "use client" only where needed.
- Never expose SUPABASE_SERVICE_ROLE_KEY to the client. Keep server/client Supabase separation (lib/supabase/*).
- Validate API payloads with Zod. Structured API responses: { ok, data } | { ok, code, message }.
- Every data view needs loading / empty / error states. Mobile-first (test 375px).
- All UI copy in Mongolian. Dates: 2026.06.10 format via lib/format.ts.
- Subtle Framer Motion only (see docs/03). No over-animation.
- Do not rewrite unrelated files. Keep changes commit-ready.
- After each task: list changed files + why, required env/db changes, risks/follow-ups.
```

---

## Phase 1 prompt

```text
Read docs/README.md, docs/02-decisions.md, docs/03-design-system.md, docs/04-architecture.md,
docs/06-roadmap-phases.md (Phase 1 section).

Start Phase 1: Foundation + FieldConfig renderer. Scope:

1. Scaffold Next.js App Router project (TypeScript strict, Tailwind, Framer Motion). No Supabase yet.
2. Implement design tokens from docs/03 in globals.css + tailwind.config.ts. Set up Roboto
   via next/font/google with latin + cyrillic subsets.
3. Build components/ui primitives with all states (default/hover/focus/disabled/loading).
4. Build components/shared layout components (AppShell, DashboardShell, AdminShell, PageHeader,
   SectionHeader, StatsCard, EmptyState, LoadingState, ErrorState, DataTable, FilterTabs, etc.).
5. Build components/invite: TemplateCard, EventTypeCard, PhonePreviewFrame, StatusBadge,
   RSVPBadge, DeliveryStatusBadge, RSVPSheet (static UI), and most importantly:
   - InviteRenderer following the exact contract in docs/04 (scaling rule from docs/02 D3)
   - GeneratedInviteForm that builds inputs + a Zod schema from TemplateFieldConfig[]
6. Create types/template.ts, types/invite.ts and lib/mock-data.ts with 6 categories and 6+
   realistic Mongolian templates/invites (sample data: "Анужин 6 нас", "Бат-Эрдэнэ Солонго нар",
   Shangri-La, RSVP 9911-2233).
7. Build /dev/components showcase: every component with its states, plus a live demo where
   GeneratedInviteForm edits update InviteRenderer in editor/preview/public modes.

Do NOT implement Supabase, real pages, or the admin editor. Quality over speed.
Finish with: changed files summary, any deviations from docs, recommended next phase.
```

## Phase 2 prompt

```text
Read docs/04-architecture.md and docs/06 Phase 2. Using only existing shared components and
mock data, build: landing page (hero with phone preview composition, how-it-works, category
cards, featured templates, feature grid, use cases, final CTA — must feel like an invitation
product, not a generic SaaS site), /templates listing (category chips, search, sort,
pagination, skeleton, empty state, mobile filter drawer), /templates/[slug] detail
(preview, supported fields chips, CTA to /create/[slug], similar templates, mobile sticky CTA),
and auth pages UI. Mongolian copy throughout. Inspect /dev/components first; do not create
new one-off UI patterns — extend shared components if something is missing and note it.
```

## Phase 3 prompt

```text
Read docs/02 (D4, D6, D7) and docs/06 Phase 3. Build /create/[templateSlug] 4-step flow
(Мэдээлэл / Байршил / Зураг / Нийтлэх) with ?step= query state. Desktop: form left, sticky
PhonePreviewFrame right with live InviteRenderer. Mobile: top stepper + collapsible preview.
Step validation, photo upload with circular crop + zoom slider, editable slug with
available/taken/invalid/checking UI states (mock check for now), publish loading + success
screen with link/QR/download UI. Persist draft state locally for now.
```

## Phase 4 prompt

```text
Read docs/06 Phase 4. Build /dashboard (stats computed from data, invite rows with thumbnail,
title, event date, status, actions: edit/preview/copy link/delete with ConfirmDialog, empty
state), /invites/[id]/edit (reuse create-flow steps), and /i/[shareSlug] public invite page:
zero-chrome mobile-first InviteRenderer in public mode, action bar (RSVP / Газрын зураг /
Calendar / Хуваалцах), RSVP bottom sheet with fields from docs/02 D7, invalid-link error state,
footer "invites.mn дээр үүсгэв".
```

## Phase 5–6 prompts

```text
Phase 5: Read docs/06 Phase 5. Build AdminShell and admin pages (dashboard, templates list
with table/grid toggle + filters, categories with sortable rows + CRUD modal, user invites
list, assets library with upload progress / video processing / oversized failure / in-use
delete protection states). Mock data.
```

```text
Phase 6: Read docs/02 (D2, D3, D5) and docs/06 Phase 6. Build the template editor at
/admin/templates/[id]/edit: left settings panel, center canvas (InviteRenderer in editor mode
with drag/resize handles, safe-area guide, field tag), right layer list + field settings panel.
Selection syncs both ways. Toolbar: zoom, safe area, sample data, mobile preview toggles.
Add-field menu, duplicate/delete/lock(position-only)/hide. Dirty-state tracking,
unsaved-changes modal, publish validation (background + thumbnail + ≥1 field) and confirmation.
Mobile: Тохиргоо/Canvas/Талбарууд tabs.
```

## Phase 7 prompt

```text
Read docs/05-data-model.md and docs/07-integrations-env.md fully. Create Supabase migrations
exactly matching docs/05 (tables, checks, indexes, RLS policies, storage buckets). Set up
lib/supabase/{server,client,admin}.ts with proper separation (admin.ts imports "server-only").
Implement auth flows, replace mock data with real queries (server components), real
/api/slug-check with debounce-friendly response, /api/rsvp with Zod + simple rate limiting,
and generate types/database.ts. Show me each migration before applying anything to the remote
project. Verify: no service-role usage reachable from client code; a user cannot read another
user's invites.
```

## Phase 8 / G / 9

docs/06-ийн scope-уудыг мөн адил загвараар. Phase G дээр заавал нэм:

```text
Implement POST /api/invites/[id]/send with the exact check chain from docs/07 (owner →
published → guest ownership → email present → slug/token valid → send → delivery_log),
structured error codes from docs/04, and safe payload logging (no PII beyond guest_id +
provider_message_id).
```

---

## Prompt бичих зөвлөмж

- Phase бүрийн эхэнд "Read docs/..." гэж заавал зааж өг — Claude Code context-оо docs-оос авна.
- "Inspect existing X first" гэж нэмбэл duplicate component гарах эрсдэл буурна.
- Нэг prompt = нэг phase. Дунд нь fix хэрэгтэй бол scope-ийг нь жижиг тодорхой бич.
- Phase 7-оос эхлэн "show migration before applying" дүрмийг мартахгүй.
