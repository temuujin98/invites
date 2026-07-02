"use client";

import type { CSSProperties } from "react";
import type {
  SectionTemplate,
  InviteSectionContent,
  InviteTheme,
  SectionConfig,
} from "@/types/section";
import type { SectionMode } from "./sections/types";
import { SECTION_COMPONENTS, type SectionComponentProps } from "./sections";

interface SectionRendererProps {
  template: SectionTemplate;
  content: InviteSectionContent;
  mode: SectionMode;
  // Editor-only selection wiring.
  selectedSectionId?: string;
  onSectionSelect?: (id: string) => void;
  // Public-only context threaded to sections that need it (rsvp/closing).
  inviteId?: string;
  shareSlug?: string;
  inviteTitle?: string;
}

// Map theme → CSS custom properties consumed by every section (via var(--inv-*)).
function themeVars(theme: InviteTheme): CSSProperties {
  return {
    "--inv-bg": theme.palette.bg,
    "--inv-surface": theme.palette.surface,
    "--inv-text": theme.palette.text,
    "--inv-accent": theme.palette.accent,
    "--inv-muted": theme.palette.muted,
    "--inv-font-heading": `'${theme.fonts.heading}', serif`,
    "--inv-font-body": `'${theme.fonts.body}', sans-serif`,
    backgroundColor: theme.palette.bg,
    color: theme.palette.text,
    fontFamily: `'${theme.fonts.body}', sans-serif`,
  } as CSSProperties;
}

export function SectionRenderer({
  template,
  content,
  mode,
  selectedSectionId,
  onSectionSelect,
  inviteId,
  shareSlug,
  inviteTitle,
}: SectionRendererProps) {
  const sorted = [...template.sections].sort((a, b) => a.order - b.order);

  // Public: only enabled sections. Editor/create: all (disabled shown dimmed).
  const visible = sorted.filter((s) => (mode === "public" ? s.enabled : true));

  return (
    <div style={themeVars(template.theme)}>
      {visible.map((section) => (
        <SectionSlot
          key={section.id}
          section={section}
          content={content[section.id] ?? {}}
          theme={template.theme}
          mode={mode}
          isSelected={mode === "editor" && selectedSectionId === section.id}
          onSelect={onSectionSelect}
          inviteId={inviteId}
          shareSlug={shareSlug}
          inviteTitle={inviteTitle}
        />
      ))}
    </div>
  );
}

interface SectionSlotProps {
  section: SectionConfig;
  content: Record<string, unknown>;
  theme: InviteTheme;
  mode: SectionMode;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  inviteId?: string;
  shareSlug?: string;
  inviteTitle?: string;
}

function SectionSlot({
  section,
  content,
  theme,
  mode,
  isSelected,
  onSelect,
  inviteId,
  shareSlug,
  inviteTitle,
}: SectionSlotProps) {
  // Component chosen by discriminated type. Each component narrows its own config
  // internally via SectionProps<T>; here we type the shared runtime prop shape.
  const Component: React.ComponentType<SectionComponentProps> = SECTION_COMPONENTS[section.type];

  const dimmed = mode !== "public" && !section.enabled;

  const body = (
    <Component
      config={section}
      content={content}
      theme={theme}
      mode={mode}
      inviteId={inviteId}
      shareSlug={shareSlug}
      inviteTitle={inviteTitle}
    />
  );

  if (mode !== "editor") {
    return <div style={{ opacity: dimmed ? 0.4 : 1 }}>{body}</div>;
  }

  // Editor: click-to-select wrapper with selection outline.
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(section.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(section.id);
        }
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        opacity: dimmed ? 0.4 : 1,
        outline: isSelected ? "2px solid var(--inv-accent)" : "none",
        outlineOffset: -2,
      }}
    >
      {body}
    </div>
  );
}
