import type { SectionType, SectionConfig, InviteTheme } from "@/types/section";
import type { SectionMode } from "./types";
import { CoverSection } from "./CoverSection";
import { CountdownSection } from "./CountdownSection";
import { DetailsSection } from "./DetailsSection";
import { StorySection } from "./StorySection";
import { GallerySection } from "./GallerySection";
import { LocationSection } from "./LocationSection";
import { RsvpSection } from "./RsvpSection";
import { GiftSection } from "./GiftSection";
import { MusicSection } from "./MusicSection";
import { ClosingSection } from "./ClosingSection";

// The runtime prop shape every section component is called with. Each component
// declares SectionProps<T> (narrowed config) which is assignable from this.
export interface SectionComponentProps {
  config: SectionConfig;
  content: Record<string, unknown>;
  theme: InviteTheme;
  mode: SectionMode;
  inviteId?: string;
  shareSlug?: string;
  inviteTitle?: string;
}

// Section type → component. Each component narrows its own config via SectionProps<T>,
// so the map is typed at the shared call shape; the `any` bridges the per-type configs.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_COMPONENTS: Record<SectionType, React.ComponentType<any>> = {
  cover: CoverSection,
  countdown: CountdownSection,
  details: DetailsSection,
  story: StorySection,
  gallery: GallerySection,
  location: LocationSection,
  rsvp: RsvpSection,
  gift: GiftSection,
  music: MusicSection,
  closing: ClosingSection,
};
