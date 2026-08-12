import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserWorkspace } from "@/lib/workspace";
import { ApiKeysManager } from "./ApiKeysManager";
import { ConnectorTabs } from "./ConnectorTabs";
import { CopyButton } from "../forms/[id]/CopyButton";

export default async function ConnectorsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const workspace = await getUserWorkspace(userId);

  const keys = workspace
    ? await prisma.apiKey.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, keyPrefix: true, createdAt: true, lastUsedAt: true },
      })
    : [];

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const serverUrl = `${appUrl}/api/mcp/<your-token>`;

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Connectors</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          Connect Claude, ChatGPT, or any MCP-compatible agent. Hosted — no local setup required.
        </p>
      </div>

      <section className="rounded-lg border border-black/10 dark:border-white/10 p-5 flex flex-col gap-4">
        <div>
          <p className="text-xs text-black/50 dark:text-white/50 mb-1">Server URL</p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm rounded bg-black/5 dark:bg-white/10 px-3 py-1.5 break-all">
              {serverUrl}
            </code>
            <CopyButton text={serverUrl} />
          </div>
          <p className="text-xs text-black/50 dark:text-white/50 mt-2">
            Replace <code>&lt;your-token&gt;</code> with a token generated below. The server is hosted —
            no local install, no database credentials.
          </p>
        </div>

        <ConnectorTabs serverUrl={serverUrl} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-medium">Connector tokens</h2>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            Each token scopes access to this workspace. Revoke anytime — access stops immediately.
          </p>
        </div>
        <ApiKeysManager
          initialKeys={keys.map((k) => ({
            ...k,
            createdAt: k.createdAt.toISOString(),
            lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
          }))}
          appUrl={appUrl}
        />
      </section>
    </div>
  );
}
