import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserMembership } from "@/lib/workspace";
import { TeamManager } from "./TeamManager";

export default async function SettingsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const membership = await getUserMembership(userId);

  if (!membership) return null;

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

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          {workspace?.name} · {session!.user!.email} · you are{" "}
          {membership.role === "owner" ? "an owner" : "a member"}
        </p>
      </div>

      <TeamManager
        currentUserId={userId}
        canManage={membership.role === "owner"}
        initialMembers={memberships.map((m) => ({
          membershipId: m.id,
          userId: m.userId,
          email: m.user.email,
          role: m.role,
        }))}
        initialInvites={invites.map((i) => ({
          id: i.id,
          email: i.email,
          role: i.role,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
