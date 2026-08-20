import Link from "next/link";
import { auth } from "@/auth";
import { getUserWorkspace } from "@/lib/workspace";
import { listForms } from "@/lib/formsService";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const workspace = await getUserWorkspace(userId);
  const { sort } = await searchParams;
  const sortOrder = sort === "oldest" ? "oldest" : "newest";

  const forms = workspace ? await listForms(workspace.id, sortOrder) : [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your forms</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            Created by you or by an agent connected via MCP / API key.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-black/15 dark:border-white/20 text-sm overflow-hidden">
            <Link
              href="/dashboard?sort=newest"
              className={`px-3 py-1.5 ${sortOrder === "newest" ? "bg-accent text-white" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
            >
              Newest
            </Link>
            <Link
              href="/dashboard?sort=oldest"
              className={`px-3 py-1.5 border-l border-black/15 dark:border-white/20 ${sortOrder === "oldest" ? "bg-accent text-white" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
            >
              Oldest
            </Link>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-hover"
          >
            New form
          </Link>
        </div>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/15 dark:border-white/20 px-6 py-16 text-center flex flex-col items-center gap-3">
          <p className="font-medium">No forms yet</p>
          <p className="text-sm text-black/60 dark:text-white/60 max-w-sm">
            Create one manually, or connect the AgentForms MCP server and ask your agent to create one for
            you.
          </p>
          <Link
            href="/dashboard/new"
            className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-hover mt-2"
          >
            Create your first form
          </Link>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {forms.map((form) => (
            <li key={form.id}>
              <Link
                href={`/dashboard/forms/${form.id}`}
                className="block rounded-lg border border-black/10 dark:border-white/10 p-5 hover:border-black/30 dark:hover:border-white/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium">{form.name}</h2>
                  {!form.isActive && (
                    <span className="text-xs rounded bg-black/10 dark:bg-white/10 px-2 py-0.5">Paused</span>
                  )}
                </div>
                {form.description && (
                  <p className="text-sm text-black/60 dark:text-white/60 mt-1 line-clamp-2">
                    {form.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-sm text-black/50 dark:text-white/50">
                  <span>{form.submissionCount} submissions</span>
                  <span className="font-mono text-xs">/f/{form.slug}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
