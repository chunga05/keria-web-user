import { NextRequest, NextResponse } from 'next/server';
import { signAccessToken, sha256 } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60;
const GRACE_PERIOD_SEC = 30;

function clearAuthCookies(res: NextResponse) {
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  const names = [AT_COOKIE, RT_COOKIE, 'dkvn_admin_at', 'dkvn_admin_rt'];
  names.forEach((name) => {
    res.cookies.set(name, '', { path: '/', maxAge: 0, expires: new Date(0) });
    res.cookies.delete(name);
    if (cookieDomain) {
      res.cookies.set(name, '', { path: '/', domain: cookieDomain, maxAge: 0, expires: new Date(0) });
      res.cookies.delete({ name, domain: cookieDomain, path: '/' });
    }
  });
  return res;
}

export async function POST(request: NextRequest) {
  try {
    const refreshValue = request.cookies.get(RT_COOKIE)?.value;
    if (!refreshValue) {
      return NextResponse.json({ error: 'no_refresh_token' }, { status: 401 });
    }

    const tokenHash = await sha256(refreshValue);

    // Tìm trong DB
    const { data: record, error: lookupErr } = await supabaseAdmin
      .from('refresh_token_families')
      .select('id, user_id, family_id, token_hash, revoked_at, grace_until, expires_at')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (lookupErr || !record) {
      return clearAuthCookies(
        NextResponse.json({ error: 'invalid_token' }, { status: 401 })
      );
    }

    // Kiểm tra hết hạn
    if (new Date(record.expires_at) < new Date()) {
      return clearAuthCookies(
        NextResponse.json({ error: 'token_expired' }, { status: 401 })
      );
    }

    // Token đã bị thu hồi
    if (record.revoked_at) {
      const withinGrace =
        record.grace_until && new Date(record.grace_until) > new Date();

      if (withinGrace) {
        // RACE CONDITION GRACE: cấp lại Access Token trong thời gian ân hạn 30s
        const { data: latest } = await supabaseAdmin
          .from('refresh_token_families')
          .select('user_id')
          .eq('family_id', record.family_id)
          .is('revoked_at', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latest) {
          const { data: profile } = await supabaseAdmin
            .from('users')
            .select('role, status')
            .eq('id', latest.user_id)
            .maybeSingle();

          if (profile) {
            const at = await signAccessToken({
              sub: latest.user_id,
              role: profile.role ?? 'user',
              status: profile.status ?? 'pending',
            });
            const gracRes = NextResponse.json({ access_token: at });
            gracRes.cookies.set(AT_COOKIE, at, {
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 15 * 60,
              path: '/',
            });
            return gracRes;
          }
        }
      }

      // REUSE DETECTED: Phát hiện token cũ bị dùng lại -> Thu hồi toàn bộ token family ngay lập tức!
      await supabaseAdmin
        .from('refresh_token_families')
        .update({ revoked_at: new Date().toISOString() })
        .eq('family_id', record.family_id)
        .is('revoked_at', null);

      return clearAuthCookies(
        NextResponse.json({ error: 'token_reuse_detected' }, { status: 401 })
      );
    }

    // Token hợp lệ — Verify lại role & status thực tế trong Database
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role, status')
      .eq('id', record.user_id)
      .maybeSingle();

    if (!profile) {
      return clearAuthCookies(
        NextResponse.json({ error: 'user_not_found' }, { status: 401 })
      );
    }

    // Thu hồi token cũ và đặt grace window (30s)
    const now = new Date();
    const graceUntil = new Date(now.getTime() + GRACE_PERIOD_SEC * 1000);
    await supabaseAdmin
      .from('refresh_token_families')
      .update({
        revoked_at: now.toISOString(),
        grace_until: graceUntil.toISOString(),
      })
      .eq('token_hash', tokenHash);

    // Cấp Refresh Token mới & Access Token mới (Token Rotation)
    const newRefreshValue = crypto.randomUUID();
    const newHash = await sha256(newRefreshValue);
    const expiresAt = new Date(
      Date.now() + REFRESH_TTL_SEC * 1000
    ).toISOString();

    await supabaseAdmin.from('refresh_token_families').insert({
      user_id: record.user_id,
      family_id: record.family_id,
      token_hash: newHash,
      parent_hash: tokenHash,
      expires_at: expiresAt,
    });

    const newAT = await signAccessToken({
      sub: record.user_id,
      role: profile.role ?? 'user',
      status: profile.status ?? 'pending',
    });

    const res = NextResponse.json({ access_token: newAT });
    res.cookies.set(AT_COOKIE, newAT, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });
    res.cookies.set(RT_COOKIE, newRefreshValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TTL_SEC,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('[POST /api/auth/refresh]', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
