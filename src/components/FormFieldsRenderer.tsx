"use client";

import type { FormField } from "@/lib/formFields";

export function FormFieldsRenderer({
  fields,
  values,
  onChange,
  fieldErrors = {},
}: {
  fields: FormField[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  fieldErrors?: Record<string, string>;
}) {
  return (
    <>
      {fields.map((field) => (
        <label key={field.id} className="flex flex-col gap-1 text-sm">
          {field.label}
          {field.required && <span className="text-red-600"> *</span>}
          {field.type === "textarea" ? (
            <textarea
              required={field.required}
              placeholder={field.placeholder}
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
                Select…
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={values[field.id] === "true"}
              onChange={(e) => onChange(field.id, e.target.checked ? "true" : "")}
              className="self-start h-4 w-4"
            />
          ) : (
            <input
              type={field.type === "phone" ? "tel" : field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={values[field.id] ?? ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
            />
          )}
          {fieldErrors[field.id] && <span className="text-xs text-red-600">{fieldErrors[field.id]}</span>}
        </label>
      ))}
    </>
  );
}
