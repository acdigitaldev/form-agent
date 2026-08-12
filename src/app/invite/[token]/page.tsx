import { prisma } from "@/lib/db";
import { InviteAcceptForm } from "./InviteAcceptForm";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({ where: { token }, include: { workspace: true } });

  if (!invite || invite.acceptedAt) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold">This invite isn&apos;t valid</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-2">
            It may have already been used, or the link is incorrect. Ask whoever invited you to send a new
            one.
          </p>
        </div>
      </main>
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Join {invite.workspace.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            You&apos;ve been invited as <strong>{invite.email}</strong> ({invite.role}).
          </p>
        </div>
        <InviteAcceptForm token={token} email={invite.email} userExists={Boolean(existingUser)} />
      </div>
    </main>
  );
}
