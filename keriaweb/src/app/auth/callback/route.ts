import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Bỏ qua lỗi này nếu hàm được gọi từ Server Component
            }
          },
        },
      }
    )

    // Đổi code lấy session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Xác thực thành công -> quay về trang trước đó
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      // In lỗi ra terminal để debug
      console.error("LỖI ĐỔI CODE SUPABASE:", error.message)
    }
  } else {
    console.error("LỖI URL:", "Không tìm thấy tham số 'code' trên URL trả về")
  }

  // Đã sửa: Nếu có lỗi, đẩy tạm về trang chủ (hoặc một trang nào đó chắc chắn tồn tại) 
  // kèm theo một tham số error để bạn biết đăng nhập thất bại, tránh lỗi 404.
  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}