import { NextRequest, NextResponse } from 'next/server';
import { createSession, redeemHandoff } from '@/lib/pwa-auth';
import { consumeHandoff } from '@/lib/pwa-handoff-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { handoff } = await request.json() as { handoff?: string };
    if (!handoff) return NextResponse.json({ error: 'Missing handoff' }, { status: 400 });

    const user = redeemHandoff(handoff);
    const now = Math.floor(Date.now() / 1000);
    const accepted = await consumeHandoff(user.jti, Math.max(1, user.exp - now));
    if (!accepted) return NextResponse.json({ error: 'Handoff already used' }, { status: 409 });

    const response = NextResponse.json({ ok: true, user: { sub: user.sub, name: user.name, discount: user.discount, manager: user.manager } });
    response.cookies.set('raschini_pwa_session', createSession(user), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error('PWA handoff redeem failed', error);
    return NextResponse.json({ error: 'Invalid or expired handoff' }, { status: 401 });
  }
}
