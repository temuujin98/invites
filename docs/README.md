# Invite — Project Docs

Mongolian-first digital invitation platform. Эдгээр docs нь Claude Code-д өгөх **single source of truth**.

## Файлуудын бүтэц

| File | Агуулга |
|---|---|
| `01-product-overview.md` | Product, users, positioning, scope |
| `02-decisions.md` | Батлагдсан architecture/UX decisions (ADR) — зөрчилтэй асуудлуудын шийдэл |
| `03-design-system.md` | Tokens, typography, spacing, radius, component rules |
| `04-architecture.md` | Routes, component map, FieldConfig renderer spec |
| `05-data-model.md` | Бүрэн database schema, RLS, storage buckets |
| `06-roadmap-phases.md` | Phase бүрийн scope, deliverables, acceptance criteria |
| `07-integrations-env.md` | Supabase, Resend, Vercel, GitHub, env variables |
| `08-claude-code-prompts.md` | Phase бүрд зориулсан paste-ready prompts |
| `09-claude-design-fix-prompt.md` | Design update prompt (хийгдсэн — 2026.06) |
| `10-repo-setup-prompt.md` | Repo бүтэц + эхний setup-ийн Claude Code prompt |

## Claude Code-д хэрхэн ашиглах

1. Repo-гийн root дээр энэ `docs/` folder-ийг байршуул (commit хий).
2. `CLAUDE.md` файлд `docs/` руу заасан заавар оруул (`08-claude-code-prompts.md` дотор бэлэн байгаа).
3. Phase бүрийг **тусдаа session/прompt**-оор хийлгэ. Нэг prompt-оор бүгдийг хийлгэхгүй.
4. Phase эхлэхээс өмнө Claude Code-оор өмнөх phase-ийн output-ийг inspect хийлгэ.

## Хатуу дүрэм (бүх phase-д үйлчилнэ)

- Do not improvise UI. Follow `03-design-system.md`.
- Do not invent database fields. Follow `05-data-model.md`.
- Do not duplicate components. Reuse from `components/ui` and `components/shared`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Validate all API payloads with Zod.
- TypeScript strict mode. No `any`.
- All pages: loading / empty / error states required.
- Mobile-first. Test at 375px width.
- Mongolian UI copy. Date format: `2026.06.10` (see shared `lib/format.ts`).

## Implementation status

- Stage: Design + Prototype completed (Design System Board.html, Pages.html, Admin.html, Prototype.html)
- Code: not started
- Next: Phase 1 (Foundation + FieldConfig renderer) — see `06-roadmap-phases.md`
