import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserMembership } from "@/lib/workspace";

const updateSchema = z.object({
  plan: z.enum(["free", "pro"]).optional(),
  billingInterval: z.enum(["monthly", "yearly"]).nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await getUserMembership(userId);
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });
  if (membership.role !== "owner") {
    return NextResponse.json({ error: "Only workspace owners can change the plan" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const workspace = await prisma.workspace.update({
    where: { id: membership.workspaceId },
    data: {
      ...(parsed.data.plan !== undefined ? { plan: parsed.data.plan } : {}),
      ...(parsed.data.billingInterval !== undefined ? { billingInterval: parsed.data.billingInterval } : {}),
    },
  });

  return NextResponse.json({ workspace });
}
