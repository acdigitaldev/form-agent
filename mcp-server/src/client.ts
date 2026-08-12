const BASE_URL = process.env.AGENTFORMS_BASE_URL ?? "http://localhost:3000";
const API_KEY = process.env.AGENTFORMS_API_KEY;

if (!API_KEY) {
  console.error(
    "[agentforms-mcp] Missing AGENTFORMS_API_KEY environment variable. Generate one from the AgentForms dashboard under Settings > API keys."
  );
  process.exit(1);
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...(init?.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, body.error ?? `Request failed with status ${res.status}`);
  }

  return body as T;
}
