# CHANGELOG

## 2026-07-23 — Системийн бүрэн шинэчлэл (funnel rebuild)

Бүх урсгалыг эхнээс нь шинээр хийв. Гол зарчим: маш энгийн, function бүр төгс ажилладаг.

### Хэрэглэгчийн урсгал
1. **Landing** (`/`) — hero + header баруун буланд «Урилга үүсгэх» товч л бий
2. **Загвар сонгох** (`/create`) — 6 загвар, загвар бүр өөрийн үнэтэй
3. **Мэдээлэл оруулах** (`/create/:templateId`) — нэр, огноо, байршил, мессеж + live preview; ноорог localStorage-д хадгалагдана
4. **Имэйл баталгаажуулалт** (`/create/confirm`) — Gmail magic link; бүртгэл автоматаар үүснэ; session ороход ноорог DB-д бичигдэнэ (утас/SMS дараа нэмэгдэнэ)
5. **Төлбөр** (`/pay/:id`) — одоогоор mock (шууд амжилттай); Bonum холболт `payMock()` функцийг сольж хийгдэнэ
6. **Амжилт** — `/i/:slug` шууд идэвхжинэ, холбоос хуулах

### Хэрэглэгчийн хэсэг
- `/my` — өөрийн урилгууд: төлөв, төлбөр, RSVP хариунууд (нэр, хүний тоо). Илүү feature зориуд байхгүй.
- `/i/:slug` — зочны хуудас: загварын өнгөөр, зочны нэр + хүний тоотой RSVP

### Admin (`/admin`)
- Тусдаа dashboard (app workspace): орлого, идэвхтэй урилга, хүлээгдэж буй төлбөр, нийт RSVP
- Урилгын хүснэгт: төлөгдсөн болгох / түр хаах / идэвхжүүлэх / архивлах
- Төлбөрийн хүснэгт
- Хандалт: `public.admins` хүснэгтэд бүртгэлтэй хэрэглэгч л орно

### DB (Supabase, migration applied)
- `invitations`: + `template_id`, `options`, `price`, `owner_email`; status-д `pending_payment` нэмэгдсэн
- `payments` (шинэ): amount, method (mock/bonum), status (pending/paid/failed) + RLS
- `admins` (шинэ) + `is_admin()` security definer function; админ эрхийн RLS бүх хүснэгтэд
- `invitations`-д authenticated-д insert/update/delete grant нэмсэн (RLS хамгаална)

### Админ нэмэх заавар
Өөрийн имэйлээр нэг удаа нэвтэрсний дараа SQL editor-т:
```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'ТАНЫ_ИМЭЙЛ';
```

### Туршилт
Бүтэн урсгалыг browser-оор E2E туршсан: загвар сонгох → форм → имэйл баталгаажуулалт → урилга үүсэх → mock төлбөр → идэвхжилт → зочны RSVP → /my дээр хариу харагдах → admin дээр орлого/төлбөр харагдах. Туршилтын өгөгдөл цэвэрлэгдсэн.
