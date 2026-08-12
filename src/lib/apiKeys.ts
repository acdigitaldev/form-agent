import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/db";

const KEY_PREFIX = "af_live_";

export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const token = randomBytes(24).toString("base64url");
  const raw = `${KEY_PREFIX}${token}`;
  const hash = hashApiKey(raw);
  const prefix = raw.slice(0, KEY_PREFIX.length + 6);
  return { raw, hash, prefix };
}

export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export async function getWorkspaceFromApiKey(rawKey: string) {
  const hash = hashApiKey(rawKey);
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
    include: { workspace: true },
  });
  if (!apiKey) return null;

  prisma.apiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return apiKey.workspace;
}
