import Link from "next/link";
import { PricingToggle } from "./PricingToggle";
import { PLAN_FEATURES } from "@/lib/plan";

export const metadata = { title: "Pricing — AgentForms" };

export default function PricingPage() {
  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            AgentForms
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="hover:underline">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-foreground text-background px-3 py-1.5 font-medium hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Simple pricing</h1>
        <p className="text-lg text-black/70 dark:text-white/70">
          Pay for features, not forms or responses. Unlimited forms and submissions on every plan.
        </p>
      </section>

      <section className="px-6 pb-20">
        <PricingToggle />
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-24 w-full">
        <h2 className="text-lg font-semibold tracking-tight mb-6 text-center">What's included</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-3">Free</h3>
            <ul className="flex flex-col gap-2 text-sm text-black/70 dark:text-white/70">
              {PLAN_FEATURES.free.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3">Pro</h3>
            <ul className="flex flex-col gap-2 text-sm text-black/70 dark:text-white/70">
              {PLAN_FEATURES.pro.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-black/50 dark:text-white/50">AgentForms — forms for agents.</span>
          <a
            href="https://growthwithalex.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-black/30 dark:text-white/30 hover:underline"
          >
            Product by Growth with Alex
          </a>
        </div>
      </footer>
    </main>
  );
}
