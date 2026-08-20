import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { listForms, createForm, createFormInput, SlugTakenError } from "@/lib/formsService";
import { isPro } from "@/lib/plan";
import { hasFileField } from "@/lib/formFields";

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
  if (parsed.data.webhookUrl && !isPro(workspace)) {
    return NextResponse.json(
      { error: "Webhooks are a Pro feature. Upgrade from Settings to use them.", requiresPro: true },
      { status: 402 }
    );
  }
  if (hasFileField(parsed.data.fields) && !isPro(workspace)) {
    return NextResponse.json(
      { error: "File upload fields are a Pro feature. Upgrade from Settings to use them.", requiresPro: true },
      { status: 402 }
    );
  }

  try {
    const form = await createForm(workspace.id, parsed.data);
    return NextResponse.json({ form }, { status: 201 });
  } catch (err) {
    if (err instanceof SlugTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
