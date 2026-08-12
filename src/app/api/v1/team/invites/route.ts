import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserMembership } from "@/lib/workspace";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "member"]).default("member"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await getUserMembership(userId);
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });
  if (membership.role !== "owner") {
    return NextResponse.json({ error: "Only workspace owners can invite people" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();

  const alreadyMember = await prisma.membership.findFirst({
    where: { workspaceId: membership.workspaceId, user: { email } },
  });
  if (alreadyMember) {
    return NextResponse.json({ error: "That person is already a member" }, { status: 409 });
  }

  const token = nanoid(24);
  const invite = await prisma.invite.create({
    data: { workspaceId: membership.workspaceId, email, role: parsed.data.role, token },
  });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  return NextResponse.json(
    {
      invite: { id: invite.id, email: invite.email, role: invite.role, createdAt: invite.createdAt },
      inviteUrl: `${appUrl}/invite/${token}`,
    },
    { status: 201 }
  );
}
