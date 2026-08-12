import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserMembership } from "@/lib/workspace";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await getUserMembership(userId);
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const [workspace, memberships, invites] = await Promise.all([
    prisma.workspace.findUnique({ where: { id: membership.workspaceId } }),
    prisma.membership.findMany({
      where: { workspaceId: membership.workspaceId },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.invite.findMany({
      where: { workspaceId: membership.workspaceId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    workspace,
    currentRole: membership.role,
    members: memberships.map((m) => ({
      membershipId: m.id,
      userId: m.userId,
      email: m.user.email,
      role: m.role,
    })),
    invites: invites.map((i) => ({ id: i.id, email: i.email, role: i.role, createdAt: i.createdAt })),
  });
}
