import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';

// Routes yêu cầu đăng nhập
const PROTECTED_PREFIXES = ['/userProfile', '/hoat-dong'];

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET || process.env.USER_JWT_SECRET || '';
  return new TextEncoder().encode(s);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(AT_COOKIE)?.value;
  const refreshToken = request.cookies.get(RT_COOKIE)?.value;

  // Nếu hoàn toàn không có token nào -> Chuyển hướng sang Login
  if (!token && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
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

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  const res = NextResponse.redirect(loginUrl);
  res.cookies.delete(AT_COOKIE);
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
