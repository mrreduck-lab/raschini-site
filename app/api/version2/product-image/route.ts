import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const driveId = request.nextUrl.searchParams.get('driveId');
  const productUrl = request.nextUrl.searchParams.get('url');

  if (driveId) {
    try {
      const source = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}`;
      const image = await fetch(source, {
        headers: { 'User-Agent': 'Mozilla/5.0 Raschini-Campaign/1.0' },
        cache: 'force-cache',
        redirect: 'follow',
      });
      const type = image.headers.get('content-type') || '';
      if (!image.ok || !image.body || !type.startsWith('image/')) {
        return NextResponse.redirect(new URL('/icons/icon-512.png', request.url));
      }
      return new NextResponse(image.body, {
        headers: {
          'Content-Type': type,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        },
      });
    } catch {
      return NextResponse.redirect(new URL('/icons/icon-512.png', request.url));
    }
  }

  if (!productUrl) return new NextResponse('Missing url', { status: 400 });

  let parsed: URL;
  try { parsed = new URL(productUrl); } catch { return new NextResponse('Invalid url', { status: 400 }); }
  if (parsed.hostname !== 'raschini.com' && parsed.hostname !== 'www.raschini.com') {
    return new NextResponse('Forbidden host', { status: 403 });
  }

  try {
    const html = await fetch(parsed.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0 Raschini-Version2/1.0' },
      cache: 'no-store',
    }).then((r) => {
      if (!r.ok) throw new Error(`Product page ${r.status}`);
      return r.text();
    });

    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (!match?.[1]) return NextResponse.redirect(new URL('/icons/icon-512.png', request.url));

    const image = await fetch(match[1], { cache: 'force-cache' });
    if (!image.ok || !image.body) return NextResponse.redirect(new URL('/icons/icon-512.png', request.url));

    return new NextResponse(image.body, {
      headers: {
        'Content-Type': image.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return NextResponse.redirect(new URL('/icons/icon-512.png', request.url));
  }
}
