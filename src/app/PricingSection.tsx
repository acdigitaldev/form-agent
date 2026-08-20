"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PLAN_FEATURES,
  PRO_MONTHLY_PRICE,
  PRO_YEARLY_PRICE,
  YEARLY_DISCOUNT_PERCENT,
} from "@/lib/plan";

export function PricingSection() {
  const [yearly, setYearly] = useState(true);
  const proPrice = yearly ? Math.round(PRO_YEARLY_PRICE / 12) : PRO_MONTHLY_PRICE;

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center flex flex-col gap-3 max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight">Simple pricing</h2>
        <p className="text-black/60 dark:text-white/60">
          Pay for features, not forms or responses. Unlimited forms and submissions on every plan — Free
          included.
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className={!yearly ? "font-medium" : "text-black/50 dark:text-white/50"}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly((y) => !y)}
          className="relative inline-block h-6 w-11 shrink-0 rounded-full bg-black/15 p-0 text-left align-middle overflow-hidden dark:bg-white/20 transition-colors"
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${
              yearly ? "translate-x-[20px]" : "translate-x-0"
            }`}
          />
        </button>
        <span className={yearly ? "font-medium" : "text-black/50 dark:text-white/50"}>
          Yearly <span className="text-green-600 dark:text-green-400">(save {YEARLY_DISCOUNT_PERCENT}%)</span>
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="rounded-lg border border-black/10 dark:border-white/10 p-6 flex flex-col gap-5">
          <div>
            <h3 className="font-semibold">Free</h3>
            <p className="text-3xl font-semibold tracking-tight mt-2">$0</p>
            <p className="text-sm text-black/50 dark:text-white/50">forever</p>
          </div>
          <ul className="flex flex-col gap-3 text-sm flex-1">
            {PLAN_FEATURES.free.map((f) => (
              <li key={f.title}>
                <p className="font-medium">{f.title}</p>
                <p className="text-black/60 dark:text-white/60">{f.description}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="rounded-md border border-black/15 dark:border-white/20 px-4 py-2 text-sm font-medium text-center hover:bg-black/5 dark:hover:bg-white/10"
          >
            Get started
          </Link>
        </div>

        <div className="rounded-lg border-2 border-foreground p-6 flex flex-col gap-5 relative">
          <span className="absolute -top-3 left-6 rounded-full bg-accent text-white text-xs px-2 py-0.5">
            Recommended
          </span>
          <div>
            <h3 className="font-semibold">Pro</h3>
            <p className="text-3xl font-semibold tracking-tight mt-2">
              ${proPrice}
              <span className="text-base font-normal text-black/50 dark:text-white/50">/mo</span>
            </p>
            <p className="text-sm text-black/50 dark:text-white/50">
              {yearly ? `billed $${PRO_YEARLY_PRICE}/year` : "billed monthly"}
            </p>
          </div>
          <p className="text-sm text-black/60 dark:text-white/60 -mt-2">Everything in Free, plus:</p>
          <ul className="flex flex-col gap-3 text-sm flex-1">
            {PLAN_FEATURES.pro.map((f) => (
              <li key={f.title}>
                <p className="font-medium">
                  {f.title}
                  {f.comingSoon && (
                    <span className="ml-2 text-xs font-normal text-black/40 dark:text-white/40">
                      (coming soon)
                    </span>
                  )}
                </p>
                <p className="text-black/60 dark:text-white/60">{f.description}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium text-center hover:bg-accent-hover"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
