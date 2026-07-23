# DESIGN.md — Invites.mn Kinetic system

## Theme

Kinetic brutalist. Three colors, hard edges, heavy type.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--k-brand` | `#8b5cf6` | Primary field (landing bg, studio bg), accent states |
| `--k-black` | `#000000` | Chrome: nav, sidebar, buttons, borders, display text |
| `--k-white` | `#ffffff` | Work surfaces, text on black |

Selection: black background, purple text. Invitation-template gradients (lavender `#f1d8ff→#8560ef`, coral, sage, gold, rose, ocean, midnight) are product content only — never chrome.

## Typography

- **Display**: Montserrat Black (900), uppercase, letter-spacing -0.04em, line-height 0.88. Landing hero up to 23vw; studio headings fixed rem scale (h1 ~2.4rem).
- **Labels / metadata**: JetBrains Mono, 11–13px, uppercase, letter-spacing -0.02em.
- **Body**: Montserrat 400/600.
- All faces self-hosted in `client/src/assets/fonts/` (Cyrillic-capable only).

## Shape & borders

- 2px solid black borders for structural dividers, panels, buttons.
- Sharp corners everywhere **except** pill-shaped buttons/nav (border-radius 999px).
- No drop shadows (nav pill depth shadow is the one exception), no gradients on chrome.

## Motion

- Landing: linear marquees (24–34s), 12s rotating scroll badge, hover translate/scale.
- Studio: 150–250ms ease-out state transitions only.
- Every animation disabled under `prefers-reduced-motion`.

## Layout

- Landing: full-width stacked sections, -2deg skewed black marquee band, floating black pill nav.
- Studio: black sidebar (254px) + purple main field; content sits on white 2px-black-bordered panels.
- Guest view (`/i/`): dark theme with glowing invitation card (kept from prior system — it serves the invitee, not the brand).
