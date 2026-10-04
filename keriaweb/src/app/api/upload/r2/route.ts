import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/jwt';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB giới hạn cho User
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * POST /api/upload/r2
 *
 * Route trung gian tại User Web:
 * - Xác thực người dùng (Authentication)
 * - Gọi Admin API (/api/upload/presign) để nhận Presigned URL
 * - User Web hoàn toàn KHÔNG cần lưu trữ R2_ACCESS_KEY_ID hay R2_SECRET_ACCESS_KEY!
 */
export async function POST(request: Request) {
  try {
    // 1. KIỂM TRA XÁC THỰC NGƯỜI DÙNG (AUTHENTICATION)
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('dkvn_at')?.value;
    const authHeader = request.headers.get('authorization');
    if (!accessToken && authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7).trim();
    }

    let userId: string | null = null;
    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload?.sub) {
        userId = payload.sub;
      }
    }

    // Fallback sang Supabase auth nếu không có custom JWT
    if (!userId) {
      const supabaseUser = await createClient();
      const {
        data: { user },
      } = await supabaseUser.auth.getUser();
      if (user?.id) {
        userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập trước khi tải ảnh lên!' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('status')
      .eq('id', userId)
      .maybeSingle();

    if (profile && (profile.status === 'banned' || profile.status === 'rejected')) {
      return NextResponse.json(
        { error: 'Tài khoản của bạn đã bị khóa hoặc từ chối.' },
        { status: 403 }
      );
    }

    const adminBaseUrl = (
      process.env.ADMIN_URL ||
      process.env.NEXT_PUBLIC_ADMIN_URL ||
      'http://localhost:3001'
    ).replace(/\/$/, '');

    const contentTypeHeader = request.headers.get('content-type') || '';

    // ============================================================
    // TRƯỜNG HỢP A: Client yêu cầu Presigned URL (application/json)
    // ============================================================
    if (contentTypeHeader.includes('application/json')) {
      const body = await request.json();
      const { filename, contentType, size } = body;

      if (!filename || typeof filename !== 'string') {
        return NextResponse.json(
          { error: 'Thiếu tên tệp tin (filename)!' },
          { status: 400 }
        );
      }

      const ext = filename.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: 'Chỉ chấp nhận file hình ảnh định dạng JPG, PNG hoặc WEBP!' },
          { status: 400 }
        );
      }

      if (size && Number(size) > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 10MB)!' },
          { status: 400 }
        );
      }

      // Gửi yêu cầu xin Presigned URL sang Admin API
      const presignRes = await fetch(`${adminBaseUrl}/api/upload/presign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          filename,
          contentType: contentType || 'image/jpeg',
          folder: 'proofs',
          size,
        }),
      });

      if (!presignRes.ok) {
        const errorData = await presignRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.error || 'Không thể tạo Presigned URL từ Admin Service.' },
          { status: presignRes.status }
        );
      }

      const presignData = await presignRes.json();
      return NextResponse.json(presignData);
    }

    // ============================================================
    // TRƯỜNG HỢP B: Client gửi trực tiếp FormData (multipart/form-data)
    // ============================================================
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file tải lên!' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 10MB)!' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext) || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận file hình ảnh định dạng JPG, PNG hoặc WEBP!' },
        { status: 400 }
      );
    }

    // 1. Xin Presigned URL từ Admin API
    const presignRes = await fetch(`${adminBaseUrl}/api/upload/presign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        folder: 'proofs',
        size: file.size,
      }),
    });

    if (!presignRes.ok) {
      const errorData = await presignRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Lỗi khi yêu cầu cấp phép tải ảnh từ Admin Service.' },
        { status: presignRes.status }
      );
    }

    const { uploadUrl, publicUrl } = await presignRes.json();

    // 2. Tải tệp trực tiếp lên R2 thông qua Presigned PUT URL
    const fileBuffer = await file.arrayBuffer();
    const r2UploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: fileBuffer,
    });

    if (!r2UploadRes.ok) {
      return NextResponse.json(
        { error: `Tải ảnh lên R2 qua Presigned URL thất bại (HTTP ${r2UploadRes.status})` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, publicUrl });
  } catch (err: any) {
    console.error('Lỗi upload server-side:', err);
    return NextResponse.json(
      { error: err?.message || 'Lỗi xử lý tải ảnh trên máy chủ' },
      { status: 500 }
    );
  }
}