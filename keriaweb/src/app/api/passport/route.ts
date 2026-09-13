// app/api/passport/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Bỏ qua với route GET
            }
          },
        },
      }
    );

    // 1. Kiểm tra user đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { nickname: 'Khách', departureDate: '--/--/----', location: 'Chưa cập nhật' },
        { status: 401 }
      );
    }

    // 2. Query bảng users
    const { data: userData, error: tableError } = await supabase
      .from('users')
      .select('display_name, username, address')
      .eq('id', user.id)
      .maybeSingle();

    if (tableError) {
      console.warn('Lỗi query bảng users:', tableError.message);
    }

    // 3. Format created_at sang DD/MM/YYYY
    const joinDate = user.created_at ? new Date(user.created_at) : null;
    const formattedDepartureDate = joinDate && !isNaN(joinDate.getTime())
      ? joinDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : 'Chưa cập nhật';

    // 4. Ưu tiên display_name -> username -> Google metadata -> email
    const resolvedNickname =
      userData?.display_name ||
      userData?.username ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Chani';

    const resolvedAddress = userData?.address || 'Chưa cập nhật';

    return NextResponse.json({
      nickname: resolvedNickname,
      departureDate: formattedDepartureDate,
      location: resolvedAddress,
    });
  } catch (error: any) {
    console.error('API /api/passport error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}