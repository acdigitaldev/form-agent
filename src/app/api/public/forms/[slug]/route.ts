import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseFields } from "@/lib/formFields";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const form = await prisma.form.findUnique({ where: { slug } });

  if (!form || !form.isActive) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: form.id,
    name: form.name,
    description: form.description,
    fields: parseFields(form.fields),
    gdprText: form.gdprText,
    ctaText: form.ctaText,
  });
}
