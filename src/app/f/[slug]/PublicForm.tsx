"use client";

import { useState } from "react";
import type { FormField } from "@/lib/formFields";
import { FormFieldsRenderer } from "@/components/FormFieldsRenderer";

export function PublicForm({
  slug,
  fields,
  successMessage,
  gdprText,
  ctaText,
}: {
  slug: string;
  fields: FormField[];
  successMessage: string;
  gdprText?: string;
  ctaText?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function setValue(id: string, value: string) {
    setValues((v) => ({ ...v, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    setFieldErrors({});

    const res = await fetch(`/api/public/forms/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("error");
      setFieldErrors(body.fieldErrors ?? {});
      setError(body.error ?? "Something went wrong");
      return;
    }

    if (body.redirectUrl) {
      window.location.href = body.redirectUrl;
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return <p className="text-base">{successMessage}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot: hidden from humans, bots tend to fill every field */}
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={values._hp ?? ""}
        onChange={(e) => setValue("_hp", e.target.value)}
      />

      <FormFieldsRenderer fields={fields} values={values} onChange={setValue} fieldErrors={fieldErrors} />

      {error && !Object.keys(fieldErrors).length && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : ctaText || "Submit"}
      </button>

      {gdprText && <p className="text-xs text-black/50 dark:text-white/50">{gdprText}</p>}
    </form>
  );
}
