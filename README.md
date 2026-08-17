# AgentForms

Forms and lead capture for AI agents. Connect once — from Claude, ChatGPT, or any MCP-compatible client — create as many forms as you want, and every submission lands in one dashboard.

## How it's put together

- **`/` (this repo)** — Next.js app: the dashboard (forms, submissions/analytics, connectors, docs, team settings), the hosted public form pages (`/f/[slug]`), and the REST API (`/api/v1/*` + `/api/public/*`) everything else talks to.
- **`/api/mcp/[token]`** (Pages Router) — a stateless, hosted **remote MCP server** over Streamable HTTP. Paste `https://<domain>/api/mcp/<token>` into any MCP client — no local install, no OAuth dance.
- **`mcp-server/`** — an alternative stdio MCP server for running locally, wrapping the same REST API. Kept for power users; the hosted URL above is the primary path.
- **`public/openapi.json`** — the REST API as an OpenAPI 3.1 schema, for ChatGPT Custom GPT Actions.

One backend, driven by the dashboard, the hosted MCP endpoint, the stdio MCP server, or the OpenAPI action — all authenticated the same way.

### Data model

Multi-tenant: `User` ⟷ `Membership` ⟷ `Workspace`. Each `Form` and `ApiKey` belongs to a `Workspace`, not a user directly — so a team can share forms and a connector token. Registration auto-creates a personal workspace; `Invite` rows (with a one-time token link) add teammates. Forms carry `fields` (JSON), a `gdprText` privacy notice rendered under the submit button, success/redirect settings, and roll up into `Submission` rows.

Runs on **Postgres via Prisma** (currently Neon in production). Migrations live in `prisma/migrations`; `npm run build` runs `prisma migrate deploy` automatically before `next build`, so pushing to `main` both migrates and deploys.

## Local development

```bash
npm install
# set DATABASE_URL in .env to a real Postgres connection string
# (e.g. the same Neon database used in production, or any local Postgres)
npx prisma migrate deploy
npm run dev               # http://localhost:3020
```

Visit `/register` to create an account (auto-creates your workspace), then `/dashboard` to create your first form via the step-by-step wizard. Every form gets a public URL at `/f/<slug>`.

## Connecting an agent

Go to **Connectors** in the dashboard and generate a token — this gives you a ready-to-paste server URL:

```
https://<domain>/api/mcp/<token>
```

- **Claude Desktop**: Settings → Connectors → Add custom connector → paste the URL. No OAuth, no client ID/secret.
- **Claude Code**: `claude mcp add --transport http agentforms <url>`
- **ChatGPT**: import `<domain>/openapi.json` as a Custom GPT Action, authenticate with the raw token as a Bearer key.
- **Other MCP clients** (Cursor, Windsurf, etc.): any client that supports remote MCP over Streamable HTTP works — just point it at the URL.

Six tools are exposed: `create_form`, `list_forms`, `get_form`, `update_form`, `delete_form`, `list_submissions`. Full walkthroughs live on the in-app **Docs** page.

## Team & workspaces

Owners can invite teammates from **Settings** — since there's no email service wired up, invites generate a one-time link you share yourself (shown once, same pattern as connector tokens). Invitees either log in (if they already have an account) or set a password to join. Owners can manage members and revoke invites; a workspace always keeps at least one owner.

## Deploying

- **App**: Vercel, deployed from this repo's `main` branch.
- **Database**: Neon Postgres. `DATABASE_URL` is set in the Vercel project's environment variables (Production, Preview, and Development) — never committed to the repo.
- `AUTH_SECRET` is also set as a Vercel environment variable, generated fresh for production (not the dev placeholder in `.env`).
- `APP_URL` / `NEXTAUTH_URL` should match the production domain — public form links, connector URLs, and the OpenAPI schema are all generated from `APP_URL`.

## Notes on spam protection

Public submissions get a honeypot field (`_hp`) and a best-effort in-memory rate limit (10 submissions/min per IP per form). The rate limiter is per-process — fine for a single instance, not distributed-safe. Swap for a Redis-backed limiter if you scale to multiple instances.
