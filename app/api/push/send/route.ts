import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { listSubscriptions, removeSubscription } from '@/lib/push-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

  const body = await request.json() as { title?: string; body?: string; url?: string };
  const payload = JSON.stringify({
    title: body.title || 'Новая летняя коллекция Raschini',
    body: body.body || 'Неаполитанская лёгкость и новые образы уже доступны онлайн.',
    url: body.url || 'https://raschini.com/new/',
    icon: '/IMG_4803.png',
  });

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const subscriptions = await listSubscriptions();
  let sent = 0;
  let removed = 0;

  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription as webpush.PushSubscription, payload);
      sent += 1;
    } catch (error: unknown) {
      const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
        ? Number((error as { statusCode?: unknown }).statusCode)
        : undefined;

      if (statusCode === 404 || statusCode === 410) {
        await removeSubscription(subscription);
        removed += 1;
      } else {
        console.error('Push send failed', error);
      }
    }
  }));

  return NextResponse.json({ ok: true, total: subscriptions.length, sent, removed });
}
