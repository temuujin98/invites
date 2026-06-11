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

## Repo structure
Single Next.js app. Logical separation via route groups:
- app/(public)/ — landing, templates, auth, /i/[slug], /g/[token] (PublicHeader/Footer layout)
- app/(app)/ — dashboard, create flow, invite editing (DashboardShell + auth guard)
- app/admin/ — admin panel (AdminShell + admin role guard)
- app/api/ — route handlers
Do not create separate apps or a monorepo.

## Approved design files
The approved Claude Design project is the visual source of truth. Fetch when a phase
needs it: https://api.anthropic.com/v1/design/h/UAEsUreYlK5SCHXdKAXXBA
Files: Design System Board.html, Pages.html, Admin.html, Prototype.html
(use ?open_file=<name>). Token values are already extracted in docs/03-design-system.md.
