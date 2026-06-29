type Bucket = {
  count: number;
  firstRequest: number;
};

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const LIMIT = 10;

export function throttleRequest(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.firstRequest > WINDOW_MS) {
    buckets.set(key, { count: 1, firstRequest: now });
    return { allowed: true, remaining: LIMIT - 1, resetAt: now + WINDOW_MS };
  }

  if (bucket.count >= LIMIT) {
    return { allowed: false, remaining: 0, resetAt: bucket.firstRequest + WINDOW_MS };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return { allowed: true, remaining: LIMIT - bucket.count, resetAt: bucket.firstRequest + WINDOW_MS };
}
