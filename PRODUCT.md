# PRODUCT.md — Invites.mn

## Register

Dual-register product:

- **Brand** — the public landing page (`client/src/App.jsx`). Design IS the product here: Kinetic brutalist, drenched brand purple, giant Cyrillic display type.
- **Product** — the Creator Studio (`app/src/CreatorApp.jsx`, served at `/studio`) and the guest invitation view (`/i/:slug`). Design SERVES the task: create, publish, and track digital invitations.

## Target users

Mongolian event hosts — couples planning weddings, people organizing birthdays, anniversaries, graduations, and companies running receptions. Mobile-first guests; desktop-or-mobile creators. All UI copy is Mongolian Cyrillic (see `mongolian-content` conventions).

## Purpose

Let anyone build a beautiful digital invitation in ~3 minutes, share it as a single link, and collect RSVPs in real time. Free to start.

## Brand personality

Loud, kinetic, confident, technical. High-contrast brutalism: brand purple `#8b5cf6`, solid black, pure white. No gradients on chrome (invitation-template previews are the one exception — they are product content, not chrome). No soft shadows, no glassmorphism, no pastels.

## Anti-references

- Soft SaaS cream/pastel dashboards
- Glassmorphism and blurred gradient glows
- Generic template-marketplace aesthetics

## Strategic design principles

1. **One system, two volumes.** The landing shouts (drenched purple, 23vw type); the studio speaks (same tokens, calmer hierarchy — purple field, white work panels, black chrome).
2. **Cyrillic-first typography.** Montserrat (Black 900 for display) + JetBrains Mono for labels/metadata. Never use display fonts that lack Cyrillic.
3. **The invitation is the hero.** Studio chrome stays monochrome + purple so the invitation card previews (lavender/coral/sage/gold gradients) carry the color.
4. **Task speed over spectacle.** Studio motion is 150–250ms state feedback only; no load choreography.
