import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { listForms, createForm, createFormInput } from "@/lib/formsService";

export async function GET(req: NextRequest) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sort = req.nextUrl.searchParams.get("sort") === "oldest" ? "oldest" : "newest";
  const forms = await listForms(workspace.id, sort);
  return NextResponse.json({ forms });
}

export async function POST(req: NextRequest) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createFormInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const form = await createForm(workspace.id, parsed.data);
  return NextResponse.json({ form }, { status: 201 });
}
