import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { signAccessToken, sha256 } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60; // 7 days

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    // Verify Supabase session (set by /auth/callback)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Query ACTUAL role & status from DB — never trust JWT claims alone
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role, status')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'profile_not_found' }, { status: 403 });
    }

    // Issue access token (15 min)
    const accessToken = await signAccessToken({
      sub: user.id,
      role: profile.role ?? 'user',
      status: profile.status ?? 'pending',
    });

    // Issue refresh token (7 days)
    const refreshValue = crypto.randomUUID();
    const familyId = crypto.randomUUID();
    const tokenHash = await sha256(refreshValue);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000).toISOString();

    await supabaseAdmin.from('refresh_token_families').insert({
      user_id: user.id,
      family_id: familyId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    const res = NextResponse.json({ access_token: accessToken });

    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

    // Access token cookie — NOT HttpOnly so middleware + JS can read
    res.cookies.set(AT_COOKIE, accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
      domain: cookieDomain,
    });

    // Refresh token cookie — HttpOnly, JS cannot read
    res.cookies.set(RT_COOKIE, refreshValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TTL_SEC,
      path: '/',
      domain: cookieDomain,
    });

    return res;
  } catch (err) {
    console.error('[POST /api/auth/token]', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
