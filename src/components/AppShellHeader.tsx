import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";

export async function AppShellHeader({ active }: { active?: "forms" | "docs" | "pricing" }) {
  const session = await auth();

  const linkClass = (id: string) =>
    `hover:underline ${active === id ? "font-medium text-accent" : "text-black/70 dark:text-white/70"}`;

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo />
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
              className="rounded-md bg-accent text-white px-3 py-1.5 font-medium hover:bg-accent-hover"
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
                className="rounded-md bg-accent text-white px-3 py-1.5 font-medium hover:bg-accent-hover"
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
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-black/50 dark:text-white/50">AgentForms — forms for agents.</span>
        <nav className="flex items-center gap-4 text-xs text-black/40 dark:text-white/40">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/security" className="hover:underline">
            Security
          </Link>
          <a
            href="https://growthwithalex.com/"
            target="_blank"
            rel="noreferrer"
            className="text-black/30 dark:text-white/30 hover:underline"
          >
            Product by Growth with Alex
          </a>
        </nav>
      </div>
    </footer>
  );
}
