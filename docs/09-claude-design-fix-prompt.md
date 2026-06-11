# 09 — Claude Design Update Prompt

Доорх prompt-ийг одоо байгаа Claude Design project дээрээ (Design System Board.html, Pages.html, Admin.html, Prototype.html байгаа project) шууд paste хийнэ. Энэ нь миний дүгнэлтээс гарсан design түвшний бүх засвар/нэмэлтийг агуулсан.

---

```text
Одоо байгаа design файлууд (Design System Board.html, Pages.html, Admin.html, Prototype.html)
дээр дараах засвар, нэмэлтүүдийг хий. Бүхэлд нь redesign ХИЙХГҮЙ — одоогийн style
(warm off-white background, near-black primary, terracotta accent, Roboto, compact premium
density) яг хэвээр үлдэнэ. Шинэ өнгө, шинэ font size system зохиохгүй, одоогийн token-уудаа
ашиглана. Бүх UI copy монголоор.

1. TYPOGRAPHY — 2 SCALE
Design System Board дээр typography-г 2 scale болго:
- App/Admin scale: одоогийн 12px base хэвээр (dashboard, create form, admin, editor).
- Guest/Marketing scale: landing page болон public invite page-д body 14–15px,
  line-height 1.55–1.6. Кирилл текстэнд letter-spacing tightening хэрэглэхгүй.
Pages.html-ийн landing болон public invite page-ийн body текстүүдийг энэ scale-аар шинэчил.

2. RSVP BOTTOM SHEET (public invite page)
Одоогийн Ирнэ/Ирэхгүй 2 товчтой sheet-ийг дараах form болго:
- Нэр (required input)
- Ирэх эсэх: Ирнэ / Ирэхгүй / Магадгүй (segmented control, required)
- Хэдэн хүн ирэх (зөвхөн "Ирнэ" сонгоход гарна, stepper, default 1)
- Тайлбар (optional textarea)
- Илгээх button + амжилттай илгээсний дараах success state
Validation error state-ийг мөн харуул.

3. INVALID / EXPIRED LINK STATE
Public invite page-д зориулсан тусдаа error state page design хий:
"Урилга олдсонгүй эсвэл хүчингүй болсон" — цэвэрхэн, илүүдэлгүй, invites.mn footer-тэй.

4. ARCHIVED STATUS
- Design System status badges дээр archived (muted/neutral) badge нэм.
- Dashboard invite row action menu-д "Архивлах" нэм, filter tabs дээр
  Бүгд / Ноорог / Нийтэлсэн / Архив tab нэм.
- Архивлагдсан урилгын public link нээхэд гарах "Урилга хүчингүй болсон" state-ийг
  3-р заалтын error state-тэй ижил pattern-аар хий.

5. SLUG AVAILABILITY STATES
Create flow-ийн Нийтлэх step дээр slug input-ийн доор 4 state design хий:
- Шалгаж байна (жижиг spinner)
- Боломжтой (success хэлбэр)
- Аль хэдийн ашиглагдсан (error + санал болгох хувилбар)
- Буруу тэмдэгт (error + дүрэм тайлбар)

6. GUEST MANAGEMENT PAGE (шинэ page: /invites/[id]/edit доторх "Зочид" хэсэг)
Pages.html-д шинэ page нэм:
- Дээд хэсэгт summary stats: Нийт зочид / Ирнэ / Ирэхгүй / Магадгүй / Хүлээгдэж буй
- Desktop: GuestTable — Нэр, Email, Утас, RSVP badge, Илгээлт badge, Actions
  (Илгээх/Дахин илгээх, Линк хуулах, Засах, Устгах)
- Mobile: GuestCard list хэлбэр
- "Зочин нэмэх" button + add/edit guest modal (нэр, email, утас, тэмдэглэл)
- Сонгосон зочдод bulk "Урилга илгээх" bar
- Empty state: "Зочин нэмээгүй байна"

7. DELIVERY STATUS BADGES
Design System status badges дээр нэм:
- Илгээгээгүй (neutral) / Илгээж байна (info + жижиг spinner dot) /
  Илгээсэн (success) / Амжилтгүй (danger)

8. PERSONALIZED GUEST VIEW (/g/[token])
Public invite page-ийн variant: дээд хэсэгт "Эрхэм хүндэт [Зочны нэр]" гэсэн жижиг
premium мэндчилгээ, RSVP sheet дээр нэр нь урьдчилан бөглөгдсөн байна.

9. ADMIN DELIVERY LOGS PAGE (шинэ admin page: /admin/delivery-logs)
Admin.html-д нэм:
- Table: Зочин, Урилга (thumbnail+нэр), Provider, Status badge, Илгээсэн цаг,
  Message ID, Алдааны мессеж
- Filters: status, огнооны хязгаар, хайлт
- Failed мөр дээр дарахад алдааны дэлгэрэнгүй expand болно
- Loading / empty / error states

10. EMAIL TEMPLATE DESIGN
Зочинд очих урилгын email-ийн mobile-first design хий:
- Template thumbnail, event нэр, огноо/цаг, байршил
- "Урилга нээх" CTA button (terracotta)
- Доор жижиг: "Энэ урилгыг invites.mn дээр үүсгэсэн"
- Энгийн, нэг баганатай, email-safe layout

11. EDITOR LOCK LABEL
Admin template editor дээр lock action-ы нэрийг "Байрлал түгжих" болго,
tooltip: "Canvas дээр зөөх/хэмжээ өөрчлөхийг хаана. Тохиргоог засах боломжтой хэвээр."

12. COMPONENT MAP UPDATE
Admin.html-ийн component map / handoff table-д шинэ component-уудыг нэм:
GuestTable, GuestCard, GuestFormModal, DeliveryStatusBadge, SendInviteBar,
DeliveryLogTable, GuestGreetingHeader, EmailInviteTemplate, ArchivedBadge,
SlugAvailabilityHint, InvalidLinkState.

Дууссаны дараа: өөрчилсөн/нэмсэн хэсгүүдийн жагсаалт, ашигласан өнгөний hex утгууд
(token бүрээр), шинэ component-уудын нэрсийг товч гаргаж өг.
```

---

## Design update дууссаны дараа хийх зүйл

1. Claude Design-ы гаргасан **hex token утгуудыг** `docs/03-design-system.md`-ийн color tokens-тэй тулга — зөрвөл docs-ийг бодит утгаар шинэчил (components биш, зөвхөн token файл өөрчлөгдөнө).
2. Шинэ component нэрс гарвал `docs/04-architecture.md`-ийн component map-д нэм.
3. Дараа нь Phase 1 prompt-оор code ажил эхэлнэ (`08-claude-code-prompts.md`).
