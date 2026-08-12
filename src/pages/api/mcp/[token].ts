import type { NextApiRequest, NextApiResponse } from "next";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { getWorkspaceFromApiKey } from "@/lib/apiKeys";
import { buildMcpServerForWorkspace } from "@/lib/mcpServerFactory";

// Stateless remote MCP server, keyed by a per-workspace token in the URL path.
// Any MCP client (Claude, Cursor, etc.) connects by pasting:
//   https://<domain>/api/mcp/<token>
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const workspace = await getWorkspaceFromApiKey(token);
  if (!workspace) {
    res.status(401).json({ error: "Invalid or revoked token" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed — this endpoint is a stateless MCP server (POST only)" });
    return;
  }

  const server = buildMcpServerForWorkspace(workspace.id);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
