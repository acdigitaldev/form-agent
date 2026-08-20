"use client";

import { useState } from "react";

const TABS = ["Claude Desktop", "Claude Code", "ChatGPT", "Other"] as const;
type Tab = (typeof TABS)[number];

export function ConnectorTabs({ serverUrl }: { serverUrl: string }) {
  const [tab, setTab] = useState<Tab>("Claude Desktop");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-sm border ${
              tab === t
                ? "border-foreground bg-accent text-white"
                : "border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Claude Desktop" && (
        <ol className="flex flex-col gap-3 text-sm">
          <Step n={1} title="Open Settings">
            Go to <strong>Settings → Connectors</strong>.
          </Step>
          <Step n={2} title="Add custom connector">
            Click <strong>Add custom connector</strong> and paste the server URL above (with your real
            token instead of <code>&lt;your-token&gt;</code>).
          </Step>
          <Step n={3} title="Done">
            No OAuth, no client ID/secret — the token in the URL is all the auth it needs.
          </Step>
        </ol>
      )}

      {tab === "Claude Code" && (
        <div className="flex flex-col gap-3 text-sm">
          <p>Run this once, with your real token in place of the placeholder:</p>
          <pre className="text-xs rounded bg-black/5 dark:bg-white/10 p-3 overflow-x-auto">
            claude mcp add --transport http agentforms {serverUrl}
          </pre>
        </div>
      )}

      {tab === "ChatGPT" && (
        <ol className="flex flex-col gap-3 text-sm">
          <Step n={1} title="Create a Custom GPT Action">
            In your GPT&apos;s <strong>Actions</strong>, import the schema from{" "}
            <code>{serverUrl.split("/api/")[0]}/openapi.json</code>.
          </Step>
          <Step n={2} title="Set authentication">
            Choose <strong>API key → Bearer</strong> and paste your token (the same one from the URL
            above, without the rest of the path).
          </Step>
        </ol>
      )}

      {tab === "Other" && (
        <div className="flex flex-col gap-3 text-sm">
          <p>
            Any MCP client that supports remote servers over Streamable HTTP works — Cursor, Windsurf,
            custom agents, etc. Point it at the server URL above; no headers or extra config needed since
            the token is embedded in the URL itself.
          </p>
        </div>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-medium">
        {n}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-black/60 dark:text-white/60">{children}</p>
      </div>
    </li>
  );
}
