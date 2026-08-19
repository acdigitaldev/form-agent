import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { prisma } from "@/lib/db";
import { parseFields } from "@/lib/formFields";
import { toCsv } from "@/lib/csv";
import { isPro } from "@/lib/plan";

export async function GET(req: NextRequest) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isPro(workspace)) {
    return NextResponse.json(
      { error: "CSV export is a Pro feature. Upgrade from Settings to export submissions.", requiresPro: true },
      { status: 402 }
    );
  }

  const formId = req.nextUrl.searchParams.get("formId") ?? undefined;
  const where = { form: { workspaceId: workspace.id, ...(formId ? { id: formId } : {}) } };

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000,
    include: { form: { select: { id: true, name: true, fields: true } } },
  });

  let csv: string;
  let filename: string;

  if (formId && submissions.length > 0) {
    const fields = parseFields(submissions[0].form.fields);
    const headers = ["Submitted at", ...fields.map((f) => f.label)];
    const rows = submissions.map((s) => {
      const data = JSON.parse(s.data) as Record<string, unknown>;
      return [s.createdAt.toISOString(), ...fields.map((f) => data[f.id] ?? "")];
    });
    csv = toCsv(headers, rows);
    filename = `${submissions[0].form.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-submissions.csv`;
  } else {
    const headers = ["Form", "Submitted at", "Data"];
    const rows = submissions.map((s) => [s.form.name, s.createdAt.toISOString(), s.data]);
    csv = toCsv(headers, rows);
    filename = "submissions.csv";
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
