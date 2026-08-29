import 'server-only';

// ---------------------------------------------------------------------------
// In-Memory Sliding-Window Rate Limiter
// ---------------------------------------------------------------------------
// Lightweight IP-based rate limiter that doesn't require external services.
// Uses a sliding window approach: tracks timestamps of recent requests per IP
// and rejects requests that exceed the configured limit within the window.
//
// Note: In-memory state is lost on redeploy and not shared across serverless
// instances. For stricter enforcement at scale, consider Upstash Redis or
// Vercel KV. This is sufficient for basic abuse prevention on a portfolio site.
// ---------------------------------------------------------------------------

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 12;     // 12 messages per minute per IP

type RequestLog = {
  timestamps: number[];
};

const ipRequestMap = new Map<string, RequestLog>();

// Periodically clean up stale entries to prevent unbounded memory growth
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Every 5 minutes
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, log] of ipRequestMap.entries()) {
    // Remove timestamps outside the window
    log.timestamps = log.timestamps.filter((t) => now - t < windowMs);
    if (log.timestamps.length === 0) {
      ipRequestMap.delete(ip);
    }
  }
}

/**
 * Check if a request from the given IP should be rate-limited.
 * Returns `{ allowed: true }` if the request is within limits,
 * or `{ allowed: false, retryAfterMs }` if the IP has exceeded the limit.
 */
export function checkRateLimit(
  ip: string,
  {
    windowMs = DEFAULT_WINDOW_MS,
    maxRequests = DEFAULT_MAX_REQUESTS,
  }: { windowMs?: number; maxRequests?: number } = {}
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();

  // Lazy cleanup
  cleanupStaleEntries(windowMs);

  let log = ipRequestMap.get(ip);
  if (!log) {
    log = { timestamps: [] };
    ipRequestMap.set(ip, log);
  }

  // Remove timestamps outside the sliding window
  log.timestamps = log.timestamps.filter((t) => now - t < windowMs);

  if (log.timestamps.length >= maxRequests) {
    // Calculate when the earliest request in the window expires
    const oldestInWindow = log.timestamps[0];
    const retryAfterMs = windowMs - (now - oldestInWindow);
    return { allowed: false, retryAfterMs };
  }

  // Allow the request and record it
  log.timestamps.push(now);
  return { allowed: true };
}
