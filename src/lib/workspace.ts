import { prisma } from "@/lib/db";

/** MVP: one workspace per user, resolved via their (first) membership. */
export async function getUserWorkspace(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });
  return membership?.workspace ?? null;
}

export async function getUserMembership(userId: string) {
  return prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createWorkspaceForUser(userId: string, name: string) {
  const workspace = await prisma.workspace.create({ data: { name } });
  await prisma.membership.create({
    data: { userId, workspaceId: workspace.id, role: "owner" },
  });
  return workspace;
}
