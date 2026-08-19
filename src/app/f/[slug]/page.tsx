import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseFields } from "@/lib/formFields";
import { isPro } from "@/lib/plan";
import { PublicForm } from "./PublicForm";

export default async function PublicFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embed?: string }>;
}) {
  const { slug } = await params;
  const { embed } = await searchParams;
  const form = await prisma.form.findUnique({ where: { slug }, include: { workspace: true } });

  if (!form || !form.isActive) notFound();

  const fields = parseFields(form.fields);
  const isEmbed = embed === "1";
  const showBadge = !isPro(form.workspace);

  return (
    <main className={isEmbed ? "flex-1 flex flex-col" : "flex-1 flex flex-col items-center justify-center px-6 py-16"}>
      <div className={isEmbed ? "px-2 py-2" : "w-full max-w-lg"}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
          {form.description && (
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">{form.description}</p>
          )}
        </div>
        <PublicForm
          slug={slug}
          fields={fields}
          successMessage={form.successMessage}
          gdprText={form.gdprText}
          ctaText={form.ctaText}
        />
      </div>
      {showBadge && (
        <a
          href={process.env.APP_URL ?? "http://localhost:3000"}
          target="_blank"
          rel="noreferrer"
          className="mt-8 text-xs text-black/30 dark:text-white/30 hover:text-black/50 dark:hover:text-white/50"
        >
          Powered by <span className="font-medium">AgentForms</span>
        </a>
      )}
    </main>
  );
}
