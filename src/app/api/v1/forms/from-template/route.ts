import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveWorkspace } from "@/lib/requestAuth";
import { createForm } from "@/lib/formsService";
import { getTemplate, FORM_TEMPLATES } from "@/lib/templates";
import { formFieldsSchema, hasFileField } from "@/lib/formFields";
import { isPro } from "@/lib/plan";

const bodySchema = z.object({
  templateId: z.enum(FORM_TEMPLATES.map((t) => t.id) as [string, ...string[]]),
  name: z.string().min(1).max(120).optional(),
  extraFields: formFieldsSchema.optional(),
});

export async function POST(req: NextRequest) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const template = getTemplate(parsed.data.templateId);
  if (!template) return NextResponse.json({ error: "Unknown template" }, { status: 404 });

  if (parsed.data.extraFields && hasFileField(parsed.data.extraFields) && !isPro(workspace)) {
    return NextResponse.json(
      { error: "File upload fields are a Pro feature. Upgrade from Settings to use them.", requiresPro: true },
      { status: 402 }
    );
  }

  const form = await createForm(workspace.id, {
    name: parsed.data.name ?? template.name,
    fields: [...template.fields, ...(parsed.data.extraFields ?? [])],
    ctaText: template.ctaText,
    successMessage: template.successMessage,
  });

  return NextResponse.json({ form }, { status: 201 });
}
