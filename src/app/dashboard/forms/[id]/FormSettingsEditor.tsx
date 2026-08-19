"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormFieldsEditor } from "@/components/FormFieldsEditor";
import type { FormField } from "@/lib/formFields";

export function FormSettingsEditor({
  formId,
  initialName,
  initialDescription,
  initialFields,
  initialIsActive,
  initialSuccessMessage,
  initialRedirectUrl,
  initialGdprText,
  initialCtaText,
  initialWebhookUrl,
  isPro,
}: {
  formId: string;
  initialName: string;
  initialDescription: string;
  initialFields: FormField[];
  initialIsActive: boolean;
  initialSuccessMessage: string;
  initialRedirectUrl: string;
  initialGdprText: string;
  initialCtaText: string;
  initialWebhookUrl: string;
  isPro: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [successMessage, setSuccessMessage] = useState(initialSuccessMessage);
  const [redirectUrl, setRedirectUrl] = useState(initialRedirectUrl);
  const [gdprText, setGdprText] = useState(initialGdprText);
  const [ctaText, setCtaText] = useState(initialCtaText);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSaving(true);

    const res = await fetch(`/api/v1/forms/${formId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        fields: fields.filter((f) => f.label.trim().length > 0),
        isActive,
        successMessage,
        redirectUrl: redirectUrl || null,
        gdprText,
        ctaText: ctaText || "Submit",
        ...(isPro ? { webhookUrl: webhookUrl || null } : {}),
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setStatus(body.error ?? "Failed to save");
      return;
    }
    setStatus("Saved");
    router.refresh();
    setTimeout(() => setStatus(null), 1500);
  }

  async function handleDelete() {
    if (!confirm("Delete this form and all its submissions? This can't be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/v1/forms/${formId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDeleting(false);
      setStatus("Failed to delete");
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-2xl">
      <label className="flex flex-col gap-1 text-sm">
        Form name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      <div>
        <p className="text-sm font-medium mb-3">Fields</p>
        <FormFieldsEditor fields={fields} onChange={setFields} />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Success message
        <input
          type="text"
          value={successMessage}
          onChange={(e) => setSuccessMessage(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Redirect URL (optional, instead of showing the success message)
        <input
          type="url"
          placeholder="https://example.com/thank-you"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Submit button text
        <input
          type="text"
          placeholder="Submit"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        GDPR / privacy notice
        <textarea
          value={gdprText}
          onChange={(e) => setGdprText(e.target.value)}
          rows={2}
          placeholder="Shown as small print below the submit button"
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      {isPro ? (
        <label className="flex flex-col gap-1 text-sm">
          Webhook URL
          <input
            type="url"
            placeholder="https://your-app.com/webhooks/agentforms"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
          />
          <span className="text-xs text-black/50 dark:text-white/50">
            We&apos;ll POST a JSON payload here on every new submission.
          </span>
        </label>
      ) : (
        <div className="rounded-md border border-dashed border-black/15 dark:border-white/20 px-3 py-3 text-sm text-black/50 dark:text-white/50">
          Webhooks (POST every submission to your own endpoint) are a{" "}
          <Link href="/dashboard/settings" className="underline">
            Pro
          </Link>{" "}
          feature.
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Form is accepting submissions
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {status && <span className="text-sm text-black/60 dark:text-white/60">{status}</span>}
      </div>

      <div className="pt-6 border-t border-black/10 dark:border-white/10">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete this form"}
        </button>
      </div>
    </form>
  );
}
