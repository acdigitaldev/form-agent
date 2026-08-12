import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({ where: { token }, include: { workspace: true } });

  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ error: "This invite is invalid or has already been used" }, { status: 404 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });

  return NextResponse.json({
    email: invite.email,
    workspaceName: invite.workspace.name,
    role: invite.role,
    userExists: Boolean(existingUser),
  });
}
