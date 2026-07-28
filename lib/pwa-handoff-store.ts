const PREFIX = 'raschini:pwa:handoff:used:';

function first(names: string[]) {
  for (const name of names) if (process.env[name]) return process.env[name];
}

function config() {
  const url = first(['UPSTASH_REDIS_REST_URL','UPSTASH_REST_API_URL','UPSTASH_KV_REST_API_URL','KV_REST_API_URL','STORAGE_REST_API_URL']);
  const token = first(['UPSTASH_REDIS_REST_TOKEN','UPSTASH_REST_API_TOKEN','UPSTASH_KV_REST_API_TOKEN','KV_REST_API_TOKEN','STORAGE_REST_API_TOKEN']);
  if (!url || !token) throw new Error('Redis is not configured for PWA handoff');
  return { url: url.replace(/\/$/, ''), token };
}

async function command<T>(args: Array<string | number>) {
  const { url, token } = config();
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Redis request failed: ${response.status}`);
  const data = await response.json() as { result: T; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function consumeHandoff(jti: string, ttlSeconds: number) {
  const result = await command<string | null>(['SET', `${PREFIX}${jti}`, '1', 'NX', 'EX', ttlSeconds]);
  return result === 'OK';
}
