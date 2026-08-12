import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const acceptSchema = z.object({
  password: z.string().min(8).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ error: "This invite is invalid or has already been used" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = acceptSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });

  let userId: string;

  if (existingUser) {
    const session = await auth();
    const sessionEmail = session?.user?.email?.toLowerCase();
    if (sessionEmail !== invite.email) {
      return NextResponse.json(
        { error: "Log in with the invited email address, then open this link again", requiresLogin: true },
        { status: 401 }
      );
    }
    userId = existingUser.id;
  } else {
    if (!parsed.data.password) {
      return NextResponse.json({ error: "Password is required to create your account", requiresPassword: true }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({ data: { email: invite.email, passwordHash } });
    userId = user.id;
  }

  await prisma.membership.upsert({
    where: { userId_workspaceId: { userId, workspaceId: invite.workspaceId } },
    update: {},
    create: { userId, workspaceId: invite.workspaceId, role: invite.role },
  });

  await prisma.invite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });

  return NextResponse.json({ ok: true, email: invite.email });
}
