# invites.mn — Project Plan

## Product goal

Монгол хэрэглэгч хэдхэн алхмаар хурим, төрсөн өдөр, байгууллагын арга хэмжээний цахим урилга үүсгэж, Bonum-аар төлбөр төлөн, холбоос эсвэл QR-ээр тараадаг платформ.

## Architecture

```text
client/  → Public brand site and published invitation pages
app/     → Authenticated creator dashboard and role-based admin studio
API      → Separate server-side service (next phase): auth, invitations, payments, webhooks
Postgres → users, templates, invitations, guests, RSVP, payments, audit events
Storage  → invitation images/video and template assets
```

The initial build is React + Vite + Tailwind CSS. Each site is independently deployable. Shared API contracts and security policies are kept server-side; browser bundles never contain payment or SMS secrets.

## MVP user flow

1. Sign in with Google or enter a Mongolian phone number.
2. Verify a one-time code, then choose a template.
3. Enter event details, customise sections, preview and buy.
4. Payment callback is verified server-side before publishing.
5. Share a public URL and QR; guests respond through RSVP.

## OTP decision

Unelgui.mn’s implementation is not publicly documented, so its provider cannot be confirmed responsibly. For low volume, the lowest operational-cost option is **Google sign-in first**, with phone OTP offered only when needed. For phone OTP, contract directly with a Mongolian SMS provider (Unitel Business SMS is the first commercial option to quote) instead of using an international aggregator. International public rates are roughly USD 0.19–0.35 per outbound Mongolian SMS, so they should be the fallback rather than default.

The OTP interface will be provider-agnostic: `requestOtp()` / `verifyOtp()` server endpoints. Required controls: E.164 normalisation (+976), six-digit crypto-random code, hashed code at rest, 5-minute expiry, single-use, 3 verification attempts, resend cooldown, IP + phone rate limits, and audit events. Never disclose whether a phone number already has an account.

Sources: [Unitel Business SMS](https://www.unitel.mn/business/product/sms), [Plivo Mongolia SMS pricing](https://www.plivo.com/sms/pricing/mn/), [Verify.mn OTP API](https://www.verify.mn/).

## Security baseline

- Use server-side OAuth/OTP callbacks with PKCE, state and nonce validation.
- Store session tokens in `HttpOnly`, `Secure`, `SameSite=Lax` cookies; rotate sessions and enforce CSRF protection for mutations.
- Validate all inputs with a shared schema; authorize every invitation/template/payment by ownership and role.
- Verify Bonum webhook signature, timestamp and payment amount server-side; make webhook handling idempotent.
- Apply CSP, HSTS, X-Content-Type-Options, Referrer-Policy and strict CORS allowlists at the API edge.
- Rate-limit sign-in, OTP, RSVP, payment initiation and upload endpoints; malware-scan uploads and use short-lived signed URLs.
- Keep secrets server-only in the deployment vault. Never expose them with a `VITE_` prefix.
- Keep immutable audit trails for admin changes and payment transitions; minimise personal-data retention.

## Design direction

Distinct from the reference: a dark editorial canvas, Montserrat type, violet `#8B5CF6`, oversized Mongolian copy, glass cards and kinetic type. The hero’s invitations rotate in a 3D carousel; motion stays purposeful and supports reduced-motion settings.

## Integration milestones

1. Frontend scaffold and brand landing (current).
2. Supabase schema, Google auth, OTP provider adapter.
3. Invitation editor, public RSVP and QR delivery.
4. Flexible admin template composer with versioning.
5. Bonum sandbox integration, verified webhooks, reconciliation.
6. Security review, accessibility, load testing and production launch.
