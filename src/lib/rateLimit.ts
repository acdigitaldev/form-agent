const hits = new Map<string, number[]>();

/** Best-effort in-memory rate limit (per process). Fine for a single-instance MVP. */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > max;
}
