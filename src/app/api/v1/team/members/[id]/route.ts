import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserMembership } from "@/lib/workspace";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await getUserMembership(userId);
  if (!membership || membership.role !== "owner") {
    return NextResponse.json({ error: "Only workspace owners can remove members" }, { status: 403 });
  }

  const { id } = await params;
  const target = await prisma.membership.findFirst({ where: { id, workspaceId: membership.workspaceId } });
  if (!target) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  if (target.role === "owner") {
    const ownerCount = await prisma.membership.count({
      where: { workspaceId: membership.workspaceId, role: "owner" },
    });
    if (ownerCount <= 1) {
      return NextResponse.json({ error: "A workspace needs at least one owner" }, { status: 400 });
    }
  }

  await prisma.membership.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
