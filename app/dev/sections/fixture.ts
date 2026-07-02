import type { SectionTemplate, InviteSectionContent } from "@/types/section";
import { DEFAULT_THEME } from "@/types/section";

// Stable ids so content can key into sections.
const IDS = {
  cover: "sec-cover",
  countdown: "sec-countdown",
  details: "sec-details",
  story: "sec-story",
  gallery: "sec-gallery",
  location: "sec-location",
  rsvp: "sec-rsvp",
  gift: "sec-gift",
  music: "sec-music",
  closing: "sec-closing",
};

export const FIXTURE_TEMPLATE: SectionTemplate = {
  id: "fixture-1",
  name: "Sandbox — бүх section",
  slug: "sandbox",
  categoryId: "wedding",
  status: "published",
  thumbnailUrl: "",
  theme: {
    ...DEFAULT_THEME,
    palette: { bg: "#F4F0EA", surface: "#FFFFFF", text: "#2C1810", accent: "#8B5CF6", muted: "#6D6762" },
    fonts: { heading: "Playfair Display", body: "Roboto" },
  },
  sections: [
    { id: IDS.cover, type: "cover", order: 1, enabled: true, variant: "centered", showScrollHint: true },
    { id: IDS.countdown, type: "countdown", order: 2, enabled: true, targetSource: "custom", style: "digits" },
    { id: IDS.details, type: "details", order: 3, enabled: true, layout: "cards", showCalendarButton: true },
    { id: IDS.story, type: "story", order: 4, enabled: true, layout: "timeline", maxItems: 5 },
    { id: IDS.gallery, type: "gallery", order: 5, enabled: true, columns: 3, aspect: "square", maxImages: 6 },
    { id: IDS.location, type: "location", order: 6, enabled: true, provider: "google", showEmbed: true, showDirections: true },
    { id: IDS.rsvp, type: "rsvp", order: 7, enabled: true, allowGuestCount: true, allowNote: true },
    { id: IDS.gift, type: "gift", order: 8, enabled: true, showBank: true, showQr: false },
    { id: IDS.music, type: "music", order: 9, enabled: true, autoplay: false, loop: true },
    { id: IDS.closing, type: "closing", order: 10, enabled: true, variant: "signature" },
  ],
};

export const FIXTURE_CONTENT: InviteSectionContent = {
  [IDS.cover]: {
    title: "Бат-Эрдэнэ & Солонго",
    subtitle: "Хуримын ёслолд урьж байна",
  },
  [IDS.countdown]: { targetDate: "2026.08.15", targetTime: "12:00" },
  [IDS.details]: {
    date: "2026.08.15",
    time: "12:00",
    location: "Шангри-Ла зочид буудал, Улаанбаатар",
    note: "Хувцаслалт: албан ёсны",
  },
  [IDS.story]: {
    heading: "Бидний түүх",
    items: [
      { key: "2020", value: "Их сургуульд танилцсан" },
      { key: "2023", value: "Гэрлэх санал тавьсан" },
      { key: "2026", value: "Гэрлэлтээ батлуулж байна" },
    ],
  },
  [IDS.gallery]: { heading: "Дурсамжууд", photos: [] },
  [IDS.location]: {
    venueName: "Шангри-Ла зочид буудал",
    address: "Улаанбаатар, Сүхбаатар дүүрэг",
    mapUrl: "https://maps.google.com/?q=Shangri-La+Ulaanbaatar",
  },
  [IDS.rsvp]: { heading: "Ирэхээ мэдэгдэнэ үү", message: "8 сарын 10-ны дотор хариугаа өгнө үү" },
  [IDS.gift]: {
    heading: "Бэлэг",
    bankInfo: [
      { key: "Банк", value: "Хаан банк" },
      { key: "Данс", value: "5000123456" },
      { key: "Хүлээн авагч", value: "Б.Солонго" },
    ],
  },
  [IDS.music]: { trackName: "Хайрын дуу" },
  [IDS.closing]: {
    message: "Таныг хүрэлцэн ирэхийг тэсэн ядан хүлээж байна",
    signature: "Хайрт хос",
  },
};
