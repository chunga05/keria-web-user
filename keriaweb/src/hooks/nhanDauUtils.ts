import { supabase } from '@/lib/supabase';

export interface ProjectOption {
  id: number;
  title: string;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// ── CẤU HÌNH BẢO MẬT TỆP TIN ────────────────────────────────────────────────
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // Giới hạn 5MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Đọc Magic Bytes (chữ ký nhị phân) để đảm bảo tệp thực sự là hình ảnh,
 * ngăn chặn hành vi đổi đuôi file mã độc (.exe, .html, script shell) thành .png/.jpg.
 */
export async function validateSecureImage(file: File): Promise<ValidationResult> {
  // 1. Kiểm tra dung lượng
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 5MB)!',
    };
  }

  // 2. Kiểm tra phần mở rộng file (extension)
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      message: 'Định dạng đuôi file không hợp lệ! Chỉ chấp nhận JPG, PNG hoặc WEBP.',
    };
  }

  // 3. Kiểm tra MIME Type do trình duyệt cung cấp
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: 'Loại file không được hỗ trợ hoặc có nguy cơ độc hại!',
    };
  }

  // 4. Kiểm tra chữ ký file nhị phân (Magic Bytes)
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    hex = hex.toLowerCase();

    // Chữ ký nhị phân chuẩn của các định dạng ảnh:
    const isJpeg = hex.startsWith('ffd8ff');
    const isPng = hex.startsWith('89504e47');
    // WebP: bắt đầu bằng 'RIFF' (52494646) và có 'WEBP' (57454250) ở byte thứ 8-11
    const isWebp = hex.startsWith('52494646') && hex.slice(16, 24) === '57454250';

    if (!isJpeg && !isPng && !isWebp) {
      return {
        valid: false,
        message: 'Nội dung file bị sửa đổi hoặc chứa dữ liệu thực thi không an toàn!',
      };
    }
  } catch {
    return {
      valid: false,
      message: 'Không thể phân tích dữ liệu tệp tin!',
    };
  }

  return { valid: true };
}

/**
 * Lấy danh sách các dự án đang hoạt động từ Supabase
 */
export async function fetchActiveProjects(): Promise<ProjectOption[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title')
    .eq('is_active', true)
    .order('id', { ascending: false });

  if (error) {
    console.error('Lỗi lấy danh sách dự án:', error.message);
    return [];
  }

  return data || [];
}