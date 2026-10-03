import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sha256 } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const AT_COOKIE = 'dkvn_at';
const RT_COOKIE = 'dkvn_rt';

export async function POST(request: NextRequest) {
  // Revoke token family from DB
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
          .update({ revoked_at: new Date().toISOString() })
          .eq('family_id', record.family_id)
          .is('revoked_at', null);
      }
    } catch (err) {
      console.error('[logout] Error revoking token family:', err);
    }
  }

  // Also sign out from Supabase (clears Supabase session cookie)
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
    await supabase.auth.signOut();
  } catch { /* best effort */ }

  const res = NextResponse.json({ success: true });
  res.cookies.delete(AT_COOKIE);
  res.cookies.delete(RT_COOKIE);
  return res;
}
