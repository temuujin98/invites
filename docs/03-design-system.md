# 03 — Design System

Эх сурвалж: батлагдсан **Design System Board.html**. Энэ doc нь code implementation-ы spec.

## Visual direction

- Premium but simple, invitation/event-focused
- Warm off-white background, near-black primary, violet accent (#8B5CF6 — Design System Board дээр баталгаажсан)
- Compact density, цэвэрхэн hierarchy, soft but clear contrast
- ХОРИГЛОНО: random gradients, excessive glassmorphism, oversized headings, олон font size, inconsistent shadow/radius, over-animation, generic AI SaaS харагдац

## Color tokens (CSS variables, `app/globals.css`)

```css
:root {
  /* Design System Board.html дээр баталгаажсан бодит утгууд (2026.06) */
  --bg: #F8F7F4;            /* warm off-white page background */
  --surface: #FFFFFF;        /* cards, panels */
  --surface-soft: #EEEAE5;   /* muted secondary surfaces, hover fills */
  --border: #E5E1DB;         /* muted borders */

  --text: #1F1D1A;           /* primary text */
  --text-secondary: #6D6762;
  --text-muted: #9E9891;

  --primary: #2A2725;        /* primary buttons / near-black */
  --primary-hover: #1A1816;

  --accent: #8B5CF6;         /* violet */
  --accent-hover: #7C3AED;
  --accent-soft: #F3EEFE;

  --success: #3B8A5A; --success-soft: #EFF8F2;
  --warning: #C49234; --warning-soft: #FDF8EE;
  --danger:  #C4443A; --danger-soft:  #FDF0EF;

  --focus-ring: rgba(139, 92, 246, 0.35);
}
```

Тэмдэглэл: design system-д тусдаа `info` token БАЙХГҮЙ — info шинжтэй state-үүд (`maybe`, `sending`) `accent` / `accent-soft`-ийг ашиглана. Шинэ өнгө зохиохгүй.

Tailwind: tokens-ийг `tailwind.config.ts` дотор `colors`/`borderRadius`/`boxShadow` болгож map хийнэ. Hardcoded hex-ийг component дотор бичихгүй.

## Typography

Font: **Roboto** (`next/font/google`, subsets: `latin`, `cyrillic`). Weights: 400 / 500 / 700.

### App/Admin scale (dashboard, editor, admin, forms)

| Token | Size / LH | Хэрэглээ |
|---|---|---|
| `text-page-title` | 22–28px / 1.25, w700 | Page titles |
| `text-section` | 16–20px / 1.3, w600 | Section titles |
| `text-body` | 12px / 1.5, w400 | Main body |
| `text-secondary` | 11px / 1.45 | Secondary, meta |
| `text-label` | 11px / 1.3, w500 | Form labels, table headers |

### Guest/Marketing scale (landing, `/i/`, `/g/`)

Body 14–15px / 1.55–1.6. Hero/heading-үүд template болон page design-аар. Cyrillic-д letter-spacing tightening хийхгүй.

## Spacing

Scale: `4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 72`.
- Dashboard section gap: 16–24px
- Card inner padding: 16px (compact) / 20px
- Mobile horizontal page padding: 16px

## Radius

| Token | Value | Хэрэглээ |
|---|---|---|
| `rounded-ctrl` | 8px | Buttons, inputs, chips, small controls |
| `rounded-card` | 12px | Cards, table containers |
| `rounded-card-lg` | 16px | Feature/template cards |
| `rounded-panel` | 20px | Large panels, modals |
| `rounded-xl-panel` | 28px | Phone preview frame, hero compositions |

## Shadows

Зөвхөн 3 түвшин — өөр shadow зохиохгүй:

```css
--shadow-sm: 0 1px 2px rgba(28,27,26,.05);
--shadow-md: 0 4px 12px rgba(28,27,26,.08);
--shadow-lg: 0 12px 32px rgba(28,27,26,.12); /* modals, popovers only */
```

## Component states

Бүх interactive component: `default / hover / active / focus-visible / disabled / loading`. Data view бүр: `loading (skeleton) / empty (EmptyState) / error (ErrorState)`. Focus: 2px ring `--focus-ring`, outline-ийг хэзээ ч бүрэн арилгахгүй.

## Buttons

Variants: `primary` (near-black bg) · `accent` (violet) · `secondary` (surface + border) · `ghost` · `danger` · `icon`.
Sizes: `sm` 28px · `md` 34px · `lg` 40px height. Radius 8px. Loading үед spinner + disabled.

## Status badge mapping

| Status | Style |
|---|---|
| draft | neutral (surface-soft + text-secondary) |
| published | success-soft + success |
| archived | muted |
| pending | warning-soft |
| accepted | success-soft |
| declined | danger-soft |
| maybe | accent-soft + accent |
| not_sent | neutral |
| sending | accent-soft + pulse dot |
| sent | success-soft |
| failed | danger-soft |

## Motion (Framer Motion)

Subtle only:
- Page/section fade-slide: 8–12px, 150–200ms, ease-out
- Modal/sheet: scale 0.98→1 + fade, 180ms
- Toast: slide-up + fade
- Hover дээр layout-shift хийхгүй; list дээр stagger ≤ 40ms
- ХОРИГЛОНО: parallax, continuous loops, bounce, page-wide transitions
- `prefers-reduced-motion` дэмжинэ

## Локалчлал helpers (`lib/format.ts`)

- Date: `2026.06.10` · DateTime: `2026.06.10 · 18:00` · Гараг: Да/Мя/Лх/Пү/Ба/Бя/Ня (бүтэн: Даваа...)
- Утас: `9911-2233` формат
- Бүх UI copy монголоор; key-based copy file шаардлагагүй (i18n V1-д хийхгүй), гэхдээ давтагддаг copy-г `lib/copy.ts` constants болгоно.
