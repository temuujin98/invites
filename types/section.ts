// ── Section-based invitation model ───────────────────────────────────────────
// An invitation is an ordered vertical stack of typed sections. The admin
// defines which sections a template has (+ per-section config + theme); the user
// fills content only. Storage: templates.sections / templates.theme (JSONB) and
// invites.content (JSONB keyed by section id).

// ── Section type union ───────────────────────────────────────────────────────
export type SectionType =
  | "cover"       // hero / opening
  | "countdown"   // days/hours to the event
  | "details"     // date / time / location / dress code
  | "story"       // timeline / "our story"
  | "gallery"     // photo grid
  | "location"    // map + address + directions
  | "rsvp"        // attendance form
  | "gift"        // bank account / QR / gift note
  | "music"       // background audio (config only; playback at shell level)
  | "closing";    // thank-you / signature / share

export const SECTION_TYPES: readonly SectionType[] = [
  "cover",
  "countdown",
  "details",
  "story",
  "gallery",
  "location",
  "rsvp",
  "gift",
  "music",
  "closing",
] as const;

// ── Shared theme (applied across all sections via CSS variables) ─────────────
export type ThemeMotion = "subtle" | "none";
export type ThemeRadius = "sm" | "md" | "lg";

export interface InviteTheme {
  palette: {
    bg: string;       // page background
    surface: string;  // card / panel
    text: string;     // primary text
    accent: string;   // accent / buttons
    muted: string;    // secondary text
  };
  fonts: {
    heading: string;  // Google font family for headings
    body: string;     // Google font family for body
  };
  motion: ThemeMotion;
  radius: ThemeRadius;
}

export const DEFAULT_THEME: InviteTheme = {
  palette: {
    bg: "#F1EEE9",
    surface: "#FFFFFF",
    text: "#1F1D1A",
    accent: "#8B5CF6",
    muted: "#6D6762",
  },
  fonts: { heading: "Playfair Display", body: "Roboto" },
  motion: "subtle",
  radius: "lg",
};

// ── Per-section config (ADMIN-level) — discriminated union on `type` ─────────
interface SectionBase {
  id: string;        // crypto.randomUUID()
  type: SectionType;
  order: number;     // ascending; drives stacking
  enabled: boolean;  // admin can disable without deleting
}

export type CoverConfig = SectionBase & {
  type: "cover";
  variant: "centered" | "split" | "fullbleed";
  showScrollHint: boolean;
};
export type CountdownConfig = SectionBase & {
  type: "countdown";
  targetSource: "event_date" | "custom";
  style: "digits" | "flip";
};
export type DetailsConfig = SectionBase & {
  type: "details";
  layout: "list" | "cards";
  showCalendarButton: boolean;
};
export type StoryConfig = SectionBase & {
  type: "story";
  layout: "timeline" | "alternating";
  maxItems: number;
};
export type GalleryConfig = SectionBase & {
  type: "gallery";
  columns: 2 | 3;
  aspect: "square" | "portrait" | "auto";
  maxImages: number;
};
export type LocationConfig = SectionBase & {
  type: "location";
  provider: "google";
  showEmbed: boolean;
  showDirections: boolean;
};
export type RsvpConfig = SectionBase & {
  type: "rsvp";
  allowGuestCount: boolean;
  allowNote: boolean;
  deadline?: string; // ISO date; empty = no deadline
};
export type GiftConfig = SectionBase & {
  type: "gift";
  showBank: boolean;
  showQr: boolean;
};
export type MusicConfig = SectionBase & {
  type: "music";
  autoplay: boolean;
  loop: boolean;
};
export type ClosingConfig = SectionBase & {
  type: "closing";
  variant: "signature" | "simple";
};

export type SectionConfig =
  | CoverConfig
  | CountdownConfig
  | DetailsConfig
  | StoryConfig
  | GalleryConfig
  | LocationConfig
  | RsvpConfig
  | GiftConfig
  | MusicConfig
  | ClosingConfig;

// Narrow a SectionConfig to a specific type (helper for panels/renderers).
export type ConfigOf<T extends SectionType> = Extract<SectionConfig, { type: T }>;

// ── Content schema descriptor (drives the dynamic create-flow form) ──────────
export type ContentFieldKind =
  | "text"
  | "longtext"
  | "date"
  | "time"
  | "location"
  | "image"
  | "imageList"
  | "audio"
  | "keyValueList";

export interface ContentField {
  key: string;          // e.g. "coupleNames", "photos"
  label: string;        // Mongolian
  kind: ContentFieldKind;
  required: boolean;
  placeholder?: string;
  maxChars?: number;
  maxItems?: number;    // imageList / keyValueList
}

// Each section type declares the content it needs (pure data — no JSX).
export type SectionContentSchema = ContentField[];

// ── Value shapes for content-field kinds ─────────────────────────────────────
export interface KeyValueEntry {
  key: string;
  value: string;
}

// A single section's user content: field key → value. Value shape depends on the
// content field kind: text/longtext/date/time/location → string; image/audio →
// asset URL string; imageList → string[]; keyValueList → KeyValueEntry[].
export type SectionContentValue = Record<
  string,
  string | string[] | KeyValueEntry[] | undefined
>;

// All content for an invite, keyed by section id (stable across reorders).
export type InviteSectionContent = Record<string, SectionContentValue>;

// ── Template + invite storage shapes ─────────────────────────────────────────
export interface SectionTemplate {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  status: "draft" | "published";
  theme: InviteTheme;
  sections: SectionConfig[]; // ordered
  thumbnailUrl: string;
  // Editor-only: set after a thumbnail upload so save can link the asset row.
  pendingThumbAssetId?: string | null;
}

// Lightweight template shape for cards / listings — no sections/theme/canvas.
export interface TemplateSummary {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  type: "image" | "video";
  status: "draft" | "published";
  thumbnailUrl: string;
}
