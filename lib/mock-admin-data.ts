import { mockTemplates, mockCategories, mockInvites } from "@/lib/mock-data";
import type { InviteTemplate, TemplateCategory } from "@/types/template";
import type { Invite } from "@/types/invite";

// Re-export for admin pages
export { mockTemplates, mockCategories, mockInvites };

// ── Asset types ────────────────────────────────────────────────────────────

export type AssetType = "image" | "video";
export type AssetUploadState = "idle" | "uploading" | "processing" | "done" | "error_size" | "error_generic";

export interface AdminAsset {
  id: string;
  name: string;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  url: string;
  usedInTemplates: number;
  createdAt: string;
}

export const mockAssets: AdminAsset[] = [
  {
    id: "ast-001",
    name: "birthday-pastel-bg.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 14200,
    url: "/mock-templates/birthday-pastel.svg",
    usedInTemplates: 1,
    createdAt: "2026-05-10T08:00:00.000Z",
  },
  {
    id: "ast-002",
    name: "wedding-classic-bg.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 18400,
    url: "/mock-templates/wedding-classic.svg",
    usedInTemplates: 1,
    createdAt: "2026-05-11T09:00:00.000Z",
  },
  {
    id: "ast-003",
    name: "wedding-luxury-bg.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 22100,
    url: "/mock-templates/wedding-luxury.svg",
    usedInTemplates: 1,
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "ast-004",
    name: "graduation-modern-bg.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 17300,
    url: "/mock-templates/graduation-modern.svg",
    usedInTemplates: 1,
    createdAt: "2026-05-13T11:00:00.000Z",
  },
  {
    id: "ast-005",
    name: "corporate-elegant-bg.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 15800,
    url: "/mock-templates/corporate-elegant.svg",
    usedInTemplates: 1,
    createdAt: "2026-05-14T12:00:00.000Z",
  },
  {
    id: "ast-006",
    name: "birthday-kids-bg.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 19600,
    url: "/mock-templates/birthday-kids.svg",
    usedInTemplates: 1,
    createdAt: "2026-05-15T13:00:00.000Z",
  },
  {
    id: "ast-007",
    name: "unused-banner.png",
    type: "image",
    mimeType: "image/png",
    sizeBytes: 204800,
    url: "/mock-templates/birthday-pastel.svg",
    usedInTemplates: 0,
    createdAt: "2026-06-01T08:00:00.000Z",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
