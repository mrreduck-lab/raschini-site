import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { listSubscriptions, removeSubscription } from '@/lib/push-store';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const PUSH_TIMEOUT_MS = 12000;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function statusCodeOf(error: unknown) {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    return Number((error as { statusCode?: unknown }).statusCode);
  }
  return undefined;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs} ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const token = request.headers.get('x-admin-token');
  if (!process.env.PUSH_ADMIN_TOKEN || token !== process.env.PUSH_ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:info@raschini.com';
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: 'VAPID is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json() as { title?: string; body?: string; url?: string };
    const payload = JSON.stringify({
      title: body.title || 'Новая летняя коллекция Raschini',
      body: body.body || 'Неаполитанская лёгкость и новые образы уже доступны онлайн.',
      url: body.url || 'https://raschini.com/new/',
      icon: '/IMG_4803.png',
    });

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const redisStartedAt = Date.now();
    const subscriptions = await listSubscriptions();
    const redisLatencyMs = Date.now() - redisStartedAt;

    let sent = 0;
    let removed = 0;
    const failures: Array<{ endpoint: string; statusCode?: number; error: string }> = [];

    for (const subscription of subscriptions) {
      try {
        await withTimeout(
          webpush.sendNotification(subscription as webpush.PushSubscription, payload),
          PUSH_TIMEOUT_MS,
          'Push delivery',
        );
        sent += 1;
      } catch (error: unknown) {
        const statusCode = statusCodeOf(error);
        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(subscription);
          removed += 1;
        } else {
          failures.push({
            endpoint: subscription.endpoint.slice(0, 80),
            statusCode,
            error: errorMessage(error),
          });
          console.error('Push send failed', { statusCode, error });
        }
      }
    }

    return NextResponse.json({
      ok: failures.length === 0,
      total: subscriptions.length,
      sent,
      removed,
      failed: failures.length,
      failures,
      redisLatencyMs,
      durationMs: Date.now() - startedAt,
    }, { status: failures.length ? 207 : 200 });
  } catch (error: unknown) {
    console.error('Push send route failed', error);
    return NextResponse.json({
      error: errorMessage(error),
      durationMs: Date.now() - startedAt,
    }, { status: 500 });
  }
}
