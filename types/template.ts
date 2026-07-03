// Template category shared across listings, cards, and the section editor.
// (The legacy canvas types — FieldType, TemplateFieldConfig, InviteTemplate,
// InviteValues — were removed with the section-based migration.)
export interface TemplateCategory {
  id: string;
  name: string;         // Mongolian
  slug: string;
  icon: string;         // emoji or icon name
  order: number;
}
