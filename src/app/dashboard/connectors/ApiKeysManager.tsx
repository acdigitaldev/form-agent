"use client";

import { useState } from "react";

type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

export function ApiKeysManager({ initialKeys, appUrl }: { initialKeys: ApiKeyRow[]; appUrl: string }) {
  const [keys, setKeys] = useState(initialKeys);
  const [name, setName] = useState("");
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Give the token a name (e.g. Claude Desktop)");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/v1/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setCreating(false);

    if (!res.ok) {
      setError("Failed to create token");
      return;
    }
    const body = await res.json();
    setKeys([{ ...body.apiKey, lastUsedAt: null }, ...keys]);
    setNewSecret(body.secret);
    setName("");
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this token? Any agent using it will lose access immediately.")) return;
    const res = await fetch(`/api/v1/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) setKeys(keys.filter((k) => k.id !== id));
  }

  const mcpUrl = newSecret ? `${appUrl}/api/mcp/${newSecret}` : null;

  return (
    <section className="flex flex-col gap-4">
      {newSecret && mcpUrl && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 flex flex-col gap-3">
          <p className="text-sm font-medium">Copy these now — you won&apos;t see them again</p>
          <div>
            <p className="text-xs text-black/50 dark:text-white/50 mb-1">MCP server URL (paste anywhere)</p>
            <code className="text-sm break-all block">{mcpUrl}</code>
          </div>
          <div>
            <p className="text-xs text-black/50 dark:text-white/50 mb-1">Raw token (for ChatGPT / REST API)</p>
            <code className="text-sm break-all block">{newSecret}</code>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(mcpUrl);
              setNewSecret(null);
            }}
            className="self-start text-sm rounded-md border border-black/15 dark:border-white/20 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Copy URL &amp; dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleCreate} className="flex items-end gap-3">
        <label className="flex flex-col gap-1 text-sm flex-1">
          New token name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Claude Desktop"
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </label>
        <button
          type="submit"
          disabled={creating}
          className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-hover disabled:opacity-50"
        >
          {creating ? "Creating…" : "Generate token"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {keys.length > 0 && (
        <table className="w-full text-sm">
          <thead className="text-left text-black/50 dark:text-white/50">
            <tr>
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Token</th>
              <th className="py-2 font-medium">Last used</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-t border-black/10 dark:border-white/10">
                <td className="py-2">{k.name}</td>
                <td className="py-2 font-mono text-xs">{k.keyPrefix}…</td>
                <td className="py-2 text-black/50 dark:text-white/50">
                  {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString("en-US") : "Never"}
                </td>
                <td className="py-2 text-right">
                  <button onClick={() => handleRevoke(k.id)} className="text-red-600 hover:underline">
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
