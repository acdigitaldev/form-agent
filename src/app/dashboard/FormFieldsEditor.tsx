"use client";

import { FIELD_TYPES, type FieldType, type FormField } from "@/lib/formFields";

let counter = 0;
function newId() {
  counter += 1;
  return `field_${Date.now()}_${counter}`;
}

export function emptyField(): FormField {
  return { id: newId(), label: "", type: "text", required: false };
}

const TYPE_LABELS: Record<FieldType, string> = {
  text: "Text",
  email: "Email",
  phone: "Phone",
  textarea: "Long text",
  select: "Dropdown",
  checkbox: "Checkbox",
  number: "Number",
  url: "URL",
};

export function FormFieldsEditor({
  fields,
  onChange,
}: {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}) {
  function update(index: number, patch: Partial<FormField>) {
    const next = fields.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...fields, emptyField()]);
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, i) => (
        <div key={field.id} className="rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Field label (e.g. Work email)"
              value={field.label}
              onChange={(e) => update(i, { label: e.target.value })}
              className="flex-1 rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
            />
            <select
              value={field.type}
              onChange={(e) => update(i, { type: e.target.value as FieldType })}
              className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-sm text-red-600 hover:underline px-2"
            >
              Remove
            </button>
          </div>

          {field.type === "select" && (
            <input
              type="text"
              placeholder="Options, comma separated (e.g. Small, Medium, Large)"
              value={field.options?.join(", ") ?? ""}
              onChange={(e) =>
                update(i, {
                  options: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
            />
          )}

          <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => update(i, { required: e.target.checked })}
            />
            Required
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="self-start rounded-md border border-black/15 dark:border-white/20 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
      >
        + Add field
      </button>
    </div>
  );
}
