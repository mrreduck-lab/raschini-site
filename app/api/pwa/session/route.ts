import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/lib/pwa-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = readSession(request.cookies.get('raschini_pwa_session')?.value);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    user: {
      sub: session.sub,
      name: session.name,
      phone: session.phone,
      discount: session.discount,
      manager: session.manager,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('raschini_pwa_session', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
