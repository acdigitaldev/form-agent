"use client";

import { useState } from "react";
import type { FormField } from "@/lib/formFields";
import { FormFieldsRenderer } from "@/components/FormFieldsRenderer";

export function FormPreview({
  name,
  description,
  fields,
  gdprText,
  ctaText,
}: {
  name: string;
  description: string;
  fields: FormField[];
  gdprText: string;
  ctaText: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 overflow-hidden">
      <div className="bg-black/5 dark:bg-white/5 px-4 py-2 text-xs text-black/50 dark:text-white/50">
        Live preview — this is exactly what visitors will see
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{name || "Untitled form"}</h3>
          {description && <p className="text-sm text-black/60 dark:text-white/60 mt-1">{description}</p>}
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-black/40 dark:text-white/40">Add a field to see it here.</p>
        ) : (
          <FormFieldsRenderer
            fields={fields}
            values={values}
            onChange={(id, value) => setValues((v) => ({ ...v, [id]: value }))}
          />
        )}

        <button
          type="button"
          className="self-start rounded-md bg-accent text-white px-5 py-2.5 font-medium"
        >
          {ctaText || "Submit"}
        </button>

        {gdprText && <p className="text-xs text-black/50 dark:text-white/50">{gdprText}</p>}
      </div>
    </div>
  );
}
