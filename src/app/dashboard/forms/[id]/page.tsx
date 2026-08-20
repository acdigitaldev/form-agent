import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUserWorkspace } from "@/lib/workspace";
import { getForm } from "@/lib/formsService";
import { isPro } from "@/lib/plan";
import { CopyButton } from "./CopyButton";
import { FormSettingsEditor } from "./FormSettingsEditor";

export default async function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const workspace = await getUserWorkspace(userId);
  if (!workspace) notFound();

  const form = await getForm(workspace.id, id);
  if (!form) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/dashboard" className="text-sm text-black/50 dark:text-white/50 hover:underline">
          ← Forms
        </Link>
        <div className="flex items-start justify-between mt-2 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
            {form.description && (
              <p className="text-sm text-black/60 dark:text-white/60 mt-1">{form.description}</p>
            )}
          </div>
          <Link
            href={`/dashboard/submissions?formId=${form.id}`}
            className="text-sm rounded-md border border-black/15 dark:border-white/20 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            View submissions ({form.submissionCount ?? 0})
          </Link>
        </div>
      </div>

      <section className="rounded-lg border border-black/10 dark:border-white/10 p-5 flex flex-col gap-3">
        <h2 className="font-medium text-sm">Public link</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-sm rounded bg-black/5 dark:bg-white/10 px-3 py-1.5 break-all">
            {form.publicUrl}
          </code>
          <CopyButton text={form.publicUrl} />
          <a
            href={form.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline text-black/60 dark:text-white/60"
          >
            Open
          </a>
        </div>
        <h2 className="font-medium text-sm mt-2">Embed snippet</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-xs rounded bg-black/5 dark:bg-white/10 px-3 py-1.5 break-all">
            {`<iframe src="${form.publicUrl}?embed=1" style="width:100%;border:0;min-height:480px" title="${form.name}"></iframe>`}
          </code>
          <CopyButton
            text={`<iframe src="${form.publicUrl}?embed=1" style="width:100%;border:0;min-height:480px" title="${form.name}"></iframe>`}
          />
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">Settings</h2>
        <FormSettingsEditor
          formId={form.id}
          initialName={form.name}
          initialDescription={form.description ?? ""}
          initialFields={form.fields}
          initialIsActive={form.isActive}
          initialSuccessMessage={form.successMessage}
          initialRedirectUrl={form.redirectUrl ?? ""}
          initialGdprText={form.gdprText}
          initialCtaText={form.ctaText}
          initialWebhookUrl={form.webhookUrl ?? ""}
          initialSlug={form.slug}
          initialPublicTitle={form.publicTitle ?? ""}
          initialLogoUrl={form.logoUrl ?? ""}
          origin={process.env.APP_URL ?? "http://localhost:3000"}
          isPro={isPro(workspace)}
        />
      </section>
    </div>
  );
}
