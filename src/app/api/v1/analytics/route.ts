import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { getAnalyticsSummary } from "@/lib/formsService";

export async function GET(req: NextRequest) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const summary = await getAnalyticsSummary(workspace.id);
  return NextResponse.json(summary);
}
