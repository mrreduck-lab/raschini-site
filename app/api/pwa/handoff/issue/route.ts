import { NextRequest, NextResponse } from 'next/server';
import { createHandoff, verifyWordpressAssertion } from '@/lib/pwa-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { assertion } = await request.json() as { assertion?: string };
    if (!assertion) return NextResponse.json({ error: 'Missing assertion' }, { status: 400 });
    const user = verifyWordpressAssertion(assertion);
    const handoff = createHandoff(user);
    return NextResponse.json({ handoff, expiresIn: 300 });
  } catch (error) {
    console.error('PWA handoff issue failed', error);
    return NextResponse.json({ error: 'Unable to issue handoff' }, { status: 401 });
  }
}
