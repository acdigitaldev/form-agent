"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormFieldsEditor, emptyField } from "../FormFieldsEditor";
import { FormPreview } from "./FormPreview";
import type { FormField } from "@/lib/formFields";

const STEPS = ["Basics", "Fields", "GDPR & messaging", "Review"] as const;

const DEFAULT_GDPR_TEXT =
  "By submitting this form, you agree to let us store and process the information above to respond to your request.";

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 text-sm flex-wrap">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              i === step
                ? "bg-foreground text-background"
                : i < step
                  ? "text-black/50 dark:text-white/50"
                  : "text-black/30 dark:text-white/30"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                i === step
                  ? "bg-background text-foreground"
                  : i < step
                    ? "bg-black/10 dark:bg-white/15"
                    : "border border-black/20 dark:border-white/20"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="w-6 h-px bg-black/15 dark:bg-white/15" />}
        </li>
      ))}
    </ol>
  );
}

export default function NewFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { ...emptyField(), label: "Name", type: "text", required: true },
    { ...emptyField(), label: "Email", type: "email", required: true },
  ]);
  const [gdprText, setGdprText] = useState(DEFAULT_GDPR_TEXT);
  const [ctaText, setCtaText] = useState("Submit");
  const [successMessage, setSuccessMessage] = useState("Thanks! Your submission was received.");
  const [redirectUrl, setRedirectUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const cleanFields = fields.filter((f) => f.label.trim().length > 0);

  function goNext() {
    setError(null);
    if (step === 0 && !name.trim()) {
      setError("Give the form a name to continue");
      return;
    }
    if (step === 1 && cleanFields.length === 0) {
      setError("Add at least one field to continue");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleCreate() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/v1/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || undefined,
        fields: cleanFields,
        gdprText,
        ctaText: ctaText || "Submit",
        successMessage,
        redirectUrl: redirectUrl || undefined,
      }),
    });

    setLoading(false);
    submittingRef.current = false;

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to create form");
      return;
    }

    const { form } = await res.json();
    router.push(`/dashboard/forms/${form.id}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/dashboard" className="text-sm text-black/50 dark:text-white/50 hover:underline">
          ← Forms
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">New form</h1>
      </div>

      <Stepper step={step} />

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="flex flex-col gap-8 max-w-xl">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-1 text-sm">
                Form name
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Newsletter signup"
                  className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Optional — shown under the form title"
                  className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm font-medium mb-3">Fields</p>
              <FormFieldsEditor fields={fields} onChange={setFields} />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
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
                Success message
                <input
                  type="text"
                  placeholder="Thanks! Your submission was received."
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Redirect URL
                <input
                  type="url"
                  placeholder="Optional — redirect here instead of the success message"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
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
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-black/10 dark:border-white/10 p-5 flex flex-col gap-3">
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">Name</p>
                  <p className="font-medium">{name}</p>
                </div>
                {description && (
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">Description</p>
                    <p>{description}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50 mb-1">
                    Fields ({cleanFields.length})
                  </p>
                  <ul className="text-sm flex flex-col gap-1">
                    {cleanFields.map((f) => (
                      <li key={f.id}>
                        {f.label} — {f.type}
                        {f.required ? " (required)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">Button text</p>
                  <p className="text-sm">{ctaText || "Submit"}</p>
                </div>
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">Success message</p>
                  <p className="text-sm">{redirectUrl ? `Redirects to ${redirectUrl}` : successMessage}</p>
                </div>
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">GDPR notice</p>
                  <p className="text-sm">{gdprText || "None"}</p>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="rounded-md border border-black/15 dark:border-white/20 px-5 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create form"}
              </button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-10">
          <FormPreview
            name={name}
            description={description}
            fields={cleanFields}
            gdprText={gdprText}
            ctaText={ctaText}
          />
        </div>
      </div>
    </div>
  );
}
