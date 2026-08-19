import { parseFields } from "@/lib/formFields";

type FormRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  fields: string;
  gdprText: string;
  ctaText: string;
  successMessage: string;
  redirectUrl: string | null;
  webhookUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: { submissions: number };
};

export function serializeForm(form: FormRecord) {
  return {
    id: form.id,
    name: form.name,
    slug: form.slug,
    description: form.description,
    fields: parseFields(form.fields),
    gdprText: form.gdprText,
    ctaText: form.ctaText,
    successMessage: form.successMessage,
    redirectUrl: form.redirectUrl,
    webhookUrl: form.webhookUrl,
    isActive: form.isActive,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
    submissionCount: form._count?.submissions ?? undefined,
    publicUrl: `${process.env.APP_URL ?? "http://localhost:3000"}/f/${form.slug}`,
  };
}

export function serializeSubmission(submission: { id: string; data: string; createdAt: Date; sourceIp: string | null }) {
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(submission.data);
  } catch {
    data = {};
  }
  return {
    id: submission.id,
    data,
    createdAt: submission.createdAt,
    sourceIp: submission.sourceIp,
  };
}
