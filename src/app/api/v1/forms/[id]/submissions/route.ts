import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { listSubmissionsForForm } from "@/lib/formsService";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitParam) ? limitParam : 50;

  const result = await listSubmissionsForForm(workspace.id, id, limit);
  if (!result) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  return NextResponse.json(result);
}
