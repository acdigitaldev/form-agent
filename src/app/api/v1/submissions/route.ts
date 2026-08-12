import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { listAllSubmissions } from "@/lib/formsService";

export async function GET(req: NextRequest) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formId = req.nextUrl.searchParams.get("formId") ?? undefined;
  const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitParam) ? limitParam : 50;

  const result = await listAllSubmissions(workspace.id, { formId, limit });
  return NextResponse.json(result);
}
