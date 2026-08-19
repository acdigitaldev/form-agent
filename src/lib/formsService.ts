import { prisma } from "@/lib/db";
import { z } from "zod";
import { del } from "@vercel/blob";
import { formFieldsSchema, serializeFields, slugify } from "@/lib/formFields";
import { serializeForm, serializeSubmission } from "@/lib/serialize";

export const createFormInput = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  fields: formFieldsSchema,
  successMessage: z.string().max(300).optional(),
  redirectUrl: z.string().url().optional(),
  gdprText: z.string().max(1000).optional(),
  ctaText: z.string().min(1).max(40).optional(),
  webhookUrl: z.string().url().optional(),
});
export type CreateFormInput = z.infer<typeof createFormInput>;

export const updateFormInput = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  fields: formFieldsSchema.optional(),
  successMessage: z.string().max(300).optional(),
  redirectUrl: z.string().url().nullable().optional(),
  gdprText: z.string().max(1000).optional(),
  ctaText: z.string().min(1).max(40).optional(),
  webhookUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateFormInput = z.infer<typeof updateFormInput>;

async function uniqueSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let attempt = 0;
  while (await prisma.form.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
  return slug;
}

export async function listForms(workspaceId: string, sort: "newest" | "oldest" = "newest") {
  const forms = await prisma.form.findMany({
    where: { workspaceId },
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    include: { _count: { select: { submissions: true } } },
  });
  return forms.map(serializeForm);
}

export async function createForm(workspaceId: string, input: CreateFormInput) {
  const slug = await uniqueSlug(input.name);
  const form = await prisma.form.create({
    data: {
      workspaceId,
      name: input.name,
      slug,
      description: input.description,
      fields: serializeFields(input.fields),
      successMessage: input.successMessage ?? "Thanks! Your submission was received.",
      redirectUrl: input.redirectUrl,
      ...(input.gdprText !== undefined ? { gdprText: input.gdprText } : {}),
      ...(input.ctaText !== undefined ? { ctaText: input.ctaText } : {}),
      ...(input.webhookUrl !== undefined ? { webhookUrl: input.webhookUrl } : {}),
    },
    include: { _count: { select: { submissions: true } } },
  });
  return serializeForm(form);
}

export async function getForm(workspaceId: string, formId: string) {
  const form = await prisma.form.findFirst({
    where: { id: formId, workspaceId },
    include: { _count: { select: { submissions: true } } },
  });
  return form ? serializeForm(form) : null;
}

export async function updateForm(workspaceId: string, formId: string, patch: UpdateFormInput) {
  const existing = await prisma.form.findFirst({ where: { id: formId, workspaceId } });
  if (!existing) return null;

  const form = await prisma.form.update({
    where: { id: formId },
    data: {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.fields !== undefined ? { fields: serializeFields(patch.fields) } : {}),
      ...(patch.successMessage !== undefined ? { successMessage: patch.successMessage } : {}),
      ...(patch.redirectUrl !== undefined ? { redirectUrl: patch.redirectUrl } : {}),
      ...(patch.gdprText !== undefined ? { gdprText: patch.gdprText } : {}),
      ...(patch.ctaText !== undefined ? { ctaText: patch.ctaText } : {}),
      ...(patch.webhookUrl !== undefined ? { webhookUrl: patch.webhookUrl } : {}),
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
    },
    include: { _count: { select: { submissions: true } } },
  });
  return serializeForm(form);
}

export async function deleteForm(workspaceId: string, formId: string) {
  const existing = await prisma.form.findFirst({ where: { id: formId, workspaceId } });
  if (!existing) return false;

  const uploads = await prisma.fileUpload.findMany({ where: { formId }, select: { blobUrl: true } });
  if (uploads.length > 0) {
    await del(uploads.map((u) => u.blobUrl)).catch(() => {
      // best-effort — the DB rows (and thus quota accounting) are removed either way via cascade
    });
  }

  await prisma.form.delete({ where: { id: formId } });
  return true;
}

export async function listSubmissionsForForm(workspaceId: string, formId: string, limit = 50) {
  const form = await prisma.form.findFirst({ where: { id: formId, workspaceId } });
  if (!form) return null;

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({ where: { formId }, orderBy: { createdAt: "desc" }, take: limit }),
    prisma.submission.count({ where: { formId } }),
  ]);

  return { formId, total, submissions: submissions.map(serializeSubmission) };
}

export async function listAllSubmissions(
  workspaceId: string,
  opts: { formId?: string; limit?: number } = {}
) {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const where = { form: { workspaceId, ...(opts.formId ? { id: opts.formId } : {}) } };

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { form: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    total,
    submissions: submissions.map((s) => ({ ...serializeSubmission(s), form: s.form })),
  };
}

export async function getAnalyticsSummary(workspaceId: string) {
  const now = new Date();
  const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const since7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalForms, totalSubmissions, last7Days, last30Days, submissions30] = await Promise.all([
    prisma.form.count({ where: { workspaceId } }),
    prisma.submission.count({ where: { form: { workspaceId } } }),
    prisma.submission.count({ where: { form: { workspaceId }, createdAt: { gte: since7 } } }),
    prisma.submission.count({ where: { form: { workspaceId }, createdAt: { gte: since30 } } }),
    prisma.submission.findMany({
      where: { form: { workspaceId }, createdAt: { gte: since30 } },
      select: { createdAt: true, formId: true, form: { select: { name: true } } },
    }),
  ]);

  const dayBuckets = new Map<string, number>();
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dayBuckets.set(d.toISOString().slice(0, 10), 0);
  }

  const formCounts = new Map<string, { name: string; count: number }>();
  for (const s of submissions30) {
    const day = s.createdAt.toISOString().slice(0, 10);
    if (dayBuckets.has(day)) dayBuckets.set(day, (dayBuckets.get(day) ?? 0) + 1);
    const existing = formCounts.get(s.formId);
    formCounts.set(s.formId, { name: s.form.name, count: (existing?.count ?? 0) + 1 });
  }

  const topForms = Array.from(formCounts.entries())
    .map(([formId, v]) => ({ formId, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalForms,
    totalSubmissions,
    last7Days,
    last30Days,
    daily: Array.from(dayBuckets.entries()).map(([date, count]) => ({ date, count })),
    topForms,
  };
}
