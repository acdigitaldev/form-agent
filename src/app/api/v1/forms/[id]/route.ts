import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/lib/requestAuth";
import { getForm, updateForm, deleteForm, updateFormInput, SlugTakenError } from "@/lib/formsService";
import { isPro } from "@/lib/plan";
import { hasFileField } from "@/lib/formFields";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await getForm(workspace.id, id);
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  return NextResponse.json({ form });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateFormInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form payload", details: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.webhookUrl && !isPro(workspace)) {
    return NextResponse.json(
      { error: "Webhooks are a Pro feature. Upgrade from Settings to use them.", requiresPro: true },
      { status: 402 }
    );
  }
  if (parsed.data.fields && hasFileField(parsed.data.fields) && !isPro(workspace)) {
    return NextResponse.json(
      { error: "File upload fields are a Pro feature. Upgrade from Settings to use them.", requiresPro: true },
      { status: 402 }
    );
  }
  if (parsed.data.logoUrl && !isPro(workspace)) {
    return NextResponse.json(
      { error: "A custom logo is a Pro feature. Upgrade from Settings to use it.", requiresPro: true },
      { status: 402 }
    );
  }

  try {
    const form = await updateForm(workspace.id, id, parsed.data);
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
    return NextResponse.json({ form });
  } catch (err) {
    if (err instanceof SlugTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deleted = await deleteForm(workspace.id, id);
  if (!deleted) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
