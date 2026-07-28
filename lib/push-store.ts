export type StoredPushSubscription = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
};

const STORE_KEY = 'raschini:push:subscriptions';
const REDIS_TIMEOUT_MS = 8000;

function config() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_KV_REST_API_TOKEN;

  if (!url || !token) throw new Error('Push storage is not configured');
  return { url: url.replace(/\/$/, ''), token };
}

async function command<T>(args: Array<string | number>): Promise<T> {
  const { url, token } = config();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Redis request failed: ${response.status}`);
    const data = await response.json() as { result: T; error?: string };
    if (data.error) throw new Error(data.error);
    return data.result;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Redis request timed out after ${REDIS_TIMEOUT_MS} ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function saveSubscription(subscription: StoredPushSubscription) {
  await command<number>(['SADD', STORE_KEY, JSON.stringify(subscription)]);
}

export async function listSubscriptions(): Promise<StoredPushSubscription[]> {
  const values = await command<string[]>(['SMEMBERS', STORE_KEY]);
  return (values || []).flatMap((value) => {
    try { return [JSON.parse(value) as StoredPushSubscription]; }
    catch { return []; }
  });
}

export async function removeSubscription(subscription: StoredPushSubscription) {
  await command<number>(['SREM', STORE_KEY, JSON.stringify(subscription)]);
}

export async function pushStorageStatus() {
  const startedAt = Date.now();
  const count = await command<number>(['SCARD', STORE_KEY]);
  return {
    configured: true,
    count: Number(count || 0),
    latencyMs: Date.now() - startedAt,
  };
}
