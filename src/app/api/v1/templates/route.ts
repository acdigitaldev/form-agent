import { NextResponse } from "next/server";
import { FORM_TEMPLATES } from "@/lib/templates";

export async function GET() {
  return NextResponse.json({
    templates: FORM_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      fields: t.fields,
    })),
  });
}
