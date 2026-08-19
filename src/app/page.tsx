import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { McpFlowDiagram } from "./McpFlowDiagram";
import { PricingSection } from "./PricingSection";
import { FORM_TEMPLATES } from "@/lib/templates";

const FAQ = [
  {
    q: "Is Free really unlimited?",
    a: "Yes — unlimited forms, submissions, and fields. The only thing Free adds is a small “Powered by AgentForms” badge on your public form pages.",
  },
  {
    q: "How does the Claude / MCP connection work?",
    a: "Generate a connector token in the dashboard, paste one URL into Claude Desktop, Claude Code, or any MCP-compatible client — no OAuth, no local install. From there your agent can create, edit, and read forms with plain-language prompts.",
  },
  {
    q: "Can I have a team?",
    a: "Yes, on Pro — invite unlimited teammates into your workspace with owner or member roles.",
  },
  {
    q: "Is there spam protection on public forms?",
    a: "Yes — a hidden honeypot field and a per-IP rate limit on every form, on every plan.",
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="font-semibold tracking-tight">AgentForms</span>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#pricing" className="hover:underline">
              Pricing
            </a>
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

      <section className="mx-auto max-w-3xl px-6 py-24 text-center flex flex-col items-center gap-6">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Forms &amp; lead capture, built for AI agents
        </h1>
        <p className="text-lg text-black/70 dark:text-white/70 max-w-2xl">
          A simpler, more affordable alternative to form builders like Tally — with one-click templates and a
          direct connection to Claude, ChatGPT, and any MCP client. Create as many forms as you want with a
          single tool call, get a hosted link instantly, and watch leads land in one dashboard.
        </p>
        <div className="flex gap-3">
          <Link
            href="/register"
            className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90"
          >
            Create your account
          </Link>
          <a
            href="#pricing"
            className="rounded-md border border-black/15 dark:border-white/20 px-5 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            See pricing
          </a>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-4xl w-full px-6 pb-24 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">From prompt to captured lead</h2>
          <p className="text-black/60 dark:text-white/60">
            One hosted MCP connector links your agent straight to a live form and your dashboard.
          </p>
        </div>
        <McpFlowDiagram />
      </section>

      <section className="bg-black/[0.02] dark:bg-white/[0.03] border-y border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20 flex flex-col gap-10">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Start from a template</h2>
            <p className="text-black/60 dark:text-white/60">
              The right fields, pre-filled, in one click — or ask your agent to do it for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FORM_TEMPLATES.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-background p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-black/50 dark:text-white/50">{t.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl w-full px-6 py-24">
        <PricingSection />
      </section>

      <section className="mx-auto max-w-2xl w-full px-6 pb-24 flex flex-col gap-8">
        <h2 className="text-2xl font-semibold tracking-tight text-center">Frequently asked</h2>
        <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {FAQ.map((item) => (
            <div key={item.q} className="py-5 flex flex-col gap-1.5">
              <p className="font-medium">{item.q}</p>
              <p className="text-sm text-black/60 dark:text-white/60">{item.a}</p>
            </div>
          ))}
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
