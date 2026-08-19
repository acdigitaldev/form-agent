export type Plan = "free" | "pro";

export const PRO_MONTHLY_PRICE = 19;
// 40% off yearly, expressed as a monthly-equivalent rate.
export const PRO_YEARLY_PRICE = Math.round(PRO_MONTHLY_PRICE * 12 * 0.6);
export const YEARLY_DISCOUNT_PERCENT = 40;

export function isPro(workspace: { plan: string } | null | undefined): boolean {
  return workspace?.plan === "pro";
}

export type PlanFeature = { title: string; description: string; comingSoon?: boolean };

export const PLAN_FEATURES: { free: PlanFeature[]; pro: PlanFeature[] } = {
  free: [
    {
      title: "Unlimited forms & submissions",
      description: "No caps on forms, responses, or fields — ever. Build as much as you need.",
    },
    {
      title: "One-click templates",
      description: "Newsletter, contact form, demo request, survey, event RSVP, job application — pre-filled.",
    },
    {
      title: "Hosted MCP connector",
      description: "Paste one URL into Claude, ChatGPT, or any MCP client. No local install, no OAuth dance.",
    },
    {
      title: "GDPR notice & custom CTA",
      description: "Editable privacy notice and submit-button text on every form, out of the box.",
    },
    {
      title: "Submissions dashboard",
      description: "30-day analytics, per-form filtering, and a live feed of every lead you capture.",
    },
    {
      title: "REST API & OpenAPI schema",
      description: "The same API the dashboard and MCP connector use — build your own integrations on it.",
    },
  ],
  pro: [
    {
      title: "Remove AgentForms branding",
      description: "No “Powered by AgentForms” badge on public forms — fully white-label for your audience.",
    },
    {
      title: "Team workspaces",
      description: "Invite unlimited teammates with owner/member roles, sharing every form and connector token.",
    },
    {
      title: "CSV export",
      description: "Download every submission for a form — or your whole workspace — in one click.",
    },
    {
      title: "Webhooks",
      description: "POST every new submission to your own endpoint or automation tool the instant it lands.",
    },
    {
      title: "File uploads",
      description: "Let visitors attach a CV, image, or document — up to 10MB per file, 3 files per form.",
    },
    {
      title: "Priority template requests",
      description: "Ask for a template you need for your workflow and we'll add it to the library.",
    },
    {
      title: "Custom domains & CSS",
      description: "Serve forms on your own domain with your own styling.",
      comingSoon: true,
    },
  ],
};
