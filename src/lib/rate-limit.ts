import { getRequest } from "@tanstack/react-start/server";

const buckets = new Map<string, { count: number; resetAt: number }>();
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanupStale() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

function getClientIp(): string {
  try {
    const request = getRequest();
    return (
      request?.headers.get("cf-connecting-ip") ??
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request?.headers.get("x-real-ip") ??
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

/**
 * Throws if the caller has exceeded `maxRequests` within `windowMs`
 * for the given `action` namespace. Keyed by client IP.
 */
export function rateLimit(action: string, maxRequests: number, windowMs: number): void {
  cleanupStale();

  const ip = getClientIp();
  const key = `${action}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= maxRequests) {
    throw new Error("Too many requests — please try again later.");
  }

  bucket.count++;
}
