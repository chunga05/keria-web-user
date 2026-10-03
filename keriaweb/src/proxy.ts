import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { isFeatureEnabled, FEATURES } from '@/config/features';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET || process.env.USER_JWT_SECRET || '';
  return new TextEncoder().encode(s);
}

function buildLoginUrl(request: NextRequest, pathname: string): URL {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const host = forwardedHost || request.headers.get('host');
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  let loginUrl: URL;
  if (envUrl && !envUrl.includes('0.0.0.0')) {
    loginUrl = new URL('/login', envUrl);
  } else if (host && !host.includes('0.0.0.0')) {
    loginUrl = new URL('/login', `${forwardedProto}://${host}`);
  } else {
    loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    if (loginUrl.host.includes('0.0.0.0')) {
      loginUrl.host = 'localhost:3000';
      loginUrl.protocol = 'http:';
    }
  }

  loginUrl.searchParams.set('next', pathname);
  return loginUrl;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isHandbookProtected = isFeatureEnabled(FEATURES.HANDBOOK) && pathname.startsWith('/hoat-dong/so-tay-hanh-trinh');
  const isProtected = pathname.startsWith('/userProfile') || isHandbookProtected;
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(AT_COOKIE)?.value;
  const refreshToken = request.cookies.get(RT_COOKIE)?.value;

  // Nếu hoàn toàn không có token nào -> Chuyển hướng sang Login
  if (!token && !refreshToken) {
    const loginUrl = buildLoginUrl(request, pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu có access token, verify chữ ký
  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // Access token hết hạn nhưng có refresh token -> cho qua để client tự refresh bằng /api/auth/me hoặc /api/auth/refresh
      if (refreshToken) {
        return NextResponse.next();
      }
    }
  }

  // Nếu có refresh token -> cho qua để client thực hiện silent refresh
  if (refreshToken) {
    return NextResponse.next();
  }

  const loginUrl = buildLoginUrl(request, pathname);
  const res = NextResponse.redirect(loginUrl);
  res.cookies.delete(AT_COOKIE);
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
