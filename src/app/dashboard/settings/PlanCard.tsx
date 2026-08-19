"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLAN_FEATURES, PRO_MONTHLY_PRICE, PRO_YEARLY_PRICE, YEARLY_DISCOUNT_PERCENT, type Plan } from "@/lib/plan";

export function PlanCard({ plan, canManage }: { plan: Plan; canManage: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setPlan(next: Plan) {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/v1/workspace", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: next }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to change plan");
      return;
    }
    router.refresh();
  }

  return (
    <section className="rounded-lg border border-black/10 dark:border-white/10 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium">Plan</h2>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            You&apos;re currently on <strong className="capitalize">{plan}</strong>.
          </p>
        </div>
        {plan === "free" ? (
          <span className="text-xs rounded-full bg-black/10 dark:bg-white/10 px-3 py-1">Free</span>
        ) : (
          <span className="text-xs rounded-full bg-foreground text-background px-3 py-1">Pro</span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <ul className="flex flex-col gap-1.5">
          {PLAN_FEATURES.free.map((f) => (
            <li key={f} className="text-black/70 dark:text-white/70">
              · {f}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-1.5">
          {PLAN_FEATURES.pro.map((f) => (
            <li key={f} className="text-black/70 dark:text-white/70">
              · {f}
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {canManage && (
        <div className="flex items-center gap-3">
          {plan === "free" ? (
            <button
              type="button"
              onClick={() => setPlan("pro")}
              disabled={loading}
              className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Upgrading…" : `Upgrade to Pro — $${PRO_MONTHLY_PRICE}/mo or $${PRO_YEARLY_PRICE}/yr (${YEARLY_DISCOUNT_PERCENT}% off)`}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPlan("free")}
              disabled={loading}
              className="text-sm text-black/50 dark:text-white/50 hover:underline disabled:opacity-50"
            >
              {loading ? "Downgrading…" : "Downgrade to Free"}
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-black/40 dark:text-white/40">
        No payment collected yet — this flips your plan instantly for testing. Real billing is coming soon.
      </p>
    </section>
  );
}
