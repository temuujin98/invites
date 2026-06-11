# 01 — Product Overview

## Нэг өгүүлбэрээр

**Invite** нь Монгол хэрэглэгчдэд зориулсан digital invitation platform: designer-ийн Canva дээр бэлдсэн background дээр admin editable талбаруудыг тохируулж, хэрэглэгч зөвхөн form бөглөөд premium урилга үүсгэн, public link / QR-аар хуваалцаж, RSVP цуглуулдаг систем.

## Core flow

```
Designer creates design in Canva → exports PNG/JPG/MP4
→ Admin uploads background, defines editable fields, publishes template
→ User chooses template, fills generated form, uploads photo
→ Live preview updates → User publishes
→ Public share link + QR created
→ Guest opens mobile invite → RSVP / map / calendar / share
→ (Phase G) User manages guest list, sends personalized email invites, tracks delivery
```

## Positioning

3 product-ийн огтлолцол:

1. **Template marketplace** — designer-created premium templates
2. **Guided invitation builder** — form бөглөдөг, design tool биш
3. **Public event invite page** — mobile-first guest experience

Canva clone БИШ. Бүрэн event management system БИШ.

## Target users

- Хосууд — хуримын урилга
- Гэр бүл — төрсөн өдөр, baby shower, төгсөлт
- Компани — corporate event, нээлтийн ёслол
- Event organizer — зочид болон RSVP удирдах

## Template categories (анхны багц)

Birthday · Wedding · Corporate event · Graduation · Baby shower · Opening ceremony

## Product-ийн чанарын шаардлага

- Premium, цэвэрхэн, compact UI — generic AI SaaS шиг харагдахгүй
- Mobile-first — guest experience 100% утсан дээр
- Монгол хэл first-class: бүх UI copy монголоор, Cyrillic typography зөв
- Production-ready, mockup-like биш

## Scope-ийн 2 түвшин (D1 decision-ыг үз: `02-decisions.md`)

**Core (MVP):**
- Template discovery → create flow → publish → public link → anonymous RSVP
- User dashboard (өөрийн урилгууд)
- Admin: templates, categories, assets, user invites

**Phase G (Guest & Delivery):**
- Guest list (нэр, email, утас, тэмдэглэл)
- Per-guest tokenized links
- Email delivery via Resend, delivery statuses + logs
- Per-guest RSVP tracking

Schema нь эхнээсээ хоёуланг нь дэмжинэ — дараа breaking migration гарахгүй.

## Statuses (баталгаажсан)

- Invitation: `draft` | `published` | `archived`
- Template: `draft` | `published`
- Guest RSVP: `pending` | `accepted` | `declined` | `maybe`
- Delivery: `not_sent` | `sending` | `sent` | `failed`
