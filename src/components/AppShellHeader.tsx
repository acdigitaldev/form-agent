import Link from "next/link";
import { auth } from "@/auth";

export async function AppShellHeader({ active }: { active?: "forms" | "docs" | "pricing" }) {
  const session = await auth();

  const linkClass = (id: string) =>
    `hover:underline ${active === id ? "font-medium" : "text-black/70 dark:text-white/70"}`;

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          AgentForms
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className={linkClass("forms")}>
            Forms
          </Link>
          <Link href="/docs" className={linkClass("docs")}>
            Docs
          </Link>
          <Link href="/pricing" className={linkClass("pricing")}>
            Pricing
          </Link>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-foreground text-background px-3 py-1.5 font-medium hover:opacity-90"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:underline text-black/70 dark:text-white/70">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-foreground text-background px-3 py-1.5 font-medium hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function AppShellFooter() {
  return (
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
  );
}
