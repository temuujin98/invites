import type {
  SectionType,
  SectionConfig,
  SectionContentSchema,
} from "@/types/section";

// ── Section registry ─────────────────────────────────────────────────────────
// Single source of truth for every section type. Consumed by:
//   • admin editor  — label/icon in the add menu, defaultConfig on add
//   • create flow   — contentSchema drives the dynamic content form
//   • renderer      — label/defaults for placeholder states
//
// Keep this the ONLY place that knows the shape of each section type.

export interface SectionRegistryEntry {
  /** Mongolian label shown in the editor + create-flow step. */
  label: string;
  /** Short Mongolian description for the add menu. */
  description: string;
  /** Inline SVG path data (24×24 viewBox) for the section icon. */
  iconPath: string;
  /** Whether the user enters content for this section (false → skip in create flow). */
  hasContent: boolean;
  /** Default admin config for a freshly added section. */
  defaultConfig: (id: string, order: number) => SectionConfig;
  /** Content fields the user fills (empty when hasContent is false). */
  contentSchema: SectionContentSchema;
}

export const SECTION_REGISTRY: Record<SectionType, SectionRegistryEntry> = {
  cover: {
    label: "Нүүр",
    description: "Урилгын эхний дэлгэц — гол зураг ба нэр",
    iconPath: "M4 5h16v14H4z M4 9h16",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "cover",
      order,
      enabled: true,
      variant: "centered",
      showScrollHint: true,
    }),
    contentSchema: [
      { key: "title", label: "Гарчиг", kind: "text", required: true, placeholder: "Бат-Эрдэнэ & Солонго", maxChars: 60 },
      { key: "subtitle", label: "Дэд гарчиг", kind: "text", required: false, placeholder: "Хуримын ёслолд урьж байна", maxChars: 80 },
      { key: "coverImage", label: "Гол зураг", kind: "image", required: false },
    ],
  },

  countdown: {
    label: "Тоолол",
    description: "Арга хэмжээ хүртэлх өдрийн тоолол",
    iconPath: "M12 8v4l3 2 M12 3a9 9 0 100 18 9 9 0 000-18z",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "countdown",
      order,
      enabled: true,
      targetSource: "event_date",
      style: "digits",
    }),
    contentSchema: [
      { key: "targetDate", label: "Зорилтот огноо", kind: "date", required: true, placeholder: "2026.08.15" },
      { key: "targetTime", label: "Цаг", kind: "time", required: false, placeholder: "12:00" },
    ],
  },

  details: {
    label: "Мэдээлэл",
    description: "Огноо, цаг, байршил",
    iconPath: "M4 6h16 M4 12h16 M4 18h10",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "details",
      order,
      enabled: true,
      layout: "cards",
      showCalendarButton: true,
    }),
    contentSchema: [
      { key: "date", label: "Огноо", kind: "date", required: true, placeholder: "2026.08.15" },
      { key: "time", label: "Цаг", kind: "time", required: true, placeholder: "12:00" },
      { key: "location", label: "Байршил", kind: "location", required: true, placeholder: "Шангри-Ла зочид буудал" },
      { key: "note", label: "Нэмэлт тэмдэглэл", kind: "longtext", required: false, placeholder: "Хувцаслалт: албан ёсны", maxChars: 200 },
    ],
  },

  story: {
    label: "Түүх",
    description: "Он цагийн дараалал / танилцуулга",
    iconPath: "M12 3v18 M7 8h.01 M7 12h.01 M7 16h.01 M11 8h6 M11 12h6 M11 16h6",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "story",
      order,
      enabled: true,
      layout: "timeline",
      maxItems: 5,
    }),
    contentSchema: [
      { key: "heading", label: "Гарчиг", kind: "text", required: false, placeholder: "Бидний түүх", maxChars: 40 },
      { key: "items", label: "Үе шатууд", kind: "keyValueList", required: false, maxItems: 5 },
    ],
  },

  gallery: {
    label: "Зургийн цомог",
    description: "Олон зургийн grid",
    iconPath: "M4 5h16v14H4z M4 14l4-4 4 4 3-3 5 5",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "gallery",
      order,
      enabled: true,
      columns: 3,
      aspect: "square",
      maxImages: 9,
    }),
    contentSchema: [
      { key: "heading", label: "Гарчиг", kind: "text", required: false, placeholder: "Дурсамжууд", maxChars: 40 },
      { key: "photos", label: "Зургууд", kind: "imageList", required: false, maxItems: 9 },
    ],
  },

  location: {
    label: "Байршил",
    description: "Газрын зураг ба чиглэл",
    iconPath: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z M12 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "location",
      order,
      enabled: true,
      provider: "google",
      showEmbed: true,
      showDirections: true,
    }),
    contentSchema: [
      { key: "venueName", label: "Газрын нэр", kind: "text", required: true, placeholder: "Шангри-Ла зочид буудал", maxChars: 80 },
      { key: "address", label: "Хаяг", kind: "location", required: true, placeholder: "Улаанбаатар, Сүхбаатар дүүрэг" },
      { key: "mapUrl", label: "Google Maps холбоос", kind: "text", required: false, placeholder: "https://maps.google.com/..." },
    ],
  },

  rsvp: {
    label: "Ирэх эсэх (RSVP)",
    description: "Зочны хариу авах форм",
    iconPath: "M4 5h16v14H4z M4 8l8 5 8-5",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "rsvp",
      order,
      enabled: true,
      allowGuestCount: true,
      allowNote: true,
    }),
    contentSchema: [
      { key: "heading", label: "Гарчиг", kind: "text", required: false, placeholder: "Ирэхээ мэдэгдэнэ үү", maxChars: 40 },
      { key: "message", label: "Тайлбар", kind: "longtext", required: false, placeholder: "8 сарын 10-ны дотор хариугаа өгнө үү", maxChars: 200 },
    ],
  },

  gift: {
    label: "Бэлэг",
    description: "Дансны мэдээлэл / QR",
    iconPath: "M4 8h16v12H4z M4 8l2-4h12l2 4 M12 8v12",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "gift",
      order,
      enabled: true,
      showBank: true,
      showQr: false,
    }),
    contentSchema: [
      { key: "heading", label: "Гарчиг", kind: "text", required: false, placeholder: "Бэлэг", maxChars: 40 },
      { key: "bankInfo", label: "Дансны мэдээлэл", kind: "keyValueList", required: false, maxItems: 4 },
      { key: "qrImage", label: "QR зураг", kind: "image", required: false },
    ],
  },

  music: {
    label: "Хөгжим",
    description: "Дэвсгэр хөгжим",
    iconPath: "M9 18V6l10-2v12 M9 18a2 2 0 11-4 0 2 2 0 014 0z M19 16a2 2 0 11-4 0 2 2 0 014 0z",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "music",
      order,
      enabled: true,
      autoplay: true,
      loop: true,
    }),
    contentSchema: [
      { key: "audio", label: "Аудио файл", kind: "audio", required: false },
      { key: "trackName", label: "Дууны нэр", kind: "text", required: false, placeholder: "Хайрын дуу", maxChars: 60 },
    ],
  },

  closing: {
    label: "Төгсгөл",
    description: "Талархал / гарын үсэг / хуваалцах",
    iconPath: "M5 12l5 5L20 7",
    hasContent: true,
    defaultConfig: (id, order) => ({
      id,
      type: "closing",
      order,
      enabled: true,
      variant: "signature",
    }),
    contentSchema: [
      { key: "message", label: "Захиас", kind: "longtext", required: false, placeholder: "Таныг хүрэлцэн ирэхийг тэсэн ядан хүлээж байна", maxChars: 200 },
      { key: "signature", label: "Гарын үсэг", kind: "text", required: false, placeholder: "Хайрт эцэг эх нь", maxChars: 60 },
    ],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Section types the user enters content for (used to derive create-flow steps). */
export function contentBearingTypes(): SectionType[] {
  return (Object.keys(SECTION_REGISTRY) as SectionType[]).filter(
    (t) => SECTION_REGISTRY[t].hasContent && SECTION_REGISTRY[t].contentSchema.length > 0,
  );
}

/** Build a new section config of the given type with the next order index. */
export function buildSection(type: SectionType, maxOrder: number): SectionConfig {
  return SECTION_REGISTRY[type].defaultConfig(crypto.randomUUID(), maxOrder + 1);
}
