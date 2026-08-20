import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { parseFields } from "@/lib/formFields";
import { parseTheme, resolveTheme } from "@/lib/formTheme";
import { isPro } from "@/lib/plan";
import { PublicForm } from "./PublicForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const form = await prisma.form.findUnique({ where: { slug } });
  if (!form) return {};
  return { title: form.publicTitle || form.name };
}

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
  const theme = resolveTheme(parseTheme(form.theme));

  return (
    <main className={isEmbed ? "flex-1 flex flex-col" : "flex-1 flex flex-col items-center justify-center px-6 py-16"}>
      <div
        className={
          isEmbed
            ? "px-2 py-2"
            : "w-full max-w-lg rounded-lg border border-border bg-surface p-8"
        }
        style={{
          fontSize: theme.fontSizePx,
          ...(theme.textColor ? { color: theme.textColor } : {}),
          ...(!isEmbed
            ? {
                borderRadius: theme.radiusPx,
                ...(theme.cardBackgroundColor ? { backgroundColor: theme.cardBackgroundColor } : {}),
              }
            : {}),
        }}
      >
        <div className="mb-6">
          {form.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.logoUrl} alt="" className="h-10 mb-4 object-contain" />
          )}
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
          theme={theme}
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
