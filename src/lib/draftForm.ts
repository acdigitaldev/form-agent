const DRAFT_KEY = "agentforms_draft_form";

export type DraftForm = {
  name: string;
  description?: string;
  fields: unknown[];
  gdprText?: string;
  ctaText?: string;
  successMessage?: string;
  redirectUrl?: string;
};

export function saveDraftForm(draft: DraftForm) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function readDraftForm(): DraftForm | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DraftForm;
  } catch {
    return null;
  }
}

export function clearDraftForm() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DRAFT_KEY);
}

/**
 * Called right after a successful login/register. If the visitor built a form
 * before signing up, create it now and return where to send them; otherwise
 * fall back to the dashboard.
 */
export async function claimDraftFormOrDashboard(): Promise<string> {
  const draft = readDraftForm();
  if (!draft) return "/dashboard";
  clearDraftForm();

  try {
    const res = await fetch("/api/v1/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) return "/dashboard";
    const { form } = await res.json();
    return `/dashboard/forms/${form.id}`;
  } catch {
    return "/dashboard";
  }
}
