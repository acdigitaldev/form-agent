export type Plan = "free" | "pro";

export const PRO_MONTHLY_PRICE = 19;
// 40% off yearly, expressed as a monthly-equivalent rate.
export const PRO_YEARLY_PRICE = Math.round(PRO_MONTHLY_PRICE * 12 * 0.6);
export const YEARLY_DISCOUNT_PERCENT = 40;

export function isPro(workspace: { plan: string } | null | undefined): boolean {
  return workspace?.plan === "pro";
}

export const PLAN_FEATURES = {
  free: [
    "Unlimited forms",
    "Unlimited submissions & fields",
    "Hosted MCP connector for any agent",
    "GDPR notice & custom CTA per form",
    "Submissions dashboard & analytics",
    "“Powered by AgentForms” badge on public forms",
  ],
  pro: [
    "Everything in Free",
    "Remove “Powered by AgentForms” branding",
    "Invite team members to your workspace",
    "Priority template library",
  ],
} as const;
