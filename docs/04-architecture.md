# 04 — Architecture

## Tech stack

Next.js App Router · TypeScript (strict) · Tailwind CSS · Supabase (Auth/DB/Storage) · Resend · Framer Motion · Zod

## Route map

```
app/
  (public)/                         # CLIENT — нэвтрээгүй хэрэглэгч + зочин
    page.tsx                        # Landing
    templates/page.tsx              # Template listing
    templates/[slug]/page.tsx       # Template detail
    i/[shareSlug]/page.tsx          # Public invite (guest view)
    g/[token]/page.tsx              # Phase G: personalized guest link
    login/page.tsx  register/page.tsx  forgot-password/page.tsx
  (app)/                            # CLIENT — нэвтэрсэн хэрэглэгчийн апп
    dashboard/page.tsx              # My invites
    create/[templateSlug]/page.tsx  # 4-step create flow (?step=...)
    invites/[id]/edit/page.tsx
    invites/[id]/guests/page.tsx    # Phase G
  admin/                            # ADMIN panel
    page.tsx
    templates/page.tsx
    templates/new/page.tsx
    templates/[id]/edit/page.tsx    # Template editor (centerpiece)
    categories/page.tsx
    invites/page.tsx
    assets/page.tsx
    delivery-logs/page.tsx          # Phase G
  api/                              # API — route handlers
    slug-check/route.ts
    rsvp/route.ts
    invites/[id]/send/route.ts      # Phase G
    ics/[slug]/route.ts
  dev/components/page.tsx           # Component showcase (Phase 1)
```

Route groups `(public)` / `(app)` нь URL-д нөлөөлөхгүй, зөвхөн layout + кодын цэгцэнд: `(public)` нь PublicHeader/Footer layout-тай, `(app)` нь DashboardShell + auth guard-тай, `admin` нь AdminShell + role guard-тай. Ингэснээр **client / admin / api** гэсэн логик тусгаарлалт нэг Next.js app дотор цэвэрхэн гарна.

Server components default. `"use client"` зөвхөн interactivity хэрэгтэй leaf component-уудад.

## Folder structure

```
lib/
  supabase/server.ts        # server client (cookies)
  supabase/client.ts        # browser client (anon)
  supabase/admin.ts         # service-role client — server-only, import "server-only"
  validation/*.ts           # Zod schemas
  format.ts  copy.ts  constants.ts  tokens.ts
types/
  template.ts  invite.ts  guest.ts  database.ts (generated)
components/
  ui/        # primitives: Button, Input, Select, DateInput, TimeInput, Textarea,
             # SearchInput, Checkbox, Toggle, Badge, Tabs, Stepper, Pagination,
             # Toast, Tooltip, DropdownMenu, Modal, ConfirmDialog, Drawer, Skeleton
  shared/    # AppShell, PublicHeader, PublicFooter, AuthLayout, DashboardShell,
             # AdminShell, Sidebar, Topbar, PageHeader, SectionHeader, StatsCard,
             # EmptyState, LoadingState, ErrorState, DataTable, FilterTabs,
             # FileUpload, ImageCropUpload, ActionMenu
  invite/    # TemplateCard, EventTypeCard, InviteCard, ShareLinkCard, QRPreview,
             # PreviewFrame, PhonePreviewFrame, InviteRenderer, GeneratedInviteForm,
             # RSVPSheet, RSVPBadge, StatusBadge, DeliveryStatusBadge,
             # GuestTable, GuestCard
  editor/    # TemplateEditorShell, TemplateSettingsPanel, TemplateCanvas,
             # TemplateCanvasField, CanvasToolbar, LayerList, LayerItem,
             # FieldSettingsPanel, SafeAreaGuide, AssetCard, AViewToggle
```

Дүрэм: page файл UI pattern давтахгүй — заавал эдгээрээс reuse.

## Core: FieldConfig renderer

### Types (`types/template.ts`)

```ts
export type FieldType = "text" | "date" | "time" | "location" | "image" | "qr" | "rsvp" | "custom";

export interface TemplateFieldConfig {
  id: string;
  key: string;              // event_title, host_name, ...
  label: string;            // Монгол label — user form дээр гарна
  placeholder?: string;
  type: FieldType;
  required: boolean;
  x: number; y: number; width: number; height: number;  // canvas px
  fontFamily?: string; fontSize?: number; fontWeight?: number;
  lineHeight?: number; maxChars?: number;
  color?: string; align?: "left" | "center" | "right";
  borderRadius?: number; objectFit?: "cover" | "contain";
  visible: boolean; locked: boolean; layerOrder: number;
}

export interface InviteTemplate {
  id: string; name: string; slug: string; categoryId: string;
  type: "image" | "video";
  backgroundUrl: string; thumbnailUrl: string;
  canvasWidth: number; canvasHeight: number;   // ж: 1080 × 1920
  status: "draft" | "published";
  fields: TemplateFieldConfig[];
}

export type InviteValues = Record<string, { text?: string; assetUrl?: string }>;
```

### `<InviteRenderer />` contract

```ts
interface InviteRendererProps {
  template: InviteTemplate;
  values: InviteValues;
  mode: "editor" | "preview" | "public";
  selectedFieldId?: string;            // editor only
  onFieldSelect?: (id: string) => void; // editor only
  showSampleData?: boolean;            // editor only
}
```

Renderer rules (D3):
- Container width-ээс `scale = containerWidth / template.canvasWidth`
- Бүх x/y/w/h/fontSize/lineHeight/borderRadius scale-ээр үржинэ
- `aspect-ratio: canvasWidth / canvasHeight` container
- Field render order = `layerOrder`; `visible=false` → render хийхгүй
- `mode="editor"` үед selection box, drag/resize handles wrapper нэмэгдэнэ (handles нь editor package-д, renderer цэвэр үлдэнэ)
- Value байхгүй үед: editor → placeholder/sample, public → field нуух (required биш бол)

### `<GeneratedInviteForm />`

`template.fields`-ээс form автоматаар үүснэ: field type → input mapping (`text→Input`, `date→DateInput`, `time→TimeInput`, `location→Input+map link`, `image→ImageCropUpload`). Zod schema мөн fields-ээс dynamic build хийнэ. Бичих бүрт preview live update (controlled state, debounce шаардлагагүй).

## API surface (route handlers)

| Route | Үүрэг |
|---|---|
| `POST /api/slug-check` | Debounced slug availability (D6) |
| `POST /api/rsvp` | Public RSVP submit. Zod + rate limit (IP-based, simple) |
| `POST /api/invites/[id]/send` | Phase G: owner check → published check → guest ownership → email байгаа эсэх → Resend → delivery_log |
| `GET /api/ics/[slug]` | Calendar .ics |

Structured response: `{ ok: true, data } | { ok: false, code, message }`. Code-ууд: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `NOT_PUBLISHED`, `NO_EMAIL`, `INVALID_PAYLOAD`, `PROVIDER_ERROR`, `RATE_LIMITED`.

## Page-specific notes

- **Landing:** hero + phone preview composition, how it works (3 алхам), category cards, featured templates, 6-feature grid, use-case cards, final CTA. SaaS pricing-grid харагдацаас зайлсхий.
- **Create flow:** desktop — form зүүн / PhonePreviewFrame баруун sticky; mobile — top stepper + progress line + collapsible preview.
- **Editor:** 3-panel (settings / canvas / layers+field settings); mobile — Тохиргоо/Canvas/Талбарууд tabs. Dirty-state tracking + unsaved-changes modal + publish validation (background, thumbnail, ≥1 field).
- **Public invite:** zero-chrome, template design давамгайлна; доор action bar (RSVP / Газрын зураг / Calendar / Хуваалцах); footer "invites.mn дээр үүсгэв".
