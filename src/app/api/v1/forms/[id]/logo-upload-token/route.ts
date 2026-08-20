import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { resolveWorkspace } from "@/lib/requestAuth";
import { isPro } from "@/lib/plan";
import { MAX_LOGO_SIZE_BYTES } from "@/lib/formFields";

const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = await resolveWorkspace(req);
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isPro(workspace)) {
    return NextResponse.json({ error: "A custom logo is a Pro feature." }, { status: 402 });
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const form = await prisma.form.findFirst({ where: { id, workspaceId: workspace.id } });
        if (!form) throw new Error("Form not found");

        return {
          allowedContentTypes: ALLOWED_LOGO_TYPES,
          maximumSizeInBytes: MAX_LOGO_SIZE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ formId: form.id, previousLogoUrl: form.logoUrl }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!tokenPayload) return;
        const { formId, previousLogoUrl } = JSON.parse(tokenPayload) as {
          formId: string;
          previousLogoUrl: string | null;
        };
        await prisma.form.update({ where: { id: formId }, data: { logoUrl: blob.url } });
        if (previousLogoUrl) {
          await del(previousLogoUrl).catch(() => {
            // best-effort — a stray blob left behind isn't worth failing the upload over
          });
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 400 });
  }
}
