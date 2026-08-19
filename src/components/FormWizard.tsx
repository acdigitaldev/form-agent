"use client";

import { useState, useRef } from "react";
import { FormFieldsEditor, emptyField } from "@/components/FormFieldsEditor";
import { FormPreview } from "@/components/FormPreview";
import { FORM_TEMPLATES, type FormTemplate } from "@/lib/templates";
import type { FormField } from "@/lib/formFields";
import type { DraftForm } from "@/lib/draftForm";

const STEPS = ["Template", "Basics", "Fields", "GDPR & messaging", "Review"] as const;

const DEFAULT_GDPR_TEXT =
  "By submitting this form, you agree to let us store and process the information above to respond to your request.";

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 text-sm flex-wrap">
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

export function FormWizard({
  submitLabel = "Create form",
  onSubmit,
  secondaryAction,
}: {
  /** Label for the final-step action button. */
  submitLabel?: string;
  /** Called with the built form payload when the final action is clicked. Return an error string to show it, or null/undefined on success. */
  onSubmit: (payload: DraftForm) => Promise<string | null | void>;
  /** Optional secondary link/button next to submit (e.g. "Already have an account? Log in") — also receives the current payload. */
  secondaryAction?: { label: string; onClick: (payload: DraftForm) => void };
}) {
  const [step, setStep] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

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

  function applyTemplate(template: FormTemplate) {
    setSelectedTemplateId(template.id);
    setName(template.name);
    setFields(template.fields.map((f) => ({ ...f })));
    if (template.ctaText) setCtaText(template.ctaText);
    if (template.successMessage) setSuccessMessage(template.successMessage);
    setStep(1);
  }

  function startFromScratch() {
    setSelectedTemplateId("scratch");
    setStep(1);
  }

  function goNext() {
    setError(null);
    if (step === 1 && !name.trim()) {
      setError("Give the form a name to continue");
      return;
    }
    if (step === 2 && cleanFields.length === 0) {
      setError("Add at least one field to continue");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function buildPayload(): DraftForm {
    return {
      name,
      description: description || undefined,
      fields: cleanFields,
      gdprText,
      ctaText: ctaText || "Submit",
      successMessage,
      redirectUrl: redirectUrl || undefined,
    };
  }

  async function handleSubmit() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);

    const errorMessage = await onSubmit(buildPayload());

    setLoading(false);
    submittingRef.current = false;
    if (errorMessage) setError(errorMessage);
  }

  return (
    <div className="flex flex-col gap-8">
      <Stepper step={step} />

      {step === 0 ? (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <p className="text-sm text-black/60 dark:text-white/60 text-center">
            Start from a template with the right fields already filled in, or build from scratch.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FORM_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t)}
                className="text-left rounded-lg border border-black/10 dark:border-white/10 p-4 hover:border-black/30 dark:hover:border-white/30 transition-colors flex flex-col gap-2"
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-black/50 dark:text-white/50">{t.description}</span>
                <span className="text-xs text-black/40 dark:text-white/40 mt-1">
                  {t.fields.length} field{t.fields.length === 1 ? "" : "s"}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={startFromScratch}
              className="text-left rounded-lg border border-dashed border-black/20 dark:border-white/20 p-4 hover:border-black/40 dark:hover:border-white/40 transition-colors flex flex-col gap-2"
            >
              <span className="text-2xl">✏️</span>
              <span className="font-medium">Start from scratch</span>
              <span className="text-xs text-black/50 dark:text-white/50">Build your own from a blank form.</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-8 max-w-xl">
            {selectedTemplateId && selectedTemplateId !== "scratch" && step === 1 && (
              <p className="text-xs text-black/50 dark:text-white/50 -mb-4">
                Using the {FORM_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name} template — edit
                anything below.
              </p>
            )}

            {step === 1 && (
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

            {step === 2 && (
              <div>
                <p className="text-sm font-medium mb-3">Fields</p>
                <FormFieldsEditor fields={fields} onChange={setFields} />
              </div>
            )}

            {step === 3 && (
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

            {step === 4 && (
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

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={goBack}
                className="rounded-md border border-black/15 dark:border-white/20 px-5 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90"
                >
                  Continue
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Working…" : submitLabel}
                  </button>
                  {secondaryAction && (
                    <button
                      type="button"
                      onClick={() => secondaryAction.onClick(buildPayload())}
                      className="text-sm text-black/60 dark:text-white/60 hover:underline"
                    >
                      {secondaryAction.label}
                    </button>
                  )}
                </>
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
      )}
    </div>
  );
}
