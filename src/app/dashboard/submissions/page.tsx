import { auth } from "@/auth";
import { getUserWorkspace } from "@/lib/workspace";
import { listForms, listAllSubmissions, getAnalyticsSummary } from "@/lib/formsService";
import { SubmissionsFilter } from "./SubmissionsFilter";

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col gap-1">
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      <span className="text-xs text-black/50 dark:text-white/50">{label}</span>
    </div>
  );
}

function DailyChart({ daily }: { daily: { date: string; count: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div className="flex items-end gap-[3px] h-24">
      {daily.map((d) => (
        <div
          key={d.date}
          title={`${d.date}: ${d.count}`}
          className="flex-1 rounded-sm bg-foreground/70 hover:bg-foreground transition-colors"
          style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ formId?: string }>;
}) {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const workspace = await getUserWorkspace(userId);
  const { formId } = await searchParams;

  if (!workspace) return null;

  const [forms, analytics, submissionsResult] = await Promise.all([
    listForms(workspace.id),
    getAnalyticsSummary(workspace.id),
    listAllSubmissions(workspace.id, { formId, limit: 100 }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          Every lead captured across all of your forms, in one place.
        </p>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile label="Total forms" value={analytics.totalForms} />
        <StatTile label="Total submissions" value={analytics.totalSubmissions} />
        <StatTile label="Last 7 days" value={analytics.last7Days} />
        <StatTile label="Last 30 days" value={analytics.last30Days} />
      </section>

      <section className="rounded-lg border border-black/10 dark:border-white/10 p-5">
        <h2 className="text-sm font-medium mb-4">Submissions, last 30 days</h2>
        <DailyChart daily={analytics.daily} />
      </section>

      {analytics.topForms.length > 0 && (
        <section>
          <h2 className="text-sm font-medium mb-3">Top forms (last 30 days)</h2>
          <ul className="flex flex-col gap-2">
            {analytics.topForms.map((f) => (
              <li key={f.formId} className="flex items-center justify-between text-sm border-b border-black/5 dark:border-white/10 py-2">
                <span>{f.name}</span>
                <span className="text-black/50 dark:text-white/50">{f.count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-medium">
            All submissions <span className="text-black/40 dark:text-white/40">({submissionsResult.total})</span>
          </h2>
          <SubmissionsFilter forms={forms.map((f) => ({ id: f.id, name: f.name }))} selectedFormId={formId} />
        </div>

        {submissionsResult.submissions.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/5 dark:bg-white/5 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Form</th>
                  <th className="px-4 py-2 font-medium">Submission</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Received</th>
                </tr>
              </thead>
              <tbody>
                {submissionsResult.submissions.map((s) => (
                  <tr key={s.id} className="border-t border-black/10 dark:border-white/10 align-top">
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{s.form.name}</td>
                    <td className="px-4 py-2 text-black/70 dark:text-white/70">
                      {Object.entries(s.data)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-black/50 dark:text-white/50">
                      {new Date(s.createdAt).toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
