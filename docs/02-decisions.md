# 02 — Decisions (ADR)

Хоёр brief хооронд зөрсөн болон тодорхойгүй байсан асуудлуудын **батлагдсан шийдвэрүүд**. Claude Code эдгээрээс гажихгүй.

---

## D1 — Product scope: public link vs guest delivery system

**Асуудал:** Project instructions дээр бүрэн guest management (guest list, per-guest token, Resend, delivery logs) байгаа; analyst brief дээр зөвхөн public share link + anonymous RSVP байгаа.

**Шийдвэр:**
- MVP core = public share link flow (brief-ийн дагуу).
- Guest list + email delivery = **Phase G** (Supabase integration-ы дараа).
- Гэхдээ database schema эхнээсээ `guests`, `rsvps`, `delivery_logs` table-уудтай байна (`05-data-model.md`). UI нь phase-аар нэмэгдэнэ, schema өөрчлөгдөхгүй.

## D2 — Single FieldConfig-driven renderer

Нэг `InviteRenderer` component 3 газарт ашиглагдана:
1. Admin template editor canvas
2. User create-flow phone preview
3. Public invite page (`/i/[slug]`, `/g/[token]`)

Formula: `Template background + FieldConfig[] + values = rendered invite`.

## D3 — Renderer coordinate system

- FieldConfig `x/y/w/h` нь **canvas pixel** (ж: 1080×1920) дээр хадгалагдана.
- Renderer container-ийн бодит өргөнөөс `scale = containerWidth / canvas.w` нэг scale factor тооцоод бүх coordinate/fontSize-ийг үржүүлнэ.
- Aspect ratio хадгална (`paddingBottom` ratio эсвэл `aspect-ratio` CSS).
- Текст overflow: `maxChars` хязгаар + CSS line-clamp. Auto-shrink хийхгүй (V1).

## D4 — Create flow = 4 алхам, "Загвар" step байхгүй

User template detail-ээс орж ирдэг тул:
1. Мэдээлэл (event info)
2. Байршил (location/details)
3. Зураг (photo upload/crop)
4. Нийтлэх (preview/publish)

Back хийвэл template detail руу буцна. Step state нь query param: `/create/[templateSlug]?step=info`.

## D5 — Lock = position lock only

Admin editor дээр lock нь зөвхөн canvas дээрх drag/resize-ийг хаана. Right panel-аас property edit хийх боломжтой хэвээр. UI label: **"Байрлал түгжих"**.

## D6 — Slug availability check

Publish step дээр debounced (400–600ms) server-side availability check. States: `available` / `taken` / `invalid` / `checking`. Reserved slugs: `admin`, `api`, `login`, `register`, `dashboard`, `templates`, `create`, `i`, `g`, `dev`.

## D7 — RSVP form fields

Guest RSVP bottom sheet:
- Нэр (required)
- Ирэх эсэх: Ирнэ / Ирэхгүй / Магадгүй (required)
- Хэдэн хүн ирэх (attending үед, default 1)
- Тайлбар (optional)

Tokenized link-ээр орсон бол нэр автоматаар бөглөгдөнө, RSVP нь guest record-д холбогдоно.

## D8 — Link routes

- Public link: `/i/[shareSlug]` — хэн ч нээж болно (invite `is_public=true` үед).
- Per-guest link: `/g/[token]` — crypto-random token (≥24 char, URL-safe). Token нь slug-аас хамааралгүй. Нэг page renderer хоёуланд ашиглагдана, guest context л ялгаатай.
- Invalid/expired token → цэвэрхэн error state page.

## D9 — Typography: 2 scale

- **App/Admin UI scale:** base 12px body, 11px secondary, 16–20px section titles, 22–28px page titles. Compact density.
- **Guest/Marketing scale (public invite page + landing):** body 14–15px, headings template design-аас. Cyrillic line-height 1.5–1.6.

12px-ийг public invite page дээр хэрэглэхгүй — уншигдахуйц байдал чухал.

## D10 — Invitation statuses

`draft` | `published` | `archived`. Archive нь soft-hide (dashboard-аас нуугдана, public link 404/expired state харуулна). Delete нь hard delete + confirm dialog.

## D11 — Admin authorization

- `profiles.role` (`user` | `admin`) — Supabase Auth + RLS-ээр шалгана.
- Admin route-ууд server-side role check + RLS давхар хамгаалалттай.
- Service role key зөвхөн server-only код (route handlers / server actions) дотор, тэр ч үед аль болох RLS-тэй anon/user client-ийг түрүүлж ашиглана.

## D12 — Share extras (Phase 7+)

- QR: client-side generation (`qrcode` lib), PNG download.
- Calendar: `.ics` file server route-аас generate.
- OG image: эхний хувилбарт template thumbnail + title overlay; бүрэн rendered image export нь хожмын pipeline (satori/canvas — Phase 9-д шийднэ).
- Map: Google Maps link шууд нээнэ (embed биш, V1).

## D13 — Video template support

Phase 9 хүртэл хойшилно. Schema-д `type: image | video` эхнээсээ байна. Public page дээр video: `autoplay muted loop playsinline` + poster image fallback.
