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
  "file",
] as const;

/** Hard cap on file-type fields per form — bounds worst-case storage/bandwidth per submission. */
export const MAX_FILE_FIELDS_PER_FORM = 3;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_WORKSPACE_STORAGE_BYTES = 500 * 1024 * 1024;

export type FieldType = (typeof FIELD_TYPES)[number];

export const formFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  /** Show the label inside the input as placeholder text instead of above it. */
  placeholderLabel: z.boolean().optional(),
});

export type FormField = z.infer<typeof formFieldSchema>;

export const formFieldsSchema = z
  .array(formFieldSchema)
  .min(1)
  .max(30)
  .refine((fields) => fields.filter((f) => f.type === "file").length <= MAX_FILE_FIELDS_PER_FORM, {
    message: `A form can have at most ${MAX_FILE_FIELDS_PER_FORM} file upload fields`,
  });

export function hasFileField(fields: FormField[]): boolean {
  return fields.some((f) => f.type === "file");
}

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
