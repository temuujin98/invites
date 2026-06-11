# 10 — Repo Setup (бүтэц + Claude Code prompt)

Repo: `github.com/temuujin98/invites`

## Бүтцийн шийдвэр: api / client / admin / docs

Санал болгосон `api / client / admin / docs` тусгаарлалтыг **тусдаа app/folder-ууд биш, нэг Next.js app доторх route groups + цэгцтэй folder-уудаар** хийнэ:

| Хүссэн тусгаарлалт | Хаана байрлах |
|---|---|
| client | `app/(public)/` + `app/(app)/` |
| admin | `app/admin/` |
| api | `app/api/` |
| docs | `docs/` (root) |

**Яагаад тусдаа api/client/admin app болгохгүй вэ:**
- InviteRenderer, design system, types-ийг client + admin хоёулаа шууд хуваалцана — тусгаарлавал packages/monorepo overhead нэмэгдэнэ.
- Vercel дээр нэг deploy, нэг env config, нэг preview link.
- Supabase generated types нэг газар.
- Claude Code-д нэг app дотор ажиллах нь хамгийн найдвартай.

Тусгаарлалт нь layout түвшинд хатуу хэвээр: `(public)` → PublicHeader/Footer, `(app)` → DashboardShell + auth guard, `admin` → AdminShell + admin role guard. URL-ууд өөрчлөгдөхгүй (`/dashboard`, `/admin`, `/api/...`).

## Эцсийн repo бүтэц

```
invites/
├── CLAUDE.md
├── docs/                  # 00–10 md файлууд
├── app/
│   ├── (public)/  (app)/  admin/  api/  dev/
├── components/
│   ├── ui/  shared/  invite/  editor/
├── lib/
│   ├── supabase/  validation/  email/   # email — Phase G
│   └── format.ts  copy.ts  constants.ts
├── types/
├── supabase/migrations/   # Phase 7-оос
├── public/
└── .env.example
```

## Setup алхмууд

1. Энэ чатаас `docs/` folder-ийн 11 файлыг татаж авна.
2. Repo-гоо clone хийсэн folder-ийн root-д `docs/` болгож тавина.
3. Claude Code-г repo дотор нээгээд доорх prompt-ийг paste хийнэ.

## Claude Code Setup Prompt (paste-ready)

```text
This is the invites repo (github.com/temuujin98/invites) — a Mongolian-first digital
invitation platform. The docs/ folder at the repo root contains the full project
specification (files 01–10). Do the following setup tasks, nothing more:

1. Read docs/README.md, docs/02-decisions.md, docs/04-architecture.md and
   docs/08-claude-code-prompts.md.

2. Create CLAUDE.md at the repo root using the exact CLAUDE.md block defined inside
   docs/08-claude-code-prompts.md. Add one extra section at the bottom:

   ## Repo structure
   Single Next.js app. Logical separation via route groups:
   - app/(public)/ — landing, templates, auth, /i/[slug], /g/[token] (PublicHeader/Footer layout)
   - app/(app)/ — dashboard, create flow, invite editing (DashboardShell + auth guard)
   - app/admin/ — admin panel (AdminShell + admin role guard)
   - app/api/ — route handlers
   Do not create separate apps or a monorepo.

3. Create a .gitignore appropriate for Next.js (node_modules, .next, .env*.local, etc.)
   and an empty .env.example with the variables listed in docs/07-integrations-env.md
   (keys only, no values).

4. Verify all docs files are present and readable; report any missing or malformed file.

5. Commit with message: "chore: project docs, CLAUDE.md and repo scaffolding config"
   and push to main.

Do NOT scaffold the Next.js app yet — that is Phase 1 (docs/06). After committing,
summarize what was created and confirm you are ready for the Phase 1 prompt.
```

## Дараа нь

Setup commit орсны дараа `docs/08-claude-code-prompts.md`-ийн **Phase 1 prompt**-ийг шинэ session дээр paste хийж үндсэн код эхэлнэ. Phase 1 нь Next.js app-ийг root дээр scaffold хийнэ (`create-next-app` нь хоосон биш folder дээр асуудалгүй ажиллахын тулд Claude Code өөрөө шийднэ — docs/CLAUDE.md-г түр зөөх шаардлага гарвал буцааж тавина гэдгийг summary-д бичүүл).
