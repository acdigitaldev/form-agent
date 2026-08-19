import Link from "next/link";
import { AppShellHeader, AppShellFooter } from "@/components/AppShellHeader";
import { PricingSection } from "@/app/PricingSection";

export const metadata = { title: "Pricing — AgentForms" };

const FAQ = [
  {
    q: "Is Free really unlimited?",
    a: "Yes — unlimited forms, submissions, and fields. The only thing Free adds is a small “Powered by AgentForms” badge on your public form pages.",
  },
  {
    q: "Do I need to pick a plan before I can try it?",
    a: "No — build the whole form on the homepage first, with no account. You only sign up (and choose a plan) when you're ready to publish it.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, anytime from Settings — upgrades and downgrades take effect immediately.",
  },
];

export default async function PricingPage() {
  return (
    <main className="flex-1 flex flex-col">
      <AppShellHeader active="pricing" />

      <section className="mx-auto max-w-5xl w-full px-6 py-20">
        <PricingSection />
      </section>

      <section className="mx-auto max-w-2xl w-full px-6 pb-20 flex flex-col gap-8">
        <h2 className="text-2xl font-semibold tracking-tight text-center">Frequently asked</h2>
        <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {FAQ.map((item) => (
            <div key={item.q} className="py-5 flex flex-col gap-1.5">
              <p className="font-medium">{item.q}</p>
              <p className="text-sm text-black/60 dark:text-white/60">{item.a}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-center text-black/50 dark:text-white/50">
          More questions? See the full <Link href="/docs#faq" className="underline">FAQ in Docs</Link>.
        </p>
      </section>

      <AppShellFooter />
    </main>
  );
}
