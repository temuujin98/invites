# 07 — Integrations & Env

Connectors: **GitHub, Supabase, Vercel** холбогдсон. Claude Code эдгээрийг дараах байдлаар ашиглана.

## Env variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # SERVER ONLY — NEXT_PUBLIC_ prefix ХЭЗЭЭ Ч хэрэглэхгүй

# Email (Phase G)
EMAIL_PROVIDER=resend
EMAIL_FROM="Invite <noreply@invites.mn>"
EMAIL_REPLY_TO=
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://invites.mn   # link/QR/ics generation-д
```

`.env.example` файлыг repo-д commit хийнэ (утгагүй), `.env.local` нь `.gitignore`-д.

## Supabase

### Auth — "Confirm email" тохиргоо (чухал)

**Dev орчинд:** Supabase Dashboard → Authentication → Providers → Email → **"Confirm email" OFF**.
- OFF байхад signup хийсэн хэрэглэгч шууд session авна, email confirmation шаардахгүй.
- Тестэнд ашигласан email rate limit (3/цаг, free tier) тулгардаггүй.

**Production руу шилжихэд:** "Confirm email" дахин асаана, confirmation email template монгол хэлрүү орчуулна.

---

- Client тусгаарлалт: `lib/supabase/server.ts` (cookies, SSR), `lib/supabase/client.ts` (browser anon), `lib/supabase/admin.ts` (service role, `import "server-only"` заавал).
- Migrations: `supabase/migrations/` — Claude Code MCP-ээр `apply_migration` ашиглаж болно, гэхдээ **production project дээр шууд destructive SQL ажиллуулахгүй**; эхлээд migration файл үүсгэж харуулна.
- Types: schema өөрчлөгдөх бүрт `types/database.ts` regenerate.
- Storage: bucket policy-уудыг migration/SQL-д бичиж version-лоно.

## Resend (Phase G)

- Email template: монгол хэлээр, plain + simple HTML (template thumbnail + event date + CTA button "Урилга нээх" (accent violet) → `/g/[token]`).
- Send API check chain (дараалал чухал):
  1. auth user = invite owner
  2. invite.status = 'published'
  3. guest нь тухайн invite-д харьяалагдана
  4. guest.email байгаа
  5. share_slug + token хүчинтэй
  6. send → delivery_log insert (sending → sent/failed)
- Log дотор email body хадгалахгүй, payload-аас PII хэт ихийг log-лохгүй (guest_id + message_id хангалттай).
- Provider abstraction: `lib/email/provider.ts` interface → `resend.ts` implementation (EMAIL_PROVIDER switch-д бэлэн).

## Vercel

- Env vars-ийг Vercel project settings дээр тохируулна (service role key — Production/Preview scope, client-д ил гарахгүй).
- Preview deployments: PR бүрт авто. Phase бүрийн төгсгөлд preview link-ээр шалгана.
- `next/image` remote patterns: Supabase storage domain нэмнэ.

## GitHub workflow

- Branch: `main` (protected) + `phase/N-short-name` working branches.
- Phase бүр = 1 PR. Commit-ууд жижиг, logical.
- PR description: changed files + why, env/db changes, risks/follow-ups (project instructions-ы 7/8/9 дүрэм).

## Security checklist (бүх phase-д)

- [ ] Service role зөвхөн `lib/supabase/admin.ts`-д, client bundle-д ороогүйг шалгана
- [ ] Бүх API route Zod validation-тай
- [ ] Public projection-д private талбар алдагдаагүй (guest emails, user ids г.м.)
- [ ] RSVP/slug-check route-ууд rate limit-тэй
- [ ] Guest token crypto-random (`crypto.randomBytes(18).toString('base64url')` г.м.)
- [ ] Upload size/type client + server давхар шалгалт
