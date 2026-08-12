import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserWorkspace, createWorkspaceForUser } from "@/lib/workspace";
import { AccountMenu } from "./AccountMenu";

const NAV_LINKS = [
  { href: "/dashboard", label: "Forms" },
  { href: "/dashboard/submissions", label: "Submissions" },
  { href: "/dashboard/connectors", label: "Connectors" },
  { href: "/dashboard/docs", label: "Docs" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;
  let workspace = await getUserWorkspace(userId);
  if (!workspace) {
    workspace = await createWorkspaceForUser(userId, `${session.user.email?.split("@")[0] ?? "My"}'s workspace`);
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-semibold tracking-tight">
              AgentForms
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <AccountMenu email={session.user.email ?? ""} workspaceName={workspace.name} />
        </div>
      </header>
      <div className="mx-auto max-w-6xl w-full px-6 py-10 flex-1">{children}</div>
      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center">
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
    </div>
  );
}
