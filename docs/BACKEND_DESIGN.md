# Backend data model and Bonum payment contract

> Status: implementation design. This document deliberately does not assume an
> unverified Bonum endpoint, field name, or signature format. Confirm those
> details against the merchant API agreement before enabling production payments.

## Architecture boundary

The product has two React clients (`client` and `app`) and one server-side API
boundary. Browser code must never call Bonum with a secret, decide payment
success, or write an `active` invitation directly. The API owns PostgreSQL,
authentication checks, signed payment creation, callback verification, and
state transitions.

Recommended persistence: PostgreSQL (Supabase is suitable), object storage for
invitation media, and a server-side job runner/queue for webhook retries and
notifications. Store all timestamps as `timestamptz` in UTC and money as
integer `amount_mnt` (MNT's minor unit is zero).

## Core entities

| Entity | Essential columns | Notes |
| --- | --- | --- |
| `users` | `id uuid pk`, `phone_e164 unique nullable`, `email unique nullable`, `google_subject unique nullable`, `display_name`, `role`, `status`, `created_at` | Require either phone or Google subject. Phone values are normalized to `+976...`; never use a raw number as an identifier. |
| `auth_identities` | `id`, `user_id`, `provider`, `provider_subject`, `verified_at`, `created_at` | `unique(provider, provider_subject)` supports Google and future providers without widening `users`. |
| `otp_challenges` | `id`, `phone_e164`, `code_hash`, `expires_at`, `consumed_at`, `attempt_count`, `send_count`, `last_sent_at`, `ip_hash`, `created_at` | No plaintext code or SMS body. Short-lived, then prune/retain only aggregate audit evidence. |
| `sessions` | `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`, `ip_hash`, `user_agent_hash`, `created_at` | Prefer Supabase Auth session management; this table is only needed for custom sessions. |
| `templates` | `id`, `slug unique`, `name`, `category`, `status`, `version`, `definition jsonb`, `preview_asset_id`, `created_by`, `published_at` | `definition` is a validated, versioned block schema—never arbitrary executable HTML/JS. |
| `template_versions` | `id`, `template_id`, `version`, `definition jsonb`, `change_note`, `created_by`, `created_at` | `unique(template_id, version)` keeps invitations visually reproducible after a template changes. |
| `products` | `id`, `code unique`, `name`, `amount_mnt`, `currency`, `template_id nullable`, `features jsonb`, `status` | Sell an invitation tier/add-on; price is authoritative on the server. |
| `invitations` | `id`, `owner_id`, `template_version_id`, `slug unique`, `status`, `content jsonb`, `published_at`, `expires_at`, `created_at`, `updated_at` | `content` is validated against that template version. Status: `draft`, `pending_payment`, `active`, `paused`, `expired`, `archived`. |
| `invitation_access` | `id`, `invitation_id`, `kind`, `token_hash nullable`, `expires_at`, `created_at` | Supports public URL and optional protected/private invitations. Store only a hash of a private access token. |
| `guests` | `id`, `invitation_id`, `name`, `phone_e164 nullable`, `email nullable`, `party_size`, `metadata jsonb`, `created_at` | `unique(invitation_id, phone_e164)` when phone exists; limit PII and restrict owner/admin access. |
| `rsvps` | `id`, `guest_id nullable`, `invitation_id`, `response`, `party_size`, `comment`, `responded_at` | One response per guest or anonymous response token; responses: `pending`, `attending`, `declined`. |
| `media_assets` | `id`, `owner_id`, `storage_key unique`, `mime_type`, `byte_size`, `sha256`, `status`, `created_at` | Upload through signed, content-type/size restricted URLs; malware scan before `ready`. |
| `orders` | `id`, `user_id`, `invitation_id`, `status`, `currency`, `subtotal_mnt`, `discount_mnt`, `total_mnt`, `idempotency_key`, `expires_at`, `created_at`, `paid_at` | Server calculates price from `products`; `unique(user_id, idempotency_key)`. |
| `order_items` | `id`, `order_id`, `product_id`, `product_snapshot jsonb`, `quantity`, `unit_amount_mnt`, `total_amount_mnt` | Immutable purchase snapshot prevents later price edits altering history. |
| `payment_attempts` | `id`, `order_id`, `provider`, `merchant_reference unique`, `provider_payment_id unique nullable`, `amount_mnt`, `currency`, `status`, `checkout_url`, `provider_payload jsonb`, `expires_at`, `created_at`, `completed_at` | An order can have multiple attempts; only one can settle it. |
| `payment_webhook_events` | `id`, `provider`, `provider_event_id nullable`, `payload_hash`, `signature_valid`, `received_at`, `processed_at`, `processing_result`, `raw_payload_encrypted` | `unique(provider, provider_event_id)` where available; otherwise unique provider + payload hash within a bounded replay window. |
| `audit_logs` | `id`, `actor_user_id nullable`, `action`, `entity_type`, `entity_id`, `request_id`, `ip_hash`, `metadata jsonb`, `created_at` | Append-only record for payment, publishing, admin edits and auth-sensitive actions. |

## Relationships and authorization

`users 1:N invitations`; `templates 1:N template_versions`; an invitation pins
exactly one template version. `invitations 1:N guests/rsvps/orders`; `orders
1:N order_items/payment_attempts`; `payment_attempts 1:N payment_webhook_events`.

Apply row-level security to every user-owned table. A user may only select or
mutate invitations, assets, guests, RSVP exports and orders they own. Public
read access is a narrowly scoped security-definer function/view that returns
only a published, non-expired invitation and its public fields. Admin access
requires a server-verified role, not a client-provided claim.

## Payment state machine

```text
order: created -> pending -> paid
                  |          -> refunded (future)
                  -> expired | cancelled | failed

attempt: created -> checkout_created -> pending -> succeeded
                           |                 -> failed | expired | cancelled
                           -> creation_failed

invitation: draft -> pending_payment -> active
                    |                  -> paused/expired/archived
                    -> draft (cancelled or expired unpaid order)
```

Only a verified, server-to-server payment confirmation may transition an order
to `paid`, an attempt to `succeeded`, and the invitation to `active`. A browser
return URL is display-only: it queries the server for status and can never
claim success.

## Bonum adapter contract

Implement a `PaymentProvider` interface so the rest of the product is isolated
from Bonum-specific naming:

```ts
type CreateCheckout = {
  merchantReference: string; // payment_attempts.merchant_reference (UUID/ULID)
  amountMnt: number;
  description: string;
  returnUrl: string;
  callbackUrl: string;
  expiresAt: string;
  customer?: { phoneE164?: string; email?: string };
};

type PaymentProvider = {
  createCheckout(input: CreateCheckout): Promise<{
    providerPaymentId: string;
    checkoutUrl: string;
    raw: unknown;
  }>;
  verifyWebhook(input: { headers: Headers; rawBody: Uint8Array }): Promise<{
    verified: boolean;
    eventId?: string;
    merchantReference: string;
    providerPaymentId?: string;
    status: 'succeeded' | 'failed' | 'cancelled' | 'pending';
    amountMnt: number;
    currency: 'MNT';
    occurredAt?: string;
    raw: unknown;
  }>;
  fetchPayment?(providerPaymentId: string): Promise<{
    status: 'succeeded' | 'failed' | 'cancelled' | 'pending';
    amountMnt: number;
    currency: 'MNT';
  }>;
};
```

Configuration is server-only: `BONUM_MERCHANT_ID`, `BONUM_API_KEY`/secret,
`BONUM_WEBHOOK_SECRET`, base URL and allowed return URL. Keep them in managed
secrets, never in `VITE_*`, `NEXT_PUBLIC_*`, source control, browser logs, or
unredacted event payloads. Rotate secrets and revoke old keys after any leak.

### Checkout creation

1. Authenticate the owner and validate the invitation is `draft` or has an
   eligible unpaid order.
2. Load product prices on the server; calculate MNT totals and create an order
   plus attempt in one transaction. Require a client idempotency key.
3. Generate a cryptographically random `merchant_reference`; it must not expose
   sequential order IDs or personal data.
4. Send Bonum the exact amount, reference, signed callback URL and an allowlisted
   return URL. Persist the provider payment ID and hosted checkout URL.
5. Redirect to the hosted Bonum URL. Do not collect card/payment credentials.

### Webhook verification and idempotency

The callback handler must read the untouched raw request body before JSON
parsing, enforce HTTPS, and verify Bonum's documented signature using constant-
time comparison. Validate timestamp freshness if Bonum supplies one, then:

1. Persist a webhook receipt with its provider event ID/payload hash in a short
   transaction. A duplicate unique-key conflict returns HTTP 200 without doing
   any second state transition.
2. Locate the attempt by merchant reference, then compare provider payment ID,
   currency and amount against the stored attempt. Reject mismatches.
3. For a success signal, optionally call Bonum's authoritative payment-status
   endpoint when supported, especially when the signature/checksum protocol is
   ambiguous or payment is high value.
4. Lock the order (`SELECT ... FOR UPDATE`), transition only from an allowed
   state, mark the attempt/order paid, activate the invitation, and append an
   audit row in the same transaction.
5. Mark the receipt processed. Return a quick 2xx only after durable handling;
   retry transient failures with a queue. Alert on signature, amount, or state
   mismatches.

Never trust amount, order ID, status, customer identity, redirect parameters,
or `X-Forwarded-*` supplied by a browser. Rate-limit the webhook endpoint only
in a way that allows the payment provider's documented retry behavior.

## Security baseline

- Enforce HTTPS, HSTS, secure/HttpOnly/SameSite cookies, CSRF protection for
  cookie-authenticated mutations, strict CORS allowlists, CSP and security
  headers.
- Validate all JSON with server schemas (Zod/Valibot), use parameterized SQL,
  escape invitation text, and sanitize any rich text. Never render user HTML.
- OTP: six+ random digits, hashed with a slow password hash, five-minute TTL,
  single use, attempt/send/IP/phone limits, resend cooldown, and generic error
  messages to prevent enumeration. Use a direct Mongolian SMS provider behind
  an adapter; Google sign-in remains a zero-SMS-cost path.
- Validate Google ID tokens server-side: issuer, audience, signature, expiry,
  nonce and `email_verified`. Bind identities by provider subject, not email.
- Use signed upload URLs with owner-bound paths, MIME/size limits, image
  processing, malware scanning and private-by-default storage.
- Encrypt sensitive provider payloads at rest or redact them; do not store card
  data, OTP codes, access tokens, raw phone numbers in logs, or payment secrets.
- Add per-route rate limits, request IDs, dependency timeouts, structured
  redacted logs, backups, and monitoring for payment/OTP anomalies.

## Required pre-production evidence

Before enabling payments, obtain Bonum's current merchant API document and
sandbox credentials, then record: exact checkout request/response fields,
signature algorithm and canonical string, webhook source/IP policy, retry and
acknowledgement behavior, reconciliation/status API, refund flow, and test card
or sandbox cases. Write contract tests for valid, duplicate, stale, invalid
signature, wrong amount/currency, out-of-order, and retry webhooks.
