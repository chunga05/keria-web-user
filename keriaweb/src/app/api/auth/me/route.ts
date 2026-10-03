import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAccessToken, signAccessToken, sha256 } from '@/lib/jwt';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60;
const GRACE_PERIOD_SEC = 30;

export async function GET(request: NextRequest) {
  try {
    let accessToken = request.cookies.get(AT_COOKIE)?.value;
    const authHeader = request.headers.get('Authorization');
    if (!accessToken && authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7).trim();
    }

    let payload = accessToken ? await verifyAccessToken(accessToken) : null;
    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;

    // Nếu access token không có hoặc đã hết hạn, thử refresh tự động bằng refresh token cookie
    if (!payload) {
      const refreshValue = request.cookies.get(RT_COOKIE)?.value;
      if (refreshValue) {
        const tokenHash = await sha256(refreshValue);
        const { data: record } = await supabaseAdmin
          .from('refresh_token_families')
          .select('id, user_id, family_id, token_hash, revoked_at, grace_until, expires_at')
          .eq('token_hash', tokenHash)
          .maybeSingle();

        if (record && new Date(record.expires_at) >= new Date()) {
          // Xử lý grace period hoặc xoay vòng token hợp lệ
          let validUserId: string | null = null;

          if (record.revoked_at) {
            const withinGrace =
              record.grace_until && new Date(record.grace_until) > new Date();
            if (withinGrace) {
              validUserId = record.user_id;
            }
          } else {
            validUserId = record.user_id;
            // Xoay vòng token
            const now = new Date();
            const graceUntil = new Date(now.getTime() + GRACE_PERIOD_SEC * 1000);
            await supabaseAdmin
              .from('refresh_token_families')
              .update({ revoked_at: now.toISOString(), grace_until: graceUntil.toISOString() })
              .eq('token_hash', tokenHash);

            newRefreshToken = crypto.randomUUID();
            const newHash = await sha256(newRefreshToken);
            const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000).toISOString();

            await supabaseAdmin.from('refresh_token_families').insert({
              user_id: record.user_id,
              family_id: record.family_id,
              token_hash: newHash,
              parent_hash: tokenHash,
              expires_at: expiresAt,
            });
          }

          if (validUserId) {
            const { data: userProfile } = await supabaseAdmin
              .from('users')
              .select('role, status')
              .eq('id', validUserId)
              .maybeSingle();

            if (userProfile) {
              newAccessToken = await signAccessToken({
                sub: validUserId,
                role: userProfile.role ?? 'user',
                status: userProfile.status ?? 'pending',
              });
              payload = {
                sub: validUserId,
                role: userProfile.role ?? 'user',
                status: userProfile.status ?? 'pending',
                type: 'access',
              };
            }
          }
        }
      }
    }

    if (!payload?.sub) {
      return NextResponse.json({ user: null });
    }

    // Query chi tiết thông tin user từ DB
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('id, display_name, username, avatar_url, bio, passport_code, status, role, unlocked_frames, equipped_frame, address')
      .eq('id', payload.sub)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ user: null });
    }

    const response = NextResponse.json({
      user: profile,
      access_token: newAccessToken || accessToken,
    });

    if (newAccessToken) {
      response.cookies.set(AT_COOKIE, newAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60,
        path: '/',
      });
    }

    if (newRefreshToken) {
      response.cookies.set(RT_COOKIE, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TTL_SEC,
        path: '/',
      });
    }

    return response;
  } catch (err) {
    console.error('[GET /api/auth/me]', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    let accessToken = request.cookies.get(AT_COOKIE)?.value;
    const authHeader = request.headers.get('Authorization');
    if (!accessToken && authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7).trim();
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload?.sub) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    if (typeof body.display_name === 'string' && body.display_name.trim()) {
      updateData.display_name = body.display_name.trim();
    }
    if ('address' in body) {
      updateData.address = typeof body.address === 'string' ? body.address.trim() || null : null;
    }
    if ('equipped_frame' in body) {
      updateData.equipped_frame = body.equipped_frame || null;
    }

    const { data: updated, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', payload.sub)
      .select('id, display_name, username, avatar_url, bio, passport_code, status, role, unlocked_frames, equipped_frame, address')
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || 'update_failed' }, { status: 400 });
    }

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error('[PATCH /api/auth/me]', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

