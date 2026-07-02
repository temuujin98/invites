import type {
  ConfigOf,
  SectionType,
  SectionContentValue,
  InviteTheme,
} from "@/types/section";

// Render mode shared by all section components.
//   editor  — admin template editor preview (click-to-select, placeholder content)
//   create  — user create-flow live preview (real content + placeholders)
//   public  — guest-facing rendered invitation (real content only)
export type SectionMode = "editor" | "create" | "public";

// Props every section component receives. Config is narrowed per section type.
export interface SectionProps<T extends SectionType> {
  config: ConfigOf<T>;
  content: SectionContentValue;
  theme: InviteTheme;
  mode: SectionMode;
  // Public-only context (RSVP POST, share/QR/calendar).
  inviteId?: string;
  shareSlug?: string;
  inviteTitle?: string;
}
