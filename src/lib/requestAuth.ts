import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getWorkspaceFromApiKey } from "@/lib/apiKeys";
import { getUserWorkspace } from "@/lib/workspace";

/** Resolves the workspace a request is acting on behalf of: API key (agents) or session (dashboard). */
export async function resolveWorkspace(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const rawKey = authHeader.slice("Bearer ".length).trim();
    return getWorkspaceFromApiKey(rawKey);
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;

  return getUserWorkspace(userId);
}
