"use client";

import type { FormField } from "@/lib/formFields";
import { FileFieldInput } from "@/components/FileFieldInput";

export function FormFieldsRenderer({
  fields,
  values,
  onChange,
  fieldErrors = {},
  formSlug,
}: {
  fields: FormField[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  fieldErrors?: Record<string, string>;
  /** Live form slug — enables real uploads for "file" fields. Omit for dashboard previews. */
  formSlug?: string;
}) {
  return (
    <>
      {fields.map((field) => {
        const usePlaceholder = Boolean(field.placeholderLabel) && field.type !== "checkbox";
        const labelWithMark = `${field.label}${field.required ? " *" : ""}`;
        const effectivePlaceholder = usePlaceholder ? field.placeholder || labelWithMark : field.placeholder;

        return (
          <div key={field.id} className="flex flex-col gap-1 text-sm">
            {!usePlaceholder && field.type !== "checkbox" && (
              <label>
                {field.label}
                {field.required && <span className="text-red-600"> *</span>}
              </label>
            )}

            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={effectivePlaceholder}
                value={values[field.id] ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                rows={4}
                className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                value={values[field.id] ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none"
              >
                <option value="" disabled>
                  {usePlaceholder ? labelWithMark : "Select…"}
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values[field.id] === "true"}
                  onChange={(e) => onChange(field.id, e.target.checked ? "true" : "")}
                  className="h-4 w-4"
                />
                {field.label}
                {field.required && <span className="text-red-600"> *</span>}
              </label>
            ) : field.type === "file" ? (
              <FileFieldInput
                fieldId={field.id}
                formSlug={formSlug}
                value={values[field.id] ?? ""}
                onChange={(value) => onChange(field.id, value)}
              />
            ) : (
              <input
                type={field.type === "phone" ? "tel" : field.type}
                required={field.required}
                placeholder={effectivePlaceholder}
                value={values[field.id] ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
              />
            )}
            {fieldErrors[field.id] && <span className="text-xs text-red-600">{fieldErrors[field.id]}</span>}
          </div>
        );
      })}
    </>
  );
}
