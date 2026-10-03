import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sha256 } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';

export async function POST(request: NextRequest) {
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  // 1. Revoke token family from DB (triệt tiêu toàn bộ grace period)
  const refreshValue = request.cookies.get(RT_COOKIE)?.value;
  if (refreshValue) {
    try {
      const tokenHash = await sha256(refreshValue);
      const { data: record } = await supabaseAdmin
        .from('refresh_token_families')
        .select('family_id')
        .eq('token_hash', tokenHash)
        .maybeSingle();

      if (record?.family_id) {
        await supabaseAdmin
          .from('refresh_token_families')
          .update({
            revoked_at: new Date().toISOString(),
            grace_until: new Date(0).toISOString(),
          })
          .eq('family_id', record.family_id);
      }
    } catch (err) {
      console.error('[logout] Error revoking token family:', err);
    }
  }

  // 2. Sign out from Supabase và bắt các cookie Supabase cần clear
  const cookieStore = await cookies();
  const supabaseCookiesToSet: Array<{ name: string; value: string; options: any }> = [];

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
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
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[logout] Supabase signOut error:', err);
  }

  const res = NextResponse.json({ success: true });

  // 3. Áp dụng cookie clear từ Supabase
  supabaseCookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, {
      ...options,
      maxAge: 0,
      expires: new Date(0),
    });
  });

  // 4. Quét sạch tất cả cookie Supabase (bắt đầu bằng sb-)
  cookieStore.getAll().forEach((c) => {
    if (c.name.startsWith('sb-')) {
      res.cookies.set(c.name, '', { path: '/', maxAge: 0, expires: new Date(0) });
      if (cookieDomain) {
        res.cookies.set(c.name, '', { path: '/', domain: cookieDomain, maxAge: 0, expires: new Date(0) });
      }
    }
  });

  // 5. Xoá triệt để Access Token & Refresh Token (cả host-only và domain)
  const cookiesToClear = [AT_COOKIE, RT_COOKIE, 'dkvn_admin_at', 'dkvn_admin_rt'];
  cookiesToClear.forEach((name) => {
    // Xoá host-only
    res.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      httpOnly: name.includes('rt'),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookies.delete(name);

    // Xoá domain-level nếu có COOKIE_DOMAIN
    if (cookieDomain) {
      res.cookies.set(name, '', {
        path: '/',
        domain: cookieDomain,
        maxAge: 0,
        expires: new Date(0),
        httpOnly: name.includes('rt'),
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      res.cookies.delete({ name, domain: cookieDomain, path: '/' });
    }
  });

  return res;
}
