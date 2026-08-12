import { z } from "zod";

export const FIELD_TYPES = [
  "text",
  "email",
  "phone",
  "textarea",
  "select",
  "checkbox",
  "number",
  "url",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const formFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export type FormField = z.infer<typeof formFieldSchema>;

export const formFieldsSchema = z.array(formFieldSchema).min(1).max(30);

export function parseFields(raw: string): FormField[] {
  try {
    const parsed = JSON.parse(raw);
    return formFieldsSchema.parse(parsed);
  } catch {
    return [];
  }
}

export function serializeFields(fields: FormField[]): string {
  return JSON.stringify(formFieldsSchema.parse(fields));
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60) || "form"
  );
}
