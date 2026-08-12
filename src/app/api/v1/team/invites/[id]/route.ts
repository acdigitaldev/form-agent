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
    return NextResponse.json({ error: "Only workspace owners can revoke invites" }, { status: 403 });
  }

  const { id } = await params;
  const invite = await prisma.invite.findFirst({ where: { id, workspaceId: membership.workspaceId } });
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  await prisma.invite.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
