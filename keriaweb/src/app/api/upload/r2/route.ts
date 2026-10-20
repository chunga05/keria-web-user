import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken, signAccessToken } from '@/lib/jwt';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB giới hạn cho User
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Đọc thông báo lỗi từ Admin Service một cách an toàn
 */
async function parseAdminError(response: Response, defaultMsg: string): Promise<string> {
  try {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      if (json?.error && typeof json.error === 'string') {
        return json.error;
      }
    } catch {
      // Trường hợp phản hồi HTML hoặc chuỗi text
      if (text) {
        const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
        if (cleanText) {
          return `Admin Service phản hồi (${response.status}): ${cleanText.slice(0, 150)}`;
        }
      }
    }
  } catch {}
  return defaultMsg;
}

/**
 * POST /api/upload/r2
 *
 * Route trung gian tại User Web:
 * - Xác thực người dùng (Authentication)
 * - Gọi Admin API (/api/upload/presign) để nhận Presigned URL
 * - Tải file lên Cloudflare R2 thông qua Presigned URL nhận được
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

    // Fallback sang Supabase auth nếu không có custom JWT hoặc JWT đã hết hạn
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
      .select('status, role')
      .eq('id', userId)
      .maybeSingle();

    if (profile && (profile.status === 'banned' || profile.status === 'rejected')) {
      return NextResponse.json(
        { error: 'Tài khoản của bạn đã bị khóa hoặc từ chối.' },
        { status: 403 }
      );
    }

    // Sinh token xác thực hợp lệ để gửi sang Admin API (đảm bảo không bị thiếu hoặc expired)
    const serviceToken = await signAccessToken({
      sub: userId,
      role: profile?.role || 'user',
      status: profile?.status || 'approved',
    });

    const adminBaseUrl = (
      process.env.ADMIN_URL ||
      process.env.NEXT_PUBLIC_ADMIN_URL ||
      'https://admin.dearkeriavn.com'
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
          Authorization: `Bearer ${serviceToken}`,
        },
        redirect: 'manual',
        body: JSON.stringify({
          filename,
          contentType: contentType || 'image/jpeg',
          folder: 'proofs',
          size,
        }),
      });

      if (presignRes.status >= 300 && presignRes.status < 400) {
        return NextResponse.json(
          { error: `Admin Service chuyển hướng không hợp lệ (HTTP ${presignRes.status}).` },
          { status: 502 }
        );
      }

      if (!presignRes.ok) {
        const errorMsg = await parseAdminError(
          presignRes,
          'Không thể tạo Presigned URL từ Admin Service.'
        );
        return NextResponse.json(
          { error: errorMsg },
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

    const fileType = file.type || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');

    // 1. Xin Presigned URL từ Admin API
    const presignRes = await fetch(`${adminBaseUrl}/api/upload/presign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceToken}`,
      },
      redirect: 'manual',
      body: JSON.stringify({
        filename: file.name,
        contentType: fileType,
        folder: 'proofs',
        size: file.size,
      }),
    });

    if (presignRes.status >= 300 && presignRes.status < 400) {
      return NextResponse.json(
        { error: `Admin Service chuyển hướng không hợp lệ (HTTP ${presignRes.status}).` },
        { status: 502 }
      );
    }

    if (!presignRes.ok) {
      const errorMsg = await parseAdminError(
        presignRes,
        'Lỗi khi yêu cầu cấp phép tải ảnh từ Admin Service.'
      );
      return NextResponse.json(
        { error: errorMsg },
        { status: presignRes.status }
      );
    }

    const { uploadUrl, publicUrl } = await presignRes.json();

    // 2. Tải tệp trực tiếp lên R2 thông qua Presigned PUT URL
    const fileBuffer = await file.arrayBuffer();
    const r2UploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
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
