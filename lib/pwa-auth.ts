import crypto from 'node:crypto';

const TTL_SECONDS = 300;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function b64url(value: Buffer | string) {
  return Buffer.from(value).toString('base64url');
}

function sign(value: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export type WordpressUserAssertion = {
  sub: string;
  name?: string;
  phone?: string;
  discount?: number;
  manager?: { name?: string; phone?: string; whatsapp?: string };
  iat: number;
  exp: number;
};

export function verifyWordpressAssertion(assertion: string): WordpressUserAssertion {
  const [payloadPart, signature] = assertion.split('.');
  if (!payloadPart || !signature) throw new Error('Malformed WordPress assertion');
  const expected = sign(payloadPart, env('PWA_WORDPRESS_SHARED_SECRET'));
  if (!safeEqual(signature, expected)) throw new Error('Invalid WordPress assertion');
  const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as WordpressUserAssertion;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.sub || payload.exp < now || payload.iat > now + 60) throw new Error('Expired WordPress assertion');
  return payload;
}

export function createHandoff(user: WordpressUserAssertion) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    type: 'pwa-handoff',
    jti: crypto.randomUUID(),
    sub: user.sub,
    name: user.name,
    phone: user.phone,
    discount: user.discount,
    manager: user.manager,
    iat: now,
    exp: now + TTL_SECONDS,
  };
  const encoded = b64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, env('PWA_HANDOFF_SECRET'))}`;
}

export function redeemHandoff(token: string) {
  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) throw new Error('Malformed handoff');
  const expected = sign(payloadPart, env('PWA_HANDOFF_SECRET'));
  if (!safeEqual(signature, expected)) throw new Error('Invalid handoff');
  const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as WordpressUserAssertion & { type: string; jti: string };
  const now = Math.floor(Date.now() / 1000);
  if (payload.type !== 'pwa-handoff' || !payload.jti || payload.exp < now) throw new Error('Expired handoff');
  return payload;
}

export function createSession(user: WordpressUserAssertion) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { ...user, type: 'pwa-session', iat: now, exp: now + SESSION_TTL_SECONDS };
  const encoded = b64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, env('PWA_SESSION_SECRET'))}`;
}

export function readSession(token?: string) {
  if (!token) return null;
  try {
    const [payloadPart, signature] = token.split('.');
    if (!payloadPart || !signature) return null;
    const expected = sign(payloadPart, env('PWA_SESSION_SECRET'));
    if (!safeEqual(signature, expected)) return null;
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as WordpressUserAssertion & { type: string };
    if (payload.type !== 'pwa-session' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
