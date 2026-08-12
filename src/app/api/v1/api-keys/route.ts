import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/apiKeys";
import { getUserWorkspace } from "@/lib/workspace";

const createKeySchema = z.object({
  name: z.string().min(1).max(80),
});

async function requireWorkspace() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  return getUserWorkspace(userId);
}

export async function GET() {
  const workspace = await requireWorkspace();
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, keyPrefix: true, createdAt: true, lastUsedAt: true },
  });

  return NextResponse.json({ apiKeys: keys });
}

export async function POST(req: NextRequest) {
  const workspace = await requireWorkspace();
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createKeySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { raw, hash, prefix } = generateApiKey();
  const apiKey = await prisma.apiKey.create({
    data: { workspaceId: workspace.id, name: parsed.data.name, keyHash: hash, keyPrefix: prefix },
  });

  return NextResponse.json(
    {
      apiKey: { id: apiKey.id, name: apiKey.name, keyPrefix: apiKey.keyPrefix, createdAt: apiKey.createdAt },
      secret: raw,
    },
    { status: 201 }
  );
}
