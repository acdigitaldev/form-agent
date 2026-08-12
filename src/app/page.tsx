import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="font-semibold tracking-tight">AgentForms</span>
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

      <section className="mx-auto max-w-3xl px-6 py-24 text-center flex flex-col items-center gap-6">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Forms &amp; lead capture, built for AI agents
        </h1>
        <p className="text-lg text-black/70 dark:text-white/70 max-w-2xl">
          Connect once from Claude, ChatGPT, or any MCP client. Create as many forms as you want with
          a single tool call, get a hosted link instantly, and watch leads land in one dashboard.
        </p>
        <div className="flex gap-3">
          <Link
            href="/register"
            className="rounded-md bg-foreground text-background px-5 py-2.5 font-medium hover:opacity-90"
          >
            Create your account
          </Link>
          <a
            href="#how-it-works"
            className="rounded-md border border-black/15 dark:border-white/20 px-5 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            How it works
          </a>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-4xl px-6 pb-24 grid sm:grid-cols-3 gap-8">
        {[
          {
            step: "1",
            title: "Connect",
            body: "Add the AgentForms MCP server to Claude or a custom GPT action with one API key.",
          },
          {
            step: "2",
            title: "Create",
            body: "Tell your agent what you need — it calls create_form and you get a live URL back instantly.",
          },
          {
            step: "3",
            title: "Capture",
            body: "Share the link anywhere. Every submission lands in your dashboard, ready to export.",
          },
        ].map((item) => (
          <div key={item.step} className="flex flex-col gap-2">
            <span className="text-sm font-mono text-black/40 dark:text-white/40">Step {item.step}</span>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-black/70 dark:text-white/70">{item.body}</p>
          </div>
        ))}
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
