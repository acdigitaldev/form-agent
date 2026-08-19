import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { head } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { parseFields, MAX_FILE_SIZE_BYTES, MAX_WORKSPACE_STORAGE_BYTES } from "@/lib/formFields";
import { isPro } from "@/lib/plan";
import { isRateLimited } from "@/lib/rateLimit";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = getClientIp(req);
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const form = await prisma.form.findUnique({ where: { slug }, include: { workspace: true } });
        if (!form || !form.isActive) throw new Error("Form not found");
        if (!isPro(form.workspace)) throw new Error("File uploads are a Pro-only feature");

        let fieldId: string | undefined;
        try {
          fieldId = clientPayload ? (JSON.parse(clientPayload) as { fieldId?: string }).fieldId : undefined;
        } catch {
          // fieldId stays undefined, rejected below
        }
        const fields = parseFields(form.fields);
        const field = fields.find((f) => f.id === fieldId && f.type === "file");
        if (!field) throw new Error("This field does not accept file uploads");

        if (isRateLimited(`upload:${form.workspaceId}`, 50, 60 * 60_000) || isRateLimited(`upload-ip:${ip}`, 50, 60 * 60_000)) {
          throw new Error("Too many uploads, please try again later");
        }

        const usage = await prisma.fileUpload.aggregate({
          where: { workspaceId: form.workspaceId },
          _sum: { sizeBytes: true },
        });
        if ((usage._sum.sizeBytes ?? 0) >= MAX_WORKSPACE_STORAGE_BYTES) {
          throw new Error("This workspace has reached its file storage limit");
        }

        return {
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
          tokenPayload: JSON.stringify({ formId: form.id, workspaceId: form.workspaceId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!tokenPayload) return;
        const { formId, workspaceId } = JSON.parse(tokenPayload) as { formId: string; workspaceId: string };
        const meta = await head(blob.url).catch(() => null);
        await prisma.fileUpload.create({
          data: {
            workspaceId,
            formId,
            blobUrl: blob.url,
            pathname: blob.pathname,
            sizeBytes: meta?.size ?? 0,
            contentType: blob.contentType,
          },
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 400 });
  }
}
