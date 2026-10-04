import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { signAccessToken, sha256 } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60; // 7 days

function getRealOrigin(request: Request): string {
  // 1. Ưu tiên biến môi trường cấu hình domain chính thức trên VPS nếu có
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl && !envUrl.includes('0.0.0.0')) {
    return envUrl.replace(/\/$/, '');
  }

  // 2. Lấy từ header proxy (Cloudflare Tunnel, Nginx, Docker...)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost && !forwardedHost.includes('0.0.0.0')) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  // 3. Lấy từ header Host
  const host = request.headers.get('host');
  if (host && !host.includes('0.0.0.0')) {
    const proto =
      request.headers.get('x-forwarded-proto') ||
      (request.url.startsWith('https') ? 'https' : 'http');
    return `${proto}://${host}`;
  }

  // 4. Fallback từ request.url nếu không chứa 0.0.0.0
  try {
    const parsedOrigin = new URL(request.url).origin;
    if (!parsedOrigin.includes('0.0.0.0')) {
      return parsedOrigin;
    }
  } catch {}

  // 5. Fallback an toàn cho local development
  return 'http://localhost:3000';
}

export async function GET(request: Request) {
  const origin = getRealOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    console.error('[auth/callback] Missing code parameter');
    return NextResponse.redirect(`${origin}/?error=auth_missing_code`);
  }

  const cookieStore = await cookies();
  const supabaseCookiesToSet: Array<{ name: string; value: string; options: any }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {}
            supabaseCookiesToSet.push({ name, value, options });
          });
        },
      },
    }
  );

  // Exchange OAuth code for Supabase auth user
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    console.error('[auth/callback] Exchange code failed:', error?.message);
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  const user = data.user;
  const userId = user.id;

  // Lấy thông tin role và status thực tế từ DB
  let { data: profile } = await supabaseAdmin
    .from('users')
    .select('role, status, display_name')
    .eq('id', userId)
    .maybeSingle();

  // Nếu user mới lần đầu đăng nhập mà chưa có record trong bảng public.users:
  if (!profile) {
    const rawMeta = user.user_metadata || {};
    const defaultDisplayName =
      rawMeta.full_name || rawMeta.name || user.email?.split('@')[0] || 'Member';
    const defaultUsername =
      user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${userId.slice(0, 6)}`;

    const { data: newProfile, error: insertErr } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        display_name: defaultDisplayName,
        username: defaultUsername,
        avatar_url: rawMeta.avatar_url || rawMeta.picture || null,
        role: 'user',
        status: 'pending',
      })
      .select('role, status, display_name')
      .single();

    if (!insertErr && newProfile) {
      profile = newProfile;
    }
  }

  const role = profile?.role ?? 'user';
  const status = profile?.status ?? 'pending';

  if (status === 'banned' || status === 'rejected') {
    return NextResponse.redirect(`${origin}/?error=account_${status}`);
  }

  // Issue custom stateless Access Token (15 min)
  const accessToken = await signAccessToken({
    sub: userId,
    role,
    status,
  });

  // Issue Refresh Token (7 days) & lưu hash vào refresh_token_families
  const refreshValue = crypto.randomUUID();
  const familyId = crypto.randomUUID();
  const tokenHash = await sha256(refreshValue);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000).toISOString();

  await supabaseAdmin.from('refresh_token_families').insert({
    user_id: userId,
    family_id: familyId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  // Xác định URL điều hướng tiếp theo:
  let destination = `${origin}${next.startsWith('/') ? next : `/${next}`}`;
  if (next.startsWith('http://') || next.startsWith('https://')) {
    if (next.includes('0.0.0.0')) {
      try {
        const nextUrlObj = new URL(next);
        destination = `${origin}${nextUrlObj.pathname}${nextUrlObj.search}${nextUrlObj.hash}`;
      } catch {
        destination = `${origin}/`;
      }
    } else {
      destination = next;
    }
  }

  const response = NextResponse.redirect(destination);

  // Gắn cookies từ Supabase vào response để supabase.auth.getUser() hoạt động
  supabaseCookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  // Set Access Token cookie (15m, sameSite lax để chia sẻ giữa các port localhost)
  response.cookies.set(AT_COOKIE, accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
    domain: cookieDomain,
  });

  // Set Refresh Token cookie (7d, HttpOnly chống XSS, sameSite lax)
  response.cookies.set(RT_COOKIE, refreshValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TTL_SEC,
    path: '/',
    domain: cookieDomain,
  });

  return response;
}