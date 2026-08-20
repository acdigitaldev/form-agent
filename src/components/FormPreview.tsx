"use client";

import { useState } from "react";
import type { FormField } from "@/lib/formFields";
import { FormFieldsRenderer } from "@/components/FormFieldsRenderer";
import { resolveTheme, type FormTheme } from "@/lib/formTheme";

export function FormPreview({
  name,
  description,
  fields,
  gdprText,
  ctaText,
  theme,
}: {
  name: string;
  description: string;
  fields: FormField[];
  gdprText: string;
  ctaText: string;
  theme?: FormTheme;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const resolved = resolveTheme(theme);

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 overflow-hidden">
      <div className="bg-black/5 dark:bg-white/5 px-4 py-2 text-xs text-black/50 dark:text-white/50">
        Live preview — this is exactly what visitors will see
      </div>
      <div className="p-6">
        <div
          className="rounded-lg border border-border bg-surface p-8"
          style={{
            fontSize: resolved.fontSizePx,
            borderRadius: resolved.radiusPx,
            ...(resolved.textColor ? { color: resolved.textColor } : {}),
            ...(resolved.cardBackgroundColor ? { backgroundColor: resolved.cardBackgroundColor } : {}),
          }}
        >
          <div className="flex flex-col gap-4">
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
                theme={resolved}
              />
            )}

            <button
              type="button"
              style={{
                backgroundColor: resolved.ctaBackgroundColor,
                color: resolved.ctaTextColor,
                borderRadius: resolved.radiusPx,
              }}
              className="self-start rounded-md px-5 py-2.5 font-medium"
            >
              {ctaText || "Submit"}
            </button>

            {gdprText && <p className="text-xs text-black/50 dark:text-white/50">{gdprText}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
