export type FieldType = "text" | "date" | "time" | "location" | "image" | "qr" | "rsvp" | "custom";

export interface TemplateFieldConfig {
  id: string;
  key: string;           // event_title, host_name, etc.
  label: string;         // Mongolian label shown in form
  placeholder?: string;
  type: FieldType;
  required: boolean;
  x: number; y: number; width: number; height: number;  // canvas px (1080×1920 default)
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  maxChars?: number;
  color?: string;
  align?: "left" | "center" | "right";
  borderRadius?: number;
  objectFit?: "cover" | "contain";
  visible: boolean;
  locked: boolean;
  layerOrder: number;
}

export interface InviteTemplate {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  type: "image" | "video";
  backgroundUrl: string;
  thumbnailUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  status: "draft" | "published";
  fields: TemplateFieldConfig[];
}

export type InviteValues = Record<string, { text?: string; assetUrl?: string }>;

export interface TemplateCategory {
  id: string;
  name: string;         // Mongolian
  slug: string;
  icon: string;         // emoji or icon name
  order: number;
}
