"use client";

import { useState } from "react";
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
  file: "File upload (Pro)",
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
        <FieldRow
          key={field.id}
          field={field}
          onUpdate={(patch) => update(i, patch)}
          onRemove={() => remove(i)}
        />
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

function FieldRow({
  field,
  onUpdate,
  onRemove,
}: {
  field: FormField;
  onUpdate: (patch: Partial<FormField>) => void;
  onRemove: () => void;
}) {
  // Kept separate from field.options so the input reflects exactly what's typed
  // (e.g. a trailing comma while starting the next option) instead of being
  // clobbered every keystroke by re-joining the parsed/filtered array.
  const [optionsText, setOptionsText] = useState(field.options?.join(", ") ?? "");

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Field label (e.g. Work email)"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="flex-1 rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
        <select
          value={field.type}
          onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <button type="button" onClick={onRemove} className="text-sm text-red-600 hover:underline px-2">
          Remove
        </button>
      </div>

      {field.type === "select" && (
        <input
          type="text"
          placeholder="Options, comma separated (e.g. Small, Medium, Large)"
          value={optionsText}
          onChange={(e) => {
            const raw = e.target.value;
            setOptionsText(raw);
            onUpdate({
              options: raw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            });
          }}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      )}

      <div className="flex items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
          Required
        </label>
        {field.type !== "checkbox" && field.type !== "file" && (
          <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
            <input
              type="checkbox"
              checked={field.placeholderLabel ?? false}
              onChange={(e) => onUpdate({ placeholderLabel: e.target.checked })}
            />
            Show label as placeholder
          </label>
        )}
      </div>
    </div>
  );
}
